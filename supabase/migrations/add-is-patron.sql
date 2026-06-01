-- Add is_patron column to profiles table
-- Patron = support-only. Grants NO features — only a gold profile.
-- Kept independent of subscription_status so premium gating is untouched.
-- Run this in Supabase SQL Editor

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_patron BOOLEAN DEFAULT FALSE;
