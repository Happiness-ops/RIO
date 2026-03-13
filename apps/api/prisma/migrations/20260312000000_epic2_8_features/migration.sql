-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 20260312000000_epic2_8_features
--
-- Adds all data structures required by Epics 2–8:
--
--   1. New enums:
--      - PillarType         (5 life pillars)
--      - ScorecardClassification  (reinforcing | neutral | conflicting)
--      - New TriggerType values   (two_day_risk | pillar_imbalance |
--                                  weekly_reflection | educational)
--
--   2. user_profiles additions:
--      - identityStatement    (Epic 2.1 — "I am becoming...")
--      - growthIntention      (Epic 2.1)
--      - selectedPillars      (Epic 2.3 — chosen life focus areas)
--
--   3. habits additions:
--      - pillar               (Epic 2.3 — which life area)
--      - isKeystone           (Epic 3.3 — one high-prominence habit)
--      - scheduledTime        (Epic 4.2 — implementation intention time)
--      - habitStackTrigger    (Epic 4.2 — "After I...")
--      - estimatedDuration    (Epic 4.3 — friction guard in minutes)
--
--   4. streaks additions:
--      - weeklyRecoveryUsed   (Epic 6.2 — grace period flag)
--      - lastRecoveryDate     (Epic 6.2 — when the recovery was used)
--
--   5. New table: habit_scorecards  (Epic 2.2)
--   6. New table: weekly_reviews    (Epic 5.3)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. New Enums ──────────────────────────────────────────────────────────────

CREATE TYPE "PillarType" AS ENUM (
  'health',
  'learning',
  'wealth',
  'emotional_spiritual',
  'relationships'
);

CREATE TYPE "ScorecardClassification" AS ENUM (
  'reinforcing',
  'neutral',
  'conflicting'
);

-- Add new TriggerType values (ALTER TYPE … ADD VALUE is safe in Postgres 9.1+)
ALTER TYPE "TriggerType" ADD VALUE IF NOT EXISTS 'two_day_risk';
ALTER TYPE "TriggerType" ADD VALUE IF NOT EXISTS 'pillar_imbalance';
ALTER TYPE "TriggerType" ADD VALUE IF NOT EXISTS 'weekly_reflection';
ALTER TYPE "TriggerType" ADD VALUE IF NOT EXISTS 'educational';


-- ── 2. user_profiles additions ────────────────────────────────────────────────

-- "I am becoming a disciplined, health-first professional."
ALTER TABLE "user_profiles"
  ADD COLUMN IF NOT EXISTS "identityStatement" TEXT;

-- "My focus for this season is building financial independence."
ALTER TABLE "user_profiles"
  ADD COLUMN IF NOT EXISTS "growthIntention" VARCHAR(500);

-- Array of chosen pillars e.g. '{health,learning}'
-- Stored as TEXT[] so we can query for pillar membership efficiently.
ALTER TABLE "user_profiles"
  ADD COLUMN IF NOT EXISTS "selectedPillars" TEXT[] NOT NULL DEFAULT '{}';


-- ── 3. habits additions ───────────────────────────────────────────────────────

-- Which life pillar this habit belongs to
ALTER TABLE "habits"
  ADD COLUMN IF NOT EXISTS "pillar" "PillarType";

-- One habit per user can be marked as keystone (high dashboard prominence)
ALTER TABLE "habits"
  ADD COLUMN IF NOT EXISTS "isKeystone" BOOLEAN NOT NULL DEFAULT false;

-- Scheduled reminder time in HH:MM 24h format e.g. "07:00"
ALTER TABLE "habits"
  ADD COLUMN IF NOT EXISTS "scheduledTime" VARCHAR(5);

-- "After I brew my morning coffee…" — habit stacking trigger
ALTER TABLE "habits"
  ADD COLUMN IF NOT EXISTS "habitStackTrigger" VARCHAR(500);

-- Estimated duration in minutes — used by friction guard (warns if >60 min)
ALTER TABLE "habits"
  ADD COLUMN IF NOT EXISTS "estimatedDuration" INTEGER;

-- Enforce one keystone per user at DB level via partial unique index
-- (only one row where isKeystone=true can exist per userId)
CREATE UNIQUE INDEX IF NOT EXISTS "habits_userId_keystone_unique"
  ON "habits" ("userId")
  WHERE "isKeystone" = true;


-- ── 4. streaks additions ──────────────────────────────────────────────────────

-- Whether the user has used their weekly recovery window this week
ALTER TABLE "streaks"
  ADD COLUMN IF NOT EXISTS "weeklyRecoveryUsed" BOOLEAN NOT NULL DEFAULT false;

-- The DATE when the recovery was last used (for week boundary check)
ALTER TABLE "streaks"
  ADD COLUMN IF NOT EXISTS "lastRecoveryDate" DATE;


-- ── 5. habit_scorecards table (Epic 2.2) ─────────────────────────────────────
-- Users list 5–10 recurring behaviors and classify each one before
-- creating their first goal. Reinforcing ones can be converted into habits.

CREATE TABLE IF NOT EXISTS "habit_scorecards" (
  "id"               UUID                      NOT NULL DEFAULT gen_random_uuid(),
  "userId"           UUID                      NOT NULL,
  "behavior"         VARCHAR(255)              NOT NULL,
  "classification"   "ScorecardClassification" NOT NULL DEFAULT 'neutral',
  -- Set when user promotes this entry to a tracked habit
  "convertedHabitId" UUID,
  "createdAt"        TIMESTAMP(3)              NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3)              NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "habit_scorecards_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "habit_scorecards_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "habit_scorecards_convertedHabitId_fkey"
    FOREIGN KEY ("convertedHabitId") REFERENCES "habits"("id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "habit_scorecards_userId_idx" ON "habit_scorecards" ("userId");

-- Auto-update updatedAt on habit_scorecards
CREATE TRIGGER "habit_scorecards_set_updated_at"
  BEFORE UPDATE ON "habit_scorecards"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ── 6. weekly_reviews table (Epic 5.3) ───────────────────────────────────────
-- One row per user per ISO week. Written by the AI nudge worker every Sunday.
-- Read by GET /analytics/weekly-review.

CREATE TABLE IF NOT EXISTS "weekly_reviews" (
  "id"                    UUID         NOT NULL DEFAULT gen_random_uuid(),
  "userId"                UUID         NOT NULL,
  -- ISO week identifier e.g. "2026-W11"
  "weekLabel"             VARCHAR(10)  NOT NULL,
  -- Overall habit completion % for the week
  "consistencyScore"      INTEGER      NOT NULL DEFAULT 0,
  -- Pillar with highest completion %
  "bestPillar"            "PillarType",
  -- Pillar with lowest completion % (or NULL if only one pillar used)
  "weakestPillar"         "PillarType",
  -- Simple AI-generated reflection prompt for the user
  "reflectionPrompt"      TEXT,
  -- Raw breakdown per pillar stored as JSON:
  -- [{ pillar, total, completed, rate }]
  "pillarBreakdown"       JSONB        NOT NULL DEFAULT '[]',
  "createdAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "weekly_reviews_pkey"           PRIMARY KEY ("id"),
  CONSTRAINT "weekly_reviews_userId_week_unique" UNIQUE ("userId", "weekLabel"),
  CONSTRAINT "weekly_reviews_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "weekly_reviews_userId_idx"
  ON "weekly_reviews" ("userId");