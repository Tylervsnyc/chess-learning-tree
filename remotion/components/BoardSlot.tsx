import React from 'react';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { BOARD_SIZE } from '../lib/timing';

// Lichess-style last-move highlight (amber)
const HIGHLIGHT_FROM = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
const HIGHLIGHT_TO = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };

// Checkmate-explainer squares — same treatment as /learn (app/lesson):
// red = square the king can't use (attacked), yellow = blocked by his own piece
const MATE_RED = {
  backgroundColor: 'rgba(255, 0, 0, 0.5)',
  boxShadow: 'inset 0 0 0 3px rgba(255, 0, 0, 0.8), 0 0 12px rgba(255, 0, 0, 0.4)',
};
const MATE_YELLOW = {
  backgroundColor: 'rgba(255, 255, 0, 0.5)',
  boxShadow: 'inset 0 0 0 3px rgba(255, 200, 0, 0.8), 0 0 12px rgba(255, 255, 0, 0.4)',
};

/**
 * Chess board at 1080px (4x scale). Dead center, never moves.
 * Supports optional last-move highlight squares and the /learn checkmate
 * explainer squares (red = attacked, yellow = blocked by friendly).
 */
export const BoardSlot: React.FC<{
  fen: string;
  orientation: 'white' | 'black';
  highlightFrom?: string;
  highlightTo?: string;
  redSquares?: string[];
  yellowSquares?: string[];
}> = ({ fen, orientation, highlightFrom, highlightTo, redSquares, yellowSquares }) => {
  const squareStyles: Record<string, React.CSSProperties> = {};
  if (highlightFrom) squareStyles[highlightFrom] = HIGHLIGHT_FROM;
  if (highlightTo) squareStyles[highlightTo] = HIGHLIGHT_TO;
  redSquares?.forEach((sq) => { squareStyles[sq] = MATE_RED; });
  yellowSquares?.forEach((sq) => { squareStyles[sq] = MATE_YELLOW; });

  return (
    <div style={{ height: BOARD_SIZE }}>
      <div
        style={{
          width: BOARD_SIZE,
          height: BOARD_SIZE,
          boxShadow: '0 16px 64px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}
      >
        <ChessPathBoard
          options={{
            position: fen,
            boardOrientation: orientation,
            animationDurationInMs: 0,
            boardStyle: { borderRadius: '0px' },
            squareStyles,
          }}
        />
      </div>
    </div>
  );
};
