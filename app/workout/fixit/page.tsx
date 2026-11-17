'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkoutPuzzle, type WorkoutPuzzleData } from '@/components/workout/WorkoutPuzzle';
import { ArenaScene } from '@/components/chessboxing/Arena';
import { FullBleedShell } from '@/components/chessboxing/FullBleedShell';
import { isSoundEnabled, playButtonClick } from '@/lib/sounds';

/**
 * /workout/fixit — the Fix-It workout (learn-from-mistakes, layer 3).
 *
 * 10 remedial puzzles built from the user's LAST workout: the themes they
 * missed + their skill-profile blind spots (/api/workout/fixit). Untimed and
 * unscored — like /workout/review, we advance on BOTH right and wrong so the
 * user always keeps moving (momentum over perfection). The only score is a
 * "10 for 10" style tally at the end.
 *
 * Chess Boxing feature → ALWAYS the dark box shell (arena backdrop, white
 * text, one fixed window). Web users get the same screen.
 */

/** The sound helpers don't all check the global toggle themselves. */
function sfx(fn: () => unknown) {
  if (!isSoundEnabled()) return;
  try {
    void fn();
  } catch {
    /* audio is never load-bearing */
  }
}

/** Dark arena shell shared by every state of this page. */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full relative overflow-hidden bg-[#131a2e] flex flex-col">
      <FullBleedShell />
      <ArenaScene />
      {children}
    </div>
  );
}

/** Close X → /box, in the ArenaBackButton slot/style. */
function CloseButton() {
  return (
    <Link
      href="/box"
      aria-label="Back to the gym"
      className="absolute left-3 top-[max(0.75rem,env(safe-area-inset-top))] z-20 flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 text-white/70 border border-white/15 active:translate-y-[2px] transition-transform tap-highlight"
    >
      <Icon path={ICONS.close} className="w-5 h-5" />
    </Link>
  );
}

const BTN_PRIMARY =
  'w-full min-h-[44px] rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-4 shadow-[0_4px_0_0_#0d7ec4] active:translate-y-[2px] active:shadow-none transition';
const BTN_SECONDARY =
  'w-full min-h-[44px] rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 text-white font-black text-lg py-4 active:translate-y-[2px] transition';
/** Centered card column for the loading / error / complete states. */
const CENTER_SCROLL =
  'flex-1 min-h-0 relative z-10 overflow-y-auto ring-scroll pt-[max(4rem,calc(env(safe-area-inset-top)+3.5rem))] pb-[max(1rem,env(safe-area-inset-bottom))]';

// ─── Inline icons (lucide-react isn't installed; app uses inline SVGs) ────────

function Icon({ path, className }: { path: React.ReactNode; className?: string }) {
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
      {path}
    </svg>
  );
}

const ICONS = {
  close: <path d="M18 6 6 18M6 6l12 12" />,
  check: <path d="M20 6 9 17l-5-5" />,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
} as const;

interface FixitPuzzle extends WorkoutPuzzleData {
  slotLabel: string;
  /** Why this slot is in the set ("You missed 2 forks today") — from /api/workout/fixit. */
  slotReason?: string;
}

interface FixitResponse {
  sessionId: string;
  targets: string[];
  puzzles: FixitPuzzle[];
}

type Status = 'loading' | 'signin' | 'empty' | 'error' | 'solving' | 'complete';

export default function WorkoutFixitPage() {
  const router = useRouter();

  const [status, setStatus] = useState<Status>('loading');
  const [puzzles, setPuzzles] = useState<FixitPuzzle[]>([]);
  const [index, setIndex] = useState(0);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  // Bumped by "Run it again" to fetch a fresh set.
  const [run, setRun] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetch('/api/workout/fixit', { cache: 'no-store' })
      .then(async (r) => {
        if (r.status === 401) return 'signin' as const;
        if (r.status === 404) return 'empty' as const;
        if (!r.ok) return null;
        return (await r.json()) as FixitResponse;
      })
      .catch(() => null)
      .then((data) => {
        if (cancelled) return;
        if (data === 'signin' || data === 'empty') {
          setStatus(data);
          return;
        }
        const list = Array.isArray(data?.puzzles) ? data.puzzles : [];
        if (!data || list.length === 0) {
          setStatus('error');
          return;
        }
        setPuzzles(list);
        setIndex(0);
        setRight(0);
        setWrong(0);
        setStatus('solving');
      });
    return () => {
      cancelled = true;
    };
  }, [run]);

  // Both outcomes advance — WorkoutPuzzle handles its own delay/flash first.
  const advance = useCallback(() => {
    setIndex((i) => {
      const next = i + 1;
      if (next >= puzzles.length) {
        setStatus('complete');
        return i;
      }
      return next;
    });
  }, [puzzles.length]);

  const onCorrect = useCallback(() => {
    setRight((r) => r + 1);
    advance();
  }, [advance]);

  const onWrong = useCallback(() => {
    setWrong((w) => w + 1);
    advance();
  }, [advance]);

  const goGym = useCallback(() => {
    sfx(playButtonClick);
    router.push('/box');
  }, [router]);

  const runAgain = useCallback(() => {
    sfx(playButtonClick);
    setRun((n) => n + 1);
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <Shell>
        <CloseButton />
        <div className="flex-1 relative z-10 flex items-center justify-center">
          <p className="text-white/60 text-sm">Building your Fix-It set…</p>
        </div>
      </Shell>
    );
  }

  // ── Sign in / nothing yet / error ─────────────────────────────────────────────
  if (status === 'signin' || status === 'empty' || status === 'error') {
    const copy =
      status === 'signin'
        ? { title: 'Sign in to fix it', body: 'The Fix-It workout is built from your last workout, so we need to know who you are.' }
        : status === 'empty'
          ? { title: 'No workout yet', body: 'Do one Puzzle Boxing workout first. Fix-It builds itself from what you missed.' }
          : { title: 'Could not build your set', body: 'Something went wrong on our side. Give it another go in a moment.' };
    return (
      <Shell>
        <CloseButton />
        <div className={CENTER_SCROLL}>
          <div className="max-w-md mx-auto px-5 py-6 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-chess-blue/25 flex items-center justify-center">
              <Icon path={ICONS.wrench} className="w-9 h-9 text-chess-blue" />
            </div>
            <h1 className="text-2xl font-black text-white">{copy.title}</h1>
            <p className="text-sm text-white/60 max-w-xs">{copy.body}</p>
            {status === 'signin' ? (
              <Link href="/auth/login?redirect=/workout/fixit" className="w-full max-w-xs">
                <button className={BTN_PRIMARY}>Sign in</button>
              </Link>
            ) : status === 'empty' ? (
              <Link href="/workout?from=box" className="w-full max-w-xs">
                <button className={BTN_PRIMARY}>Start a workout</button>
              </Link>
            ) : (
              <button onClick={runAgain} className={`max-w-xs ${BTN_PRIMARY}`}>
                Try again
              </button>
            )}
            <Link href="/box" className="text-sm font-bold text-white/60 hover:text-white underline underline-offset-2">
              Back to the gym
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  // ── Complete ─────────────────────────────────────────────────────────────────
  if (status === 'complete') {
    const total = puzzles.length;
    const clean = wrong === 0;
    return (
      <Shell>
        <CloseButton />
        <div className={CENTER_SCROLL}>
          <div className="max-w-md mx-auto px-5 py-6 flex flex-col items-center text-center gap-5">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${clean ? 'bg-chess-gold/25' : 'bg-chess-green/25'}`}>
              <Icon path={ICONS.check} className={`w-9 h-9 ${clean ? 'text-chess-gold' : 'text-chess-green'}`} />
            </div>
            <h1 className="text-3xl font-black text-white leading-none">
              {right} for {total}
            </h1>
            <p className="text-sm text-white/60 max-w-xs">
              {clean
                ? 'Every one. Those misses are fixed.'
                : `${right} right, ${wrong} to keep working on. This is how it sticks.`}
            </p>
            <div className="w-full max-w-xs flex flex-col gap-3">
              <button onClick={goGym} className={BTN_PRIMARY}>
                Back to the gym
              </button>
              <button onClick={runAgain} className={BTN_SECONDARY}>
                Run it again
              </button>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // ── Solving ──────────────────────────────────────────────────────────────────
  const current = puzzles[index];
  const total = puzzles.length;
  const progressPct = Math.round((index / total) * 100);

  return (
    <Shell>
      <CloseButton />
      {/* Header: title + one-line progress. The current theme lives with the
          board below, so the header stays two lines and the board sits higher. */}
      <div className="relative z-10 shrink-0 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="max-w-md mx-auto w-full px-16 min-h-[44px] flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-white leading-tight">Focused Workout</span>
          <span className="text-xs font-semibold text-white/60">
            {index + 1} of {total} · no timer, no score
          </span>
        </div>
        <div className="mt-2 mx-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-chess-blue transition-[width] duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Body: one window; the puzzle column scrolls only if it must. */}
      <div className="flex-1 min-h-0 relative z-10 flex flex-col overflow-y-auto ring-scroll">
        <div className="max-w-md md:max-w-2xl mx-auto w-full flex-1 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col justify-center gap-3">
          {/* The current theme only — one chip, one reason. */}
          <div className="text-center">
            <span className="inline-block text-xs font-black uppercase tracking-wide px-3 py-1 rounded-full bg-chess-blue text-white">
              {current?.slotLabel}
            </span>
            {current?.slotReason && (
              <p className="text-xs text-white/60 mt-1">{current.slotReason}</p>
            )}
          </div>
          {current && (
            <WorkoutPuzzle
              key={`${current.puzzleId || current.id}-${index}`}
              puzzle={current}
              onCorrect={onCorrect}
              onWrong={onWrong}
            />
          )}
        </div>
      </div>
    </Shell>
  );
}
