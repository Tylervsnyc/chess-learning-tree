'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { ActionButton } from '@/components/ui/ActionButton';

/**
 * /profile — the user's profile, streak, and lifetime stats.
 *
 * The streak is the hero: it's dead simple — do *anything* on the app today
 * (a lesson, a game, a puzzle) and the day counts. Below it: quick actions to
 * keep the streak alive, then a grid of lifetime stat tiles.
 *
 * Data comes from existing endpoints — nothing is rebuilt here:
 *   - profile/name/sub          → useUser()
 *   - streak                    → GET /api/workout/streak?tz=
 *   - lifetime stats            → GET /api/profile/stats
 */

interface StreakData {
  current: number;
  longest: number;
  completedToday: boolean;
}

interface LifetimeStats {
  lessonsCompleted: number;
  puzzlesSolved: number;
  gamesPlayed: number;
  levelsUnlocked: number;
  workoutPoints: number;
}

interface WeekDay {
  date: string; // YYYY-MM-DD
  label: string; // Mon
  points: number;
}

interface WeekData {
  days: WeekDay[];
  weekTotal: number;
}

interface WorkoutSession {
  id: string;
  createdAt: string;
  points: number;
  correct: number;
  wrong: number;
  perfect: boolean;
  durationMinutes: number | null;
  missedCount: number;
}

interface EloSeriesPoint {
  date: string; // YYYY-MM-DD
  elo: number;
}

interface EloData {
  current: number;
  events: number;
  series: EloSeriesPoint[];
}

function todayLocalKey(): string {
  // YYYY-MM-DD in the user's local timezone (matches the week endpoint's tz).
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fmtSessionDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function getTz(): string {
  return typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    : 'UTC';
}

// ─── Inline icons (lucide-react isn't installed; app uses inline SVGs) ───────

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2c.3 3.2-1.8 4.6-3 6-1.4 1.6-2 3.2-2 5a5 5 0 0 0 10 0c0-1.4-.5-2.6-1.3-3.6.2 1-.3 2-1.2 2.4.6-1.8-.1-3.7-1.3-5C11.9 5.6 11.7 3.7 12 2Z" />
    </svg>
  );
}

const STAT_ICONS = {
  lessons: (
    <path d="M4 5a2 2 0 0 1 2-2h11v16H6a2 2 0 0 1-2-2V5Zm13-2h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-2" />
  ),
  puzzles: (
    <path d="M9 3a2 2 0 0 1 4 0c0 1 .5 1.5 1.5 1.5H17a1 1 0 0 1 1 1v2.5c0 1 .5 1.5 1.5 1.5a2 2 0 0 1 0 4c-1 0-1.5.5-1.5 1.5V19a1 1 0 0 1-1 1h-3a2 2 0 0 0-4 0H6a1 1 0 0 1-1-1v-2.5C5 15.5 4.5 15 3.5 15a2 2 0 0 1 0-4C4.5 11 5 10.5 5 9.5V7a1 1 0 0 1 1-1h2.5C9.5 6 10 5.5 10 4.5" />
  ),
  games: (
    <path d="M9 4h6l1 4h2a2 2 0 0 1 2 2v1l-2 1v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3l-2-1v-1a2 2 0 0 1 2-2h2l1-4Zm-1 14v2h8v-2" />
  ),
  levels: (
    <path d="M12 2 4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-4Z" />
  ),
  points: (
    <path d="m12 2 2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.3 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2Z" />
  ),
} as const;

function StatIcon({ kind, className }: { kind: keyof typeof STAT_ICONS; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {STAT_ICONS[kind]}
    </svg>
  );
}

// ─── Building blocks ─────────────────────────────────────────────────────────

function StatTile({
  kind,
  label,
  value,
  loading,
}: {
  kind: keyof typeof STAT_ICONS;
  label: string;
  value: number | undefined;
  loading: boolean;
}) {
  return (
    <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm px-4 py-3.5 flex flex-col gap-1.5">
      <StatIcon kind={kind} className="w-5 h-5 text-chess-blue" />
      <span className="text-2xl font-black text-chess-text tabular-nums leading-none">
        {loading || value === undefined ? '–' : value.toLocaleString()}
      </span>
      <span className="text-xs font-semibold text-chess-text-muted leading-tight">{label}</span>
    </div>
  );
}

function SubscriptionBadge({ status }: { status: 'free' | 'premium' | 'trial' }) {
  const map = {
    premium: { label: 'Premium', cls: 'bg-chess-gold/20 text-chess-gold-dark' },
    trial: { label: 'Trial', cls: 'bg-chess-purple/15 text-chess-purple' },
    free: { label: 'Free', cls: 'bg-chess-text/10 text-chess-text-muted' },
  } as const;
  const m = map[status] ?? map.free;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide ${m.cls}`}>
      {m.label}
    </span>
  );
}

function EloCard({ data, loading }: { data: EloData | null; loading: boolean }) {
  const hasSeries = !!data && data.series.length >= 2 && data.events > 0;

  // ── Build the SVG line path in a 0–100 × 0–100 viewBox ──────────────────
  const W = 100;
  const H = 100;
  const PAD_Y = 8;

  let linePath = '';
  let areaPath = '';
  let lastPt: { x: number; y: number } | null = null;
  let lo = 0;
  let hi = 0;

  if (hasSeries) {
    const pts = data!.series;
    const elos = pts.map((p) => p.elo);
    lo = Math.min(...elos);
    hi = Math.max(...elos);
    const span = Math.max(1, hi - lo);
    const n = pts.length;

    const coords = pts.map((p, i) => {
      const x = n === 1 ? W : (i / (n - 1)) * W;
      const y = PAD_Y + (1 - (p.elo - lo) / span) * (H - PAD_Y * 2);
      return { x, y };
    });

    linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(' ');
    areaPath = `${linePath} L${W},${H} L0,${H} Z`;
    lastPt = coords[coords.length - 1];
  }

  return (
    <div className="bg-chess-surface rounded-3xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted">
              Estimated Rating
            </h2>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-chess-blue/10 text-chess-blue">
              Beta
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-black text-chess-text tabular-nums leading-none">
              {loading || !data ? '–' : data.current.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-chess-text-muted">ELO</span>
          </div>
        </div>
      </div>

      {loading || !data ? (
        <div className="mt-4 h-28 bg-slate-100 rounded-xl animate-pulse" />
      ) : !hasSeries ? (
        <p className="mt-4 text-sm text-chess-text-muted leading-snug">
          Solve a few puzzles or play Rookie and we&apos;ll estimate your rating — then track it here over time.
        </p>
      ) : (
        <>
          <div className="mt-4 relative">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="w-full h-28"
              aria-hidden
            >
              <defs>
                <linearGradient id="eloFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chess-blue, #3b82f6)" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="var(--color-chess-blue, #3b82f6)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#eloFill)" />
              <path
                d={linePath}
                fill="none"
                stroke="var(--color-chess-blue, #3b82f6)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {lastPt && (
                <circle
                  cx={lastPt.x}
                  cy={lastPt.y}
                  r={3.5}
                  fill="var(--color-chess-blue, #3b82f6)"
                  stroke="white"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-chess-text-faint">
            <span>Low {lo.toLocaleString()}</span>
            <span>Estimated from your puzzles &amp; games</span>
            <span>High {hi.toLocaleString()}</span>
          </div>
        </>
      )}
    </div>
  );
}

function WeekChart({ data, loading }: { data: WeekData | null; loading: boolean }) {
  const today = todayLocalKey();

  if (loading || !data) {
    return (
      <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-chess-text">This week</h2>
        </div>
        <div className="h-28 flex items-end gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 bg-slate-100 rounded-md animate-pulse" style={{ height: `${30 + (i % 3) * 20}%` }} />
          ))}
        </div>
      </div>
    );
  }

  const days = data.days ?? [];
  const maxPoints = Math.max(1, ...days.map((d) => d.points));

  return (
    <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-bold text-chess-text">This week</h2>
        <span className="text-xs font-bold text-chess-text-muted tabular-nums">
          {data.weekTotal.toLocaleString()} pts
        </span>
      </div>

      {data.weekTotal === 0 ? (
        <p className="text-sm text-chess-text-muted py-6 text-center">
          No workouts yet this week. Start one to fill the chart.
        </p>
      ) : (
        <div className="flex items-end gap-2 h-28">
          {days.map((d) => {
            const isToday = d.date === today;
            const pct = Math.round((d.points / maxPoints) * 100);
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className={`w-full rounded-md transition-all ${
                      isToday ? 'bg-chess-blue' : 'bg-chess-blue/30'
                    }`}
                    style={{ height: d.points > 0 ? `${Math.max(pct, 6)}%` : '4px' }}
                    title={`${d.points} pts`}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold leading-none ${
                    isToday ? 'text-chess-blue' : 'text-chess-text-faint'
                  }`}
                >
                  {d.label.charAt(0)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SessionRow({ session }: { session: WorkoutSession }) {
  const total = session.correct + session.wrong;
  const reviewable = session.missedCount > 0;

  const inner = (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-chess-text leading-tight">
            {fmtSessionDate(session.createdAt)}
          </span>
          {session.perfect && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-chess-gold/20 text-chess-gold-dark">
              Perfect
            </span>
          )}
        </div>
        <div className="text-xs text-chess-text-muted mt-0.5">
          {session.correct}/{total} solved
          {reviewable && (
            <span className="text-chess-blue font-semibold"> · Review {session.missedCount} missed</span>
          )}
        </div>
      </div>
      <span className="text-sm font-black text-chess-green tabular-nums whitespace-nowrap">
        +{session.points}
      </span>
      {reviewable && (
        <svg className="w-4 h-4 text-chess-text-faint shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </div>
  );

  if (reviewable) {
    return (
      <Link
        href={`/workout/review/${session.id}`}
        className="block active:bg-chess-page transition-colors"
      >
        {inner}
      </Link>
    );
  }
  return <div>{inner}</div>;
}

function RecentWorkouts({ sessions, loading }: { sessions: WorkoutSession[] | null; loading: boolean }) {
  return (
    <div>
      <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted px-1 mb-2">
        Recent Workouts
      </h2>
      <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading || sessions === null ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                </div>
                <div className="h-4 w-10 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-chess-text-muted py-6 px-4 text-center">
            No workouts yet. Finish one and it shows up here.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {sessions.map((s) => (
              <SessionRow key={s.id} session={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, profile, loading: userLoading } = useUser();

  const [streak, setStreak] = useState<StreakData | null>(null);
  const [stats, setStats] = useState<LifetimeStats | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  const [elo, setElo] = useState<EloData | null>(null);
  const [eloLoading, setEloLoading] = useState(false);

  const [week, setWeek] = useState<WeekData | null>(null);
  const [weekLoading, setWeekLoading] = useState(false);
  const [sessions, setSessions] = useState<WorkoutSession[] | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setStreak(null);
      setStats(null);
      return;
    }
    let cancelled = false;
    setDataLoading(true);
    const tz = getTz();
    Promise.all([
      fetch(`/api/workout/streak?tz=${encodeURIComponent(tz)}`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch('/api/profile/stats', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]).then(([s, st]) => {
      if (cancelled) return;
      if (s) setStreak(s as StreakData);
      if (st) setStats(st as LifetimeStats);
      setDataLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Weekly chart + recent sessions load independently.
  useEffect(() => {
    if (!user) {
      setWeek(null);
      setSessions(null);
      return;
    }
    let cancelled = false;
    const tz = getTz();

    setWeekLoading(true);
    fetch(`/api/workout/week?tz=${encodeURIComponent(tz)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((w) => {
        if (cancelled) return;
        if (w) setWeek(w as WeekData);
        setWeekLoading(false);
      });

    setSessionsLoading(true);
    fetch('/api/workout/sessions?limit=10', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((data) => {
        if (cancelled) return;
        setSessions(Array.isArray(data?.sessions) ? (data.sessions as WorkoutSession[]) : []);
        setSessionsLoading(false);
      });

    setEloLoading(true);
    fetch('/api/profile/elo', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((e) => {
        if (cancelled) return;
        if (e) setElo(e as EloData);
        setEloLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  // ── Logged-out gate ──────────────────────────────────────────────────────
  if (!userLoading && !user) {
    return (
      <div className="h-full overflow-auto bg-chess-page">
        <div className="max-w-lg md:max-w-2xl mx-auto w-full px-4 md:px-6 py-10 flex flex-col items-center text-center gap-5">
          <h1 className="text-2xl font-black text-chess-text">Your Profile</h1>
          <p className="text-sm text-chess-text-muted max-w-xs">
            Sign in to start a streak, track your lifetime stats, and pick up
            where you left off.
          </p>
          <Link href="/auth/login" className="w-full max-w-xs">
            <ActionButton color="green" size="lg" fullWidth>
              Sign In
            </ActionButton>
          </Link>
          <Link
            href="/auth/signup"
            className="text-chess-blue hover:text-chess-blue-dark font-semibold text-sm transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  const displayName = profile?.display_name?.trim() || 'Chess Player';
  const subStatus = profile?.subscription_status ?? 'free';
  const initial = displayName.charAt(0).toUpperCase();

  const current = streak?.current ?? 0;
  const longest = streak?.longest ?? 0;
  const done = streak?.completedToday ?? false;
  const streakReady = !dataLoading && streak !== null;

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-lg md:max-w-2xl mx-auto w-full px-4 md:px-6 pt-4 pb-10 flex flex-col gap-4">
        {/* Header — name + subscription badge */}
        <header className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-chess-blue/15 flex items-center justify-center shrink-0">
            <span className="text-xl font-black text-chess-blue">{initial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-chess-text truncate leading-tight">
              {userLoading ? '…' : displayName}
            </h1>
            <div className="mt-1">
              {!userLoading && <SubscriptionBadge status={subStatus} />}
            </div>
          </div>
        </header>

        {/* ── Streak hero ──────────────────────────────────────────────── */}
        <div
          className={`relative overflow-hidden rounded-3xl p-5 shadow-sm border transition-colors ${
            done
              ? 'border-chess-orange/30 bg-gradient-to-br from-chess-orange/15 via-chess-orange/5 to-transparent'
              : 'border-slate-200 bg-chess-surface'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`relative w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 ${
                done ? 'bg-chess-orange/20' : 'bg-chess-text/5'
              }`}
            >
              <FlameIcon
                className={`w-11 h-11 ${done ? 'text-chess-orange' : 'text-chess-text/30'}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-chess-text tabular-nums leading-none">
                  {streakReady ? current : '–'}
                </span>
                <span className="text-base font-bold text-chess-text-muted">
                  day{current === 1 ? '' : 's'}
                </span>
              </div>
              <p className="text-sm font-semibold text-chess-text-muted mt-1.5 leading-snug">
                {!streakReady
                  ? 'Loading your streak…'
                  : done
                    ? 'You showed up today. Streak safe.'
                    : current > 0
                      ? 'Do anything today to keep it alive.'
                      : 'Do anything today to start your streak.'}
              </p>
            </div>
          </div>

          {/* Footer row — the rule + longest */}
          <div className="mt-4 pt-3.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
            <span className="font-semibold text-chess-text-faint">
              A lesson, a game, or a puzzle — anything counts.
            </span>
            <span className="font-bold text-chess-text-muted whitespace-nowrap ml-2">
              Best {streakReady ? longest : '–'}
            </span>
          </div>
        </div>

        {/* ── Estimated rating + trend ─────────────────────────────────── */}
        <EloCard data={elo} loading={eloLoading} />

        {/* Lifetime stat tiles */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted px-1 mb-2">
            Lifetime Stats
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatTile kind="lessons" label="Lessons completed" value={stats?.lessonsCompleted} loading={dataLoading} />
            <StatTile kind="puzzles" label="Puzzles solved" value={stats?.puzzlesSolved} loading={dataLoading} />
            <StatTile kind="games" label="Games played" value={stats?.gamesPlayed} loading={dataLoading} />
            <StatTile kind="levels" label="Levels unlocked" value={stats?.levelsUnlocked} loading={dataLoading} />
            <StatTile kind="points" label="Workout points" value={stats?.workoutPoints} loading={dataLoading} />
          </div>
        </div>

        {/* ── Beta product — the daily workout experiment ──────────────── */}
        <div className="mt-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted">
              Beta Product
            </h2>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-chess-purple/10 text-chess-purple">
              Beta
            </span>
          </div>

          {/* Daily Workout — the focal CTA */}
          <Link href="/workout" className="block">
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
              <div>
                <h2 className="text-lg font-bold text-chess-text leading-tight">Daily Workout</h2>
                <p className="text-sm text-chess-text-muted">Chess + exercise circuit</p>
              </div>
              <ActionButton color="green" size="lg" fullWidth>
                Start Workout
              </ActionButton>
            </div>
          </Link>

          {/* This week — workout points bar chart */}
          <WeekChart data={week} loading={weekLoading} />

          {/* Recent workouts — tappable when there are missed puzzles to review */}
          <RecentWorkouts sessions={sessions} loading={sessionsLoading} />
        </div>
      </div>
    </div>
  );
}
