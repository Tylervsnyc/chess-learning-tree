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
const VERSION = 3; // bumped: snapshot now includes the seen-puzzle id list
const MAX_AGE_MS = 3 * 60 * 60 * 1000; // 3 hours

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
  missed: WorkoutPuzzleData[];
  /** Ids of every puzzle shown so far, so finish records them after a resume. */
  seenIds: string[];
  /** The exact puzzle queue, so resume lands on the same puzzle. */
  queue: WorkoutPuzzleData[];
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
