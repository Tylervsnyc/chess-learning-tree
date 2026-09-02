'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { MissReplay } from '@/components/workout/MissReplay';
import { useMissAnalysis } from '@/hooks/useMissAnalysis';
import type { WorkoutPuzzleData } from '@/components/workout/WorkoutPuzzle';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { ArenaScene } from '@/components/chessboxing/Arena';
import { FullBleedShell } from '@/components/chessboxing/FullBleedShell';
import { isSoundEnabled, playBoxingBell, playButtonClick } from '@/lib/sounds';

/**
 * /workout/report/[id] — the interactive post-workout report.
 *
 * Step through each miss on a board (red = what you played, green = the
 * answer, the line auto-plays, Rookie explains), then "what these have in
 * common", then the Focused Workout button — which hands into /workout/fixit.
 *
 * Chess Boxing feature → ALWAYS the dark box shell (arena backdrop, white
 * text, one fixed window, no page scroll). Web users get the same screen.
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
  'flex-1 min-h-[44px] rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-3.5 shadow-[0_4px_0_0_#0d7ec4] active:translate-y-[2px] active:shadow-none transition';
const BTN_SECONDARY =
  'min-h-[44px] px-5 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 text-white font-black active:translate-y-[2px] transition';
const CARD = 'rounded-2xl bg-white/[0.07] border border-white/15';

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
  chart: <path d="M3 3v18h18M7 14l4-4 4 4 5-6" />,
} as const;

interface SessionReview {
  missedPuzzles: WorkoutPuzzleData[];
  points: number;
  correct: number;
  wrong: number;
  perfect: boolean;
  createdAt: string;
}

type Status = 'loading' | 'signin' | 'notfound' | 'error' | 'ready';
type Screen = { kind: 'miss'; index: number } | { kind: 'pattern' };

/** "hangingPiece" → "Hanging piece", "mateIn2" → "Mate in 2". */
function prettyTheme(theme: string): string {
  const spaced = theme
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    .replace(/([0-9])([A-Za-z])/g, '$1 $2')
    .toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export default function WorkoutReportPage() {
  if (!FEATURE_FLAGS.WORKOUT_REPORT) notFound();

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? null;

  const [status, setStatus] = useState<Status>('loading');
  // Why we landed on the empty screen — shown in faint text so a report of
  // "nothing to report" is diagnosable from a screenshot.
  const [reason, setReason] = useState<string>('');
  const [session, setSession] = useState<SessionReview | null>(null);
  const [screen, setScreen] = useState<Screen>({ kind: 'miss', index: 0 });

  useEffect(() => {
    if (!id) {
      setReason('no session id in the URL');
      setStatus('error');
      return;
    }
    let cancelled = false;
    fetch(`/api/workout/sessions/${id}`, { cache: 'no-store' })
      .then(async (r) => {
        if (r.status === 401) return 'signin' as const;
        if (r.status === 404) return 'notfound' as const;
        if (!r.ok) {
          setReason(`session API returned ${r.status}`);
          return null;
        }
        return (await r.json()) as SessionReview;
      })
      .catch((e: unknown) => {
        setReason(`session fetch failed: ${e instanceof Error ? e.message : String(e)}`);
        return null;
      })
      .then((data) => {
        if (cancelled) return;
        if (data === 'signin') {
          setStatus('signin');
          return;
        }
        if (data === 'notfound') {
          setStatus('notfound');
          return;
        }
        const missed = Array.isArray(data?.missedPuzzles) ? data.missedPuzzles : [];
        if (!data || missed.length === 0) {
          if (data) setReason('session has no missed puzzles');
          setStatus('error');
          return;
        }
        setSession({ ...data, missedPuzzles: missed });
        setScreen({ kind: 'miss', index: 0 });
        setStatus('ready');
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const missed = useMemo(() => session?.missedPuzzles ?? null, [session]);
  const report = useMissAnalysis(missed, id);
  const { analyses, lines, diagnosis, profile } = report;
  const lineLoading = report.status === 'engine' || report.status === 'rookie';

  const total = analyses.length;

  const next = useCallback(() => {
    sfx(playButtonClick);
    setScreen((s) => {
      if (s.kind === 'miss') return s.index + 1 < total ? { kind: 'miss', index: s.index + 1 } : { kind: 'pattern' };
      return s;
    });
  }, [total]);

  const back = useCallback(() => {
    sfx(playButtonClick);
    setScreen((s) => {
      if (s.kind === 'miss') return s.index > 0 ? { kind: 'miss', index: s.index - 1 } : s;
      return { kind: 'miss', index: Math.max(0, total - 1) };
    });
  }, [total]);

  // Ding ding — the bell is the hand-off into the Fix-It round. Navigate a
  // beat later so it's actually heard before the page swaps.
  const startFixit = useCallback(() => {
    sfx(playBoxingBell);
    window.setTimeout(() => router.push('/workout/fixit'), 250);
  }, [router]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <Shell>
        <CloseButton />
        <div className="flex-1 relative z-10 flex items-center justify-center">
          <p className="text-white/60 text-sm">Opening your report…</p>
        </div>
      </Shell>
    );
  }

  // ── Sign in / nothing to report ──────────────────────────────────────────────
  if (
    status === 'signin' ||
    status === 'notfound' ||
    status === 'error' ||
    (status === 'ready' && report.status === 'error' && analyses.length === 0)
  ) {
    const signin = status === 'signin';
    const notfound = status === 'notfound';
    return (
      <Shell>
        <CloseButton />
        <div className="flex-1 min-h-0 relative z-10 overflow-y-auto ring-scroll pt-[max(4rem,calc(env(safe-area-inset-top)+3.5rem))] pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="max-w-md mx-auto w-full px-5 py-6 flex flex-col items-center text-center gap-5">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${signin ? 'bg-chess-blue/25' : 'bg-chess-green/25'}`}>
              <Icon path={signin ? ICONS.chart : ICONS.check} className={`w-9 h-9 ${signin ? 'text-chess-blue' : 'text-chess-green'}`} />
            </div>
            <h1 className="text-2xl font-black text-white">
              {signin ? 'Sign in to see your report' : notfound ? 'Not your workout' : 'Nothing to report'}
            </h1>
            {!signin && !notfound && (
              <p className="text-[11px] text-white/45">
                {reason || (report.status === 'error' ? 'could not rebuild the missed positions' : '')}
              </p>
            )}
            <p className="text-sm text-white/60 max-w-xs">
              {signin
                ? 'Your report is built from your own workout, so we need to know who you are.'
                : notfound
                  ? "This workout was saved on a different account than the one you're signed in with. Switch accounts, or open the report from your profile."
                  : 'There are no missed puzzles for this workout — nice and clean.'}
            </p>
            {signin ? (
              <Link href={`/auth/login?redirect=/workout/report/${id ?? ''}`} className="w-full max-w-xs">
                <button className={`w-full ${BTN_PRIMARY} py-4`}>Sign in</button>
              </Link>
            ) : (
              <Link href="/profile" className="w-full max-w-xs">
                <button className={`w-full ${BTN_PRIMARY} py-4`}>Back to profile</button>
              </Link>
            )}
            <Link href="/box" className="text-sm font-bold text-white/60 hover:text-white underline underline-offset-2">
              Back to the gym
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  // Engine still reconstructing (only before the first analysis lands).
  if (total === 0) {
    return (
      <Shell>
        <CloseButton />
        <div className="flex-1 relative z-10 flex items-center justify-center">
          <p className="text-white/60 text-sm">Setting up the board…</p>
        </div>
      </Shell>
    );
  }

  // ── Header pieces ────────────────────────────────────────────────────────────
  const stepTitle =
    screen.kind === 'miss' ? `Miss ${screen.index + 1} of ${total}` : 'The pattern';
  const enginePct = Math.round(report.progress * 100);

  const dots = (
    <div className="flex items-center justify-center gap-1.5 flex-wrap" aria-label={stepTitle}>
      {analyses.map((a, i) => {
        const active = screen.kind === 'miss' && screen.index === i;
        const passed = screen.kind !== 'miss' || screen.index > i;
        return (
          <span
            key={`${a.puzzleId}-${i}`}
            className={`h-2 rounded-full transition-all ${
              active ? 'w-5 bg-chess-blue' : passed ? 'w-2 bg-chess-blue/60' : 'w-2 bg-white/20'
            }`}
          />
        );
      })}
      <span className="mx-1 text-white/40 text-xs">·</span>
      <span className={`text-[11px] font-black ${screen.kind === 'pattern' ? 'text-chess-blue' : 'text-white/45'}`}>Pattern</span>
    </div>
  );

  // ── Body per screen ──────────────────────────────────────────────────────────
  let body: React.ReactNode;

  if (screen.kind === 'miss') {
    const a = analyses[screen.index];
    body = (
      <>
        {/* Board pinned, everything under it scrolls (inside MissReplay); the
            Next/Back row is always on screen. */}
        <MissReplay key={`${a.puzzleId}-${screen.index}`} analysis={a} line={lines[screen.index]} lineLoading={lineLoading} />
        <div className="flex gap-3 shrink-0">
          {screen.index > 0 && (
            <button onClick={back} className={BTN_SECONDARY}>
              Back
            </button>
          )}
          <button onClick={next} className={BTN_PRIMARY}>
            {screen.index + 1 < total ? 'Next →' : 'What these have in common →'}
          </button>
        </div>
      </>
    );
  } else if (screen.kind === 'pattern') {
    const weakest = profile?.weakest?.slice(0, 3) ?? [];
    const strongest = profile?.strongest?.slice(0, 2) ?? [];
    body = (
      <>
        <div className="flex-1 min-h-0 overflow-y-auto ring-scroll flex flex-col gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-black text-white leading-tight">What these have in common</h1>
            <p className="text-xs font-semibold text-white/60 mt-1">
              {session?.correct ?? 0} right · {total} missed
            </p>
          </div>

          <div className={`${CARD} px-4 py-4`}>
            <p className="text-[11px] font-black uppercase tracking-wide text-white/50 mb-1.5">Rookie</p>
            {diagnosis ? (
              <p className="text-base text-white leading-snug">{diagnosis}</p>
            ) : lineLoading ? (
              <div className="space-y-1.5" aria-label="Rookie is looking…">
                <div className="h-3.5 rounded bg-white/10 animate-pulse w-full" />
                <div className="h-3.5 rounded bg-white/10 animate-pulse w-10/12" />
                <div className="h-3.5 rounded bg-white/10 animate-pulse w-1/2" />
              </div>
            ) : (
              <p className="text-sm text-white/60">Rookie couldn’t put a name on it this time — the numbers below still tell the story.</p>
            )}
          </div>

          {weakest.length > 0 && (
            <div className={`${CARD} overflow-hidden`}>
              <p className="px-4 pt-3 pb-1 text-[11px] font-black uppercase tracking-wide text-chess-red">Needs work</p>
              {weakest.map((t) => (
                <ThemeRow key={t.theme} stat={t} tone="weak" />
              ))}
            </div>
          )}
          {strongest.length > 0 && (
            <div className={`${CARD} overflow-hidden`}>
              <p className="px-4 pt-3 pb-1 text-[11px] font-black uppercase tracking-wide text-chess-green">Solid</p>
              {strongest.map((t) => (
                <ThemeRow key={t.theme} stat={t} tone="strong" />
              ))}
            </div>
          )}
          {weakest.length === 0 && strongest.length === 0 && !lineLoading && (
            <p className="text-center text-sm text-white/60">
              A few more workouts and we’ll have enough to show your strongest and weakest themes.
            </p>
          )}
        </div>

        <div className="shrink-0 flex flex-col gap-2">
          <button
            onClick={startFixit}
            className="w-full min-h-[44px] rounded-2xl bg-chess-green hover:bg-chess-green-dark text-white font-black text-xl py-4 shadow-[0_4px_0_0_#3d8c01] active:translate-y-[2px] active:shadow-none transition inline-flex items-center justify-center gap-2"
          >
            <Icon path={ICONS.wrench} className="w-5 h-5" />
            Focused Workout
          </button>
          <div className="flex items-center justify-between">
            <button onClick={back} className="min-h-[44px] px-2 text-sm font-bold text-white/60 hover:text-white underline underline-offset-2">
              Back
            </button>
            <Link
              href={`/workout/review/${id}`}
              className="min-h-[44px] px-2 inline-flex items-center text-sm font-bold text-chess-blue hover:text-white underline underline-offset-2"
            >
              Replay my misses
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <Shell>
      <CloseButton />
      {/* Header: title + step dots (the X lives in the arena back-button slot) */}
      <div className="relative z-10 shrink-0 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="max-w-md md:max-w-lg mx-auto w-full px-16 min-h-[44px] flex flex-col items-center justify-center gap-1">
          <span className="text-sm font-bold text-white leading-tight">Your report</span>
          {dots}
        </div>
        {report.status === 'engine' && (
          <div className="mt-2 mx-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-chess-blue transition-[width] duration-300 ease-out" style={{ width: `${enginePct}%` }} />
          </div>
        )}
      </div>

      {/* Body: ONE fixed window (native-shell rule). Each screen decides what
          scrolls inside it — the board never does. */}
      <div className="flex-1 min-h-0 relative z-10 flex flex-col">
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] flex-1 min-h-0 flex flex-col gap-3">
          {body}
        </div>
      </div>
    </Shell>
  );
}

function ThemeRow({ stat, tone }: { stat: { theme: string; accuracy: number; attempts: number }; tone: 'weak' | 'strong' }) {
  const pct = Math.round(stat.accuracy <= 1 ? stat.accuracy * 100 : stat.accuracy);
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-t border-white/10">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white leading-tight truncate">{prettyTheme(stat.theme)}</p>
        <p className="text-xs text-white/60">{stat.attempts} {stat.attempts === 1 ? 'attempt' : 'attempts'}</p>
      </div>
      <div className="w-20 h-2 rounded-full bg-white/10 overflow-hidden shrink-0">
        <div className={`h-full ${tone === 'weak' ? 'bg-chess-red' : 'bg-chess-green'}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-sm font-black tabular-nums w-11 text-right ${tone === 'weak' ? 'text-chess-red' : 'text-chess-green'}`}>{pct}%</span>
    </div>
  );
}
