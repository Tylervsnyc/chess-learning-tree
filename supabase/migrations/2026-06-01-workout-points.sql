-- Workout points: a lifetime running total of points earned in the Daily
-- Workout loop (Play + Path + Run). Stored on the profile so it survives across
-- sessions and can be read cheaply for profile stats.
--
-- NOTE: run this manually in the Supabase SQL editor. Nothing runs it for you.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS workout_points INTEGER NOT NULL DEFAULT 0;
