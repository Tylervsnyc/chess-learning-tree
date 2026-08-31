import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';
import {
  ROOK_BLOCK, ROOK_CELL, ROOK_RADIUS, ROOK_W, ROOK_H, ROOK_COLORS, matteStops, gradientId,
} from '@/lib/brand/rook-mark';

/**
 * The brand rook as an inline SVG, drawn from lib/brand/rook-mark so it is
 * pixel-identical to the native iOS launch image. Each block carries
 * data-i (fill order index, bottom→top) and --dx/--dy (direction away from
 * the rook's centre) so splash animations can address blocks individually.
 */
export function RookMark({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${ROOK_W} ${ROOK_H}`}
      className={className}
      style={{ display: 'block', overflow: 'visible', ...style }}
      aria-hidden
    >
      <defs>
        {ROOK_COLORS.map((c) => (
          <linearGradient key={c} id={gradientId(c)} x1="0" y1="0" x2="0" y2="1">
            {matteStops(c).map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        ))}
      </defs>
      {ROOK_BLOCKS.map((b, i) => (
        <rect
          key={i}
          className="rm-block"
          data-row={b.y}
          x={b.x * ROOK_CELL}
          y={b.y * ROOK_CELL}
          width={ROOK_BLOCK}
          height={ROOK_BLOCK}
          rx={ROOK_RADIUS}
          fill={`url(#${gradientId(b.color)})`}
          style={
            {
              '--dx': (b.x - 2).toString(),
              '--dy': (b.y - 2.5).toString(),
              '--i': ((5 - b.y) * 5 + b.x).toString(),
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  );
}
