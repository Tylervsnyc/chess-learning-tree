-- Workout sessions: one row per completed Daily Workout circuit. Stores the
-- per-session results (points, correct/wrong counts, perfect flag) plus the
-- missed puzzles so the user can replay them later. The lifetime running total
-- still lives on profiles.workout_points (see 2026-06-01-workout-points.sql).
--
-- NOTE: run this manually in the Supabase SQL editor. Nothing runs it for you.

CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id               UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_minutes INTEGER,
  points           INTEGER     NOT NULL DEFAULT 0,
  correct_count    INTEGER     NOT NULL DEFAULT 0,
  wrong_count      INTEGER     NOT NULL DEFAULT 0,
  perfect          BOOLEAN     NOT NULL DEFAULT FALSE,
  missed_puzzles   JSONB       NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_created
  ON public.workout_sessions (user_id, created_at DESC);

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only read and insert their own sessions. The API routes validate
-- the session themselves, but these policies keep the data scoped per-user.
CREATE POLICY "Users can view own workout sessions"
  ON public.workout_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout sessions"
  ON public.workout_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
