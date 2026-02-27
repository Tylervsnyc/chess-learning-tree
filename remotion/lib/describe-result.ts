import { Chess } from 'chess.js';

/**
 * Replay the solution and track what pieces the PLAYER actually captured.
 * Player moves are at even indices (0, 2, 4...) since solution starts with player.
 */
function getPlayerCaptures(
  puzzleFen: string,
  solutionUciMoves: string[],
): string[] {
  const chess = new Chess(puzzleFen);
  const captures: string[] = [];

  for (let i = 0; i < solutionUciMoves.length; i++) {
    const uci = solutionUciMoves[i];
    const from = uci.slice(0, 2);
    const to = uci.slice(2, 4);
    const promotion = uci.length > 4 ? uci[4] : undefined;

    try {
      const result = chess.move({ from, to, promotion });
      if (result && result.captured && i % 2 === 0) {
        captures.push(result.captured);
      }
    } catch {
      break;
    }
  }

  return captures;
}

const PIECE_NAMES: Record<string, string> = {
  q: 'Queen',
  r: 'Rook',
  b: 'Bishop',
  n: 'Knight',
  p: 'Pawn',
};

const PIECE_VALUES: Record<string, number> = { q: 9, r: 5, b: 3, n: 3, p: 1 };

export interface PuzzleResult {
  /** Display text for the celebration badge ("Checkmate in 2!", "Won the Queen!") */
  text: string;
  /** Category for quip matching */
  category: 'checkmate' | 'won-queen' | 'won-rook' | 'won-piece' | 'won-pawn' | 'brilliant';
}

/**
 * Describe the puzzle result for the celebration stage.
 * Now tracks actual captures instead of net material difference.
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

  // Track actual captures by the player
  const captures = getPlayerCaptures(puzzleFen, solutionUciMoves);

  if (captures.length > 0) {
    // Find the highest-value piece the player captured
    const best = captures.reduce((a, b) =>
      (PIECE_VALUES[b] || 0) > (PIECE_VALUES[a] || 0) ? b : a
    );
    const bestValue = PIECE_VALUES[best] || 0;
    const pieceName = PIECE_NAMES[best] || 'Piece';

    if (bestValue >= 9) return { text: `Won the ${pieceName}!`, category: 'won-queen' };
    if (bestValue >= 5) return { text: `Won a ${pieceName}!`, category: 'won-rook' };
    if (bestValue >= 3) return { text: `Won a ${pieceName}!`, category: 'won-piece' };
    if (bestValue >= 1) return { text: 'Won Material!', category: 'won-pawn' };
  }

  return { text: 'Brilliant Move!', category: 'brilliant' };
}
