-- The Chess Path Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/ruseupjmldymfvpybqdl/sql)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  elo_rating INTEGER DEFAULT 800,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'trial')),
  subscription_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Puzzle attempts - tracks every puzzle a user attempts
CREATE TABLE public.puzzle_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  puzzle_id TEXT NOT NULL,
  themes TEXT[] DEFAULT '{}',
  rating INTEGER,
  correct BOOLEAN NOT NULL,
  time_spent_ms INTEGER,
  fen TEXT,
  solution TEXT,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily challenge tracking
CREATE TABLE public.daily_challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_date DATE NOT NULL,
  puzzle_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  correct BOOLEAN,
  time_spent_ms INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_date)
);

-- Lesson progress - tracks progress through learning trees
CREATE TABLE public.lesson_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,
  tree_id TEXT NOT NULL, -- e.g., '400-800', '800-1200'
  puzzles_completed INTEGER DEFAULT 0,
  puzzles_total INTEGER,
  accuracy DECIMAL(5,2),
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- Theme performance - aggregated stats per theme
CREATE TABLE public.theme_performance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  theme TEXT NOT NULL,
  attempts INTEGER DEFAULT 0,
  solved INTEGER DEFAULT 0,
  last_attempted_at TIMESTAMPTZ,
  UNIQUE(user_id, theme)
);

-- Indexes for performance
CREATE INDEX idx_puzzle_attempts_user ON public.puzzle_attempts(user_id);
CREATE INDEX idx_puzzle_attempts_user_themes ON public.puzzle_attempts(user_id, themes);
CREATE INDEX idx_daily_challenges_user_date ON public.daily_challenges(user_id, challenge_date);
CREATE INDEX idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX idx_theme_performance_user ON public.theme_performance(user_id);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puzzle_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only access their own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own puzzle attempts" ON public.puzzle_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own puzzle attempts" ON public.puzzle_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own daily challenges" ON public.daily_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily challenges" ON public.daily_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily challenges" ON public.daily_challenges FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own lesson progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lesson progress" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress" ON public.lesson_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own theme performance" ON public.theme_performance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own theme performance" ON public.theme_performance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own theme performance" ON public.theme_performance FOR UPDATE USING (auth.uid() = user_id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update theme performance after puzzle attempt
CREATE OR REPLACE FUNCTION public.update_theme_performance()
RETURNS TRIGGER AS $$
DECLARE
  theme_name TEXT;
BEGIN
  FOREACH theme_name IN ARRAY NEW.themes
  LOOP
    INSERT INTO public.theme_performance (user_id, theme, attempts, solved, last_attempted_at)
    VALUES (NEW.user_id, theme_name, 1, CASE WHEN NEW.correct THEN 1 ELSE 0 END, NOW())
    ON CONFLICT (user_id, theme)
    DO UPDATE SET
      attempts = theme_performance.attempts + 1,
      solved = theme_performance.solved + CASE WHEN NEW.correct THEN 1 ELSE 0 END,
      last_attempted_at = NOW();
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update theme performance
DROP TRIGGER IF EXISTS on_puzzle_attempt ON public.puzzle_attempts;
CREATE TRIGGER on_puzzle_attempt
  AFTER INSERT ON public.puzzle_attempts
  FOR EACH ROW EXECUTE FUNCTION public.update_theme_performance();
