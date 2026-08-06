'use client';

import { useEffect, useRef, useState } from 'react';
import CHASE from '@/data/locker-chase.json';

/**
 * ChessChase — the perpetual-motion machine on the locker's chess board.
 * A black bishop + knight chase the white king in a cycle where every black
 * move is a real check and every king move a legal escape (found + validated
 * by scripts/design-locker-chase.ts with chess.js).
 *
 * The board itself is DRAWN here (BoardOverlay): a full folded half-board,
 * exactly 8 files x 4 ranks, painted over the art's checker in the art's own
 * colors — the painted checker underneath is ~7 files with a partial column
 * at the right edge, which read as a broken board. Squares and piece feet
 * share one measured trapezoid so they can never drift apart. The Enemy's
 * Tears bottle stands in FRONT of the board's front-right corner, so the
 * overlay is masked out under it (and the chase never parks a piece there —
 * h1..h3 are excluded in the solver).
 */

type Ply = { piece: string; from: string; to: string };
const PLIES = CHASE as Ply[];

// ─── the board trapezoid (pixels in the 1024x1536 art) ───
// Linear fits through the per-rank extents of the painted checker (adaptive
// luminance scan, same measurement the old 7-column GRID came from).
const ROW_Y = [1182, 1139, 1100, 1065]; // rank centers, front (r1) -> back (r4)
const ROW_H = [45, 40, 38, 33]; // visual square heights at those centers
// horizontal row boundaries between ranks, front edge -> back edge
const BOUND_Y = [1203.5, 1160.5, 1119.5, 1082.5, 1047.5];
const leftAt = (y: number) => 234.4 + (1182 - y) * 0.3838;
const rightAt = (y: number) => 886.6 - (1182 - y) * 0.4436;
const FILES = 8;

function squarePos(sq: string) {
  const i = sq.charCodeAt(0) - 97; // a..h -> 0..7
  const r = Number(sq[1]); // 1..4
  const yC = ROW_Y[r - 1];
  const L = leftAt(yC);
  const x = (L + ((i + 0.5) * (rightAt(yC) - L)) / FILES) / 1024;
  // feet planted just below the square's visual center
  const y = (yC + ROW_H[r - 1] * 0.32) / 1536;
  const scale = 1 - ((r - 1) / 3) * 0.24; // front 1.0 -> back 0.76
  return { x, y, scale, r };
}

// base sprite heights at rank 1, as % of frame height (sized to the 8-wide
// squares — narrower than the old 6-wide layout)
const SPRITE_H: Record<string, number> = { k: 6.5, b: 5.3, n: 5.3 };
const SPRITE_SRC: Record<string, string> = {
  k: '/boxing/locker/piece-wk.webp',
  b: '/boxing/locker/piece-bb.webp',
  n: '/boxing/locker/piece-bn.webp',
};

// starting squares = each piece's first 'from' in the cycle
function startSquares(): Record<string, string> {
  const start: Record<string, string> = {};
  for (const p of PLIES) if (!(p.piece in start)) start[p.piece] = p.from;
  return start;
}

const MOVE_MS = 650;
const BEAT_MS = 1500;

// art-sampled square colors, front rank -> back rank (the scene light falls
// off toward the back of the locker)
const LIGHT_FRONT = [219, 186, 135];
const LIGHT_BACK = [190, 152, 100];
const DARK_FRONT = [136, 81, 41];
const DARK_BACK = [108, 61, 30];

const mix = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;

/**
 * The drawn 8x4 checker, filling the painted board's frame. Each square is a
 * trapezoid between two row boundaries; a1 is dark, matching the art. The
 * perimeter gets a frame-brown seam so the old painted edges never peek out.
 */
function BoardOverlay() {
  const squares: React.ReactNode[] = [];
  for (let r = 1; r <= 4; r++) {
    const y0 = BOUND_Y[r - 1]; // front (bottom) edge of this rank
    const y1 = BOUND_Y[r]; // back (top) edge
    const w0 = (rightAt(y0) - leftAt(y0)) / FILES;
    const w1 = (rightAt(y1) - leftAt(y1)) / FILES;
    const t = (r - 1) / 3;
    const light = mix(LIGHT_FRONT, LIGHT_BACK, t);
    const dark = mix(DARK_FRONT, DARK_BACK, t);
    for (let i = 0; i < FILES; i++) {
      const bl = leftAt(y0) + i * w0;
      const tl = leftAt(y1) + i * w1;
      squares.push(
        <path
          key={`${r}-${i}`}
          d={`M ${bl.toFixed(1)} ${y0} L ${(bl + w0).toFixed(1)} ${y0} L ${(tl + w1).toFixed(1)} ${y1} L ${tl.toFixed(1)} ${y1} Z`}
          fill={(i + r) % 2 === 1 ? dark : light}
        />
      );
    }
  }
  const perimeter = `M ${leftAt(BOUND_Y[0]).toFixed(1)} ${BOUND_Y[0]} L ${rightAt(BOUND_Y[0]).toFixed(1)} ${BOUND_Y[0]} L ${rightAt(BOUND_Y[4]).toFixed(1)} ${BOUND_Y[4]} L ${leftAt(BOUND_Y[4]).toFixed(1)} ${BOUND_Y[4]} Z`;
  return (
    <svg
      viewBox="0 0 1024 1536"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden
    >
      <defs>
        {/* the bottle stands in front of the board — never draw under it */}
        <filter id="lhChaseSoft" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <mask id="lhChaseBottle">
          <rect x="0" y="0" width="1024" height="1536" fill="#fff" />
          <g filter="url(#lhChaseSoft)">
            <rect x="838" y="1103" width="186" height="130" fill="#000" />
            <rect x="862" y="1042" width="60" height="70" fill="#000" />
          </g>
        </mask>
      </defs>
      <g mask="url(#lhChaseBottle)">
        {squares}
        {/* frame seam — covers any sliver of the old painted checker */}
        <path d={perimeter} fill="none" stroke="#5f3619" strokeWidth="7" strokeLinejoin="round" opacity="0.9" />
      </g>
    </svg>
  );
}

export function ChessChase() {
  const [pos, setPos] = useState<Record<string, string>>(startSquares);
  const [mover, setMover] = useState<string | null>(null);
  const step = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const ply = PLIES[step.current % PLIES.length];
      step.current++;
      setMover(ply.piece);
      setPos((prev) => ({ ...prev, [ply.piece]: ply.to }));
      setTimeout(() => setMover(null), MOVE_MS);
    }, BEAT_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <style>{`
        @keyframes chaseHop {
          0%, 100% { margin-top: 0; }
          50% { margin-top: -1.2%; }
        }
      `}</style>
      <BoardOverlay />
      {(['b', 'n', 'k'] as const).map((piece) => {
        const sq = pos[piece];
        const { x, y, scale, r } = squarePos(sq);
        const h = SPRITE_H[piece] * scale;
        const isMoving = mover === piece;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={piece}
            src={SPRITE_SRC[piece]}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              left: `${(x * 100).toFixed(2)}%`,
              top: `${(y * 100).toFixed(2)}%`,
              height: `${h.toFixed(2)}%`,
              transform: 'translate(-50%, -100%)',
              transition: `left ${MOVE_MS}ms ease-in-out, top ${MOVE_MS}ms ease-in-out, height ${MOVE_MS}ms ease-in-out`,
              zIndex: 10 - r,
              animation: isMoving && piece === 'n' ? `chaseHop ${MOVE_MS}ms ease-in-out` : undefined,
              filter: isMoving ? 'brightness(1.08)' : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
