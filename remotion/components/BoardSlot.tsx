import React from 'react';
import { Chessboard } from 'react-chessboard';
import { BOARD_COLORS } from '../../lib/puzzle-utils';
import { BOARD_SIZE } from '../lib/timing';

// Lichess-style last-move highlight (amber)
const HIGHLIGHT_FROM = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
const HIGHLIGHT_TO = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };

/**
 * Chess board at 1080px (4x scale). Dead center, never moves.
 * Supports optional last-move highlight squares.
 */
export const BoardSlot: React.FC<{
  fen: string;
  orientation: 'white' | 'black';
  highlightFrom?: string;
  highlightTo?: string;
}> = ({ fen, orientation, highlightFrom, highlightTo }) => {
  const squareStyles: Record<string, React.CSSProperties> = {};
  if (highlightFrom) squareStyles[highlightFrom] = HIGHLIGHT_FROM;
  if (highlightTo) squareStyles[highlightTo] = HIGHLIGHT_TO;

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
        <Chessboard
          options={{
            position: fen,
            boardOrientation: orientation,
            animationDurationInMs: 0,
            boardStyle: { borderRadius: '0px' },
            darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
            lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
            squareStyles,
          }}
        />
      </div>
    </div>
  );
};
