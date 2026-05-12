/**
 * Rookie's Run — local history of finished runs.
 *
 * Wordle-style aggregate stored in localStorage. One entry per finished run
 * (win or loss). Powers the results-screen distribution chart and streaks.
 */

const STORAGE_KEY = 'rookies-run-history-v1';

export interface RunHistoryEntry {
  iso: string; // YYYY-MM-DD the run was finished
  runId: string;
  levelReached: number; // 1-indexed; furthest level the player started/cleared
  totalLevels: number;
  completed: boolean; // true if all levels cleared
}

export interface RunStats {
  played: number;
  wins: number;
  winPct: number; // 0-100, rounded
  currentStreak: number;
  maxStreak: number;
  /** Map of levelReached -> count, 1..maxLevel. */
  distribution: Record<number, number>;
  /** Max count across the distribution (for bar scaling). */
  maxBucket: number;
}

function safeRead(): RunHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is RunHistoryEntry =>
        e &&
        typeof e.iso === 'string' &&
        typeof e.runId === 'string' &&
        typeof e.levelReached === 'number' &&
        typeof e.totalLevels === 'number' &&
        typeof e.completed === 'boolean',
    );
  } catch {
    return [];
  }
}

function safeWrite(entries: RunHistoryEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* quota or disabled storage — ignore */
  }
}

export function readHistory(): RunHistoryEntry[] {
  return safeRead();
}

/**
 * Append a new entry. Idempotent within a single (iso, runId) — replays the
 * same day on the same run overwrite the prior entry so stats reflect the
 * latest attempt.
 */
export function recordRun(entry: RunHistoryEntry): RunHistoryEntry[] {
  const entries = safeRead().filter(
    (e) => !(e.iso === entry.iso && e.runId === entry.runId),
  );
  entries.push(entry);
  safeWrite(entries);
  return entries;
}

/** Compute Wordle-style stats from a history list. */
export function computeStats(entries: RunHistoryEntry[]): RunStats {
  const played = entries.length;
  const wins = entries.filter((e) => e.completed).length;
  const winPct = played === 0 ? 0 : Math.round((wins / played) * 100);

  // Streaks by chronological iso order. A "win" extends the streak; any loss
  // breaks it. This matches Wordle's behavior.
  const sorted = [...entries].sort((a, b) => a.iso.localeCompare(b.iso));
  let cur = 0;
  let max = 0;
  for (const e of sorted) {
    if (e.completed) {
      cur += 1;
      if (cur > max) max = cur;
    } else {
      cur = 0;
    }
  }
  const currentStreak = cur;
  const maxStreak = max;

  const distribution: Record<number, number> = {};
  for (const e of entries) {
    distribution[e.levelReached] = (distribution[e.levelReached] ?? 0) + 1;
  }
  const maxBucket = Object.values(distribution).reduce(
    (m, n) => (n > m ? n : m),
    0,
  );

  return { played, wins, winPct, currentStreak, maxStreak, distribution, maxBucket };
}
