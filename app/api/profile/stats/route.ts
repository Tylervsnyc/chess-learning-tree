import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getLifetimeStats } from '@/lib/profile/stats';

/**
 * GET /api/profile/stats
 *
 * Lifetime stats for the signed-in user:
 *   { lessonsCompleted, puzzlesSolved, gamesPlayed, levelsUnlocked, workoutPoints }
 *
 * The queries live in lib/profile/stats.ts, shared with
 * GET /api/profile/dashboard. Count queries run in parallel; a failed
 * individual count degrades to 0 rather than failing the whole request;
 * only a hard profile read failure → 500.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const stats = await getLifetimeStats(supabase, user.id);
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }
}
