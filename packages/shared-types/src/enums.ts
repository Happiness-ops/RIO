// ─────────────────────────────────────────────────────────────────────────────
// packages/shared-types/src/enums.ts
//
// Single source of truth for all enums shared between apps/api and apps/web.
// Both packages import from here — never duplicate these in either app.
//
// Usage in api:  import { GoalType } from '@rio-ai/shared-types'
// Usage in web:  import { GoalType } from '@rio-ai/shared-types'
// ─────────────────────────────────────────────────────────────────────────────

export enum AuthProvider {
  Firebase = 'firebase',
  Auth0    = 'auth0',
}

export enum GoalType {
  ShortTerm = 'short_term',
  LongTerm  = 'long_term',
}

export enum FrequencyType {
  Daily   = 'daily',
  Weekly  = 'weekly',
  Custom  = 'custom',
}

export enum CheckinStatus {
  Completed = 'completed',
  Missed    = 'missed',
  Skipped   = 'skipped',
}

export enum PriorityType {
  Critical    = 'critical',
  Essential   = 'essential',
  Important   = 'important',
  NiceToHave  = 'nice_to_have',
  Someday     = 'someday',
}

// Display labels for the UI priority board
export const PRIORITY_LABELS: Record<PriorityType, string> = {
  [PriorityType.Critical]:   'Critical',
  [PriorityType.Essential]:  'Essential',
  [PriorityType.Important]:  'Important',
  [PriorityType.NiceToHave]: 'Nice to Have',
  [PriorityType.Someday]:    'Someday',
};

// Tailwind colour tokens for priority badges
export const PRIORITY_COLORS: Record<PriorityType, string> = {
  [PriorityType.Critical]:   'red',
  [PriorityType.Essential]:  'amber',
  [PriorityType.Important]:  'blue',
  [PriorityType.NiceToHave]: 'green',
  [PriorityType.Someday]:    'gray',
};

export enum TaskStatus {
  Todo       = 'todo',
  InProgress = 'in_progress',
  Completed  = 'completed',
  Cancelled  = 'cancelled',
}

export enum TriggerType {
  StreakRisk        = 'streak_risk',
  StreakRecovery    = 'streak_recovery',
  CompletionDropoff = 'completion_dropoff',
  Momentum          = 'momentum',
  Fallback          = 'fallback',
}

export enum CommunityRole {
  Member    = 'member',
  Moderator = 'moderator',
  Admin     = 'admin',
}