-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 20260115000000_add_tasks
-- Adds the task prioritization engine tables for the Web MVP.
-- New:  tasks table, PriorityType enum, TaskStatus enum
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────────────────
-- NEW ENUMS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TYPE "PriorityType" AS ENUM (
  'critical',     -- Must be done today
  'essential',    -- High value, complete this week
  'important',    -- Contributes to goals, not urgent
  'nice_to_have', -- Low urgency
  'someday'       -- Captured, no active pressure
);

CREATE TYPE "TaskStatus" AS ENUM (
  'todo',
  'in_progress',
  'completed',
  'cancelled'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TASKS TABLE
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE "tasks" (
  "id"          UUID           NOT NULL DEFAULT gen_random_uuid(),
  "userId"      UUID           NOT NULL,
  -- goalId is nullable — tasks can exist independently of a goal
  "goalId"      UUID,
  "title"       VARCHAR(255)   NOT NULL,
  "description" TEXT,
  "priority"    "PriorityType" NOT NULL DEFAULT 'important',
  -- position controls order within the same priority tier.
  -- Lower number = higher in list. Frontend sends new positions on drag-drop.
  "position"    INT            NOT NULL DEFAULT 0,
  "status"      "TaskStatus"   NOT NULL DEFAULT 'todo',
  "dueDate"     DATE,
  -- completedAt is set by the service layer when status changes to 'completed'
  "completedAt" TIMESTAMPTZ,
  "isArchived"  BOOLEAN        NOT NULL DEFAULT false,
  "createdAt"   TIMESTAMPTZ    NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ    NOT NULL DEFAULT now(),

  CONSTRAINT "tasks_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "tasks_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "tasks_goalId_fkey"
    FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE SET NULL
);

-- Index for the default task list query: all tasks for user, ordered by priority then position
CREATE INDEX "tasks_userId_idx" ON "tasks"("userId");
CREATE INDEX "tasks_userId_priority_position_idx"
  ON "tasks"("userId", "priority", "position");

-- Auto updatedAt trigger
CREATE TRIGGER "tasks_updated_at"
  BEFORE UPDATE ON "tasks"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();