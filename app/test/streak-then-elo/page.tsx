'use client';

import { useMemo, useState } from 'react';
import { DailyWorkoutCelebration } from '@/components/shared/DailyWorkoutCelebration';
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

type Stage = 'streak' | 'elo' | 'idle';

export default function StreakThenEloTest() {
  const [stage, setStage] = useState<Stage>('idle');
  const [replayKey, setReplayKey] = useState(0);

  const points = useMemo(() => {
    const series: EloSeriesPoint[] = JOURNEY.map(([n, elo]) => ({ date: daysAgo(n), elo }));
    return chessPathEloSeries(series, { windowDays: 5 });
  }, []);

  const play = () => {
    warmupAudio();
    setReplayKey((k) => k + 1);
    setStage('streak');
  };

  return (
    <div className="relative min-h-full overflow-auto bg-[#E8F4FB] px-4 py-10">
      <div className="mx-auto max-w-sm text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-chess-blue">
          Completion sequence
        </p>
        <h1 className="mt-1 text-xl font-black text-chess-text">Streak → then the ELO popup</h1>
        <p className="mt-2 text-sm text-chess-text-muted">
          Stage: <span className="font-black text-chess-text">{stage}</span>
        </p>
        <button
          onClick={play}
          className="mt-5 w-full rounded-2xl bg-chess-blue py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_var(--color-chess-blue-shadow)] active:translate-y-0.5"
        >
          ▶ Play sequence
        </button>
        <p className="mt-4 text-xs text-chess-text-faint">
          Streak window fires first, then the full lesson-complete popup (real component, real buttons).
        </p>
      </div>

      {/* 1) Streak window FIRST */}
      <DailyWorkoutCelebration
        key={`streak-${replayKey}`}
        streak={STREAK}
        open={stage === 'streak'}
        onClose={() => setStage('elo')}
        onShare={() => {}}
      />

      {/* 2) THEN the real completion popup, fed a typical-user ELO series */}
      {stage === 'elo' && (
        <ActivityComplete
          key={`elo-${replayKey}`}
          source="path"
          mode="terminal"
          correctCount={5}
          totalCount={6}
          activityName="Forks & Skewers"
          playerName="Tyler"
          debugEloPoints={points}
          shareConfig={{
            shareUrl: 'https://chesspath.app/test',
            ogEndpoint: '/api/og/lesson',
            ogParams: { score: '5/6', lesson: 'Forks & Skewers', level: '1' },
            source: 'lesson',
            title: 'Chess Path',
            text: 'I completed a lesson on Chess Path!',
          }}
          onContinue={() => setStage('idle')}
        />
      )}
    </div>
  );
}
