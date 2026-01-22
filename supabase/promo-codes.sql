-- Promo Codes System
-- Run this in your Supabase SQL Editor

-- Promo codes table
CREATE TABLE public.promo_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  max_uses INTEGER, -- NULL means unlimited
  current_uses INTEGER DEFAULT 0,
  premium_days INTEGER NOT NULL DEFAULT 30, -- How many days of premium to grant
  expires_at TIMESTAMPTZ, -- When the code itself expires (NULL = never)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track who redeemed what
CREATE TABLE public.promo_redemptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  promo_code_id UUID REFERENCES public.promo_codes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(promo_code_id, user_id) -- Each user can only redeem a code once
);

-- Indexes
CREATE INDEX idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX idx_promo_redemptions_user ON public.promo_redemptions(user_id);

-- RLS
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_redemptions ENABLE ROW LEVEL SECURITY;

-- Anyone can read active promo codes (to validate them)
CREATE POLICY "Anyone can view active promo codes" ON public.promo_codes
  FOR SELECT USING (is_active = TRUE);

-- Users can see their own redemptions
CREATE POLICY "Users can view own redemptions" ON public.promo_redemptions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own redemptions (the API will validate the code first)
CREATE POLICY "Users can redeem codes" ON public.promo_redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- INSERT YOUR LAUNCH PROMO CODE HERE
-- ============================================
INSERT INTO public.promo_codes (code, description, max_uses, premium_days, expires_at)
VALUES (
  'CHESSFRIENDS',           -- The code users will enter
  'Launch beta - 100 free premium memberships',
  100,                       -- Max 100 uses
  30,                        -- 30 days of premium
  '2026-02-28 23:59:59+00'  -- Code expires end of February
);

-- You can create more codes like:
-- INSERT INTO public.promo_codes (code, description, max_uses, premium_days)
-- VALUES ('INFLUENCER50', 'For influencer partnerships', 50, 30);
