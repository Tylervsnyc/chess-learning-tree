// Lazy-loaded canvas-confetti (CHE-376).
// canvas-confetti is ~35KB and only needed at celebration moments —
// load it on first fire instead of bundling it into every page.
import type confetti from 'canvas-confetti';

type Confetti = typeof confetti;

let confettiPromise: Promise<Confetti> | null = null;

/** Load (and cache) the canvas-confetti module. Resolves instantly after first load. */
export function getConfetti(): Promise<Confetti> {
  if (!confettiPromise) {
    confettiPromise = import('canvas-confetti').then((mod) => mod.default);
  }
  return confettiPromise;
}

/** Fire a confetti burst, lazy-loading the library on first use. */
export async function fireConfetti(opts?: confetti.Options): Promise<void> {
  const fire = await getConfetti();
  fire(opts);
}
