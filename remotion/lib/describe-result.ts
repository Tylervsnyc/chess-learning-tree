import { Chess } from 'chess.js';

/**
 * Piece values for material counting.
 */
const PIECE_VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

function getMaterialCount(fen: string) {
  const board = fen.split(' ')[0];
  let white = 0;
  let black = 0;
  for (const ch of board) {
    const lower = ch.toLowerCase();
    if (PIECE_VALUES[lower] !== undefined) {
      if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) white += PIECE_VALUES[lower];
      else if (ch === ch.toLowerCase() && ch !== ch.toUpperCase()) black += PIECE_VALUES[lower];
    }
  }
  return { white, black };
}

/**
 * Describe the puzzle result for the celebration stage.
 * "Checkmate in 3!", "Won the Queen!", etc.
 */
export function describeResult(
  startFen: string,
  finalFen: string,
  playerColor: 'white' | 'black',
  themes: string[],
): string {
  // Check for checkmate from themes
  if (themes.some((t) => t.includes('mate') || t.includes('Mate'))) {
    const mateTheme = themes.find((t) => /mateIn(\d+)/i.test(t));
    if (mateTheme) {
      const n = mateTheme.match(/mateIn(\d+)/i)?.[1];
      return `Checkmate in ${n}!`;
    }
    return 'Checkmate!';
  }

  // Check final position
  const finalChess = new Chess(finalFen);
  if (finalChess.isCheckmate()) return 'Checkmate!';
  if (finalChess.isStalemate()) return 'Stalemate!';

  // Material difference
  const before = getMaterialCount(startFen);
  const after = getMaterialCount(finalFen);
  const playerBefore =
    playerColor === 'white' ? before.white - before.black : before.black - before.white;
  const playerAfter =
    playerColor === 'white' ? after.white - after.black : after.black - after.white;
  const gain = playerAfter - playerBefore;

  if (gain >= 9) return 'Won the Queen!';
  if (gain >= 5) return 'Won a Rook!';
  if (gain >= 3) return 'Won a Piece!';
  if (gain >= 1) return 'Won Material!';
  return 'Brilliant Move!';
}
