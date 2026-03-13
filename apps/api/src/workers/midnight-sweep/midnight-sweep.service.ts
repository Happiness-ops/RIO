import { Injectable, Logger } from '@nestjs/common';
import { subDays } from 'date-fns';
import { PrismaService } from '@/shared/prisma.service';
import { WebPushService } from '@/notifications/web-push.service';

/**
 * MidnightSweepService
 * Contains the core logic for the midnight sweep worker.
 * Extracted from the processor so it can be unit-tested independently
 * without needing a BullMQ context.
 */
@Injectable()
export class MidnightSweepService {
  private readonly logger = new Logger(MidnightSweepService.name);

  constructor(
    private readonly prisma:   PrismaService,
    private readonly webPush:  WebPushService,
  ) {}

  /**
   * Returns all users for whom it is currently midnight (00:00–00:30)
   * in their local timezone.
   */
  async getUsersAtMidnight(): Promise<{ id: string; timezone: string }[]> {
    return this.prisma.$queryRaw<{ id: string; timezone: string }[]>`
      SELECT id, timezone FROM users
      WHERE "isVerified" = true
        AND EXTRACT(HOUR   FROM NOW() AT TIME ZONE timezone) = 0
        AND EXTRACT(MINUTE FROM NOW() AT TIME ZONE timezone) < 30
    `;
  }

  /**
   * For a single user:
   *  - Finds all habits that had no check-in yesterday
   *  - Inserts a 'missed' check-in record for each
   *  - Resets the streak to 0 for each affected habit
   *  - Sends a push notification if any streaks were reset
   */
  async sweepUser(userId: string): Promise<{ resetCount: number }> {
    const yesterday = subDays(new Date(), 1);
    yesterday.setHours(0, 0, 0, 0);

    const habits = await this.prisma.habit.findMany({
      where:   { userId, isArchived: false },
      include: {
        streak:   true,
        checkins: {
          where: { logDate: { gte: yesterday, lte: yesterday } },
        },
      },
    });

    let resetCount = 0;

    for (const habit of habits) {
      const hadCheckinYesterday = habit.checkins.length > 0;
      const hasActiveStreak     = (habit.streak?.currentStreak ?? 0) > 0;

      if (!hadCheckinYesterday && hasActiveStreak) {
        // Insert missed record — upsert in case the record was already created
        await this.prisma.checkin.upsert({
          where:  { habitId_logDate: { habitId: habit.id, logDate: yesterday } },
          create: { habitId: habit.id, status: 'missed', logDate: yesterday },
          update: {},
        });

        // Reset streak
        await this.prisma.streak.update({
          where: { habitId: habit.id },
          data:  { currentStreak: 0 },
        });

        resetCount++;
      }
    }

    // Notify user if any streaks were reset
    if (resetCount > 0) {
      const subscriptions = await this.prisma.userPushSubscription.findMany({
        where: { userId },
      });

      if (subscriptions.length > 0) {
        await this.webPush.sendToUser(
          subscriptions.map((s) => ({
            id: s.id, endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth,
          })),
          {
            title: 'Streak Reset',
            body:  `You missed ${resetCount} habit${resetCount > 1 ? 's' : ''} yesterday. Start fresh today!`,
            tag:   'streak-reset',
            data:  { type: 'streak-reset', url: '/dashboard' },
          },
          async (staleId) => {
            await this.prisma.userPushSubscription.delete({ where: { id: staleId } });
          },
        );
      }
    }

    return { resetCount };
  }
}