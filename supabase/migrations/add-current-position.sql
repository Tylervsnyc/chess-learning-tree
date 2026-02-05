-- Migration: Add current_position to profiles
--
-- This migration adds the current_position field which tracks where
-- the user is in their journey (determines scroll position on /learn page).
--
-- Run this in your Supabase SQL Editor
-- Last updated: 2026-02-05

-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 1: Add the column if it doesn't exist
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS current_position TEXT DEFAULT '1.1.1';

-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 2: Populate current_position for existing users
--
-- Logic:
-- - Users with no completed lessons → '1.1.1' (default, already set)
-- - Users with completed lessons → set to their most recently completed lesson
--   The app will correct it to the "next" lesson on their next completion
--
-- Note: We set it to the LAST completed lesson because we can't easily calculate
-- the "next" lesson in SQL (curriculum order is defined in TypeScript).
-- The fix in useProgress.ts ensures that even replays update currentPosition,
-- so the next time the user completes ANY lesson, it will sync correctly.
-- ═══════════════════════════════════════════════════════════════════════════

-- Set current_position to the most recently completed lesson for each user
UPDATE public.profiles p
SET current_position = (
  SELECT lp.lesson_id
  FROM public.lesson_progress lp
  WHERE lp.user_id = p.id
  ORDER BY lp.completed_at DESC
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1
  FROM public.lesson_progress lp
  WHERE lp.user_id = p.id
);

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICATION
-- Run this to verify the migration worked
-- ═══════════════════════════════════════════════════════════════════════════

-- Check users with their current_position:
-- SELECT
--   id,
--   email,
--   current_position,
--   (SELECT COUNT(*) FROM lesson_progress WHERE user_id = profiles.id) as completed_count
-- FROM profiles
-- ORDER BY created_at DESC
-- LIMIT 20;
