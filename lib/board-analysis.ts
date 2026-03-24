/**
 * Simple board analysis for beginner coaching.
 * Detects hanging pieces and missed captures using chess.js.
 * No engine needed — just attack/defense counting.
 */

import { Chess, Square, Color } from 'chess.js';

/**
 * Check if a player left any piece hanging (undefended and attacked).
 * Returns true if at least one piece is hanging after this move.
 */
export function hasHangingPiece(fen: string, playerColor: Color): boolean {
  const game = new Chess(fen);
  const opponentColor = playerColor === 'w' ? 'b' : 'w';
  const board = game.board();

  for (const row of board) {
    for (const sq of row) {
      if (!sq || sq.color !== playerColor || sq.type === 'k') continue;

      // Check if this piece is attacked by opponent
      const isAttacked = game.isAttacked(sq.square as Square, opponentColor);
      if (!isAttacked) continue;

      // Check if it's defended by counting: can we recapture if taken?
      // Simple heuristic: if attacked and the piece is undefended, it's hanging.
      // We check if any of our pieces can move to this square (defense).
      const defenders = countDefenders(fen, sq.square as Square, playerColor);
      if (defenders === 0) return true;
    }
  }

  return false;
}

/**
 * Check if there's a free capture available (opponent piece undefended).
 * Returns the square of the best free capture, or null.
 */
export function findFreeCaptureAvailable(fen: string, playerColor: Color): string | null {
  const game = new Chess(fen);
  const opponentColor = playerColor === 'w' ? 'b' : 'w';
  const board = game.board();

  // Piece values for finding the best free capture
  const values: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  let bestSquare: string | null = null;
  let bestValue = 0;

  for (const row of board) {
    for (const sq of row) {
      if (!sq || sq.color !== opponentColor || sq.type === 'k') continue;

      // Is this opponent piece attacked by us?
      const isAttacked = game.isAttacked(sq.square as Square, playerColor);
      if (!isAttacked) continue;

      // Is it defended?
      const defenders = countDefenders(fen, sq.square as Square, opponentColor);
      if (defenders === 0) {
        const val = values[sq.type] || 0;
        if (val > bestValue) {
          bestValue = val;
          bestSquare = sq.square;
        }
      }
    }
  }

  return bestSquare;
}

/**
 * Count how many pieces of a given color defend a square.
 * Uses a trick: temporarily place an opponent piece there and count captures.
 */
function countDefenders(fen: string, square: Square, defenderColor: Color): number {
  // Create a position where we check if defenderColor pieces can reach this square
  const game = new Chess(fen);

  // Get all moves for the defender color that capture on this square
  // We need to check from the defender's perspective
  const tempGame = new Chess(fen);

  // If it's not the defender's turn, we can't directly check moves.
  // Instead, check if any defender piece attacks this square.
  let count = 0;
  const board = tempGame.board();

  for (const row of board) {
    for (const sq of row) {
      if (!sq || sq.color !== defenderColor) continue;
      if (sq.square === square) continue; // don't count self

      // Check if this piece attacks the target square
      if (canPieceAttack(sq.type, sq.square as Square, square, board)) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Simple check if a piece type can attack from source to target.
 * Doesn't handle blocking (for sliding pieces) but good enough for coaching hints.
 */
function canPieceAttack(
  pieceType: string,
  from: Square,
  to: Square,
  _board: ReturnType<Chess['board']>,
): boolean {
  const fc = from.charCodeAt(0) - 97; // file 0-7
  const fr = parseInt(from[1]) - 1;    // rank 0-7
  const tc = to.charCodeAt(0) - 97;
  const tr = parseInt(to[1]) - 1;
  const df = Math.abs(tc - fc);
  const dr = Math.abs(tr - fr);

  switch (pieceType) {
    case 'p': return df === 1 && dr === 1; // simplified — ignores direction
    case 'n': return (df === 1 && dr === 2) || (df === 2 && dr === 1);
    case 'b': return df === dr && df > 0;
    case 'r': return (df === 0 || dr === 0) && (df + dr > 0);
    case 'q': return (df === dr || df === 0 || dr === 0) && (df + dr > 0);
    case 'k': return df <= 1 && dr <= 1 && (df + dr > 0);
    default: return false;
  }
}
