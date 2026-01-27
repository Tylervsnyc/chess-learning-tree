-- Add is_admin column to profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Optional: Set specific users as admin by email
-- UPDATE public.profiles SET is_admin = TRUE WHERE email = 'your-email@example.com';
