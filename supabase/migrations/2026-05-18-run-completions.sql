-- Rookie's Run daily completions.
-- One row per (user, local-TZ date). Streak is DERIVED from this table — never stored.

CREATE TABLE IF NOT EXISTS public.run_completions (
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  run_date       DATE        NOT NULL,
  run_id         TEXT        NOT NULL,
  levels_cleared INTEGER     NOT NULL,
  tz             TEXT        NOT NULL,
  completed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, run_date)
);

CREATE INDEX IF NOT EXISTS idx_run_completions_user_date
  ON public.run_completions (user_id, run_date DESC);

ALTER TABLE public.run_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own run completions"
  ON public.run_completions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own run completions"
  ON public.run_completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own run completions"
  ON public.run_completions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
