'use client';

import { useEffect, useRef, useState } from 'react';
import CHASE from '@/data/locker-chase.json';

/**
 * ChessChase — the perpetual-motion machine on the locker's chess board.
 * A black bishop + knight chase the white king in a 20-ply cycle where
 * every black move is a real check and every king move a legal escape
 * (found + validated by scripts/design-locker-chase.ts with chess.js).
 *
 * Renders as an absolutely-positioned overlay inside LockerHome's
 * 1024x1536 frame; squares are mapped onto the painted board with a
 * measured perspective grid (files a..g, ranks 1..5).
 */

type Ply = { piece: string; from: string; to: string };
const PLIES = CHASE as Ply[];

// ─── measured board grid (pixels in the 1024x1536 art) ───
// Exact per-square centers from an adaptive luminance scan of the painted
// checker (parity-validated 7/7 per row). The board has 4 full rows; the
// chase is confined to files a-f, ranks 1-4. Rank 1 = front row.
const GRID: { y: number; h: number; cols: number[] }[] = [
  { y: 1182, h: 45, cols: [281, 375, 468, 561, 654, 747, 840] }, // r1
  { y: 1139, h: 40, cols: [293, 381, 469, 557, 645, 733, 821] }, // r2
  { y: 1100, h: 38, cols: [309, 393, 476, 559, 642, 725, 809] }, // r3
  { y: 1065, h: 33, cols: [319, 398, 478, 557, 636, 716, 795] }, // r4
];

function squarePos(sq: string) {
  const i = sq.charCodeAt(0) - 97; // a..g -> 0..6
  const r = Number(sq[1]); // 1..4
  const row = GRID[r - 1];
  const x = row.cols[i] / 1024;
  // feet planted just below the square's visual center
  const y = (row.y + row.h * 0.32) / 1536;
  const scale = 1 - ((r - 1) / 3) * 0.24; // front 1.0 -> back 0.76
  return { x, y, scale, r };
}

// base sprite heights at rank 1, as % of frame height
const SPRITE_H: Record<string, number> = { k: 7.2, b: 5.9, n: 5.9 };
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
