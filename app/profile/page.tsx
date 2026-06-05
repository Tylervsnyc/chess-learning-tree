'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { ActionButton } from '@/components/ui/ActionButton';
import { PatronModal } from '@/components/subscription/PatronModal';
import { RookieRatingCard } from '@/components/profile/RookieRatingCard';
import RookieCampfire from '@/components/shared/RookieCampfire';

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

// ─── Streak copy ────────────────────────────────────────────────────────────
// Lines shown when the streak is kept today. Picked daily-stable (same line all
// day, changes tomorrow) so it stays fresh without flickering on re-render.
const STREAK_KEPT_LINES = [
  'You kept the fire going today.',
  "Fire's still going. Nice work.",
  'Another log on the fire.',
  "Today's done — the fire stays lit.",
  'You showed up. The fire\'s happy.',
  'Still burning bright. See you tomorrow.',
  'One more day, one more flame.',
  'The fire lives another day.',
  "Streak's alive and the fire's roaring.",
  'You fed the fire today. Good.',
];

function pickDailyKeptLine(): string {
  const d = new Date();
  const dayKey = d.getFullYear() * 1000 + d.getMonth() * 31 + d.getDate();
  return STREAK_KEPT_LINES[dayKey % STREAK_KEPT_LINES.length];
}

// ─── Inline icons (lucide-react isn't installed; app uses inline SVGs) ───────

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

// Gold "Patron" pill — shown only for supporters. Purely cosmetic, no features.
function PatronBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide text-amber-800"
      style={{ background: 'linear-gradient(135deg, #FFF1C2, #FFD968)' }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
        <path d="M5 19a2 2 0 012-2h10a2 2 0 012 2 2 2 0 01-2 2H7a2 2 0 01-2-2z" />
      </svg>
      Patron
    </span>
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
        Recent Chess Boxing
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
  const { user, profile, loading: userLoading, refetchProfile } = useUser();

  const [patronOpen, setPatronOpen] = useState(false);
  // Daily-stable streak line (computed once, won't flicker on re-render).
  const [keptLine] = useState(pickDailyKeptLine);
  // ?preview=gold — see the gold profile without a premium/patron account.
  const [previewGold, setPreviewGold] = useState(false);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [stats, setStats] = useState<LifetimeStats | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  const [elo, setElo] = useState<EloData | null>(null);
  const [eloLoading, setEloLoading] = useState(false);

  const [week, setWeek] = useState<WeekData | null>(null);
  const [weekLoading, setWeekLoading] = useState(false);
  const [sessions, setSessions] = useState<WorkoutSession[] | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // Fire data fetches on mount — the API routes authenticate from the cookie
  // themselves, so we don't wait for useUser()'s auth round-trip first. This
  // removes a full round-trip from the critical path; streak/stats/elo load in
  // parallel with the auth check instead of after it. (Logged-out users get a
  // 401 handled gracefully below, and the logged-out gate renders regardless.)
  useEffect(() => {
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
  }, []);

  // ?preview=gold — local-only visual preview of the gold (premium/patron) state.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('preview') === 'gold') {
      setPreviewGold(true);
    }
  }, []);

  // Returning from patron checkout (?patron=1): the webhook flips is_patron
  // server-side, so poll the profile a few times until the gold flag lands.
  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('patron') !== '1') return;
    let tries = 0;
    const id = setInterval(() => {
      tries += 1;
      refetchProfile();
      if (tries >= 5) clearInterval(id);
    }, 1500);
    // Clean the URL so a refresh doesn't re-trigger the poll.
    window.history.replaceState({}, '', '/profile');
    return () => clearInterval(id);
  }, [user, refetchProfile]);

  // Weekly chart + recent sessions + elo load independently, on mount.
  useEffect(() => {
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
  }, []);

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
  const isPatron = profile?.is_patron === true;
  // Profile turns gold for supporters AND premium members (or ?preview=gold).
  const isGold = isPatron || subStatus === 'premium' || previewGold;
  const initial = displayName.charAt(0).toUpperCase();

  // useUser() flips `loading` false on the first auth event but fetches the
  // profile a beat later. Gate gold-dependent chrome (badges, Patron CTA) on
  // the profile actually being known, so it doesn't flash in then disappear
  // — which was shoving the streak hero down on load. preview=gold counts.
  const profileReady = !userLoading && (!user || profile !== null || previewGold);
  // Only show the gold treatment once we actually know — avoids a blue→gold snap.
  const showGold = profileReady && isGold;

  const current = streak?.current ?? 0;
  const longest = streak?.longest ?? 0;
  const done = streak?.completedToday ?? false;
  const streakReady = !dataLoading && streak !== null;

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-lg md:max-w-2xl mx-auto w-full px-4 md:px-6 pt-4 pb-10 flex flex-col gap-4">
        {/* Header — name + subscription badge + gold CTA */}
        <header className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
              showGold ? '' : 'bg-chess-blue/15'
            }`}
            style={showGold ? { background: 'linear-gradient(135deg, #FFE9A8, #FFCB45)' } : undefined}
          >
            <span className={`text-xl font-black transition-colors ${showGold ? 'text-amber-800' : 'text-chess-blue'}`}>
              {initial}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1
              className={`text-xl font-black truncate leading-tight transition-colors ${
                showGold ? 'text-amber-700' : 'text-chess-text'
              }`}
            >
              {userLoading ? '…' : displayName}
            </h1>
            <div className="mt-1 flex items-center gap-1.5">
              {profileReady && <SubscriptionBadge status={subStatus} />}
              {profileReady && isPatron && <PatronBadge />}
            </div>
          </div>
        </header>

        {/* Become a Patron — big, fun gold CTA. Hidden once gold. Gated on
            profileReady so it never flashes in then out for gold users. */}
        {profileReady && user && !isGold && (
          <button
            onClick={() => setPatronOpen(true)}
            className="group w-full rounded-3xl p-5 flex items-center gap-4 text-left active:scale-[0.99] transition-transform"
            style={{
              background: 'linear-gradient(135deg, #FFD968 0%, #FFB628 55%, #F59E0B 100%)',
              boxShadow: '0 6px 0 #C77F0B, 0 10px 22px rgba(217,160,23,0.35)',
            }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-white/30 ring-1 ring-white/40">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="text-amber-900" aria-hidden>
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
                <path d="M5 19a2 2 0 012-2h10a2 2 0 012 2 2 2 0 01-2 2H7a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-black text-amber-950 leading-tight">Become a Patron</div>
              <div className="text-sm font-semibold text-amber-900/80 leading-snug">
                Support chesspath.app and turn your profile gold.
              </div>
            </div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="text-amber-900/70 shrink-0 group-active:translate-x-0.5 transition-transform" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        )}

        {/* ── Streak hero — Rookie catches fire when your streak is alive ── */}
        <div
          className={`relative overflow-hidden rounded-3xl p-5 shadow-sm border transition-colors text-white ${
            done
              ? 'border-chess-orange/40 bg-gradient-to-b from-[#2A3C45] via-[#33373f] to-[#3a2e26]'
              : 'border-slate-600/40 bg-gradient-to-b from-slate-700 to-slate-800'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0 flex items-end justify-center" style={{ width: 88 }}>
              <RookieCampfire blockSize={14} active={streakReady && done} blaze={Math.max(0.3, Math.min(1, current / 60))} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white tabular-nums leading-none">
                  {streakReady ? current : '–'}
                </span>
                <span className="text-base font-bold text-white/55">
                  day{current === 1 ? '' : 's'}
                </span>
              </div>
              <p className="text-sm font-semibold text-white/70 mt-1.5 leading-snug">
                {!streakReady
                  ? 'Loading your streak…'
                  : done
                    ? keptLine
                    : current > 0
                      ? "Don't let the fire go out — do anything today."
                      : 'Do anything today to spark your streak.'}
              </p>
            </div>
          </div>

          {/* Footer row — the rule + longest */}
          <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="font-semibold text-white/45">
              A lesson, a game, or a puzzle — anything counts.
            </span>
            <span className="font-bold text-amber-300 whitespace-nowrap ml-2">
              Best {streakReady ? longest : '–'}
            </span>
          </div>
        </div>

        {/* ── Estimated rating: Rookie's voice + detailed chart, one card ── */}
        <RookieRatingCard data={elo} loading={eloLoading} />

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

          {/* Chess Boxing — the focal CTA */}
          <Link href="/workout" className="block">
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
              <div>
                <h2 className="text-lg font-bold text-chess-text leading-tight">Chess Boxing</h2>
                <p className="text-sm text-chess-text-muted">Chess + exercise circuit</p>
              </div>
              <ActionButton color="green" size="lg" fullWidth>
                Start Chess Boxing
              </ActionButton>
            </div>
          </Link>

          {/* This week — workout points bar chart */}
          <WeekChart data={week} loading={weekLoading} />

          {/* Recent workouts — tappable when there are missed puzzles to review */}
          <RecentWorkouts sessions={sessions} loading={sessionsLoading} />
        </div>
      </div>

      <PatronModal isOpen={patronOpen} onClose={() => setPatronOpen(false)} />
    </div>
  );
}
