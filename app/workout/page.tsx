'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import nextDynamic from 'next/dynamic';
import { Chess, type Square } from 'chess.js';
import { WorkoutPuzzle, type WorkoutPuzzleData } from '@/components/workout/WorkoutPuzzle';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { ArenaBackButton, ArenaScene, GymSign } from '@/components/chessboxing/Arena';
import { useClickToMove, reconcileSelectionAfterOpponentMove } from '@/hooks/useClickToMove';
import { usePremove } from '@/hooks/usePremove';
import { useBoxShell } from '@/hooks/useBoxShell';
import { premoveDests, premoveSquareStyles } from '@/lib/chess/premove';
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import { pickRookieMove } from '@/lib/rookie/pick-move';
import { getRookieLevel, peekRookieLevel } from '@/lib/rookie/level-client';
import {
  buildSchedule,
  labelFor,
  promptFor,
  DURATION_PRESETS,
  ROUND_LENGTH,
  ROUND_SECONDS,
  PERFECT_SESSION_BONUS,
  pointsForCorrectV2,
  payFactor,
  comboMultiplier,
  FIRED_UP_PUNCH_TARGET,
  whiteMaterialLead,
  fightMaterialPoints,
  fightWinBonus,
  FIGHT_ROUND_MATERIAL_CAP,
  FIGHT_MATE_ROUND_BONUS,
  FIGHT_DRAW_SESSION_BONUS,
  FIGHT_MAX_LEVEL,
  type Segment,
  type SegmentKind,
} from '@/lib/workout/schedule';
import {
  warmupAudio,
  playButtonClick,
  playBoxingBell,
  playWoodClap,
  playMoveSound,
  playCaptureSound,
  playCelebrationSound,
} from '@/lib/sounds';
import { saveResume, loadResume, clearResume, type WorkoutResumeState } from '@/lib/workout/resume';
import { WorkoutEvents } from '@/lib/analytics/posthog';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { pickWorkoutFinishLine } from '@/lib/workout/finish-lines';
import { fireConfetti } from '@/lib/confetti';
import { StreakComplete } from '@/components/shared/StreakComplete';
import { FightResultCard } from '@/components/chessboxing/result/FightResultCard';
import { buildPuzzleShareFrames } from '@/lib/share/fight-night-frames';
import { getTz } from '@/lib/streak-client';
import AchievementUnlockOverlay from '@/components/achievements/AchievementUnlockOverlay';
import type { AchievementUnlock, NextMedal } from '@/lib/achievements/types';
import { PunchTracker } from '@/components/workout/PunchTracker';
import { ComboCoach } from '@/components/workout/ComboCoach';
import { bumpComboSessions } from '@/lib/workout/combo-coach';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import type { FightStats } from '@/lib/box/fight-stats';

// Quadrant Fight (beta) — opt-in camera game for boxing segments. Lazy so the
// TF.js/game code is code-split and never loads unless the user turns it on.
// Pure visual layer: no points, no DB, no streak, no analytics.
const QuadrantFight = nextDynamic(() => import('@/components/box/QuadrantFight'), { ssr: false });

/** localStorage key for the Quadrant Fight opt-in (shared with the Bout flow). */
const QUAD_FIGHT_KEY = 'cp_quadrant_fight_optin';

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

// ─── Fight rounds (WORKOUT_FIGHT_ROUNDS) ─────────────────────────────────────
// One continuous game vs Rookie across the chess segments. The game freezes
// during exercise/break segments and resumes the next chess segment — real
// chess boxing. Player is always white; Rookie plays at the user's unlocked
// /play level, hard-capped at FIGHT_MAX_LEVEL (L5+ engines are heavyweight
// downloads that must never load here).

type Discipline = 'puzzles' | 'fight';

const FIGHT_START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const FIGHT_ANIM_MS = 300;

// Canned Rookie lines for the fight (no speech systems — just text).
const FIGHT_LINES = {
  freeze: [
    "Board's frozen. I'm not going anywhere.",
    "Round's over. I'll hold the position — you go hit something.",
    "Frozen. I'm using this time to plot. Fair warning.",
  ],
  resume: [
    "Where were we. Right — this position. I remember everything.",
    "Round's back on. I've been thinking about this the whole time.",
    "Gloves off, board on. Your move when you're ready.",
  ],
  rookieLost: [
    'This is fine. This is completely fine.',
    "That didn't happen. Rematch. Right now.",
  ],
  rookieWon: [
    'Checkmate — but you made me earn every square of it. Again.',
    "That's the round. You fought hard. New game — keep swinging.",
  ],
  draw: [
    'A draw. We both live. New game — someone has to win this time.',
  ],
} as const;

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

/** The frozen game, visible but locked, during exercise/break fight segments. */
function FrozenFightBoard({ fen }: { fen: string }) {
  return (
    <div className="relative w-full max-w-[220px] mx-auto">
      <div className="pointer-events-none opacity-40 grayscale">
        <ChessPathBoard
          options={{ position: fen, boardOrientation: 'white', animationDurationInMs: 0 }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rounded-lg bg-slate-800/80 text-white text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1.5">
          Frozen
        </span>
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

/**
 * A finished session that hit a 401 (logged-out fighter) waits here, and the
 * next AUTHED load of this page replays it to /api/workout/finish — which is
 * idempotent per clientSessionId, so a replay can never double-count. A
 * workout is never silently lost.
 */
const PENDING_WORKOUT_KEY = 'cp:pending-workout';

function stashPendingWorkout(payload: Record<string, unknown>) {
  try {
    localStorage.setItem(PENDING_WORKOUT_KEY, JSON.stringify(payload));
  } catch {
    /* storage full / private mode — nothing more we can do */
  }
}

interface FinishResult {
  sessionPoints: number;
  bestRoundPoints: number;
  lifetime: number | null;
  right: number;
  wrong: number;
  perfect: boolean;
  isPersonalBest: boolean;
  previousBest: number;
  recentPoints: number[]; // chronological, this session last
  rookieLine: string; // Rookie's post-workout encouragement
  /** Fight sessions only — the game-result line ("You beat Rookie (Level 3)"). */
  fightSummary: string | null;
  /** Fight sessions only — true/false for the game result; null for puzzle sessions. */
  fightWon: boolean | null;
  /** Highest-rated puzzle solved this session — the Share card. */
  toughestSolved: WorkoutPuzzleData | null;
  /** Finish POST came back 401 — session stashed, card must ask for sign-in. */
  needsSignIn: boolean;
  /** Fresh medals from /api/workout/finish — played over the results popup. */
  achievements: AchievementUnlock[];
  /** Closest in-progress medal — one teaser line on the result card. */
  nextMedal: NextMedal | null;
}

export default function WorkoutPage() {
  // Suspense boundary for useSearchParams (arena styling when entered from /box).
  return (
    <Suspense fallback={null}>
      <WorkoutPageInner />
    </Suspense>
  );
}

function WorkoutPageInner() {
  const router = useRouter();
  // Entered from the Chess Boxing ring → setup wears the dark arena look and
  // gets a back button to /box. Reached any other way, nothing changes.
  const fromBox = useSearchParams().get('from') === 'box';

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
  // Achievement facts, tracked over the whole session for the finish payload.
  const bestComboRef = useRef(0); // longest combo this session (Combo Meal)
  const firedUpEverRef = useRef(false); // hit the 80-punch trigger at least once

  const [queue, setQueue] = useState<WorkoutPuzzleData[]>([]);
  const [puzzlePos, setPuzzlePos] = useState(0);
  const [targetElo, setTargetElo] = useState(START_ELO);

  // Scoring v2: highest targetElo reached this session. Only ratchets up —
  // it's the anti-sandbag anchor (puzzles far below it pay 1 point flat).
  const [highWaterElo, setHighWaterElo] = useState(START_ELO);
  useEffect(() => {
    setHighWaterElo((h) => Math.max(h, targetElo));
  }, [targetElo]);

  // Warm the matched Rookie level so a Fight Round starting mid-session uses
  // the same Rookie /play matched to you, not a stale cache.
  useEffect(() => {
    void getRookieLevel();
  }, []);

  // Fired Up: earned by punching hard in the previous exercise segment;
  // makes the NEXT chess segment pay +25%.
  const [firedUp, setFiredUp] = useState(false);

  // Puzzle points earned per round (index = round) → best single round.
  const roundPointsRef = useRef<number[]>([]);

  // Missed puzzles collected this session, stored for later replay.
  const missedRef = useRef<WorkoutPuzzleData[]>([]);
  // Every puzzle solved this session; the toughest one is the share card.
  const solvedRef = useRef<WorkoutPuzzleData[]>([]);
  // Pre-rendered Fight Night GIF for the toughest solve (starts at finish).
  const shareGifRef = useRef<{ promise: Promise<Blob> } | null>(null);
  const [sharing, setSharing] = useState(false);

  // Every puzzle id shown this session (solved + missed). Sent on finish so
  // future workouts can exclude them and stay fresh.
  const seenIdsRef = useRef<string[]>([]);
  // Per-puzzle results (theme + rating + time) for the skill profile.
  const resultsRef = useRef<{ puzzleId?: string; themes?: string[]; rating?: number; correct: boolean; timeMs: number }[]>([]);
  const puzzleShownAtRef = useRef<number>(0);

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

  // ── Punch counter (Chess Boxing) ──────────────────────────────────────────
  // Opt-in camera punch counter during the exercise segments. The tracker
  // remounts each exercise round (fresh camera), so it restarts its own count;
  // punchesRef accumulates the WHOLE-session total across rounds, using
  // segPunchBaseRef to convert the mount's cumulative total into deltas.
  const [punchCamOn, setPunchCamOn] = useState(false);
  // Quadrant Fight (beta) opt-in — camera game shown during exercise segments.
  // Default OFF; persisted so it stays on across rounds/sessions once enabled.
  // Chess Boxing APP only — never offered on the chesspath.app website.
  const [quadFightOn, setQuadFightOn] = useState(false);
  const inBoxShell = useBoxShell();
  const quadFightActive = quadFightOn && inBoxShell;
  // Quadrant Fight's card for the exercise round just fought — surfaced as a
  // one-liner in the segment. Display only: workout points are UNCHANGED by it.
  const [fightCard, setFightCard] = useState<{ segIndex: number; stats: FightStats } | null>(null);
  const punchesRef = useRef(0);
  const segPunchBaseRef = useRef(0);
  const [punchTotal, setPunchTotal] = useState(0); // live display
  // Session total at the START of the current exercise segment — the diff at
  // segment end is "punches this segment" (feeds Fired Up).
  const segStartPunchesRef = useRef(0);

  const onPunch = useCallback((mountTotal: number) => {
    const delta = mountTotal - segPunchBaseRef.current;
    if (delta > 0) {
      punchesRef.current += delta;
      setPunchTotal(punchesRef.current);
    }
    segPunchBaseRef.current = mountTotal;
  }, []);

  const current = schedule[segIndex];

  // Preload the pose model at workout start when Quadrant Fight is opted in, so
  // the first exercise segment doesn't cold-boot the detector. Dynamic import
  // keeps TF.js out of this chunk; the module memoizes across segments.
  useEffect(() => {
    if (!quadFightActive || phase !== 'running') return;
    import('@/lib/punch/movenet')
      .then((m) => m.warmMoveNet())
      .catch(() => {});
  }, [quadFightActive, phase]);

  // ── Fight rounds (WORKOUT_FIGHT_ROUNDS) ───────────────────────────────────
  // One continuous game vs Rookie; freezes during exercise/break segments.
  const fightEnabled = FEATURE_FLAGS.WORKOUT_FIGHT_ROUNDS;
  const [discipline, setDiscipline] = useState<Discipline>('puzzles');
  const isFight = fightEnabled && discipline === 'fight';

  const [fightFen, setFightFen] = useState(FIGHT_START_FEN);
  const fightFenRef = useRef(FIGHT_START_FEN); // callback-safe mirror
  const fightMovesRef = useRef<string[]>([]); // SAN history (opening book + resume)
  const [fightLevel, setFightLevel] = useState(1);
  const fightLevelRef = useRef(1);
  const [fightSelected, setFightSelected] = useState<Square | null>(null);
  const [fightLastMv, setFightLastMv] = useState<{ from: Square; to: Square } | null>(null);
  const [rookieThinking, setRookieThinking] = useState(false);
  const [fightLine, setFightLine] = useState<string | null>(null);

  // Rookie's pending move timer — MUST be cleared when a chess segment ends
  // (freeze) or she'll move during exercise.
  const rookieTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // True only while a fight chess segment is live — gates moves + engine replies.
  const fightActiveRef = useRef(false);
  // Engine loads lazily at the FIRST fight chess segment (7.3MB wasm worker).
  const sfInitStartedRef = useRef(false);
  const sfReadyRef = useRef(false);

  // Judges' scoring: white's material lead at the current scoring window's
  // start; material points already banked per round (per-round cap); every
  // fight point ever awarded (score state can be stale inside finishSession).
  const segStartMaterialRef = useRef(0);
  const fightMaterialByRoundRef = useRef<number[]>([]);
  const fightScoreRef = useRef(0);
  const fightWinsRef = useRef(0);
  const fightLossesRef = useRef(0);
  const fightDrawsRef = useRef(0);

  // Callback-safe mirrors of state the fight handlers need.
  const segIndexRef = useRef(0);
  useEffect(() => {
    segIndexRef.current = segIndex;
  }, [segIndex]);
  const firedUpRef = useRef(false);
  useEffect(() => {
    firedUpRef.current = firedUp;
  }, [firedUp]);

  // ── Fight helpers (all read refs only — stable identities) ────────────────

  /**
   * Bank this scoring window's judges' points: net material gained since the
   * window started, level-scaled, Fired Up ×1.25, capped per round. A mate on
   * Rookie adds a round bonus (counts toward best round) + a level-scaled
   * session win bonus (does NOT — keeps best-round comparable with puzzles).
   * Rebases the window to the end position so double-banking adds nothing.
   */
  const bankFightSegment = useCallback(
    (endFen: string, result?: 'win' | 'loss' | 'draw') => {
      const rIdx = Math.floor(segIndexRef.current / ROUND_LENGTH);
      const endMaterial = whiteMaterialLead(endFen);
      const delta = endMaterial - segStartMaterialRef.current;
      let material = fightMaterialPoints(delta, fightLevelRef.current, firedUpRef.current);
      const already = fightMaterialByRoundRef.current[rIdx] ?? 0;
      material = Math.max(0, Math.min(material, FIGHT_ROUND_MATERIAL_CAP - already));
      fightMaterialByRoundRef.current[rIdx] = already + material;

      let roundPts = material;
      let sessionOnly = 0;
      if (result === 'win') {
        roundPts += FIGHT_MATE_ROUND_BONUS;
        sessionOnly += fightWinBonus(fightLevelRef.current);
      } else if (result === 'draw') {
        sessionOnly += FIGHT_DRAW_SESSION_BONUS;
      }
      if (roundPts > 0) {
        roundPointsRef.current[rIdx] = (roundPointsRef.current[rIdx] ?? 0) + roundPts;
      }
      const total = roundPts + sessionOnly;
      if (total > 0) {
        fightScoreRef.current += total;
        setScore((s) => s + total);
      }
      segStartMaterialRef.current = endMaterial;
    },
    [],
  );

  /** Freeze the game: kill Rookie's pending move + flush the engine queue. */
  const freezeFight = useCallback(() => {
    fightActiveRef.current = false;
    if (rookieTimerRef.current) {
      clearTimeout(rookieTimerRef.current);
      rookieTimerRef.current = null;
    }
    stockfish.cancel();
    setRookieThinking(false);
  }, []);

  /** Fresh game (session start or auto-rematch) — the session keeps going. */
  const startNewFightGame = useCallback(() => {
    fightFenRef.current = FIGHT_START_FEN;
    setFightFen(FIGHT_START_FEN);
    fightMovesRef.current = [];
    setFightSelected(null);
    setFightLastMv(null);
    segStartMaterialRef.current = 0;
  }, []);

  /** Game over mid-session: score it, say the line, rematch immediately. */
  const onFightGameOver = useCallback(
    (g: Chess) => {
      const endFen = g.fen();
      const seed = fightMovesRef.current.length + segIndexRef.current;
      if (g.isCheckmate()) {
        const rookieLost = g.turn() === 'b'; // Rookie is black; black mated = you won
        if (rookieLost) {
          fightWinsRef.current += 1;
          bankFightSegment(endFen, 'win');
          setFightLine(pick([...FIGHT_LINES.rookieLost], seed));
          playCelebrationSound();
        } else {
          fightLossesRef.current += 1;
          bankFightSegment(endFen, 'loss'); // banked material stays, no bonus
          setFightLine(pick([...FIGHT_LINES.rookieWon], seed));
        }
      } else {
        fightDrawsRef.current += 1;
        bankFightSegment(endFen, 'draw');
        setFightLine(pick([...FIGHT_LINES.draw], seed));
      }
      startNewFightGame();
    },
    [bankFightSegment, startNewFightGame],
  );

  /** Rookie's reply: opening book → random-blunder chance → sampled Stockfish. */
  const scheduleRookieMove = useCallback(
    (currentFen: string) => {
      if (!fightActiveRef.current) return;
      if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
      setRookieThinking(true);

      const applyRookieMove = (
        moveInfo: { from: string; to: string; promotion?: string } | { san: string },
      ) => {
        rookieTimerRef.current = null;
        if (!fightActiveRef.current) return; // segment ended while waiting
        const g = new Chess(fightFenRef.current);
        if (g.turn() !== 'b' || g.isGameOver()) {
          setRookieThinking(false);
          return;
        }
        let result;
        try {
          result =
            'san' in moveInfo
              ? g.move(moveInfo.san)
              : g.move({
                  from: moveInfo.from as Square,
                  to: moveInfo.to as Square,
                  promotion: (moveInfo.promotion || 'q') as 'q' | 'r' | 'b' | 'n',
                });
        } catch {
          result = null;
        }
        if (!result) {
          setRookieThinking(false);
          return;
        }
        const newFen = g.fen();
        fightFenRef.current = newFen;
        setFightFen(newFen);
        fightMovesRef.current.push(result.san);
        setFightLastMv({ from: result.from as Square, to: result.to as Square });
        setFightSelected((prev) => reconcileSelectionAfterOpponentMove(prev, result));
        setRookieThinking(false);
        if (result.captured) playCaptureSound();
        else playMoveSound();
        if (g.isGameOver()) onFightGameOver(g);
      };

      const scheduleApply = (
        moveInfo: { from: string; to: string; promotion?: string } | { san: string },
        delayMs: number,
      ) => {
        rookieTimerRef.current = setTimeout(() => applyRookieMove(moveInfo), delayMs);
      };

      const fallbackRandom = () => {
        const g = new Chess(currentFen);
        const moves = g.moves({ verbose: true });
        if (!moves.length) {
          setRookieThinking(false);
          return;
        }
        const mv = moves[Math.floor(Math.random() * moves.length)];
        scheduleApply({ from: mv.from, to: mv.to, promotion: mv.promotion }, 500);
      };

      // ONE picker for every surface (lib/rookie/pick-move.ts). A segment can
      // end while she's thinking, so the guard is re-checked on resolve.
      const thinkStart = Date.now();
      pickRookieMove({
        fen: currentFen,
        sans: fightMovesRef.current,
        rookieColor: 'black',
        level: fightLevelRef.current,
        engineReady: sfReadyRef.current,
      })
        .then((decision) => {
          if (!fightActiveRef.current) return; // froze while thinking
          if (!decision) {
            fallbackRandom();
            return;
          }
          // Pace every reply to a ~500ms floor so she never snaps back instantly.
          const wait = Math.max(0, 500 - (Date.now() - thinkStart));
          scheduleApply(decision.move, wait);
        })
        .catch(() => {
          if (fightActiveRef.current) fallbackRandom();
        });
    },
    [onFightGameOver],
  );

  /** Player's move (white). Returns true if legal — feeds drop + click-to-move. */
  const doFightMove = useCallback(
    (from: Square, to: Square): boolean => {
      if (!fightActiveRef.current) return false;
      const g = new Chess(fightFenRef.current);
      if (g.turn() !== 'w') return false;
      let result;
      try {
        result = g.move({ from, to, promotion: 'q' });
      } catch {
        return false;
      }
      if (!result) return false;
      const newFen = g.fen();
      fightFenRef.current = newFen;
      setFightFen(newFen);
      fightMovesRef.current.push(result.san);
      setFightLastMv({ from, to });
      setFightSelected(null);
      if (result.captured) playCaptureSound();
      else playMoveSound();
      if (g.isGameOver()) {
        onFightGameOver(g);
        return true;
      }
      // Let the board animation finish before Rookie replies (tracked timer —
      // cleared on freeze so she never moves during exercise).
      rookieTimerRef.current = setTimeout(
        () => scheduleRookieMove(newFen),
        FIGHT_ANIM_MS + 150,
      );
      return true;
    },
    [onFightGameOver, scheduleRookieMove],
  );

  // Derived game for click-to-move + square styles.
  const fightGame = useMemo(() => {
    try {
      return new Chess(fightFen);
    } catch {
      return null;
    }
  }, [fightFen]);

  // Premove — queue your reply during Rookie's think. Disabled the moment the
  // segment stops being a live chess round, so nothing survives the bell.
  const fightBoardLive =
    isFight && phase === 'running' && current?.kind === 'chess';

  const {
    premove: fightPremove,
    setPremove: setFightPremove,
    premoveEnabled: fightPremoveEnabled,
  } = usePremove({
    fen: fightFen,
    isMyTurn: fightGame?.turn() === 'w',
    tryMove: doFightMove,
    enabled: fightBoardLive,
    fireDelayMs: FIGHT_ANIM_MS,
  });

  const { onSquareClick: onFightSquareClick, onPremoveDrop: onFightPremoveDrop } = useClickToMove({
    game: fightGame,
    ownColor: 'w',
    selectedSquare: fightSelected,
    setSelectedSquare: setFightSelected,
    tryMove: doFightMove,
    // Stays on during Rookie's turn so a premove can be set; execution is still
    // gated on it being white's move.
    enabled: fightBoardLive,
    premoveEnabled: fightPremoveEnabled,
    setPremove: setFightPremove,
  });

  // Lichess-style highlights: last move, check glow, selected + legal dots.
  const fightSqStyles = useMemo(() => {
    const s: Record<string, React.CSSProperties> = {};
    if (!fightGame) return s;
    if (fightLastMv) {
      s[fightLastMv.from] = { background: 'rgba(255, 170, 0, 0.4)' };
      s[fightLastMv.to] = { background: 'rgba(255, 170, 0, 0.4)' };
    }
    if (fightGame.isCheck()) {
      const kingColor = fightGame.turn();
      for (const row of fightGame.board()) {
        for (const sq of row) {
          if (sq && sq.type === 'k' && sq.color === kingColor) {
            s[sq.square] = {
              ...s[sq.square],
              background:
                'radial-gradient(ellipse at center, rgba(255, 0, 0, 0.8) 0%, rgba(255, 0, 0, 0.35) 40%, rgba(255, 0, 0, 0) 70%)',
            };
          }
        }
      }
    }
    if (fightSelected) {
      s[fightSelected] = { ...s[fightSelected], background: 'rgba(20, 85, 200, 0.5)' };
      // Our turn: real legal moves. Rookie's turn: relaxed premove targets.
      const dests =
        fightGame.turn() === 'w'
          ? fightGame.moves({ square: fightSelected, verbose: true }).map((m) => m.to as Square)
          : fightPremoveEnabled
            ? premoveDests(fightFen, fightSelected, 'w')
            : [];
      for (const to of dests) {
        const has = fightGame.get(to);
        s[to] = {
          ...s[to],
          background: has
            ? 'radial-gradient(transparent 55%, rgba(20, 85, 200, 0.4) 55%)'
            : 'radial-gradient(rgba(20, 85, 200, 0.5) 22%, transparent 22%)',
        };
      }
    }
    for (const [sq, style] of Object.entries(premoveSquareStyles(fightPremove))) {
      s[sq] = { ...s[sq], ...style };
    }
    return s;
  }, [fightGame, fightFen, fightLastMv, fightSelected, fightPremove, fightPremoveEnabled]);

  // Entering a fight chess segment: unfreeze, lazy-init the engine, rebase the
  // scoring window, and if it's Rookie's turn (segment ended mid-think last
  // round) reschedule her move.
  useEffect(() => {
    if (phase !== 'running' || !isFight) return;
    if (current?.kind !== 'chess') {
      fightActiveRef.current = false;
      return;
    }
    fightActiveRef.current = true;
    segStartMaterialRef.current = whiteMaterialLead(fightFenRef.current);
    if (!sfInitStartedRef.current) {
      sfInitStartedRef.current = true;
      stockfish
        .init()
        .then(() => {
          sfReadyRef.current = true;
        })
        .catch(() => {});
    }
    if (segIndex > 0) setFightLine(pick([...FIGHT_LINES.resume], segIndex));
    const g = new Chess(fightFenRef.current);
    if (!g.isGameOver() && g.turn() === 'b') {
      rookieTimerRef.current = setTimeout(
        () => scheduleRookieMove(fightFenRef.current),
        600,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isFight, segIndex, current?.kind]);

  // Kill any pending Rookie move if the page unmounts mid-fight.
  useEffect(() => {
    return () => {
      if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
    };
  }, []);

  // Load the saved "count my punches" preference once (client only).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setPunchCamOn(window.localStorage.getItem('cp_punch_cam') === '1');
    setQuadFightOn(window.localStorage.getItem(QUAD_FIGHT_KEY) === '1');
  }, []);

  const toggleQuadFight = useCallback((on: boolean) => {
    setQuadFightOn(on);
    if (typeof window !== 'undefined')
      window.localStorage.setItem(QUAD_FIGHT_KEY, on ? '1' : '0');
  }, []);

  // Each new exercise segment is a fresh tracker mount → reset the per-mount
  // base and mark the session total so this segment's punches are measurable.
  useEffect(() => {
    if (current?.kind === 'workout') {
      segPunchBaseRef.current = 0;
      segStartPunchesRef.current = punchesRef.current;
    }
  }, [segIndex, current?.kind]);

  // Re-enabling the cam mid-segment is also a fresh mount — a stale base would
  // make the first punch compute a negative delta and get dropped.
  useEffect(() => {
    if (punchCamOn) segPunchBaseRef.current = 0;
  }, [punchCamOn]);

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

    if (isFight) {
      // Session over with the game unfinished → the final window's material
      // delta "goes to the scorecards". Banking rebases the window, so if
      // advanceSegment already scored this segment the delta here is 0.
      freezeFight();
      bankFightSegment(fightFenRef.current);
    }

    const perfect = !isFight && wrong === 0 && right > 0;
    // Fight points live in a ref — score state set this same tick would be stale.
    const sessionPoints = isFight
      ? Math.max(0, fightScoreRef.current)
      : Math.max(0, score) + (perfect ? PERFECT_SESSION_BONUS : 0);

    let fightSummary: string | null = null;
    let fightWon: boolean | null = null;
    if (isFight) {
      const w = fightWinsRef.current;
      const l = fightLossesRef.current;
      const d = fightDrawsRef.current;
      const lvl = fightLevelRef.current;
      if (w > 0) fightSummary = `You beat Rookie (Level ${lvl})${w > 1 ? ` ×${w}` : ''}`;
      else if (l > 0) fightSummary = `Rookie won this one (Level ${lvl})`;
      else if (d > 0) fightSummary = `Draw vs Rookie (Level ${lvl})`;
      else fightSummary = 'Went to the scorecards';
      fightWon = w > 0;
    }
    const bestRoundPoints = roundPointsRef.current.reduce((m, p) => Math.max(m, p ?? 0), 0);
    let lifetime: number | null = null;
    let isPersonalBest = false;
    let previousBest = 0;
    let recentPoints: number[] = [sessionPoints];
    let needsSignIn = false;
    let achievements: AchievementUnlock[] = [];
    let nextMedal: NextMedal | null = null;
    const rookieLine = pickWorkoutFinishLine();
    const finishPayload = {
      points: sessionPoints,
      durationMinutes: minutes,
      correct: right,
      wrong,
      perfect,
      missedPuzzles: missedRef.current,
      seenPuzzleIds: seenIdsRef.current,
      puzzleResults: resultsRef.current,
      clientSessionId: clientSessionIdRef.current,
      punches: punchesRef.current,
      bestRoundPoints,
      // Achievement facts (cosmetic medals only — server clamps everything).
      bestCombo: bestComboRef.current,
      firedUp: firedUpEverRef.current,
      tz: getTz(),
    };
    try {
      const res = await fetch('/api/workout/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finishPayload),
      });
      if (res.status === 401) {
        // Logged-out fighter — NEVER silently lose the session. Stash the
        // payload; the next authed load of this page replays it.
        stashPendingWorkout(finishPayload);
        needsSignIn = true;
      }
      if (res.ok) {
        const data = await res.json();
        if (typeof data?.workoutPoints === 'number') lifetime = data.workoutPoints;
        if (typeof data?.isPersonalBest === 'boolean') isPersonalBest = data.isPersonalBest;
        if (typeof data?.previousBest === 'number') previousBest = data.previousBest;
        if (Array.isArray(data?.recentPoints) && data.recentPoints.length) {
          recentPoints = data.recentPoints;
        }
        if (Array.isArray(data?.newAchievements)) achievements = data.newAchievements;
        if (data?.nextMedal && typeof data.nextMedal.name === 'string') nextMedal = data.nextMedal;
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

    // Combo Coach curriculum: one finished session = one step toward the next
    // punch unlock (finishingRef guards double-count).
    if (FEATURE_FLAGS.WORKOUT_COMBO_CALLS) bumpComboSessions();

    clearResume(); // session over — drop the resume snapshot
    setFinishResult({
      sessionPoints,
      bestRoundPoints,
      lifetime,
      right,
      wrong,
      perfect,
      isPersonalBest,
      previousBest,
      recentPoints,
      rookieLine,
      fightSummary,
      fightWon,
      toughestSolved: solvedRef.current.reduce<WorkoutPuzzleData | null>(
        (best, p) => (best === null || p.rating > best.rating ? p : best),
        null,
      ),
      needsSignIn,
      achievements,
      nextMedal,
    });
    setPhase('done');
  }, [score, right, wrong, minutes, isFight, freezeFight, bankFightSegment]);

  // ── Advance to the next segment (or finish) ───────────────────────────────
  // Runs on timer-out and Skip — both end a segment the same way. A wrong
  // answer never ends a segment; you keep swinging until the bell.
  const advanceSegment = useCallback(() => {
    // Boxing bell rings at the end of every stage.
    playBoxingBell();
    const cur = schedule[segIndex];
    if (isFight && cur?.kind === 'chess') {
      // FREEZE: kill Rookie's pending move + engine work (she must never move
      // during exercise), then the judges score the round on material.
      freezeFight();
      bankFightSegment(fightFenRef.current);
      setFightLine(pick([...FIGHT_LINES.freeze], segIndex));
    }
    if (cur?.kind === 'workout') {
      // Fired Up check: enough punches THIS exercise segment powers up the
      // next chess segment. Only reachable with the punch cam on (no cam →
      // 0 punches → simply not fired up; never a penalty).
      const segPunches = punchesRef.current - segStartPunchesRef.current;
      const hit = segPunches >= FIRED_UP_PUNCH_TARGET;
      if (hit) firedUpEverRef.current = true;
      setFiredUp(hit);
    } else if (cur?.kind === 'chess') {
      // Fired Up is spent on the chess segment it powered.
      setFiredUp(false);
    }
    const next = segIndex + 1;
    if (next >= schedule.length) {
      finishSession();
      return;
    }
    setSecondsLeft(schedule[next].seconds);
    setSegIndex(next);
  }, [schedule, segIndex, finishSession, isFight, freezeFight, bankFightSegment]);

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
    setHighWaterElo(START_ELO);
    setFiredUp(false);
    roundPointsRef.current = [];
    missedRef.current = [];
    solvedRef.current = [];
    shareGifRef.current = null;
    seenIdsRef.current = [];
    resultsRef.current = [];
    puzzleShownAtRef.current = Date.now();
    punchesRef.current = 0;
    segPunchBaseRef.current = 0;
    segStartPunchesRef.current = 0;
    setPunchTotal(0);
    clientSessionIdRef.current = crypto.randomUUID();
    setFinishResult(null);
    finishingRef.current = false;
    confettiFiredRef.current = false;

    // Fight rounds: fresh game, Rookie at the user's unlocked /play level
    // hard-capped at FIGHT_MAX_LEVEL (no picking easier — anti-farming; no
    // higher — L5+ engines are heavyweight downloads).
    const fight = fightEnabled && discipline === 'fight';
    fightFenRef.current = FIGHT_START_FEN;
    setFightFen(FIGHT_START_FEN);
    fightMovesRef.current = [];
    setFightSelected(null);
    setFightLastMv(null);
    setRookieThinking(false);
    setFightLine(null);
    fightActiveRef.current = false;
    segStartMaterialRef.current = 0;
    fightMaterialByRoundRef.current = [];
    fightScoreRef.current = 0;
    fightWinsRef.current = 0;
    fightLossesRef.current = 0;
    fightDrawsRef.current = 0;
    if (fight) {
      // Matched level, capped — L5+ engines are heavyweight downloads that
      // must never load inside a timed segment.
      const lvl = Math.min(FIGHT_MAX_LEVEL, peekRookieLevel().level);
      setFightLevel(lvl);
      fightLevelRef.current = lvl;
    }

    setPhase('running');
    WorkoutEvents.started(minutes, false);

    // Prefetch the ramped puzzle queue (puzzles discipline only).
    if (fight) {
      setQueue([]);
    } else {
      fetch(`/api/workout/puzzles?minutes=${minutes}`)
        .then((r) => (r.ok ? r.json() : { puzzles: [] }))
        .then((data) => setQueue(Array.isArray(data?.puzzles) ? data.puzzles : []))
        .catch(() => setQueue([]));
    }
  }, [minutes, fightEnabled, discipline]);

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
    setHighWaterElo(Math.max(snap.highWaterElo ?? START_ELO, snap.targetElo ?? START_ELO));
    setFiredUp(false); // Fired Up isn't snapshotted — earn it again
    roundPointsRef.current = snap.roundPoints ?? [];
    missedRef.current = snap.missed ?? [];
    solvedRef.current = snap.solved ?? [];
    seenIdsRef.current = snap.seenIds ?? [];
    // Punches aren't snapshotted; a resumed session counts from here.
    punchesRef.current = 0;
    segPunchBaseRef.current = 0;
    segStartPunchesRef.current = 0;
    setPunchTotal(0);
    // Reuse the original session id so finishing a resumed workout is idempotent
    // with any earlier finish attempt. Older snapshots won't have one.
    clientSessionIdRef.current = snap.clientSessionId ?? crypto.randomUUID();
    setFinishResult(null);
    finishingRef.current = false;
    confettiFiredRef.current = false;

    // Fight snapshot: rebuild the frozen game with a fresh Chess(fen).
    const fightSnap = snap.discipline === 'fight' ? snap.fight : undefined;
    setDiscipline(fightSnap ? 'fight' : 'puzzles');
    fightActiveRef.current = false;
    setRookieThinking(false);
    setFightSelected(null);
    setFightLastMv(null);
    setFightLine(null);
    if (fightSnap) {
      fightFenRef.current = fightSnap.fen;
      setFightFen(fightSnap.fen);
      fightMovesRef.current = [...(fightSnap.moveSans ?? [])];
      const lvl = Math.max(1, Math.min(FIGHT_MAX_LEVEL, fightSnap.level ?? 1));
      setFightLevel(lvl);
      fightLevelRef.current = lvl;
      segStartMaterialRef.current = fightSnap.segStartMaterial ?? 0;
      fightMaterialByRoundRef.current = [...(fightSnap.materialByRound ?? [])];
      fightWinsRef.current = fightSnap.wins ?? 0;
      fightLossesRef.current = fightSnap.losses ?? 0;
      fightDrawsRef.current = fightSnap.draws ?? 0;
      fightScoreRef.current = snap.score; // in fight mode, score IS fight points
    } else {
      fightFenRef.current = FIGHT_START_FEN;
      setFightFen(FIGHT_START_FEN);
      fightMovesRef.current = [];
      fightScoreRef.current = 0;
    }

    setPhase('running');
    WorkoutEvents.started(snap.minutes, true);

    // Restore the exact saved queue so the same puzzle comes back up.
    if (fightSnap) {
      setQueue([]);
    } else if (snap.queue?.length) {
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
        bestRoundPoints: 180,
        lifetime: 3180,
        right: 14,
        wrong: 0,
        perfect: true,
        isPersonalBest: true,
        previousBest: 360,
        recentPoints: [180, 240, 300, 210, 360, 280, 420],
        rookieLine: pickWorkoutFinishLine(),
        fightSummary: null,
        fightWon: null,
        toughestSolved: null,
        needsSignIn: false,
        achievements: [],
        nextMedal: { id: 'training-thousand-fists', name: 'Thousand Fists', icon: '👊', progress: 412, target: 1000 },
      });
      setPhase('done');
      return;
    }
    const snap = loadResume();
    if (snap) setResumable(snap);
  }, []);

  // Replay a stashed logged-out session on the next authed load. The endpoint
  // is idempotent per clientSessionId, so retrying is always safe: 401 keeps
  // the stash (still logged out), success or a payload rejection clears it,
  // and a network/server hiccup leaves it for the load after. No streak claim
  // here — the celebration belongs to completion screens only (CHE-388).
  const replayTriedRef = useRef(false);
  useEffect(() => {
    if (replayTriedRef.current) return;
    replayTriedRef.current = true;
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(PENDING_WORKOUT_KEY);
    } catch {
      return;
    }
    if (!raw) return;
    (async () => {
      try {
        const res = await fetch('/api/workout/finish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: raw,
        });
        if (res.status === 401) return; // still logged out — keep the stash
        if (res.ok || (res.status >= 400 && res.status < 500)) {
          // Saved, or the server will never accept it — either way, done.
          localStorage.removeItem(PENDING_WORKOUT_KEY);
        }
      } catch {
        /* offline — keep the stash for the next load */
      }
    })();
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
      highWaterElo,
      roundPoints: roundPointsRef.current,
      missed: missedRef.current,
      solved: solvedRef.current,
      seenIds: seenIdsRef.current,
      clientSessionId: clientSessionIdRef.current,
      queue,
      discipline: isFight ? 'fight' : 'puzzles',
      fight: isFight
        ? {
            fen: fightFenRef.current,
            moveSans: [...fightMovesRef.current],
            level: fightLevelRef.current,
            segStartMaterial: segStartMaterialRef.current,
            materialByRound: [...fightMaterialByRoundRef.current],
            wins: fightWinsRef.current,
            losses: fightLossesRef.current,
            draws: fightDrawsRef.current,
          }
        : undefined,
    });
  }, [phase, minutes, segIndex, secondsLeft, score, right, wrong, combo, puzzlePos, targetElo, highWaterElo, queue, isFight, fightFen]);

  // Pre-render the Fight Night share GIF (toughest solve) the moment the
  // result shows, so tapping Share is instant — same rhythm as the bout.
  useEffect(() => {
    if (phase !== 'done' || !finishResult?.toughestSolved) return;
    const { fen, moves, rating } = finishResult.toughestSolved;
    const frames = buildPuzzleShareFrames(fen, moves);
    if (frames.length === 0) return;
    const bout = {
      outcome: 'puzzle_win',
      username: '',
      moves: 0,
      rounds: 0,
      clock: '',
      headline: { big: 'SOLVED', rest: `a ${rating} puzzle`, win: true },
      stats: [
        [String(finishResult.right), 'SOLVED'],
        [String(finishResult.sessionPoints), 'POINTS'],
        [String(rating), 'TOUGHEST'],
      ] as [string, string][],
      stampText: 'SOLVED',
    };
    shareGifRef.current = {
      promise: import('@/lib/share/fight-night-gif').then(({ renderFightNightGif }) =>
        renderFightNightGif(frames, bout),
      ),
    };
  }, [phase, finishResult]);

  const shareToughest = async () => {
    if (!finishResult?.toughestSolved || !shareGifRef.current) return;
    setSharing(true);
    const headline = `Solved a ${finishResult.toughestSolved.rating} puzzle at Chess Boxing`;
    try {
      const blob = await shareGifRef.current.promise;
      const file = new File([blob], 'chess-boxing-solve.gif', { type: blob.type });
      const nav = navigator as Navigator & { canShare?: (d?: unknown) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: 'Chess Boxing', text: headline });
      } else {
        // No file-share (desktop): download the asset instead.
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
      }
    } catch {
      // AbortError (closed the sheet) or a render failure — nothing to show
    } finally {
      setSharing(false);
    }
  };

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

  useEffect(() => {
    puzzleShownAtRef.current = Date.now();
  }, [currentPuzzle]);

  const recordResult = useCallback((correct: boolean) => {
    if (!currentPuzzle) return;
    resultsRef.current.push({
      puzzleId: currentPuzzle.puzzleId || currentPuzzle.id,
      themes: currentPuzzle.themes,
      rating: currentPuzzle.rating,
      correct,
      timeMs: puzzleShownAtRef.current ? Date.now() - puzzleShownAtRef.current : 0,
    });
    puzzleShownAtRef.current = Date.now();
  }, [currentPuzzle]);

  const handleCorrect = useCallback(() => {
    const seenId = currentPuzzle?.puzzleId || currentPuzzle?.id;
    if (seenId) seenIdsRef.current.push(seenId);
    recordResult(true);
    const rating = currentPuzzle?.rating ?? 1000;
    // Scoring v2: pay is anchored to the session's high-water ELO. Farm-tier
    // puzzles (300+ below your peak) pay 1 flat and don't grow the combo —
    // tanking difficulty on purpose earns nothing.
    const farm = payFactor(rating, highWaterElo) === 0;
    let nextStreak = comboRef.current;
    if (!farm) {
      nextStreak = comboRef.current + 1;
      comboRef.current = nextStreak;
      bestComboRef.current = Math.max(bestComboRef.current, nextStreak);
      setCombo(nextStreak);
    }
    const pts = pointsForCorrectV2(rating, nextStreak, highWaterElo, firedUp);
    const rIdx = Math.floor(segIndex / ROUND_LENGTH);
    roundPointsRef.current[rIdx] = (roundPointsRef.current[rIdx] ?? 0) + pts;
    setScore((s) => s + pts);
    setRight((r) => r + 1);
    if (currentPuzzle) {
      solvedRef.current.push({
        puzzleId: currentPuzzle.puzzleId,
        id: currentPuzzle.id,
        fen: currentPuzzle.fen,
        moves: currentPuzzle.moves,
        rating: currentPuzzle.rating,
      });
    }
    setTargetElo((e) => Math.min(MAX_ELO, e + ELO_UP_ON_CORRECT));
    setPuzzlePos((p) => p + 1);
  }, [currentPuzzle, highWaterElo, firedUp, segIndex, recordResult]);

  const handleWrong = useCallback(() => {
    const seenId = currentPuzzle?.puzzleId || currentPuzzle?.id;
    if (seenId) seenIdsRef.current.push(seenId);
    recordResult(false);
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
    // No strike-out: a wrong answer costs the combo and eases the difficulty
    // target, but the round runs to the bell no matter how many you miss.
  }, [currentPuzzle, recordResult]);

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
      <div className={`h-full ${fromBox ? 'relative overflow-hidden bg-[#131a2e] flex flex-col' : 'overflow-auto bg-chess-page'}`}>
        {fromBox && <ArenaScene />}
        {fromBox && <ArenaBackButton />}
        {/* The hanging sign — same slot as RingHome so it never moves between windows. */}
        {fromBox && (
          <div className="pt-[max(0.9rem,env(safe-area-inset-top))] flex justify-center relative z-10 shrink-0">
            <div className="ring-swing"><GymSign /></div>
          </div>
        )}
        {/* fromBox = ONE fixed window, no scroll (native-shell rule): centered
            column, everything fits a 375×667 screen. */}
        <div className={fromBox ? 'flex-1 min-h-0 overflow-hidden relative z-10 flex flex-col' : 'contents'}>
        <div
          className={`max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 flex flex-col relative ${
            fromBox
              ? 'my-auto gap-2.5 pb-[max(1rem,env(safe-area-inset-bottom))]'
              : 'py-4 gap-3'
          }`}
        >
          {fromBox ? (
            /* Puzzle Boxing is the ranked discipline */
            <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-white/65 leading-snug">
              <span className="shrink-0 rounded-full bg-[#f6c445] text-[#3d2e00] px-2.5 py-[3px] text-[9px] font-black uppercase tracking-[0.14em] shadow-[0_2px_0_0_#b8860b]">
                Ranked
              </span>
              {FEATURE_FLAGS.LEADERBOARD_DAILY_SLOT
                ? 'Your best round today is your score on the boards.'
                : 'Every point you score here goes on the Global & Squad boards.'}
            </div>
          ) : (
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
          )}

          {resumable && (
            <div className={`rounded-2xl border-2 border-chess-blue/40 p-4 flex flex-col gap-3 ${fromBox ? 'bg-chess-blue/15' : 'bg-chess-blue/5'}`}>
              <div>
                <div className={`text-sm font-black ${fromBox ? 'text-white' : 'text-chess-text'}`}>Resume your workout?</div>
                <div className={`text-xs mt-0.5 ${fromBox ? 'text-white/60' : 'text-chess-text-muted'}`}>
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
                  className={`rounded-xl font-black text-sm px-4 py-3 active:translate-y-[1px] transition ${
                    fromBox
                      ? 'bg-white/10 border border-white/15 text-white/70'
                      : 'bg-chess-surface border border-slate-200 text-chess-text-muted'
                  }`}
                >
                  Start over
                </button>
              </div>
            </div>
          )}

          {/* One Round — bold title with two lines encompassing the bars.
              Hidden in the ring flow: one window, the rounds picker says it all. */}
          {!fromBox && (
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
          )}

          <div>
            <h2 className={`text-[11px] font-bold uppercase tracking-wide mb-2 text-center ${fromBox ? 'text-white/50' : 'text-chess-text-muted'}`}>
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
                        ? `border-chess-blue text-chess-blue ${fromBox ? 'bg-chess-blue/20' : 'bg-chess-blue/10'}`
                        : fromBox
                          ? 'border-white/15 bg-white/[0.07] text-white'
                          : 'border-slate-200 bg-chess-surface text-chess-text'
                    }`}
                  >
                    <span className="font-black text-lg">{rounds}</span>
                    <span className={`text-[10px] font-semibold mt-0.5 ${fromBox ? 'text-white/50' : 'text-chess-text-muted'}`}>
                      {m} min
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Discipline picker — puzzles (default) vs one continuous game.
              Hidden in the ring flow: Play vs Rookie is the other corner. */}
          {fightEnabled && !fromBox && (
            <div>
              <h2 className="text-[11px] font-bold text-chess-text-muted uppercase tracking-wide mb-2 text-center">
                Discipline
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    playButtonClick();
                    setDiscipline('puzzles');
                  }}
                  className={`rounded-xl border-2 px-3 py-2.5 min-h-[44px] transition flex flex-col items-center leading-tight ${
                    discipline === 'puzzles'
                      ? 'border-chess-blue bg-chess-blue/10 text-chess-blue'
                      : 'border-slate-200 bg-chess-surface text-chess-text'
                  }`}
                >
                  <span className="font-black text-sm">Puzzles</span>
                  <span className="text-[10px] font-semibold text-chess-text-muted mt-0.5">
                    Solve as many as you can
                  </span>
                </button>
                <button
                  onClick={() => {
                    playButtonClick();
                    setDiscipline('fight');
                  }}
                  className={`rounded-xl border-2 px-3 py-2.5 min-h-[44px] transition flex flex-col items-center leading-tight ${
                    discipline === 'fight'
                      ? 'border-chess-blue bg-chess-blue/10 text-chess-blue'
                      : 'border-slate-200 bg-chess-surface text-chess-text'
                  }`}
                >
                  <span className="font-black text-sm">Fight Rookie</span>
                  <span className="text-[10px] font-semibold text-chess-text-muted mt-0.5">
                    One game. It freezes while you train.
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Ring flow: the rules in three lines, dark, no header. */}
          {fromBox && (
            <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-3">
              <ul className="flex flex-col gap-1.5 text-xs font-bold text-white/85 leading-snug">
                <li className="flex items-center gap-2">
                  <span className="text-chess-green">✓</span> Harder puzzle = more points · streaks combo to ×2
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-chess-red">✗</span> 3 wrong in a round = round over
                </li>
                {FEATURE_FLAGS.LEADERBOARD_DAILY_SLOT && (
                  <li className="flex items-center gap-2">
                    <span className="text-[#f6c445]">★</span> One slot a day: only your best round scores — come back tomorrow for the next one
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Difficulty adapts — compact bullets */}
          {!fromBox && (
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
            {fightEnabled && discipline === 'fight' ? (
              <ul className="flex flex-col gap-1.5 text-sm font-bold text-amber-900">
                <li className="flex items-center gap-2">
                  <span className="text-chess-green">✓</span> One game vs Rookie, across every round
                </li>
                <li className="flex items-center gap-2">
                  <Icon path={ICONS.bolt} className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Board freezes while you exercise — like the real sport
                </li>
                <li className="flex items-center gap-2">
                  <Icon path={ICONS.bolt} className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Judges score each round on material you win
                </li>
                <li className="flex items-center gap-2">
                  <Icon path={ICONS.bolt} className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Checkmate Rookie = big bonus (she plays your /play level)
                </li>
              </ul>
            ) : (
            <ul className="flex flex-col gap-1.5 text-sm font-bold text-amber-900">
              <li className="flex items-center gap-2">
                <span className="text-chess-green">✓</span> Correct answer = ELO +60
              </li>
              <li className="flex items-center gap-2">
                <span className="text-chess-red">✗</span> 3 wrong in a round = round over
              </li>
              <li className="flex items-center gap-2">
                <Icon path={ICONS.bolt} className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                Harder puzzle = more points (10–45)
              </li>
              <li className="flex items-center gap-2">
                <Icon path={ICONS.bolt} className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                Solve a streak = combo up to ×2
              </li>
              <li className="flex items-center gap-2">
                <Icon path={ICONS.bolt} className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                Easy puzzles below your peak barely pay
              </li>
              {FEATURE_FLAGS.LEADERBOARD_DAILY_SLOT && (
                <li className="flex items-center gap-2">
                  <Icon path={ICONS.bolt} className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Leaderboard counts your best round each day
                </li>
              )}
            </ul>
            )}
          </div>
          )}

          <button
            onClick={begin}
            className="w-full rounded-2xl bg-chess-green hover:bg-chess-green-dark text-white font-black text-base py-3.5 shadow-sm transition"
          >
            Begin
          </button>
        </div>
        </div>
      </div>
    );
  }

  // ── DONE ──────────────────────────────────────────────────────────────────
  if (phase === 'done' && finishResult) {
    return (
      <div className="h-full bg-chess-page">
        {/* Fresh medals play OVER the results popup (z-110), sized to the
            moment — never extra rows inside the card. */}
        {finishResult.achievements.length > 0 && (
          <AchievementUnlockOverlay
            unlocks={finishResult.achievements}
            onDone={() => setFinishResult((r) => (r ? { ...r, achievements: [] } : r))}
          />
        )}
        <FightResultCard
          data={{
            kind: 'workout',
            sessionPoints: finishResult.sessionPoints,
            bestRoundPoints: finishResult.bestRoundPoints,
            lifetime: finishResult.lifetime,
            right: finishResult.right,
            wrong: finishResult.wrong,
            perfect: finishResult.perfect,
            perfectBonus: PERFECT_SESSION_BONUS,
            isPersonalBest: finishResult.isPersonalBest,
            previousBest: finishResult.previousBest,
            punches: punchTotal,
            rookieLine: finishResult.rookieLine,
            fightSummary: finishResult.fightSummary,
            fightWon: finishResult.fightWon,
          }}
          needsSignIn={finishResult.needsSignIn}
          showLeaderboard={FEATURE_FLAGS.LEADERBOARDS && inBoxShell}
          leaderboardLabel="See the leaderboard"
          onSignIn={() => router.push('/auth/login?redirect=/workout')}
          onLeaderboard={() => router.push('/leaderboard')}
          onDone={() => router.push('/profile')}
          sharing={sharing}
          onShare={finishResult.toughestSolved ? shareToughest : undefined}
          nextMedal={finishResult.nextMedal}
        />
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
            {isChess && firedUp && (
              <div className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 bg-amber-500/15 text-amber-600">
                <Icon path={ICONS.bolt} className="w-4 h-4" />
                <span className="text-sm font-black leading-none whitespace-nowrap">
                  Fired Up
                </span>
              </div>
            )}
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
          <div className="flex items-center justify-between mb-2">
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
        {isChess && isFight ? (
          <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-5 flex flex-col gap-3">
            {/* Rookie's canned line (resume / game-result) or the matchup */}
            <p className="text-center text-sm font-semibold text-chess-text-muted leading-snug">
              {fightLine ?? `Fight Rookie · Level ${fightLevel}`}
            </p>
            <ChessPathBoard
              options={{
                position: fightFen,
                boardOrientation: 'white',
                onPieceDrop: (args: any) => {
                  const from = args.sourceSquare as Square;
                  const to = args.targetSquare as Square;
                  // Rookie's turn → queue a premove (the drag snaps back; the
                  // premove highlight is what shows the move is waiting).
                  if (rookieThinking || fightGame?.turn() !== 'w') {
                    return onFightPremoveDrop(from, to);
                  }
                  return doFightMove(from, to);
                },
                onSquareClick: (args: any) => onFightSquareClick(args.square as Square),
                squareStyles: fightSqStyles,
                animationDurationInMs: FIGHT_ANIM_MS,
              }}
            />
            {/* Status — fixed height so the board never shifts */}
            <div className="text-center h-5">
              {rookieThinking ? (
                <span className="text-xs font-medium text-chess-text-muted">
                  Rookie is thinking…
                </span>
              ) : fightGame && fightGame.turn() === 'w' ? (
                <span className="text-xs font-semibold text-chess-green">Your move</span>
              ) : null}
            </div>
          </div>
        ) : isChess ? (
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
                {isFight && fightLine ? fightLine : pick(ROOKIE_LINES.break, lineSeed)}
              </p>
            </div>
            {isFight && <FrozenFightBoard fen={fightFen} />}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center gap-5">
            {FEATURE_FLAGS.WORKOUT_PUNCH_CAM && punchCamOn ? (
              <>
                {/* No big clock here — the header timer already shows the
                    countdown, and the camera needs the height. */}
                {FEATURE_FLAGS.WORKOUT_COMBO_CALLS && (
                  <ComboCoach key={`coach-${segIndex}`} segmentSeconds={current.seconds} />
                )}
                <PunchTracker
                  key={segIndex}
                  autoStart
                  onPunch={onPunch}
                  className="w-full max-w-sm"
                />
                <button
                  onClick={() => {
                    playButtonClick();
                    setPunchCamOn(false);
                    if (typeof window !== 'undefined')
                      window.localStorage.setItem('cp_punch_cam', '0');
                  }}
                  className="text-sm font-semibold text-chess-text-muted underline underline-offset-2 min-h-[44px]"
                >
                  Turn off camera
                </button>
                {isFight && <FrozenFightBoard fen={fightFen} />}
              </>
            ) : quadFightActive ? (
              // Quadrant Fight (beta): opt-in camera game for the exercise
              // segment. Visual/fitness layer ONLY — the workout's own timer,
              // scoring, and completion flow run exactly as without it. No
              // extra clock here: the segment timer is already at the top,
              // and the game card needs the height to fit without scrolling.
              <>
                <QuadrantFight
                  compact
                  onClose={() => toggleQuadFight(false)}
                  durationMs={current.seconds * 1000}
                  onFinish={(stats: FightStats) => setFightCard({ segIndex, stats })}
                />
                {fightCard?.segIndex === segIndex && (
                  <p className="text-xs font-semibold text-chess-text-muted tabular-nums">
                    {fightCard.stats.punchesLanded} landed · {fightCard.stats.dodgesMade} dodged ·{' '}
                    {fightCard.stats.hitsTaken} hits taken
                  </p>
                )}
              </>
            ) : (
              <>
                {!FEATURE_FLAGS.WORKOUT_COMBO_CALLS && (
                  <Icon path={ICONS[iconFor(current.kind)]} className="w-20 h-20 text-chess-green" />
                )}
                <div className="text-7xl font-black text-chess-text tabular-nums">
                  {fmtTime(secondsLeft)}
                </div>
                {FEATURE_FLAGS.WORKOUT_COMBO_CALLS ? (
                  <ComboCoach key={`coach-${segIndex}`} segmentSeconds={current.seconds} />
                ) : (
                  <div>
                    <h2 className="text-2xl font-black text-chess-text">
                      {promptFor(current.kind)}
                    </h2>
                    <p className="text-chess-text-muted mt-3 max-w-xs text-sm leading-relaxed">
                      {isFight && fightLine ? fightLine : pick(ROOKIE_LINES.workout, lineSeed)}
                    </p>
                  </div>
                )}
                {isFight && <FrozenFightBoard fen={fightFen} />}
                {FEATURE_FLAGS.WORKOUT_PUNCH_CAM && (
                  <button
                    onClick={() => {
                      playButtonClick();
                      setPunchCamOn(true);
                      if (typeof window !== 'undefined')
                        window.localStorage.setItem('cp_punch_cam', '1');
                    }}
                    className="flex items-center gap-2 rounded-xl border-2 border-chess-green text-chess-green font-bold px-5 py-3 min-h-[44px] hover:bg-chess-green/5 transition"
                  >
                    Count my punches
                  </button>
                )}
                {inBoxShell && (
                  <button
                    onClick={() => {
                      playButtonClick();
                      toggleQuadFight(true);
                    }}
                    className="text-sm font-semibold text-chess-text-muted underline underline-offset-2 min-h-[44px] px-4"
                  >
                    Quadrant Fight (beta)
                  </button>
                )}
              </>
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
