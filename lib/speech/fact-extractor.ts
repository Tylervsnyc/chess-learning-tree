/**
 * Fact Extractor — pulls 2-3 discrete observations from a completed game.
 *
 * These feed into Rookie's opening Claude call for the next game:
 * "Last time you hung a bishop on move 12. Just saying."
 *
 * Pure function — takes game data, returns string facts.
 */

import type { MoveRecord } from '@/lib/game-session';
import type { GameAnalysis } from '@/lib/game-eval';

export interface GameFactInput {
  result: 'win' | 'loss' | 'draw';
  resultMethod?: 'checkmate' | 'stalemate' | 'resignation' | 'timeout';
  playerColor: 'white' | 'black';
  moves: MoveRecord[];
  analysis?: GameAnalysis | null;
  gamesPlayed: number; // how many games before this one
  totalWins: number;
}

const PIECE_NAMES: Record<string, string> = {
  p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king',
};

/**
 * Extract 2-3 facts from a completed game.
 * Facts are short, specific, and written for Rookie's voice.
 */
export function extractFacts(input: GameFactInput): string[] {
  const { result, resultMethod, moves, analysis, gamesPlayed, totalWins } = input;
  const facts: string[] = [];

  // ── Result facts ──

  if (result === 'win' && totalWins === 0) {
    facts.push('Beat Rookie for the first time');
  } else if (result === 'win' && resultMethod === 'checkmate') {
    facts.push(`Won by checkmate in ${moves.length} moves`);
  } else if (result === 'loss' && resultMethod === 'checkmate') {
    const totalMoves = Math.ceil(moves.length / 2);
    if (totalMoves <= 10) {
      facts.push(`Lost in only ${totalMoves} moves`);
    }
  }

  // ── Accuracy fact ──

  if (analysis) {
    const acc = Math.round(analysis.playerAccuracy);
    if (acc >= 90) {
      facts.push(`Played with ${acc}% accuracy — near perfect`);
    } else if (acc <= 40) {
      facts.push(`Accuracy was ${acc}% — rough game`);
    }
  }

  // ── Piece-specific facts ──

  const playerMoves = moves.filter(m => m.movedBy === 'player');

  // Hung pieces
  const hungMoves = playerMoves.filter(m => m.pieceHung);
  if (hungMoves.length >= 2) {
    // Find the most-hung piece type
    const hungPieces = hungMoves.map(m => m.piece);
    const counts: Record<string, number> = {};
    hungPieces.forEach(p => { counts[p] = (counts[p] || 0) + 1; });
    const worst = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (worst && worst[1] >= 2) {
      facts.push(`Hung the ${PIECE_NAMES[worst[0]] || worst[0]} ${worst[1]} times`);
    } else {
      facts.push(`Hung ${hungMoves.length} pieces`);
    }
  }

  // Missed captures
  const missedCaptures = playerMoves.filter(m => m.captureAvailable && !m.captureTaken);
  if (missedCaptures.length >= 3) {
    facts.push(`Missed ${missedCaptures.length} free captures`);
  }

  // Game length
  const totalMoveCount = Math.ceil(moves.length / 2);
  if (totalMoveCount >= 40) {
    facts.push(`Played a long game — ${totalMoveCount} moves`);
  }

  // Castling
  const playerCastled = playerMoves.some(m => m.isCastling);
  if (!playerCastled && totalMoveCount >= 15) {
    facts.push("Didn't castle");
  }

  // First game
  if (gamesPlayed === 0) {
    facts.push('First game against Rookie');
  }

  // Cap at 3 facts — take the most interesting ones (first 3, since they're ordered by priority)
  return facts.slice(0, 3);
}
