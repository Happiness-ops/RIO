import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { subDays, isSameDay } from 'date-fns';
import { PrismaService } from '@/shared/prisma.service';
import { WebPushService } from '@/notifications/web-push.service';

export const MIDNIGHT_SWEEP_QUEUE = 'midnight-sweep';

@Processor(MIDNIGHT_SWEEP_QUEUE)
export class MidnightSweepProcessor extends WorkerHost {
  private readonly logger = new Logger(MidnightSweepProcessor.name);

  constructor(
    private readonly prisma:   PrismaService,
    private readonly webPush:  WebPushService,
  ) {
    super();
  }

  async process(job: Job) {
    this.logger.log('Running Midnight Sweep...');

    // Find users for whom it is currently midnight (00:00–00:30) in their local timezone
    const users = await this.prisma.$queryRaw<{ id: string; timezone: string }[]>`
      SELECT id, timezone FROM users
      WHERE "isVerified" = true
        AND EXTRACT(HOUR   FROM NOW() AT TIME ZONE timezone) = 0
        AND EXTRACT(MINUTE FROM NOW() AT TIME ZONE timezone) < 30
    `;

    this.logger.log(`Midnight sweep processing ${users.length} users`);

    for (const user of users) {
      try {
        await this.sweepUser(user.id, user.timezone);
      } catch (err) {
        this.logger.error(`Midnight sweep failed for user ${user.id}: ${err.message}`);
      }
    }
  }

  private async sweepUser(userId: string, timezone: string) {
    const yesterday = subDays(new Date(), 1);
    yesterday.setHours(0, 0, 0, 0);

    // Get all active habits for this user
    const habits = await this.prisma.habit.findMany({
      where:   { userId, isArchived: false },
      include: {
        streak:   true,
        checkins: { where: { logDate: { gte: yesterday, lte: yesterday } } },
      },
    });

    let resetCount = 0;

    for (const habit of habits) {
      const hadCheckinYesterday = habit.checkins.length > 0;
      const streak              = habit.streak;

      if (!hadCheckinYesterday && (streak?.currentStreak ?? 0) > 0) {
        // Mark missed
        await this.prisma.checkin.upsert({
          where:  { habitId_logDate: { habitId: habit.id, logDate: yesterday } },
          create: { habitId: habit.id, status: 'missed', logDate: yesterday },
          update: {}, // Don't overwrite if somehow already exists
        });

        // Reset streak
        await this.prisma.streak.update({
          where: { habitId: habit.id },
          data:  { currentStreak: 0 },
        });

        resetCount++;
      }
    }

    if (resetCount > 0) {
      this.logger.log(`User ${userId}: ${resetCount} streak(s) reset`);

      // Send push notification about resets
      const subscriptions = await this.prisma.userPushSubscription.findMany({
        where: { userId },
      });

      if (subscriptions.length > 0) {
        await this.webPush.sendToUser(
          subscriptions.map((s) => ({ id: s.id, endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth })),
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
  }
}