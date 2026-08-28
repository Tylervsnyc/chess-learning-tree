/**
 * Leftover puzzle cache for the Chess Boxing workout.
 *
 * Every session fetches ~42 puzzles and shows maybe half of them — the queue
 * ramps to 2000 ELO but the adaptive target starts at 800 every time, so the
 * top of the ramp is fetched and never reached. Those leftovers are already
 * filtered against the user's seen-history, so they are the perfect warm start:
 * the next session paints a board from localStorage on the first frame and
 * merges the network queue in when it lands.
 *
 * Best-effort only. A miss (first run, cleared storage, private window) just
 * means the old behavior — wait for the fetch.
 */
import type { WorkoutPuzzleData } from '@/components/workout/WorkoutPuzzle';

const KEY = 'workout-queue-cache';
const VERSION = 1;
/** Beyond this the user's seen-history has likely moved on; refetch instead. */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
/** Plenty for the first minute of a round; keeps the write small. */
const MAX_CACHED = 40;

interface CachedQueue {
  v: number;
  savedAt: number;
  puzzles: WorkoutPuzzleData[];
}

export function saveQueueCache(puzzles: WorkoutPuzzleData[]): void {
  try {
    if (puzzles.length === 0) {
      localStorage.removeItem(KEY);
      return;
    }
    const payload: CachedQueue = {
      v: VERSION,
      savedAt: Date.now(),
      puzzles: puzzles.slice(0, MAX_CACHED),
    };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // storage full / unavailable — the cache is an optimization, not state
  }
}

export function loadQueueCache(): WorkoutPuzzleData[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CachedQueue;
    if (parsed.v !== VERSION) return [];
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) return [];
    return Array.isArray(parsed.puzzles) ? parsed.puzzles : [];
  } catch {
    return [];
  }
}

/** Puzzles from `queue` the user has not been shown, newest selection first. */
export function unshown(
  queue: WorkoutPuzzleData[],
  seenIds: string[],
): WorkoutPuzzleData[] {
  const seen = new Set(seenIds);
  return queue.filter((p) => !seen.has(p.puzzleId || p.id || ''));
}

/** Append `incoming` to `existing`, dropping duplicates by puzzle id. */
export function mergeQueues(
  existing: WorkoutPuzzleData[],
  incoming: WorkoutPuzzleData[],
): WorkoutPuzzleData[] {
  if (existing.length === 0) return incoming;
  const have = new Set(existing.map((p) => p.puzzleId || p.id || ''));
  return [...existing, ...incoming.filter((p) => !have.has(p.puzzleId || p.id || ''))];
}
