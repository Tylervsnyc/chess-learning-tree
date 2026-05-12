/**
 * Sweep — runs `(every level) × (every tier) × N trials`.
 *
 * Output: array of Outcome records. Aggregation lives in `aggregate.ts`.
 *
 * Usage (standalone):
 *   npx tsx scripts/run-playtest/sweep.ts [trials]
 */

import { T3 } from './bots/t3';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import { simulateGame } from './simulate';
import { buildLevelCatalog } from './utils/levels';
import type { AbilityId } from '../../lib/run/abilities';
import type { Bot, Outcome, TierId } from './types';

const BOTS: Record<TierId, Bot> = { T3, T4, T5 };

export interface SweepOpts {
  trials: number;
  tiers?: TierId[];
  excludedAbilities?: ReadonlySet<AbilityId>;
  /** Optional filter — only levels matching this id substring. */
  levelFilter?: string;
  /** Progress callback (line-by-line). */
  onProgress?: (line: string) => void;
}

export function runSweep(opts: SweepOpts): Outcome[] {
  const catalog = buildLevelCatalog().filter((e) =>
    opts.levelFilter ? e.levelId.includes(opts.levelFilter) : true,
  );
  const tiers: TierId[] = opts.tiers ?? ['T3', 'T4', 'T5'];
  const results: Outcome[] = [];

  let done = 0;
  const total = catalog.length * tiers.length * opts.trials;

  for (const entry of catalog) {
    for (const tier of tiers) {
      const bot = BOTS[tier];
      for (let trial = 0; trial < opts.trials; trial++) {
        const seed = `${entry.levelId}__${tier}__${trial}`;
        const r = simulateGame({
          puzzle: entry.puzzle,
          bot,
          seed,
          excludedAbilities: opts.excludedAbilities,
        });
        results.push({
          ...r,
          levelId: entry.levelId,
          runId: entry.runId,
          levelIndex: entry.levelIndex,
          level: entry.puzzle.level,
          tier,
          trial,
        });
        done++;
        if (opts.onProgress && done % 50 === 0) {
          opts.onProgress(
            `[sweep] ${done}/${total} (${entry.levelId} ${tier} t${trial})`,
          );
        }
      }
    }
  }

  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI entry.

function main(): void {
  const trialsArg = process.argv[2];
  const trials = trialsArg ? parseInt(trialsArg, 10) : 50;
  if (Number.isNaN(trials) || trials < 1) {
    console.error('Usage: npx tsx scripts/run-playtest/sweep.ts [trials]');
    process.exit(1);
  }

  console.log(`[sweep] running ${trials} trials per (level, tier)`);
  const t0 = Date.now();
  const results = runSweep({ trials, onProgress: (s) => console.log(s) });
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[sweep] done in ${dt}s, ${results.length} outcomes`);

  // Quick summary print so smoke tests are legible without writing a digest.
  const byKey = new Map<string, Outcome[]>();
  for (const r of results) {
    const key = `${r.levelId}|${r.tier}`;
    const arr = byKey.get(key) ?? [];
    arr.push(r);
    byKey.set(key, arr);
  }
  const lines: string[] = [];
  for (const [key, arr] of byKey) {
    const wins = arr.filter((a) => a.win).length;
    lines.push(`${key}\t${wins}/${arr.length}\t${((wins / arr.length) * 100).toFixed(0)}%`);
  }
  lines.sort();
  console.log('\nLevel\\Tier  Wins  WinRate');
  for (const l of lines) console.log(l);
}

if (require.main === module) {
  main();
}
