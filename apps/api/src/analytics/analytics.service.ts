import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { RedisService } from '@/shared/redis.service';
import { subDays, format, getISOWeek, getYear } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis:  RedisService,
  ) {}

  // ── GET /analytics/overview?days=30 ─────────────────────────────────────────
  async getOverview(userId: string, days: 7 | 14 | 30 | 90 = 30) {
    return this.redis.getOrSet(`analytics:overview:${userId}:${days}`, 5 * 60, async () => {
      const since = subDays(new Date(), days);
      const [habits, checkins, tasks] = await Promise.all([
        this.prisma.habit.findMany({ where: { userId, isArchived: false }, include: { streak: true } }),
        this.prisma.checkin.findMany({ where: { habit: { userId }, logDate: { gte: since } } }),
        this.prisma.task.findMany({ where: { userId, isArchived: false } }),
      ]);

      const completed = checkins.filter((c) => c.status === 'completed').length;
      const rate      = checkins.length ? Math.round((completed / checkins.length) * 100) : 0;
      const streaks   = habits.map((h) => h.streak?.currentStreak ?? 0);
      const avgStreak = streaks.length
        ? Math.round(streaks.reduce((a, b) => a + b, 0) / streaks.length) : 0;

      const completedTasks = tasks.filter((t) => t.status === 'completed').length;

      // Pillar breakdown in overview
      const pillarMap: Record<string, { total: number; completed: number }> = {};
      for (const h of habits) {
        if (!h.pillar) continue;
        if (!pillarMap[h.pillar]) pillarMap[h.pillar] = { total: 0, completed: 0 };
      }
      for (const c of checkins) {
        const habit = habits.find((h) => h.id === c.habitId);
        if (!habit?.pillar) continue;
        pillarMap[habit.pillar].total++;
        if (c.status === 'completed') pillarMap[habit.pillar].completed++;
      }
      const pillarBreakdown = Object.entries(pillarMap).map(([pillar, d]) => ({
        pillar,
        completionRate: d.total ? Math.round((d.completed / d.total) * 100) : 0,
      }));

      return {
        period: { days, since: since.toISOString() },
        habits: {
          total: habits.length,
          completionRate: rate,
          checkinsLogged: checkins.length,
          avgStreak,
        },
        tasks: {
          total:          tasks.length,
          completed:      completedTasks,
          completionRate: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
        },
        pillarBreakdown,
        topHabits: [...habits]
          .sort((a, b) => (b.streak?.currentStreak ?? 0) - (a.streak?.currentStreak ?? 0))
          .slice(0, 3)
          .map((h) => ({
            id: h.id, title: h.title, pillar: h.pillar,
            currentStreak: h.streak?.currentStreak ?? 0,
            longestStreak: h.streak?.longestStreak ?? 0,
          })),
      };
    });
  }

  // ── GET /analytics/goals/:goalId?days=30 ────────────────────────────────────
  async getGoalAnalytics(userId: string, goalId: string, days = 30) {
    return this.redis.getOrSet(`analytics:goal:${goalId}:${days}`, 10 * 60, async () => {
      const since = subDays(new Date(), days);
      const goal  = await this.prisma.goal.findFirst({
        where:   { id: goalId, userId },
        include: {
          habits: {
            where:   { isArchived: false },
            include: {
              streak:   true,
              checkins: { where: { logDate: { gte: since } } },
            },
          },
        },
      });
      if (!goal) return null;

      return {
        goalId: goal.id,
        title:  goal.title,
        type:   goal.type,
        period: { days },
        habits: goal.habits.map((h) => {
          const total     = h.checkins.length;
          const completed = h.checkins.filter((c) => c.status === 'completed').length;
          return {
            id: h.id, title: h.title, pillar: h.pillar,
            isKeystone:    h.isKeystone,
            frequency:     h.frequency,
            scheduledTime: h.scheduledTime,
            currentStreak: h.streak?.currentStreak ?? 0,
            longestStreak: h.streak?.longestStreak ?? 0,
            completionRate: total ? Math.round((completed / total) * 100) : 0,
            checkinsLogged: total,
          };
        }),
      };
    });
  }

  // ── GET /analytics/habits/:habitId/trend?from=&to= ───────────────────────────
  async getHabitTrend(userId: string, habitId: string, from: string, to: string) {
    const fromDate = new Date(from);
    const toDate   = new Date(to);
    const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / 86_400_000);
    if (daysDiff > 365) throw new BadRequestException('Date range cannot exceed 365 days');

    return this.redis.getOrSet(`analytics:habit:${habitId}:${from}:${to}`, 10 * 60, async () => {
      const habit = await this.prisma.habit.findFirst({
        where:   { id: habitId, userId },
        include: {
          streak:   true,
          checkins: { where: { logDate: { gte: fromDate, lte: toDate } }, orderBy: { logDate: 'asc' } },
        },
      });
      if (!habit) return null;

      const checkinMap = new Map(
        habit.checkins.map((c) => [format(new Date(c.logDate), 'yyyy-MM-dd'), c.status]),
      );
      const trend: { date: string; status: string }[] = [];
      const cursor = new Date(fromDate);
      while (cursor <= toDate) {
        const key = format(cursor, 'yyyy-MM-dd');
        trend.push({ date: key, status: checkinMap.get(key) ?? 'not_scheduled' });
        cursor.setDate(cursor.getDate() + 1);
      }

      return {
        habitId: habit.id, title: habit.title, pillar: habit.pillar,
        currentStreak: habit.streak?.currentStreak ?? 0,
        longestStreak: habit.streak?.longestStreak ?? 0,
        trend,
      };
    });
  }

  // ── GET /analytics/tasks/summary ────────────────────────────────────────────
  async getTaskSummary(userId: string, days = 30) {
    return this.redis.getOrSet(`analytics:tasks:${userId}:${days}`, 5 * 60, async () => {
      const since = subDays(new Date(), days);
      const tasks = await this.prisma.task.findMany({
        where:  { userId, isArchived: false, createdAt: { gte: since } },
        select: { priority: true, status: true },
      });
      const tiers = ['critical', 'essential', 'important', 'nice_to_have', 'someday'] as const;
      return {
        period: { days },
        summary: tiers.map((tier) => {
          const t  = tasks.filter((x) => x.priority === tier);
          const c  = t.filter((x) => x.status === 'completed').length;
          return { priority: tier, total: t.length, completed: c,
            completionRate: t.length ? Math.round((c / t.length) * 100) : 0 };
        }),
      };
    });
  }

  // ── GET /analytics/weekly-review (Epic 5.3) ──────────────────────────────────
  // Returns the most recent weekly review, or computes one on-demand if none exists.
  async getWeeklyReview(userId: string) {
    const cached = await this.redis.get(`analytics:weekly-review:${userId}`);
    if (cached) return JSON.parse(cached);

    // Try DB first
    const stored = await this.prisma.weeklyReview.findFirst({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (stored) {
      await this.redis.set(`analytics:weekly-review:${userId}`, JSON.stringify(stored), 60 * 60);
      return stored;
    }

    // Compute on-demand if no stored review exists yet
    return this.computeWeeklyReview(userId);
  }

  // ── GET /analytics/weekly-review/history ─────────────────────────────────────
  async getWeeklyReviewHistory(userId: string, limit = 12) {
    const reviews = await this.prisma.weeklyReview.findMany({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
      take:    limit,
    });
    return reviews;
  }

  // ── Compute + persist a weekly review (also called by the AI worker on Sundays) ──
  async computeWeeklyReview(userId: string): Promise<any> {
    const now       = new Date();
    const isoWeek   = getISOWeek(now);
    const year      = getYear(now);
    const weekLabel = `${year}-W${String(isoWeek).padStart(2, '0')}`;

    const weekStart = this.getMonday(now);

    const [habits, weekCheckins, profile] = await Promise.all([
      this.prisma.habit.findMany({
        where: { userId, isArchived: false },
        include: { streak: true },
      }),
      this.prisma.checkin.findMany({
        where: {
          habit:   { userId },
          logDate: { gte: weekStart },
          status:  'completed',
        },
        include: { habit: { select: { pillar: true } } },
      }),
      this.prisma.userProfile.findUnique({
        where:  { userId },
        select: { fullName: true },
      }),
    ]);

    // Per-pillar breakdown
    const pillarMap: Record<string, { total: number; completed: number }> = {};
    for (const h of habits) {
      const p = h.pillar ?? 'uncategorised';
      if (!pillarMap[p]) pillarMap[p] = { total: 0, completed: 0 };
      pillarMap[p].total++;
    }
    for (const c of weekCheckins) {
      const p = (c.habit as any)?.pillar ?? 'uncategorised';
      if (!pillarMap[p]) pillarMap[p] = { total: 0, completed: 0 };
      pillarMap[p].completed++;
    }

    const today        = new Date();
    today.setHours(0, 0, 0, 0);
    const daysSoFar    = Math.max(1, Math.round((today.getTime() - weekStart.getTime()) / 86_400_000) + 1);

    const pillarBreakdown = Object.entries(pillarMap).map(([pillar, d]) => ({
      pillar,
      total:     d.total * daysSoFar,
      completed: d.completed,
      rate:      d.total > 0 ? Math.round((d.completed / (d.total * daysSoFar)) * 100) : 0,
    }));

    const totalSlots     = habits.length * daysSoFar;
    const consistencyScore = totalSlots > 0
      ? Math.round((weekCheckins.length / totalSlots) * 100)
      : 0;

    const sorted      = [...pillarBreakdown].filter((p) => p.pillar !== 'uncategorised');
    const bestPillar  = sorted.sort((a, b) => b.rate - a.rate)[0]?.pillar ?? null;
    const worstPillar = sorted.sort((a, b) => a.rate - b.rate)[0]?.pillar ?? null;

    // Simple reflection prompt (non-AI, deterministic)
    const reflectionPrompt = this.buildReflectionPrompt(consistencyScore, bestPillar, worstPillar);

    const review = await this.prisma.weeklyReview.upsert({
      where:  { userId_weekLabel: { userId, weekLabel } },
      create: {
        userId, weekLabel, consistencyScore,
        bestPillar:    bestPillar as any,
        weakestPillar: worstPillar as any,
        reflectionPrompt,
        pillarBreakdown,
      },
      update: {
        consistencyScore,
        bestPillar:    bestPillar as any,
        weakestPillar: worstPillar as any,
        reflectionPrompt,
        pillarBreakdown,
      },
    });

    await this.redis.set(`analytics:weekly-review:${userId}`, JSON.stringify(review), 60 * 60);
    return review;
  }

  private buildReflectionPrompt(score: number, best: string | null, worst: string | null): string {
    if (score >= 80) return `Strong week! You hit ${score}% consistency. What made this week work?`;
    if (score >= 50) return `Solid effort at ${score}%. What one habit would have pushed this week higher?`;
    if (worst)       return `${score}% this week. Your ${worst.replace('_', ' ')} habits need attention — what got in the way?`;
    return `${score}% this week. What's one thing you'd do differently next week?`;
  }

  private getMonday(date: Date): Date {
    const d    = new Date(date);
    const day  = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }
}