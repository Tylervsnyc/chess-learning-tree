-- Repertoire system: opening tree analysis + spaced repetition drilling
-- Run this in Supabase SQL Editor

-- Add chess platform usernames to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lichess_username TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS chesscom_username TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS repertoire_last_synced TIMESTAMPTZ;

-- Cached opening tree (one per user per color)
CREATE TABLE IF NOT EXISTS public.repertoire_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  color TEXT NOT NULL CHECK (color IN ('white', 'black')),
  tree_data JSONB NOT NULL,
  games_analyzed INT NOT NULL DEFAULT 0,
  last_built_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, color)
);

ALTER TABLE public.repertoire_trees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own repertoire trees"
  ON public.repertoire_trees FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own repertoire trees"
  ON public.repertoire_trees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own repertoire trees"
  ON public.repertoire_trees FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own repertoire trees"
  ON public.repertoire_trees FOR DELETE
  USING (auth.uid() = user_id);

-- Gap analysis results
CREATE TABLE IF NOT EXISTS public.repertoire_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  color TEXT NOT NULL CHECK (color IN ('white', 'black')),
  gaps JSONB NOT NULL,
  summary TEXT,
  diagnosed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, color)
);

ALTER TABLE public.repertoire_diagnoses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own diagnoses"
  ON public.repertoire_diagnoses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnoses"
  ON public.repertoire_diagnoses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diagnoses"
  ON public.repertoire_diagnoses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diagnoses"
  ON public.repertoire_diagnoses FOR DELETE
  USING (auth.uid() = user_id);

-- SRS cards for line drilling
CREATE TABLE IF NOT EXISTS public.srs_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fen TEXT NOT NULL,
  correct_move_san TEXT NOT NULL,
  correct_move_uci TEXT NOT NULL,
  line_name TEXT,
  color TEXT NOT NULL CHECK (color IN ('white', 'black')),
  level INT NOT NULL DEFAULT 0,
  next_review_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_reviewed_at TIMESTAMPTZ,
  total_reviews INT NOT NULL DEFAULT 0,
  correct_reviews INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, fen, correct_move_uci)
);

ALTER TABLE public.srs_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own SRS cards"
  ON public.srs_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own SRS cards"
  ON public.srs_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own SRS cards"
  ON public.srs_cards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own SRS cards"
  ON public.srs_cards FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for efficient SRS queries
CREATE INDEX IF NOT EXISTS idx_srs_cards_due
  ON public.srs_cards(user_id, next_review_at) WHERE level > 0;

CREATE INDEX IF NOT EXISTS idx_srs_cards_new
  ON public.srs_cards(user_id, level) WHERE level = 0;
