-- Grade ONCE: per-move grades for a play-rookie game, written after the
-- post-game graded pass (GRADE_DEPTH, level-scaled Legendary gates, book pass).
-- Written by POST /api/games/[id]/grades (service role, owner-checked) and by
-- scripts/backfill-move-grades.ts --apply. /review shows these instead of
-- re-grading, so the badges match the saved counts forever.
--
-- Shape: { "v": 1, "depth": 14, "level": 3, "grades": ["book", "good", ...] }
-- one classification per ply, index-aligned with session_moves order.
-- NULL = not graded yet (the graded pass never finished, or a pre-2026-09-21
-- game the backfill hasn't reached) — /review falls back to re-grading.
--
-- Code feature-detects this column: everything works before it exists.
-- Run in the Supabase SQL editor.

alter table public.game_sessions
  add column if not exists move_grades jsonb;
