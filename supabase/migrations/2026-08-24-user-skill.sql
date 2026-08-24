-- Skill profile (Chess Boxing "learn from mistakes", layer 1).
-- One row per (user, Lichess puzzle theme). Aggregated from every puzzle
-- result in a workout: attempts, correct, time, and the ratings of misses.
-- Everything downstream (weekly weakness report, targeted round) READS this;
-- nothing else writes it. Written by /api/workout/finish via lib/skill-profile.ts
-- behind FEATURE_FLAGS.SKILL_PROFILE.
--
-- NOTE: run this manually in the Supabase SQL editor. Nothing runs it for you.

CREATE TABLE IF NOT EXISTS public.user_skill (
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme            TEXT        NOT NULL,
  attempts         INTEGER     NOT NULL DEFAULT 0,
  correct          INTEGER     NOT NULL DEFAULT 0,
  -- Sum of puzzle ratings on misses / solves (avg = sum / count).
  miss_rating_sum  BIGINT      NOT NULL DEFAULT 0,
  solve_rating_sum BIGINT      NOT NULL DEFAULT 0,
  -- Sum of solve time (ms) on CORRECT answers only; slow-but-right is a signal.
  solve_time_ms    BIGINT      NOT NULL DEFAULT 0,
  last_seen        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, theme)
);

CREATE INDEX IF NOT EXISTS idx_user_skill_user_last_seen
  ON public.user_skill (user_id, last_seen DESC);

ALTER TABLE public.user_skill ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skill profile"
  ON public.user_skill FOR SELECT USING (auth.uid() = user_id);
-- Writes are service-role only (finish route), no user INSERT/UPDATE policy.

-- Atomic per-theme increment, one call per theme per session.
CREATE OR REPLACE FUNCTION public.bump_user_skill(
  p_user_id UUID, p_theme TEXT, p_attempts INT, p_correct INT,
  p_miss_rating_sum BIGINT, p_solve_rating_sum BIGINT, p_solve_time_ms BIGINT
) RETURNS VOID LANGUAGE sql SECURITY DEFINER AS $$
  INSERT INTO public.user_skill
    (user_id, theme, attempts, correct, miss_rating_sum, solve_rating_sum, solve_time_ms, last_seen)
  VALUES
    (p_user_id, p_theme, p_attempts, p_correct, p_miss_rating_sum, p_solve_rating_sum, p_solve_time_ms, NOW())
  ON CONFLICT (user_id, theme) DO UPDATE SET
    attempts         = user_skill.attempts + EXCLUDED.attempts,
    correct          = user_skill.correct + EXCLUDED.correct,
    miss_rating_sum  = user_skill.miss_rating_sum + EXCLUDED.miss_rating_sum,
    solve_rating_sum = user_skill.solve_rating_sum + EXCLUDED.solve_rating_sum,
    solve_time_ms    = user_skill.solve_time_ms + EXCLUDED.solve_time_ms,
    last_seen        = NOW();
$$;
