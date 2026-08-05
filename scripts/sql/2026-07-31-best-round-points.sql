-- Chess Boxing scoring v2: best single-round score within a workout session.
-- Feeds the daily leaderboard (ranked by MAX(best_round_points) per user).
-- Run manually in the Supabase SQL editor. Code degrades gracefully both
-- before and after this runs (finish route drops the column on error; the
-- leaderboard falls back to best single-session points).
alter table workout_sessions add column if not exists best_round_points integer;
