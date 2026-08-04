'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BoxingLogoLoader } from '@/components/chessboxing/BoxingLogoLoader';
import { getStreak, type StreakData } from '@/lib/streak-client';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

/**
 * BoxToday — the Chess Boxing app's home ("Today") screen.
 *
 * Streak comes from getStreak() (the ONE streak client — never fetch the
 * endpoint directly). Last score reuses GET /api/workout/sessions?limit=1 and
 * rank reuses GET /api/leaderboard (same endpoints as /workout finish and
 * /leaderboard). Logged-out users get graceful placeholders — both endpoints
 * 401 and we just show em-dashes.
 */

interface LastSession {
  points: number;
  createdAt: string;
}

export function BoxToday() {
  const router = useRouter();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [last, setLast] = useState<LastSession | null | undefined>(undefined);
  const [rank, setRank] = useState<{ rank: number; total: number } | null | undefined>(undefined);
  const [choosing, setChoosing] = useState(false);
  // Settings gear only shows inside the app shell (same detection as
  // BoxTabBar: Capacitor native, or the ?boxapp=1 debug session key).
  const [inShell, setInShell] = useState(false);

  useEffect(() => {
    const isNative = window.Capacitor?.isNativePlatform?.() === true;
    let isDebug = false;
    try {
      // URL param too — effect order vs BoxTabBar (which persists it) isn't guaranteed.
      isDebug =
        sessionStorage.getItem('cp:boxapp') === '1' ||
        new URLSearchParams(window.location.search).has('boxapp');
    } catch {
      /* private mode — native detection still works */
    }
    setInShell(isNative || isDebug);
  }, []);

  useEffect(() => {
    getStreak().then(setStreak);

    fetch('/api/workout/sessions?limit=1')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setLast(d?.sessions?.[0] ?? null))
      .catch(() => setLast(null));

    fetch('/api/leaderboard?scope=global&period=weekly')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setRank(d?.me ? { rank: d.me.rank, total: d.total } : null))
      .catch(() => setRank(null));
  }, []);

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-lg md:max-w-xl mx-auto w-full px-4 md:px-6 pt-6 pb-10 flex flex-col gap-5">
        {/* Header */}
        <div className="relative flex flex-col items-center text-center gap-2 pt-2">
          {inShell && (
            <Link
              href="/box/settings"
              aria-label="Settings"
              className="absolute top-0 right-0 flex items-center justify-center w-11 h-11 -mr-1 rounded-xl text-chess-text-muted tap-highlight"
            >
              <GearIcon />
            </Link>
          )}
          <BoxingLogoLoader size={84} />
          <h1 className="text-2xl md:text-3xl font-black text-chess-text leading-tight">
            Chess Boxing
          </h1>
          <p className="text-sm text-chess-text-muted -mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <StatCard
            label="Streak"
            value={streak ? String(streak.current) : '—'}
            sub={
              streak
                ? streak.completedToday
                  ? 'done today'
                  : streak.current > 0
                    ? 'fight today'
                    : 'start today'
                : 'days'
            }
            accent={!!streak && streak.completedToday}
          />
          <StatCard
            label="Last score"
            value={last ? last.points.toLocaleString() : '—'}
            sub={last ? relativeDay(last.createdAt) : 'no bouts yet'}
          />
          <StatCard
            label="Rank"
            value={rank ? `#${rank.rank}` : '—'}
            sub={rank ? `of ${rank.total} this week` : 'unranked'}
          />
        </div>

        {/* Start → mode choice */}
        {!choosing ? (
          <button
            onClick={() => setChoosing(true)}
            className="w-full rounded-2xl bg-[#e5484d] text-white font-black text-xl py-5 min-h-[64px] shadow-[0_4px_0_#b53437] tap-highlight"
          >
            Start
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/workout')}
              className="w-full text-left bg-chess-surface rounded-2xl border-2 border-[#e5484d] shadow-sm p-4 tap-highlight"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-black text-chess-text text-lg">Puzzle Workout</div>
                  <div className="text-sm text-chess-text-muted mt-0.5">
                    Rounds of puzzles and punches against the clock.
                  </div>
                </div>
                <span className="text-[#e5484d] font-black text-2xl" aria-hidden>
                  &rsaquo;
                </span>
              </div>
            </button>

            {FEATURE_FLAGS.BOUT_MODE ? (
              <button
                onClick={() => router.push('/box/bout')}
                className="w-full text-left bg-chess-surface rounded-2xl border-2 border-[#e5484d] shadow-sm p-4 tap-highlight"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-black text-chess-text text-lg">Bout vs Rookie</div>
                    <div className="text-sm text-chess-text-muted mt-0.5">
                      One game, split across rounds. The bell always wins.
                    </div>
                  </div>
                  <span className="text-[#e5484d] font-black text-2xl" aria-hidden>
                    &rsaquo;
                  </span>
                </div>
              </button>
            ) : (
              <div
                aria-disabled
                className="w-full text-left bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 opacity-60"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-black text-chess-text text-lg">Bout vs Rookie</div>
                    <div className="text-sm text-chess-text-muted mt-0.5">
                      One game, split across rounds. The bell always wins.
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-black uppercase tracking-wide text-chess-text-muted bg-chess-page rounded-full px-2.5 py-1">
                    Coming soon
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setChoosing(false)}
              className="text-sm font-bold text-chess-text-muted py-2 min-h-[44px] tap-highlight"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1.02-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.56 1.02H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.03z" />
    </svg>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm px-2 py-3 text-center min-w-0">
      <div className="text-[10px] font-black uppercase tracking-wide text-chess-text-muted">
        {label}
      </div>
      <div
        className={`text-2xl font-black tabular-nums mt-0.5 ${
          accent ? 'text-chess-green' : 'text-chess-text'
        }`}
      >
        {value}
      </div>
      <div className="text-[10px] font-semibold text-chess-text-muted truncate">{sub}</div>
    </div>
  );
}

function relativeDay(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}
