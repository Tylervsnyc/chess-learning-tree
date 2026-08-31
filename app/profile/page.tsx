'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useProfileData } from '@/hooks/useProfileData';
import type { WorkoutSessionSummary as WorkoutSession } from '@/lib/workout/sessions';
import { ActionButton } from '@/components/ui/ActionButton';
import { PatronModal } from '@/components/subscription/PatronModal';
import { useIsNativeApp } from '@/lib/native-app';
import { IS_CHESSPATH_APP } from '@/lib/config/offline';
import { RookieRatingCard } from '@/components/profile/RookieRatingCard';
import { StreakHero } from '@/components/shared/StreakHero';
import { WeekChart, type WeekData } from '@/components/shared/WeekChart';
import { TrophyCase } from '@/components/achievements/TrophyCase';

/**
 * /profile — the user's profile, streak, and lifetime stats.
 *
 * The streak is the hero: it's dead simple — do *anything* on the app today
 * (a lesson, a game, a puzzle) and the day counts. Below it: quick actions to
 * keep the streak alive, then a grid of lifetime stat tiles.
 *
 * Data comes from two calls (CHE-379):
 *   - profile/name/sub          → useUser()
 *   - everything                → useProfileData() (shared with /box/profile)
 *   - stats/week/sessions/elo   → GET /api/profile/dashboard?tz= (one round-trip)
 */

/** Fight record from /api/bout/record (Bout v2). */
interface BoutRecord {
  wins: number;
  losses: number;
  draws: number;
  kos: number;
  total: number;
  points: number;
}


interface EloSeriesPoint {
  date: string; // YYYY-MM-DD
  elo: number;
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
  brilliant: (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5L12 8Z" />
  ),
  great: (
    <path d="M20 6 9 17l-5-5" />
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

/**
 * Fight record — the bout ledger (Bout v2). Hidden entirely until the user has
 * fought one, so a profile that has never opened Bout mode doesn't grow a row
 * of zeros. Data: /api/bout/record.
 */
function FightRecord({ record }: { record: BoutRecord | null }) {
  // No skeleton on purpose: a placeholder that resolves to "nothing" for every
  // user who has never fought would just be a flash of empty chrome.
  if (!record || record.total === 0) return null;

  return (
    <div>
      <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted px-1 mb-2">
        Fight record
      </h2>
      <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="text-3xl font-black text-chess-green tabular-nums">{record.wins}</span>
          <span className="text-2xl font-black text-chess-text-muted">-</span>
          <span className="text-3xl font-black text-[#e5484d] tabular-nums">{record.losses}</span>
          <span className="text-2xl font-black text-chess-text-muted">-</span>
          <span className="text-3xl font-black text-chess-text-muted tabular-nums">
            {record.draws}
          </span>
        </div>
        <div className="flex justify-center gap-6 pt-2 border-t border-slate-100">
          <div className="text-center">
            <div className="text-lg font-black text-chess-text tabular-nums">{record.total}</div>
            <div className="text-[11px] font-semibold text-chess-text-muted">bouts</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-chess-text tabular-nums">{record.kos}</div>
            <div className="text-[11px] font-semibold text-chess-text-muted">
              {record.kos === 1 ? 'checkmate' : 'checkmates'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-chess-text tabular-nums">
              {record.points.toLocaleString()}
            </div>
            <div className="text-[11px] font-semibold text-chess-text-muted">points</div>
          </div>
        </div>
      </div>
    </div>
  );
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

// ── Recent Games — collapsible dropdown of past Play Rookie games, each row
// linking to /review/[id]. Fetches /api/games lazily on first expand so the
// profile load pays nothing for it.

interface RecentGame {
  id: string;
  startedAt: string | null;
  endedAt: string | null;
  result: 'win' | 'loss' | 'draw' | null;
  totalMoves: number;
  brilliantMoves: number;
  greatMoves: number;
}

const GAME_RESULT = {
  win: { label: 'Won', cls: 'text-chess-green' },
  loss: { label: 'Lost', cls: 'text-[#e5484d]' },
  draw: { label: 'Draw', cls: 'text-chess-text-muted' },
} as const;

function RecentGameRow({ game }: { game: RecentGame }) {
  const result = GAME_RESULT[game.result ?? 'draw'] ?? GAME_RESULT.draw;
  return (
    <Link
      href={`/review?id=${game.id}`}
      className="flex items-center gap-3 px-4 py-3 min-h-[44px] active:bg-chess-page transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-chess-text leading-tight">
            {fmtSessionDate(game.endedAt || game.startedAt || '')}
          </span>
          <span className={`text-sm font-black ${result.cls}`}>{result.label}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-chess-text-muted mt-0.5">
          <span>{game.totalMoves} moves</span>
          {game.brilliantMoves > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/15 text-cyan-600">
              {game.brilliantMoves} brilliant
            </span>
          )}
          {game.greatMoves > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-600">
              {game.greatMoves} great
            </span>
          )}
        </div>
      </div>
      <svg className="w-4 h-4 text-chess-text-faint shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  );
}

function RecentGames() {
  const [open, setOpen] = useState(false);
  const [games, setGames] = useState<RecentGame[] | null>(null);
  const [failed, setFailed] = useState(false);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && games === null && !failed) {
      fetch('/api/games')
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`${res.status}`))))
        .then((data) => setGames(Array.isArray(data.games) ? data.games : []))
        .catch(() => setFailed(true));
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="w-full min-h-[44px] flex items-center justify-between px-1"
      >
        <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted">
          Recent Games{games !== null ? ` (${games.length})` : ''}
        </h2>
        <svg
          className={`w-4 h-4 text-chess-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-1">
          {failed ? (
            <p className="text-sm text-chess-text-muted py-6 px-4 text-center">
              Could not load your games. Try again in a moment.
            </p>
          ) : games === null ? (
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : games.length === 0 ? (
            <p className="text-sm text-chess-text-muted py-6 px-4 text-center">
              Play a game and it&apos;ll show up here.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {games.map((g) => (
                <RecentGameRow key={g.id} game={g} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sign out — client-side (supabase.auth.signOut via useUser), so it works
// in the offline iOS bundles where /api/auth/logout doesn't exist. Clears
// localStorage like the Chess Boxing settings screen, so the next launch is a
// clean slate (onboarding / sign-in), then lands on the root.
function SignOutButton() {
  const router = useRouter();
  const { user, signOut } = useUser();
  const [busy, setBusy] = useState(false);
  if (!user) return null;

  const onSignOut = async () => {
    if (busy) return;
    setBusy(true);
    await signOut();
    try { localStorage.clear(); } catch {}
    router.replace('/');
    router.refresh();
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        type="button"
        onClick={onSignOut}
        disabled={busy}
        className="min-h-[44px] w-full max-w-xs rounded-xl border border-slate-300 bg-chess-surface text-sm font-bold text-chess-text disabled:opacity-50"
      >
        {busy ? 'Signing out…' : 'Sign out'}
      </button>
    </div>
  );
}

// ── Delete account — Apple 5.1.1(v). Quiet red link at the bottom that
// expands into an inline confirm (type DELETE). No browser dialogs.
function DeleteAccount() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const armed = text.trim() === 'DELETE';

  const onDelete = async () => {
    if (!armed || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' });
      if (!res.ok) throw new Error('Delete failed');
      try { localStorage.clear(); } catch {}
      router.replace('/');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again or email support.');
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-[44px] px-4 text-xs font-medium text-red-500 hover:underline"
        >
          Delete account
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-chess-surface rounded-2xl border border-red-200 p-4 flex flex-col gap-3">
      <p className="text-sm text-chess-text">
        This permanently deletes your account, progress, streak and rating. Type <strong>DELETE</strong> to confirm.
      </p>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="DELETE"
        autoCapitalize="characters"
        autoCorrect="off"
        className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 text-sm text-chess-text bg-white focus:outline-none focus:border-red-400"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setOpen(false); setText(''); setError(null); }}
          disabled={busy}
          className="flex-1 min-h-[44px] rounded-xl border border-slate-300 text-sm font-semibold text-chess-text-muted"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={!armed || busy}
          className="flex-1 min-h-[44px] rounded-xl bg-red-600 text-white text-sm font-bold disabled:opacity-40"
        >
          {busy ? 'Deleting...' : 'Delete my account'}
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, profile, loading: userLoading, refetchProfile } = useUser();
  const pageRouter = useRouter();

  const [patronOpen, setPatronOpen] = useState(false);
  // Inside the Chess Boxing iOS shell: no Patron purchase CTA (Apple 3.1.1).
  const nativeApp = useIsNativeApp();

  // ONE profile per context (2026-08-25). The app has its own profile at
  // /box/profile — a no-scroll room that fits under the tab bar — but plenty
  // of shared surfaces still route here by name: the workout finish screen's
  // Done button, the review page, the web nav. Rather than hunt every caller
  // and keep hunting as new ones appear, /profile hands off to /box/profile
  // whenever we're inside the shell. Web is untouched.
  //
  // Client-side because Capacitor is only detectable in the browser; the
  // shell can't be sniffed from a request header.
  useEffect(() => {
    // Chess Path app: there is no /box/profile — this page IS the profile.
    if (nativeApp && !IS_CHESSPATH_APP) pageRouter.replace('/box/profile');
  }, [nativeApp, pageRouter]);
  // ?preview=gold — see the gold profile without a premium/patron account.
  const [previewGold, setPreviewGold] = useState(false);
  // ONE profile read (hooks/useProfileData) — the same hook /box/profile uses,
  // so the two screens can never disagree about the same person. It fires on
  // mount without waiting for useUser(): these routes authenticate off the
  // cookie themselves, so the data loads in parallel with the auth check
  // rather than behind it. The streak is seeded synchronously from the local
  // snapshot inside the hook (CHE-379 — stops the hero jumping on load).
  const {
    streak,
    stats,
    week,
    sessions,
    elo,
    record: boutRecord,
    loading: dataLoading,
  } = useProfileData();
  // One request, one settle — every surface shares the same loading flag.
  const eloLoading = dataLoading;
  const weekLoading = dataLoading;
  const sessionsLoading = dataLoading;

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

  // Fighter handle counts as a name: a Chess Boxing user who set one during
  // onboarding never fills in display_name, and greeting them as the generic
  // 'Chess Player' when we know their handle reads as a bug (2026-08-25).
  const displayName =
    profile?.display_name?.trim() || profile?.username?.trim() || 'Chess Player';
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
  const streakReady = streak !== null;

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
        {profileReady && user && !isGold && !nativeApp && (
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

        {/* ── Streak hero — ONE implementation, shared with Chess Boxing ── */}
        <StreakHero streak={streak} />

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
            <StatTile kind="brilliant" label="Brilliant moves" value={stats?.brilliantMoves ?? 0} loading={dataLoading} />
            <StatTile kind="great" label="Great moves" value={stats?.greatMoves ?? 0} loading={dataLoading} />
          </div>
        </div>

        {/* ── Recent games — collapsed dropdown, rows link to /review/[id] ── */}
        {user && <RecentGames />}

        {/* ── Boxing surfaces — hidden in the Chess Path app (no /workout,
               no bouts there; the section's CTAs would 404) ─────────────── */}
        {!IS_CHESSPATH_APP && (<>
        {/* ── Trophy case — Chess Boxing achievements ──────────────────── */}
        <TrophyCase />

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
          {/* Fight record — renders only once the user has fought a bout */}
          <FightRecord record={boutRecord} />

          <RecentWorkouts sessions={sessions} loading={sessionsLoading} />
        </div>
        </>)}

        <SignOutButton />
        <DeleteAccount />
      </div>

      <PatronModal isOpen={patronOpen && !nativeApp} onClose={() => setPatronOpen(false)} />
    </div>
  );
}
