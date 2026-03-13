import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {
  OverviewQueryDto, GoalAnalyticsQueryDto, HabitTrendQueryDto, TaskSummaryQueryDto,
} from './dto/analytics.dto';
import { CurrentUser, RequestUser } from '@/common/decorators/current-user.decorator';
import { ok } from '@/common/types/response.helper';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /** GET /v1/analytics/overview?days=30 */
  @Get('overview')
  async getOverview(@CurrentUser() user: RequestUser, @Query() query: OverviewQueryDto) {
    const data = await this.analyticsService.getOverview(user.dbUserId, query.days);
    return ok('Overview retrieved', data);
  }

  /** GET /v1/analytics/goals/:goalId?days=30 */
  @Get('goals/:goalId')
  async getGoalAnalytics(
    @CurrentUser() user: RequestUser,
    @Param('goalId') goalId: string,
    @Query() query: GoalAnalyticsQueryDto,
  ) {
    const data = await this.analyticsService.getGoalAnalytics(user.dbUserId, goalId, query.days);
    return ok('Goal analytics retrieved', data);
  }

  /** GET /v1/analytics/habits/:habitId/trend?from=2026-01-01&to=2026-03-11 */
  @Get('habits/:habitId/trend')
  async getHabitTrend(
    @CurrentUser() user: RequestUser,
    @Param('habitId') habitId: string,
    @Query() query: HabitTrendQueryDto,
  ) {
    const data = await this.analyticsService.getHabitTrend(
      user.dbUserId, habitId, query.from, query.to,
    );
    return ok('Habit trend retrieved', data);
  }

  /** GET /v1/analytics/tasks/summary?days=30 */
  @Get('tasks/summary')
  async getTaskSummary(@CurrentUser() user: RequestUser, @Query() query: TaskSummaryQueryDto) {
    const data = await this.analyticsService.getTaskSummary(user.dbUserId, query.days);
    return ok('Task summary retrieved', data);
  }
}