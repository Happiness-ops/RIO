export {};
import { GoalType } from '@prisma/client';
import {
  IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean,
  IsDateString, MaxLength, IsInt, Min, Max,
} from 'class-validator';

export class CreateGoalDto {
  @IsString() @IsNotEmpty() @MaxLength(255)
  title: string;

  @IsString() @IsOptional()
  description?: string;

  @IsEnum(GoalType) @IsOptional()
  type?: GoalType = GoalType.short_term;

  @IsDateString() @IsOptional()
  startDate?: string;

  @IsDateString() @IsOptional()
  endDate?: string;
}

export class UpdateGoalDto {
  @IsString() @IsOptional() @MaxLength(255)
  title?: string;

  @IsString() @IsOptional()
  description?: string;

  @IsEnum(GoalType) @IsOptional()
  type?: GoalType;

  @IsDateString() @IsOptional()
  startDate?: string;

  @IsDateString() @IsOptional()
  endDate?: string;

  @IsBoolean() @IsOptional()
  isArchived?: boolean;
}

export class GoalsQueryDto {
  @IsInt() @IsOptional() @Min(1) @Max(100)
  limit?: number = 20;

  @IsInt() @IsOptional() @Min(0)
  offset?: number = 0;

  @IsBoolean() @IsOptional()
  includeArchived?: boolean = false;
}