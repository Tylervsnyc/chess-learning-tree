/**
 * Seedable PRNG for sims. Wraps the engine's mulberry32.
 */

import { mulberry32 } from '../../../lib/run/seed';

/** Deterministic 32-bit hash from a string. FNV-1a. */
export function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** Build an RNG from a string seed. */
export function rngFromString(seed: string): () => number {
  return mulberry32(hashString(seed));
}

/**
 * Sample an index from a weighted list, where weights are the eval scores
 * (higher = more likely). Uses softmax-style sampling with temperature.
 *
 * Temperature near 0 → always pick top. Temperature near infinity → uniform.
 */
export function softmaxSample(
  scores: number[],
  temperature: number,
  rng: () => number,
): number {
  if (scores.length === 0) return -1;
  if (scores.length === 1) return 0;
  if (temperature <= 0) {
    // Argmax
    let best = 0;
    for (let i = 1; i < scores.length; i++) if (scores[i] > scores[best]) best = i;
    return best;
  }
  const max = Math.max(...scores);
  const weights = scores.map((s) => Math.exp((s - max) / temperature));
  const sum = weights.reduce((a, b) => a + b, 0);
  let r = rng() * sum;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}
