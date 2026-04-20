import { Chess } from 'chess.js';
import { BOARD_COLORS } from '@/lib/puzzle-utils';
import { CHESS_PIECE_SVG } from './chessPieces';

const PIECE_BOX = 45;

interface StaticBoardProps {
  fen: string;
  size?: number;
  showCoordinates?: boolean;
  caption?: string;
}

export function StaticBoard({
  fen,
  size = 320,
  showCoordinates = true,
  caption,
}: StaticBoardProps) {
  let chess: Chess;
  try {
    chess = new Chess(fen);
  } catch {
    chess = new Chess();
  }

  const square = size / 8;
  const pieceScale = square / PIECE_BOX;
  const labelSize = Math.max(9, square * 0.17);

  const squares: React.ReactNode[] = [];
  const pieces: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const rankChar = String.fromCharCode('8'.charCodeAt(0) - r);
      const fileChar = String.fromCharCode('a'.charCodeAt(0) + c);
      const sq = `${fileChar}${rankChar}` as const;
      const isLight = (r + c) % 2 === 0;
      squares.push(
        <rect
          key={`sq-${sq}`}
          x={c * square}
          y={r * square}
          width={square}
          height={square}
          fill={isLight ? BOARD_COLORS.light : BOARD_COLORS.dark}
        />
      );
      const piece = chess.get(sq as Parameters<typeof chess.get>[0]);
      if (piece) {
        const key = `${piece.color}${piece.type.toUpperCase()}`;
        const svg = CHESS_PIECE_SVG[key];
        if (svg) {
          pieces.push(
            <g
              key={`p-${sq}`}
              transform={`translate(${c * square}, ${r * square}) scale(${pieceScale})`}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          );
        }
      }
    }
  }

  if (showCoordinates) {
    for (let r = 0; r < 8; r++) {
      const rankChar = String.fromCharCode('8'.charCodeAt(0) - r);
      const isLight = r % 2 === 0;
      labels.push(
        <text
          key={`rank-${rankChar}`}
          x={3}
          y={r * square + labelSize + 1}
          fontSize={labelSize}
          fontWeight="600"
          fill={isLight ? BOARD_COLORS.dark : BOARD_COLORS.light}
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {rankChar}
        </text>
      );
    }
    for (let c = 0; c < 8; c++) {
      const fileChar = String.fromCharCode('a'.charCodeAt(0) + c);
      const isLight = (7 + c) % 2 === 0;
      labels.push(
        <text
          key={`file-${fileChar}`}
          x={c * square + square - labelSize * 0.75}
          y={size - 3}
          fontSize={labelSize}
          fontWeight="600"
          fill={isLight ? BOARD_COLORS.dark : BOARD_COLORS.light}
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {fileChar}
        </text>
      );
    }
  }

  return (
    <figure className="inline-block">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={caption ?? 'Chess position'}
        className="rounded-lg shadow-md"
      >
        {squares}
        {pieces}
        {labels}
      </svg>
      {caption && (
        <figcaption className="text-sm text-slate-600 text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
