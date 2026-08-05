'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LockerHome } from '@/components/chessboxing/LockerHome';
import { BreathingHeaderLogo } from '@/components/ui/BreathingHeaderLogo';
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

export interface LastSession {
  points: number;
  createdAt: string;
}

export function BoxToday() {
  const router = useRouter();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [last, setLast] = useState<LastSession | null | undefined>(undefined);
  const [rank, setRank] = useState<{ rank: number; total: number } | null | undefined>(undefined);
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
    // HARD RULE (docs/chess-boxing-app-structure.md): native app screens never
    // scroll. The locker is now the WHOLE screen (Tyler, 2026-08-05) — it
    // COVERS the window (center-cropped, never letterboxed) and every number
    // that used to sit in stat cards lives inside the scene: streak = chalk,
    // last score + rank = plaques on the door, standings = behind the door.
    <div className="h-full overflow-hidden bg-[#1b2a4a] relative">
      <div
        className="absolute inset-0 mx-auto max-w-lg md:max-w-xl overflow-hidden"
        style={{ containerType: 'size' }}
      >
        {/* Cover fit: whichever of width/height is the binding constraint wins,
            so the scene always fills the window and crops the rest. */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 'max(100cqw, calc(100cqh * 1024 / 1536))',
            aspectRatio: '1024 / 1536',
          }}
        >
          <LockerHome
            streak={streak}
            lastScore={last === undefined ? undefined : (last?.points ?? null)}
            lastScoreWhen={last ? relativeDay(last.createdAt) : null}
            rank={rank === undefined ? undefined : (rank ?? null)}
            onFight={() => router.push(FEATURE_FLAGS.BOUT_MODE ? '/box/bout' : '/workout')}
            onTrain={() => router.push('/workout')}
          />
        </div>
      </div>

      {/* Gym sign + settings — the only chrome, floating over the scene. */}
      <div className="absolute inset-x-0 top-0 mx-auto max-w-lg md:max-w-xl px-3 pt-[max(0.75rem,env(safe-area-inset-top))] flex items-start justify-center pointer-events-none">
        <GymSign />
        {inShell && (
          <Link
            href="/box/settings"
            aria-label="Settings"
            className="pointer-events-auto absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] flex items-center justify-center w-11 h-11 rounded-2xl bg-chess-surface text-chess-text-muted border-2 border-[#cbd5e1] shadow-[0_3px_0_0_#94a3b8] active:translate-y-[3px] active:shadow-none transition-transform tap-highlight"
          >
            <GearIcon />
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * The gym sign — "CHESS BOXING" on a hanging plate, in the Chess Path button
 * language (flat fill + hard 3px bottom shadow, no gradients).
 */
function GymSign() {
  return (
    <div className="pointer-events-none select-none">
      <div className="flex justify-center gap-8 px-3">
        <Hook />
        <Hook />
      </div>
      <div className="-mt-1 rounded-2xl bg-chess-red border-2 border-[#CC3939] shadow-[0_5px_0_0_#CC3939] px-5 py-2.5 text-center">
        <div className="text-[13px] md:text-sm font-black uppercase tracking-[0.28em] text-white/75 leading-none">
          Chess
        </div>
        <div className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-none mt-1">
          Boxing
        </div>
        {/* by Chess Path — the house that made it */}
        <div className="mt-1.5 flex items-center justify-center gap-1.5 bg-white/95 rounded-lg px-2 py-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-chess-text-muted leading-none">
            by
          </span>
          <BreathingHeaderLogo className="!w-[76px]" />
        </div>
      </div>
    </div>
  );
}

function Hook() {
  return <div className="w-1 h-3 rounded-b bg-[#94a3b8]" />;
}

function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1.02-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.56 1.02H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.03z" />
    </svg>
  );
}

function relativeDay(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}
