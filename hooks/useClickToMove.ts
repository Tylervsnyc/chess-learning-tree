import { useCallback } from 'react';
import { Chess, type Square } from 'chess.js';

interface UseClickToMoveOptions {
  /** Current Chess instance for the position */
  game: Chess | null;
  /** Which color the player controls */
  ownColor: 'w' | 'b';
  /** Currently selected square (managed by consumer for square styling) */
  selectedSquare: Square | null;
  /** Set the selected square */
  setSelectedSquare: (sq: Square | null) => void;
  /** Attempt a move — return true if successful */
  tryMove: (from: Square, to: Square) => boolean;
  /** Whether click-to-move is active */
  enabled: boolean;
}

/**
 * Shared click-to-move handler for all board pages.
 * Handles: select piece → deselect on reclick → try move → reselect/deselect on fail.
 */
export function useClickToMove({
  game,
  ownColor,
  selectedSquare,
  setSelectedSquare,
  tryMove,
  enabled,
}: UseClickToMoveOptions): (square: Square) => void {
  return useCallback(
    (square: Square) => {
      if (!enabled || !game) return;
      if (game.turn() !== ownColor) return;

      if (!selectedSquare) {
        // Nothing selected — select if it's the player's piece
        const piece = game.get(square);
        if (piece && piece.color === ownColor) {
          setSelectedSquare(square);
        }
      } else if (selectedSquare === square) {
        // Clicked same square — deselect
        setSelectedSquare(null);
      } else {
        // Different square — try move or reselect
        const legalMoves = game.moves({ square: selectedSquare, verbose: true });
        if (legalMoves.some(m => m.to === square)) {
          tryMove(selectedSquare, square);
          setSelectedSquare(null);
        } else {
          const piece = game.get(square);
          setSelectedSquare(piece && piece.color === ownColor ? square : null);
        }
      }
    },
    [game, ownColor, selectedSquare, setSelectedSquare, tryMove, enabled],
  );
}
