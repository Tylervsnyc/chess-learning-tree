/**
 * Frame builders for the Fight Night share GIF (lib/share/fight-night-gif.ts).
 * Pure — safe to import from pages (no canvas / sprite weight).
 */
import { Chess } from 'chess.js';
import type { ReviewMove } from '@/lib/review/review-core';
import type { FightNightFrame } from '@/lib/og/fight-night-data';

const START_FEN = new Chess().fen();

/** The last moves of any game: the position before the window, then each ply,
    stamped on the final one when the game ended in mate. `flip` draws the
    board from Black's side. */
export function buildGameShareFrames(
  plies: Pick<ReviewMove, 'from' | 'to' | 'fenAfter'>[],
  stampFinal: boolean,
  flip = false,
): FightNightFrame[] {
  const tail = plies.slice(-3);
  if (tail.length === 0) return [];
  const baseFen =
    plies.length > tail.length ? plies[plies.length - tail.length - 1].fenAfter : START_FEN;
  return [
    { fen: baseFen, flip },
    ...tail.map((m, j) => ({
      fen: m.fenAfter,
      last: `${m.from}${m.to}`,
      stamp: j === tail.length - 1 && stampFinal,
      flip,
    })),
  ];
}

/** The last moves of a bout — stamped when it ended by knockout. */
export function buildBoutShareFrames(plies: ReviewMove[], outcome: string): FightNightFrame[] {
  return buildGameShareFrames(plies, outcome === 'ko_win' || outcome === 'ko_loss');
}

/** A solved puzzle: start position, the opponent's setup move (moves[0], per
    Lichess convention), then the solution plies; stamped on the final frame. */
export function buildPuzzleShareFrames(fen: string, moves: string[] | string): FightNightFrame[] {
  const list = (Array.isArray(moves) ? moves : moves.split(' ')).filter(Boolean);
  const g = new Chess();
  try {
    g.load(fen);
  } catch {
    return [];
  }
  const frames: FightNightFrame[] = [{ fen: g.fen() }];
  for (let i = 0; i < list.length; i++) {
    const uci = list[i];
    try {
      g.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    } catch {
      break;
    }
    frames.push({ fen: g.fen(), last: uci.slice(0, 4), stamp: i === list.length - 1 });
  }
  return frames.length > 1 ? frames : [];
}
