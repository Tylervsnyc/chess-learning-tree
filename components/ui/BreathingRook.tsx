'use client';

import { ROOK_BLOCKS, getMatteBackground } from '@/lib/daily-rook-blocks';

/**
 * BreathingRook — The standard loading indicator for Chess Path.
 * 22 rook blocks stay in place; colors breathe with a staggered wave.
 * See RULES.md §35.
 */

const SIZE_MAP = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
};

interface BreathingRookProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

// Build a lookup map: "x,y" → block
const BLOCK_MAP = new Map(ROOK_BLOCKS.map(b => [`${b.x},${b.y}`, b]));

// All 30 cells in the 5×6 grid, row by row
const ALL_CELLS = Array.from({ length: 30 }, (_, i) => ({
  x: i % 5,
  y: Math.floor(i / 5),
}));

export function BreathingRook({ size = 'md', label, className = '' }: BreathingRookProps) {
  const blockSize = SIZE_MAP[size];
  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const radius = Math.max(1, Math.round(blockSize * 0.14));
  const scale = blockSize / 14;
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  const insetShadow = `inset 0 ${s(0.75)} 0 rgba(0,0,0,0.15), inset 0 -${s(0.75)} 0 rgba(255,255,255,0.15)`;

  // Exact pixel dimensions to prevent flex layouts from introducing sub-pixel offsets
  const gridWidth = 5 * blockSize + 4 * gap;
  const gridHeight = 6 * blockSize + 5 * gap;

  return (
    <div className={`inline-flex flex-col items-center gap-2 flex-shrink-0 ${className}`} role="status" aria-label={label || 'Loading'}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(5, ${blockSize}px)`,
          gridTemplateRows: `repeat(6, ${blockSize}px)`,
          gap: `${gap}px`,
          width: gridWidth,
          height: gridHeight,
          transform: 'translateZ(0)',
        }}
      >
        {ALL_CELLS.map(({ x, y }) => {
          const block = BLOCK_MAP.get(`${x},${y}`);
          if (!block) return <div key={`${x},${y}`} />;

          return (
            <div
              key={`${x},${y}`}
              style={{
                borderRadius: radius,
                background: getMatteBackground(block.color),
                boxShadow: insetShadow,
              }}
            />
          );
        })}
      </div>
      {label && (
        <span className="text-xs text-chess-text-faint animate-pulse">{label}</span>
      )}
    </div>
  );
}
