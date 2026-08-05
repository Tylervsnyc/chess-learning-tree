-- Rookie rating — the matchmaking number behind "Rookie finds your level".
-- RULES.md §20b. Run on the live DB (Supabase SQL editor).
--
-- TWO statements, and the second one matters as much as the first.
--
-- The level Rookie plays at is DERIVED from rookie_rating, and bout points
-- scale with that level (/api/bout/finish). `profiles` is PATCHable by a
-- logged-in user with the public anon key for any column not named in
-- protect_privileged_profile_columns (CHE-358) — so without the trigger
-- update below, anyone could set rookie_rating = 2500, get matched to Level
-- 10, and collect the 1.6x multiplier on every ranked bout. That is the exact
-- hole CHE-358 closed for billing, one level up.

-- 1. The columns.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS rookie_rating        INTEGER,
  ADD COLUMN IF NOT EXISTS rookie_rating_events INTEGER DEFAULT 0;

-- 2. Lock them to the service role, alongside the billing columns.
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
       -- Added 2026-08-05: drives Rookie's difficulty AND the bout points
       -- multiplier. Written only by lib/rookie/rating.ts via the service role.
       OR NEW.rookie_rating           IS DISTINCT FROM OLD.rookie_rating
       OR NEW.rookie_rating_events    IS DISTINCT FROM OLD.rookie_rating_events THEN
      RAISE EXCEPTION 'profiles: privileged columns cannot be modified directly'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;
  RETURN NEW;
END;
$protect$;

-- The trigger itself already exists and points at this function; recreated
-- here so a fresh database gets it too.
DROP TRIGGER IF EXISTS protect_privileged_profile_columns ON public.profiles;
CREATE TRIGGER protect_privileged_profile_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_privileged_profile_columns();
