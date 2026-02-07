/**
 * Shared puzzle utilities for client-side puzzle processing.
 *
 * IMPORTANT: Lichess puzzles have this structure:
 * - fen: Position BEFORE the opponent's last move
 * - moves[0]: Opponent's "setup" move (creates the tactic)
 * - moves[1+]: Player's solution moves
 *
 * We apply moves[0] to get the actual puzzle position the player sees.
 */

import { Chess } from 'chess.js';

/**
 * Raw puzzle from API (Lichess format)
 */
export interface RawPuzzle {
  id: string;
  fen: string;
  moves: string[];
  rating: number;
  theme?: string;
  themes?: string[];
  url?: string;
}

/**
 * Processed puzzle ready for display
 */
export interface ProcessedPuzzle {
  id: string;
  originalFen: string; // Position BEFORE opponent's setup move (for animation)
  puzzleFen: string; // Position AFTER opponent's setup move
  solutionMoves: string[]; // Player's moves (UCI format)
  playerColor: 'white' | 'black';
  rating: number;
  lastMoveFrom: string;
  lastMoveTo: string;
  themes?: string[];
  url?: string;
}

/**
 * Parse UCI move string (e.g., "e2e4" or "e7e8q")
 */
export function parseUciMove(uci: string): { from: string; to: string; promotion?: string } {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci.length > 4 ? uci[4] : undefined;
  return { from, to, promotion };
}

/**
 * Transform raw Lichess puzzle to processed format.
 *
 * Applies the setup move (opponent's last move) to get the actual
 * puzzle position that the player sees.
 */
export function processPuzzle(raw: RawPuzzle): ProcessedPuzzle {
  const chess = new Chess(raw.fen);

  // Apply the setup move (opponent's last move that creates the tactic)
  const setupMove = raw.moves[0];
  const { from, to, promotion } = parseUciMove(setupMove);

  try {
    chess.move({ from, to, promotion });
  } catch {
    // If setup move fails, use original FEN (shouldn't happen with valid puzzles)
  }

  return {
    id: raw.id,
    originalFen: raw.fen, // Position BEFORE setup move (for animation)
    puzzleFen: chess.fen(),
    solutionMoves: raw.moves.slice(1), // Everything after setup move (UCI format)
    playerColor: chess.turn() === 'w' ? 'white' : 'black',
    rating: raw.rating,
    lastMoveFrom: from,
    lastMoveTo: to,
    themes: raw.themes,
    url: raw.url,
  };
}

/**
 * Convert UCI moves to SAN notation for a given position.
 * Useful for displaying move hints.
 */
export function uciToSan(fen: string, uciMoves: string[]): string[] {
  const sanMoves: string[] = [];
  const chess = new Chess(fen);

  for (const uci of uciMoves) {
    const { from, to, promotion } = parseUciMove(uci);
    try {
      const move = chess.move({ from, to, promotion });
      if (move) {
        sanMoves.push(move.san);
      }
    } catch {
      // If move fails, keep UCI format
      sanMoves.push(uci);
    }
  }

  return sanMoves;
}

/**
 * Check if a move matches the expected solution move (with promotion flexibility)
 */
export function isCorrectMove(
  actualFrom: string,
  actualTo: string,
  actualPromotion: string | undefined,
  expectedUci: string
): boolean {
  const actualUci = actualFrom + actualTo + (actualPromotion || '');

  // Exact match
  if (actualUci === expectedUci) return true;

  // Auto-queen flexibility: if player auto-queens (promotion='q') and the
  // expected move goes to the same square, accept it. This handles the common
  // case where the board auto-promotes to queen. But don't accept non-queen
  // promotions when queen is expected (or vice versa).
  if (actualUci.length >= 5 && actualUci[4] === 'q' && actualUci.slice(0, 4) === expectedUci.slice(0, 4)) {
    return true;
  }

  return false;
}
