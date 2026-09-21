import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { parseStoredGrades } from '@/lib/review/grade';
import { writeGameGrades } from '@/lib/review/grades-store';

/**
 * POST /api/games/[id]/grades  { grades: StoredMoveGrades }
 *
 * Grade ONCE: /play's graded pass (lib/review/grade at GRADE_DEPTH) posts the
 * game's per-move grades here when it finishes. The counts are derived from
 * the grades server-side (never trusted from the body), the row must belong to
 * the caller, and an already-graded game is left alone. Lifetime totals are
 * recomputed from the games, so a retry can't double count.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body: { grades?: unknown } = {};
  try { body = await req.json(); } catch { /* empty */ }

  // Ownership is part of the query — a foreign id reads as missing.
  const { data: session } = await supabase
    .from('game_sessions')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();
  if (!session) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const { data: moveRows, error: movesError } = await supabase
    .from('session_moves')
    .select('moved_by')
    .eq('session_id', id)
    .not('move_san', 'is', null)
    .order('move_number', { ascending: true });
  if (movesError) return NextResponse.json({ error: 'read failed' }, { status: 500 });

  const movedBy = (moveRows ?? []).map(m => m.moved_by as string);
  const grades = parseStoredGrades(body.grades, movedBy.length);
  if (!grades) return NextResponse.json({ error: 'grades do not match this game' }, { status: 400 });

  try {
    const result = await writeGameGrades(createServiceClient(), {
      sessionId: id,
      userId: user.id,
      grades,
      movedBy,
      onlyIfUngraded: true,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('grades write failed', err);
    return NextResponse.json({ error: 'write failed' }, { status: 500 });
  }
}
