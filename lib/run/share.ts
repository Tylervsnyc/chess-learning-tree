/**
 * Share string for Rookies Run (Wordle-style).
 *
 * Format: `Rookies Run · YYYY-MM-DD · Level X/N · streak Y`
 */

export interface ShareInput {
  iso: string; // YYYY-MM-DD
  levelReached: number;
  totalLevels: number;
  completed: boolean;
  currentStreak: number;
}

export function buildShareString({
  iso,
  levelReached,
  totalLevels,
  completed,
  currentStreak,
}: ShareInput): string {
  const result = completed
    ? `${totalLevels}/${totalLevels} ✓`
    : `Level ${levelReached}/${totalLevels}`;
  const streakPart =
    currentStreak > 1 ? ` · streak ${currentStreak}` : '';
  return `Rookies Run · ${iso} · ${result}${streakPart}`;
}
