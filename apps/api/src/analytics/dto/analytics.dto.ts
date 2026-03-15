export {};
// ── analytics.dto.ts ──────────────────────────────────────────────────────────
import { IsInt, IsOptional, IsIn, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class OverviewQueryDto {
  @IsOptional()
  @IsIn([7, 14, 30, 90])
  @Type(() => Number)
  days?: 7 | 14 | 30 | 90 = 30;
}

export class GoalAnalyticsQueryDto {
  @IsOptional()
  @IsIn([7, 14, 30, 90])
  @Type(() => Number)
  days?: number = 30;
}

export class HabitTrendQueryDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}

export class TaskSummaryQueryDto {
  @IsOptional()
  @IsIn([7, 14, 30, 90])
  @Type(() => Number)
  days?: number = 30;
}