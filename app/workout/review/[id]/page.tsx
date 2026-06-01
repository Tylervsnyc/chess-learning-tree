'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { WorkoutPuzzle, type WorkoutPuzzleData } from '@/components/workout/WorkoutPuzzle';
import { playButtonClick } from '@/lib/sounds';

/**
 * /workout/review/[id] — practice the puzzles you missed in a workout session.
 *
 * No timer, no scoring — this is a calm, second-chance practice run. We fetch
 * the session's missed puzzles, step through them one at a time, and advance on
 * BOTH correct and wrong (WorkoutPuzzle already delays/flashes internally), so
 * the user always keeps moving forward (RULES.md design principle: momentum).
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
} as const;

interface SessionReview {
  missedPuzzles: WorkoutPuzzleData[];
  points: number;
  correct: number;
  wrong: number;
  perfect: boolean;
  createdAt: string;
}

type Status = 'loading' | 'error' | 'reviewing' | 'complete';

export default function WorkoutReviewPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [status, setStatus] = useState<Status>('loading');
  const [puzzles, setPuzzles] = useState<WorkoutPuzzleData[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!id) {
      setStatus('error');
      return;
    }
    let cancelled = false;
    fetch(`/api/workout/sessions/${id}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((data: SessionReview | null) => {
        if (cancelled) return;
        const missed = Array.isArray(data?.missedPuzzles) ? data.missedPuzzles : [];
        if (!data || missed.length === 0) {
          setStatus('error');
          return;
        }
        setPuzzles(missed);
        setIndex(0);
        setStatus('reviewing');
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

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

  const goProfile = useCallback(() => {
    playButtonClick();
    router.push('/profile');
  }, [router]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="h-full overflow-auto bg-chess-page flex items-center justify-center">
        <p className="text-chess-text-muted text-sm">Loading your missed puzzles…</p>
      </div>
    );
  }

  // ── Nothing to review / error ────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="h-full overflow-auto bg-chess-page">
        <div className="max-w-md mx-auto px-5 py-16 flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-chess-green/15 flex items-center justify-center">
            <Icon path={ICONS.check} className="w-9 h-9 text-chess-green" />
          </div>
          <h1 className="text-2xl font-black text-chess-text">Nothing to review</h1>
          <p className="text-sm text-chess-text-muted max-w-xs">
            There are no missed puzzles for this workout — nice and clean.
          </p>
          <Link href="/profile" className="w-full max-w-xs">
            <button className="w-full rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-4 shadow-sm transition">
              Back to profile
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Complete ─────────────────────────────────────────────────────────────────
  if (status === 'complete') {
    return (
      <div className="h-full overflow-auto bg-chess-page">
        <div className="max-w-md mx-auto px-5 py-16 flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-chess-gold/15 flex items-center justify-center">
            <Icon path={ICONS.check} className="w-9 h-9 text-chess-gold-dark" />
          </div>
          <h1 className="text-2xl font-black text-chess-text">Review complete</h1>
          <p className="text-sm text-chess-text-muted max-w-xs">
            You ran back through every puzzle you missed. That&apos;s how it sticks.
          </p>
          <button
            onClick={goProfile}
            className="w-full max-w-xs rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-4 shadow-sm transition"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ── Reviewing ────────────────────────────────────────────────────────────────
  const current = puzzles[index];
  const total = puzzles.length;
  const progressPct = Math.round((index / total) * 100);

  return (
    <div className="h-full overflow-auto bg-chess-page flex flex-col">
      {/* Header: close + progress */}
      <div className="bg-chess-surface border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link
            href="/profile"
            className="w-9 h-9 -ml-1.5 rounded-xl flex items-center justify-center text-chess-text-muted hover:bg-chess-page transition"
            aria-label="Back to profile"
          >
            <Icon path={ICONS.close} className="w-5 h-5" />
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-chess-text leading-tight">Review</span>
            <span className="text-xs font-semibold text-chess-text-muted">
              Puzzle {index + 1} of {total}
            </span>
          </div>
          {/* Spacer to balance the close button */}
          <div className="w-9 h-9" aria-hidden />
        </div>
        <div className="h-1.5 bg-slate-100">
          <div
            className="h-full bg-chess-blue transition-[width] duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col">
        <div className="max-w-md mx-auto w-full px-4 py-5 flex flex-col gap-4">
          <p className="text-center text-sm font-semibold text-chess-text-muted">
            Find the best move — no timer, no pressure.
          </p>
          {current && (
            <WorkoutPuzzle
              key={`${current.puzzleId || current.id}-${index}`}
              puzzle={current}
              onCorrect={advance}
              onWrong={advance}
            />
          )}
        </div>
      </div>
    </div>
  );
}
