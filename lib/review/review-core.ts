/**
 * Review core — the ONE set of helpers behind post-game review.
 *
 * /play's review phase and the Chess Boxing bout's review screen both run on
 * these (arrow colors, commentary keys, the /api/coach-review fetch). Do not
 * re-implement any of this per-surface — one goal, one implementation.
 */

import type { GameAnalysis, PositionEval } from '@/lib/game-eval';

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Arrow colors for review mode
export const ARROW_GREEN = 'rgba(88, 204, 2, 0.85)';
export const ARROW_RED = 'rgba(235, 64, 52, 0.85)';
export const ARROW_AMBER = 'rgba(245, 158, 11, 0.85)';
/** Golden "engine's best response" arrow on regular (non-moment) moves. */
export const ARROW_BEST = 'rgba(218, 165, 32, 0.8)';

export function getArrowColor(type: string): string {
  if (type === 'blunder' || type === 'mistake') return ARROW_RED;
  if (type === 'turning-point') return '#F5A623'; // amber
  return ARROW_GREEN;
}

/**
 * The minimum a surface must record per move to be reviewable.
 * MoveRecord (lib/game-session) is a structural superset, so /play's move log
 * satisfies this as-is.
 */
export interface ReviewMove {
  san: string;
  from: string;
  to: string;
  fenAfter: string;
  movedBy: 'player' | 'rookie';
  /** Sequential ply count, 1-based (same convention as /play's moveNumRef). */
  moveNumber: number;
}

/**
 * Claude commentary key for the move at ply `index` (0-based): "1w", "1b",
 * "2w", ... — chess move numbers, not sequential plies.
 */
export function commentaryKey(
  index: number,
  movedBy: 'player' | 'rookie',
  playerColor: 'white' | 'black',
): string {
  const chessMoveNum = Math.ceil((index + 1) / 2);
  const colorKey = movedBy === 'player'
    ? (playerColor === 'white' ? 'w' : 'b')
    : (playerColor === 'white' ? 'b' : 'w');
  return `${chessMoveNum}${colorKey}`;
}

export interface CoachReview {
  /** "1w" -> commentary text */
  moves: Record<string, string>;
  summary: string | null;
  takeaway: string | null;
}

/**
 * Fetch per-move Claude coach commentary + summary + takeaway from
 * /api/coach-review. Returns null on any failure — commentary is a garnish,
 * never a blocker.
 *
 * @param evals one PositionEval per position (N+1 for N moves: start + after each move)
 */
export async function fetchCoachReview(args: {
  analysis: GameAnalysis;
  evals: PositionEval[];
  moves: ReviewMove[];
  playerColor: 'white' | 'black';
  playerElo: number;
  result: string;
  startFen?: string;
}): Promise<CoachReview | null> {
  const { analysis, evals, moves, playerColor } = args;
  const coachMoves = analysis.moves.map((mv, i) => ({
    moveNumber: Math.ceil((i + 1) / 2), // chess move number: 1,1,2,2,3,3...
    color: (mv.movedBy === 'player'
      ? playerColor
      : (playerColor === 'white' ? 'black' : 'white')) as 'white' | 'black',
    san: mv.san,
    uci: moves[i] ? moves[i].from + moves[i].to : '',
    fen: i > 0 ? moves[i - 1].fenAfter : (args.startFen ?? START_FEN),
    evalBefore: evals[i]?.cp ?? null,
    evalAfter: evals[i + 1]?.cp ?? null,
    bestMove: evals[i]?.bestMove ?? null,
    threat: evals[i + 1]?.bestMove ?? null,
    classification: mv.classification as
      | 'brilliant' | 'great' | 'good' | 'inaccuracy' | 'mistake' | 'blunder'
      | null,
  }));

  try {
    const res = await fetch('/api/coach-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moves: coachMoves,
        playerColor,
        playerElo: args.playerElo,
        result: args.result,
      }),
    });
    const data = await res.json();
    if (!data.review) {
      console.warn('[coach-review] no review in response:', data);
      return null;
    }
    return {
      moves: data.review.moves || {},
      summary: data.review.summary || null,
      takeaway: data.review.takeaway || null,
    };
  } catch (err) {
    console.error('[coach-review] failed:', err);
    return null;
  }
}
