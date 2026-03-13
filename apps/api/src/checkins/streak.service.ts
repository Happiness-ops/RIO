import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { isSameDay, subDays, parseISO } from 'date-fns';

/**
 * StreakService — stateless, called by CheckinsService inside a transaction.
 *
 * Rules:
 *  - If lastCheckinDate was yesterday → increment currentStreak
 *  - If lastCheckinDate was today (shouldn't happen — 409 guard) → no change
 *  - Any other gap → reset currentStreak to 1 (this check-in starts a new streak)
 *  - longestStreak is updated if currentStreak exceeds it
 */
@Injectable()
export class StreakService {
  constructor(private readonly prisma: PrismaService) {}

  async updateStreak(
    habitId: string,
    logDate: string,
    tx: Omit<PrismaService, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  ) {
    const db     = (tx as any) ?? this.prisma;
    const streak = await db.streak.findUnique({ where: { habitId } });
    const today  = parseISO(logDate);

    let newCurrent = 1; // Default: this check-in starts a fresh streak

    if (streak?.lastCheckinDate) {
      const last      = new Date(streak.lastCheckinDate);
      const yesterday = subDays(today, 1);

      if (isSameDay(last, yesterday)) {
        // Consecutive day — extend streak
        newCurrent = (streak.currentStreak ?? 0) + 1;
      }
      // Any other case: gap > 1 day, streak resets to 1
    }

    const newLongest = Math.max(newCurrent, streak?.longestStreak ?? 0);

    return db.streak.upsert({
      where:  { habitId },
      create: {
        habitId,
        currentStreak:   newCurrent,
        longestStreak:   newLongest,
        lastCheckinDate: today,
      },
      update: {
        currentStreak:   newCurrent,
        longestStreak:   newLongest,
        lastCheckinDate: today,
      },
    });
  }
}