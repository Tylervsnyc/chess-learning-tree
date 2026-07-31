-- Chess Boxing: store the camera-counted punch total per workout session.
-- The workout's exercise segments now run an opt-in on-device punch counter
-- (components/workout/PunchTracker); app/api/workout/finish writes the total
-- here (best-effort — the finish flow tolerates this column being absent, so
-- running this migration simply turns the writes on).
--
-- Run in the Supabase SQL editor (DDL on the live DB is Tyler-only).

ALTER TABLE workout_sessions
  ADD COLUMN IF NOT EXISTS punches integer NOT NULL DEFAULT 0;
