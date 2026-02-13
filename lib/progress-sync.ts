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
 * Merge local and server progress with additive (union) strategy:
 * - Always union completed lessons from both sources
 * - Max of streaks
 * - Local wins for currentPosition (prevents POST/GET race)
 * - Union of unlocked levels
 *
 * This prevents data loss when the server is behind due to sync failures
 * (e.g., lesson completions rejected by strict validation).
 * If both are empty (genuinely new user), union is empty — safe.
 */
export function mergeProgress(
  local: Progress,
  server: ServerProgress
): Progress {
  // Always union completed lessons from both sources
  // This prevents data loss when server is behind due to sync failures
  const completedLessons = Array.from(
    new Set([...local.completedLessons, ...server.completedLessons])
  );

  // Max of streaks from both sources
  const currentStreak = Math.max(local.currentStreak, server.currentStreak);

  // Latest activity date from either source
  const lastActivityDate = !local.lastActivityDate
    ? server.lastActivityDate
    : !server.lastActivityDate
      ? local.lastActivityDate
      : local.lastActivityDate > server.lastActivityDate
        ? local.lastActivityDate
        : server.lastActivityDate;

  // Union of unlocked levels from both sources
  const unlockedLevels = Array.from(
    new Set([...local.unlockedLevels, ...(server.unlockedLevels || [1])])
  ).sort((a, b) => a - b);

  // Server wins for daily count (can't bypass by clearing localStorage)
  // But reset if it's a new day
  const today = new Date().toISOString().split('T')[0];
  const serverIsNewDay = server.lastLessonDate !== today;
  const lessonsCompletedToday = serverIsNewDay ? 0 : (server.lessonsCompletedToday ?? local.lessonsCompletedToday);

  // Latest lesson date from either source
  const lastLessonDate = !local.lastLessonDate
    ? server.lastLessonDate
    : !server.lastLessonDate
      ? local.lastLessonDate
      : local.lastLessonDate > server.lastLessonDate
        ? local.lastLessonDate
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
    puzzleAttempts: local.puzzleAttempts, // Keep local puzzle attempts
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

