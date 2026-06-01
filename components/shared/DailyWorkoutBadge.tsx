'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { MiniRookieIcon } from './MiniRookieIcon';

type WorkoutResponse = {
  current: number;
  longest: number;
  completedToday: boolean;
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

  const title = completedToday
    ? `${current}-day streak — you showed up today. Rookie noticed.`
    : current > 0
      ? `${current}-day streak. Do anything today to keep it alive.`
      : 'Do anything today to start your streak.';

  return (
    <Link
      href="/profile"
      title={title}
      className={`inline-flex items-center gap-1.5 leading-none shrink-0 rounded-md px-2 py-1 font-black text-white transition-all ${
        completedToday
          ? 'bg-chess-orange shadow-[0_2px_0_0_#c2410c]'
          : 'bg-chess-text/50 animate-pulse-soft'
      }`}
    >
      <MiniRookieIcon active={completedToday} gold={current >= 100} size={20} />
      <span className="tabular-nums text-sm">{current}</span>
    </Link>
  );
}
