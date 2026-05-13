#!/usr/bin/env -S npx tsx
/**
 * Hazard ablation experiment — Tyler's hypothesis: hazards make levels
 * EASIER because they block enemies too, not just Rookie.
 *
 * For each level with hazards, run T3 × N trials with the hazards present,
 * then again with the same puzzle but `hazards: []`. Compare win rates.
 *
 * If hazards help players (Tyler's hypothesis):
 *   - Removing hazards DECREASES win rate (negative Δ)
 *   - "Δ = (without − with)" is negative
 *
 * If hazards hurt players (conventional wisdom):
 *   - Removing hazards INCREASES win rate (positive Δ)
 *   - Δ is positive
 *
 * Usage:
 *   npx tsx scripts/run-playtest/hazard-experiment.ts [trials=50] [runFilter=iron-curtain] [tier=T3]
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { T3 } from './bots/t3';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import { simulateGame } from './simulate';
import { buildLevelCatalog } from './utils/levels';
import type { RunPuzzle } from '../../lib/run/types';
import type { Bot, TierId } from './types';

const BOTS: Record<TierId, Bot> = { T3, T4, T5 };

interface LevelComparison {
  levelId: string;
  hazardCount: number;
  winWith: number;
  winWithout: number;
  delta: number; // without - with
}

function runTrials(
  puzzle: RunPuzzle,
  bot: Bot,
  trials: number,
  seedPrefix: string,
): number {
  let wins = 0;
  for (let i = 0; i < trials; i++) {
    const r = simulateGame({ puzzle, bot, seed: `${seedPrefix}__${i}` });
    if (r.win) wins++;
  }
  return wins / trials;
}

function main(): void {
  const trials = parseInt(process.argv[2] ?? '50', 10);
  const runFilter = process.argv[3] ?? 'iron-curtain';
  const tierArg = (process.argv[4] ?? 'T3') as TierId;
  const bot = BOTS[tierArg];

  console.log(`[hazard-exp] trials=${trials}, runFilter=${runFilter}, bot=${tierArg}`);

  const catalog = buildLevelCatalog().filter(
    (e) => e.levelId.startsWith(runFilter + '/') && (e.puzzle.hazards?.length ?? 0) > 0,
  );
  if (catalog.length === 0) {
    console.error(`No levels in run "${runFilter}" have hazards.`);
    process.exit(1);
  }

  const results: LevelComparison[] = [];
  for (const entry of catalog) {
    const puzzleWith = entry.puzzle;
    const puzzleWithout: RunPuzzle = { ...entry.puzzle, hazards: [] };
    const winWith = runTrials(puzzleWith, bot, trials, `${entry.levelId}-with`);
    const winWithout = runTrials(puzzleWithout, bot, trials, `${entry.levelId}-no-hazard`);
    const delta = winWithout - winWith;
    results.push({
      levelId: entry.levelId,
      hazardCount: entry.puzzle.hazards?.length ?? 0,
      winWith,
      winWithout,
      delta,
    });
    console.log(
      `  ${entry.levelId.padEnd(20)} hazards=${results[results.length - 1].hazardCount}  with=${(winWith * 100).toFixed(0)}%  without=${(winWithout * 100).toFixed(0)}%  Δ=${delta > 0 ? '+' : ''}${(delta * 100).toFixed(0)}pp`,
    );
  }

  const totalDelta = results.reduce((s, r) => s + r.delta, 0) / results.length;
  const verdict =
    totalDelta > 0.05
      ? "hazards HURT players (removing them helped — conventional wisdom)"
      : totalDelta < -0.05
        ? "hazards HELP players (removing them hurt — Tyler's hypothesis confirmed)"
        : 'hazards are ROUGHLY NEUTRAL';
  console.log();
  console.log(`[hazard-exp] Average Δ (without − with): ${totalDelta > 0 ? '+' : ''}${(totalDelta * 100).toFixed(1)}pp`);
  console.log(`[hazard-exp] Verdict: ${verdict}`);

  // Write report
  const lines: string[] = [];
  lines.push(`# Hazard Ablation Experiment`);
  lines.push(``);
  lines.push(`**Run filter:** \`${runFilter}\` · **Trials per cell:** ${trials} · **Bot:** ${tierArg}`);
  lines.push(``);
  lines.push(`Tyler's hypothesis: hazards make levels EASIER because they block enemies too.`);
  lines.push(`Test: same level with hazards vs same level with hazards removed. Δ = (without − with).`);
  lines.push(``);
  lines.push(`| Level | Hazards | Win (with) | Win (without) | Δ |`);
  lines.push(`|---|---:|---:|---:|---:|`);
  for (const r of results) {
    lines.push(
      `| ${r.levelId} | ${r.hazardCount} | ${(r.winWith * 100).toFixed(0)}% | ${(r.winWithout * 100).toFixed(0)}% | ${r.delta > 0 ? '+' : ''}${(r.delta * 100).toFixed(0)}pp |`,
    );
  }
  lines.push(``);
  lines.push(`**Mean Δ:** ${totalDelta > 0 ? '+' : ''}${(totalDelta * 100).toFixed(1)}pp`);
  lines.push(``);
  lines.push(`**Verdict:** ${verdict}`);
  lines.push(``);
  lines.push(`If Δ is positive, removing hazards helped players → hazards were obstacles (conventional wisdom). If Δ is negative, removing hazards hurt players → hazards were helping rookie by blocking enemies (Tyler's hypothesis). Near zero = effects cancel out.`);

  const date = new Date().toISOString().slice(0, 10);
  const outDir = join(__dirname, '..', '..', 'data', 'run-playtest', 'experiments');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `hazards_${runFilter}_${tierArg}_${date}.md`);
  writeFileSync(outPath, lines.join('\n'));
  console.log(`[hazard-exp] report written: ${outPath}`);
}

if (require.main === module) {
  main();
}
