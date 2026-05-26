-- Daily Workout celebration claims.
-- One row per (user, local-TZ workout date). Used to fire the celebration popup
-- exactly once per day across devices. Insert is the atomic claim — first insert
-- wins, later attempts conflict and silently skip.

CREATE TABLE IF NOT EXISTS public.workout_celebrations (
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_date DATE        NOT NULL,
  tz           TEXT        NOT NULL,
  streak       INTEGER     NOT NULL,
  celebrated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, workout_date)
);

CREATE INDEX IF NOT EXISTS idx_workout_celebrations_user_date
  ON public.workout_celebrations (user_id, workout_date DESC);

ALTER TABLE public.workout_celebrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workout celebrations"
  ON public.workout_celebrations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout celebrations"
  ON public.workout_celebrations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
