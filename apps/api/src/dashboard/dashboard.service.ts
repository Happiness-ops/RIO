import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { RedisService } from '@/shared/redis.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis:  RedisService,
  ) {}

  async getDashboard(userId: string) {
    return this.redis.getOrSet(`dashboard:${userId}`, 60, async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Start of this ISO week (Monday)
      const dayOfWeek   = today.getDay();
      const mondayDiff  = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const weekStart   = new Date(today);
      weekStart.setDate(today.getDate() + mondayDiff);

      const [profile, habits, todayCheckins, weekCheckins, recentInsight] = await Promise.all([
        this.prisma.userProfile.findUnique({
          where:  { userId },
          select: { identityStatement: true, selectedPillars: true, fullName: true },
        }),
        this.prisma.habit.findMany({
          where:   { userId, isArchived: false },
          include: { streak: true },
          orderBy: [{ isKeystone: 'desc' }, { createdAt: 'asc' }],
        }),
        this.prisma.checkin.findMany({
          where: { habit: { userId }, logDate: today },
        }),
        // Epic 3.2 — need this week's checkins for pillar balance
        this.prisma.checkin.findMany({
          where: {
            habit:   { userId },
            logDate: { gte: weekStart },
            status:  'completed',
          },
          include: { habit: { select: { pillar: true } } },
        }),
        this.prisma.aiInsight.findFirst({
          where:   { userId, isRead: false },
          orderBy: { generatedAt: 'desc' },
        }),
      ]);

      const checkinMap     = new Map(todayCheckins.map((c) => [c.habitId, c]));
      const completedToday = todayCheckins.filter((c) => c.status === 'completed').length;

      // Epic 3.3 — keystone habit
      const keystoneHabit = habits.find((h) => h.isKeystone) ?? null;

      // Epic 3.2 — pillar balance
      const pillarBalance = this.buildPillarBalance(habits, weekCheckins);

      // Epic 3.4 — weekly consistency score
      const weeklyConsistencyScore = this.calcWeeklyConsistency(habits, weekCheckins, weekStart);

      // Epic 5.2 — two-day rule: habits at risk of second consecutive miss
      const twoDayRiskHabits = habits.filter((h) => {
        const streak = h.streak;
        if (!streak?.lastCheckinDate) return false;
        const last = new Date(streak.lastCheckinDate);
        last.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        // Last checkin was 2+ days ago and they missed yesterday too
        return last < yesterday && !checkinMap.has(h.id);
      });

      return {
        date: today.toISOString().split('T')[0],

        // Epic 3.1 — identity header
        identity: {
          statement:       profile?.identityStatement ?? null,
          firstName:       profile?.fullName?.split(' ')[0] ?? null,
          selectedPillars: profile?.selectedPillars ?? [],
        },

        metrics: {
          totalHabits:         habits.length,
          completedToday,
          completionRate:      habits.length ? Math.round((completedToday / habits.length) * 100) : 0,
          activeStreaks:        habits.filter((h) => (h.streak?.currentStreak ?? 0) > 0).length,
          longestStreak:        Math.max(0, ...habits.map((h) => h.streak?.longestStreak ?? 0)),
          weeklyConsistencyScore,
        },

        // Epic 3.3 — keystone highlighted separately
        keystoneHabit: keystoneHabit ? {
          id:            keystoneHabit.id,
          title:         keystoneHabit.title,
          currentStreak: keystoneHabit.streak?.currentStreak ?? 0,
          todayCheckin:  checkinMap.get(keystoneHabit.id) ?? null,
        } : null,

        // Epic 3.2 — pillar balance
        pillarBalance,

        // Epic 5.2 — two-day rule warning
        twoDayRisk: {
          count:  twoDayRiskHabits.length,
          habits: twoDayRiskHabits.map((h) => ({ id: h.id, title: h.title })),
        },

        todayHabits: habits.map((h) => ({
          id:            h.id,
          title:         h.title,
          pillar:        h.pillar,
          isKeystone:    h.isKeystone,
          frequency:     h.frequency,
          scheduledTime: h.scheduledTime,
          currentStreak: h.streak?.currentStreak ?? 0,
          longestStreak: h.streak?.longestStreak ?? 0,
          weeklyRecoveryUsed: h.streak?.weeklyRecoveryUsed ?? false,
          todayCheckin:  checkinMap.get(h.id) ?? null,
        })),

        insight: recentInsight ? {
          id:          recentInsight.id,
          triggerType: recentInsight.triggerType,
          headline:    recentInsight.headline,
          message:     recentInsight.message,
          cta:         recentInsight.cta,
          generatedAt: recentInsight.generatedAt,
        } : null,
      };
    });
  }

  // Epic 3.2 — build pillar completion breakdown for the week
  private buildPillarBalance(habits: any[], weekCheckins: any[]) {
    const pillarMap: Record<string, { total: number; completed: number }> = {};

    for (const habit of habits) {
      const pillar = habit.pillar ?? 'uncategorised';
      if (!pillarMap[pillar]) pillarMap[pillar] = { total: 0, completed: 0 };
      pillarMap[pillar].total++;
    }

    for (const checkin of weekCheckins) {
      const pillar = checkin.habit?.pillar ?? 'uncategorised';
      if (!pillarMap[pillar]) pillarMap[pillar] = { total: 0, completed: 0 };
      pillarMap[pillar].completed++;
    }

    const breakdown = Object.entries(pillarMap).map(([pillar, data]) => ({
      pillar,
      habitCount:   data.total,
      completedThisWeek: data.completed,
      rate: data.total > 0 ? Math.round((data.completed / (data.total * 7)) * 100) : 0,
    }));

    // Epic 3.2 — imbalance indicator: any selected pillar with 0 habits
    const pillarsWithZeroHabits = breakdown
      .filter((p) => p.habitCount === 0 && p.pillar !== 'uncategorised')
      .map((p) => p.pillar);

    return { breakdown, imbalanceWarning: pillarsWithZeroHabits };
  }

  // Epic 3.4 / 5.3 — weekly consistency score as a percentage
  private calcWeeklyConsistency(habits: any[], weekCheckins: any[], weekStart: Date): number {
    if (habits.length === 0) return 0;
    const today        = new Date();
    today.setHours(0, 0, 0, 0);
    const daysSoFar    = Math.max(1, Math.round((today.getTime() - weekStart.getTime()) / 86_400_000) + 1);
    const totalSlots   = habits.length * daysSoFar;
    const completed    = weekCheckins.length;
    return totalSlots > 0 ? Math.round((completed / totalSlots) * 100) : 0;
  }
}