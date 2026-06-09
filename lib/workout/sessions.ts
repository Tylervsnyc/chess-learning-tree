import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Recent workout sessions, newest first — shared by GET /api/workout/sessions
 * and GET /api/profile/dashboard. Keep both routes calling this so they can't
 * drift. The full missed puzzle list is intentionally NOT returned here (fetch
 * a single session for that) — only the count, to keep the list light.
 */

export interface WorkoutSessionSummary {
  id: string;
  createdAt: string;
  points: number;
  correct: number;
  wrong: number;
  perfect: boolean;
  durationMinutes: number | null;
  missedCount: number;
}

export async function getRecentWorkoutSessions(
  supabase: SupabaseClient,
  userId: string,
  limit: number,
): Promise<WorkoutSessionSummary[]> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select(
      'id, created_at, points, correct_count, wrong_count, perfect, duration_minutes, missed_puzzles',
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('workout sessions read failed', error);
    throw new Error('workout sessions read failed');
  }

  return (data ?? []).map((r) => ({
    id: r.id as string,
    createdAt: r.created_at as string,
    points: (r.points as number) ?? 0,
    correct: (r.correct_count as number) ?? 0,
    wrong: (r.wrong_count as number) ?? 0,
    perfect: (r.perfect as boolean) ?? false,
    durationMinutes: (r.duration_minutes as number | null) ?? null,
    missedCount: Array.isArray(r.missed_puzzles) ? r.missed_puzzles.length : 0,
  }));
}
