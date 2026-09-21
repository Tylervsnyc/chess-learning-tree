import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/games/[id]
 *
 * One game session + its moves, for /review/[id]. The session must belong to
 * the authed user — anything else is a 404 (ownership is part of the query,
 * so a foreign id and a missing id are indistinguishable).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const BASE_COLS = 'id, started_at, ended_at, result, result_method, player_color, total_moves, rookie_difficulty';
  const read = (cols: string) => supabase
    .from('game_sessions')
    .select(cols)
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();
  // move_grades may not exist yet (supabase/migrations/2026-09-21-move-grades.sql).
  let { data: sessionData, error: sessionError } = await read(`${BASE_COLS}, move_grades`);
  if (sessionError && /move_grades|column/i.test(sessionError.message ?? '')) {
    ({ data: sessionData, error: sessionError } = await read(BASE_COLS));
  }
  const session = sessionData as unknown as {
    id: string; started_at: string | null; ended_at: string | null; result: string | null;
    result_method: string | null; player_color: string | null; total_moves: number | null;
    rookie_difficulty: number | null; move_grades?: unknown;
  } | null;

  if (sessionError) {
    console.error('game session read failed', sessionError);
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }
  if (!session) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const { data: moveRows, error: movesError } = await supabase
    .from('session_moves')
    .select('move_number, moved_by, move_san, from_square, to_square, fen_after, is_check')
    .eq('session_id', id)
    .not('move_san', 'is', null)
    .order('move_number', { ascending: true });

  if (movesError) {
    console.error('session moves read failed', movesError);
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }

  return NextResponse.json({
    session: {
      id: session.id,
      startedAt: session.started_at,
      endedAt: session.ended_at,
      result: session.result,
      resultMethod: session.result_method,
      playerColor: session.player_color,
      totalMoves: session.total_moves ?? 0,
      rookieDifficulty: session.rookie_difficulty,
      // The game's saved grades — /review shows these instead of re-grading.
      moveGrades: session.move_grades ?? null,
    },
    moves: (moveRows ?? []).map((m) => ({
      moveNumber: m.move_number,
      movedBy: m.moved_by,
      san: m.move_san,
      from: m.from_square,
      to: m.to_square,
      fenAfter: m.fen_after,
      isCheck: m.is_check,
    })),
  });
}
