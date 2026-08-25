'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useProfileData } from '@/hooks/useProfileData';
import { WeekChart } from '@/components/shared/WeekChart';

/**
 * /box/profile — the Chess Boxing app's Profile tab. "Your corner".
 *
 * A QUIET ROOM (Tyler, 2026-08-25: "make it a little more minimal, we don't
 * need medals, just a chill looking room"). The previous version stacked a
 * trophy case, an ELO card with a toggle, lifetime tiles, Pro history sheets
 * and a week chart into one no-scroll screen; it was a dashboard, not a place.
 *
 * What's here now, and nothing else:
 *   - your name on a locker plate
 *   - three numbers that actually mean something day to day
 *   - the week
 *
 * The room is drawn with two flat bands — wall above, floor below, a warm
 * light from the top — rather than an illustration. It reads as a place at
 * any screen size, costs nothing to load, and stays out of the way of the
 * only things on it.
 *
 * The 88 medals still exist and still unlock on the finish screens; they just
 * don't live on this wall any more.
 *
 * Data comes from useProfileData() — the same hook /profile uses, so the two
 * screens can never disagree about the same person.
 *
 * HARD RULE (docs/chess-boxing-app-structure.md): fits the window, never
 * scrolls.
 */

export default function BoxProfilePage() {
  const { user, profile, loading: userLoading } = useUser();
  const { streak, elo, week, record, loading } = useProfileData();

  if (!userLoading && !user) return <SignedOut />;

  const name =
    profile?.username?.trim()
    || profile?.display_name?.trim()
    || user?.email?.split('@')[0]
    || 'Fighter';

  const days = streak?.current ?? 0;
  const rating = elo?.current ?? null;
  const fights = record?.total ?? 0;

  return (
    <div className="h-full overflow-hidden bg-chess-page relative">
      <Room />

      <div className="relative h-full max-w-lg md:max-w-xl mx-auto w-full px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4 flex flex-col">
        {/* Locker plate */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="relative rounded-xl bg-white border border-slate-200/90 shadow-[0_2px_0_0_rgba(15,23,42,0.06)] px-6 py-3 max-w-full">
            {/* two little screws, because it's a plate on a door */}
            <Screw className="left-2 top-2" />
            <Screw className="right-2 top-2" />
            <Screw className="left-2 bottom-2" />
            <Screw className="right-2 bottom-2" />
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-chess-text-muted text-center">
              Your corner
            </div>
            <div className="mt-0.5 text-xl md:text-2xl font-black text-chess-text text-center leading-tight break-all">
              {name}
            </div>
          </div>
        </div>

        {/* Three numbers */}
        <div className="shrink-0 mt-6 grid grid-cols-3 gap-3">
          <Stat label="Day streak" value={loading ? null : String(days)} />
          <Stat label="Fights" value={loading ? null : String(fights)} />
          <Stat label="Rating" value={loading ? null : rating === null ? '—' : String(rating)} />
        </div>

        {/* The week */}
        <div className="mt-6 min-h-0 flex-1 flex flex-col">
          <h2 className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-chess-text-muted px-1">
            This week
          </h2>
          <div className="mt-2 min-h-0 rounded-2xl bg-white border border-slate-200/90 p-3">
            <WeekChart data={week} loading={loading} />
          </div>
        </div>

        <Link
          href="/box/settings"
          className="shrink-0 mt-4 mx-auto text-xs font-bold text-chess-text-muted py-2 min-h-[44px] inline-flex items-center gap-1.5 tap-highlight"
        >
          <GearIcon />
          Settings
        </Link>
      </div>
    </div>
  );
}

/**
 * The room: a wall, a floor, and a warm light. Two bands and a soft radial —
 * no image, no illustration, nothing to load.
 */
function Room() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* wall */}
      <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-[#eaf2fb] to-[#e3edf8]" />
      {/* floor */}
      <div className="absolute inset-x-0 top-[62%] bottom-0 bg-gradient-to-b from-[#dfe7f2] to-[#d6e0ee]" />
      {/* the seam where they meet */}
      <div className="absolute inset-x-0 top-[62%] h-px bg-slate-300/60" />
      {/* light from above */}
      <div
        className="absolute inset-x-0 top-0 h-[70%]"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
    </div>
  );
}

function Screw({ className }: { className: string }) {
  return <span className={`absolute ${className} w-1 h-1 rounded-full bg-slate-300`} />;
}

function Stat({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 px-2 py-3 text-center">
      {value === null ? (
        <div className="h-7 w-10 mx-auto rounded bg-slate-100 animate-pulse" />
      ) : (
        <div className="text-2xl font-black text-chess-text leading-none tabular-nums">{value}</div>
      )}
      <div className="mt-1.5 text-[9.5px] font-black uppercase tracking-[0.14em] text-chess-text-muted leading-none">
        {label}
      </div>
    </div>
  );
}

function SignedOut() {
  return (
    <div className="h-full overflow-hidden bg-chess-page relative">
      <Room />
      <div className="relative max-w-lg mx-auto w-full h-full px-6 flex flex-col items-center justify-center gap-3 text-center">
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
        <Link
          href="/auth/signup"
          className="text-sm font-bold text-chess-blue tap-highlight py-3 min-h-[44px] inline-flex items-center"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}

function GearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1.02-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.56 1.02H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.03z" />
    </svg>
  );
}
