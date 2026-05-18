'use client';

import { useEffect, useState } from 'react';

const RULES: { n: number; text: string }[] = [
  { n: 1, text: 'Reach the 8th rank' },
  { n: 2, text: 'Capture to charge tempo' },
  { n: 3, text: 'Show no mercy' },
];

const STORAGE_KEY = 'rookies-run-rules-hidden';

export function RulesInline() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_KEY) === '1') setHidden(true);
  }, []);

  if (hidden) return null;

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, '1');
    }
    setHidden(true);
  };

  return (
    <div className="bg-chess-surface rounded-lg shadow-sm px-3 py-2 relative">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Hide rules"
        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full hover:bg-chess-text/10 active:scale-90 flex items-center justify-center text-chess-text-faint transition-all"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="text-[9px] font-black uppercase tracking-[0.14em] text-chess-text-muted leading-none mb-1.5">
        How to play
      </div>

      <ul className="flex flex-col gap-1">
        {RULES.map((r) => (
          <li key={r.n} className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-black flex items-center justify-center shrink-0 leading-none">
              {r.n}
            </span>
            <span className="text-[12px] font-bold text-chess-text leading-tight">
              {r.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
