// Cached dynamic loader for the unified quip pool (CHE-373).
//
// QUIP_POOL transitively pulls ~282KB of speech data (line-pool +
// rookie-touchpoints), so nothing in a page-level bundle should import
// `lib/quips/quip-pool` statically. Load it here on first use instead —
// the module is fetched once and cached for every later caller.

import type { SpeechLine } from '@/lib/speech/priority-queue';

type QuipPoolModule = typeof import('@/lib/quips/quip-pool');

let loaded: QuipPoolModule | null = null;
let inFlight: Promise<QuipPoolModule> | null = null;

/** Load the full quip-pool module (pool + landing utils). Cached after first call. */
export function loadQuipPoolModule(): Promise<QuipPoolModule> {
  if (loaded) return Promise.resolve(loaded);
  if (!inFlight) {
    inFlight = import('@/lib/quips/quip-pool').then((mod) => {
      loaded = mod;
      return mod;
    });
  }
  return inFlight;
}

/** Load the unified quip pool. Cached after first call. */
export function getQuipPool(): Promise<SpeechLine[]> {
  return loadQuipPoolModule().then((mod) => mod.QUIP_POOL);
}
