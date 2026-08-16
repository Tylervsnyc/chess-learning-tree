/**
 * Share string for Rookie's Run (Wordle-style).
 *
 * Format: `Rookie's Run · YYYY-MM-DD · Level X/N · streak Y`
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
  return `Rookie's Run · ${iso} · ${result}${streakPart}`;
}
