-- Workout seen puzzles: one row per (user, puzzle) the user has already been
-- served in a Daily Workout. /api/workout/puzzles seeds its exclude set from
-- this table so each session pulls puzzles the user hasn't solved before — the
-- library is ~44k puzzles deep, so a daily user won't repeat for years.
--
-- Populated by /api/workout/finish (upsert, conflict-do-nothing) with every
-- puzzle shown that session (solved + missed).
--
-- NOTE: run this manually in the Supabase SQL editor. Nothing runs it for you.

CREATE TABLE IF NOT EXISTS public.workout_seen_puzzles (
  user_id   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  puzzle_id TEXT        NOT NULL,
  seen_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, puzzle_id)
);

-- Lookup of a user's full seen set, oldest first (used for graceful degrade
-- when a difficulty band runs dry after exclusion).
CREATE INDEX IF NOT EXISTS idx_workout_seen_user_seen_at
  ON public.workout_seen_puzzles (user_id, seen_at ASC);

ALTER TABLE public.workout_seen_puzzles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own seen puzzles"
  ON public.workout_seen_puzzles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own seen puzzles"
  ON public.workout_seen_puzzles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
