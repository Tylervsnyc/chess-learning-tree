'use client';

import { useEffect, useState } from 'react';
import { RookieRatingCard, type RookieRatingData } from './RookieRatingCard';

const STORAGE_KEY = 'rookie_rating_milestone'; // last hundred-mark we celebrated

/**
 * RookieRatingModal — pops the rating "fun window" over the screen when the
 * user crosses a new hundred-point milestone (e.g. first time past 800).
 *
 * Fires at most once per milestone: we remember the highest hundred-mark we've
 * already celebrated in localStorage, so it won't nag on every profile visit.
 */
export function RookieRatingModal({ data }: { data: RookieRatingData | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!data || data.events <= 0) return;
    const milestone = Math.floor(data.current / 100) * 100;
    if (milestone < 400) return; // below 400 isn't a moment worth interrupting for

    let lastCelebrated = 0;
    try {
      lastCelebrated = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0;
    } catch {
      // localStorage blocked — just don't pop.
      return;
    }

    if (milestone > lastCelebrated) {
      setOpen(true);
      try {
        localStorage.setItem(STORAGE_KEY, String(milestone));
      } catch {
        /* ignore */
      }
    }
  }, [data]);

  if (!open || !data) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm animate-expand"
        onClick={(e) => e.stopPropagation()}
      >
        <RookieRatingCard data={data} compact />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 w-full rounded-2xl bg-chess-blue py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_3px_0_0_var(--color-chess-blue-dark,#0d7ec4)] active:translate-y-0.5 active:shadow-none"
        >
          Thanks, Rookie
        </button>
      </div>
    </div>
  );
}

export default RookieRatingModal;
