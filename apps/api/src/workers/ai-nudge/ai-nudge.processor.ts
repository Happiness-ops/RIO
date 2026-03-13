import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { subDays } from 'date-fns';
import { PrismaService } from '@/shared/prisma.service';
import { GeminiService } from './gemini.service';
import { WebPushService } from '@/notifications/web-push.service';

export const AI_NUDGE_QUEUE = 'ai-nudge';

@Processor(AI_NUDGE_QUEUE)
export class AiNudgeProcessor extends WorkerHost {
  private readonly logger = new Logger(AiNudgeProcessor.name);

  constructor(
    private readonly prisma:    PrismaService,
    private readonly gemini:    GeminiService,
    private readonly webPush:   WebPushService,
  ) {
    super();
  }

  async process(job: Job) {
    this.logger.log('Running AI Nudge sweep...');

    // Find users for whom it is currently 5:50–6:10 AM in their local timezone
    const users = await this.prisma.$queryRaw<{ id: string; timezone: string; email: string }[]>`
      SELECT u.id, u.timezone, u.email
      FROM users u
      JOIN user_profiles p ON p."userId" = u.id
      WHERE u."isVerified" = true
        AND p."onboardingCompleted" = true
        AND EXTRACT(HOUR FROM NOW() AT TIME ZONE u.timezone) = 6
        AND EXTRACT(MINUTE FROM NOW() AT TIME ZONE u.timezone) < 30
    `;

    this.logger.log(`Processing AI nudges for ${users.length} users`);

    for (const user of users) {
      try {
        await this.processUser(user.id);
      } catch (err) {
        this.logger.error(`AI nudge failed for user ${user.id}: ${err.message}`);
        // Continue processing other users — one failure must not stop the batch
      }
    }
  }

  private async processUser(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId }, select: { fullName: true },
    });

    const habits = await this.prisma.habit.findMany({
      where:   { userId, isArchived: false },
      include: {
        streak:   true,
        checkins: {
          where:   { logDate: { gte: subDays(new Date(), 7) } },
          orderBy: { logDate: 'desc' },
        },
      },
    });

    if (habits.length === 0) return; // Nothing to nudge about

    // ── Evaluate trigger rules (priority order) ──────────────────────────────
    const triggerType = this.evaluateTrigger(habits);

    // Find the most relevant habit for context
    const topHabit = habits
      .sort((a, b) => (b.streak?.currentStreak ?? 0) - (a.streak?.currentStreak ?? 0))[0];

    const completed7d  = habits.flatMap((h) => h.checkins).filter((c) => c.status === 'completed').length;
    const total7d      = habits.flatMap((h) => h.checkins).length;
    const completionRate = total7d ? Math.round((completed7d / total7d) * 100) : 0;

    // ── Call Gemini ──────────────────────────────────────────────────────────
    const content = await this.gemini.generateInsight({
      userName:               profile?.fullName?.split(' ')[0] ?? 'there',
      triggerType,
      topHabit:               topHabit.title,
      currentStreak:          topHabit.streak?.currentStreak ?? 0,
      longestStreak:          topHabit.streak?.longestStreak ?? 0,
      completionRateLast7Days: completionRate,
    });

    // ── Save insight to database ─────────────────────────────────────────────
    await this.prisma.aiInsight.create({
      data: {
        userId,
        triggerType,
        headline:    content.headline,
        message:     content.message,
        cta:         content.cta,
        isRead:      false,
        generatedAt: new Date(),
      },
    });

    // ── Send browser push notification ───────────────────────────────────────
    const subscriptions = await this.prisma.userPushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length > 0) {
      await this.webPush.sendToUser(
        subscriptions.map((s) => ({ id: s.id, endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth })),
        {
          title: content.headline,
          body:  content.message,
          tag:   'daily-insight',
          data:  { type: 'insight', url: '/insights' },
        },
        async (staleId) => {
          await this.prisma.userPushSubscription.delete({ where: { id: staleId } });
        },
      );
    }

    this.logger.log(`Insight generated for user ${userId}: ${triggerType}`);
  }

  // ── 5 Trigger Rules ────────────────────────────────────────────────────────
  private evaluateTrigger(habits: any[]): string {
    const yesterday = subDays(new Date(), 1);
    yesterday.setHours(0, 0, 0, 0);

    // Rule 1: Momentum — 5+ consecutive days on any habit
    const onRoll = habits.some((h) => (h.streak?.currentStreak ?? 0) >= 5);
    if (onRoll) return 'momentum';

    // Rule 2: Streak at risk — had a streak, missed yesterday
    const streakAtRisk = habits.some((h) => {
      const streak = h.streak?.currentStreak ?? 0;
      const last   = h.streak?.lastCheckinDate;
      if (streak === 0 || !last) return false;
      const lastDate = new Date(last);
      lastDate.setHours(0, 0, 0, 0);
      return lastDate < yesterday;
    });
    if (streakAtRisk) return 'streak_risk';

    // Rule 3: Streak recovery — streak reset within last 48 hours (currentStreak=0, lastCheckin was yesterday)
    const recovering = habits.some((h) => {
      const streak = h.streak?.currentStreak ?? 0;
      const last   = h.streak?.lastCheckinDate;
      if (streak !== 0 || !last) return false;
      const lastDate  = new Date(last);
      const twoDaysAgo = subDays(new Date(), 2);
      return lastDate >= twoDaysAgo;
    });
    if (recovering) return 'streak_recovery';

    // Rule 4: Completion dropoff — last 7 days rate below 50%
    const recentCheckins = habits.flatMap((h) => h.checkins);
    const completed      = recentCheckins.filter((c) => c.status === 'completed').length;
    const rate           = recentCheckins.length ? completed / recentCheckins.length : 0;
    if (rate < 0.5 && recentCheckins.length >= 3) return 'completion_dropoff';

    // Rule 5: Fallback
    return 'fallback';
  }
}