import { Chess } from 'chess.js';

/**
 * The Stage-4 celebration headline ("Checkmate in 2!", "Won the Queen!").
 *
 * RULE: a material headline may never claim more than the solver's NET material
 * gain across the whole solution, and a trade is never a "win".
 *
 * History: this used to tally only the pieces the solver captured and never
 * subtract what the solver lost, so a queen TRADE read "Won the Queen!" (fGGms:
 * queens come off, then a skewer nets the exchange). It had moved from net
 * material to captures so sacrifice lines weren't undersold — but mates are
 * handled first and non-material wins now get honest positional wording, so
 * net material is safe. Verified by scripts/ig-verify-captions.ts.
 */

const PIECE_VALUES: Record<string, number> = { q: 9, r: 5, b: 3, n: 3, p: 1, k: 0 };

const PIECE_NAMES: Record<string, string> = {
  q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight', p: 'Pawn',
};

export interface MaterialOutcome {
  /** Solver material − opponent material, end of line minus puzzle start, in pawns. */
  net: number;
  /** Piece types the solver captured / lost, over the whole solution. */
  solverCaptured: string[];
  solverLost: string[];
  /** What the solver's pawns promoted to (e.g. ['q']). */
  promotions: string[];
  /** Captures left after cancelling like-for-like trades (queen for queen etc). */
  netGained: string[];
  netLost: string[];
  finalFen: string;
}

/** Solver-minus-opponent material on the board. Promotions count naturally. */
function balance(board: Chess, solver: 'w' | 'b'): number {
  let total = 0;
  for (const sq of board.board().flat()) {
    if (sq) total += (sq.color === solver ? 1 : -1) * PIECE_VALUES[sq.type];
  }
  return total;
}

/** Remove one of each type present in both lists — a trade cancels out. */
function cancelTrades(gained: string[], lost: string[]): [string[], string[]] {
  const g = [...gained];
  const l = [...lost];
  for (let i = g.length - 1; i >= 0; i--) {
    const j = l.indexOf(g[i]);
    if (j !== -1) { l.splice(j, 1); g.splice(i, 1); }
  }
  return [g, l];
}

/**
 * Net material for the solver over a solution that starts from `puzzleFen`
 * (the position AFTER the opponent's setup move; solver to move).
 */
export function materialOutcome(puzzleFen: string, solutionUciMoves: string[]): MaterialOutcome {
  const board = new Chess(puzzleFen);
  const solver = board.turn();
  const start = balance(board, solver);
  const solverCaptured: string[] = [];
  const solverLost: string[] = [];
  const promotions: string[] = [];

  for (let i = 0; i < solutionUciMoves.length; i++) {
    const uci = solutionUciMoves[i];
    let move;
    try {
      move = board.move({
        from: uci.slice(0, 2), to: uci.slice(2, 4),
        promotion: uci.length > 4 ? uci[4] : undefined,
      });
    } catch { break; }
    const bySolver = i % 2 === 0;
    if (move.captured) (bySolver ? solverCaptured : solverLost).push(move.captured);
    if (bySolver && move.promotion) promotions.push(move.promotion);
  }

  const [netGained, netLost] = cancelTrades(solverCaptured, solverLost);
  return {
    net: balance(board, solver) - start,
    solverCaptured, solverLost, promotions, netGained, netLost,
    finalFen: board.fen(),
  };
}

/**
 * Same, from a raw Lichess puzzle: `fen` is BEFORE the setup move and
 * `rawMoves[0]` is the opponent's setup move. Null if unplayable.
 */
export function netMaterialForSolver(fen: string, rawMoves: string[]): MaterialOutcome | null {
  const board = new Chess(fen);
  const setup = rawMoves[0];
  try {
    board.move({
      from: setup.slice(0, 2), to: setup.slice(2, 4),
      promotion: setup.length > 4 ? setup[4] : undefined,
    });
  } catch { return null; }
  return materialOutcome(board.fen(), rawMoves.slice(1));
}

/** The most material (in pawns) a headline claims, or null if it claims none. */
export function headlineMaterialClaim(text: string): number | null {
  const t = text.toLowerCase();
  if (/won the queen/.test(t)) return 8;   // queen for a pawn still wins the queen
  if (/won a rook/.test(t)) return 5;
  if (/won a (piece|knight|bishop)/.test(t)) return 3;
  if (/won the exchange/.test(t)) return 2;
  if (/won (a pawn|material)/.test(t)) return 1;
  if (/^won /.test(t)) return 1;
  return null;
}

export interface PuzzleResult {
  /** Display text for the celebration badge ("Checkmate in 2!", "Won the Queen!") */
  text: string;
  /** Category for quip matching */
  category: 'checkmate' | 'won-queen' | 'won-rook' | 'won-piece' | 'won-pawn' | 'promotion' | 'brilliant';
}

/** Does the solver have a pawn one step from promotion at the end of the line? */
function solverPawnOnSeventh(finalFen: string, solver: 'w' | 'b'): boolean {
  const board = new Chess(finalFen);
  const rank = solver === 'w' ? '7' : '2';
  return board.board().flat().some(sq => sq && sq.type === 'p' && sq.color === solver && sq.square[1] === rank);
}

/**
 * Honest non-material wording for a non-mate line where the solver does NOT end
 * ahead on material (Lichess stops sacrifice lines at a decisive edge). These
 * name the kind of win, never an amount of material.
 */
function positionalResult(themes: string[], m: MaterialOutcome, solver: 'w' | 'b'): PuzzleResult {
  const has = (t: string) => themes.includes(t);
  const under = m.promotions.find(p => p !== 'q');
  if (under) return { text: `Promotes to a ${PIECE_NAMES[under]}!`, category: 'promotion' };
  if (m.promotions.includes('q')) return { text: 'Promotes to a Queen!', category: 'promotion' };
  if (solverPawnOnSeventh(m.finalFen, solver)) return { text: 'Unstoppable Pawn!', category: 'promotion' };
  if (has('equality') || has('defensiveMove')) return { text: 'Saved the Game!', category: 'brilliant' };
  if (has('zugzwang')) return { text: 'Zugzwang!', category: 'brilliant' };
  if (has('trappedPiece')) return { text: 'Piece Trapped!', category: 'brilliant' };
  if (['exposedKing', 'kingsideAttack', 'queensideAttack', 'attackingF2F7'].some(has)) {
    return { text: 'Decisive Attack!', category: 'brilliant' };
  }
  if (has('quietMove') || has('intermezzo')) return { text: 'Unstoppable Threat!', category: 'brilliant' };
  if (has('crushing') || has('advantage')) return { text: 'Winning Position!', category: 'brilliant' };
  return { text: 'Brilliant Move!', category: 'brilliant' };
}

/**
 * Describe the puzzle result for the celebration stage.
 * Material headlines are based on NET material for the solver (see file header).
 */
export function describeResult(
  puzzleFen: string,
  finalFen: string,
  _playerColor: 'white' | 'black',
  themes: string[],
  solutionUciMoves: string[],
): PuzzleResult {
  // Check for checkmate from themes
  if (themes.some((t) => t.includes('mate') || t.includes('Mate'))) {
    const mateTheme = themes.find((t) => /mateIn(\d+)/i.test(t));
    if (mateTheme) {
      const n = mateTheme.match(/mateIn(\d+)/i)?.[1];
      return { text: `Checkmate in ${n}!`, category: 'checkmate' };
    }
    return { text: 'Checkmate!', category: 'checkmate' };
  }

  // Check final position for checkmate
  const finalChess = new Chess(finalFen);
  if (finalChess.isCheckmate()) return { text: 'Checkmate!', category: 'checkmate' };
  if (finalChess.isStalemate()) return { text: 'Stalemate!', category: 'brilliant' };

  const m = materialOutcome(puzzleFen, solutionUciMoves);
  const solver = new Chess(puzzleFen).turn();
  const { net, netGained, netLost } = m;
  const gained = netGained.filter(p => p !== 'p');   // pieces won, trades cancelled
  const lost = netLost.filter(p => p !== 'p');
  const minor = (p: string) => p === 'n' || p === 'b';
  const one = (list: string[], test: (p: string) => boolean) => list.length === 1 && test(list[0]);

  if (net >= 8 && gained.includes('q')) return { text: 'Won the Queen!', category: 'won-queen' };
  if (net >= 3 && m.promotions.includes('q') && !gained.includes('q')) {
    return { text: 'Promotes to a Queen!', category: 'promotion' };
  }
  // Traded UP one piece for another: say exactly that ("Queen for a Rook!").
  if (net >= 2 && one(gained, p => p === 'q') && one(lost, p => p !== 'q')) {
    return { text: `Queen for a ${PIECE_NAMES[lost[0]]}!`, category: 'won-piece' };
  }
  if (net >= 2 && one(gained, p => p === 'r') && one(lost, minor)) {
    return { text: 'Won the Exchange!', category: 'won-rook' };
  }
  if (net >= 5 && gained.includes('r')) return { text: 'Won a Rook!', category: 'won-rook' };
  if (net >= 3) {
    // Name the minor piece only when that one piece IS the net haul.
    if (one(gained, minor) && lost.length === 0) {
      return { text: `Won a ${PIECE_NAMES[gained[0]]}!`, category: 'won-piece' };
    }
    return { text: 'Won a Piece!', category: 'won-piece' };
  }
  if (net >= 2) return { text: 'Won Material!', category: 'won-pawn' };
  if (net === 1) return { text: 'Won a Pawn!', category: 'won-pawn' };

  return positionalResult(themes, m, solver);
}
