-- Chess Boxing: store the camera-counted punch total per workout session.
-- The workout's exercise segments now run an opt-in on-device punch counter
-- (components/workout/PunchTracker); app/api/workout/finish writes the total
-- here (best-effort — the finish flow tolerates this column being absent, so
-- running this migration simply turns the writes on).
--
-- Run in the Supabase SQL editor (DDL on the live DB is Tyler-only).

ALTER TABLE workout_sessions
  ADD COLUMN IF NOT EXISTS punches integer NOT NULL DEFAULT 0;

-- Client-supplied count → bound it at the DB too (API clamps to the same
-- ceiling; see MAX_SESSION_PUNCHES in app/api/workout/finish/route.ts).
ALTER TABLE workout_sessions DROP CONSTRAINT IF EXISTS punches_sane;
ALTER TABLE workout_sessions ADD CONSTRAINT punches_sane
  CHECK (punches >= 0 AND punches <= 10000);
