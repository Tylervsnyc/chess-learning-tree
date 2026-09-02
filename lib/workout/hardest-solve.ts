import { Chess } from 'chess.js';
import type { PuzzleResult } from '@/lib/skill-profile';

/**
 * The hardest puzzle the user SOLVED this workout, as a position to picture:
 * the FEN after the opponent's setup move (what the solver actually saw) and
 * which way up the board goes. Feeds the post-workout email.
 */
export interface HardestSolve {
  fen: string;
  rating: number;
  orient: 'white' | 'black';
}

export function pickHardestSolve(results: PuzzleResult[]): HardestSolve | null {
  let best: PuzzleResult | null = null;
  for (const r of results) {
    if (!r.correct || typeof r.rating !== 'number' || !r.fen) continue;
    if (!best || r.rating > (best.rating ?? 0)) best = r;
  }
  if (!best || !best.fen) return null;

  try {
    const chess = new Chess(best.fen);
    const setup = best.moves?.[0];
    if (setup && setup.length >= 4) {
      chess.move({ from: setup.slice(0, 2), to: setup.slice(2, 4), promotion: setup[4] });
    }
    return {
      fen: chess.fen(),
      rating: Math.round(best.rating ?? 0),
      orient: chess.turn() === 'b' ? 'black' : 'white',
    };
  } catch {
    return null;
  }
}
