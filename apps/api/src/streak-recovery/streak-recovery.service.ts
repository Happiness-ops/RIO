// ── streak-recovery.service.ts ────────────────────────────────────────────────
import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { RedisService } from '@/shared/redis.service';
import { getISOWeek, getYear } from 'date-fns';

@Injectable()
export class StreakRecoveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis:  RedisService,
  ) {}

  /**
   * POST /habits/:habitId/streak-recovery
   *
   * Epic 6.2 — Once-per-week grace period.
   * Restores a streak that was reset in the last 24 hours.
   * Can only be used ONCE per ISO week across the user's entire account.
   *
   * Conditions for eligibility:
   *  1. The habit has currentStreak = 0 (streak was reset)
   *  2. The reset happened within the last 24 hours (lastCheckinDate = yesterday)
   *  3. The user has not used their weekly recovery this ISO week
   */
  async useRecovery(userId: string, habitId: string) {
    const habit = await this.prisma.habit.findUnique({
      where:   { id: habitId },
      include: { streak: true },
    });

    if (!habit)              throw new NotFoundException('Habit not found');
    if (habit.userId !== userId) throw new ForbiddenException('Access denied');

    const streak = habit.streak;
    if (!streak) throw new NotFoundException('Streak record not found');

    // Check 1: streak must actually be reset
    if (streak.currentStreak > 0) {
      throw new BadRequestException('Your streak is still active — recovery is only available after a reset.');
    }

    // Check 2: the reset must have happened within the last 24 hours
    if (!streak.lastCheckinDate) {
      throw new BadRequestException('No previous streak found to recover.');
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const lastCheckin = new Date(streak.lastCheckinDate);
    lastCheckin.setHours(0, 0, 0, 0);

    if (lastCheckin < yesterday) {
      throw new BadRequestException(
        'Recovery window has passed. Streak recovery is only available within 24 hours of a reset.',
      );
    }

    // Check 3: once-per-week across all habits
    if (streak.weeklyRecoveryUsed && streak.lastRecoveryDate) {
      const recoveryDate = new Date(streak.lastRecoveryDate);
      const sameWeek =
        getISOWeek(recoveryDate) === getISOWeek(new Date()) &&
        getYear(recoveryDate)    === getYear(new Date());
      if (sameWeek) {
        throw new BadRequestException(
          'You have already used your streak recovery this week. It resets every Monday.',
        );
      }
    }

    // Also check other habits — recovery is once-per-week per USER not per habit
    const otherRecoveredThisWeek = await this.prisma.streak.findFirst({
      where: {
        habit:      { userId },
        weeklyRecoveryUsed: true,
        lastRecoveryDate: {
          gte: this.getThisWeekMonday(),
        },
      },
    });
    if (otherRecoveredThisWeek) {
      throw new BadRequestException(
        'You have already used your weekly streak recovery on another habit. It resets every Monday.',
      );
    }

    // ── Apply recovery ─────────────────────────────────────────────────────
    // Restore streak to what it was before the reset (longestStreak is a safe proxy
    // if we don't have the pre-reset value stored separately)
    const restoredStreak = streak.longestStreak > 0 ? streak.longestStreak : 1;

    const updated = await this.prisma.streak.update({
      where: { habitId },
      data: {
        currentStreak:      restoredStreak,
        weeklyRecoveryUsed: true,
        lastRecoveryDate:   new Date(),
      },
    });

    // Invalidate dashboard cache
    await this.redis.del(`dashboard:${userId}`);

    return {
      habitId,
      restoredStreak:  updated.currentStreak,
      longestStreak:   updated.longestStreak,
      recoveryUsedAt:  updated.lastRecoveryDate,
      message:         `Streak recovered! You're back to ${updated.currentStreak} days. Don't break the chain.`,
    };
  }

  private getThisWeekMonday(): Date {
    const now    = new Date();
    const day    = now.getDay();                   // 0=Sun, 1=Mon, ...
    const diff   = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }
}