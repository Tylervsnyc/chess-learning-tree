'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkoutPuzzle, type WorkoutPuzzleData } from '@/components/workout/WorkoutPuzzle';
import { playButtonClick } from '@/lib/sounds';

/**
 * /workout/fixit — the Fix-It workout (learn-from-mistakes, layer 3).
 *
 * 10 remedial puzzles built from the user's LAST workout: the themes they
 * missed + their skill-profile blind spots (/api/workout/fixit). Untimed and
 * unscored — like /workout/review, we advance on BOTH right and wrong so the
 * user always keeps moving (momentum over perfection). The only score is a
 * "10 for 10" style tally at the end.
 */

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
  const [targets, setTargets] = useState<string[]>([]);
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
        setTargets(Array.isArray(data.targets) ? data.targets : []);
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
    playButtonClick();
    router.push('/box');
  }, [router]);

  const runAgain = useCallback(() => {
    playButtonClick();
    setRun((n) => n + 1);
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="h-full overflow-auto bg-chess-page flex items-center justify-center">
        <p className="text-chess-text-muted text-sm">Building your Fix-It set…</p>
      </div>
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
      <div className="h-full overflow-auto bg-chess-page">
        <div className="max-w-md mx-auto px-5 py-16 flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-chess-blue/15 flex items-center justify-center">
            <Icon path={ICONS.wrench} className="w-9 h-9 text-chess-blue" />
          </div>
          <h1 className="text-2xl font-black text-chess-text">{copy.title}</h1>
          <p className="text-sm text-chess-text-muted max-w-xs">{copy.body}</p>
          {status === 'signin' ? (
            <Link href="/auth/login?redirect=/workout/fixit" className="w-full max-w-xs">
              <button className="w-full min-h-[44px] rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-4 shadow-sm transition">
                Sign in
              </button>
            </Link>
          ) : status === 'empty' ? (
            <Link href="/workout?from=box" className="w-full max-w-xs">
              <button className="w-full min-h-[44px] rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-4 shadow-sm transition">
                Start a workout
              </button>
            </Link>
          ) : (
            <button
              onClick={runAgain}
              className="w-full max-w-xs min-h-[44px] rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-4 shadow-sm transition"
            >
              Try again
            </button>
          )}
          <Link href="/box" className="text-sm font-bold text-chess-text-muted underline underline-offset-2">
            Back to the gym
          </Link>
        </div>
      </div>
    );
  }

  // ── Complete ─────────────────────────────────────────────────────────────────
  if (status === 'complete') {
    const total = puzzles.length;
    const clean = wrong === 0;
    return (
      <div className="h-full overflow-auto bg-chess-page">
        <div className="max-w-md mx-auto px-5 py-16 flex flex-col items-center text-center gap-5">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${clean ? 'bg-chess-gold/15' : 'bg-chess-green/15'}`}>
            <Icon path={ICONS.check} className={`w-9 h-9 ${clean ? 'text-chess-gold-dark' : 'text-chess-green'}`} />
          </div>
          <h1 className="text-3xl font-black text-chess-text leading-none">
            {right} for {total}
          </h1>
          <p className="text-sm text-chess-text-muted max-w-xs">
            {clean
              ? 'Every one. Those misses are fixed.'
              : `${right} right, ${wrong} to keep working on. This is how it sticks.`}
          </p>
          <div className="w-full max-w-xs flex flex-col gap-3">
            <button
              onClick={goGym}
              className="w-full min-h-[44px] rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-4 shadow-sm transition"
            >
              Back to the gym
            </button>
            <button
              onClick={runAgain}
              className="w-full min-h-[44px] rounded-2xl bg-chess-surface border-2 border-slate-200 hover:border-chess-blue text-chess-text font-black text-lg py-4 transition"
            >
              Run it again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Solving ──────────────────────────────────────────────────────────────────
  const current = puzzles[index];
  const total = puzzles.length;
  const progressPct = Math.round((index / total) * 100);

  return (
    <div className="h-full overflow-auto bg-chess-page flex flex-col">
      {/* Header: close + title + progress */}
      <div className="bg-chess-surface border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link
            href="/box"
            className="w-11 h-11 -ml-2 rounded-xl flex items-center justify-center text-chess-text-muted hover:bg-chess-page transition"
            aria-label="Back to the gym"
          >
            <Icon path={ICONS.close} className="w-5 h-5" />
          </Link>
          <div className="flex flex-col items-center min-w-0">
            <span className="text-sm font-bold text-chess-text leading-tight">Fix-It workout</span>
            <span className="text-xs font-semibold text-chess-text-muted">
              Built from your last workout · {index + 1} of {total}
            </span>
          </div>
          {/* Spacer to balance the close button */}
          <div className="w-11 h-11" aria-hidden />
        </div>
        {targets.length > 0 && (
          <div className="max-w-md mx-auto px-4 pb-3 flex flex-wrap justify-center gap-1.5">
            {targets.map((t) => (
              <span
                key={t}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  current?.slotLabel === t
                    ? 'bg-chess-blue text-white border-chess-blue'
                    : 'bg-chess-page text-chess-text-muted border-slate-200'
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="h-1.5 bg-slate-100">
          <div
            className="h-full bg-chess-blue transition-[width] duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col">
        <div className="max-w-md md:max-w-2xl mx-auto w-full px-4 py-5 flex flex-col gap-4">
          <div className="text-center">
            <p className="text-base font-black text-chess-text">{current?.slotLabel}</p>
            {current?.slotReason && (
              <p className="text-xs text-chess-text-muted">{current.slotReason}</p>
            )}
            <p className="text-xs font-semibold text-chess-text-muted">
              Find the best move — no timer, no score.
            </p>
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
    </div>
  );
}
