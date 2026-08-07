'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { getStreak, getTz, type StreakData } from '@/lib/streak-client';
import RookieCampfire from '@/components/shared/RookieCampfire';
import { WeekChart, type WeekData } from '@/components/shared/WeekChart';
import RookieRatingCard from '@/components/profile/RookieRatingCard';
import { ELO_BASELINE, PROVISIONAL_EVENTS } from '@/lib/elo/estimate';
import type { EloSeriesPoint } from '@/lib/elo/rookie-rating';

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
  elo?: { current: number; events: number; series: EloSeriesPoint[] };
  week?: WeekData;
}

export default function BoxProfilePage() {
  const { user, profile, loading: userLoading } = useUser();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [dash, setDash] = useState<DashboardData | null>(null);
  const [record, setRecord] = useState<BoutRecord | null>(null);
  const [showElo, setShowElo] = useState(false);

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

        {/* Streak hero — same campfire as the website profile */}
        <div className="shrink-0 rounded-2xl bg-chess-surface border border-slate-200 shadow-sm px-4 py-3 flex items-center gap-4">
          <div className="shrink-0">
            <RookieCampfire
              blockSize={11}
              active={!!streak && streak.completedToday}
              blaze={Math.max(0.3, Math.min(1, (streak?.current ?? 0) / 60))}
            />
          </div>
          <div className="min-w-0">
            <div
              className={`text-4xl font-black tabular-nums leading-none ${
                streak && streak.completedToday ? 'text-chess-green' : 'text-chess-text'
              }`}
            >
              {streak ? streak.current : '—'}
            </div>
            <div className="text-[10px] font-black uppercase tracking-wide text-chess-text-muted mt-1">
              Day streak
            </div>
            <div className="text-xs font-bold text-chess-text truncate">
              {streak
                ? streak.completedToday
                  ? 'Done today. The fire stays lit.'
                  : streak.current > 0
                    ? 'Alive — finish one thing today.'
                    : 'Finish anything today to start it.'
                : ' '}
            </div>
          </div>
        </div>

        {/* The week, in bars — the same chart as the website profile */}
        <div className="shrink-0">
          <WeekChart data={dash?.week ?? null} loading={dash === null} />
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

        {/* Lifetime tiles — one compact row so the whole card fits an SE */}
        <div className="flex-1 min-h-0 grid grid-cols-4 gap-2 content-start">
          <button
            type="button"
            onClick={() => setShowElo(true)}
            aria-label="Chess Path ELO — see your rating graph and how it's calculated"
            className="rounded-2xl bg-chess-surface border border-chess-blue/30 shadow-sm px-2 py-2.5 text-center min-w-0 tap-highlight active:scale-[0.97] transition-transform"
          >
            <div className="text-lg font-black tabular-nums text-chess-blue truncate">
              {dash?.elo ? String(dash.elo.current) : '—'}
            </div>
            <div className="text-[10px] font-black uppercase tracking-wide text-chess-text-muted truncate">
              ELO ›
            </div>
          </button>
          <Tile
            label="Points"
            value={dash?.stats ? dash.stats.workoutPoints.toLocaleString() : '—'}
          />
          <Tile
            label="Puzzles"
            value={dash?.stats ? dash.stats.puzzlesSolved.toLocaleString() : '—'}
          />
          <Tile
            label="Games"
            value={dash?.stats ? dash.stats.gamesPlayed.toLocaleString() : '—'}
          />
        </div>
      </div>

      {/* Chess Path ELO sheet — the website's rating card, app-compact */}
      {showElo && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setShowElo(false)}
        >
          <div
            className="w-full max-w-lg max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-chess-page px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
            <RookieRatingCard data={dash?.elo ?? null} loading={dash === null} />
            <EloExplainer />
            <button
              type="button"
              onClick={() => setShowElo(false)}
              className="mt-3 w-full rounded-2xl bg-chess-surface border border-slate-200 py-3 text-sm font-black text-chess-text tap-highlight"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Plain-English version of lib/elo/estimate.ts — keep in sync with the model
 * (baseline, provisional period, puzzle-vs-game weighting) if it changes.
 */
function EloExplainer() {
  return (
    <div className="mt-3 rounded-3xl bg-chess-surface border border-slate-200 shadow-sm px-4 py-4">
      <h3 className="text-xs font-black uppercase tracking-wide text-chess-text-muted">
        How your ELO is calculated
      </h3>
      <ul className="mt-2 space-y-2 text-[13px] font-semibold leading-snug text-chess-text">
        <li>
          We never ask for a rating — we estimate one from everything you do here, replayed in
          order through standard Elo math.
        </li>
        <li>
          Every puzzle is a mini-match against an opponent rated at that puzzle&apos;s difficulty:
          solve it and your rating rises, miss it and it dips. Beating something above your level
          moves it most.
        </li>
        <li>
          Full games against Rookie count double a puzzle, with her level setting the opponent
          rating (Level 1 ≈ 200, up to Level 10 ≈ 2000).
        </li>
        <li>
          Everyone starts at {ELO_BASELINE}. Your first {PROVISIONAL_EVENTS} results move the
          number fast so it finds your real level, then it settles down and shifts gradually.
        </li>
        <li>It&apos;s an honest estimate (Beta) — it can go down on a rough day — not an official rating.</li>
      </ul>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-chess-surface border border-slate-200 shadow-sm px-2 py-2.5 text-center min-w-0">
      <div className="text-lg font-black tabular-nums text-chess-text truncate">{value}</div>
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
