-- Email System Tables for The Chess Path
-- Run this in your Supabase SQL Editor after the main schema

-- User email preferences
CREATE TABLE public.email_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  streak_warnings BOOLEAN DEFAULT TRUE,
  weekly_digest BOOLEAN DEFAULT TRUE,
  marketing BOOLEAN DEFAULT TRUE,
  unsubscribed_all BOOLEAN DEFAULT FALSE,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email history/logging
CREATE TABLE public.email_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL,
  email_address TEXT NOT NULL,
  resend_id TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'bounced', 'failed')),
  metadata JSONB,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_email_preferences_user ON public.email_preferences(user_id);
CREATE INDEX idx_email_log_user ON public.email_log(user_id);
CREATE INDEX idx_email_log_type ON public.email_log(email_type);
CREATE INDEX idx_email_log_sent_at ON public.email_log(sent_at);

-- Row Level Security
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_preferences
CREATE POLICY "Users can view own email preferences"
  ON public.email_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email preferences"
  ON public.email_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own email preferences"
  ON public.email_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for email_log - users can view their own logs
CREATE POLICY "Users can view own email logs"
  ON public.email_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can access all email data (for cron jobs)
-- Note: Cron jobs should use the service role key

-- Function to create default email preferences on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_profile_email_prefs()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.email_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create email preferences when profile is created
DROP TRIGGER IF EXISTS on_profile_created_email_prefs ON public.profiles;
CREATE TRIGGER on_profile_created_email_prefs
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_email_prefs();

-- Backfill existing users with default email preferences
INSERT INTO public.email_preferences (user_id)
SELECT id FROM public.profiles
WHERE id NOT IN (SELECT user_id FROM public.email_preferences)
ON CONFLICT (user_id) DO NOTHING;
