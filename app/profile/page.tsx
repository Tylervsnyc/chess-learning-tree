'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { ActionButton } from '@/components/ui/ActionButton';

/**
 * /profile — the user's profile & lifetime stats.
 *
 * Replaces the old /run slot in the nav. Shows the display name + subscription
 * badge, the daily-workout streak (current + longest), a grid of lifetime stat
 * tiles, and a prominent "Start Workout" CTA.
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
  todayPillars: { play: boolean; path: boolean };
}

interface LifetimeStats {
  lessonsCompleted: number;
  puzzlesSolved: number;
  gamesPlayed: number;
  levelsUnlocked: number;
  workoutPoints: number;
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

export default function ProfilePage() {
  const { user, profile, loading: userLoading } = useUser();

  const [streak, setStreak] = useState<StreakData | null>(null);
  const [stats, setStats] = useState<LifetimeStats | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

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

  // ── Logged-out gate ──────────────────────────────────────────────────────
  if (!userLoading && !user) {
    return (
      <div className="h-full overflow-auto bg-chess-page">
        <div className="max-w-md mx-auto w-full px-4 py-10 flex flex-col items-center text-center gap-5">
          <h1 className="text-2xl font-black text-chess-text">Your Profile</h1>
          <p className="text-sm text-chess-text-muted max-w-xs">
            Sign in to track your streak, see your lifetime stats, and pick up your
            daily workout where you left off.
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

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-md mx-auto w-full px-4 pt-4 pb-10 flex flex-col gap-4">
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

        {/* Start Workout — the focal CTA */}
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

        {/* Streak block */}
        <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-chess-orange/15 flex items-center justify-center shrink-0">
            <FlameIcon className="w-8 h-8 text-chess-orange" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-chess-text tabular-nums leading-none">
                {dataLoading || !streak ? '–' : streak.current}
              </span>
              <span className="text-sm font-bold text-chess-text-muted">
                day{streak?.current === 1 ? '' : 's'} streak
              </span>
            </div>
            <p className="text-xs text-chess-text-faint mt-1.5">
              Longest:{' '}
              <span className="font-bold text-chess-text-muted tabular-nums">
                {dataLoading || !streak ? '–' : streak.longest}
              </span>{' '}
              day{streak?.longest === 1 ? '' : 's'}
            </p>
          </div>
        </div>

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
      </div>
    </div>
  );
}
