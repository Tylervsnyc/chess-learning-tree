'use client';

import { useState } from 'react';
import RookieCampfire from '@/components/shared/RookieCampfire';
import { StreakModal } from '@/components/shared/StreakModal';
import { DailyWorkoutCelebration } from '@/components/shared/DailyWorkoutCelebration';

// Build a fake activeDays list: the last `streak` days through today.
function recentDays(streak: number, today: string): string[] {
  const [y, m, d] = today.split('-').map(Number);
  const out: string[] = [];
  for (let i = 0; i < streak; i++) {
    const dt = new Date(Date.UTC(y, m - 1, d - i));
    out.push(dt.toISOString().slice(0, 10));
  }
  return out;
}

export default function StreakCampfireTestPage() {
  const [streak, setStreak] = useState(12);
  const [showModal, setShowModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  // Stable "today" so we don't call Date.now during render churn.
  const today = '2026-06-08';
  const cardSrc = `/api/og/streak?streak=${streak}`;

  return (
    <div className="h-full overflow-auto bg-sky-50 p-6">
      <div className="mx-auto max-w-md flex flex-col gap-8 pb-24">
        <header className="text-center">
          <h1 className="text-2xl font-black text-chess-text">Streak Campfire</h1>
          <p className="text-sm text-chess-text-muted mt-1">
            Every streak surface, lit with Rookie&apos;s campfire.
          </p>
        </header>

        {/* Streak control */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-black text-chess-text">Streak length</span>
            <span className="text-2xl font-black tabular-nums text-chess-blue">{streak}</span>
          </div>
          <input
            type="range"
            min={0}
            max={365}
            value={streak}
            onChange={(e) => setStreak(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex gap-2 mt-3 flex-wrap">
            {[0, 1, 7, 14, 30, 60, 100, 365].map((n) => (
              <button
                key={n}
                onClick={() => setStreak(n)}
                className="px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-chess-blue hover:bg-sky-200"
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Raw campfire at this blaze */}
        <section className="rounded-2xl bg-white p-6 shadow-sm flex flex-col items-center gap-3">
          <h2 className="font-black text-chess-text self-start">1. Campfire component</h2>
          <div className="py-4">
            <RookieCampfire
              blockSize={18}
              active={streak > 0}
              blaze={Math.max(0.4, Math.min(1, streak / 60))}
            />
          </div>
          <p className="text-xs text-chess-text-muted">
            blaze = {Math.max(0.4, Math.min(1, streak / 60)).toFixed(2)} · active = {String(streak > 0)}
          </p>
        </section>

        {/* 2. Streak window (modal) */}
        <section className="rounded-2xl bg-white p-6 shadow-sm flex flex-col gap-3">
          <h2 className="font-black text-chess-text">2. Streak window</h2>
          <p className="text-sm text-chess-text-muted">The calendar modal opened from the header badge.</p>
          <button
            onClick={() => setShowModal(true)}
            className="py-3 rounded-xl font-black text-sm text-white bg-chess-blue shadow-[0_3px_0_0_var(--color-chess-blue-shadow)]"
          >
            Open streak window
          </button>
        </section>

        {/* 3. Celebration */}
        <section className="rounded-2xl bg-white p-6 shadow-sm flex flex-col gap-3">
          <h2 className="font-black text-chess-text">3. Streak celebration</h2>
          <p className="text-sm text-chess-text-muted">Fires when a streak is extended (with confetti).</p>
          <button
            onClick={() => setShowCelebration(true)}
            className="py-3 rounded-xl font-black text-sm text-white bg-chess-green shadow-[0_3px_0_0_var(--color-chess-green-shadow)]"
          >
            Play celebration
          </button>
        </section>

        {/* 4. Share card */}
        <section className="rounded-2xl bg-white p-6 shadow-sm flex flex-col gap-3">
          <h2 className="font-black text-chess-text">4. Share card (OG image)</h2>
          <p className="text-sm text-chess-text-muted">Server-rendered 1080×1920 — baked campfire frame.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cardSrc}
            alt="Streak share card"
            className="w-full rounded-xl border border-slate-200"
          />
        </section>
      </div>

      <StreakModal
        open={showModal}
        onClose={() => setShowModal(false)}
        today={today}
        data={{
          current: streak,
          longest: Math.max(streak, 30),
          completedToday: true,
          activeDays: recentDays(streak, today),
        }}
      />

      <DailyWorkoutCelebration
        streak={streak}
        open={showCelebration}
        onClose={() => setShowCelebration(false)}
        onShare={() => {}}
      />
    </div>
  );
}
