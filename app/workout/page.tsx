'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutPuzzle, type WorkoutPuzzleData } from '@/components/workout/WorkoutPuzzle';
import {
  buildSchedule,
  labelFor,
  promptFor,
  DURATION_PRESETS,
  ROUND_LENGTH,
  ROUND_SECONDS,
  PERFECT_SESSION_BONUS,
  pointsForCorrect,
  comboMultiplier,
  type Segment,
  type SegmentKind,
} from '@/lib/workout/schedule';
import { warmupAudio, playButtonClick, playBoxingBell, playWoodClap } from '@/lib/sounds';

// ─── Inline icons (lucide-react isn't installed; app uses inline SVGs) ───────

function Icon({
  path,
  className,
}: {
  path: React.ReactNode;
  className?: string;
}) {
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
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  chess: <path d="M9 3a2 2 0 0 1 4 0c0 1 .5 1.5 1.5 1.5H17a1 1 0 0 1 1 1v2.5c0 1 .5 1.5 1.5 1.5a2 2 0 0 1 0 4c-1 0-1.5.5-1.5 1.5V19a1 1 0 0 1-1 1h-3a2 2 0 0 0-4 0H6a1 1 0 0 1-1-1v-2.5C5 15.5 4.5 15 3.5 15a2 2 0 0 1 0-4C4.5 11 5 10.5 5 9.5V7a1 1 0 0 1 1-1h2.5C9.5 6 10 5.5 10 4.5" />,
  dumbbell: (
    <>
      <path d="M6 7v10M9 7v10M15 7v10M18 7v10" />
      <path d="M3 10v4M21 10v4M9 12h6" />
    </>
  ),
  rest: (
    <>
      <path d="M3 18v-2a4 4 0 0 1 4-4h6" />
      <path d="M13 12a4 4 0 1 0 0-8" />
      <path d="M18 8h3M19.5 6.5v3" />
    </>
  ),
  skip: (
    <>
      <path d="m5 4 10 8-10 8V4Z" />
      <path d="M19 5v14" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" />
    </>
  ),
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
} as const;

function iconFor(kind: SegmentKind): keyof typeof ICONS {
  switch (kind) {
    case 'chess':
      return 'chess';
    case 'workout':
      return 'dumbbell';
    case 'break':
      return 'rest';
  }
}

// Light, playful Rookie one-liners for the physical/break segments (she/her).
const ROOKIE_LINES: Record<Exclude<SegmentKind, 'chess'>, string[]> = {
  workout: [
    "I can't do push-ups. No arms. So you're doing them for both of us.",
    "Blood to the muscles, blood to the brain. That's the theory anyway.",
    "I'll just be here, calculating. You move the body parts.",
  ],
  break: [
    "Breathe. Even I need a moment to cool my circuits.",
    "Rest now. The next puzzles won't go easy on you.",
    "Catch your breath. We're not done yet.",
  ],
};

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ─── Circuit progress bar ────────────────────────────────────────────────────
// Shows the whole session as proportional blocks (one per segment), colored by
// kind. In preview mode (no segIndex) it just shows the plan. While running, it
// fills completed segments and animates the current one — an at-a-glance view of
// where you are in the whole circuit.

function colorForKind(kind: SegmentKind): string {
  switch (kind) {
    case 'chess':
      return 'bg-gradient-to-r from-violet-500 to-fuchsia-500';
    case 'workout':
      return 'bg-gradient-to-r from-amber-400 to-orange-500';
    case 'break':
      return 'bg-gradient-to-r from-cyan-300 to-sky-400';
  }
}

function labelForKind(kind: SegmentKind): string {
  switch (kind) {
    case 'chess':
      return 'Chess';
    case 'workout':
      return 'Workout';
    case 'break':
      return 'Rest';
  }
}

function CircuitTimeline({
  segments,
  activeIndex,
  secondsLeft,
}: {
  segments: Segment[];
  activeIndex?: number;
  secondsLeft?: number;
}) {
  const total = segments.reduce((s, seg) => s + seg.seconds, 0) || 1;
  const preview = activeIndex === undefined;

  // Elapsed fraction (0..1) of this round, for the moving playhead.
  let overall = 0;
  if (!preview && activeIndex !== undefined) {
    let elapsed = 0;
    for (let i = 0; i < segments.length; i++) {
      if (i < activeIndex) elapsed += segments[i].seconds;
      else if (i === activeIndex && secondsLeft !== undefined) {
        elapsed += segments[i].seconds - secondsLeft;
      }
    }
    overall = Math.min(1, Math.max(0, elapsed / total));
  }

  return (
    <div className="relative w-full">
      <div className="flex gap-1.5 w-full h-8">
        {segments.map((seg, i) => {
          const widthPct = (seg.seconds / total) * 100;
          let fill = 0; // 0..1, completed fraction of this block
          if (!preview && activeIndex !== undefined) {
            if (i < activeIndex) fill = 1;
            else if (i === activeIndex && secondsLeft !== undefined) {
              fill = seg.seconds > 0 ? (seg.seconds - secondsLeft) / seg.seconds : 0;
            }
          }
          const color = colorForKind(seg.kind);
          return (
            <div
              key={i}
              className="relative h-full rounded-full overflow-hidden"
              style={{ width: `${widthPct}%` }}
            >
              <div className={`absolute inset-0 ${color} ${preview ? '' : 'opacity-25'}`} />
              {!preview && (
                <div
                  className={`absolute inset-y-0 left-0 ${color} transition-[width] duration-1000 ease-linear`}
                  style={{ width: `${fill * 100}%` }}
                />
              )}
              <span
                className={`absolute inset-0 flex items-center justify-center px-0.5 font-black uppercase tracking-wide text-white truncate [text-shadow:0_1px_2px_rgba(0,0,0,0.35)] pointer-events-none ${
                  widthPct < 14 ? 'text-[8px] tracking-normal' : 'text-[10px]'
                }`}
              >
                {labelForKind(seg.kind)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Moving playhead — travels across the round as time ticks down */}
      {!preview && (
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-[left] duration-1000 ease-linear pointer-events-none"
          style={{ left: `${overall * 100}%` }}
        >
          <div className="w-5 h-5 rounded-full bg-white shadow-lg ring-[3px] ring-chess-text/70" />
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-chess-text-muted">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

type Phase = 'setup' | 'running' | 'done';

interface FinishResult {
  sessionPoints: number;
  lifetime: number | null;
  right: number;
  wrong: number;
  perfect: boolean;
}

export default function WorkoutPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>('setup');
  const [minutes, setMinutes] = useState<number>(16);

  const [schedule, setSchedule] = useState<Segment[]>([]);
  const [segIndex, setSegIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const [score, setScore] = useState(0); // raw, can go negative
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [combo, setCombo] = useState(0); // current correct-streak length
  const comboRef = useRef(0); // mirror for stale-closure-free reads in handlers

  const [queue, setQueue] = useState<WorkoutPuzzleData[]>([]);
  const [puzzlePos, setPuzzlePos] = useState(0);

  // Missed puzzles collected this session, stored for later replay.
  const missedRef = useRef<WorkoutPuzzleData[]>([]);

  const [finishResult, setFinishResult] = useState<FinishResult | null>(null);
  const finishingRef = useRef(false);

  const current = schedule[segIndex];

  // ── Finish: post points, show end screen ──────────────────────────────────
  const finishSession = useCallback(async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;

    const perfect = wrong === 0 && right > 0;
    const sessionPoints = Math.max(0, score) + (perfect ? PERFECT_SESSION_BONUS : 0);
    let lifetime: number | null = null;
    try {
      const res = await fetch('/api/workout/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          points: sessionPoints,
          durationMinutes: minutes,
          correct: right,
          wrong,
          perfect,
          missedPuzzles: missedRef.current,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data?.workoutPoints === 'number') lifetime = data.workoutPoints;
      }
    } catch {
      // Network/auth failure — still show the session summary.
    }

    setFinishResult({ sessionPoints, lifetime, right, wrong, perfect });
    setPhase('done');
  }, [score, right, wrong, minutes]);

  // ── Advance to the next segment (or finish) ───────────────────────────────
  const advanceSegment = useCallback(() => {
    // Boxing bell rings at the end of every stage (timer-out or Skip).
    playBoxingBell();
    setSegIndex((i) => {
      const next = i + 1;
      if (next >= schedule.length) {
        finishSession();
        return i;
      }
      setSecondsLeft(schedule[next].seconds);
      return next;
    });
  }, [schedule, finishSession]);

  // ── Begin a session ───────────────────────────────────────────────────────
  const begin = useCallback(() => {
    warmupAudio();
    playButtonClick();
    const sched = buildSchedule(minutes);
    setSchedule(sched);
    setSegIndex(0);
    setSecondsLeft(sched[0]?.seconds ?? 0);
    setScore(0);
    setRight(0);
    setWrong(0);
    setCombo(0);
    comboRef.current = 0;
    setPuzzlePos(0);
    missedRef.current = [];
    setFinishResult(null);
    finishingRef.current = false;
    setPhase('running');

    // Prefetch the ramped puzzle queue.
    fetch(`/api/workout/puzzles?minutes=${minutes}`)
      .then((r) => (r.ok ? r.json() : { puzzles: [] }))
      .then((data) => setQueue(Array.isArray(data?.puzzles) ? data.puzzles : []))
      .catch(() => setQueue([]));
  }, [minutes]);

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'running') return;
    if (secondsLeft <= 0) {
      advanceSegment();
      return;
    }
    // Wood-clap warning when 10 seconds remain in the stage.
    if (secondsLeft === 10) playWoodClap();
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, secondsLeft, advanceSegment]);

  const currentPuzzle = queue[puzzlePos % Math.max(1, queue.length)] as
    | WorkoutPuzzleData
    | undefined;

  const handleCorrect = useCallback(() => {
    const rating = currentPuzzle?.rating ?? 1000;
    const nextStreak = comboRef.current + 1;
    comboRef.current = nextStreak;
    setCombo(nextStreak);
    setScore((s) => s + pointsForCorrect(rating, nextStreak));
    setRight((r) => r + 1);
    setPuzzlePos((p) => p + 1);
  }, [currentPuzzle]);

  const handleWrong = useCallback(() => {
    // Wrong = 0 points; the cost is losing the combo back to ×1.
    comboRef.current = 0;
    setCombo(0);
    setWrong((w) => w + 1);
    // Stash the missed puzzle (replay data) so the user can revisit it later.
    if (currentPuzzle) {
      missedRef.current.push({
        puzzleId: currentPuzzle.puzzleId,
        id: currentPuzzle.id,
        fen: currentPuzzle.fen,
        moves: currentPuzzle.moves,
        rating: currentPuzzle.rating,
      });
    }
    setPuzzlePos((p) => p + 1);
  }, [currentPuzzle]);

  const liveScore = Math.max(0, score);
  const multiplier = comboMultiplier(combo);

  // Preview of the circuit for the chosen duration (setup screen).
  const previewSchedule = useMemo(() => buildSchedule(minutes), [minutes]);
  const previewRounds = Math.max(1, previewSchedule.length / ROUND_LENGTH);

  // Round bookkeeping for the running view.
  const roundCount = Math.max(1, Math.ceil(schedule.length / ROUND_LENGTH));
  const roundIndex = Math.floor(segIndex / ROUND_LENGTH);
  const roundSegments = schedule.slice(
    roundIndex * ROUND_LENGTH,
    roundIndex * ROUND_LENGTH + ROUND_LENGTH,
  );
  const localSegIndex = segIndex % ROUND_LENGTH;

  // ── SETUP ─────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="h-full overflow-auto bg-chess-page">
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-8 flex flex-col gap-6">
          <header className="text-center">
            <h1 className="text-3xl font-black text-chess-text">Interval Workout</h1>
            <p className="text-chess-text-muted mt-2 text-sm leading-relaxed">
              A timed circuit that mixes chess puzzles with quick physical
              bursts. Solve puzzles for points, then move your body, then go
              again.
            </p>
          </header>

          <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-chess-text-muted uppercase tracking-wide">
              How it works
            </h2>
            <p className="text-sm text-chess-text leading-relaxed">
              Combining mental and physical fitness — 3 min of puzzles, a 1 min
              break, 3 min of exercise, a 1 min break. That's one round.
            </p>
            <div>
              <div className="mb-1.5">
                <div className="text-xs font-black text-chess-text uppercase tracking-wide">
                  One round
                  {previewRounds > 1 && (
                    <span className="text-chess-text-muted"> · {previewRounds} total</span>
                  )}
                </div>
                <div className="text-[11px] font-semibold text-chess-text-muted">
                  Chess → Rest → Workout → Rest
                </div>
              </div>
              <CircuitTimeline segments={previewSchedule.slice(0, ROUND_LENGTH)} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold">
              <Legend color={colorForKind('chess')} label="Puzzles" />
              <Legend color={colorForKind('workout')} label="Exercise" />
              <Legend color={colorForKind('break')} label="Break" />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-chess-text-muted uppercase tracking-wide mb-3 text-center">
              How many rounds?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {DURATION_PRESETS.map((m) => {
                const rounds = Math.max(1, Math.round((m * 60) / ROUND_SECONDS));
                return (
                  <button
                    key={m}
                    onClick={() => {
                      playButtonClick();
                      setMinutes(m);
                    }}
                    className={`rounded-2xl border-2 py-4 transition flex flex-col items-center gap-0.5 ${
                      minutes === m
                        ? 'border-chess-blue bg-chess-blue/10 text-chess-blue'
                        : 'border-slate-200 bg-chess-surface text-chess-text'
                    }`}
                  >
                    <span className="font-black text-xl">
                      {rounds} Round{rounds > 1 ? 's' : ''}
                    </span>
                    <span className="text-xs font-semibold text-chess-text-muted">{m} min</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={begin}
            className="w-full rounded-2xl bg-chess-green hover:bg-chess-green-dark text-white font-black text-lg py-4 shadow-sm transition"
          >
            Begin
          </button>
        </div>
      </div>
    );
  }

  // ── DONE ──────────────────────────────────────────────────────────────────
  if (phase === 'done' && finishResult) {
    return (
      <div className="h-full overflow-auto bg-chess-page">
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-10 flex flex-col items-center gap-6 text-center">
          <Icon path={ICONS.trophy} className="w-16 h-16 text-chess-gold" />
          <h1 className="text-3xl font-black text-chess-text">Workout complete</h1>

          <div className="w-full bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
            <div>
              <div className="text-5xl font-black text-chess-green tabular-nums">
                +{finishResult.sessionPoints}
              </div>
              <div className="text-sm font-semibold text-chess-text-muted mt-1">
                points this session
              </div>
            </div>

            {finishResult.perfect && (
              <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-chess-gold">
                <Icon path={ICONS.bolt} className="w-4 h-4" />
                Flawless run · +{PERFECT_SESSION_BONUS} bonus
              </div>
            )}

            {finishResult.lifetime !== null && (
              <div className="text-sm text-chess-text-muted">
                Lifetime total:{' '}
                <span className="font-bold text-chess-text tabular-nums">
                  {finishResult.lifetime.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-center gap-6 pt-2 border-t border-slate-100">
              <div>
                <div className="text-2xl font-black text-chess-green tabular-nums">
                  {finishResult.right}
                </div>
                <div className="text-xs font-semibold text-chess-text-muted">
                  solved
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-chess-red tabular-nums">
                  {finishResult.wrong}
                </div>
                <div className="text-xs font-semibold text-chess-text-muted">
                  missed
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playButtonClick();
              router.push('/profile');
            }}
            className="w-full rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-4 shadow-sm transition"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ── RUNNING ───────────────────────────────────────────────────────────────
  if (!current) {
    return (
      <div className="h-full overflow-auto bg-chess-page flex items-center justify-center">
        <p className="text-chess-text-muted">Loading…</p>
      </div>
    );
  }

  const isChess = current.kind === 'chess';
  const lineSeed = segIndex;

  return (
    <div className="h-full overflow-auto bg-chess-page flex flex-col">
      {/* Header: progress + score + timer */}
      <div className="bg-chess-surface border-b border-slate-200">
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-chess-text-muted">Now</span>
            <span className="text-sm font-bold text-chess-text flex items-center gap-1.5">
              <Icon path={ICONS[iconFor(current.kind)]} className="w-4 h-4 text-chess-blue" />
              {labelFor(current.kind)}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {isChess && combo >= 2 && (
              <div
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 transition-colors ${
                  multiplier > 1
                    ? 'bg-chess-gold/15 text-chess-gold'
                    : 'bg-chess-page text-chess-text-muted'
                }`}
              >
                <Icon path={ICONS.bolt} className="w-4 h-4" />
                <span className="text-sm font-black tabular-nums leading-none">
                  {combo} · {multiplier % 1 === 0 ? `×${multiplier}` : `×${multiplier.toFixed(1)}`}
                </span>
              </div>
            )}
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-chess-text-muted">Points</span>
              <span className="text-lg font-black text-chess-green tabular-nums leading-none">
                {liveScore}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-chess-page rounded-xl px-3 py-1.5">
              <Icon path={ICONS.clock} className="w-4 h-4 text-chess-text-muted" />
              <span className="text-lg font-black text-chess-text tabular-nums leading-none">
                {fmtTime(secondsLeft)}
              </span>
            </div>
          </div>
        </div>
        {/* Round progress bar — 4 parts, with the moving playhead */}
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 pb-3.5">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-black text-chess-text uppercase tracking-wide">
              Round {roundIndex + 1}{' '}
              <span className="text-chess-text-muted">of {roundCount}</span>
            </span>
          </div>
          <CircuitTimeline
            segments={roundSegments}
            activeIndex={localSegIndex}
            secondsLeft={secondsLeft}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col">
        {isChess ? (
          <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-5 flex flex-col gap-4">
            <p className="text-center text-sm font-semibold text-chess-text-muted">
              {promptFor('chess')}
            </p>
            {currentPuzzle ? (
              <WorkoutPuzzle
                key={`${currentPuzzle.puzzleId || currentPuzzle.id}-${puzzlePos}`}
                puzzle={currentPuzzle}
                onCorrect={handleCorrect}
                onWrong={handleWrong}
                comboIndex={combo}
              />
            ) : (
              <div className="text-center text-chess-text-muted py-12">
                Loading puzzles…
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center gap-6">
            <Icon
              path={ICONS[iconFor(current.kind)]}
              className={`w-20 h-20 ${
                current.kind === 'workout' ? 'text-chess-green' : 'text-chess-text-muted'
              }`}
            />
            <div className="text-7xl font-black text-chess-text tabular-nums">
              {fmtTime(secondsLeft)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-chess-text">
                {promptFor(current.kind)}
              </h2>
              <p className="text-chess-text-muted mt-3 max-w-xs text-sm leading-relaxed">
                {pick(ROOKIE_LINES[current.kind as Exclude<SegmentKind, 'chess'>], lineSeed)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer: skip + end */}
      <div className="bg-chess-surface border-t border-slate-200">
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              playButtonClick();
              advanceSegment();
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 text-chess-text font-bold py-3 min-h-[44px] hover:bg-chess-page transition"
          >
            <Icon path={ICONS.skip} className="w-4 h-4" />
            Skip
          </button>
          <button
            onClick={() => {
              playButtonClick();
              finishSession();
            }}
            className="rounded-xl px-4 text-chess-text-muted font-bold py-3 min-h-[44px] hover:text-chess-text transition"
          >
            End
          </button>
        </div>
      </div>
    </div>
  );
}
