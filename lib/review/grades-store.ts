/**
 * Persist a game's grades — shared by POST /api/games/[id]/grades (the /play
 * graded pass) and scripts/backfill-move-grades.ts. Server/script only: it
 * needs a service-role client.
 *
 * Writes game_sessions.brilliant_moves / great_moves (counted from the grades,
 * never trusted from a caller) and move_grades when that column exists
 * (feature-detected — supabase/migrations/2026-09-21-move-grades.sql may not
 * have run yet). Then RECOMPUTES the owner's lifetime totals as the sum over
 * their games, so a re-grade or a backfill can never double count.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { StoredMoveGrades } from '@/lib/review/grade';

const MISSING_COLUMN = /move_grades|column/i;

export function countGrades(grades: StoredMoveGrades, movedBy: ('player' | 'rookie' | string)[]) {
  let brilliant = 0;
  let great = 0;
  grades.grades.forEach((g, i) => {
    if (movedBy[i] !== 'player') return;
    if (g === 'brilliant') brilliant++;
    else if (g === 'great') great++;
  });
  return { brilliant, great };
}

export interface WriteGradesResult {
  written: boolean;
  /** move_grades column present (migration ran). */
  storedPerMove: boolean;
  brilliant: number;
  great: number;
}

/**
 * @param onlyIfUngraded - skip a game that already has move_grades (the live
 *   path: one grading per game). The backfill passes false to re-grade.
 */
export async function writeGameGrades(
  service: SupabaseClient,
  args: { sessionId: string; userId: string; grades: StoredMoveGrades; movedBy: string[]; onlyIfUngraded: boolean },
): Promise<WriteGradesResult> {
  const { brilliant, great } = countGrades(args.grades, args.movedBy);
  const counts = { brilliant_moves: brilliant, great_moves: great };

  let q = service
    .from('game_sessions')
    .update({ ...counts, move_grades: args.grades })
    .eq('id', args.sessionId)
    .eq('user_id', args.userId);
  if (args.onlyIfUngraded) q = q.is('move_grades', null);
  let { data, error } = await q.select('id');
  let storedPerMove = true;

  if (error && MISSING_COLUMN.test(error.message ?? '')) {
    storedPerMove = false;
    ({ data, error } = await service
      .from('game_sessions')
      .update(counts)
      .eq('id', args.sessionId)
      .eq('user_id', args.userId)
      .select('id'));
  }
  if (error) throw new Error(`grade write failed: ${error.message}`);
  const written = (data?.length ?? 0) > 0;

  if (written) await recomputeMoveQualityTotals(service, args.userId);
  return { written, storedPerMove, brilliant, great };
}

/** profiles.total_* = sum over the user's games. Idempotent. */
export async function recomputeMoveQualityTotals(service: SupabaseClient, userId: string): Promise<void> {
  const { data, error } = await service
    .from('game_sessions')
    .select('brilliant_moves, great_moves')
    .eq('user_id', userId)
    .eq('session_type', 'play-rookie');
  if (error) {
    console.warn('move-quality totals read failed:', error.message);
    return;
  }
  const rows = (data ?? []) as { brilliant_moves: number | null; great_moves: number | null }[];
  const totals = {
    total_brilliant_moves: rows.reduce((n, r) => n + (r.brilliant_moves ?? 0), 0),
    total_great_moves: rows.reduce((n, r) => n + (r.great_moves ?? 0), 0),
  };
  const { error: upErr } = await service.from('profiles').update(totals).eq('id', userId);
  if (upErr) console.warn('move-quality totals write failed:', upErr.message);
}
