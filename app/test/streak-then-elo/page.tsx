'use client';

import { useMemo, useState } from 'react';
import { ActivityComplete } from '@/components/shared/ActivityComplete';
import { chessPathEloSeries, type EloSeriesPoint } from '@/lib/elo/chess-path-elo';
import { warmupAudio } from '@/lib/sounds';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// A "1 month in, hooked" user who just finished a lesson and extended a streak.
const STREAK = 12;
const JOURNEY: [number, number][] = [
  [30, 430], [29, 445], [27, 438], [26, 470], [24, 485], [22, 476],
  [20, 510], [18, 535], [16, 524], [14, 560], [12, 585], [11, 600],
  [9, 618], [7, 640], [6, 631], [4, 672], [3, 690], [1, 706], [0, 738],
];

export default function StreakThenEloTest() {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);

  const points = useMemo(() => {
    const series: EloSeriesPoint[] = JOURNEY.map(([n, elo]) => ({ date: daysAgo(n), elo }));
    return chessPathEloSeries(series, { windowDays: 5 });
  }, []);

  const play = () => {
    warmupAudio();
    setKey((k) => k + 1);
    setOpen(true);
  };

  return (
    <div className="relative min-h-full overflow-auto bg-[#E8F4FB] px-4 py-10">
      <div className="mx-auto max-w-sm text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-chess-blue">
          Completion sequence
        </p>
        <h1 className="mt-1 text-xl font-black text-chess-text">Streak → then the ELO popup</h1>
        <p className="mt-2 text-sm text-chess-text-muted">
          Real <code>ActivityComplete</code>: the streak window fires first (it owns the claim),
          then the full lesson-complete popup with the ELO chart.
        </p>
        <button
          onClick={play}
          className="mt-5 w-full rounded-2xl bg-chess-blue py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_var(--color-chess-blue-shadow)] active:translate-y-0.5"
        >
          ▶ Play sequence
        </button>
      </div>

      {open && (
        <ActivityComplete
          key={key}
          source="path"
          mode="terminal"
          correctCount={5}
          totalCount={6}
          activityName="Forks & Skewers"
          playerName="Tyler"
          debugStreak={STREAK}
          debugEloPoints={points}
          shareConfig={{
            shareUrl: 'https://chesspath.app/test',
            ogEndpoint: '/api/og/lesson',
            ogParams: { score: '5/6', lesson: 'Forks & Skewers', level: '1' },
            source: 'lesson',
            title: 'Chess Path',
            text: 'I completed a lesson on Chess Path!',
          }}
          onContinue={() => setOpen(false)}
        />
      )}
    </div>
  );
}
