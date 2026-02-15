'use client';

import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';

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

export function BreathingRook({ size = 'md', label, className = '' }: BreathingRookProps) {
  const blockSize = SIZE_MAP[size];
  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const cols = 5;
  const rows = 6;
  const totalWidth = cols * blockSize + (cols - 1) * gap;
  const totalHeight = rows * blockSize + (rows - 1) * gap;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`} role="status" aria-label={label || 'Loading'}>
      <style>{`
        @keyframes rookBreathe {
          0%, 100% { opacity: 0.45; filter: brightness(0.8); }
          50% { opacity: 1; filter: brightness(1.3); }
        }
      `}</style>
      <div
        style={{
          position: 'relative',
          width: totalWidth,
          height: totalHeight,
        }}
      >
        {ROOK_BLOCKS.map((block, i) => {
          // Wave delay based on row (bottom-up) + column offset
          const waveDelay = (block.y * 0.18) + (block.x * 0.06);

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: block.x * (blockSize + gap),
                top: block.y * (blockSize + gap),
                width: blockSize,
                height: blockSize,
                borderRadius: Math.max(1, Math.round(blockSize * 0.14)),
                backgroundColor: block.color,
                boxShadow: `0 0 ${Math.round(blockSize * 0.5)}px ${block.color}50`,
                animation: `rookBreathe 2.4s ease-in-out ${waveDelay}s infinite`,
              }}
            />
          );
        })}
      </div>
      {label && (
        <span className="text-xs text-gray-400 animate-pulse">{label}</span>
      )}
    </div>
  );
}
