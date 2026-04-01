// Rookie chess engine — runs in a Web Worker so it doesn't freeze the UI
// Uses minimax with alpha-beta pruning and move ordering

const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const PST = {
  p: [0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
  n: [-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
  b: [-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,10,10,10,10,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
  r: [0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
  q: [-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
  k: [-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20],
};

// Minimal chess engine (no dependencies)
// We receive FEN + legal moves from the main thread, and just need to evaluate + search

function parseFen(fen) {
  const parts = fen.split(' ');
  const rows = parts[0].split('/');
  const board = [];
  for (let r = 0; r < 8; r++) {
    board[r] = [];
    let f = 0;
    for (const ch of rows[r]) {
      if (ch >= '1' && ch <= '8') {
        for (let i = 0; i < parseInt(ch); i++) { board[r][f++] = null; }
      } else {
        const color = ch === ch.toUpperCase() ? 'w' : 'b';
        board[r][f++] = { type: ch.toLowerCase(), color };
      }
    }
  }
  return { board, turn: parts[1] };
}

function evaluate(board) {
  let score = 0;
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (!piece) continue;
      const idx = rank * 8 + file;
      const flippedIdx = (7 - rank) * 8 + file;
      const pieceValue = PIECE_VALUES[piece.type] || 0;
      const pstValue = (PST[piece.type] || [])[piece.color === 'w' ? idx : flippedIdx] || 0;
      if (piece.color === 'w') {
        score += pieceValue + pstValue;
      } else {
        score -= pieceValue + pstValue;
      }
    }
  }
  return score;
}

// We import chess.js via importScripts from a CDN for move generation
// This is the simplest approach that works in a plain web worker
let Chess = null;

importScripts('https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.13.4/chess.min.js');
Chess = self.Chess;

function minimax(game, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || game.game_over()) {
    if (game.in_checkmate()) return isMaximizing ? -99999 : 99999;
    if (game.in_draw() || game.in_stalemate()) return 0;
    return evaluate(parseFen(game.fen()).board);
  }

  const moves = game.moves({ verbose: true });
  // Move ordering: captures first (MVV-LVA)
  moves.sort((a, b) => {
    const aVal = a.captured ? (PIECE_VALUES[a.captured] || 0) : 0;
    const bVal = b.captured ? (PIECE_VALUES[b.captured] || 0) : 0;
    return bVal - aVal;
  });

  if (isMaximizing) {
    let best = -Infinity;
    for (const move of moves) {
      game.move(move.san);
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
      game.move(move.san);
      const val = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      best = Math.min(best, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function getBestMove(fen, skillLevel) {
  const game = new Chess(fen);
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Beginner: mostly random
  if (skillLevel === 0) {
    if (Math.random() > 0.3) {
      const pick = moves[Math.floor(Math.random() * moves.length)];
      return { san: pick.san, from: pick.from, to: pick.to, captured: pick.captured || undefined, piece: pick.piece };
    }
  }

  // Skill → depth: can go deeper in a worker without freezing
  const depths = [1, 2, 3, 3, 4];
  const depth = depths[Math.min(skillLevel, depths.length - 1)];

  // Blunder chances per level (level 0 handled above with 70% pure random)
  const blunderChance = [0, 0.35, 0.20, 0.05, 0];
  const blunderPoolSize = [0, 5, 4, 3, 0];

  const isWhite = game.turn() === 'w';

  // Score all moves
  const scored = moves.map(m => {
    game.move(m.san);
    const s = minimax(game, depth - 1, -Infinity, Infinity, !isWhite);
    game.undo();
    return { move: m, score: s };
  });
  scored.sort((a, b) => isWhite ? b.score - a.score : a.score - b.score);

  let bestMove = scored[0].move;

  // Blunder: pick from top-N instead of the absolute best
  const chance = blunderChance[Math.min(skillLevel, blunderChance.length - 1)];
  const poolSize = blunderPoolSize[Math.min(skillLevel, blunderPoolSize.length - 1)];
  if (chance > 0 && Math.random() < chance) {
    const pool = scored.slice(0, Math.min(poolSize, scored.length));
    bestMove = pool[Math.floor(Math.random() * pool.length)].move;
  }

  return {
    san: bestMove.san,
    from: bestMove.from,
    to: bestMove.to,
    captured: bestMove.captured || undefined,
    piece: bestMove.piece,
  };
}

self.onmessage = function(e) {
  const { fen, skillLevel } = e.data;
  const result = getBestMove(fen, skillLevel);
  self.postMessage(result);
};
