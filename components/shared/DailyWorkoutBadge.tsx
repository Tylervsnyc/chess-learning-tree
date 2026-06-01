'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { WORKOUT_ACTIVITY_EVENT } from '@/lib/daily-workout/events';
import { MiniRookieIcon } from './MiniRookieIcon';

type WorkoutResponse = {
  current: number;
  longest: number;
  completedToday: boolean;
};

export function DailyWorkoutBadge() {
  const { user, loading } = useUser();
  const [data, setData] = useState<WorkoutResponse | null>(null);

  const refetch = useCallback(() => {
    if (!user) return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    fetch(`/api/workout/streak?tz=${encodeURIComponent(tz)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setData(d as WorkoutResponse);
      })
      .catch(() => {});
  }, [user]);

  // Fetch on mount, and again whenever an activity is recorded (e.g. a run
  // finishes on this same page) or the tab regains focus.
  useEffect(() => {
    if (!user) return;
    refetch();
    const onActivity = () => refetch();
    window.addEventListener(WORKOUT_ACTIVITY_EVENT, onActivity);
    window.addEventListener('focus', onActivity);
    return () => {
      window.removeEventListener(WORKOUT_ACTIVITY_EVENT, onActivity);
      window.removeEventListener('focus', onActivity);
    };
  }, [user, refetch]);

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
      className={`inline-flex items-center gap-1.5 leading-none shrink-0 rounded-md px-2 py-1 font-black transition-all ${
        completedToday
          ? 'bg-orange-100 text-orange-800 shadow-[0_2px_0_0_#fbbf24]'
          : 'bg-chess-text/50 text-white animate-pulse-soft'
      }`}
    >
      <MiniRookieIcon active={completedToday} gold={current >= 100} size={20} />
      <span className="tabular-nums text-sm">{current}</span>
    </Link>
  );
}
