export {};
import { ScorecardClassification } from '@prisma/client';
import {
  IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, MaxLength,
} from 'class-validator';

export class CreateScorecardEntryDto {
  @IsString() @IsNotEmpty() @MaxLength(255)
  behavior: string;         // "I go to the gym every morning"

  @IsEnum(ScorecardClassification)
  classification: ScorecardClassification;
}

export class UpdateScorecardEntryDto {
  @IsEnum(ScorecardClassification) @IsOptional()
  classification?: ScorecardClassification;
}

export class ConvertToHabitDto {
  // The goalId to attach the new habit to
  @IsUUID()
  goalId: string;

  // Optional overrides for the auto-created habit
  @IsString() @IsOptional() @MaxLength(255)
  title?: string;           // Defaults to the scorecard behavior text
}