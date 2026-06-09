'use client';

/**
 * Preview the inline "streak folded into completion screen" design at a few
 * streak lengths, without needing a real completion. This mirrors the EARNED
 * state of StreakComplete (campfire + tick-up + Rookie line + share) inside a
 * mock completion card. Test page → must scroll (body is overflow:hidden).
 */
import { useState } from 'react';
import RookieCampfire from '@/components/shared/RookieCampfire';
import { pickCelebrationLine } from '@/lib/daily-workout/celebration-lines';

function blazeFor(streak: number) {
  return Math.max(0.5, Math.min(1, streak / 60));
}

function PreviewCard({ streak }: { streak: number }) {
  const line = pickCelebrationLine(streak);
  return (
    <div className="relative w-full max-w-sm mx-auto rounded-2xl bg-white px-6 pt-6 pb-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
      {/* mock completion header */}
      <div className="w-full rounded-xl px-4 py-2 text-center" style={{ backgroundColor: '#f0f4f8' }}>
        <h2 className="text-[15px] font-black text-chess-text">Lesson Complete!</h2>
        <div className="text-xs font-bold text-chess-text mt-1">5/6</div>
      </div>

      {/* the inline streak block (mirrors StreakComplete EARNED state) */}
      <div className="w-full mt-4 mb-4 flex flex-col items-center text-center rounded-2xl bg-chess-page px-4 py-3">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-chess-text-muted">
          The streak continues
        </div>
        <div className="my-1 flex justify-center">
          <RookieCampfire blockSize={13} active blaze={blazeFor(streak)} />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-4xl font-black text-chess-text tabular-nums leading-none"
            style={streak >= 100 ? { color: '#F5B40A' } : undefined}
          >
            {streak}
          </span>
          <span className="text-[11px] font-black uppercase tracking-widest text-chess-text-muted">
            day{streak === 1 ? '' : 's'}
          </span>
        </div>
        <div className="text-sm font-black text-chess-text leading-tight mt-1.5">{line.headline}</div>
        {line.sub && <div className="text-xs text-chess-text-muted mt-1 leading-snug">{line.sub}</div>}
        <button className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs text-white bg-chess-blue shadow-[0_2px_0_0_var(--color-chess-blue-shadow)]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
          </svg>
          Share
        </button>
      </div>

      {/* mock continue button */}
      <button className="w-full rounded-2xl bg-chess-green text-white font-black py-3">Continue</button>
    </div>
  );
}

export default function StreakCompletePreview() {
  const [streak, setStreak] = useState(9);
  return (
    <div className="h-full overflow-auto bg-chess-page py-8 px-4">
      <div className="max-w-sm mx-auto mb-6">
        <label className="text-xs font-bold text-chess-text-muted">Streak: {streak}</label>
        <input
          type="range"
          min={1}
          max={365}
          value={streak}
          onChange={(e) => setStreak(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[1, 3, 7, 9, 14, 30, 100, 365].map((n) => (
            <button
              key={n}
              onClick={() => setStreak(n)}
              className="px-2 py-1 rounded bg-white text-xs font-bold text-chess-text shadow-sm"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <PreviewCard streak={streak} />
    </div>
  );
}
