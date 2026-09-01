'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { MissReplay } from '@/components/workout/MissReplay';
import { useMissAnalysis } from '@/hooks/useMissAnalysis';
import type { WorkoutPuzzleData } from '@/components/workout/WorkoutPuzzle';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { playButtonClick } from '@/lib/sounds';

/**
 * /workout/report/[id] — the interactive post-workout report.
 *
 * Step through each miss on a board (red = what you played, green = the
 * answer, the line auto-plays, Rookie explains), then "what these have in
 * common", then "why these 10" — which hands into /workout/fixit.
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

interface FixitSlot {
  label: string;
  reason: string;
  count: number;
}

type Status = 'loading' | 'signin' | 'notfound' | 'error' | 'ready';
type Screen = { kind: 'miss'; index: number } | { kind: 'pattern' } | { kind: 'why' };

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

  // Fix-It slots for the "why these 10" screen — fetched lazily once needed.
  const [slots, setSlots] = useState<FixitSlot[] | null>(null);
  const [slotsStatus, setSlotsStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

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

  // "Why these 10" needs the Fix-It set — pull it when the user gets there.
  useEffect(() => {
    if (screen.kind !== 'why' || slotsStatus !== 'idle') return;
    let cancelled = false;
    setSlotsStatus('loading');
    fetch('/api/workout/fixit', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setSlotsStatus('error');
          return;
        }
        if (Array.isArray(data.slots)) {
          setSlots(
            data.slots.map((s: Partial<FixitSlot>) => ({
              label: String(s?.label ?? ''),
              reason: String(s?.reason ?? ''),
              count: typeof s?.count === 'number' ? s.count : 0,
            })),
          );
        } else if (Array.isArray(data.targets)) {
          // Race with the slots rollout — fall back to bare labels.
          setSlots(data.targets.map((t: string) => ({ label: String(t), reason: '', count: 0 })));
        } else {
          setSlots([]);
        }
        setSlotsStatus('done');
      });
    return () => {
      cancelled = true;
    };
  }, [screen.kind, slotsStatus]);

  const total = analyses.length;

  const next = useCallback(() => {
    playButtonClick();
    setScreen((s) => {
      if (s.kind === 'miss') return s.index + 1 < total ? { kind: 'miss', index: s.index + 1 } : { kind: 'pattern' };
      if (s.kind === 'pattern') return { kind: 'why' };
      return s;
    });
  }, [total]);

  const back = useCallback(() => {
    playButtonClick();
    setScreen((s) => {
      if (s.kind === 'miss') return s.index > 0 ? { kind: 'miss', index: s.index - 1 } : s;
      if (s.kind === 'pattern') return { kind: 'miss', index: Math.max(0, total - 1) };
      return { kind: 'pattern' };
    });
  }, [total]);

  const startFixit = useCallback(() => {
    playButtonClick();
    router.push('/workout/fixit');
  }, [router]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="h-full overflow-auto bg-chess-page flex items-center justify-center">
        <p className="text-chess-text-muted text-sm">Opening your report…</p>
      </div>
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
      <div className="h-full overflow-auto bg-chess-page">
        <div className="max-w-md mx-auto w-full px-5 py-16 flex flex-col items-center text-center gap-5">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${signin ? 'bg-chess-blue/15' : 'bg-chess-green/15'}`}>
            <Icon path={signin ? ICONS.chart : ICONS.check} className={`w-9 h-9 ${signin ? 'text-chess-blue' : 'text-chess-green'}`} />
          </div>
          <h1 className="text-2xl font-black text-chess-text">
            {signin ? 'Sign in to see your report' : notfound ? 'Not your workout' : 'Nothing to report'}
          </h1>
          {!signin && !notfound && (
            <p className="text-[11px] text-chess-text-faint">
              {reason || (report.status === 'error' ? 'could not rebuild the missed positions' : '')}
            </p>
          )}
          <p className="text-sm text-chess-text-muted max-w-xs">
            {signin
              ? 'Your report is built from your own workout, so we need to know who you are.'
              : notfound
                ? "This workout was saved on a different account than the one you're signed in with. Switch accounts, or open the report from your profile."
                : 'There are no missed puzzles for this workout — nice and clean.'}
          </p>
          {signin ? (
            <Link href={`/auth/login?redirect=/workout/report/${id ?? ''}`} className="w-full max-w-xs">
              <button className="w-full min-h-[44px] rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-4 shadow-sm transition">
                Sign in
              </button>
            </Link>
          ) : (
            <Link href="/profile" className="w-full max-w-xs">
              <button className="w-full min-h-[44px] rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-4 shadow-sm transition">
                Back to profile
              </button>
            </Link>
          )}
          <Link href="/box" className="text-sm font-bold text-chess-text-muted underline underline-offset-2">
            Back to the gym
          </Link>
        </div>
      </div>
    );
  }

  // Engine still reconstructing (only before the first analysis lands).
  if (total === 0) {
    return (
      <div className="h-full overflow-auto bg-chess-page flex items-center justify-center">
        <p className="text-chess-text-muted text-sm">Setting up the board…</p>
      </div>
    );
  }

  // ── Header pieces ────────────────────────────────────────────────────────────
  const stepTitle =
    screen.kind === 'miss' ? `Miss ${screen.index + 1} of ${total}` : screen.kind === 'pattern' ? 'The pattern' : 'Fix-It';
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
              active ? 'w-5 bg-chess-blue' : passed ? 'w-2 bg-chess-blue/60' : 'w-2 bg-slate-200'
            }`}
          />
        );
      })}
      <span className="mx-1 text-chess-text-faint text-xs">·</span>
      <span className={`text-[11px] font-black ${screen.kind === 'pattern' ? 'text-chess-blue' : 'text-chess-text-faint'}`}>Pattern</span>
      <span className="mx-1 text-chess-text-faint text-xs">·</span>
      <span className={`text-[11px] font-black ${screen.kind === 'why' ? 'text-chess-blue' : 'text-chess-text-faint'}`}>Fix-It</span>
    </div>
  );

  // ── Body per screen ──────────────────────────────────────────────────────────
  let body: React.ReactNode;

  if (screen.kind === 'miss') {
    const a = analyses[screen.index];
    body = (
      <>
        <MissReplay key={`${a.puzzleId}-${screen.index}`} analysis={a} line={lines[screen.index]} lineLoading={lineLoading} />
        <div className="flex gap-3">
          {screen.index > 0 && (
            <button
              onClick={back}
              className="min-h-[44px] px-5 rounded-2xl bg-chess-surface border-2 border-slate-200 hover:border-chess-blue text-chess-text font-black transition"
            >
              Back
            </button>
          )}
          <button
            onClick={next}
            className="flex-1 min-h-[44px] rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-3.5 shadow-sm transition"
          >
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
        <div className="text-center">
          <h1 className="text-2xl font-black text-chess-text leading-tight">What these have in common</h1>
          <p className="text-xs font-semibold text-chess-text-muted mt-1">
            {session?.correct ?? 0} right · {total} missed
          </p>
        </div>

        <div className="rounded-2xl bg-chess-surface border border-slate-200 px-4 py-4">
          <p className="text-[11px] font-black uppercase tracking-wide text-chess-text-faint mb-1.5">Rookie</p>
          {diagnosis ? (
            <p className="text-base text-chess-text leading-snug">{diagnosis}</p>
          ) : lineLoading ? (
            <div className="space-y-1.5" aria-label="Rookie is looking…">
              <div className="h-3.5 rounded bg-slate-100 animate-pulse w-full" />
              <div className="h-3.5 rounded bg-slate-100 animate-pulse w-10/12" />
              <div className="h-3.5 rounded bg-slate-100 animate-pulse w-1/2" />
            </div>
          ) : (
            <p className="text-sm text-chess-text-muted">Rookie couldn’t put a name on it this time — the numbers below still tell the story.</p>
          )}
        </div>

        {weakest.length > 0 && (
          <div className="rounded-2xl bg-chess-surface border border-slate-200 overflow-hidden">
            <p className="px-4 pt-3 pb-1 text-[11px] font-black uppercase tracking-wide text-chess-red">Needs work</p>
            {weakest.map((t) => (
              <ThemeRow key={t.theme} stat={t} tone="weak" />
            ))}
          </div>
        )}
        {strongest.length > 0 && (
          <div className="rounded-2xl bg-chess-surface border border-slate-200 overflow-hidden">
            <p className="px-4 pt-3 pb-1 text-[11px] font-black uppercase tracking-wide text-chess-green-dark">Solid</p>
            {strongest.map((t) => (
              <ThemeRow key={t.theme} stat={t} tone="strong" />
            ))}
          </div>
        )}
        {weakest.length === 0 && strongest.length === 0 && !lineLoading && (
          <p className="text-center text-sm text-chess-text-muted">
            A few more workouts and we’ll have enough to show your strongest and weakest themes.
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={back}
            className="min-h-[44px] px-5 rounded-2xl bg-chess-surface border-2 border-slate-200 hover:border-chess-blue text-chess-text font-black transition"
          >
            Back
          </button>
          <button
            onClick={next}
            className="flex-1 min-h-[44px] rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-3.5 shadow-sm transition"
          >
            Why these 10 →
          </button>
        </div>
      </>
    );
  } else {
    body = (
      <>
        <div className="text-center">
          <h1 className="text-2xl font-black text-chess-text leading-tight">Why these 10</h1>
          <p className="text-xs font-semibold text-chess-text-muted mt-1">
            Your Fix-It set is built from today’s misses and your blind spots.
          </p>
        </div>

        {slotsStatus === 'loading' || slotsStatus === 'idle' ? (
          <div className="space-y-2" aria-label="Building your set…">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-chess-surface border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : slots && slots.length > 0 ? (
          <div className="flex flex-col gap-2">
            {slots.map((s, i) => (
              <div key={`${s.label}-${i}`} className="rounded-2xl bg-chess-surface border border-slate-200 px-4 py-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-chess-text leading-tight">{s.label}</p>
                  {s.reason && <p className="text-xs text-chess-text-muted mt-0.5 leading-snug">{s.reason}</p>}
                </div>
                {s.count > 0 && (
                  <span className="shrink-0 text-xs font-black text-chess-blue bg-chess-blue/10 rounded-full px-2 py-0.5 tabular-nums">
                    ×{s.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-chess-text-muted">
            Your set is ready — 10 puzzles aimed at what you missed today.
          </p>
        )}

        <button
          onClick={startFixit}
          className="w-full min-h-[44px] rounded-2xl bg-chess-green hover:bg-chess-green-dark text-white font-black text-xl py-4 shadow-sm transition inline-flex items-center justify-center gap-2"
        >
          <Icon path={ICONS.wrench} className="w-5 h-5" />
          Start Fix-It
        </button>
        <div className="flex items-center justify-between">
          <button onClick={back} className="min-h-[44px] px-2 text-sm font-bold text-chess-text-muted underline underline-offset-2">
            Back
          </button>
          <Link
            href={`/workout/review/${id}`}
            className="min-h-[44px] px-2 inline-flex items-center text-sm font-bold text-chess-blue hover:text-chess-blue-dark underline underline-offset-2"
          >
            Replay my misses
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="h-full overflow-auto bg-chess-page flex flex-col">
      {/* Header: close + step dots */}
      <div className="bg-chess-surface border-b border-slate-200">
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 py-3 flex items-center justify-between gap-3">
          <Link
            href="/box"
            className="w-11 h-11 -ml-2 rounded-xl flex items-center justify-center text-chess-text-muted hover:bg-chess-page transition"
            aria-label="Back to the gym"
          >
            <Icon path={ICONS.close} className="w-5 h-5" />
          </Link>
          <div className="flex flex-col items-center gap-1 min-w-0">
            <span className="text-sm font-bold text-chess-text leading-tight">Your report</span>
            {dots}
          </div>
          <div className="w-11 h-11" aria-hidden />
        </div>
        {report.status === 'engine' && (
          <div className="h-1.5 bg-slate-100">
            <div className="h-full bg-chess-blue transition-[width] duration-300 ease-out" style={{ width: `${enginePct}%` }} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col">
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-5 flex flex-col gap-4 pb-8">{body}</div>
      </div>
    </div>
  );
}

function ThemeRow({ stat, tone }: { stat: { theme: string; accuracy: number; attempts: number }; tone: 'weak' | 'strong' }) {
  const pct = Math.round(stat.accuracy <= 1 ? stat.accuracy * 100 : stat.accuracy);
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-t border-slate-100">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-chess-text leading-tight truncate">{prettyTheme(stat.theme)}</p>
        <p className="text-xs text-chess-text-muted">{stat.attempts} {stat.attempts === 1 ? 'attempt' : 'attempts'}</p>
      </div>
      <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden shrink-0">
        <div className={`h-full ${tone === 'weak' ? 'bg-chess-red' : 'bg-chess-green'}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-sm font-black tabular-nums w-11 text-right ${tone === 'weak' ? 'text-chess-red' : 'text-chess-green-dark'}`}>{pct}%</span>
    </div>
  );
}
