/**
 * Share string for Rookie's Run.
 *
 * Format: `Rookie's Run · YYYY-MM-DD · {score} · {moves} moves · {time}s`
 * Score is omitted on a loss (no `score` arg).
 */

export interface ShareInput {
  iso: string; // YYYY-MM-DD
  moves: number;
  elapsedMs: number;
  score?: number;
}

export function buildShareString({
  iso,
  moves,
  elapsedMs,
  score,
}: ShareInput): string {
  const seconds = Math.max(0, Math.round(elapsedMs / 1000));
  const moveLabel = moves === 1 ? 'move' : 'moves';
  const scorePart =
    score !== undefined ? ` · ${score.toLocaleString()} pts` : '';
  return `Rookie's Run · ${iso}${scorePart} · ${moves} ${moveLabel} · ${seconds}s`;
}
