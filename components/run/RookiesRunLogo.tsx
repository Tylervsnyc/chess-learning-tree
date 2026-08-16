'use client';

import { ROOK_BLOCKS, getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';

/**
 * Rookie's Run logo — leaning 22-block rook + "Rookie's" wordmark over a
 * blue "RUN" pill. Solid blocks / solid colors only — embroidery-safe.
 *
 * Pass `scale` to resize the whole lockup proportionally.
 */

const COLS = 5;
const ROWS = 6;

interface RookiesRunLogoProps {
  /** Visual scale. 1 = original (~22px blocks, 52px Rookie's, 60px RUN). */
  scale?: number;
  className?: string;
}

export function RookiesRunLogo({ scale = 1, className }: RookiesRunLogoProps) {
  const BLOCK = 22 * scale;
  const GAP = 3 * scale;
  const LEAN = 5 * scale;

  const leanTop = (ROWS - 1) * LEAN;
  const innerW = COLS * BLOCK + (COLS - 1) * GAP + leanTop;
  const innerH = ROWS * BLOCK + (ROWS - 1) * GAP;

  const rookieSize = 52 * scale;
  const runSize = 60 * scale;
  const pillPadX = 24 * scale;
  const pillPadY = 12 * scale;
  const pillRadius = 16 * scale;
  const pillDropY = 5 * scale;

  return (
    <div className={`flex items-stretch gap-1 ${className ?? ''}`}>
      <div style={{ position: 'relative', width: innerW, height: innerH }}>
        {ROOK_BLOCKS.map((b) => {
          const lean = b.y * LEAN;
          const left = b.x * (BLOCK + GAP) + lean;
          const top = b.y * (BLOCK + GAP);
          return (
            <div
              key={`b-${b.x}-${b.y}`}
              style={{
                position: 'absolute',
                left,
                top,
                width: BLOCK,
                height: BLOCK,
                borderRadius: 2 * scale,
                background: getMatteBackground(b.color),
                boxShadow: getMatteBoxShadow(b.color, BLOCK / 14),
              }}
            />
          );
        })}
      </div>
      <div
        className="self-stretch leading-none flex flex-col items-stretch justify-between"
        style={{ paddingBottom: 5 * scale }}
      >
        <div
          className="font-black tracking-tight text-chess-text leading-none"
          style={{ fontSize: rookieSize, marginTop: '-0.18em' }}
        >
          Rookie&rsquo;s
        </div>
        <div
          className="bg-chess-blue text-center"
          style={{
            paddingLeft: pillPadX,
            paddingRight: pillPadX,
            paddingTop: pillPadY,
            paddingBottom: pillPadY,
            borderRadius: pillRadius,
            boxShadow: `0 ${pillDropY}px 0 #1899D6`,
          }}
        >
          <span
            className="font-black tracking-tight text-white leading-none"
            style={{ fontSize: runSize }}
          >
            RUN
          </span>
        </div>
      </div>
    </div>
  );
}
