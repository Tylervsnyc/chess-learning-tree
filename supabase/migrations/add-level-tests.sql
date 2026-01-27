-- Level Unlock Test System Migration
-- Run this in Supabase SQL Editor

-- Add unlocked_levels array to profiles (default to level 1 unlocked)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS unlocked_levels INTEGER[] DEFAULT '{1}';

-- Update existing profiles to have level 1 unlocked
UPDATE public.profiles
SET unlocked_levels = '{1}'
WHERE unlocked_levels IS NULL;

-- Table for tracking level test attempts
CREATE TABLE IF NOT EXISTS public.level_test_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  from_level INTEGER NOT NULL,
  to_level INTEGER NOT NULL,
  variant_id TEXT NOT NULL,
  passed BOOLEAN NOT NULL,
  correct_count INTEGER NOT NULL,
  wrong_count INTEGER NOT NULL,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_level_test_attempts_user
ON public.level_test_attempts(user_id, from_level, to_level);

-- RLS
ALTER TABLE public.level_test_attempts ENABLE ROW LEVEL SECURITY;

-- Users can view their own test attempts
CREATE POLICY "Users can view own test attempts"
ON public.level_test_attempts
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own test attempts
CREATE POLICY "Users can insert own test attempts"
ON public.level_test_attempts
FOR INSERT
WITH CHECK (auth.uid() = user_id);
