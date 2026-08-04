'use client';

import { useId } from 'react';
import { ROOK_BLOCKS, lighten, darken } from '@/lib/daily-rook-blocks';

/**
 * BoxingLogoLoader — animated Chess Boxing logo (the "G1" app icon) for
 * loading/splash screens.
 *
 * Sequence (~1.6s intro, then loops):
 *  1. board squares fade in (checker stagger)
 *  2. the rope draws itself around the ring
 *  3. corner pads pop in clockwise
 *  4. Rookie's blocks pop in center-out (BreathingRook 'enter')
 *  5. settle into the slow color-breathe loop
 */

const NAVY = '#1b2a4a';
const NAVY_DEEP = '#101a33';
const ROPE_RED = '#e5484d';
const SQ_DARK = '#28375f';

const CELL = 9.5;
const GAP = CELL * 0.15;
const STEP = CELL + GAP;
const ROOK_W = 5 * CELL + 4 * GAP;
const ROOK_H = 6 * CELL + 5 * GAP;
const ROOK_X = (100 - ROOK_W) / 2;
const ROOK_Y = (100 - ROOK_H) / 2;
const CENTER_X = 2;
const CENTER_Y = 2.5;

// Rope rect perimeter (w=82, h=82, rx=9) for the draw-on effect
const ROPE_LEN = 2 * (82 - 18) + 2 * (82 - 18) + 2 * Math.PI * 9;

const KEYFRAMES = `
  @keyframes cbSquareIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes cbRopeDraw {
    0% { stroke-dashoffset: ${ROPE_LEN.toFixed(1)}; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes cbPadPop {
    0% { opacity: 0; transform: scale(0); }
    70% { opacity: 1; transform: scale(1.25); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes cbBlockIn {
    0% { opacity: 0; transform: scale(0); }
    70% { opacity: 1; transform: scale(1.15); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes cbBlockBreathe {
    0%, 100% { filter: brightness(0.9) saturate(0.95); }
    50% { filter: brightness(1.5) saturate(1.2); }
  }
`;

// Timeline anchors (seconds)
const T_BOARD = 0;      // board squares start
const T_ROPE = 0.25;    // rope draw starts
const T_PADS = 0.8;     // first pad pops
const T_ROOK = 1.0;     // first rook block pops
const T_BREATHE = 1.9;  // breathe loop begins (after last block lands)

export function BoxingLogoLoader({ size = 160, className = '' }: { size?: number; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const sq = 76 / 4;
  // Clockwise from top-left
  const pads: [number, number][] = [[9, 9], [91, 9], [91, 91], [9, 91]];
  return (
    <div className={className} style={{ width: size, height: size }} role="status" aria-label="Loading">
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          {Array.from(new Set(ROOK_BLOCKS.map((b) => b.color))).map((c) => (
            <linearGradient key={c} id={`${id}${c.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lighten(c, 18)} />
              <stop offset="20%" stopColor={lighten(c, 12)} />
              <stop offset="40%" stopColor={c} />
              <stop offset="100%" stopColor={darken(c, 12)} />
            </linearGradient>
          ))}
        </defs>
        <rect width={100} height={100} rx={22.4} fill={NAVY_DEEP} />

        {/* 1. board squares — checker-stagger fade */}
        {Array.from({ length: 16 }, (_, i) => {
          const cx = i % 4;
          const cy = Math.floor(i / 4);
          const delay = T_BOARD + ((cx + cy) % 2 === 0 ? 0 : 0.12) + (cx + cy) * 0.03;
          return (
            <rect
              key={i}
              x={12 + cx * sq}
              y={12 + cy * sq}
              width={sq}
              height={sq}
              fill={(cx + cy) % 2 === 0 ? SQ_DARK : NAVY}
              style={{ opacity: 0, animation: `cbSquareIn 0.3s ease-out ${delay}s forwards` }}
            />
          );
        })}

        {/* 2. rope draws itself around the ring */}
        <rect
          x={9} y={9} width={82} height={82} rx={9}
          fill="none" stroke={ROPE_RED} strokeWidth={4.5} strokeLinecap="round"
          strokeDasharray={ROPE_LEN.toFixed(1)}
          style={{ animation: `cbRopeDraw 0.9s cubic-bezier(0.65, 0, 0.35, 1) ${T_ROPE}s both` }}
        />

        {/* 3. corner pads pop clockwise */}
        {pads.map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx} cy={cy} r={6.5}
            fill={ROPE_RED} stroke={NAVY_DEEP} strokeWidth={1.8}
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              opacity: 0,
              animation: `cbPadPop 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${T_PADS + i * 0.08}s forwards`,
            }}
          />
        ))}

        {/* 4+5. Rookie: blocks pop center-out, then breathe */}
        {ROOK_BLOCKS.map((b) => {
          const dist = Math.sqrt((b.x - CENTER_X) ** 2 + (b.y - CENTER_Y) ** 2);
          const inDelay = T_ROOK + (dist / 3.2) * 0.45;
          const breatheDelay = T_BREATHE + (b.x + b.y) * 0.18;
          const bx = ROOK_X + b.x * STEP;
          const by = ROOK_Y + b.y * STEP;
          return (
            <rect
              key={`${b.x}-${b.y}`}
              x={bx} y={by} width={CELL} height={CELL} rx={CELL * 0.14}
              fill={`url(#${id}${b.color.slice(1)})`}
              style={{
                transformOrigin: `${bx + CELL / 2}px ${by + CELL / 2}px`,
                opacity: 0,
                animation: [
                  `cbBlockIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${inDelay}s forwards`,
                  `cbBlockBreathe 5s ease-in-out ${breatheDelay}s infinite`,
                ].join(', '),
              }}
            />
          );
        })}

        <style>{KEYFRAMES}</style>
      </svg>
    </div>
  );
}
