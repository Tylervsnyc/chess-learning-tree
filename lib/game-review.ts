/**
 * Game Review — identifies key moments from a Play Rookie game.
 *
 * Analyzes move history to find:
 * 1. Biggest mistake (worst hung piece or missed capture)
 * 2. Best move (captures, checks, or checkmate)
 */

import { MoveRecord } from '@/lib/game-session';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export type MomentType = 'mistake' | 'best-move';

export interface KeyMoment {
  type: MomentType;
  moveNumber: number;
  title: string;
  fenBefore: string;
  fenAfter: string;
  moveSan: string;
  movedBy: 'player' | 'rookie';
  description: string;
}

export interface GameReview {
  keyMoments: KeyMoment[];
  allMoves: MoveRecord[];
  totalMoves: number;
  playerMoveCount: number;
}

// ════════════════════════════════
// ANALYSIS
// ════════════════════════════════

/**
 * Analyze a completed game and extract key moments.
 */
export function analyzeGame(
  moves: MoveRecord[],
  playerColor: 'white' | 'black',
): GameReview {
  const moments: KeyMoment[] = [];
  const sorted = moves.sort((a, b) => a.moveNumber - b.moveNumber);
  const playerMoves = sorted.filter(m => m.movedBy === 'player');

  // 1. Biggest mistake — hung piece or missed capture
  const hungMoves = playerMoves.filter(m => m.pieceHung);
  if (hungMoves.length > 0) {
    const worst = hungMoves[0];
    const prevIndex = sorted.indexOf(worst) - 1;
    const prevFen = prevIndex >= 0 ? sorted[prevIndex].fenAfter : worst.fenAfter;
    moments.push({
      type: 'mistake',
      moveNumber: worst.moveNumber,
      title: 'Piece left hanging',
      fenBefore: prevFen,
      fenAfter: worst.fenAfter,
      moveSan: worst.san,
      movedBy: 'player',
      description: `After ${worst.san}, you left a piece undefended. Before each move, check if anything is unprotected.`,
    });
  } else {
    const missedCaptures = playerMoves.filter(m => m.captureAvailable && !m.captureTaken);
    if (missedCaptures.length > 0) {
      const missed = missedCaptures[0];
      const prevIndex = sorted.indexOf(missed) - 1;
      const prevFen = prevIndex >= 0 ? sorted[prevIndex].fenAfter : missed.fenAfter;
      moments.push({
        type: 'mistake',
        moveNumber: missed.moveNumber,
        title: 'Free capture missed',
        fenBefore: prevFen,
        fenAfter: missed.fenAfter,
        moveSan: missed.san,
        movedBy: 'player',
        description: `There was a free piece to take here, but you played ${missed.san} instead. Always look for free material.`,
      });
    }
  }

  // 2. Best move
  const bestMove = findBestPlayerMove(playerMoves);
  if (bestMove) {
    const prevIndex = sorted.indexOf(bestMove) - 1;
    const prevFen = prevIndex >= 0 ? sorted[prevIndex].fenAfter : bestMove.fenAfter;
    moments.push({
      type: 'best-move',
      moveNumber: bestMove.moveNumber,
      title: 'Nice move',
      fenBefore: prevFen,
      fenAfter: bestMove.fenAfter,
      moveSan: bestMove.san,
      movedBy: 'player',
      description: bestMove.isCheck && bestMove.isCapture
        ? `${bestMove.san} — a capture with check. That's the kind of move that wins games.`
        : bestMove.isCheck
          ? `${bestMove.san} — check. Putting pressure on the king.`
          : bestMove.isCapture
            ? `${bestMove.san} — good capture.`
            : bestMove.isCastling
              ? `Castling — getting your king safe. Smart.`
              : `${bestMove.san} — solid move.`,
    });
  }

  return {
    keyMoments: moments,
    allMoves: sorted,
    totalMoves: sorted.length,
    playerMoveCount: playerMoves.length,
  };
}

function findBestPlayerMove(playerMoves: MoveRecord[]): MoveRecord | null {
  const checkCapture = playerMoves.find(m => m.isCheck && m.isCapture);
  if (checkCapture) return checkCapture;

  const captures = playerMoves.filter(m => m.isCapture);
  if (captures.length > 0) return captures[0];

  const checks = playerMoves.filter(m => m.isCheck);
  if (checks.length > 0) return checks[0];

  const castle = playerMoves.find(m => m.isCastling);
  if (castle) return castle;

  return null;
}
