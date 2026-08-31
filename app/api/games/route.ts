import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/games
 *
 * The authed user's completed Play Rookie games (game_sessions rows with a
 * result and moves), newest first, capped at 50 — feeds the "Recent Games"
 * list on /profile. Each entry links to /review/[id].
 */
const BASE_COLS =
  'id, started_at, ended_at, result, result_method, player_color, total_moves, rookie_difficulty';
const QUALITY_COLS = `${BASE_COLS}, brilliant_moves, great_moves`;

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const query = (cols: string) =>
    supabase
      .from('game_sessions')
      .select(cols)
      .eq('user_id', user.id)
      .eq('session_type', 'play-rookie')
      .not('result', 'is', null)
      .gt('total_moves', 0)
      .order('started_at', { ascending: false })
      .limit(50);

  let { data, error } = await query(QUALITY_COLS);
  // Quality columns may not exist yet (migration pending) — same fallback
  // game-session.ts uses on write.
  if (error && /brilliant_moves|great_moves|column/i.test(error.message ?? '')) {
    ({ data, error } = await query(BASE_COLS));
  }

  if (error) {
    console.error('games list read failed', error);
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  type Row = {
    id: string;
    started_at: string | null;
    ended_at: string | null;
    result: string | null;
    result_method: string | null;
    player_color: string | null;
    total_moves: number | null;
    rookie_difficulty: number | null;
    brilliant_moves?: number | null;
    great_moves?: number | null;
  };

  const games = ((data ?? []) as unknown as Row[]).map((row) => ({
    id: row.id,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    result: row.result,
    resultMethod: row.result_method,
    playerColor: row.player_color,
    totalMoves: row.total_moves ?? 0,
    rookieDifficulty: row.rookie_difficulty,
    brilliantMoves: row.brilliant_moves ?? 0,
    greatMoves: row.great_moves ?? 0,
  }));

  return NextResponse.json({ games });
}
