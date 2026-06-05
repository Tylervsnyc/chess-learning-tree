'use client';

import { useState } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { PieceBlocks, PIECE_TEMPLATES, type PieceType } from '@/components/run/PieceBlocks';

const PIECES: { piece: PieceType; name: string }[] = [
  { piece: 'P', name: 'Pawn' },
  { piece: 'N', name: 'Knight' },
  { piece: 'B', name: 'Bishop' },
  { piece: 'Q', name: 'Queen' },
  { piece: 'K', name: 'King' },
];

export default function RookiePiecesTestPage() {
  const [size, setSize] = useState(12);
  const [animate, setAnimate] = useState(true);

  return (
    <div className="min-h-screen overflow-auto bg-chess-bg text-chess-text p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Rookie → Piece Transformations</h1>
        <p className="text-sm text-chess-text-faint mb-2">
          Silhouettes rasterized from react-chessboard&apos;s default piece SVGs into Rookie&apos;s palette + matte block style.
        </p>
        <p className="text-xs text-chess-text-faint mb-6">
          Templates live in <code>components/run/PieceBlocks.tsx</code> — drop <code>&lt;PieceBlocks piece=&quot;N&quot; /&gt;</code> anywhere in Rookie&apos;s Run.
        </p>

        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
          <label className="flex items-center gap-2">
            Block size
            <input type="range" min={4} max={28} value={size} onChange={e => setSize(+e.target.value)} />
            <span className="tabular-nums w-8">{size}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={animate} onChange={e => setAnimate(e.target.checked)} />
            Breathing
          </label>
        </div>

        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white/50 dark:bg-white/5 border border-black/5">
            <BreathingRook size="lg" animate={animate} mood="neutral" />
            <span className="text-sm font-medium">Rookie (native 5×6)</span>
          </div>
          {PIECES.map(({ piece, name }) => {
            const t = PIECE_TEMPLATES[piece];
            return (
              <div key={piece} className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white/50 dark:bg-white/5 border border-black/5">
                <PieceBlocks piece={piece} blockSize={size} animate={animate} />
                <span className="text-sm font-medium">{name} <span className="text-chess-text-faint">({t.cols}×{t.rows})</span></span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
