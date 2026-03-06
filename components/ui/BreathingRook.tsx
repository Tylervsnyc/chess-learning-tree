'use client';

import { ROOK_BLOCKS, getMatteBackground } from '@/lib/daily-rook-blocks';

/**
 * BreathingRook — The standard loading indicator for Chess Path.
 * 22 rook blocks stay in place; colors breathe with a staggered wave.
 * See RULES.md §35.
 *
 * Animation modes:
 * - breathe: gentle slow brightness pulse (default when animate=true)
 * - enter: blocks pop in from nothing with staggered delay
 * - think: fast shimmer wave (for loading/processing states)
 * - celebrate: blocks do a quick scale bounce with rainbow brightness
 */

const SIZE_MAP = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 36,
};

type AnimationMode = 'breathe' | 'enter' | 'think' | 'celebrate' | 'powerOn';

interface BreathingRookProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  className?: string;
  /** Enable gentle breathing animation (slow human-like pulse) */
  animate?: boolean;
  /** Specific animation mode (overrides animate when set) */
  animation?: AnimationMode;
}

// Build a lookup map: "x,y" → block
const BLOCK_MAP = new Map(ROOK_BLOCKS.map(b => [`${b.x},${b.y}`, b]));

// All 30 cells in the 5×6 grid, row by row
const ALL_CELLS = Array.from({ length: 30 }, (_, i) => ({
  x: i % 5,
  y: Math.floor(i / 5),
}));

// Center of the rook grid for distance calculations
const CENTER_X = 2;
const CENTER_Y = 2.5;

function getBlockDelay(x: number, y: number, mode: AnimationMode): number {
  const dist = Math.sqrt((x - CENTER_X) ** 2 + (y - CENTER_Y) ** 2);
  const maxDist = 3.2;
  const normalized = dist / maxDist;

  switch (mode) {
    case 'enter':
      return normalized * 0.4; // 0-400ms stagger, center first
    case 'think':
      return (x + y) * 0.08; // fast diagonal wave
    case 'celebrate':
      return normalized * 0.15; // quick burst from center
    case 'powerOn': {
      // Pseudo-random but deterministic per cell position
      const seed = (x * 7 + y * 13) % 22;
      return (seed / 22) * 2.5; // stagger over 2.5s so full animation ~3s
    }
    case 'breathe':
    default:
      return (x + y) * 0.18;
  }
}

// The block that flickers after powerOn (yellow square in the crown rim)
const FLICKER_BLOCK = { x: 1, y: 1 };

function getBlockAnimation(mode: AnimationMode, delay: number, x?: number, y?: number): string {
  switch (mode) {
    case 'enter':
      return `rookEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`;
    case 'think':
      return `rookThink 1.2s ease-in-out ${delay}s infinite`;
    case 'celebrate':
      return `rookCelebrate 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`;
    case 'powerOn': {
      const isFlicker = x === FLICKER_BLOCK.x && y === FLICKER_BLOCK.y;
      if (isFlicker) {
        // This block powers on then flickers on/off endlessly
        return `rookPowerOn 0.5s ease-out ${delay}s both, rookFlicker 6s step-end ${delay + 0.5}s infinite`;
      }
      return `rookPowerOn 0.5s ease-out ${delay}s both`;
    }
    case 'breathe':
    default:
      return `rookColorBreathe 5s ease-in-out ${delay}s infinite`;
  }
}

const ANIMATION_KEYFRAMES = `
  @keyframes rookColorBreathe {
    0%, 100% { filter: brightness(0.9) saturate(0.95); }
    50% { filter: brightness(1.5) saturate(1.2); }
  }
  @keyframes rookEnter {
    0% { opacity: 0; transform: scale(0); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes rookThink {
    0%, 100% { filter: brightness(1) saturate(1); transform: scale(1); }
    50% { filter: brightness(1.6) saturate(1.3); transform: scale(1.05); }
  }
  @keyframes rookCelebrate {
    0% { transform: scale(1); filter: brightness(1); }
    40% { transform: scale(1.3); filter: brightness(1.8); }
    100% { transform: scale(1); filter: brightness(1.1); }
  }
  @keyframes rookPowerOn {
    0% { filter: brightness(0.1) saturate(0); }
    60% { filter: brightness(1.4) saturate(1.1); }
    100% { filter: brightness(1) saturate(1); }
  }
  @keyframes rookFlicker {
    /* Morse code for "chess": C(-·-·) H(····) E(·) S(···) S(···) */
    /* 48 time units total, OFF = dark blink, ON = lit */
    /* C: dash */
    0%      { filter: brightness(0.1) saturate(0); }
    /* C: gap */
    6.25%   { filter: brightness(1) saturate(1); }
    /* C: dot */
    8.33%   { filter: brightness(0.1) saturate(0); }
    /* C: gap */
    10.42%  { filter: brightness(1) saturate(1); }
    /* C: dash */
    12.5%   { filter: brightness(0.1) saturate(0); }
    /* C: gap */
    18.75%  { filter: brightness(1) saturate(1); }
    /* C: dot */
    20.83%  { filter: brightness(0.1) saturate(0); }
    /* letter gap */
    22.92%  { filter: brightness(1) saturate(1); }
    /* H: dot 1 */
    29.17%  { filter: brightness(0.1) saturate(0); }
    31.25%  { filter: brightness(1) saturate(1); }
    /* H: dot 2 */
    33.33%  { filter: brightness(0.1) saturate(0); }
    35.42%  { filter: brightness(1) saturate(1); }
    /* H: dot 3 */
    37.5%   { filter: brightness(0.1) saturate(0); }
    39.58%  { filter: brightness(1) saturate(1); }
    /* H: dot 4 */
    41.67%  { filter: brightness(0.1) saturate(0); }
    /* letter gap */
    43.75%  { filter: brightness(1) saturate(1); }
    /* E: dot */
    50%     { filter: brightness(0.1) saturate(0); }
    /* letter gap */
    52.08%  { filter: brightness(1) saturate(1); }
    /* S: dot 1 */
    58.33%  { filter: brightness(0.1) saturate(0); }
    60.42%  { filter: brightness(1) saturate(1); }
    /* S: dot 2 */
    62.5%   { filter: brightness(0.1) saturate(0); }
    64.58%  { filter: brightness(1) saturate(1); }
    /* S: dot 3 */
    66.67%  { filter: brightness(0.1) saturate(0); }
    /* letter gap */
    68.75%  { filter: brightness(1) saturate(1); }
    /* S: dot 1 */
    75%     { filter: brightness(0.1) saturate(0); }
    77.08%  { filter: brightness(1) saturate(1); }
    /* S: dot 2 */
    79.17%  { filter: brightness(0.1) saturate(0); }
    81.25%  { filter: brightness(1) saturate(1); }
    /* S: dot 3 */
    83.33%  { filter: brightness(0.1) saturate(0); }
    /* word gap — stays lit until loop */
    85.42%  { filter: brightness(1) saturate(1); }
    100%    { filter: brightness(1) saturate(1); }
  }
`;

export function BreathingRook({ size = 'md', label, className = '', animate = false, animation }: BreathingRookProps) {
  const blockSize = SIZE_MAP[size];
  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const radius = Math.max(1, Math.round(blockSize * 0.14));
  const scale = blockSize / 14;
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  const insetShadow = `inset 0 ${s(0.75)} 0 rgba(0,0,0,0.15), inset 0 -${s(0.75)} 0 rgba(255,255,255,0.15)`;

  // Exact pixel dimensions to prevent flex layouts from introducing sub-pixel offsets
  const gridWidth = 5 * blockSize + 4 * gap;
  const gridHeight = 6 * blockSize + 5 * gap;

  const activeMode: AnimationMode | null = animation || (animate ? 'breathe' : null);

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

          const delay = activeMode ? getBlockDelay(x, y, activeMode) : 0;

          return (
            <div
              key={`${x},${y}`}
              style={{
                borderRadius: radius,
                background: getMatteBackground(block.color),
                boxShadow: insetShadow,
                ...(activeMode ? {
                  animation: getBlockAnimation(activeMode, delay, x, y),
                  ...(activeMode === 'enter' ? { opacity: 0 } : {}),
                  ...(activeMode === 'powerOn' ? { filter: 'brightness(0.1) saturate(0)' } : {}),
                } : {}),
              }}
            />
          );
        })}
      </div>
      {label && (
        <span className="text-xs text-chess-text-faint animate-pulse">{label}</span>
      )}
      {activeMode && <style>{ANIMATION_KEYFRAMES}</style>}
    </div>
  );
}
