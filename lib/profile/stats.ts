import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Lifetime stats for a user — shared by GET /api/profile/stats and
 * GET /api/profile/dashboard. Keep both routes calling this so they
 * can't drift.
 */
export interface LifetimeStats {
  lessonsCompleted: number;
  puzzlesSolved: number;
  gamesPlayed: number;
  levelsUnlocked: number;
  workoutPoints: number;
}

/**
 * Count queries run in parallel. A failed individual count degrades to 0
 * rather than failing the whole read; only a hard profile read failure
 * throws (the route maps that to a 500).
 */
export async function getLifetimeStats(
  supabase: SupabaseClient,
  userId: string,
): Promise<LifetimeStats> {
  const [profile, lessons, puzzles, games] = await Promise.all([
    supabase
      .from('profiles')
      .select('unlocked_levels, workout_points')
      .eq('id', userId)
      .single(),
    supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('puzzle_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('correct', true),
    supabase
      .from('game_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('ended_at', 'is', null),
  ]);

  if (profile.error) {
    console.error('profile stats read failed', profile.error);
    throw new Error('profile stats read failed');
  }

  if (lessons.error) console.error('profile stats lessons count failed', lessons.error);
  if (puzzles.error) console.error('profile stats puzzles count failed', puzzles.error);
  if (games.error) console.error('profile stats games count failed', games.error);

  const unlocked = profile.data?.unlocked_levels;

  return {
    lessonsCompleted: lessons.count ?? 0,
    puzzlesSolved: puzzles.count ?? 0,
    gamesPlayed: games.count ?? 0,
    levelsUnlocked: Array.isArray(unlocked) ? unlocked.length : 0,
    workoutPoints:
      typeof profile.data?.workout_points === 'number' ? profile.data.workout_points : 0,
  };
}
