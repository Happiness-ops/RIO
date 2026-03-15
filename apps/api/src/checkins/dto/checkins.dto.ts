export {};
// ── checkins.dto.ts ───────────────────────────────────────────────────────────
import { CheckinStatus } from '@prisma/client';
import { IsEnum, IsDateString, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateCheckinDto {
  @IsDateString()
  logDate: string; // ISO date string e.g. "2026-03-11"

  @IsEnum(CheckinStatus)
  status: CheckinStatus;

  @IsString() @IsOptional()
  note?: string;
}

export class CheckinsQueryDto {
  @IsInt() @IsOptional() @Min(1) @Max(100)
  limit?: number = 20;

  @IsInt() @IsOptional() @Min(0)
  offset?: number = 0;

  @IsDateString() @IsOptional()
  from?: string;

  @IsDateString() @IsOptional()
  to?: string;
}