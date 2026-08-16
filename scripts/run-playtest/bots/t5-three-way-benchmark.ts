#!/usr/bin/env -S npx tsx
/**
 * Three-way bot benchmark: T5_V01 (live) vs T5_V03 (human-inspired) vs
 * T5_RANDOM (random offer picks, V01 movement).
 *
 * Tracks BOTH win rates AND ability-pick distributions so we can see what
 * the focus-stack vs random vs tier+kind strategies actually do to:
 *   - per-level win %
 *   - which abilities each bot ends up owning
 *   - peak tier reached for each ability (counted from `abilitiesTaken`:
 *     the same ID appearing N times in a game means Rookie hit tier N)
 *
 * Output:
 *   data/run-playtest/raw/t5-three-way-benchmark.json
 *
 * Usage:
 *   npx tsx scripts/run-playtest/bots/t5-three-way-benchmark.ts [trials]
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { simulateGame } from '../simulate';
import { buildLevelCatalog } from '../utils/levels';
import { ALL_ABILITY_IDS, type AbilityId } from '../../../lib/run/abilities';
import type { Bot } from '../types';
import { T5_V01 } from './t5-v01';
import { T5_V03 } from './t5-human';
import { T5_RANDOM } from './t5-random';

const DEFAULT_TRIALS = 50;

type BotKey = 'v01' | 'v03' | 'random';

interface BotStats {
  wins: number;
  trials: number;
  /** Sum of peak-tier-reached per game, per ability. Divide by trials for mean. */
  peakTierSum: Partial<Record<AbilityId, number>>;
  /** Number of games where this ability was picked at all. */
  pickedGames: Partial<Record<AbilityId, number>>;
}

interface PerLevelRow {
  levelId: string;
  trials: number;
  v01: BotStats;
  v03: BotStats;
  random: BotStats;
}

interface OverallAbilityStats {
  ability: AbilityId;
  v01PickPct: number;   // share of games picked at all
  v03PickPct: number;
  randomPickPct: number;
  v01MeanPeakTier: number;  // mean peak tier across games that picked it
  v03MeanPeakTier: number;
  randomMeanPeakTier: number;
}

interface BenchmarkOutput {
  generatedAt: string;
  trialsPerLevel: number;
  perLevel: PerLevelRow[];
  overall: {
    levelsTotal: number;
    totalTrials: number;
    v01WinRate: number;
    v03WinRate: number;
    randomWinRate: number;
    abilityStats: OverallAbilityStats[];
  };
}

function emptyBotStats(): BotStats {
  return { wins: 0, trials: 0, peakTierSum: {}, pickedGames: {} };
}

function recordGame(
  stats: BotStats,
  win: boolean,
  abilitiesTaken: AbilityId[],
): void {
  stats.trials++;
  if (win) stats.wins++;
  // Per-game peak tier per ability = count of that ID in abilitiesTaken.
  // (T1 = first pick, each upgrade adds 1 more entry.)
  const counts = new Map<AbilityId, number>();
  for (const id of abilitiesTaken) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  for (const [id, peak] of counts) {
    stats.peakTierSum[id] = (stats.peakTierSum[id] ?? 0) + peak;
    stats.pickedGames[id] = (stats.pickedGames[id] ?? 0) + 1;
  }
}

function runOne(
  bot: Bot,
  levelId: string,
  trial: number,
  puzzle: ReturnType<typeof buildLevelCatalog>[number]['puzzle'],
): { win: boolean; abilitiesTaken: AbilityId[] } {
  const seed = `bench3__${levelId}__${trial}`;
  const r = simulateGame({ puzzle, bot, seed });
  return { win: r.win, abilitiesTaken: r.abilitiesTaken };
}

function main(): void {
  const trialsArg = process.argv[2];
  const trials = trialsArg ? parseInt(trialsArg, 10) : DEFAULT_TRIALS;
  if (Number.isNaN(trials) || trials < 1) {
    console.error(
      'Usage: npx tsx scripts/run-playtest/bots/t5-three-way-benchmark.ts [trials]',
    );
    process.exit(1);
  }

  const catalog = buildLevelCatalog();
  console.log(
    `[3-way] ${catalog.length} levels × ${trials} trials × 3 bots = ${catalog.length * trials * 3} sims`,
  );
  const t0 = Date.now();

  const perLevel: PerLevelRow[] = [];
  const overallV01 = emptyBotStats();
  const overallV03 = emptyBotStats();
  const overallRandom = emptyBotStats();

  let progress = 0;
  for (const entry of catalog) {
    const v01 = emptyBotStats();
    const v03 = emptyBotStats();
    const random = emptyBotStats();

    for (let trial = 0; trial < trials; trial++) {
      const r1 = runOne(T5_V01, entry.levelId, trial, entry.puzzle);
      const r3 = runOne(T5_V03, entry.levelId, trial, entry.puzzle);
      const rR = runOne(T5_RANDOM, entry.levelId, trial, entry.puzzle);
      recordGame(v01, r1.win, r1.abilitiesTaken);
      recordGame(v03, r3.win, r3.abilitiesTaken);
      recordGame(random, rR.win, rR.abilitiesTaken);
      recordGame(overallV01, r1.win, r1.abilitiesTaken);
      recordGame(overallV03, r3.win, r3.abilitiesTaken);
      recordGame(overallRandom, rR.win, rR.abilitiesTaken);
    }

    perLevel.push({
      levelId: entry.levelId,
      trials,
      v01,
      v03,
      random,
    });

    progress++;
    const d01 = ((v01.wins / trials) * 100).toFixed(0).padStart(3);
    const d03 = ((v03.wins / trials) * 100).toFixed(0).padStart(3);
    const dR = ((random.wins / trials) * 100).toFixed(0).padStart(3);
    if (progress % 30 === 0 || progress === catalog.length) {
      console.log(
        `  [${progress}/${catalog.length}] ${entry.levelId.padEnd(24)}  V01:${d01}% V03:${d03}% RND:${dR}%`,
      );
    }
  }

  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[3-way] done in ${dt}s`);

  // Aggregate ability stats across all games.
  const totalTrials = catalog.length * trials;
  const abilityStats: OverallAbilityStats[] = ALL_ABILITY_IDS.map((id) => ({
    ability: id,
    v01PickPct: (overallV01.pickedGames[id] ?? 0) / totalTrials,
    v03PickPct: (overallV03.pickedGames[id] ?? 0) / totalTrials,
    randomPickPct: (overallRandom.pickedGames[id] ?? 0) / totalTrials,
    v01MeanPeakTier:
      (overallV01.peakTierSum[id] ?? 0) / (overallV01.pickedGames[id] || 1),
    v03MeanPeakTier:
      (overallV03.peakTierSum[id] ?? 0) / (overallV03.pickedGames[id] || 1),
    randomMeanPeakTier:
      (overallRandom.peakTierSum[id] ?? 0) /
      (overallRandom.pickedGames[id] || 1),
  }));

  const out: BenchmarkOutput = {
    generatedAt: new Date().toISOString(),
    trialsPerLevel: trials,
    perLevel,
    overall: {
      levelsTotal: catalog.length,
      totalTrials,
      v01WinRate: overallV01.wins / totalTrials,
      v03WinRate: overallV03.wins / totalTrials,
      randomWinRate: overallRandom.wins / totalTrials,
      abilityStats,
    },
  };

  const repoRoot = join(__dirname, '..', '..', '..');
  const outDir = join(repoRoot, 'data', 'run-playtest', 'raw');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 't5-three-way-benchmark.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2));

  console.log('');
  console.log(`=== THREE-WAY BENCHMARK SUMMARY ===`);
  console.log(`Levels:             ${catalog.length}`);
  console.log(`Trials per level:   ${trials}`);
  console.log(`Total sims/bot:     ${totalTrials}`);
  console.log('');
  console.log(`Win rates:`);
  console.log(`  V01 (live):       ${(out.overall.v01WinRate * 100).toFixed(1)}%`);
  console.log(`  V03 (human):      ${(out.overall.v03WinRate * 100).toFixed(1)}%`);
  console.log(`  RANDOM:           ${(out.overall.randomWinRate * 100).toFixed(1)}%`);
  console.log('');
  console.log(`Ability strategy (% of games picked  ·  mean peak tier when picked):`);
  console.log(
    '  ' +
      'ability'.padEnd(14) +
      'V01%   V03%   RND%   ·   V01t   V03t   RNDt',
  );
  for (const a of abilityStats) {
    const row =
      `  ${a.ability.padEnd(14)}` +
      `${(a.v01PickPct * 100).toFixed(0).padStart(4)}% ` +
      `${(a.v03PickPct * 100).toFixed(0).padStart(4)}% ` +
      `${(a.randomPickPct * 100).toFixed(0).padStart(4)}%   ·   ` +
      `${a.v01MeanPeakTier.toFixed(2).padStart(5)}  ` +
      `${a.v03MeanPeakTier.toFixed(2).padStart(5)}  ` +
      `${a.randomMeanPeakTier.toFixed(2).padStart(5)}`;
    console.log(row);
  }
  console.log(`Output:             ${outPath}`);
}

main();
