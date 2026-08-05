import { useCallback } from 'react';
import { Chess, type Move, type Square } from 'chess.js';
import { premoveDests, type Premove } from '@/lib/chess/premove';

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
  /** Premove wiring (from usePremove). Omit to keep the board premove-free. */
  premoveEnabled?: boolean;
  setPremove?: (premove: Premove | null) => void;
}

interface UseClickToMoveResult {
  /** Board `onSquareClick` handler. */
  onSquareClick: (square: Square) => void;
  /**
   * Board `onPieceDrop` handler for drags made during the OPPONENT's turn.
   * Registers the premove and returns false on purpose: the drag snaps back and
   * the premove highlight becomes the single visual truth, so the board never
   * shows a piece the `position` FEN disagrees with.
   */
  onPremoveDrop: (from: Square, to: Square) => boolean;
}

/**
 * Shared click-to-move handler for all board pages.
 *
 * Selection of own pieces is allowed during the opponent's turn so a player can
 * pre-select while the opponent's move is still animating. With premove wired
 * in, that pre-selection can be completed into a queued move; without it, move
 * execution still requires it to be the player's turn.
 */
export function useClickToMove({
  game,
  ownColor,
  selectedSquare,
  setSelectedSquare,
  tryMove,
  enabled,
  premoveEnabled = false,
  setPremove,
}: UseClickToMoveOptions): UseClickToMoveResult {
  const onSquareClick = useCallback(
    (square: Square) => {
      if (!enabled || !game) return;

      const isOwnTurn = game.turn() === ownColor;

      if (!selectedSquare) {
        const piece = game.get(square);
        if (piece && piece.color === ownColor) {
          setSelectedSquare(square);
        } else if (premoveEnabled) {
          // Clicking a bare square cancels a pending premove (lichess).
          setPremove?.(null);
        }
      } else if (selectedSquare === square) {
        setSelectedSquare(null);
      } else if (!isOwnTurn) {
        if (premoveEnabled && premoveDests(game.fen(), selectedSquare, ownColor).includes(square)) {
          setPremove?.({ from: selectedSquare, to: square });
          setSelectedSquare(null);
          return;
        }
        const piece = game.get(square);
        setSelectedSquare(piece && piece.color === ownColor ? square : null);
        if (premoveEnabled) setPremove?.(null);
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
    [game, ownColor, selectedSquare, setSelectedSquare, tryMove, enabled, premoveEnabled, setPremove],
  );

  const onPremoveDrop = useCallback(
    (from: Square, to: Square): boolean => {
      if (!enabled || !game || !premoveEnabled) return false;
      if (game.turn() === ownColor) return false;
      if (premoveDests(game.fen(), from, ownColor).includes(to)) {
        setPremove?.({ from, to });
        setSelectedSquare(null);
      }
      return false;
    },
    [enabled, game, ownColor, premoveEnabled, setPremove, setSelectedSquare],
  );

  return { onSquareClick, onPremoveDrop };
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
    const epVictim = (move.to[0] + move.from[1]) as Square;
    if (prev === epVictim) return null;
  }
  return prev;
}
