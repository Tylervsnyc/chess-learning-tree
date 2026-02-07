import type { Progress } from '@/hooks/useProgress';

/**
 * Server-side progress data structure (from Supabase)
 * currentPosition tracks where user is in their journey (updated on lesson complete / level test pass)
 */
export interface ServerProgress {
  completedLessons: string[];
  currentStreak: number;
  lastActivityDate: string | null;
  lessonsCompletedToday: number;
  lastLessonDate: string | null;
  unlockedLevels: number[];
  currentPosition: string;
}

/**
 * Merge local and server progress with additive strategy:
 * - Union of completed lessons (ONLY if server has data - prevents stale localStorage)
 * - Max of streaks
 * - Server wins for currentPosition (explicit stored position)
 * - Dedupe puzzle attempts by puzzleId + timestamp
 */
export function mergeProgress(
  local: Progress,
  server: ServerProgress
): Progress {
  // IMPORTANT: If server has no completed lessons, this is likely a new user.
  // Don't merge from localStorage to prevent stale data from contaminating new accounts.
  // If server has data, union both (supports offline usage).
  const serverHasLessons = server.completedLessons.length > 0;
  const completedLessons = serverHasLessons
    ? Array.from(new Set([...local.completedLessons, ...server.completedLessons]))
    : server.completedLessons; // Use server's empty array for new users

  // Max of streaks (for new users, use server defaults)
  const currentStreak = serverHasLessons
    ? Math.max(local.currentStreak, server.currentStreak)
    : server.currentStreak;

  // Latest activity date (for new users, use server; otherwise compare)
  const lastActivityDate = serverHasLessons
    ? (!local.lastActivityDate
        ? server.lastActivityDate
        : !server.lastActivityDate
          ? local.lastActivityDate
          : local.lastActivityDate > server.lastActivityDate
            ? local.lastActivityDate
            : server.lastActivityDate)
    : server.lastActivityDate;

  // Merge unlocked levels (only union if server has data, else use server's defaults)
  const unlockedLevels = serverHasLessons
    ? Array.from(new Set([...local.unlockedLevels, ...(server.unlockedLevels || [1])])).sort((a, b) => a - b)
    : (server.unlockedLevels || [1]);

  // Server wins for daily count (can't bypass by clearing localStorage)
  // But reset if it's a new day
  const today = new Date().toISOString().split('T')[0];
  const serverIsNewDay = server.lastLessonDate !== today;
  const lessonsCompletedToday = serverIsNewDay ? 0 : (server.lessonsCompletedToday ?? local.lessonsCompletedToday);

  // Use server's last lesson date (for new users, don't inherit local date)
  const lastLessonDate = serverHasLessons
    ? (server.lastLessonDate ?? local.lastLessonDate)
    : server.lastLessonDate;

  // currentPosition merge strategy:
  // - If local is at default '1.1.1' and server has real progress, use server (returning user)
  // - Otherwise, local wins (prevents race condition where GET returns before POST completes)
  const localIsDefault = !local.currentPosition || local.currentPosition === '1.1.1';
  const serverHasProgress = server.currentPosition && server.currentPosition !== '1.1.1';
  const currentPosition = (localIsDefault && serverHasProgress)
    ? server.currentPosition
    : (local.currentPosition || server.currentPosition || '1.1.1');

  return {
    completedLessons,
    puzzleAttempts: serverHasLessons ? local.puzzleAttempts : [], // Clear for new users
    totalPuzzlesAttempted: local.totalPuzzlesAttempted, // Keep local count
    totalPuzzlesSolved: local.totalPuzzlesSolved, // Keep local count
    currentStreak,
    lastActivityDate,
    currentPosition, // Local wins unless at default (prevents POST/GET race)
    lessonsCompletedToday, // Server value takes priority
    lastLessonDate,
    unlockedLevels, // Merged from both local and server
  };
}

// Re-export from curriculum registry for backwards compatibility
export { getTreeIdFromLessonId } from './curriculum-registry';
