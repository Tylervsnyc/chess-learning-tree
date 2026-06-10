-- CHE-387: DB-truth signup attribution. PostHog loses IG one-tap OAuth signups
-- (in-app browser -> system browser handoff returns the user as a fresh person),
-- so first-touch attribution is captured in a first-party cookie on landing and
-- stamped onto the profile at signup. The daily report counts signups from these
-- columns instead of the signup_completed event.
--
-- Stamped once at signup (only if first_touch_at IS NULL) — first touch is frozen.
-- Run manually in the Supabase SQL editor.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS first_touch_source text,
  ADD COLUMN IF NOT EXISTS first_touch_medium text,
  ADD COLUMN IF NOT EXISTS first_touch_campaign text,
  ADD COLUMN IF NOT EXISTS first_touch_referrer text,
  ADD COLUMN IF NOT EXISTS first_touch_at timestamptz;
