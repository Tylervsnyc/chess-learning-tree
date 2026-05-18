'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { getDailyVaultDates, getRunIdForDate, getTodayInTZ } from '@/lib/run/daily';
import { getRunById } from '@/lib/run/runs';

interface VaultListProps {
  onClose: () => void;
}

export function VaultList({ onClose }: VaultListProps) {
  const { user } = useUser();
  const tz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    [],
  );
  const today = useMemo(() => getTodayInTZ(tz), [tz]);
  const dates = useMemo(() => getDailyVaultDates(tz, 30), [tz]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('run_completions')
        .select('run_date')
        .eq('user_id', user.id)
        .gte('run_date', dates[dates.length - 1]);
      if (cancelled || !data) return;
      setCompleted(new Set((data as Array<{ run_date: string }>).map((r) => r.run_date)));
    })();
    return () => {
      cancelled = true;
    };
  }, [user, dates]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-chess-page w-full max-w-md max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-chess-text/10">
          <h2 className="text-base font-black text-chess-text">Vault</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close vault"
            className="w-7 h-7 rounded-full bg-chess-text/10 active:scale-90 flex items-center justify-center text-chess-text-muted text-sm font-black"
          >
            ✕
          </button>
        </div>

        <div className="overflow-auto">
          {dates.map((d) => {
            const isToday = d === today;
            const runId = getRunIdForDate(d);
            const run = getRunById(runId);
            const done = completed.has(d);
            const href = user || isToday ? `/run/${d}` : `/auth/signup?next=/run/${d}`;

            return (
              <Link
                key={d}
                href={isToday ? '/run' : href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 border-b border-chess-text/5 active:bg-chess-text/5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-chess-text-muted">
                      {isToday ? 'Today' : formatDate(d)}
                    </span>
                    {done && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Done
                      </span>
                    )}
                    {!user && !isToday && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-chess-text-muted bg-chess-text/10 px-1.5 py-0.5 rounded">
                        Sign in
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-black text-chess-text truncate">{run.name}</div>
                </div>
                <span className="text-chess-text-faint text-lg" aria-hidden>›</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatDate(yyyyMmDd: string): string {
  const d = new Date(yyyyMmDd + 'T00:00:00Z');
  return d.toLocaleDateString(undefined, {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  });
}
