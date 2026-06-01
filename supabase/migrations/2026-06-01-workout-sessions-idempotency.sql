-- Make /api/workout/finish idempotent. The client generates one stable
-- client_session_id per workout and re-sends it on every retry of that same
-- session. A UNIQUE (user_id, client_session_id) lets the server detect a
-- replay (network retry, tab refresh, resumed-then-finished) and skip the
-- second points increment — so a double-submit can't inflate workout_points.
--
-- Legacy rows (and any finish that doesn't send an id) keep client_session_id
-- NULL; NULLs are distinct under a UNIQUE constraint, so they never collide and
-- fall back to the old non-idempotent behavior.
--
-- NOTE: run this manually in the Supabase SQL editor. Nothing runs it for you.

ALTER TABLE public.workout_sessions
  ADD COLUMN IF NOT EXISTS client_session_id TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'workout_sessions_user_client_uniq'
  ) THEN
    ALTER TABLE public.workout_sessions
      ADD CONSTRAINT workout_sessions_user_client_uniq UNIQUE (user_id, client_session_id);
  END IF;
END$$;
