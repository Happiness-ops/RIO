-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 20260115000001_add_push_subscriptions
-- Adds browser push notification subscription storage for the Web MVP.
-- New: users_push_subscriptions table
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE "users_push_subscriptions" (
  "id"        UUID        NOT NULL DEFAULT gen_random_uuid(),
  "userId"    UUID        NOT NULL,
  -- endpoint is the unique push service URL provided by the browser.
  -- It is unique globally — one subscription record per browser + user pair.
  "endpoint"  TEXT        NOT NULL,
  -- p256dh and auth are the browser-generated ECDH encryption keys.
  -- Required to encrypt the push message payload before delivery.
  "p256dh"    TEXT        NOT NULL,
  "auth"      TEXT        NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "users_push_subscriptions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "users_push_subscriptions_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  -- One subscription record per endpoint globally.
  -- If the same browser re-subscribes, the record is upserted (not duplicated).
  CONSTRAINT "users_push_subscriptions_endpoint_key" UNIQUE ("endpoint")
);

CREATE INDEX "users_push_subscriptions_userId_idx"
  ON "users_push_subscriptions"("userId");