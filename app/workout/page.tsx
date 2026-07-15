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
import { saveResume, loadResume, clearResume, type WorkoutResumeState } from '@/lib/workout/resume';
import { WorkoutEvents } from '@/lib/analytics/posthog';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { pickWorkoutFinishLine } from '@/lib/workout/finish-lines';
import { fireConfetti } from '@/lib/confetti';
import { StreakComplete } from '@/components/shared/StreakComplete';
import { PunchTracker } from '@/components/workout/PunchTracker';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

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
    "Breathe in… and out. I'm doing it too. Metaphorically.",
    "Shake it out. The board will still be there.",
    "Nothing to solve right now. Wild concept, I know.",
    "I'll keep the timer warm. You keep breathing.",
    "Resting is strategy. Trust me, I read a paper on it.",
    "Roll the shoulders. Even rooks get stiff. Probably.",
    "Just us and the quiet. Pretty nice, honestly.",
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

// ─── Adaptive difficulty ─────────────────────────────────────────────────────
// The next puzzle is chosen by ELO proximity to a running target. A correct
// answer nudges the target up; a wrong answer drops it 100 so a struggling
// solver gets an easier puzzle next instead of getting discouraged.
const START_ELO = 800;
const ELO_UP_ON_CORRECT = 60;
const ELO_DOWN_ON_WRONG = 100;
const MIN_ELO = 600;
const MAX_ELO = 2000;

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
      return 'Chess Puzzles';
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
  isPersonalBest: boolean;
  previousBest: number;
  recentPoints: number[]; // chronological, this session last
  rookieLine: string; // Rookie's post-workout encouragement
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
  const [targetElo, setTargetElo] = useState(START_ELO);

  // Missed puzzles collected this session, stored for later replay.
  const missedRef = useRef<WorkoutPuzzleData[]>([]);

  // Every puzzle id shown this session (solved + missed). Sent on finish so
  // future workouts can exclude them and stay fresh.
  const seenIdsRef = useRef<string[]>([]);

  // Stable id for THIS workout, re-sent on every /api/workout/finish retry so the
  // server awards points exactly once (set in begin(), restored on resume()).
  const clientSessionIdRef = useRef<string>('');

  const [finishResult, setFinishResult] = useState<FinishResult | null>(null);
  const finishingRef = useRef(false);
  const confettiFiredRef = useRef(false); // fire results confetti once (StrictMode double-mounts effects)

  // Resume-on-kill: a saved in-progress workout found on mount (setup screen).
  const [resumable, setResumable] = useState<WorkoutResumeState | null>(null);

  // "End" early → confirm dialog (save / discard / keep going).
  const [endConfirmOpen, setEndConfirmOpen] = useState(false);

  // Camera punch counter (WORKOUT_PUNCH_CAM): opt-in, remembered per device.
  // Camera only ever starts while a toggled-on exercise segment is on screen.
  const [punchCam, setPunchCam] = useState(false);
  useEffect(() => {
    setPunchCam(localStorage.getItem('cp_punch_cam') === '1');
  }, []);
  const togglePunchCam = useCallback(() => {
    playButtonClick();
    setPunchCam((on) => {
      localStorage.setItem('cp_punch_cam', on ? '0' : '1');
      return !on;
    });
  }, []);

  const current = schedule[segIndex];

  // ── Discard: leave without recording the session ──────────────────────────
  const discardSession = useCallback(() => {
    clearResume();
    setEndConfirmOpen(false);
    router.push('/profile');
  }, [router]);

  // ── Finish: post points, show end screen ──────────────────────────────────
  const finishSession = useCallback(async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;

    const perfect = wrong === 0 && right > 0;
    const sessionPoints = Math.max(0, score) + (perfect ? PERFECT_SESSION_BONUS : 0);
    let lifetime: number | null = null;
    let isPersonalBest = false;
    let previousBest = 0;
    let recentPoints: number[] = [sessionPoints];
    const rookieLine = pickWorkoutFinishLine();
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
          seenPuzzleIds: seenIdsRef.current,
          clientSessionId: clientSessionIdRef.current,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data?.workoutPoints === 'number') lifetime = data.workoutPoints;
        if (typeof data?.isPersonalBest === 'boolean') isPersonalBest = data.isPersonalBest;
        if (typeof data?.previousBest === 'number') previousBest = data.previousBest;
        if (Array.isArray(data?.recentPoints) && data.recentPoints.length) {
          recentPoints = data.recentPoints;
        }
      }
    } catch {
      // Network/auth failure — still show the session summary.
    }

    WorkoutEvents.completed({
      minutes,
      points: sessionPoints,
      correct: right,
      wrong,
      perfect,
      isPersonalBest,
    });

    clearResume(); // session over — drop the resume snapshot
    setFinishResult({
      sessionPoints,
      lifetime,
      right,
      wrong,
      perfect,
      isPersonalBest,
      previousBest,
      recentPoints,
      rookieLine,
    });
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
    playBoxingBell(); // ring the bell to open the session
    clearResume(); // fresh start — discard any stale resume snapshot
    setResumable(null);
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
    setTargetElo(START_ELO);
    missedRef.current = [];
    seenIdsRef.current = [];
    clientSessionIdRef.current = crypto.randomUUID();
    setFinishResult(null);
    finishingRef.current = false;
    confettiFiredRef.current = false;
    setPhase('running');
    WorkoutEvents.started(minutes, false);

    // Prefetch the ramped puzzle queue.
    fetch(`/api/workout/puzzles?minutes=${minutes}`)
      .then((r) => (r.ok ? r.json() : { puzzles: [] }))
      .then((data) => setQueue(Array.isArray(data?.puzzles) ? data.puzzles : []))
      .catch(() => setQueue([]));
  }, [minutes]);

  // ── Resume a workout that was killed mid-session ──────────────────────────
  const resume = useCallback((snap: WorkoutResumeState) => {
    warmupAudio();
    playButtonClick();
    playBoxingBell(); // ring the bell to open the session
    setResumable(null);
    setMinutes(snap.minutes);
    setSchedule(buildSchedule(snap.minutes));
    setSegIndex(snap.segIndex);
    setSecondsLeft(snap.secondsLeft);
    setScore(snap.score);
    setRight(snap.right);
    setWrong(snap.wrong);
    setCombo(snap.combo);
    comboRef.current = snap.combo;
    setPuzzlePos(snap.puzzlePos);
    setTargetElo(snap.targetElo ?? START_ELO);
    missedRef.current = snap.missed ?? [];
    seenIdsRef.current = snap.seenIds ?? [];
    // Reuse the original session id so finishing a resumed workout is idempotent
    // with any earlier finish attempt. Older snapshots won't have one.
    clientSessionIdRef.current = snap.clientSessionId ?? crypto.randomUUID();
    setFinishResult(null);
    finishingRef.current = false;
    confettiFiredRef.current = false;
    setPhase('running');
    WorkoutEvents.started(snap.minutes, true);

    // Restore the exact saved queue so the same puzzle comes back up.
    if (snap.queue?.length) {
      setQueue(snap.queue);
    } else {
      // Older snapshot without a queue — fall back to a fresh fetch.
      fetch(`/api/workout/puzzles?minutes=${snap.minutes}`)
        .then((r) => (r.ok ? r.json() : { puzzles: [] }))
        .then((data) => setQueue(Array.isArray(data?.puzzles) ? data.puzzles : []))
        .catch(() => setQueue([]));
    }
  }, []);

  // On mount, surface any resumable in-progress workout on the setup screen.
  useEffect(() => {
    // ?preview=result — show the completion popup with sample data.
    if (new URLSearchParams(window.location.search).get('preview') === 'result') {
      setFinishResult({
        sessionPoints: 420,
        lifetime: 3180,
        right: 14,
        wrong: 0,
        perfect: true,
        isPersonalBest: true,
        previousBest: 360,
        recentPoints: [180, 240, 300, 210, 360, 280, 420],
        rookieLine: pickWorkoutFinishLine(),
      });
      setPhase('done');
      return;
    }
    const snap = loadResume();
    if (snap) setResumable(snap);
  }, []);

  // Persist in-progress state so an OS kill can resume (not for backgrounding).
  useEffect(() => {
    if (phase !== 'running') return;
    saveResume({
      minutes,
      segIndex,
      secondsLeft,
      score,
      right,
      wrong,
      combo,
      puzzlePos,
      targetElo,
      missed: missedRef.current,
      seenIds: seenIdsRef.current,
      clientSessionId: clientSessionIdRef.current,
      queue,
    });
  }, [phase, minutes, segIndex, secondsLeft, score, right, wrong, combo, puzzlePos, targetElo, queue]);

  // Confetti when the results popup appears — extra burst on a personal best.
  useEffect(() => {
    if (phase !== 'done' || !finishResult) return;
    if (confettiFiredRef.current) return; // guard StrictMode double-invoke
    confettiFiredRef.current = true;
    const colors = ['#58CC02', '#1CB0F6', '#FFC800', '#FF4B4B', '#A560E8', '#FF9600'];
    fireConfetti({ particleCount: 90, spread: 70, origin: { x: 0.2, y: 0.5 }, colors });
    fireConfetti({ particleCount: 90, spread: 70, origin: { x: 0.8, y: 0.5 }, colors });
    if (finishResult.isPersonalBest) {
      const t = setTimeout(
        () =>
          fireConfetti({
            particleCount: 180,
            spread: 120,
            startVelocity: 48,
            origin: { x: 0.5, y: 0.45 },
            colors: ['#FFE9A8', '#F4B40A', '#FFD24A', ...colors],
          }),
        320,
      );
      return () => clearTimeout(t);
    }
  }, [phase, finishResult]);

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

  // Pick the next puzzle by ELO proximity to the adaptive target. Prefer puzzles
  // not yet shown; only repeat if the queue is fully exhausted. puzzlePos is in
  // the deps so this recomputes after each answer (seenIds is a ref).
  const currentPuzzle = useMemo<WorkoutPuzzleData | undefined>(() => {
    if (!queue.length) return undefined;
    const used = new Set(seenIdsRef.current);
    let bestUnused: WorkoutPuzzleData | undefined;
    let bestUnusedDiff = Infinity;
    let bestAny: WorkoutPuzzleData | undefined;
    let bestAnyDiff = Infinity;
    for (const p of queue) {
      const id = p.puzzleId || p.id || '';
      const diff = Math.abs((p.rating ?? 1000) - targetElo);
      if (diff < bestAnyDiff) {
        bestAny = p;
        bestAnyDiff = diff;
      }
      if (!used.has(id) && diff < bestUnusedDiff) {
        bestUnused = p;
        bestUnusedDiff = diff;
      }
    }
    return bestUnused ?? bestAny;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, targetElo, puzzlePos]);

  const handleCorrect = useCallback(() => {
    const seenId = currentPuzzle?.puzzleId || currentPuzzle?.id;
    if (seenId) seenIdsRef.current.push(seenId);
    const rating = currentPuzzle?.rating ?? 1000;
    const nextStreak = comboRef.current + 1;
    comboRef.current = nextStreak;
    setCombo(nextStreak);
    setScore((s) => s + pointsForCorrect(rating, nextStreak));
    setRight((r) => r + 1);
    setTargetElo((e) => Math.min(MAX_ELO, e + ELO_UP_ON_CORRECT));
    setPuzzlePos((p) => p + 1);
  }, [currentPuzzle]);

  const handleWrong = useCallback(() => {
    const seenId = currentPuzzle?.puzzleId || currentPuzzle?.id;
    if (seenId) seenIdsRef.current.push(seenId);
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
    // Ease off: drop the target so the next puzzle is easier, not harder.
    setTargetElo((e) => Math.max(MIN_ELO, e - ELO_DOWN_ON_WRONG));
    setPuzzlePos((p) => p + 1);
  }, [currentPuzzle]);

  const liveScore = Math.max(0, score);
  const multiplier = comboMultiplier(combo);

  // Preview of the circuit for the chosen duration (setup screen).
  const previewSchedule = useMemo(() => buildSchedule(minutes), [minutes]);

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
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-4 flex flex-col gap-3">
          {/* Title in its own fun window */}
          <div
            className="rounded-2xl p-3.5 text-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef, #f97316)' }}
          >
            <h1
              className="text-2xl font-black text-white tracking-tight"
              style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}
            >
              Chess Boxing
            </h1>
          </div>

          {resumable && (
            <div className="rounded-2xl border-2 border-chess-blue/40 bg-chess-blue/5 p-4 flex flex-col gap-3">
              <div>
                <div className="text-sm font-black text-chess-text">Resume your workout?</div>
                <div className="text-xs text-chess-text-muted mt-0.5">
                  You left off on round {Math.floor(resumable.segIndex / ROUND_LENGTH) + 1} of{' '}
                  {Math.max(1, Math.round((resumable.minutes * 60) / ROUND_SECONDS))}.
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => resume(resumable)}
                  className="flex-1 rounded-xl bg-chess-blue text-white font-black text-sm py-3 shadow-sm active:translate-y-[1px] transition"
                >
                  Resume
                </button>
                <button
                  onClick={() => {
                    clearResume();
                    setResumable(null);
                  }}
                  className="rounded-xl bg-chess-surface border border-slate-200 text-chess-text-muted font-black text-sm px-4 py-3 active:translate-y-[1px] transition"
                >
                  Start over
                </button>
              </div>
            </div>
          )}

          {/* One Round — bold title with two lines encompassing the bars */}
          <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 pt-5">
            <div className="relative rounded-xl border-2 border-chess-text/15 px-3 pt-6 pb-3">
              {/* "One Round" sits on the top border; the side borders are the two
                  lines that wrap the bars below. */}
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-chess-surface px-2.5 text-base font-black text-chess-text">
                One Round
              </span>

              {(() => {
                const round = previewSchedule.slice(0, ROUND_LENGTH);
                const total = round.reduce((s, seg) => s + seg.seconds, 0) || 1;
                const fmt = (sec: number) => `${Math.round(sec / 60)} min`;
                return (
                  <>
                    {/* Total round length, under the title */}
                    <div className="text-center text-xs font-bold text-chess-text-muted mb-2.5">
                      {Math.round(total / 60)} Minutes
                    </div>
                    {/* Time labels — aligned over each bar */}
                    <div className="flex gap-1.5 w-full mb-1.5">
                      {round.map((seg, i) => (
                        <div
                          key={i}
                          className="text-center text-[10px] font-bold text-chess-text-muted leading-none"
                          style={{ width: `${(seg.seconds / total) * 100}%` }}
                        >
                          {fmt(seg.seconds)}
                        </div>
                      ))}
                    </div>
                    <CircuitTimeline segments={round} />
                  </>
                );
              })()}
            </div>
          </div>

          <div>
            <h2 className="text-[11px] font-bold text-chess-text-muted uppercase tracking-wide mb-2 text-center">
              How many rounds?
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_PRESETS.map((m) => {
                const rounds = Math.max(1, Math.round((m * 60) / ROUND_SECONDS));
                return (
                  <button
                    key={m}
                    onClick={() => {
                      playButtonClick();
                      setMinutes(m);
                    }}
                    className={`rounded-xl border-2 py-2.5 transition flex flex-col items-center leading-none ${
                      minutes === m
                        ? 'border-chess-blue bg-chess-blue/10 text-chess-blue'
                        : 'border-slate-200 bg-chess-surface text-chess-text'
                    }`}
                  >
                    <span className="font-black text-lg">{rounds}</span>
                    <span className="text-[10px] font-semibold text-chess-text-muted mt-0.5">
                      {m} min
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty adapts — compact bullets */}
          <div
            className="rounded-2xl border border-amber-200 shadow-sm p-3"
            style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Icon path={ICONS.bolt} className="w-3.5 h-3.5 text-amber-500" />
              <h2 className="text-[11px] font-black text-amber-700 uppercase tracking-wide">
                How it works
              </h2>
            </div>
            <ul className="flex flex-col gap-1.5 text-sm font-bold text-amber-900">
              <li className="flex items-center gap-2">
                <span className="text-chess-green">✓</span> Correct answer = ELO +60
              </li>
              <li className="flex items-center gap-2">
                <span className="text-chess-red">✗</span> Wrong answer = ELO −100
              </li>
              <li className="flex items-center gap-2">
                <Icon path={ICONS.bolt} className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                Harder puzzle = more points (10–25)
              </li>
              <li className="flex items-center gap-2">
                <Icon path={ICONS.bolt} className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                Solve a streak = combo up to ×2
              </li>
            </ul>
          </div>

          <button
            onClick={begin}
            className="w-full rounded-2xl bg-chess-green hover:bg-chess-green-dark text-white font-black text-base py-3.5 shadow-sm transition"
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
      <div className="h-full bg-chess-page">
        {/* Results popup — celebratory modal over the page */}
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 workout-result-overlay">
          <style>{`
            @keyframes workoutResultIn { 0% { opacity:0; transform: scale(.7) translateY(16px);} 60%{opacity:1; transform: scale(1.04);} 100%{transform: scale(1);} }
            .workout-result-overlay { animation: workoutResultIn .3s ease-out; }
            .workout-result-card { animation: workoutResultIn .45s cubic-bezier(.2,.9,.3,1.2); }
          `}</style>
          <div className="workout-result-card w-full max-w-xs bg-chess-surface rounded-3xl shadow-2xl p-5 flex flex-col items-center gap-2.5 text-center">
            <h1 className="text-lg font-black text-chess-text">Chess Boxing complete</h1>

            {/* Rookie, breathing calmly, with her line right below */}
            <BreathingRook size="sm" animate />
            <div className="w-full rounded-xl bg-chess-page px-3 py-2 text-xs font-semibold text-chess-text leading-snug">
              {finishResult.rookieLine}
            </div>

            {finishResult.isPersonalBest && (
              <div
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide text-amber-900"
                style={{ background: 'linear-gradient(135deg, #FFE9A8, #FFD24A)' }}
              >
                <Icon path={ICONS.bolt} className="w-3 h-3" />
                New personal best
              </div>
            )}

            <div>
              <div
                className={`text-4xl font-black tabular-nums leading-none ${
                  finishResult.isPersonalBest ? 'text-chess-gold' : 'text-chess-green'
                }`}
              >
                +{finishResult.sessionPoints}
              </div>
              <div className="text-xs font-semibold text-chess-text-muted mt-1">
                points this session
              </div>
            </div>

            {finishResult.perfect && (
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-chess-gold">
                <Icon path={ICONS.bolt} className="w-3.5 h-3.5" />
                Flawless run · +{PERFECT_SESSION_BONUS} bonus
              </div>
            )}

            {/* Where this session lands vs recent sessions */}
            {finishResult.recentPoints.length > 1 && (
              <div className="w-full">
                {(() => {
                  const pts = finishResult.recentPoints.slice(-8);
                  const max = Math.max(1, ...pts);
                  const lastIdx = pts.length - 1;
                  return (
                    <div className="flex items-end justify-center gap-1.5 h-12">
                      {pts.map((p, i) => {
                        const isLast = i === lastIdx;
                        const h = Math.max(5, Math.round((p / max) * 44));
                        return (
                          <div
                            key={i}
                            className="flex-1 max-w-[22px] rounded-t"
                            style={{
                              height: h,
                              background: isLast
                                ? finishResult.isPersonalBest
                                  ? '#F4B40A'
                                  : '#58CC02'
                                : '#D6E2EC',
                            }}
                          />
                        );
                      })}
                    </div>
                  );
                })()}
                <div className="text-[11px] font-semibold text-chess-text-muted mt-1.5">
                  {finishResult.isPersonalBest
                    ? 'Your highest score yet'
                    : finishResult.previousBest > 0
                      ? `Best ${finishResult.previousBest}`
                      : 'Your first session'}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-6 w-full pt-2 border-t border-slate-100">
              <div>
                <div className="text-xl font-black text-chess-green tabular-nums">
                  {finishResult.right}
                </div>
                <div className="text-[11px] font-semibold text-chess-text-muted">solved</div>
              </div>
              <div>
                <div className="text-xl font-black text-chess-red tabular-nums">
                  {finishResult.wrong}
                </div>
                <div className="text-[11px] font-semibold text-chess-text-muted">missed</div>
              </div>
              {finishResult.lifetime !== null && (
                <div>
                  <div className="text-xl font-black text-chess-text tabular-nums">
                    {finishResult.lifetime.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-semibold text-chess-text-muted">lifetime</div>
                </div>
              )}
            </div>

            <div className="w-full pt-2 border-t border-slate-100">
              <StreakComplete />
            </div>

            <button
              onClick={() => {
                playButtonClick();
                router.push('/profile');
              }}
              className="w-full rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-base py-3 shadow-sm transition mt-1"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RUNNING (and confetti on the results popup) ───────────────────────────
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
              {current.kind !== 'break' && (
                <Icon path={ICONS[iconFor(current.kind)]} className="w-4 h-4 text-chess-blue" />
              )}
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
        ) : current.kind === 'break' ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center gap-6">
            <BreathingRook size="xl" animate mood="zen" />
            <div className="text-7xl font-black text-chess-text tabular-nums">
              {fmtTime(secondsLeft)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-chess-text">Rest</h2>
              <p className="text-chess-text-muted mt-3 max-w-xs text-sm leading-relaxed">
                {pick(ROOKIE_LINES.break, lineSeed)}
              </p>
            </div>
          </div>
        ) : FEATURE_FLAGS.WORKOUT_PUNCH_CAM && punchCam ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 text-center gap-3">
            <div className="text-5xl font-black text-chess-text tabular-nums">
              {fmtTime(secondsLeft)}
            </div>
            <div className="text-xs font-black uppercase tracking-wide text-chess-text-muted">
              🥊 Rookie&apos;s Corner
            </div>
            <PunchTracker autoStart className="w-full max-w-xs" />
            <button
              onClick={togglePunchCam}
              className="text-sm font-semibold text-chess-text-muted underline min-h-[44px]"
            >
              Turn off punch counting
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center gap-6">
            <Icon path={ICONS[iconFor(current.kind)]} className="w-20 h-20 text-chess-green" />
            <div className="text-7xl font-black text-chess-text tabular-nums">
              {fmtTime(secondsLeft)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-chess-text">
                {promptFor(current.kind)}
              </h2>
              <p className="text-chess-text-muted mt-3 max-w-xs text-sm leading-relaxed">
                {pick(ROOKIE_LINES.workout, lineSeed)}
              </p>
            </div>
            {FEATURE_FLAGS.WORKOUT_PUNCH_CAM && (
              <button
                onClick={togglePunchCam}
                className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-chess-surface px-4 py-3 min-h-[44px] font-bold text-chess-text hover:bg-chess-page transition"
              >
                📷 Count my punches
              </button>
            )}
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
              setEndConfirmOpen(true);
            }}
            className="rounded-xl px-4 text-chess-text-muted font-bold py-3 min-h-[44px] hover:text-chess-text transition"
          >
            End
          </button>
        </div>
      </div>

      {/* End-early confirm: save / discard / keep going */}
      {endConfirmOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setEndConfirmOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-sm bg-chess-surface rounded-3xl shadow-2xl p-6 flex flex-col gap-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h2 className="text-xl font-black text-chess-text">End your workout?</h2>
              <p className="text-sm text-chess-text-muted mt-1.5 leading-snug">
                Save your progress to keep the {liveScore} point{liveScore === 1 ? '' : 's'} you&apos;ve
                earned, or discard this session.
              </p>
            </div>
            <button
              onClick={() => {
                playButtonClick();
                setEndConfirmOpen(false);
                finishSession();
              }}
              className="w-full rounded-2xl bg-chess-green hover:bg-chess-green-dark text-white font-black text-base py-3.5 shadow-sm transition"
            >
              Save &amp; finish
            </button>
            <button
              onClick={() => {
                playButtonClick();
                discardSession();
              }}
              className="w-full rounded-2xl border-2 border-slate-200 text-chess-red font-black text-base py-3 hover:bg-chess-page transition"
            >
              Discard
            </button>
            <button
              onClick={() => {
                playButtonClick();
                setEndConfirmOpen(false);
              }}
              className="text-sm font-bold text-chess-text-muted hover:text-chess-text py-1 transition"
            >
              Keep going
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
