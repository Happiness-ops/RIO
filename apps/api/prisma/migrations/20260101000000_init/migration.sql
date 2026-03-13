-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 20260101000000_init
-- Creates the full initial schema:
--   enums, users, user_profiles, goals, habits, checkins, streaks,
--   ai_insights, communities, community_members
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable uuid generation (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TYPE "AuthProvider" AS ENUM (
  'firebase',
  'auth0'
);

CREATE TYPE "GoalType" AS ENUM (
  'short_term',
  'long_term'
);

CREATE TYPE "FrequencyType" AS ENUM (
  'daily',
  'weekly',
  'custom'
);

CREATE TYPE "CheckinStatus" AS ENUM (
  'completed',
  'missed',
  'skipped'
);

CREATE TYPE "TriggerType" AS ENUM (
  'streak_risk',
  'streak_recovery',
  'completion_dropoff',
  'momentum',
  'fallback'
);

CREATE TYPE "CommunityRole" AS ENUM (
  'member',
  'moderator',
  'admin'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE "users" (
  "id"           UUID         NOT NULL DEFAULT gen_random_uuid(),
  "email"        TEXT         NOT NULL,
  "authProvider" "AuthProvider" NOT NULL,
  "timezone"     TEXT         NOT NULL DEFAULT 'UTC',
  "isVerified"   BOOLEAN      NOT NULL DEFAULT false,
  "createdAt"    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  "updatedAt"    TIMESTAMPTZ  NOT NULL DEFAULT now(),

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- ─────────────────────────────────────────────────────────────────────────────
-- USER PROFILES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE "user_profiles" (
  "id"                  UUID         NOT NULL DEFAULT gen_random_uuid(),
  "userId"              UUID         NOT NULL,
  "fullName"            VARCHAR(255),
  "avatarUrl"           TEXT,
  "bio"                 TEXT,
  "onboardingCompleted" BOOLEAN      NOT NULL DEFAULT false,
  "preferences"         JSONB        NOT NULL DEFAULT '{}',
  "createdAt"           TIMESTAMPTZ  NOT NULL DEFAULT now(),
  "updatedAt"           TIMESTAMPTZ  NOT NULL DEFAULT now(),

  CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "user_profiles_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- ─────────────────────────────────────────────────────────────────────────────
-- GOALS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE "goals" (
  "id"          UUID        NOT NULL DEFAULT gen_random_uuid(),
  "userId"      UUID        NOT NULL,
  "title"       VARCHAR(255) NOT NULL,
  "description" TEXT,
  "type"        "GoalType"  NOT NULL DEFAULT 'short_term',
  "startDate"   DATE,
  "endDate"     DATE,
  "isArchived"  BOOLEAN     NOT NULL DEFAULT false,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "goals_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "goals_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX "goals_userId_idx" ON "goals"("userId");

-- ─────────────────────────────────────────────────────────────────────────────
-- HABITS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE "habits" (
  "id"               UUID           NOT NULL DEFAULT gen_random_uuid(),
  "userId"           UUID           NOT NULL,
  "goalId"           UUID           NOT NULL,
  "title"            VARCHAR(255)   NOT NULL,
  "frequency"        "FrequencyType" NOT NULL DEFAULT 'daily',
  "frequencyDetails" JSONB          NOT NULL DEFAULT '{}',
  "isArchived"       BOOLEAN        NOT NULL DEFAULT false,
  "createdAt"        TIMESTAMPTZ    NOT NULL DEFAULT now(),
  "updatedAt"        TIMESTAMPTZ    NOT NULL DEFAULT now(),

  CONSTRAINT "habits_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "habits_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "habits_goalId_fkey"
    FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE CASCADE
);

CREATE INDEX "habits_userId_idx" ON "habits"("userId");
CREATE INDEX "habits_goalId_idx" ON "habits"("goalId");

-- ─────────────────────────────────────────────────────────────────────────────
-- CHECKINS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE "checkins" (
  "id"        UUID            NOT NULL DEFAULT gen_random_uuid(),
  "habitId"   UUID            NOT NULL,
  "status"    "CheckinStatus" NOT NULL,
  "logDate"   DATE            NOT NULL,
  "note"      TEXT,
  "createdAt" TIMESTAMPTZ     NOT NULL DEFAULT now(),

  CONSTRAINT "checkins_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "checkins_habitId_fkey"
    FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE CASCADE,
  -- One check-in per habit per calendar day — enforced at DB level
  CONSTRAINT "checkins_habitId_logDate_key" UNIQUE ("habitId", "logDate")
);

CREATE INDEX "checkins_habitId_idx" ON "checkins"("habitId");

-- ─────────────────────────────────────────────────────────────────────────────
-- STREAKS
-- One record per habit — created automatically when the first check-in is logged
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE "streaks" (
  "habitId"         UUID        NOT NULL,
  "currentStreak"   INT         NOT NULL DEFAULT 0,
  "longestStreak"   INT         NOT NULL DEFAULT 0,
  "lastCheckinDate" DATE,
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "streaks_pkey" PRIMARY KEY ("habitId"),
  CONSTRAINT "streaks_habitId_fkey"
    FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- AI INSIGHTS
-- NOTE: headline and cta columns are added in migration 20260115000002
--       They are included here for reference but created in that migration.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE "ai_insights" (
  "id"          UUID          NOT NULL DEFAULT gen_random_uuid(),
  "userId"      UUID          NOT NULL,
  "triggerType" "TriggerType" NOT NULL,
  "message"     TEXT          NOT NULL,
  "isRead"      BOOLEAN       NOT NULL DEFAULT false,
  "generatedAt" TIMESTAMPTZ   NOT NULL DEFAULT now(),

  CONSTRAINT "ai_insights_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ai_insights_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX "ai_insights_userId_idx" ON "ai_insights"("userId");
CREATE INDEX "ai_insights_userId_generatedAt_idx"
  ON "ai_insights"("userId", "generatedAt" DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- COMMUNITIES (schema only — no API endpoints until v2)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE "communities" (
  "id"          UUID        NOT NULL DEFAULT gen_random_uuid(),
  "name"        VARCHAR(255) NOT NULL,
  "description" TEXT,
  "avatarUrl"   TEXT,
  "isPublic"    BOOLEAN     NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "communities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "community_members" (
  "id"          UUID            NOT NULL DEFAULT gen_random_uuid(),
  "userId"      UUID            NOT NULL,
  "communityId" UUID            NOT NULL,
  "role"        "CommunityRole" NOT NULL DEFAULT 'member',
  "joinedAt"    TIMESTAMPTZ     NOT NULL DEFAULT now(),

  CONSTRAINT "community_members_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "community_members_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "community_members_communityId_fkey"
    FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE CASCADE,
  -- A user can only belong to a community once
  CONSTRAINT "community_members_userId_communityId_key"
    UNIQUE ("userId", "communityId")
);

CREATE INDEX "community_members_communityId_idx" ON "community_members"("communityId");

-- ─────────────────────────────────────────────────────────────────────────────
-- UPDATED_AT trigger function
-- Automatically sets updatedAt = now() on every row update
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updatedAt
CREATE TRIGGER "users_updated_at"
  BEFORE UPDATE ON "users"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER "user_profiles_updated_at"
  BEFORE UPDATE ON "user_profiles"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER "goals_updated_at"
  BEFORE UPDATE ON "goals"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER "habits_updated_at"
  BEFORE UPDATE ON "habits"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER "streaks_updated_at"
  BEFORE UPDATE ON "streaks"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER "communities_updated_at"
  BEFORE UPDATE ON "communities"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();