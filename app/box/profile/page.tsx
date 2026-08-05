'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { getStreak, getTz, type StreakData } from '@/lib/streak-client';

/**
 * /box/profile — the Chess Boxing app's Profile tab. A compact, no-scroll
 * fighter card: streak, ELO, fight record, lifetime numbers. The full website
 * profile (/profile) stays untouched for web; this screen reuses the same
 * endpoints (/api/profile/dashboard, /api/bout/record, streak-client).
 *
 * HARD RULE (docs/chess-boxing-app-structure.md): fits the window, never
 * scrolls. Fixed column; every section shrinks, nothing overflows.
 */

interface BoutRecord {
  wins: number;
  losses: number;
  draws: number;
  kos: number;
  total: number;
  points: number;
}

interface DashboardData {
  stats?: {
    lessonsCompleted: number;
    puzzlesSolved: number;
    gamesPlayed: number;
    workoutPoints: number;
  };
  elo?: { current: number; events: number };
}

export default function BoxProfilePage() {
  const { user, profile, loading: userLoading } = useUser();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [dash, setDash] = useState<DashboardData | null>(null);
  const [record, setRecord] = useState<BoutRecord | null>(null);

  useEffect(() => {
    getStreak().then(setStreak);
    fetch(`/api/profile/dashboard?tz=${encodeURIComponent(getTz())}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setDash(d ?? null))
      .catch(() => setDash(null));
    fetch('/api/bout/record')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setRecord(d?.record ?? null))
      .catch(() => setRecord(null));
  }, []);

  // Logged-out gate — same pitch as the web profile, app-compact.
  if (!userLoading && !user) {
    return (
      <div className="h-full overflow-hidden bg-chess-page">
        <div className="max-w-lg mx-auto w-full h-full px-6 flex flex-col items-center justify-center gap-3 text-center">
          <h1 className="text-2xl font-black text-chess-text">Your corner</h1>
          <p className="text-sm font-semibold text-chess-text-muted">
            Sign in to keep a streak, climb the standings, and build a fight record.
          </p>
          <Link
            href="/auth/login"
            className="mt-2 w-full max-w-xs rounded-2xl bg-chess-green text-white text-center font-black py-3.5 shadow-[0_4px_0_0_var(--color-chess-green-shadow)] active:translate-y-[3px] active:shadow-none transition-transform tap-highlight"
          >
            Sign In
          </Link>
          <Link href="/auth/signup" className="text-sm font-bold text-chess-blue tap-highlight py-2">
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  const name =
    (profile as { username?: string | null } | null)?.username ||
    user?.email?.split('@')[0] ||
    'Fighter';

  return (
    <div className="h-full overflow-hidden bg-chess-page">
      <div className="max-w-lg md:max-w-xl mx-auto w-full h-full px-4 md:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 flex flex-col gap-3">
        {/* Who */}
        <div className="relative text-center shrink-0 pt-1">
          <h1 className="text-2xl md:text-3xl font-black text-chess-text leading-tight truncate px-10">
            {name}
          </h1>
          <p className="text-xs font-semibold text-chess-text-muted mt-0.5">Chess Boxing record</p>
          <Link
            href="/box/settings"
            aria-label="Settings"
            className="absolute right-0 top-0 flex items-center justify-center w-11 h-11 rounded-xl text-chess-text-muted tap-highlight"
          >
            <GearIcon />
          </Link>
        </div>

        {/* Streak hero */}
        <div className="shrink-0 rounded-2xl bg-chess-surface border border-slate-200 shadow-sm px-4 py-3 flex items-center gap-4">
          <div
            className={`text-5xl font-black tabular-nums leading-none ${
              streak && streak.completedToday ? 'text-chess-green' : 'text-chess-text'
            }`}
          >
            {streak ? streak.current : '—'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black uppercase tracking-wide text-chess-text-muted">
              Day streak
            </div>
            <div className="text-sm font-bold text-chess-text truncate">
              {streak
                ? streak.completedToday
                  ? 'Done today. Keep the chalk coming.'
                  : streak.current > 0
                    ? 'Alive — finish one thing today.'
                    : 'Finish anything today to start it.'
                : ' '}
            </div>
          </div>
        </div>

        {/* Fight record — hidden until there's a bout, no wall of zeros */}
        {record && record.total > 0 && (
          <div className="shrink-0 rounded-2xl bg-chess-surface border border-slate-200 shadow-sm px-4 py-3">
            <div className="text-xs font-black uppercase tracking-wide text-chess-text-muted mb-1.5">
              Fight record
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black tabular-nums text-chess-text">
                {record.wins}–{record.losses}–{record.draws}
              </div>
              <div className="text-xs font-bold text-chess-text-muted">
                {record.kos} by checkmate · {record.total} bouts
              </div>
            </div>
          </div>
        )}

        {/* Lifetime tiles */}
        <div className="flex-1 min-h-0 grid grid-cols-2 gap-3 content-start">
          <Tile label="Chess Path ELO" value={dash?.elo ? String(dash.elo.current) : '—'} />
          <Tile
            label="Workout points"
            value={dash?.stats ? dash.stats.workoutPoints.toLocaleString() : '—'}
          />
          <Tile
            label="Puzzles solved"
            value={dash?.stats ? dash.stats.puzzlesSolved.toLocaleString() : '—'}
          />
          <Tile
            label="Games played"
            value={dash?.stats ? dash.stats.gamesPlayed.toLocaleString() : '—'}
          />
        </div>
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-chess-surface border border-slate-200 shadow-sm px-3 py-3 text-center min-w-0">
      <div className="text-2xl font-black tabular-nums text-chess-text">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-wide text-chess-text-muted truncate">
        {label}
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
