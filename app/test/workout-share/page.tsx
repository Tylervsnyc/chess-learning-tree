'use client';

import { useState } from 'react';

const DAYS = [1, 3, 7, 14, 30, 100, 365];

type Variant = {
  kind: 'puzzle' | 'opening' | 'game';
  heading: string;
  fen: string;
  label?: string;
  result?: string;
  outcome?: 'win' | 'loss' | 'draw';
};

// Real positions from the site.
const VARIANTS: Variant[] = [
  {
    kind: 'puzzle',
    heading: 'Puzzle (Daily Workout)',
    label: "Today's Puzzle",
    result: 'Solved',
    // Real daily puzzle CUQA1 (1.Bxf2+ Kxf2), final solved position.
    fen: 'r1b1k2r/ppppqppp/2n2n2/4p3/2P1P3/3P1NP1/PP3KBP/RNBQ3R',
  },
  {
    kind: 'opening',
    heading: 'Opening learned',
    label: 'The Italian',
    result: 'Learned',
    // Italian Game main line: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R',
  },
  {
    kind: 'game',
    heading: 'Game vs Rookie',
    outcome: 'win',
    result: 'Checkmate',
    // A real decisive game vs Rookie ending in 4.Qxf7#
    fen: 'rnbqk2r/pppp1Qpp/5n2/2b1p3/2B1P3/8/PPPP1PPP/RNB1K1NR',
  },
];

export default function WorkoutShareTest() {
  const [day, setDay] = useState(7);
  const [orient, setOrient] = useState<'white' | 'black'>('white');

  const url = (v: Variant) => {
    const p = new URLSearchParams({
      streak: String(day),
      kind: v.kind,
      fen: v.fen,
      orient,
    });
    if (v.label) p.set('label', v.label);
    if (v.result) p.set('result', v.result);
    if (v.outcome) p.set('outcome', v.outcome);
    return `/api/og/workout?${p.toString()}`;
  };

  return (
    <div className="h-full overflow-auto bg-chess-bg p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-black text-chess-text mb-1">Streak share materials</h1>
        <p className="text-sm text-chess-text-muted mb-5">
          The three activity variants side by side. Window 2 shows the board for what they did.
          Pick a streak day + board perspective.
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          {DAYS.map((n) => (
            <button
              key={n}
              onClick={() => setDay(n)}
              className={`py-2 px-4 rounded-xl font-black text-sm transition-all ${
                day === n
                  ? 'bg-chess-green text-white shadow-[0_3px_0_0_var(--color-chess-green-shadow)]'
                  : 'bg-chess-surface text-chess-text shadow-sm hover:shadow-md'
              }`}
            >
              Day {n}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          {(['white', 'black'] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOrient(o)}
              className={`py-2 px-4 rounded-xl font-black text-sm capitalize transition-all ${
                orient === o
                  ? 'bg-chess-text text-white shadow-sm'
                  : 'bg-chess-surface text-chess-text shadow-sm hover:shadow-md'
              }`}
            >
              {o} perspective
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VARIANTS.map((v) => (
            <div key={v.kind} className="flex flex-col">
              <div className="text-sm font-black text-chess-text mb-2">{v.heading}</div>
              <a href={url(v)} target="_blank" rel="noreferrer" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url(v)}
                  alt={`${v.heading} share card`}
                  className="w-full rounded-2xl border border-slate-200 shadow-md bg-white"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
