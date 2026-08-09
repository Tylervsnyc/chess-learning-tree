-- ═══════════════════════════════════════════════════════════════════════════
-- USER ACHIEVEMENTS (Chess Boxing achievements, Phase 1)
-- Plan: docs/chess-boxing-achievements-plan.md
--
-- One row per achievement per user. The catalog (names, Rookie's lines,
-- thresholds) lives in code: lib/achievements/catalog.ts — the DB stores only
-- unlock state. `tier` is the belt rung: for level-tiered achievements the
-- Rookie level (1-10) it was earned at, for count ladders the highest
-- threshold rung reached, 1 for binary unlocks, 0 while a counter is still
-- below the first rung. `progress` is the running counter for count ladders.
-- `seen` = has the unlock animation played (backfilled rows start unseen).
--
-- TRUST MODEL (same as bout_sessions): SELECT own rows only; NO client
-- INSERT/UPDATE policy — all writes go through the service role in the finish
-- routes, so a user cannot hand-mint an Undisputed belt with the anon key.
--
-- Run by hand in the Supabase SQL editor (like every migration here). All
-- code degrades gracefully until this runs.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  tier integer NOT NULL DEFAULT 1,
  progress integer,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  upgraded_at timestamptz,
  seen boolean NOT NULL DEFAULT false,
  UNIQUE (user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

-- DOWN
-- DROP TABLE public.user_achievements;
