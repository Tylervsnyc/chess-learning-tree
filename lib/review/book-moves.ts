/**
 * Book-move marking — thin wrapper over lib/opening-book-detector that
 * relabels the opening-theory moves of a finished analysis as 'book'.
 *
 * Lives in its own module (not lib/game-eval) so surfaces that only need the
 * eval math never pull in the opening trees.
 *
 * Rule: book overrides the neutral labels (good/great/forced) but NEVER
 * downgrades a move the eval flagged as bad (inaccuracy/mistake/blunder) —
 * and never hides a brilliant. In practice book moves won't be bad, but if
 * the eval says a move lost real win%, the honest label wins.
 */

import { detectOpeningBook } from '@/lib/opening-book-detector';
import type { GameAnalysis } from '@/lib/game-eval';

const BOOK_OVERRIDES = new Set(['good', 'great', 'forced']);

/**
 * Mutates `analysis` in place (and returns it): moves with index <
 * bookMoves become 'book', then the player move-quality counters are
 * recomputed so they agree with the relabeled moves.
 */
export function applyBookMoves(
  analysis: GameAnalysis,
  sans: string[],
  playerColor: 'white' | 'black',
): GameAnalysis {
  const { bookMoves } = detectOpeningBook(sans, playerColor);
  if (bookMoves <= 0) return analysis;

  for (let i = 0; i < Math.min(bookMoves, analysis.moves.length); i++) {
    if (BOOK_OVERRIDES.has(analysis.moves[i].classification)) {
      analysis.moves[i].classification = 'book';
    }
  }

  const playerMoves = analysis.moves.filter((m) => m.movedBy === 'player');
  analysis.blunders = playerMoves.filter((m) => m.classification === 'blunder').length;
  analysis.mistakes = playerMoves.filter((m) => m.classification === 'mistake').length;
  analysis.inaccuracies = playerMoves.filter((m) => m.classification === 'inaccuracy').length;
  analysis.brilliantMoves = playerMoves.filter((m) => m.classification === 'brilliant').length;
  analysis.greatMoves = playerMoves.filter((m) => m.classification === 'great').length;

  return analysis;
}
