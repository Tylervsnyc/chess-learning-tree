'use client';

import { Chessboard } from 'react-chessboard';
import { BOARD_COLORS } from '@/lib/puzzle-utils';

type ChessboardProps = Parameters<typeof Chessboard>[0];
type ChessboardOptions = ChessboardProps['options'];

/**
 * Standard Chess Path board wrapper.
 *
 * Pre-applies our green/cream board colors and default styling.
 * ALWAYS use this instead of importing Chessboard from react-chessboard directly.
 *
 * Same API as react-chessboard's Chessboard — just swap the import and component name.
 * boardStyle, darkSquareStyle, lightSquareStyle are merged with defaults (your overrides win).
 */
export function ChessPathBoard({ options }: ChessboardProps) {
  const {
    boardStyle,
    darkSquareStyle,
    lightSquareStyle,
    ...rest
  } = options ?? {};

  return (
    <Chessboard
      options={{
        boardStyle: {
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          ...boardStyle,
        },
        darkSquareStyle: {
          backgroundColor: BOARD_COLORS.dark,
          ...darkSquareStyle,
        },
        lightSquareStyle: {
          backgroundColor: BOARD_COLORS.light,
          ...lightSquareStyle,
        },
        ...rest,
      }}
    />
  );
}
