import { Chess } from 'chess.js';

/**
 * Convert UCI move (e.g., "e2e4") to SAN (e.g., "e4")
 */
export function uciToSan(fen: string, uciMove: string): string {
  try {
    const chess = new Chess(fen);
    const from = uciMove.slice(0, 2);
    const to = uciMove.slice(2, 4);
    const promotion = uciMove.length > 4 ? uciMove[4] : undefined;

    const move = chess.move({ from, to, promotion });
    return move ? move.san : uciMove;
  } catch {
    return uciMove;
  }
}

/**
 * Convert array of UCI moves to numbered SAN notation
 * e.g., ["e2e4", "e7e5", "g1f3"] -> "1.e4 e5 2.Nf3"
 */
export function uciMovesToSan(startingFen: string, uciMoves: string[]): string {
  try {
    const chess = new Chess(startingFen);
    const sanMoves: string[] = [];

    for (const uciMove of uciMoves) {
      const from = uciMove.slice(0, 2);
      const to = uciMove.slice(2, 4);
      const promotion = uciMove.length > 4 ? uciMove[4] : undefined;

      const move = chess.move({ from, to, promotion });
      if (move) {
        sanMoves.push(move.san);
      }
    }

    return formatMovesWithNumbers(sanMoves, chess.turn() === 'b');
  } catch {
    return uciMoves.join(' ');
  }
}

/**
 * Format SAN moves with move numbers
 * e.g., ["e4", "e5", "Nf3"] -> "1.e4 e5 2.Nf3"
 * If startsWithBlack is true: ["e5", "Nf3"] -> "1...e5 2.Nf3"
 */
export function formatMovesWithNumbers(sanMoves: string[], startsWithBlack = false): string {
  if (sanMoves.length === 0) return '';

  const parts: string[] = [];
  let moveNumber = 1;
  let isWhiteMove = !startsWithBlack;

  for (let i = 0; i < sanMoves.length; i++) {
    const san = sanMoves[i];

    if (isWhiteMove) {
      parts.push(`${moveNumber}.${san}`);
    } else {
      if (i === 0 && startsWithBlack) {
        // First move is black, use "1..." notation
        parts.push(`${moveNumber}...${san}`);
      } else {
        parts.push(san);
      }
      moveNumber++;
    }

    isWhiteMove = !isWhiteMove;
  }

  return parts.join(' ');
}

/**
 * Get the solution moves in SAN format from a Lichess puzzle
 * The first move in puzzle.moves is the opponent's last move,
 * the rest are the solution
 */
export function getPuzzleSolutionSan(fen: string, moves: string): string {
  const moveList = moves.split(' ');

  // Apply first move (opponent's last move) to get puzzle starting position
  const chess = new Chess(fen);
  const firstMove = moveList[0];
  const from = firstMove.slice(0, 2);
  const to = firstMove.slice(2, 4);
  const promotion = firstMove.length > 4 ? firstMove[4] : undefined;

  chess.move({ from, to, promotion });

  // Now convert remaining moves (the solution) to SAN
  const solutionUci = moveList.slice(1);
  const puzzleFen = chess.fen();

  return uciMovesToSan(puzzleFen, solutionUci);
}
