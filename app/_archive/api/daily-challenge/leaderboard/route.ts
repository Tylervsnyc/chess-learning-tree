import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  score: number;
  puzzlesCompleted: number;
  timeMs: number;
  isCurrentUser: boolean;
}

/**
 * GET /api/daily-challenge/leaderboard
 * Returns today's daily challenge leaderboard
 * Query params:
 *   - date: optional date in YYYY-MM-DD format (defaults to today)
 *   - limit: number of entries to return (default 10, max 50)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);

  const supabase = await createClient();

  // Get current user (optional - for highlighting their position)
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch top scores for the day
  // Sort by puzzles completed (desc), then time used (asc) per RULES.md Section 13
  const { data: results, error } = await supabase
    .from('daily_challenge_results')
    .select('puzzles_completed, time_used_ms, user_id')
    .eq('challenge_date', date)
    .order('puzzles_completed', { ascending: false })
    .order('time_used_ms', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({
      error: 'Failed to fetch leaderboard',
      details: error.message,
      code: error.code
    }, { status: 500 });
  }

  // Fetch display names for all users in results
  const userIds = (results || []).map(r => r.user_id);
  const { data: profiles } = userIds.length > 0
    ? await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds)
    : { data: [] };

  // Create a map of user_id -> display_name
  const displayNameMap = new Map<string, string>();
  (profiles || []).forEach(p => {
    displayNameMap.set(p.id, p.display_name || 'Anonymous');
  });

  // Transform results into leaderboard entries
  const leaderboard: LeaderboardEntry[] = (results || []).map((result, index) => {
    return {
      rank: index + 1,
      displayName: displayNameMap.get(result.user_id) || 'Anonymous',
      score: result.puzzles_completed,
      puzzlesCompleted: result.puzzles_completed,
      timeMs: result.time_used_ms || 0,
      isCurrentUser: user?.id === result.user_id,
    };
  });

  // If user is logged in but not in top results, find their position
  let userEntry: LeaderboardEntry | null = null;
  if (user && !leaderboard.find(e => e.isCurrentUser)) {
    const { data: userResult } = await supabase
      .from('daily_challenge_results')
      .select('puzzles_completed, time_used_ms')
      .eq('challenge_date', date)
      .eq('user_id', user.id)
      .single();

    if (userResult) {
      // Count how many people solved more puzzles
      const { count } = await supabase
        .from('daily_challenge_results')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_date', date)
        .gt('puzzles_completed', userResult.puzzles_completed);

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

      userEntry = {
        rank: (count || 0) + 1,
        displayName: profile?.display_name || 'You',
        score: userResult.puzzles_completed,
        puzzlesCompleted: userResult.puzzles_completed,
        timeMs: userResult.time_used_ms || 0,
        isCurrentUser: true,
      };
    }
  }

  // Get actual total participant count for today
  const { count: totalCount } = await supabase
    .from('daily_challenge_results')
    .select('*', { count: 'exact', head: true })
    .eq('challenge_date', date);

  return NextResponse.json({
    date,
    leaderboard,
    userEntry,
    totalParticipants: totalCount || 0,
  });
}
