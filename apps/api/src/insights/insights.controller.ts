// ── insights.controller.ts ────────────────────────────────────────────────────
import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { InsightsQueryDto } from './dto/insights.dto';
import { CurrentUser, RequestUser } from '@/common/decorators/current-user.decorator';
import { ok } from '@/common/types/response.helper';

@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  /** GET /v1/insights/daily */
  @Get('daily')
  async getDaily(@CurrentUser() user: RequestUser) {
    const insight = await this.insightsService.getDaily(user.dbUserId);
    return ok('Daily insight retrieved', insight); // data: null is valid
  }

  /** GET /v1/insights/history */
  @Get('history')
  async getHistory(@CurrentUser() user: RequestUser, @Query() query: InsightsQueryDto) {
    const result = await this.insightsService.getHistory(user.dbUserId, query);
    return ok('Insight history retrieved', result);
  }

  /** PATCH /v1/insights/:insightId/read */
  @Patch(':insightId/read')
  async markRead(
    @CurrentUser() user: RequestUser,
    @Param('insightId') insightId: string,
  ) {
    const insight = await this.insightsService.markRead(user.dbUserId, insightId);
    return ok('Insight marked as read', insight);
  }
}