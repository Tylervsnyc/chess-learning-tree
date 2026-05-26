'use client';

import { MiniRookieIcon } from '@/components/shared/MiniRookieIcon';

const SAMPLES = [0, 1, 6, 7, 14, 29, 30, 99, 100, 365];

export default function DailyWorkoutBadgePreview() {
  return (
    <div className="h-full overflow-auto bg-chess-bg p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-chess-text mb-2">Daily workout streak badge</h1>
        <p className="text-sm text-chess-text-muted mb-6">
          Mini Rookie nav badge across milestones. Top row = active (workout complete today).
          Bottom row = streak alive but not done today (muted + pulse). 100+ gets a gold rim.
        </p>

        <h2 className="text-xs font-black uppercase tracking-widest text-chess-text-muted mb-3">
          Active (today complete)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {SAMPLES.map((streak) => (
            <Card key={`a-${streak}`} streak={streak} active />
          ))}
        </div>

        <h2 className="text-xs font-black uppercase tracking-widest text-chess-text-muted mb-3">
          Inactive (alive, not done today)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {SAMPLES.map((streak) => (
            <Card key={`i-${streak}`} streak={streak} active={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ streak, active }: { streak: number; active: boolean }) {
  return (
    <div className="bg-chess-surface rounded-lg p-3 flex flex-col items-center gap-2 shadow-sm">
      <div
        className={`inline-flex items-center gap-1.5 leading-none rounded-md px-2 py-1 font-black text-white ${
          active
            ? 'bg-chess-text shadow-[0_2px_0_0_var(--color-chess-gold-dark,#cc9a00)]'
            : 'bg-chess-text/70'
        }`}
      >
        <MiniRookieIcon active={active} gold={streak >= 100} size={20} />
        <span className="tabular-nums text-sm">{streak}</span>
      </div>
      <div className="text-[10px] text-chess-text-muted text-center">Day {streak}</div>
    </div>
  );
}
