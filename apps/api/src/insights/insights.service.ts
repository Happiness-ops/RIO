import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { RedisService } from '@/shared/redis.service';
import { InsightsQueryDto } from './dto/insights.dto';
import { paginationMeta } from '@/common/types/response.helper';

@Injectable()
export class InsightsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis:  RedisService,
  ) {}

  /**
   * GET /insights/daily
   * Returns the most recent unread insight for the user, or null if none yet.
   * Cached per user per calendar date — the AI worker generates one per day.
   */
  async getDaily(userId: string) {
    const dateKey = new Date().toISOString().split('T')[0];
    const cacheKey = `insights:daily:${userId}:${dateKey}`;

    return this.redis.getOrSet(cacheKey, 3 * 60 * 60, async () => {
      const insight = await this.prisma.aiInsight.findFirst({
        where:   { userId },
        orderBy: { generatedAt: 'desc' },
      });
      // Explicit null return — documented in API contract for new users / pre-6AM
      return insight ? this.format(insight) : null;
    });
  }

  /**
   * GET /insights/history
   * Paginated list of all past insights for this user, newest first.
   */
  async getHistory(userId: string, query: InsightsQueryDto) {
    const cacheKey = `insights:history:${userId}:p${query.offset}`;

    return this.redis.getOrSet(cacheKey, 10 * 60, async () => {
      const [insights, total] = await Promise.all([
        this.prisma.aiInsight.findMany({
          where:   { userId },
          orderBy: { generatedAt: 'desc' },
          take:    query.limit,
          skip:    query.offset,
        }),
        this.prisma.aiInsight.count({ where: { userId } }),
      ]);

      return {
        insights:   insights.map(this.format),
        pagination: paginationMeta(total, query.limit, query.offset),
      };
    });
  }

  /**
   * PATCH /insights/:insightId/read
   * Marks an insight as read. Clears the daily insight cache so the next
   * call to GET /insights/daily reflects the updated read state.
   */
  async markRead(userId: string, insightId: string) {
    const insight = await this.prisma.aiInsight.findUnique({
      where: { id: insightId },
    });
    if (!insight)              throw new NotFoundException('Insight not found');
    if (insight.userId !== userId) throw new ForbiddenException('Access denied');

    const updated = await this.prisma.aiInsight.update({
      where: { id: insightId },
      data:  { isRead: true },
    });

    // Bust daily cache so the next GET /insights/daily reflects the read
    const dateKey = new Date().toISOString().split('T')[0];
    await this.redis.del(`insights:daily:${userId}:${dateKey}`);
    // Also bust history cache (read state changed)
    await this.redis.delPattern(`insights:history:${userId}:*`);

    return this.format(updated);
  }

  private format(insight: any) {
    return {
      id:          insight.id,
      triggerType: insight.triggerType,
      headline:    insight.headline,
      message:     insight.message,
      cta:         insight.cta,
      isRead:      insight.isRead,
      generatedAt: insight.generatedAt,
    };
  }
}