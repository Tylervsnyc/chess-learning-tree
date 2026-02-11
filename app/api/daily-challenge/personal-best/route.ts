import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/daily-challenge/personal-best
 * Returns the current user's past daily challenge results.
 * Query params:
 *   - limit: number of entries to return (default 10, max 50)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);

  const supabase = await createClient();

  // Require authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Fetch user's past results, most recent first
  const { data: results, error } = await supabase
    .from('daily_challenge_results')
    .select('challenge_date, puzzles_completed, time_used_ms')
    .eq('user_id', user.id)
    .order('challenge_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching personal bests:', error);
    return NextResponse.json({
      error: 'Failed to fetch personal bests',
      details: error.message,
    }, { status: 500 });
  }

  // Get total game count
  const { count: totalGames } = await supabase
    .from('daily_challenge_results')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const personalBests = (results || []).map(r => ({
    challengeDate: r.challenge_date,
    puzzlesCompleted: r.puzzles_completed,
    timeMs: r.time_used_ms || 0,
  }));

  return NextResponse.json({
    personalBests,
    totalGames: totalGames || 0,
  });
}
