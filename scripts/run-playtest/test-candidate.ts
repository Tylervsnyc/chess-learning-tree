/**
 * Test an off-RUNS candidate run by importing its module and simulating each
 * level × tier × trials. Used by the 2026-05-15 evening level-generation
 * session.
 *
 * Usage:
 *   npx tsx scripts/run-playtest/test-candidate.ts <path-to-candidate.ts> [trials]
 *
 * The candidate module must export `levels: ReadonlyArray<LevelBuilder>` where
 * a LevelBuilder is `(rookieStart: Coord) => RunPuzzle`.
 *
 * Output: JSON to stdout with per-(level, tier) win% and fail-mode breakdown.
 */

import path from 'path';
import { T3 } from './bots/t3';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import { simulateGame } from './simulate';
import { SWEEP_ROOKIE_START } from './utils/levels';
import type { Bot, TierId, FailMode } from './types';
import type { Coord, RunPuzzle } from '../../lib/run/types';

type LevelBuilder = (rookieStart: Coord) => RunPuzzle;

interface CandidateModule {
  levels: ReadonlyArray<LevelBuilder>;
  template?: string;
  notes?: string;
}

const BOTS: Record<TierId, Bot> = { T3, T4, T5 };

interface PerLevel {
  level: number;
  byTier: Record<TierId, { wins: number; trials: number; winPct: number }>;
  failModes: Record<FailMode, number>; // aggregated across tiers
}

async function main(): Promise<void> {
  const arg = process.argv[2];
  const trials = process.argv[3] ? parseInt(process.argv[3], 10) : 20;
  if (!arg) {
    console.error(
      'Usage: npx tsx scripts/run-playtest/test-candidate.ts <path> [trials]',
    );
    process.exit(1);
  }
  const abs = path.resolve(arg);
  const mod = (await import(abs)) as CandidateModule;
  if (!mod.levels || !Array.isArray(mod.levels)) {
    console.error(`Candidate ${abs} does not export 'levels'`);
    process.exit(1);
  }

  const tiers: TierId[] = ['T3', 'T4', 'T5'];
  const perLevel: PerLevel[] = [];

  for (let i = 0; i < mod.levels.length; i++) {
    const builder = mod.levels[i];
    const puzzle = builder(SWEEP_ROOKIE_START);
    const byTier: PerLevel['byTier'] = {
      T3: { wins: 0, trials: 0, winPct: 0 },
      T4: { wins: 0, trials: 0, winPct: 0 },
      T5: { wins: 0, trials: 0, winPct: 0 },
    };
    const failModes: Record<FailMode, number> = {
      won: 0,
      captured: 0,
      'move-limit': 0,
      'dead-end': 0,
    };
    for (const tier of tiers) {
      const bot = BOTS[tier];
      for (let t = 0; t < trials; t++) {
        const seed = `candidate__L${i + 1}__${tier}__${t}`;
        const r = simulateGame({ puzzle, bot, seed });
        byTier[tier].trials++;
        if (r.win) byTier[tier].wins++;
        failModes[r.failMode]++;
      }
      byTier[tier].winPct = Math.round(
        (byTier[tier].wins / byTier[tier].trials) * 100,
      );
    }
    perLevel.push({ level: puzzle.level, byTier, failModes });
  }

  // L10 ablation — T5 with no abilities.
  const lastBuilder = mod.levels[mod.levels.length - 1];
  const lastPuzzle = lastBuilder(SWEEP_ROOKIE_START);
  let l10NoAbilWins = 0;
  const ablationTrials = Math.min(trials, 15);
  // Excluded set = all known ability IDs (catch-all). Since we just don't want
  // bots to take any, easier: forcedSkipIds with the entire roster.
  const allAbilityIds = new Set([
    'bishop-step',
    'knight-hop',
    'queen-pulse',
    'pawn-charge',
    'freeze-ray',
    'poison-dart',
    'rabies-dart',
    'phase-step',
    'leap',
    'surge',
    'aegis',
    'decoy',
  ]);
  for (let t = 0; t < ablationTrials; t++) {
    const seed = `candidate__L10__noabil__${t}`;
    const r = simulateGame({
      puzzle: lastPuzzle,
      bot: T5,
      seed,
      excludedAbilities: allAbilityIds as ReadonlySet<never>,
    });
    if (r.win) l10NoAbilWins++;
  }
  const l10NoAbilPct = Math.round((l10NoAbilWins / ablationTrials) * 100);

  // Target curve (T4) — Tyler's locked numbers.
  const targets = [95, 90, 80, 70, 60, 50, 35, 25, 15, 8];
  // L2 norm of (T4 actual - target) — lower is better.
  let sse = 0;
  for (let i = 0; i < 10; i++) {
    const t4 = perLevel[i]?.byTier.T4.winPct ?? 0;
    sse += (t4 - targets[i]) ** 2;
  }
  const fit = Math.sqrt(sse);

  const out = {
    template: mod.template ?? 'unknown',
    notes: mod.notes ?? '',
    perLevel,
    l10NoAbilPct,
    fit, // L2 norm vs target T4 curve — lower = better
    trialsPerTier: trials,
    ablationTrials,
  };
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
