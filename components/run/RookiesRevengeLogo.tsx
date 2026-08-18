'use client';

import { ROOK_BLOCKS, lighten, darken } from '@/lib/daily-rook-blocks';

/**
 * Rookie's Revenge — canonical mark.
 * The straight 22-block rainbow rook, centered inside a red target reticle
 * (outer ring, faded inner ring, center dot, 4 ticks). Pure SVG so the same
 * geometry ships as app icon, favicon, OG image, and in-app lockups.
 *
 * Everything else (wordmark, tiles) is built FROM this mark — never redraw it.
 */

export const REVENGE_TAGLINE = 'The game ended. And Rookie took that personally.';
export const REVENGE_RED = '#E53935';
export const REVENGE_RED_DARK = '#B71C1C';

const COLS = 5;
const ROWS = 6;
// Geometry in a 200x200 viewBox
const VB = 200;
const C = VB / 2;
const STROKE = 4.5;
const R_OUTER = C - STROKE * 1.5;      // 93.25
const R_INNER = R_OUTER * 0.68;
const TICK = VB * 0.09;
const ROOK_H = VB * 0.56;              // rook height inside the ring

export function RevengeMarkSvg({ size = 200, ringColor = REVENGE_RED, className, title = "Rookie's Revenge" }: {
  size?: number; ringColor?: string; className?: string; title?: string;
}) {
  const block = ROOK_H / (ROWS + (ROWS - 1) * (3 / 22)); // block+gap so 6 rows = ROOK_H
  const gap = block * (3 / 22);
  const rookW = COLS * block + (COLS - 1) * gap;
  const x0 = C - rookW / 2;
  const y0 = C - ROOK_H / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${VB} ${VB}`} className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <defs>
        {ROOK_BLOCKS.map((b) => (
          <linearGradient key={`g-${b.x}-${b.y}`} id={`rvg-${b.x}${b.y}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lighten(b.color, 18)} />
            <stop offset="20%" stopColor={lighten(b.color, 12)} />
            <stop offset="40%" stopColor={b.color} />
            <stop offset="100%" stopColor={darken(b.color, 12)} />
          </linearGradient>
        ))}
      </defs>
      {/* rook */}
      {ROOK_BLOCKS.map((b) => (
        <rect
          key={`${b.x}-${b.y}`}
          x={x0 + b.x * (block + gap)}
          y={y0 + b.y * (block + gap)}
          width={block}
          height={block}
          rx={block * 0.09}
          fill={`url(#rvg-${b.x}${b.y})`}
          stroke="rgba(0,0,0,0.15)"
          strokeWidth={0.6}
        />
      ))}
      {/* reticle */}
      <circle cx={C} cy={C} r={R_OUTER} fill="none" stroke={ringColor} strokeWidth={STROKE * 1.4} />
      <circle cx={C} cy={C} r={R_INNER} fill="none" stroke={ringColor} strokeWidth={STROKE * 0.9} opacity={0.55} />
      <circle cx={C} cy={C} r={VB * 0.035} fill={ringColor} />
      {[0, 90, 180, 270].map((deg) => (
        <line key={deg} x1={C} y1={0} x2={C} y2={TICK} stroke={ringColor} strokeWidth={STROKE * 1.4} transform={`rotate(${deg} ${C} ${C})`} />
      ))}
    </svg>
  );
}

/** App-icon tile: white rounded square with the mark. `radius` as fraction of size (iOS ≈ 0.2237). */
export function RevengeIcon({ size = 120, bg = '#fff', ringColor = REVENGE_RED, radius = 0.2237, className }: {
  size?: number; bg?: string; ringColor?: string; radius?: number; className?: string;
}) {
  return (
    <div
      className={className}
      style={{ width: size, height: size, borderRadius: size * radius, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      <RevengeMarkSvg size={size * 0.84} ringColor={ringColor} />
    </div>
  );
}

/** Horizontal lockup: mark + "Rookie's" over a red REVENGE pill, text column matched to mark height. `scale` 1 = 150px mark. */
export function RookiesRevengeLogo({ scale = 1, dark, className }: { scale?: number; dark?: boolean; className?: string }) {
  const mark = 150 * scale;
  const rookieSize = 46 * scale;
  const revengeSize = 50 * scale;
  return (
    <div className={`inline-flex items-stretch ${className ?? ''}`} style={{ gap: 12 * scale, height: mark }}>
      <RevengeMarkSvg size={mark} />
      <div className="flex flex-col items-stretch justify-between leading-none" style={{ paddingTop: 10 * scale, paddingBottom: 12 * scale }}>
        <div className="font-black tracking-tight" style={{ fontSize: rookieSize, color: dark ? '#fff' : '#3C3C3C', paddingLeft: 4 * scale }}>Rookie&rsquo;s</div>
        <div
          className="font-black tracking-tight text-white text-center"
          style={{
            fontSize: revengeSize, background: REVENGE_RED, padding: `${9 * scale}px ${16 * scale}px ${10 * scale}px`,
            borderRadius: 12 * scale, boxShadow: `0 ${4 * scale}px 0 ${REVENGE_RED_DARK}`, letterSpacing: '-0.02em',
          }}
        >
          REVENGE
        </div>
      </div>
    </div>
  );
}

/** Stacked lockup (splash / share cards): mark on top, wordmark below. */
export function RookiesRevengeLogoStacked({ scale = 1, dark, className }: { scale?: number; dark?: boolean; className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className ?? ''}`} style={{ gap: 6 * scale }}>
      <RevengeMarkSvg size={180 * scale} />
      <div className="flex flex-col items-center leading-none">
        <div className="font-black tracking-tight" style={{ fontSize: 34 * scale, color: dark ? '#fff' : '#3C3C3C' }}>Rookie&rsquo;s</div>
        <div
          className="font-black tracking-tight text-white"
          style={{
            fontSize: 44 * scale, background: REVENGE_RED, padding: `${8 * scale}px ${20 * scale}px`,
            borderRadius: 12 * scale, boxShadow: `0 ${4 * scale}px 0 ${REVENGE_RED_DARK}`, marginTop: 4 * scale, letterSpacing: '-0.02em',
          }}
        >
          REVENGE
        </div>
      </div>
    </div>
  );
}
