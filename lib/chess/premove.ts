import type { CSSProperties } from 'react';
import { Chess, type Square } from 'chess.js';

/**
 * Premove — the queued move a player sets while it's the opponent's turn.
 *
 * Two different rule sets live here, and keeping them apart is the whole point:
 *
 *  - TARGETING (premoveDests) is RELAXED. When you set a premove the position
 *    hasn't happened yet, so we can't ask "is this legal?" — we only ask "could
 *    this piece plausibly go there?". Blockers, occupancy, check and pins are
 *    all ignored (a rook slides through pieces that might move away; a pawn can
 *    target an empty diagonal square that might get occupied).
 *
 *  - EXECUTION (isPremoveLegal) is STRICT. The instant it becomes your turn the
 *    move is tested against the real position with chess.js. Legal → it plays.
 *    Illegal → it silently cancels. No error, no penalty.
 *
 * Mirrors lichess/chessground's premove.ts. Pure module — no React, no DOM.
 */

export interface Premove {
  from: Square;
  to: Square;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

/** 'e4' → [4, 3] (file 1-8, rank 0-7). */
function coords(sq: string): [number, number] {
  return [FILES.indexOf(sq[0] as (typeof FILES)[number]) + 1, Number(sq[1]) - 1];
}

function square(file: number, rank: number): Square {
  return `${FILES[file - 1]}${rank + 1}` as Square;
}

const diff = (a: number, b: number) => Math.abs(a - b);

/**
 * Relaxed mobility, per piece type. Coordinates are (file 1-8, rank 0-7).
 * Deliberately ignores everything about the rest of the board.
 */
function canReach(
  role: string,
  color: 'w' | 'b',
  x1: number, y1: number,
  x2: number, y2: number,
): boolean {
  const dx = diff(x1, x2);
  const dy = diff(y1, y2);

  switch (role) {
    case 'p': {
      // Forward pushes (incl. the double push from the home rank) and BOTH
      // diagonal captures, regardless of what currently occupies the square.
      const forward = color === 'w' ? 1 : -1;
      const homeRank = color === 'w' ? 1 : 6;
      if (y2 - y1 === forward && dx === 0) return true;
      if (y2 - y1 === forward && dx === 1) return true;
      if (y1 === homeRank && y2 - y1 === forward * 2 && dx === 0) return true;
      return false;
    }
    case 'n':
      return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
    case 'b':
      return dx === dy;
    case 'r':
      return dx === 0 || dy === 0;
    case 'q':
      return dx === dy || dx === 0 || dy === 0;
    case 'k':
      return dx <= 1 && dy <= 1;
    default:
      return false;
  }
}

/**
 * Every square `from` may be premoved to. Relaxed — see the module comment.
 * Returns [] if the square is empty or holds an opponent piece.
 */
export function premoveDests(fen: string, from: Square, ownColor: 'w' | 'b'): Square[] {
  let game: Chess;
  try {
    game = new Chess(fen);
  } catch {
    return [];
  }

  const piece = game.get(from);
  if (!piece || piece.color !== ownColor) return [];

  const [x1, y1] = coords(from);
  const dests: Square[] = [];

  for (let x2 = 1; x2 <= 8; x2++) {
    for (let y2 = 0; y2 <= 7; y2++) {
      if (x1 === x2 && y1 === y2) continue;
      if (canReach(piece.type, ownColor, x1, y1, x2, y2)) {
        dests.push(square(x2, y2));
      }
    }
  }

  // Castling: king on its home square with a friendly rook still on the a/h
  // file. Castling RIGHTS aren't checked here — that's execution's job.
  if (piece.type === 'k') {
    const homeRank = ownColor === 'w' ? 0 : 7;
    if (x1 === 5 && y1 === homeRank) {
      const rookOn = (file: number) => {
        const r = game.get(square(file, homeRank));
        return r?.type === 'r' && r.color === ownColor;
      };
      if (rookOn(8)) dests.push(square(7, homeRank)); // O-O   → g-file
      if (rookOn(1)) dests.push(square(3, homeRank)); // O-O-O → c-file
    }
  }

  return Array.from(new Set(dests));
}

/** Would this premove be a legal move in the position `fen` right now? */
export function isPremoveLegal(fen: string, premove: Premove): boolean {
  try {
    const game = new Chess(fen);
    return game
      .moves({ square: premove.from, verbose: true })
      .some(m => m.to === premove.to);
  } catch {
    return false;
  }
}

/**
 * Square tint for a pending premove — deliberately distinct from the selection
 * highlight and the last-move highlight so all three can be on the board at once.
 */
export const PREMOVE_HIGHLIGHT = 'rgba(56, 132, 255, 0.45)';

export function premoveSquareStyles(
  premove: Premove | null,
): Record<string, CSSProperties> {
  if (!premove) return {};
  return {
    [premove.from]: { backgroundColor: PREMOVE_HIGHLIGHT },
    [premove.to]: { backgroundColor: PREMOVE_HIGHLIGHT },
  };
}
