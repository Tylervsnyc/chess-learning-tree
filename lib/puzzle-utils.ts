/**
 * Shared puzzle utilities for puzzle processing (client + server).
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
 * Standard chess board square colors (Lichess green theme)
 */
export const BOARD_COLORS = {
  light: '#edeed1',
  dark: '#779952',
} as const;

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
 * Processed puzzle with SAN solution moves (extends ProcessedPuzzle)
 */
export interface ProcessedPuzzleWithSAN extends ProcessedPuzzle {
  solutionMovesSAN: string[];
}

/**
 * Process raw puzzle and convert solution moves to SAN.
 * Combines processPuzzle + uciToSan in one call.
 */
export function processPuzzleWithSAN(raw: RawPuzzle): ProcessedPuzzleWithSAN {
  const processed = processPuzzle(raw);
  const solutionMovesSAN = uciToSan(processed.puzzleFen, processed.solutionMoves);

  return {
    ...processed,
    solutionMovesSAN,
  };
}

/**
 * Normalize SAN move by stripping check (+) and mate (#) symbols.
 * Used for move comparison since chess.js may or may not include these.
 */
export function normalizeMove(move: string): string {
  return move.replace(/[+#]$/, '');
}

/**
 * Get rating bracket directory name for a puzzle rating.
 * Maps ratings to folder structure: 0400-0800, 0800-1200, etc.
 */
export function getRatingBracket(rating: number): string {
  if (rating < 800) return '0400-0800';
  if (rating < 1200) return '0800-1200';
  if (rating < 1600) return '1200-1600';
  if (rating < 2000) return '1600-2000';
  return '2000-plus';
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

// ============================================================================
// SERVER-SIDE PUZZLE PROCESSING (used by API routes)
// ============================================================================

/**
 * Raw puzzle from CSV file (moves as space-separated string, not array)
 */
export interface RawPuzzleCSV {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string[];
  url?: string;
}

/**
 * Processed puzzle for API responses
 */
export interface ServerProcessedPuzzle {
  puzzleId: string;
  fen: string;
  puzzleFen: string;
  moves: string;
  rating: number;
  themes: string[];
  url?: string;
  setupMove: string;
  lastMoveFrom: string;
  lastMoveTo: string;
  solution: string;
  solutionMoves: string[];
  playerColor: 'white' | 'black';
}

/**
 * Process raw CSV puzzle into API response format.
 * Applies setup move, converts UCI to SAN, formats solution.
 */
export function processPuzzleFromCSV(raw: RawPuzzleCSV): ServerProcessedPuzzle | null {
  try {
    const chess = new Chess(raw.fen);
    const moveList = raw.moves.split(' ');

    const setupUci = moveList[0];
    const lastMoveFrom = setupUci.slice(0, 2);
    const lastMoveTo = setupUci.slice(2, 4);

    const setupResult = chess.move({
      from: lastMoveFrom,
      to: lastMoveTo,
      promotion: setupUci[4] as 'q' | 'r' | 'b' | 'n' | undefined,
    });
    if (!setupResult) return null;

    const setupMove = setupResult.san;
    const puzzleFen = chess.fen();
    const playerColor = chess.turn() === 'w' ? 'white' : 'black';

    const solutionMoves: string[] = [];
    for (let i = 1; i < moveList.length; i++) {
      const uci = moveList[i];
      const result = chess.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci[4] as 'q' | 'r' | 'b' | 'n' | undefined,
      });
      if (result) {
        solutionMoves.push(result.san);
      } else {
        break;
      }
    }

    const solution = formatSolution(solutionMoves, playerColor === 'black');

    return {
      puzzleId: raw.puzzleId,
      fen: raw.fen,
      puzzleFen,
      moves: raw.moves,
      rating: raw.rating,
      themes: raw.themes,
      url: raw.url,
      setupMove,
      lastMoveFrom,
      lastMoveTo,
      solution,
      solutionMoves,
      playerColor,
    };
  } catch {
    return null;
  }
}

/**
 * Format solution moves with proper move numbering.
 * Example: "1.Qh7#" or "1...Nxe5 2.Qxe5"
 */
export function formatSolution(moves: string[], startsAsBlack: boolean): string {
  if (moves.length === 0) return '';
  const parts: string[] = [];
  let moveNum = 1;
  let isWhiteMove = !startsAsBlack;

  for (let i = 0; i < moves.length; i++) {
    const san = moves[i];
    if (isWhiteMove) {
      parts.push(`${moveNum}.${san}`);
    } else {
      if (i === 0 && startsAsBlack) {
        parts.push(`${moveNum}...${san}`);
      } else {
        parts.push(san);
      }
      moveNum++;
    }
    isWhiteMove = !isWhiteMove;
  }
  return parts.join(' ');
}
