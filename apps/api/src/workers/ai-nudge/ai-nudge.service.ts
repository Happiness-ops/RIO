import { Injectable, Logger } from '@nestjs/common';
import { subDays, getISOWeek, getYear } from 'date-fns';
import { PrismaService } from '@/shared/prisma.service';
import { RedisService } from '@/shared/redis.service';
import { GeminiService } from './gemini.service';
import { WebPushService } from '@/notifications/web-push.service';
import { TriggerType } from '@prisma/client';

// Epic 7 — eligibility thresholds before personalised AI insights begin
const MIN_CHECKINS_FOR_AI   = 5;
const MIN_ACTIVE_DAYS_FOR_AI = 3;

@Injectable()
export class AiNudgeService {
  private readonly logger = new Logger(AiNudgeService.name);

  constructor(
    private readonly prisma:   PrismaService,
    private readonly redis:    RedisService,
    private readonly gemini:   GeminiService,
    private readonly webPush:  WebPushService,
  ) {}

  // ── Users at 6 AM local time (unchanged) ─────────────────────────────────
  async getUsersAt6AM(): Promise<{ id: string; timezone: string }[]> {
    return this.prisma.$queryRaw<{ id: string; timezone: string }[]>`
      SELECT u.id, u.timezone
      FROM users u
      JOIN user_profiles p ON p."userId" = u.id
      WHERE u."isVerified" = true
        AND p."onboardingCompleted" = true
        AND EXTRACT(HOUR   FROM NOW() AT TIME ZONE u.timezone) = 6
        AND EXTRACT(MINUTE FROM NOW() AT TIME ZONE u.timezone) < 30
    `;
  }

  // ── Main entry: generate insight for a single user ────────────────────────
  async generateInsightForUser(userId: string): Promise<TriggerType | null> {
    const [profile, habits] = await Promise.all([
      this.prisma.userProfile.findUnique({
        where:  { userId },
        select: { fullName: true, identityStatement: true, selectedPillars: true },
      }),
      this.prisma.habit.findMany({
        where:   { userId, isArchived: false },
        include: {
          streak:   true,
          checkins: {
            where:   { logDate: { gte: subDays(new Date(), 14) } },
            orderBy: { logDate: 'desc' },
          },
        },
      }),
    ]);

    if (habits.length === 0) return null;

    // ── Epic 7: Eligibility gate ──────────────────────────────────────────
    const isEligible = await this.checkEligibility(userId, habits);
    const triggerType = isEligible
      ? this.evaluateTrigger(habits)
      : TriggerType.educational;

    const topHabit          = this.getTopHabit(habits);
    const allCheckins7d     = habits.flatMap((h) => h.checkins.filter(
      (c) => new Date(c.logDate) >= subDays(new Date(), 7),
    ));
    const completed7d       = allCheckins7d.filter((c) => c.status === 'completed').length;
    const completionRate    = allCheckins7d.length
      ? Math.round((completed7d / allCheckins7d.length) * 100) : 0;

    const keystoneHabit     = habits.find((h) => h.isKeystone);

    // ── Generate content via Gemini ───────────────────────────────────────
    const content = await this.gemini.generateInsight({
      userName:                profile?.fullName?.split(' ')[0] ?? 'there',
      identityStatement:       profile?.identityStatement ?? null,
      triggerType,
      topHabit:                topHabit.title,
      keystoneHabit:           keystoneHabit?.title ?? null,
      currentStreak:           topHabit.streak?.currentStreak ?? 0,
      longestStreak:           topHabit.streak?.longestStreak ?? 0,
      completionRateLast7Days: completionRate,
      isEligible,
    });

    await this.prisma.aiInsight.create({
      data: { userId, triggerType, headline: content.headline, message: content.message, cta: content.cta },
    });

    // ── Send push ─────────────────────────────────────────────────────────
    const subs = await this.prisma.userPushSubscription.findMany({ where: { userId } });
    if (subs.length > 0) {
      await this.webPush.sendToUser(
        subs.map((s) => ({ id: s.id, endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth })),
        { title: content.headline, body: content.message, tag: 'daily-insight', data: { type: 'insight', url: '/insights' } },
        async (staleId) => { await this.prisma.userPushSubscription.delete({ where: { id: staleId } }); },
      );
    }

    // ── Epic 5.3: Write weekly review on Sundays ──────────────────────────
    const today = new Date();
    if (today.getDay() === 0) {  // Sunday
      await this.writeWeeklyReview(userId, habits);
    }

    return triggerType;
  }

  // ── Epic 7: Eligibility check — ≥5 checkins AND ≥3 active days ───────────
  private async checkEligibility(userId: string, habits: any[]): Promise<boolean> {
    const allCheckins = habits.flatMap((h) => h.checkins);
    const completedCheckins = allCheckins.filter((c) => c.status === 'completed');

    if (completedCheckins.length < MIN_CHECKINS_FOR_AI) return false;

    // Count distinct active days (days with at least one completed check-in)
    const activeDays = new Set(
      completedCheckins.map((c) => new Date(c.logDate).toISOString().split('T')[0]),
    );
    return activeDays.size >= MIN_ACTIVE_DAYS_FOR_AI;
  }

  // ── Epic 7: Full trigger evaluation — priority order ─────────────────────
  evaluateTrigger(habits: any[]): TriggerType {
    const today      = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday  = subDays(today, 1);
    const twoDaysAgo = subDays(today, 2);

    // Rule 1 (HIGHEST): Two-day risk — missed yesterday AND today not yet checked in
    // This is the most urgent — prevent the two-miss pattern that kills streaks
    const hasTwoDayRisk = habits.some((h) => {
      const streak    = h.streak;
      if (!streak?.lastCheckinDate) return false;
      const lastDate  = new Date(streak.lastCheckinDate); lastDate.setHours(0, 0, 0, 0);
      const checkedToday = h.checkins.some((c: any) => {
        const d = new Date(c.logDate); d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime() && c.status === 'completed';
      });
      // Missed yesterday and not yet checked in today
      return lastDate.getTime() <= twoDaysAgo.getTime() && !checkedToday;
    });
    if (hasTwoDayRisk) return TriggerType.two_day_risk;

    // Rule 2: Streak at risk — has streak but missed yesterday
    const hasStreakAtRisk = habits.some((h) => {
      if ((h.streak?.currentStreak ?? 0) === 0) return false;
      const last = h.streak?.lastCheckinDate ? new Date(h.streak.lastCheckinDate) : null;
      if (!last) return false;
      last.setHours(0, 0, 0, 0);
      return last.getTime() < yesterday.getTime();
    });
    if (hasStreakAtRisk) return TriggerType.streak_risk;

    // Rule 3: Streak recovery — streak just reset within 48hrs
    const isRecovering = habits.some((h) => {
      if ((h.streak?.currentStreak ?? 0) !== 0) return false;
      const last = h.streak?.lastCheckinDate ? new Date(h.streak.lastCheckinDate) : null;
      if (!last) return false;
      last.setHours(0, 0, 0, 0);
      return last.getTime() >= twoDaysAgo.getTime();
    });
    if (isRecovering) return TriggerType.streak_recovery;

    // Rule 4: Completion drop-off — 7-day rate < 50%
    const recent7d    = habits.flatMap((h) => h.checkins.filter(
      (c: any) => new Date(c.logDate) >= subDays(today, 7),
    ));
    const rate        = recent7d.length ? recent7d.filter((c: any) => c.status === 'completed').length / recent7d.length : 1;
    if (rate < 0.5 && recent7d.length >= 3) return TriggerType.completion_dropoff;

    // Rule 5: Pillar imbalance — any pillar with habits but 0 completions this week
    const weekStart   = this.getMonday(today);
    const pillarMap   = new Map<string, number>();
    for (const h of habits) {
      if (!h.pillar) continue;
      const weekCompletions = h.checkins.filter((c: any) => {
        const d = new Date(c.logDate); d.setHours(0, 0, 0, 0);
        return d >= weekStart && c.status === 'completed';
      }).length;
      pillarMap.set(h.pillar, (pillarMap.get(h.pillar) ?? 0) + weekCompletions);
    }
    const hasPillarImbalance = [...pillarMap.values()].some((count) => count === 0);
    if (hasPillarImbalance) return TriggerType.pillar_imbalance;

    // Rule 6: Momentum — any habit has 5+ consecutive days
    const hasMomentum = habits.some((h) => (h.streak?.currentStreak ?? 0) >= 5);
    if (hasMomentum) return TriggerType.momentum;

    // Rule 7: Weekly reflection — Sundays only
    if (new Date().getDay() === 0) return TriggerType.weekly_reflection;

    return TriggerType.fallback;
  }

  // ── Epic 5.3: Write weekly review to DB (called every Sunday at 6AM) ─────
  async writeWeeklyReview(userId: string, habits: any[]) {
    const now       = new Date();
    const weekLabel = `${getYear(now)}-W${String(getISOWeek(now)).padStart(2, '0')}`;

    const weekStart = this.getMonday(now);
    const allCheckins = habits.flatMap((h) => h.checkins.filter((c: any) => {
      const d = new Date(c.logDate); d.setHours(0, 0, 0, 0);
      return d >= weekStart;
    }));

    const pillarMap: Record<string, { total: number; completed: number }> = {};
    for (const h of habits) {
      const p = h.pillar ?? 'uncategorised';
      if (!pillarMap[p]) pillarMap[p] = { total: 0, completed: 0 };
    }
    for (const c of allCheckins) {
      const habit = habits.find((h) => h.id === c.habitId);
      const p     = habit?.pillar ?? 'uncategorised';
      if (!pillarMap[p]) pillarMap[p] = { total: 0, completed: 0 };
      pillarMap[p].total++;
      if (c.status === 'completed') pillarMap[p].completed++;
    }

    const today        = new Date(); today.setHours(0, 0, 0, 0);
    const daysSoFar    = Math.max(1, Math.round((today.getTime() - weekStart.getTime()) / 86_400_000) + 1);
    const totalSlots   = habits.length * daysSoFar;
    const completedAll = allCheckins.filter((c: any) => c.status === 'completed').length;
    const score        = totalSlots > 0 ? Math.round((completedAll / totalSlots) * 100) : 0;

    const breakdown    = Object.entries(pillarMap).map(([pillar, d]) => ({
      pillar, total: d.total, completed: d.completed,
      rate: d.total ? Math.round((d.completed / d.total) * 100) : 0,
    })).filter((p) => p.pillar !== 'uncategorised');

    const sorted    = [...breakdown].sort((a, b) => b.rate - a.rate);
    const best      = sorted[0]?.pillar ?? null;
    const weakest   = sorted[sorted.length - 1]?.pillar ?? null;

    await this.prisma.weeklyReview.upsert({
      where:  { userId_weekLabel: { userId, weekLabel } },
      create: { userId, weekLabel, consistencyScore: score, bestPillar: best as any, weakestPillar: weakest as any, pillarBreakdown: breakdown },
      update: { consistencyScore: score, bestPillar: best as any, weakestPillar: weakest as any, pillarBreakdown: breakdown },
    });

    await this.redis.del(`analytics:weekly-review:${userId}`);
  }

  private getTopHabit(habits: any[]) {
    return [...habits].sort(
      (a, b) => (b.streak?.currentStreak ?? 0) - (a.streak?.currentStreak ?? 0),
    )[0];
  }

  private getMonday(date: Date): Date {
    const d   = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
    d.setHours(0, 0, 0, 0);
    return d;
  }
}