export {};
import { FrequencyType, PillarType } from '@prisma/client';
import {
  IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean,
  IsUUID, IsObject, IsInt, Min, Max, MaxLength, Matches,
} from 'class-validator';

export class CreateHabitDto {
  @IsUUID()
  goalId: string;

  @IsString() @IsNotEmpty() @MaxLength(255)
  title: string;

  // Epic 2.3 — pillar this habit belongs to
  @IsEnum(PillarType) @IsOptional()
  pillar?: PillarType;

  // Epic 3.3 — mark as keystone (enforced one-per-user in service)
  @IsBoolean() @IsOptional()
  isKeystone?: boolean = false;

  @IsEnum(FrequencyType) @IsOptional()
  frequency?: FrequencyType = FrequencyType.daily;

  @IsObject() @IsOptional()
  frequencyDetails?: Record<string, any> = {};

  // Epic 4.2 — implementation intention
  @IsString() @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'scheduledTime must be HH:MM format' })
  scheduledTime?: string;

  @IsString() @IsOptional() @MaxLength(500)
  habitStackTrigger?: string;   // "After I brew my morning coffee..."

  // Epic 4.3 — friction guard
  @IsInt() @IsOptional() @Min(1) @Max(480)
  estimatedDuration?: number;   // Minutes
}

export class UpdateHabitDto {
  @IsString() @IsOptional() @MaxLength(255)
  title?: string;

  @IsUUID() @IsOptional()
  goalId?: string;

  @IsEnum(PillarType) @IsOptional()
  pillar?: PillarType;

  @IsBoolean() @IsOptional()
  isKeystone?: boolean;

  @IsEnum(FrequencyType) @IsOptional()
  frequency?: FrequencyType;

  @IsObject() @IsOptional()
  frequencyDetails?: Record<string, any>;

  @IsString() @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'scheduledTime must be HH:MM format' })
  scheduledTime?: string;

  @IsString() @IsOptional() @MaxLength(500)
  habitStackTrigger?: string;

  @IsInt() @IsOptional() @Min(1) @Max(480)
  estimatedDuration?: number;

  @IsBoolean() @IsOptional()
  isArchived?: boolean;
}

export class HabitsQueryDto {
  @IsInt() @IsOptional() @Min(1) @Max(100)
  limit?: number = 20;

  @IsInt() @IsOptional() @Min(0)
  offset?: number = 0;

  @IsUUID() @IsOptional()
  goalId?: string;

  @IsEnum(PillarType) @IsOptional()
  pillar?: PillarType;

  @IsBoolean() @IsOptional()
  includeArchived?: boolean = false;
}