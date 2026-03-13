import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

/**
 * DataErasureService
 * Contains the hard-delete logic for GDPR/NDPA compliance.
 * Extracted from the processor so it can be unit-tested independently.
 *
 * Triggered by DELETE /users/me with a 30-day BullMQ delay.
 * If the user re-verifies their account within 30 days, the job is cancelled.
 */
@Injectable()
export class DataErasureService {
  private readonly logger = new Logger(DataErasureService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Checks whether the erasure should proceed.
   * Returns false if the user has re-verified (cancelled their deletion request).
   */
  async shouldErase(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where:  { id: userId },
      select: { isVerified: true },
    });

    if (!user) {
      this.logger.warn(`User ${userId} not found — already erased or never existed`);
      return false;
    }

    if (user.isVerified) {
      this.logger.log(`User ${userId} re-verified account — erasure cancelled`);
      return false;
    }

    return true;
  }

  /**
   * Hard-deletes the user and all associated data.
   * Prisma CASCADE handles all related tables automatically:
   *   user_profiles, goals, habits, checkins, streaks, ai_insights,
   *   tasks, users_push_subscriptions, community_members
   */
  async eraseUser(userId: string): Promise<void> {
    this.logger.log(`Starting data erasure for user ${userId}`);

    await this.prisma.user.delete({ where: { id: userId } });

    this.logger.log(`Data erasure complete for user ${userId}`);
  }
}