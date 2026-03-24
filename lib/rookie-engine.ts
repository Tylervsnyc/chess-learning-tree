/**
 * Rookie's Chess Brain — a simple minimax engine.
 * No WASM, no workers, no dependencies beyond chess.js.
 * Adjustable strength via depth + randomness.
 */
import { Chess } from 'chess.js';

// Piece values in centipawns
const PIECE_VALUES: Record<string, number> = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000,
};

// Piece-square tables (white perspective, flip for black)
const PST: Record<string, number[]> = {
  p: [
     0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0,
  ],
  n: [
   -50,-40,-30,-30,-30,-30,-40,-50,
   -40,-20,  0,  0,  0,  0,-20,-40,
   -30,  0, 10, 15, 15, 10,  0,-30,
   -30,  5, 15, 20, 20, 15,  5,-30,
   -30,  0, 15, 20, 20, 15,  0,-30,
   -30,  5, 10, 15, 15, 10,  5,-30,
   -40,-20,  0,  5,  5,  0,-20,-40,
   -50,-40,-30,-30,-30,-30,-40,-50,
  ],
  b: [
   -20,-10,-10,-10,-10,-10,-10,-20,
   -10,  0,  0,  0,  0,  0,  0,-10,
   -10,  0, 10, 10, 10, 10,  0,-10,
   -10,  5,  5, 10, 10,  5,  5,-10,
   -10,  0, 10, 10, 10, 10,  0,-10,
   -10, 10, 10, 10, 10, 10, 10,-10,
   -10,  5,  0,  0,  0,  0,  5,-10,
   -20,-10,-10,-10,-10,-10,-10,-20,
  ],
  r: [
     0,  0,  0,  0,  0,  0,  0,  0,
     5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
     0,  0,  0,  5,  5,  0,  0,  0,
  ],
  q: [
   -20,-10,-10, -5, -5,-10,-10,-20,
   -10,  0,  0,  0,  0,  0,  0,-10,
   -10,  0,  5,  5,  5,  5,  0,-10,
    -5,  0,  5,  5,  5,  5,  0, -5,
     0,  0,  5,  5,  5,  5,  0, -5,
   -10,  5,  5,  5,  5,  5,  0,-10,
   -10,  0,  5,  0,  0,  0,  0,-10,
   -20,-10,-10, -5, -5,-10,-10,-20,
  ],
  k: [
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30,
   -20,-30,-30,-40,-40,-30,-30,-20,
   -10,-20,-20,-20,-20,-20,-20,-10,
    20, 20,  0,  0,  0,  0, 20, 20,
    20, 30, 10,  0,  0, 10, 30, 20,
  ],
};

function squareIndex(square: string): number {
  const file = square.charCodeAt(0) - 97; // a=0, h=7
  const rank = parseInt(square[1]) - 1;   // 1=0, 8=7
  return (7 - rank) * 8 + file;
}

function evaluate(game: Chess): number {
  let score = 0;
  const board = game.board();

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (!piece) continue;

      const idx = rank * 8 + file;
      const flippedIdx = (7 - rank) * 8 + file;
      const pieceValue = PIECE_VALUES[piece.type] || 0;
      const pstValue = PST[piece.type]?.[piece.color === 'w' ? idx : flippedIdx] || 0;

      if (piece.color === 'w') {
        score += pieceValue + pstValue;
      } else {
        score -= pieceValue + pstValue;
      }
    }
  }

  return score;
}

function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    if (game.isCheckmate()) {
      return isMaximizing ? -99999 : 99999;
    }
    if (game.isDraw() || game.isStalemate()) return 0;
    return evaluate(game);
  }

  // Order moves: captures first (MVV-LVA), then checks, then rest
  const rawMoves = game.moves({ verbose: true });
  rawMoves.sort((a, b) => {
    const aVal = a.captured ? PIECE_VALUES[a.captured] || 0 : 0;
    const bVal = b.captured ? PIECE_VALUES[b.captured] || 0 : 0;
    return bVal - aVal;
  });
  const moves = rawMoves.map(m => m.san);

  if (isMaximizing) {
    let best = -Infinity;
    for (const move of moves) {
      game.move(move);
      const val = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      best = Math.max(best, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      game.move(move);
      const val = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      best = Math.min(best, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return best;
  }
}

export interface RookieMove {
  san: string;
  from: string;
  to: string;
  captured?: string;
  piece: string;
}

/**
 * Get Rookie's best move.
 * @param fen - Current position
 * @param skillLevel - 0-4 (Beginner to Expert)
 * @returns The move Rookie wants to play, or null if game is over
 */
export function getRookieMove(fen: string, skillLevel: number): RookieMove | null {
  const game = new Chess(fen);
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Beginner: mostly random with occasional good moves
  if (skillLevel === 0) {
    // 30% chance of playing the best move at depth 1, 70% random
    if (Math.random() > 0.3) {
      const pick = moves[Math.floor(Math.random() * moves.length)];
      return { san: pick.san, from: pick.from, to: pick.to, captured: pick.captured || undefined, piece: pick.piece };
    }
  }

  // Map skill to search depth (max 4 — depth 5 freezes the main thread)
  const depths = [1, 2, 2, 3, 4];
  const depth = depths[Math.min(skillLevel, depths.length - 1)];

  const isWhite = game.turn() === 'w';
  let bestMove = moves[0];
  let bestScore = isWhite ? -Infinity : Infinity;

  for (const move of moves) {
    game.move(move.san);
    const score = minimax(game, depth - 1, -Infinity, Infinity, !isWhite);
    game.undo();

    if (isWhite ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  // Add some randomness for lower skill levels
  if (skillLevel <= 2 && Math.random() < 0.15) {
    // Occasionally pick a random top-3 move instead of the absolute best
    const scored = moves.map(m => {
      game.move(m.san);
      const s = minimax(game, depth - 1, -Infinity, Infinity, !isWhite);
      game.undo();
      return { move: m, score: s };
    });
    scored.sort((a, b) => isWhite ? b.score - a.score : a.score - b.score);
    const topN = scored.slice(0, Math.min(3, scored.length));
    const pick = topN[Math.floor(Math.random() * topN.length)];
    bestMove = pick.move;
  }

  return {
    san: bestMove.san,
    from: bestMove.from,
    to: bestMove.to,
    captured: bestMove.captured || undefined,
    piece: bestMove.piece,
  };
}
