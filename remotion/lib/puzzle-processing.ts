import { Chess } from 'chess.js';
import { parseUciMove, uciToSan } from '../../lib/puzzle-utils';

/**
 * Video puzzle data (from video-puzzle-pool.json).
 */
export interface VideoPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  theme: string;
  allThemes: string[];
  gameUrl: string;
}

/**
 * Processed video puzzle ready for Remotion rendering.
 */
export interface ProcessedVideoPuzzle {
  puzzleId: string;
  rawFen: string;
  rawMoves: string[];
  puzzleFen: string;
  finalFen: string;
  playerColor: 'white' | 'black';
  solutionUciMoves: string[];
  solutionSanMoves: string[];
  rating: number;
  themes: string[];
}

/**
 * Process a video puzzle for rendering.
 */
export function processVideoPuzzle(puzzle: VideoPuzzle): ProcessedVideoPuzzle {
  const rawMoves = puzzle.moves.split(' ');

  // Apply setup move
  const chess = new Chess(puzzle.fen);
  const setup = parseUciMove(rawMoves[0]);
  chess.move({ from: setup.from, to: setup.to, promotion: setup.promotion });

  const puzzleFen = chess.fen();
  const playerColor = chess.turn() === 'w' ? 'white' : 'black';
  const solutionUciMoves = rawMoves.slice(1);

  // Get SAN notation
  const allSan = uciToSan(puzzle.fen, rawMoves);
  const solutionSanMoves = allSan.slice(1);

  // Play through to get final FEN
  const finalChess = new Chess(puzzleFen);
  for (const uci of solutionUciMoves) {
    const { from, to, promotion } = parseUciMove(uci);
    try {
      finalChess.move({ from, to, promotion });
    } catch {
      break;
    }
  }

  return {
    puzzleId: puzzle.puzzleId,
    rawFen: puzzle.fen,
    rawMoves,
    puzzleFen,
    finalFen: finalChess.fen(),
    playerColor: playerColor as 'white' | 'black',
    solutionUciMoves,
    solutionSanMoves,
    rating: puzzle.rating,
    themes: puzzle.allThemes,
  };
}
