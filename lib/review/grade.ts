/**
 * Grade a finished game — the ONE grading pipeline.
 *
 * analyzeGameMoves (eval math + level-scaled Legendary gates) followed by the
 * book pass (book moves are never Legendary). Every surface that shows or
 * stores move grades goes through here: the /play post-game pass, /review's
 * fallback re-grade, the bout review, the backfill and the Legendary
 * calibration. One function, so the saved counts, the finish screen and the
 * review can't disagree about what a move was.
 *
 * Stored grades (game_sessions.move_grades) are the per-move result of this,
 * written once after the post-game pass. A stored game is never re-graded for
 * display — /review applies the stored labels over its own eval pass.
 */

import {
  analyzeGameMoves,
  GRADE_DEPTH,
  type GameAnalysis,
  type MoveClassification,
  type PositionEval,
} from '@/lib/game-eval';
import { applyBookMoves } from '@/lib/review/book-moves';

export interface GradeMove {
  san: string;
  movedBy: 'player' | 'rookie';
  moveNumber: number;
  fenAfter?: string;
}

export function gradeGame(
  evals: (PositionEval | null)[],
  moves: GradeMove[],
  playerColor: 'white' | 'black',
  opts: { startFen?: string; playerLevel?: number | null } = {},
): GameAnalysis {
  return applyBookMoves(
    analyzeGameMoves(evals, moves, playerColor, opts.startFen, { playerLevel: opts.playerLevel }),
    moves.map(m => m.san),
    playerColor,
  );
}

// ─── Stored grades ──────────────────────────────────────────────────────────

/** Shape of game_sessions.move_grades (jsonb). */
export interface StoredMoveGrades {
  v: 1;
  depth: number;
  /** Rookie level the Legendary gates were scaled to. */
  level: number | null;
  /** One classification per ply, index-aligned with session_moves order. */
  grades: MoveClassification[];
}

export function toStoredGrades(analysis: GameAnalysis, level: number | null): StoredMoveGrades {
  return { v: 1, depth: GRADE_DEPTH, level, grades: analysis.moves.map(m => m.classification) };
}

const VALID = new Set<MoveClassification>([
  'brilliant', 'great', 'checkmate', 'good', 'inaccuracy', 'mistake', 'blunder', 'book', 'forced', 'unknown',
]);

/** Parse a stored grades blob; null when absent, malformed, or not for this move list. */
export function parseStoredGrades(raw: unknown, moveCount: number): StoredMoveGrades | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<StoredMoveGrades>;
  if (r.v !== 1 || !Array.isArray(r.grades) || r.grades.length !== moveCount) return null;
  if (!r.grades.every(g => VALID.has(g as MoveClassification))) return null;
  return r as StoredMoveGrades;
}

/**
 * Apply stored per-move grades over a fresh analysis (which still supplies
 * evals, win% and best moves for the board/graph/coach), then recount the
 * player tallies so counts and badges agree with what was saved.
 */
export function applyStoredGrades(analysis: GameAnalysis, stored: StoredMoveGrades): GameAnalysis {
  if (stored.grades.length !== analysis.moves.length) return analysis;
  analysis.moves.forEach((m, i) => { m.classification = stored.grades[i]; });
  const player = analysis.moves.filter(m => m.movedBy === 'player');
  analysis.blunders = player.filter(m => m.classification === 'blunder').length;
  analysis.mistakes = player.filter(m => m.classification === 'mistake').length;
  analysis.inaccuracies = player.filter(m => m.classification === 'inaccuracy').length;
  analysis.brilliantMoves = player.filter(m => m.classification === 'brilliant').length;
  analysis.greatMoves = player.filter(m => m.classification === 'great').length;
  return analysis;
}
