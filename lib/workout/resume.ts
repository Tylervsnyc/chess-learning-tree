/**
 * Persist an in-progress workout so an OS kill (tab evicted under memory
 * pressure, browser swiped away) can resume instead of restarting.
 *
 * Backgrounding alone (screen lock / phone call) does NOT need this — the
 * countdown is a chained setTimeout that simply freezes and resumes (the
 * chosen "pause & resume" behavior). This is only the safety net for when
 * the page is actually torn down and reloaded.
 *
 * localStorage (not sessionStorage) so it survives a full tab close. Guarded
 * by an age limit so a long-abandoned workout never silently resumes.
 */
import type { WorkoutPuzzleData } from '@/components/workout/WorkoutPuzzle';

const KEY = 'workout-in-progress';
const VERSION = 7; // bumped: fight rounds — snapshot may carry the frozen game
const MAX_AGE_MS = 3 * 60 * 60 * 1000; // 3 hours

/** Minimal frozen-game state for a fight-rounds session (WORKOUT_FIGHT_ROUNDS). */
export interface FightResumeState {
  /** Position when the snapshot was taken — a fresh Chess(fen) restores it. */
  fen: string;
  /** SAN move list so far (feeds Rookie's opening book after a resume). */
  moveSans: string[];
  /** Rookie's level for this session (the matched /play level, 1-10). */
  level: number;
  /** White's material lead at the current scoring segment's start. */
  segStartMaterial: number;
  /** Material judges' points already banked per round (per-round cap). */
  materialByRound: number[];
  /** Session game results so far (auto-rematch means multiple games). */
  wins: number;
  losses: number;
  draws: number;
}

export interface WorkoutResumeState {
  v: number;
  savedAt: number;
  minutes: number;
  segIndex: number;
  secondsLeft: number;
  score: number;
  right: number;
  wrong: number;
  combo: number;
  puzzlePos: number;
  /** Current adaptive difficulty target (ELO) — climbs on correct, drops on wrong. */
  targetElo: number;
  /** Highest targetElo reached this session — the scoring v2 anti-sandbag anchor. */
  highWaterElo: number;
  /** Puzzle points earned per round (index = round), for best-round tracking. */
  roundPoints: number[];
  missed: WorkoutPuzzleData[];
  /** Solved this session (for the toughest-solve share card). Optional: older snapshots lack it. */
  solved?: WorkoutPuzzleData[];
  /** Ids of every puzzle shown so far, so finish records them after a resume. */
  seenIds: string[];
  /** Idempotency key for this workout, so a resumed-then-finished session can't double-award points. */
  clientSessionId: string;
  /** The exact puzzle queue, so resume lands on the same puzzle. */
  queue: WorkoutPuzzleData[];
  /** 'fight' = one continuous game vs Rookie. Absent/undefined = puzzles. */
  discipline?: 'puzzles' | 'fight';
  /** Frozen game state — present only for fight sessions. */
  fight?: FightResumeState;
}

export function saveResume(state: Omit<WorkoutResumeState, 'v' | 'savedAt'>): void {
  try {
    const payload: WorkoutResumeState = { v: VERSION, savedAt: Date.now(), ...state };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // storage full / unavailable — resume is best-effort
  }
}

export function loadResume(): WorkoutResumeState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as WorkoutResumeState;
    if (data?.v !== VERSION) return null;
    if (typeof data.savedAt !== 'number' || Date.now() - data.savedAt > MAX_AGE_MS) {
      clearResume();
      return null;
    }
    // Must be a genuinely mid-session state.
    if (data.segIndex < 0 || data.secondsLeft <= 0) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearResume(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
