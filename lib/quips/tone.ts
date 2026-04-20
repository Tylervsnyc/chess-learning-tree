// CHE-290: Rookie personality gauge tone mapping.
// Maps the 1-5 attitude slider to the three tone buckets used by the
// speech priority queue's `LineConditions.tone` filter.

export type Tone = 'polite' | 'baseline' | 'spicy';

/**
 * Map an attitude level (1-5) to a Rookie tone bucket.
 *
 * - 1-2 => polite (soft, encouraging Rookie)
 * - 3   => baseline (default — the tone we ship to everyone)
 * - 4-5 => spicy (sharp, trash-talky Rookie)
 *
 * Out-of-range inputs clamp into the extremes.
 */
export function toneForLevel(level: number): Tone {
  if (level <= 2) return 'polite';
  if (level === 3) return 'baseline';
  return 'spicy';
}
