#!/usr/bin/env -S npx tsx
/**
 * T5 v0.3 (human-inspired) vs v0.1 head-to-head benchmark.
 *
 * Mirrors `t5-benchmark.ts` but compares the new human-trace-derived planner
 * against the live v0.1 minimax baseline. Same seeding pattern → paired
 * comparison.
 *
 * Output:
 *   data/run-playtest/raw/t5-human-benchmark.json
 *
 * Usage:
 *   npx tsx scripts/run-playtest/bots/t5-human-benchmark.ts [trials]
 *
 * Acceptance: if v0.3 regresses on any level by more than 10pp, do not
 * promote. Otherwise update `t5.ts` to re-export V03 as live `T5`.
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { simulateGame } from '../simulate';
import { buildLevelCatalog } from '../utils/levels';
import type { Bot } from '../types';
import { T5_V01 } from './t5-v01';
import { T5_V03 } from './t5-human';

const DEFAULT_TRIALS = 100;
const REGRESSION_PP_LIMIT = 10;

interface PerLevelRow {
  levelId: string;
  trials: number;
  v03Wins: number;
  v01Wins: number;
  v03OnlyWins: number;
  v01OnlyWins: number;
  v03WinRate: number;
  v01WinRate: number;
  deltaPp: number;
  regressed: boolean;
}

interface BenchmarkOutput {
  generatedAt: string;
  trialsPerLevel: number;
  perLevel: PerLevelRow[];
  overall: {
    levelsTotal: number;
    levelsRegressed: number;
    regressedLevelIds: string[];
    v03OverallWinRate: number;
    v01OverallWinRate: number;
    verdict: 'v0.3-promote' | 'v0.1-keep';
  };
}

function runOne(
  bot: Bot,
  levelId: string,
  trial: number,
  puzzle: ReturnType<typeof buildLevelCatalog>[number]['puzzle'],
): boolean {
  const seed = `bench__${levelId}__${trial}`;
  const r = simulateGame({ puzzle, bot, seed });
  return r.win;
}

function main(): void {
  const trialsArg = process.argv[2];
  const trials = trialsArg ? parseInt(trialsArg, 10) : DEFAULT_TRIALS;
  if (Number.isNaN(trials) || trials < 1) {
    console.error(
      'Usage: npx tsx scripts/run-playtest/bots/t5-human-benchmark.ts [trials]',
    );
    process.exit(1);
  }

  const catalog = buildLevelCatalog();
  console.log(
    `[t5-human-bench] ${catalog.length} levels × ${trials} trials × 2 versions = ${catalog.length * trials * 2} sims`,
  );
  const t0 = Date.now();

  const perLevel: PerLevelRow[] = [];
  let v03TotalWins = 0;
  let v01TotalWins = 0;
  let totalTrials = 0;

  for (const entry of catalog) {
    let v03Wins = 0;
    let v01Wins = 0;
    let v03OnlyWins = 0;
    let v01OnlyWins = 0;

    for (let trial = 0; trial < trials; trial++) {
      const w03 = runOne(T5_V03, entry.levelId, trial, entry.puzzle);
      const w01 = runOne(T5_V01, entry.levelId, trial, entry.puzzle);
      if (w03) v03Wins++;
      if (w01) v01Wins++;
      if (w03 && !w01) v03OnlyWins++;
      else if (!w03 && w01) v01OnlyWins++;
    }

    const v03WinRate = v03Wins / trials;
    const v01WinRate = v01Wins / trials;
    const deltaPp = (v03WinRate - v01WinRate) * 100;
    const regressed = deltaPp < -REGRESSION_PP_LIMIT;

    perLevel.push({
      levelId: entry.levelId,
      trials,
      v03Wins,
      v01Wins,
      v03OnlyWins,
      v01OnlyWins,
      v03WinRate,
      v01WinRate,
      deltaPp,
      regressed,
    });

    v03TotalWins += v03Wins;
    v01TotalWins += v01Wins;
    totalTrials += trials;

    console.log(
      `  ${entry.levelId.padEnd(24)}  v0.3 ${v03Wins.toString().padStart(3)}/${trials}` +
        `  v0.1 ${v01Wins.toString().padStart(3)}/${trials}` +
        `  Δ ${(deltaPp >= 0 ? '+' : '') + deltaPp.toFixed(1)}pp` +
        (regressed ? '  [REGRESSED]' : deltaPp >= 5 ? '  [IMPROVED]' : ''),
    );
  }

  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[t5-human-bench] done in ${dt}s`);

  const regressedLevels = perLevel.filter((r) => r.regressed);
  const improvedLevels = perLevel.filter((r) => r.deltaPp >= 5);
  const verdict: BenchmarkOutput['overall']['verdict'] =
    regressedLevels.length === 0 ? 'v0.3-promote' : 'v0.1-keep';

  const out: BenchmarkOutput = {
    generatedAt: new Date().toISOString(),
    trialsPerLevel: trials,
    perLevel,
    overall: {
      levelsTotal: perLevel.length,
      levelsRegressed: regressedLevels.length,
      regressedLevelIds: regressedLevels.map((r) => r.levelId),
      v03OverallWinRate: v03TotalWins / totalTrials,
      v01OverallWinRate: v01TotalWins / totalTrials,
      verdict,
    },
  };

  const repoRoot = join(__dirname, '..', '..', '..');
  const outDir = join(repoRoot, 'data', 'run-playtest', 'raw');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 't5-human-benchmark.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2));

  console.log('');
  console.log(`=== T5 v0.3 HUMAN-INSPIRED BENCHMARK SUMMARY ===`);
  console.log(`Levels:             ${perLevel.length}`);
  console.log(`Trials per level:   ${trials}`);
  console.log(`v0.3 overall:       ${(out.overall.v03OverallWinRate * 100).toFixed(1)}%`);
  console.log(`v0.1 overall:       ${(out.overall.v01OverallWinRate * 100).toFixed(1)}%`);
  console.log(
    `Levels improved ≥5pp: ${improvedLevels.length}` +
      (improvedLevels.length > 0
        ? '\n  ' +
          improvedLevels
            .slice(0, 10)
            .map((r) => `${r.levelId} +${r.deltaPp.toFixed(1)}pp`)
            .join('\n  ')
        : ''),
  );
  console.log(`Levels regressed:   ${regressedLevels.length} (threshold: > ${REGRESSION_PP_LIMIT}pp)`);
  if (regressedLevels.length > 0) {
    console.log(`  Regressed levels:`);
    for (const r of regressedLevels) {
      console.log(`    - ${r.levelId}  Δ ${r.deltaPp.toFixed(1)}pp`);
    }
  }
  console.log(`Verdict:            ${verdict}`);
  console.log(`Output:             ${outPath}`);
}

main();
