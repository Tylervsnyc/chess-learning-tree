/**
 * Smoke-test the three new runs (hourglass, bishops-cathedral,
 * royal-procession) against T3/T4/T5 bots. Prints per-level win rates.
 *
 * Usage: npx tsx scripts/run-playtest/_smoke-new-runs.ts [trials]
 */

import { runSweep } from './sweep';
import type { Outcome, TierId } from './types';

const RUN_IDS = ['hourglass', 'bishops-cathedral', 'royal-procession'];
const TIERS: TierId[] = ['T3', 'T4', 'T5'];

const trials = process.argv[2] ? parseInt(process.argv[2], 10) : 50;

function pct(arr: Outcome[]): string {
  if (arr.length === 0) return '-';
  const wins = arr.filter((a) => a.win).length;
  return `${Math.round((wins / arr.length) * 100)}%`;
}

const t0 = Date.now();

for (const runId of RUN_IDS) {
  console.log(`\n=== ${runId} (${trials} trials/tier) ===`);
  const results = runSweep({ trials, levelFilter: runId });
  // Make sure we only got matches for THIS run (substring-safe).
  const owned = results.filter((r) => r.runId === runId);

  // Group by levelIndex.
  const byLevel = new Map<number, Map<TierId, Outcome[]>>();
  for (const r of owned) {
    if (!byLevel.has(r.levelIndex)) byLevel.set(r.levelIndex, new Map());
    const tierMap = byLevel.get(r.levelIndex)!;
    if (!tierMap.has(r.tier)) tierMap.set(r.tier, []);
    tierMap.get(r.tier)!.push(r);
  }

  console.log('Lvl  T3    T4    T5');
  const indices = [...byLevel.keys()].sort((a, b) => a - b);
  let t3Sum = 0,
    t4Sum = 0,
    t5Sum = 0,
    count = 0;
  for (const idx of indices) {
    const tierMap = byLevel.get(idx)!;
    const t3 = pct(tierMap.get('T3') ?? []);
    const t4 = pct(tierMap.get('T4') ?? []);
    const t5 = pct(tierMap.get('T5') ?? []);
    console.log(
      `${String(idx).padStart(3)}  ${t3.padStart(4)}  ${t4.padStart(4)}  ${t5.padStart(4)}`,
    );
    const winRate = (arr: Outcome[]): number =>
      arr.length ? arr.filter((a) => a.win).length / arr.length : 0;
    t3Sum += winRate(tierMap.get('T3') ?? []);
    t4Sum += winRate(tierMap.get('T4') ?? []);
    t5Sum += winRate(tierMap.get('T5') ?? []);
    count++;
  }
  console.log(
    `mean  ${Math.round((t3Sum / count) * 100)}%  ${Math.round(
      (t4Sum / count) * 100,
    )}%  ${Math.round((t5Sum / count) * 100)}%`,
  );
}

const dt = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`\n[done in ${dt}s]`);
