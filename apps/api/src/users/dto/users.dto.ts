export {};
import {
  IsString, IsBoolean, IsOptional, IsArray, IsEnum,
  MaxLength, IsObject,
} from 'class-validator';
import { PillarType } from '@prisma/client';

export class UpdateProfileDto {
  @IsString() @IsOptional() @MaxLength(255)
  fullName?: string;

  @IsString() @IsOptional()
  avatarUrl?: string;

  @IsString() @IsOptional() @MaxLength(500)
  bio?: string;

  @IsBoolean() @IsOptional()
  onboardingCompleted?: boolean;

  @IsString() @IsOptional()
  timezone?: string;

  // Epic 2.1 — Identity Definition
  @IsString() @IsOptional() @MaxLength(500)
  identityStatement?: string;

  @IsString() @IsOptional() @MaxLength(500)
  growthIntention?: string;

  // Epic 2.3 — Pillar Selection
  @IsArray() @IsOptional()
  @IsEnum(PillarType, { each: true })
  selectedPillars?: PillarType[];

  @IsObject() @IsOptional()
  preferences?: {
    notificationsEnabled?: boolean;
    theme?: 'light' | 'dark';
    weekStartsOn?: 0 | 1;
    notificationTime?: string;
    weeklyReviewDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    insightTonePreference?: 'motivational' | 'analytical';
  };
}