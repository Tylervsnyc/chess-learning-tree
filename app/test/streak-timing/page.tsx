'use client';

import { useEffect, useState } from 'react';
import { getStoredUserId, peekStreak, type StreakData } from '@/lib/streak-client';

/**
 * Verifies that the streak localStorage optimization works:
 * - WARM path: snapshot in localStorage → renders synchronously in useState initializer
 * - COLD path: no snapshot → renders null until API responds
 */

const TODAY = new Intl.DateTimeFormat('en-CA', {
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());
const TEST_UID = 'streak-timing-test-user';

function StreakDisplay({ label }: { label: string }) {
  // This mimics exactly what DailyWorkoutBadge and profile page do:
  // synchronous useState initializer reads from localStorage
  const [data] = useState<StreakData | null>(() => {
    const uid = getStoredUserId();
    return uid ? peekStreak(uid) : null;
  });
  const [renderTime] = useState(() => performance.now().toFixed(1));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="text-xs font-black uppercase tracking-wide text-slate-400 mb-3">{label}</div>
      <div className={`text-4xl font-black tabular-nums mb-1 ${data ? 'text-orange-600' : 'text-slate-300'}`}>
        {data ? data.current : '–'}
      </div>
      <div className="text-xs text-slate-500 mb-2">
        {data ? `${data.longest} day best · ${data.completedToday ? 'done today' : 'not done'}` : 'no data'}
      </div>
      <div className={`text-xs font-bold px-2 py-1 rounded-md inline-block ${data ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
        {data ? `painted at ${renderTime}ms (sync from localStorage)` : 'waiting for API…'}
      </div>
    </div>
  );
}

export default function StreakTimingTest() {
  const [seeded, setSeeded] = useState(false);
  const [pageLoadTime] = useState(() => performance.now().toFixed(1));

  useEffect(() => {
    const uid = getStoredUserId();
    setSeeded(uid === TEST_UID && !!peekStreak(uid));
  }, []);

  function seed() {
    localStorage.setItem('cp:uid', TEST_UID);
    localStorage.setItem('cp:workout-streak:v2', JSON.stringify({
      day: TODAY, userId: TEST_UID,
      data: { current: 7, longest: 14, completedToday: true, activeDays: [TODAY] },
    }));
    window.location.reload();
  }

  function clear() {
    localStorage.removeItem('cp:uid');
    localStorage.removeItem('cp:workout-streak:v2');
    window.location.reload();
  }

  return (
    <div className="overflow-auto h-full bg-chess-page p-6">
      <div className="max-w-lg mx-auto flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-black text-chess-text">Streak Timing Verification</h1>
          <p className="text-sm text-chess-text-muted mt-1">
            Page loaded at <span className="font-mono font-bold">{pageLoadTime}ms</span>.
            The streak below shows <em>when its useState initializer ran</em> — if it matches, it painted in the same render.
          </p>
        </div>

        <StreakDisplay label={seeded ? 'WARM — cached snapshot (returning user)' : 'COLD — no snapshot (first visit)'} />

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-sm text-slate-600 space-y-2">
          <p className="font-bold text-slate-800">How to read this:</p>
          <p>
            <span className="font-bold text-green-700">Green badge</span> = streak painted synchronously in
            the <code className="bg-slate-100 px-1 rounded">useState</code> initializer — same tick as the rest of the page, no API needed.
          </p>
          <p>
            <span className="font-bold text-slate-400">Grey dash</span> = no snapshot → waits for{' '}
            <code className="bg-slate-100 px-1 rounded">/api/workout/streak</code> to respond (expected for first visit).
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={seed}
            className="flex-1 bg-chess-green text-white font-bold py-2 px-4 rounded-lg text-sm"
          >
            Seed 7-day streak → reload (warm)
          </button>
          <button
            onClick={clear}
            className="flex-1 bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg text-sm"
          >
            Clear cache → reload (cold)
          </button>
        </div>
      </div>
    </div>
  );
}
