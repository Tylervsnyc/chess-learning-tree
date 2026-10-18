-- Rookie Pro — SQL for Tyler to run in the Supabase SQL editor (live DB,
-- project ruseupjmldymfvpybqdl). Agents never run DDL. Safe to re-run.
-- The code is defensive: until this runs, review_usage reads/writes are
-- skipped (reviews are simply unmetered) and pro_trial_used_at reads as
-- "trial not used". Nothing breaks before OR after.
--
-- Only matters once FEATURE_FLAGS.PRO is on, but run it BEFORE flipping it.

-- 1. One full game review a day for free accounts (lib/pro/review-usage.ts,
--    /api/coach-review). One row per user + game (game_key = hash of the move
--    list), so the instant + deep passes of one game and re-opening a game
--    never count twice. Written by the service role only.
CREATE TABLE IF NOT EXISTS public.review_usage (
  user_id    UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_key   TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, game_key)
);
CREATE INDEX IF NOT EXISTS idx_review_usage_user_created
  ON public.review_usage (user_id, created_at);

ALTER TABLE public.review_usage ENABLE ROW LEVEL SECURITY;
-- Users may READ their own rows (/api/pro/limits counts reviewsToday under the
-- caller's RLS). No insert/update/delete policy: only the service role writes.
DROP POLICY IF EXISTS "review_usage_select_own" ON public.review_usage;
CREATE POLICY "review_usage_select_own" ON public.review_usage
  FOR SELECT USING (auth.uid() = user_id);

-- 2. One free trial per PERSON across all three apps + the web
--    (lib/pro/trial.ts). Stamped by the RevenueCat webhook (period_type TRIAL)
--    and by Stripe (subscription status 'trialing').
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS pro_trial_used_at TIMESTAMPTZ;

-- 3. Lock pro_trial_used_at to the service role, alongside the billing columns
--    (CHE-358). Without this a logged-in user could PATCH it back to NULL with
--    the anon key and take another web trial. This is the FULL current
--    function (supabase/migrations/2026-08-05-rookie-rating.sql) plus one line.
CREATE OR REPLACE FUNCTION public.protect_privileged_profile_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $protect$
BEGIN
  IF current_user IN ('authenticated', 'anon') THEN
    IF NEW.subscription_status       IS DISTINCT FROM OLD.subscription_status
       OR NEW.subscription_expires_at IS DISTINCT FROM OLD.subscription_expires_at
       OR NEW.is_patron               IS DISTINCT FROM OLD.is_patron
       OR NEW.is_admin                IS DISTINCT FROM OLD.is_admin
       OR NEW.stripe_customer_id      IS DISTINCT FROM OLD.stripe_customer_id
       OR NEW.rookie_rating           IS DISTINCT FROM OLD.rookie_rating
       OR NEW.rookie_rating_events    IS DISTINCT FROM OLD.rookie_rating_events
       -- Added 2026-10-18: Rookie Pro one-trial-per-person stamp.
       OR NEW.pro_trial_used_at       IS DISTINCT FROM OLD.pro_trial_used_at THEN
      RAISE EXCEPTION 'profiles: privileged columns cannot be modified directly'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;
  RETURN NEW;
END;
$protect$;

-- The trigger already exists and points at this function; nothing else to do.

-- 4. (Optional) Backfill: anyone who is trialing on Stripe today has used
--    their trial. Run only if there are web trials live before this ships.
-- UPDATE public.profiles SET pro_trial_used_at = NOW()
--   WHERE subscription_status = 'trial' AND pro_trial_used_at IS NULL;

-- Verify:
-- SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'profiles' AND column_name = 'pro_trial_used_at';
-- SELECT count(*) FROM public.review_usage;
