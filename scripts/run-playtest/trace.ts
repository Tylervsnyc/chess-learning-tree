/**
 * Generate a single-game decision trace JSON for the replay viewer.
 *
 * Usage:
 *   npx tsx scripts/run-playtest/trace.ts <runId> <level> <tier> <trial>
 *
 *   runId: 'daily' | 'knight-academy' | 'boss-gauntlet' | ...  (matches RunDef.id)
 *   level: 1-based puzzle.level (NOT levelIndex). E.g. "5" picks the puzzle
 *          whose `level` field is 5 inside that run.
 *   tier:  'T3' | 'T4' | 'T5'
 *   trial: 0-based trial number (drives the deterministic seed)
 *
 * Output: data/run-playtest/traces/<runId>__<level>__<tier>__<trial>.json
 *
 * Seed format matches sweep.ts exactly so the trial replays a sim identical
 * to what nightly/sweep produced. Specifically:
 *   `${entry.levelId}__${tier}__${trial}` where entry.levelId is
 *   `${runId}/${levelIndex}`.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { T3 } from './bots/t3';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import { simulateGame } from './simulate';
import { buildLevelCatalog } from './utils/levels';
import { serializeBoard } from './utils/serialize';
import type { Bot, DecisionTrace, Outcome, TierId } from './types';

const BOTS: Record<TierId, Bot> = { T3, T4, T5 };

function main(): void {
  const [, , runIdArg, levelArg, tierArg, trialArg] = process.argv;
  if (!runIdArg || !levelArg || !tierArg || trialArg === undefined) {
    console.error(
      'Usage: npx tsx scripts/run-playtest/trace.ts <runId> <level> <tier> <trial>',
    );
    console.error('Example: npx tsx scripts/run-playtest/trace.ts daily 5 T3 0');
    process.exit(1);
  }

  const level = parseInt(levelArg, 10);
  const trial = parseInt(trialArg, 10);
  if (Number.isNaN(level) || Number.isNaN(trial)) {
    console.error('[trace] level and trial must be integers');
    process.exit(1);
  }
  const tier = tierArg as TierId;
  if (!(tier in BOTS)) {
    console.error(`[trace] unknown tier ${tierArg} — expected T3/T4/T5`);
    process.exit(1);
  }

  const catalog = buildLevelCatalog();
  const entry = catalog.find(
    (e) => e.runId === runIdArg && e.puzzle.level === level,
  );
  if (!entry) {
    console.error(
      `[trace] no level found: runId=${runIdArg} level=${level}. ` +
        `Known runs: ${[...new Set(catalog.map((c) => c.runId))].join(', ')}`,
    );
    process.exit(1);
  }

  const seed = `${entry.levelId}__${tier}__${trial}`;
  console.log(
    `[trace] simulating ${entry.levelId} (level ${level}) ${tier} trial ${trial}`,
  );
  const t0 = Date.now();
  const r = simulateGame({
    puzzle: entry.puzzle,
    runId: entry.runId,
    bot: BOTS[tier],
    seed,
    recordTrace: true,
  });
  const dt = ((Date.now() - t0) / 1000).toFixed(2);
  console.log(
    `[trace] sim done in ${dt}s — ${r.win ? 'WIN' : `LOSS (${r.failMode})`} after ${r.movesUsed} moves; ${r.decisionLog?.length ?? 0} decisions logged`,
  );

  // Strip the in-memory final state (serialized separately as `finalBoard`)
  // and the inline decisionLog (lives at the trace's top level — we don't
  // want it duplicated inside outcome too).
  const { finalState, decisionLog, ...rest } = r;

  const outcome: Outcome = {
    ...rest,
    levelId: entry.levelId,
    runId: entry.runId,
    levelIndex: entry.levelIndex,
    level: entry.puzzle.level,
    tier,
    trial,
  };

  const trace: DecisionTrace = {
    runId: entry.runId,
    level: entry.puzzle.level,
    levelIndex: entry.levelIndex,
    levelId: entry.levelId,
    tier,
    trial,
    seed,
    generatedAt: new Date().toISOString(),
    outcome,
    decisionLog: decisionLog ?? [],
    finalBoard: serializeBoard(finalState),
  };

  const outPath = resolve(
    process.cwd(),
    'data/run-playtest/traces',
    `${entry.runId}__${entry.puzzle.level}__${tier}__${trial}.json`,
  );
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(trace, null, 2));
  console.log(`[trace] wrote ${outPath}`);
}

if (require.main === module) {
  main();
}
