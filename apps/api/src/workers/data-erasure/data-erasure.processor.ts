// ── data-erasure.processor.ts ─────────────────────────────────────────────────
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '@/shared/prisma.service';

export const DATA_ERASURE_QUEUE = 'data-erasure';

@Processor(DATA_ERASURE_QUEUE)
export class DataErasureProcessor extends WorkerHost {
  private readonly logger = new Logger(DataErasureProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  /**
   * Hard-deletes all user data.
   * Triggered by DELETE /users/me with a 30-day delay.
   * The Prisma CASCADE handles all related records automatically.
   */
  async process(job: Job<{ userId: string }>) {
    const { userId } = job.data;
    this.logger.log(`Starting data erasure for user ${userId}`);

    // Verify the user still exists and is flagged for deletion (isVerified=false)
    const user = await this.prisma.user.findUnique({
      where:  { id: userId },
      select: { isVerified: true },
    });

    if (!user) {
      this.logger.warn(`User ${userId} not found — may have already been deleted`);
      return;
    }

    if (user.isVerified) {
      // User re-verified their account — cancel erasure
      this.logger.log(`User ${userId} re-verified account — erasure cancelled`);
      return;
    }

    // Hard delete — Prisma CASCADE removes all related records
    await this.prisma.user.delete({ where: { id: userId } });

    this.logger.log(`Data erasure complete for user ${userId}`);
  }
}