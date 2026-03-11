-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 20260115000002_add_insight_headline_cta
-- Adds the headline and cta columns to ai_insights.
--
-- These columns were identified as missing from the original design during
-- architecture review. The API contract and workers both require them.
--
-- headline: short subject line    e.g. "Your Streak Is At Risk!"  (max 8 words)
-- cta:      call-to-action label  e.g. "Check In Now"             (max 4 words)
-- ─────────────────────────────────────────────────────────────────────────────

-- Add headline column.
-- NOT NULL with a default so existing rows (if any in staging) are not broken.
ALTER TABLE "ai_insights"
  ADD COLUMN "headline" VARCHAR(120) NOT NULL DEFAULT '';

-- Add cta column.
ALTER TABLE "ai_insights"
  ADD COLUMN "cta" VARCHAR(80) NOT NULL DEFAULT '';

-- Remove the bootstrap defaults now that the columns exist.
-- All future inserts must supply explicit values — the Gemini worker always does.
ALTER TABLE "ai_insights"
  ALTER COLUMN "headline" DROP DEFAULT;

ALTER TABLE "ai_insights"
  ALTER COLUMN "cta" DROP DEFAULT;