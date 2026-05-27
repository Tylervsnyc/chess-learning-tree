'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { MiniRookieIcon } from './MiniRookieIcon';

type WorkoutResponse = {
  current: number;
  longest: number;
  completedToday: boolean;
  todayPillars: { play: boolean; path: boolean; run: boolean };
};

export function DailyWorkoutBadge() {
  const { user, loading } = useUser();
  const [data, setData] = useState<WorkoutResponse | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    fetch(`/api/workout/streak?tz=${encodeURIComponent(tz)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d) setData(d as WorkoutResponse);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || !user) return null;

  const current = data?.current ?? 0;
  const completedToday = data?.completedToday ?? false;

  // Hide entirely if no streak yet — the nav stays clean for brand-new users.
  if (current === 0 && !completedToday) return null;

  const title = completedToday
    ? `Daily workout complete — ${current}-day streak. Rookie noticed.`
    : `${current}-day streak. One more session of Play, Learn, or Run keeps it alive.`;

  return (
    <Link
      href="/"
      title={title}
      className={`inline-flex items-center gap-1.5 leading-none shrink-0 rounded-md px-2 py-1 font-black text-white transition-all ${
        completedToday
          ? 'bg-chess-text shadow-[0_2px_0_0_var(--color-chess-gold-dark,#cc9a00)]'
          : 'bg-chess-text/60 animate-pulse-soft'
      }`}
    >
      <MiniRookieIcon active={completedToday} gold={current >= 100} size={20} />
      <span className="tabular-nums text-sm">{current}</span>
    </Link>
  );
}
