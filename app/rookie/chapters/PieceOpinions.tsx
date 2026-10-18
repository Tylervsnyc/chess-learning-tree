'use client';

import { useState } from 'react';
import { CHESS_PIECE_SVG } from '@/components/seo/chessPieces';
import { PIECE_OPINIONS } from '../script';
import type { Stage } from '../stage';

// Same piece art as the app's boards (white set).
const PIECE_KEY: Record<string, string> = { Queen: 'wQ', Bishop: 'wB', Knight: 'wN', Pawn: 'wP', King: 'wK', Rook: 'wR' };

export function PieceOpinions({ stage }: { stage: Stage }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {PIECE_OPINIONS.map((p) => (
        <button
          key={p.piece}
          onClick={() => { setActive(p.piece); stage.say(p.line, { mood: p.mood }); }}
          className={`text-left bg-white rounded-2xl p-4 min-h-[44px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition ${
            active === p.piece ? 'ring-2 ring-chess-text' : 'hover:-translate-y-0.5'
          }`}
        >
          <svg
            viewBox="0 0 45 45"
            aria-hidden
            className="block w-14 h-14 drop-shadow-[0_1px_1px_rgba(0,0,0,0.28)]"
            dangerouslySetInnerHTML={{ __html: CHESS_PIECE_SVG[PIECE_KEY[p.piece]] }}
          />
          <span className="mt-3 block font-black">{p.piece}</span>
          <span className="mt-0.5 block text-sm text-chess-text-muted">{p.take}</span>
        </button>
      ))}
    </div>
  );
}
