-- Opening progress: tracks which lessons a user has completed per opening
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.opening_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  opening_slug TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, opening_slug, lesson_id)
);

ALTER TABLE public.opening_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own opening progress"
  ON public.opening_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own opening progress"
  ON public.opening_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own opening progress"
  ON public.opening_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookups: all progress for a user, or per opening
CREATE INDEX IF NOT EXISTS idx_opening_progress_user
  ON public.opening_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_opening_progress_user_slug
  ON public.opening_progress(user_id, opening_slug);
