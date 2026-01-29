import type { Progress, PuzzleAttempt, ThemeStats } from '@/hooks/useProgress';

/**
 * Server-side progress data structure (from Supabase)
 */
export interface ServerProgress {
  completedLessons: string[];
  themePerformance: Record<string, ThemeStats>;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string | null;
  // Progress tracking fields
  currentLessonId: string | null;
  currentLevel: number;
  lessonsCompletedToday: number;
  lastLessonDate: string | null;
  unlockedLevels: number[];
  // Note: puzzleAttempts are stored separately and queried on demand
}

/**
 * Merge local and server progress with additive strategy:
 * - Union of completed lessons
 * - Max of streaks
 * - Union theme stats (max of each theme's attempts/solved)
 * - Dedupe puzzle attempts by puzzleId + timestamp
 */
export function mergeProgress(
  local: Progress,
  server: ServerProgress
): Progress {
  // Union of completed lessons
  const completedLessons = Array.from(
    new Set([...local.completedLessons, ...server.completedLessons])
  );

  // Merge theme performance (take max of each stat)
  const themePerformance: Record<string, ThemeStats> = { ...local.themePerformance };
  for (const [theme, serverStats] of Object.entries(server.themePerformance)) {
    const localStats = themePerformance[theme];
    if (!localStats) {
      themePerformance[theme] = serverStats;
    } else {
      // Take max of attempts and solved
      themePerformance[theme] = {
        attempts: Math.max(localStats.attempts, serverStats.attempts),
        solved: Math.max(localStats.solved, serverStats.solved),
        puzzleIds: Array.from(
          new Set([...localStats.puzzleIds, ...serverStats.puzzleIds])
        ),
      };
    }
  }

  // Calculate totals from theme performance
  let totalPuzzlesAttempted = 0;
  let totalPuzzlesSolved = 0;
  for (const stats of Object.values(themePerformance)) {
    totalPuzzlesAttempted += stats.attempts;
    totalPuzzlesSolved += stats.solved;
  }

  // Max of streaks
  const currentStreak = Math.max(local.currentStreak, server.currentStreak);
  const bestStreak = Math.max(local.bestStreak, server.bestStreak);

  // Latest played date (compare as strings since they're ISO dates)
  const lastPlayedDate =
    !local.lastPlayedDate
      ? server.lastPlayedDate
      : !server.lastPlayedDate
        ? local.lastPlayedDate
        : local.lastPlayedDate > server.lastPlayedDate
          ? local.lastPlayedDate
          : server.lastPlayedDate;

  // Merge unlocked levels (union of local and server)
  const unlockedLevels = Array.from(
    new Set([...local.unlockedLevels, ...(server.unlockedLevels || [1])])
  ).sort((a, b) => a - b);

  // Server wins for daily count (can't bypass by clearing localStorage)
  // But reset if it's a new day
  const today = new Date().toISOString().split('T')[0];
  const serverIsNewDay = server.lastLessonDate !== today;
  const lessonsCompletedToday = serverIsNewDay ? 0 : (server.lessonsCompletedToday ?? local.lessonsCompletedToday);

  // Use server's last lesson date if available
  const lastLessonDate = server.lastLessonDate ?? local.lastLessonDate;

  return {
    completedLessons,
    puzzleAttempts: local.puzzleAttempts, // Keep local attempts, server syncs separately
    totalPuzzlesAttempted,
    totalPuzzlesSolved,
    currentStreak,
    bestStreak,
    lastPlayedDate,
    themePerformance,
    startingLessonId: local.startingLessonId, // Keep local starting lesson
    currentLessonId: server.currentLessonId ?? local.currentLessonId ?? null, // Server wins for current lesson
    lessonsCompletedToday, // Server value takes priority
    lastLessonDate,
    unlockedLevels, // Merged from both local and server
  };
}

/**
 * Deduplicate puzzle attempts by puzzleId + approximate timestamp
 * (within 1 second considered duplicate)
 */
export function dedupePuzzleAttempts(attempts: PuzzleAttempt[]): PuzzleAttempt[] {
  const seen = new Set<string>();
  const result: PuzzleAttempt[] = [];

  for (const attempt of attempts) {
    // Round timestamp to nearest second for deduplication
    const key = `${attempt.puzzleId}-${Math.floor(attempt.timestamp / 1000)}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(attempt);
    }
  }

  return result;
}

/**
 * Extract tree_id from lesson_id (e.g., "1.2" -> "400-800", "2.3" -> "800-1200")
 */
export function getTreeIdFromLessonId(lessonId: string): string {
  const level = parseInt(lessonId.split('.')[0], 10);
  switch (level) {
    case 1:
      return '400-800';
    case 2:
      return '800-1200';
    case 3:
      return '1200+';
    default:
      return '400-800';
  }
}
