'use client';

import { useState } from 'react';
import { PIECE_OPINIONS } from '../script';
import type { Stage } from '../stage';

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
          {/* U+FE0E keeps the glyph as text, not an emoji */}
          <span className="block text-5xl leading-none text-chess-text">{p.glyph}{'︎'}</span>
          <span className="mt-3 block font-black">{p.piece}</span>
          <span className="mt-0.5 block text-sm text-chess-text-muted">{p.take}</span>
        </button>
      ))}
    </div>
  );
}
