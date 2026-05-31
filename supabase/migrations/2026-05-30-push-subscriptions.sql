-- Web Push subscriptions (CHE-345 / Engine 2 — Retain).
-- One row per browser PushManager subscription. A single user can have many
-- subscriptions (phone, laptop, etc.), so the endpoint is the unique key, not
-- the user. user_id is nullable so anonymous/pre-signup visitors can subscribe
-- too; we backfill it on login if known.
--
-- NOTE: run this manually in the Supabase SQL editor. Nothing runs it for you.

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint    TEXT        NOT NULL UNIQUE,
  p256dh      TEXT        NOT NULL,
  auth        TEXT        NOT NULL,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user
  ON public.push_subscriptions (user_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Owners can see and remove their own subscriptions. Inserts/sends go through
-- the service-role key on the server (bypasses RLS), so no INSERT policy here —
-- the API route is the only writer and it validates the session itself.
CREATE POLICY "Users can view own push subscriptions"
  ON public.push_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own push subscriptions"
  ON public.push_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);
