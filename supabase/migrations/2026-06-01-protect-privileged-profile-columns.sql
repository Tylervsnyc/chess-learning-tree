-- Lock the billing / feature-gating columns on `profiles` so end users can't
-- edit them directly. The "Users can update own profile" RLS policy is
-- column-blind: with only `USING (auth.uid() = id)` it lets any logged-in user
-- PATCH their own row — including subscription_status and is_admin — with the
-- public anon key. That means anyone technical could grant themselves Premium
-- (or ADMIN) for free.
--
-- These columns are only ever written by trusted code:
--   * Stripe webhook + guest checkout  -> SERVICE ROLE (createServiceClient)
--   * verify-subscription, checkout,    -> switched to SERVICE ROLE in the same
--     sync-subscription                    change that adds this migration
--   * is_admin                          -> set by Tyler in the dashboard only
-- A BEFORE UPDATE trigger blocks the change only when the caller is the
-- end-user PostgREST role (`authenticated` / `anon`); every trusted role passes
-- through untouched. NOT security definer — we need current_user to be the
-- *caller's* role, not the function owner.
--
-- NOTE: uses a NAMED dollar-quote tag ($protect$) instead of bare $$ — the
-- Supabase SQL editor (and markdown/math renderers) can mangle bare $$.
--
-- DEPLOY ORDER MATTERS: ship the app code FIRST (so verify-subscription,
-- checkout, and sync-subscription write via the service role), THEN run this.
-- Running it before the deploy would block the old user-context writes and
-- break premium self-heal + checkout's customer-id link.
--
-- NOTE: run this manually in the Supabase SQL editor. Nothing runs it for you.

CREATE OR REPLACE FUNCTION public.protect_privileged_profile_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $protect$
BEGIN
  IF current_user IN ('authenticated', 'anon') THEN
    IF NEW.subscription_status     IS DISTINCT FROM OLD.subscription_status
       OR NEW.subscription_expires_at IS DISTINCT FROM OLD.subscription_expires_at
       OR NEW.is_patron            IS DISTINCT FROM OLD.is_patron
       OR NEW.is_admin             IS DISTINCT FROM OLD.is_admin
       OR NEW.stripe_customer_id   IS DISTINCT FROM OLD.stripe_customer_id THEN
      RAISE EXCEPTION 'profiles: privileged columns (subscription_status, subscription_expires_at, is_patron, is_admin, stripe_customer_id) cannot be modified directly'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;
  RETURN NEW;
END;
$protect$;

DROP TRIGGER IF EXISTS protect_privileged_profile_columns ON public.profiles;

CREATE TRIGGER protect_privileged_profile_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_privileged_profile_columns();
