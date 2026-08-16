#!/usr/bin/env -S npx tsx
/**
 * T5 v0.2 vs v0.1 head-to-head benchmark.
 *
 * Runs both bots on every level × N trials (default 100) using deterministic
 * seeded simulations (same seed → same level setup, so head-to-head per
 * trial is a true paired comparison).
 *
 * Output:
 *   data/run-playtest/raw/t5-benchmark.json
 *
 * Prints a per-level table:
 *   level | v0.2 wins | v0.1 wins | both | neither | delta_pp
 *
 * Acceptance check: if v0.2 regresses on any level by more than 10pp, the
 * live `T5` export should stay on v0.1. The script prints the verdict at
 * the end so the caller can act on it. (No automatic export switching here
 * — we just report and let the human edit `t5.ts`.)
 *
 * Usage:
 *   npx tsx scripts/run-playtest/bots/t5-benchmark.ts [trials]
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { simulateGame } from '../simulate';
import { buildLevelCatalog } from '../utils/levels';
import type { Bot } from '../types';
import { T5_V02 } from './t5';
import { T5_V01 } from './t5-v01';

const DEFAULT_TRIALS = 100;
const REGRESSION_PP_LIMIT = 10;

interface PerLevelRow {
  levelId: string;
  trials: number;
  v02Wins: number;
  v01Wins: number;
  both: number;     // both versions won
  neither: number;  // both versions lost
  v02OnlyWins: number;
  v01OnlyWins: number;
  v02WinRate: number;
  v01WinRate: number;
  deltaPp: number;  // (v02 - v01) * 100
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
    v02OverallWinRate: number;
    v01OverallWinRate: number;
    verdict: 'v0.2-live' | 'v0.1-live';
  };
}

function runOne(bot: Bot, levelId: string, trial: number, puzzle: ReturnType<typeof buildLevelCatalog>[number]['puzzle']): boolean {
  const seed = `bench__${levelId}__${trial}`;
  const r = simulateGame({ puzzle, bot, seed });
  return r.win;
}

function main(): void {
  const trialsArg = process.argv[2];
  const trials = trialsArg ? parseInt(trialsArg, 10) : DEFAULT_TRIALS;
  if (Number.isNaN(trials) || trials < 1) {
    console.error('Usage: npx tsx scripts/run-playtest/bots/t5-benchmark.ts [trials]');
    process.exit(1);
  }

  const catalog = buildLevelCatalog();
  console.log(
    `[t5-bench] ${catalog.length} levels × ${trials} trials × 2 versions = ${catalog.length * trials * 2} sims`,
  );
  const t0 = Date.now();

  const perLevel: PerLevelRow[] = [];
  let v02TotalWins = 0;
  let v01TotalWins = 0;
  let totalTrials = 0;

  for (const entry of catalog) {
    let v02Wins = 0;
    let v01Wins = 0;
    let both = 0;
    let neither = 0;
    let v02OnlyWins = 0;
    let v01OnlyWins = 0;

    for (let trial = 0; trial < trials; trial++) {
      const w02 = runOne(T5_V02, entry.levelId, trial, entry.puzzle);
      const w01 = runOne(T5_V01, entry.levelId, trial, entry.puzzle);
      if (w02) v02Wins++;
      if (w01) v01Wins++;
      if (w02 && w01) both++;
      else if (!w02 && !w01) neither++;
      else if (w02 && !w01) v02OnlyWins++;
      else v01OnlyWins++;
    }

    const v02WinRate = v02Wins / trials;
    const v01WinRate = v01Wins / trials;
    const deltaPp = (v02WinRate - v01WinRate) * 100;
    const regressed = deltaPp < -REGRESSION_PP_LIMIT;

    perLevel.push({
      levelId: entry.levelId,
      trials,
      v02Wins,
      v01Wins,
      both,
      neither,
      v02OnlyWins,
      v01OnlyWins,
      v02WinRate,
      v01WinRate,
      deltaPp,
      regressed,
    });

    v02TotalWins += v02Wins;
    v01TotalWins += v01Wins;
    totalTrials += trials;

    console.log(
      `  ${entry.levelId.padEnd(24)}  v0.2 ${v02Wins.toString().padStart(3)}/${trials}` +
        `  v0.1 ${v01Wins.toString().padStart(3)}/${trials}` +
        `  Δ ${(deltaPp >= 0 ? '+' : '') + deltaPp.toFixed(1)}pp` +
        (regressed ? '  [REGRESSED]' : ''),
    );
  }

  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[t5-bench] done in ${dt}s`);

  const regressedLevels = perLevel.filter((r) => r.regressed);
  const verdict: BenchmarkOutput['overall']['verdict'] =
    regressedLevels.length === 0 ? 'v0.2-live' : 'v0.1-live';

  const out: BenchmarkOutput = {
    generatedAt: new Date().toISOString(),
    trialsPerLevel: trials,
    perLevel,
    overall: {
      levelsTotal: perLevel.length,
      levelsRegressed: regressedLevels.length,
      regressedLevelIds: regressedLevels.map((r) => r.levelId),
      v02OverallWinRate: v02TotalWins / totalTrials,
      v01OverallWinRate: v01TotalWins / totalTrials,
      verdict,
    },
  };

  const repoRoot = join(__dirname, '..', '..', '..');
  const outDir = join(repoRoot, 'data', 'run-playtest', 'raw');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 't5-benchmark.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2));

  console.log('');
  console.log(`=== T5 BENCHMARK SUMMARY ===`);
  console.log(`Levels:             ${perLevel.length}`);
  console.log(`Trials per level:   ${trials}`);
  console.log(`v0.2 overall:       ${(out.overall.v02OverallWinRate * 100).toFixed(1)}%`);
  console.log(`v0.1 overall:       ${(out.overall.v01OverallWinRate * 100).toFixed(1)}%`);
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
