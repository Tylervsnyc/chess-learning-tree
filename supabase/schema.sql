-- The Chess Path Database Schema
-- Run this in your Supabase SQL Editor
--
-- IMPORTANT: This schema matches RULES.md Section 23
-- Last updated: 2026-02-02

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════════════════
-- PROFILES TABLE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'trial')),
  subscription_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  -- Unlocked levels (array of level numbers, e.g., {1, 2})
  unlocked_levels INTEGER[] DEFAULT '{1}',
  -- Admin flag (all lessons unlocked, admin dashboard access)
  is_admin BOOLEAN DEFAULT FALSE,
  -- Streak tracking
  current_streak INTEGER DEFAULT 0,
  last_activity_date DATE,  -- YYYY-MM-DD, for streak calculation
  -- Lesson limits (when enabled via feature flags)
  lessons_completed_today INTEGER DEFAULT 0,
  last_lesson_date DATE DEFAULT NULL,
  -- Current position in the curriculum (where user lands on /learn)
  current_position TEXT DEFAULT '1.1.1',
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTE: Removed per RULES.md Section 23:
-- - elo_rating (we don't track user ELO)
-- - current_level (derived from unlocked_levels)
-- - best_streak (not needed for MVP)
-- NOTE: current_position replaces the old current_lesson_id concept
-- It stores where the user is in their journey (updated on lesson complete / level test pass)

-- ═══════════════════════════════════════════════════════════════════════════
-- LESSON PROGRESS TABLE
-- Tracks completed lessons per user
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.lesson_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,  -- e.g., '1.3.2' (dot notation)
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  score INTEGER,  -- Accuracy percentage (0-100)
  UNIQUE(user_id, lesson_id)
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PUZZLE ATTEMPTS TABLE
-- Tracks every puzzle attempt for analytics
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.puzzle_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  puzzle_id TEXT NOT NULL,
  lesson_id TEXT,  -- Which lesson this was part of (optional)
  correct BOOLEAN NOT NULL,
  attempts INTEGER DEFAULT 1,  -- How many tries before getting it right
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- DAILY CHALLENGE RESULTS TABLE
-- Tracks daily challenge completions
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.daily_challenge_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_date DATE NOT NULL,  -- YYYY-MM-DD
  score INTEGER NOT NULL DEFAULT 0,  -- Same as puzzles_completed, used for sorting
  puzzles_completed INTEGER NOT NULL DEFAULT 0,  -- How many they solved
  time_used_ms INTEGER,  -- Time used in milliseconds
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_date)
);

-- ═══════════════════════════════════════════════════════════════════════════
-- LEVEL TEST ATTEMPTS TABLE
-- Tracks level test attempts and results
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.level_test_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  transition TEXT NOT NULL,  -- e.g., '1-2', '2-3'
  passed BOOLEAN NOT NULL,
  score INTEGER,  -- Number correct out of 10
  variant_id TEXT,  -- Which variant was used (for anti-memorization)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PUZZLE HISTORY TABLE
-- Tracks recently seen puzzles to avoid repetition
-- Cleanup: delete rows older than 90 days
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.puzzle_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  puzzle_id TEXT NOT NULL,
  seen_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, puzzle_id)
);

-- ═══════════════════════════════════════════════════════════════════════════
-- QUIP HISTORY TABLE
-- Tracks recently seen quips to avoid repetition
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.quip_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quip_id TEXT NOT NULL,  -- e.g., '1.1.g.01' (dot notation)
  seen_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quip_id)
);

-- ═══════════════════════════════════════════════════════════════════════════
-- EMAIL PREFERENCES TABLE
-- User opt-in/out for different email types
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.email_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  streak_reminders BOOLEAN DEFAULT TRUE,  -- "You're about to lose your streak!"
  weekly_digest BOOLEAN DEFAULT TRUE,      -- Weekly progress summary
  marketing BOOLEAN DEFAULT TRUE,          -- New features, tips, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- EMAIL LOG TABLE
-- Tracks sent emails to prevent spam and for analytics
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.email_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  email_type TEXT NOT NULL,  -- 'streak_reminder', 'weekly_digest', 're_engagement', etc.
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE INDEX idx_puzzle_attempts_user ON public.puzzle_attempts(user_id);
CREATE INDEX idx_puzzle_attempts_lesson ON public.puzzle_attempts(user_id, lesson_id);
CREATE INDEX idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX idx_daily_challenge_user_date ON public.daily_challenge_results(user_id, challenge_date);
CREATE INDEX idx_level_test_user ON public.level_test_attempts(user_id);
CREATE INDEX idx_puzzle_history_user ON public.puzzle_history(user_id);
CREATE INDEX idx_puzzle_history_seen ON public.puzzle_history(seen_at);
CREATE INDEX idx_quip_history_user ON public.quip_history(user_id);
CREATE INDEX idx_email_preferences_user ON public.email_preferences(user_id);
CREATE INDEX idx_email_log_user ON public.email_log(user_id);
CREATE INDEX idx_email_log_type ON public.email_log(email_type, sent_at);

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Users can only access their own data
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puzzle_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenge_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puzzle_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quip_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
-- Public read for display_name (for leaderboards)
CREATE POLICY "Anyone can view display names" ON public.profiles
  FOR SELECT USING (true);

-- Lesson progress policies
CREATE POLICY "Users can view own lesson progress" ON public.lesson_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lesson progress" ON public.lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress" ON public.lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Puzzle attempts policies
CREATE POLICY "Users can view own puzzle attempts" ON public.puzzle_attempts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own puzzle attempts" ON public.puzzle_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily challenge policies
-- Public read for leaderboard (anyone can see all scores)
CREATE POLICY "Users can view daily results" ON public.daily_challenge_results
  FOR SELECT USING (true);
CREATE POLICY "Users can insert own daily results" ON public.daily_challenge_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily results" ON public.daily_challenge_results
  FOR UPDATE USING (auth.uid() = user_id);

-- Level test policies
CREATE POLICY "Users can view own level tests" ON public.level_test_attempts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own level tests" ON public.level_test_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Puzzle history policies
CREATE POLICY "Users can view own puzzle history" ON public.puzzle_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own puzzle history" ON public.puzzle_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own puzzle history" ON public.puzzle_history
  FOR DELETE USING (auth.uid() = user_id);

-- Quip history policies
CREATE POLICY "Users can view own quip history" ON public.quip_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quip history" ON public.quip_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own quip history" ON public.quip_history
  FOR DELETE USING (auth.uid() = user_id);

-- Email preferences policies
CREATE POLICY "Users can view own email preferences" ON public.email_preferences
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own email preferences" ON public.email_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own email preferences" ON public.email_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Email log policies (read-only for users, system writes)
CREATE POLICY "Users can view own email log" ON public.email_log
  FOR SELECT USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION NOTES
-- Run these if updating from an existing database
-- ═══════════════════════════════════════════════════════════════════════════

-- To drop deprecated columns from profiles:
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS elo_rating;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS current_lesson_id;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS current_level;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS best_streak;

-- To drop deprecated tables:
-- DROP TABLE IF EXISTS public.theme_performance;
-- DROP TABLE IF EXISTS public.daily_challenges;  -- replaced by daily_challenge_results

-- To add new columns to profiles:
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_activity_date DATE;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_position TEXT DEFAULT '1.1.1';

-- To migrate existing users' current_position (set to lesson after their last completed):
-- See scripts/migrate-current-position.sql for the full migration

-- To cleanup old puzzle_history (older than 90 days):
-- DELETE FROM public.puzzle_history WHERE seen_at < NOW() - INTERVAL '90 days';
