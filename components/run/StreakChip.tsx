'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';

type StreakResponse = {
  current: number;
  longest: number;
  completedToday: boolean;
};

export function StreakChip() {
  const { user, loading } = useUser();
  const [data, setData] = useState<StreakResponse | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const tz =
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    fetch(`/api/run/streak?tz=${encodeURIComponent(tz)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d) setData(d as StreakResponse);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) return null;

  if (!user) {
    return (
      <Link
        href="/auth/signup?next=/run"
        className="bg-chess-surface rounded-lg px-2.5 py-1.5 shadow-sm inline-flex items-center gap-1.5 leading-none shrink-0 text-[10px] font-bold text-chess-text-muted active:opacity-70"
      >
        Sign in to streak
      </Link>
    );
  }

  const current = data?.current ?? 0;
  const completedToday = data?.completedToday ?? false;

  return (
    <div
      className="bg-chess-surface rounded-lg px-2.5 py-1.5 shadow-sm inline-flex items-center gap-1 leading-none shrink-0"
      title={completedToday ? "Today's run completed" : "Complete today's run to grow your streak"}
    >
      <span className="text-sm" aria-hidden>
        {completedToday ? '🔥' : '·'}
      </span>
      <span className="text-sm font-black text-chess-text tabular-nums">{current}</span>
      <span className="text-[9px] font-black uppercase tracking-[0.14em] text-chess-text-muted ml-0.5">
        Streak
      </span>
    </div>
  );
}
