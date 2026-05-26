'use client';

import { useState } from 'react';
import { DailyWorkoutCelebration } from '@/components/shared/DailyWorkoutCelebration';

const MILESTONES = [1, 2, 3, 6, 7, 14, 30, 50, 99, 100, 365];

export default function DailyWorkoutCelebrationPreview() {
  const [streak, setStreak] = useState<number | null>(null);

  return (
    <div className="h-full overflow-auto bg-chess-bg p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-chess-text mb-2">Daily workout celebration popup</h1>
        <p className="text-sm text-chess-text-muted mb-6">
          Tap any milestone to fire the celebration. Confetti, happy Mini Rookie,
          number tick-up, milestone-aware Rookie line.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {MILESTONES.map((n) => (
            <button
              key={n}
              onClick={() => setStreak(n)}
              className="py-3 px-4 rounded-xl bg-chess-surface text-chess-text font-black shadow-sm hover:shadow-md active:translate-y-[1px] transition-all"
            >
              Day {n}
            </button>
          ))}
        </div>
      </div>

      <DailyWorkoutCelebration
        streak={streak ?? 0}
        open={streak !== null}
        onClose={() => setStreak(null)}
        onShare={() => alert('Share would open here')}
      />
    </div>
  );
}
