export {};
// ── insights.dto.ts ───────────────────────────────────────────────────────────
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class InsightsQueryDto {
  @IsInt() @IsOptional() @Min(1) @Max(100)
  limit?: number = 20;

  @IsInt() @IsOptional() @Min(0)
  offset?: number = 0;
}