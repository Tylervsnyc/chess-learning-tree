import { useCallback } from 'react';
import { Chess, type Move, type Square } from 'chess.js';

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
 * Selection of own pieces is allowed at any time, including during the opponent's turn,
 * so a player can pre-select a piece while the opponent's move is still animating.
 * Move execution still requires it to be the player's turn.
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

      const isOwnTurn = game.turn() === ownColor;

      if (!selectedSquare) {
        const piece = game.get(square);
        if (piece && piece.color === ownColor) {
          setSelectedSquare(square);
        }
      } else if (selectedSquare === square) {
        setSelectedSquare(null);
      } else if (!isOwnTurn) {
        // Opponent's turn — no moves, but allow reselecting another own piece or clearing
        const piece = game.get(square);
        setSelectedSquare(piece && piece.color === ownColor ? square : null);
      } else {
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

/**
 * Decide what to do with the player's selected square after the opponent has moved.
 * Drops selection if the selected piece was captured (including en passant).
 * Otherwise preserves it — consumers re-derive legal-move highlights from the new FEN.
 */
export function reconcileSelectionAfterOpponentMove(
  prev: Square | null,
  move: Pick<Move, 'from' | 'to' | 'flags'>,
): Square | null {
  if (!prev) return null;
  if (prev === move.to) return null;
  if (move.flags.includes('e')) {
    // En passant — captured pawn sits on the `to` file but the `from` rank
    const epVictim = (move.to[0] + move.from[1]) as Square;
    if (prev === epVictim) return null;
  }
  return prev;
}
