/**
 * Which run is the hardest, honestly? Plays FULL 10-level chained runs
 * (tempo + abilities + offers carry across levels — the real player
 * experience) and reports completion rate + mean levels reached per run.
 *
 *   npx tsx scripts/run-playtest/hardest-run.ts [trials=12] [runIds,csv]
 */
import { simulateRun } from './simulate-run';
import { T3 } from './bots/t3';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import type { Bot, TierId } from './types';

const BOTS: Record<TierId, Bot> = { T3, T4, T5 };
const DEFAULT_RUNS = ['the-x', 'the-bridge', 'pincer', 'stone-citadel', 'iron-veil', 'iron-curtain'];

const trials = parseInt(process.argv[2] ?? '12', 10);
const runIds = (process.argv[3] ? process.argv[3].split(',') : DEFAULT_RUNS);

console.log(`[hardest] ${runIds.length} runs × ${trials} full runs × T3/T4/T5\n`);
console.log('run                    tier  completed  mean-levels');
const summary: { runId: string; tier: TierId; rate: number; mean: number }[] = [];
for (const runId of runIds) {
  for (const tier of ['T3', 'T4', 'T5'] as TierId[]) {
    let completed = 0;
    let levelsSum = 0;
    for (let t = 0; t < trials; t++) {
      const r = simulateRun({
        runId,
        bot: BOTS[tier],
        seed: `hardest__${runId}__${tier}__${t}`,
        rookieStart: { file: 4, rank: 1 },
      });
      if (r.levelsCompleted >= 10) completed++;
      levelsSum += r.levelsCompleted;
    }
    const rate = completed / trials;
    const mean = levelsSum / trials;
    summary.push({ runId, tier, rate, mean });
    console.log(
      `${runId.padEnd(22)} ${tier}   ${(rate * 100).toFixed(0).padStart(3)}%      ${mean.toFixed(1)}`,
    );
  }
}
console.log('\n=== hardest by T5 completion, then mean levels ===');
const t5 = summary.filter((s) => s.tier === 'T5').sort((a, b) => a.rate - b.rate || a.mean - b.mean);
t5.forEach((s, i) => console.log(`${i + 1}. ${s.runId} — T5 completes ${(s.rate * 100).toFixed(0)}%, reaches L${s.mean.toFixed(1)} on average`));
