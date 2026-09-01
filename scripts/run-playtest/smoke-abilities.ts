/**
 * Phase-1 smoke check: bots must be able to CAST every ability.
 * Runs a filtered sweep on the ability-gated run (abilities-v2: convert/
 * drones/squad only) plus a couple of hazard-walled runs, and prints win
 * rates. Pre-fix, these levels false-flagged near 0% because bots could be
 * offered convert/drones/squad but never cast them.
 *
 * Usage: npx tsx scripts/run-playtest/smoke-abilities.ts [trials]
 */
import { runSweep } from './sweep';
import type { Outcome } from './types';

const trials = parseInt(process.argv[2] ?? '20', 10);

for (const filter of ['abilities-v2']) {
  console.log(`\n=== levelFilter: ${filter} · ${trials} trials ===`);
  const results: Outcome[] = runSweep({ trials, levelFilter: filter });
  const byKey = new Map<string, Outcome[]>();
  for (const r of results) {
    const key = `${r.levelId}|${r.tier}`;
    (byKey.get(key) ?? byKey.set(key, []).get(key)!).push(r);
  }
  const lines = [...byKey.entries()]
    .map(([key, arr]) => {
      const wins = arr.filter((a) => a.win).length;
      return `${key}\t${wins}/${arr.length}\t${((wins / arr.length) * 100).toFixed(0)}%`;
    })
    .sort();
  for (const l of lines) console.log(l);
}
