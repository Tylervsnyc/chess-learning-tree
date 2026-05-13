#!/usr/bin/env -S npx tsx
/**
 * Run-level simulator + ability-impact harness.
 *
 * Two functions:
 *   simulateRun(opts) — play a full 10-level run end to end, carrying
 *     tempo + abilities + pending offers across levels. Returns end-of-run
 *     stats: levels completed, abilities held, per-level outcomes.
 *
 *   runAbilityImpact(opts) — for each ability, force-seed it at a chosen
 *     tier or upgrade-schedule, run N full runs, report end-of-run levels
 *     reached vs baseline (no preowned ability).
 *
 * CLI:
 *   npx tsx scripts/run-playtest/simulate-run.ts ability-impact [trials=25] [mode=fixed-t3|upgrading|all]
 *
 * Per Tyler: "force 1 ability for the whole run and have it be upgraded
 * to see what it does to win rates, some abilites should have a drastic
 * result." This is that test.
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import {
  ABILITY_DEFS,
  ALL_ABILITY_IDS,
  maxUsesForTier,
} from '../../lib/run/abilities';
import { getRunById, RUNS } from '../../lib/run/runs';
import type { AbilityId, AbilityTier, OwnedAbility } from '../../lib/run/abilities';
import type { Coord } from '../../lib/run/types';
import { T3 } from './bots/t3';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import { simulateGame } from './simulate';
import type { Bot, TierId } from './types';

const BOTS: Record<TierId, Bot> = { T3, T4, T5 };

/**
 * How the pre-owned ability is parametrized across the 10 levels of a run.
 *  - fixed-tN: ability locked at the same tier the whole run
 *  - upgrading: start at T1, +1 tier every 2 levels (T1→T2 at L3, T3 at L5,
 *    T4 at L7, T5 at L9). Mirrors organic tempo-driven upgrade pacing.
 */
export type AbilityForceMode =
  | 'fixed-t1'
  | 'fixed-t3'
  | 'fixed-t5'
  | 'upgrading';

function tierForLevel(level: number, mode: AbilityForceMode): AbilityTier {
  if (mode === 'fixed-t1') return 1;
  if (mode === 'fixed-t3') return 3;
  if (mode === 'fixed-t5') return 5;
  // upgrading: T1@L1-2, T2@L3-4, T3@L5-6, T4@L7-8, T5@L9-10
  const step = Math.min(5, Math.floor((level - 1) / 2) + 1);
  return step as AbilityTier;
}

function makeOwned(id: AbilityId, tier: AbilityTier): OwnedAbility {
  return {
    id,
    tier,
    mutations: [],
    usesLeftThisLevel: maxUsesForTier(id, tier),
  };
}

export interface SimulateRunOpts {
  runId: string;
  bot: Bot;
  seed: string;
  rookieStart: Coord;
  /** Ability to force-seed for the whole run, optionally with upgrade schedule. */
  preowned?: { id: AbilityId; mode: AbilityForceMode };
}

export interface RunOutcome {
  runId: string;
  botTier: TierId;
  preowned: string | null;
  forceMode: AbilityForceMode | null;
  /** Number of levels successfully completed (0 = died on level 1). */
  levelsCompleted: number;
  perLevel: {
    level: number;
    win: boolean;
    movesUsed: number;
    failMode: string;
    abilitiesUsed: AbilityId[];
  }[];
  /** Tempo at end of run. */
  finalTempo: number;
  /** Abilities held at end of run with their final tier. */
  finalAbilities: { id: AbilityId; tier: AbilityTier }[];
}

export function simulateRun(opts: SimulateRunOpts): RunOutcome {
  const run = getRunById(opts.runId);
  const perLevel: RunOutcome['perLevel'] = [];

  let carryTempo: number | undefined;
  let carryAbilities: OwnedAbility[] | undefined;
  let carryPendingOffer = undefined;
  let levelsCompleted = 0;
  let lastFinalTempo = 0;
  let lastFinalAbilities: OwnedAbility[] = [];

  for (let i = 0; i < run.levels.length; i++) {
    const puzzle = run.levels[i](opts.rookieStart);

    // Re-seed the preowned ability at this level's tier. The upgrade
    // schedule lives here so we get T1→T2→… as the level number rises.
    const preownedSeed: OwnedAbility[] = [];
    if (opts.preowned) {
      const tier = tierForLevel(puzzle.level, opts.preowned.mode);
      preownedSeed.push(makeOwned(opts.preowned.id, tier));
    }

    const r = simulateGame({
      puzzle,
      bot: opts.bot,
      seed: `${opts.seed}__L${i}`,
      carryTempo,
      carryAbilities,
      carryPendingOffer,
      preownedAbilities: preownedSeed.length > 0 ? preownedSeed : undefined,
    });

    perLevel.push({
      level: puzzle.level,
      win: r.win,
      movesUsed: r.movesUsed,
      failMode: r.failMode,
      abilitiesUsed: [...r.abilitiesUsed],
    });

    if (!r.win) break;
    levelsCompleted++;
    lastFinalTempo = r.finalState.tempo;
    lastFinalAbilities = r.finalState.abilities;

    // Carry-over for next level. We force the preowned ability back at its
    // next-tier setting at level start, so we don't carry it here (combining
    // with preownedSeed would just be a no-op dedupe — but explicit is safer).
    carryTempo = r.finalState.tempo;
    carryAbilities = r.finalState.abilities;
    carryPendingOffer = r.finalState.pendingOffer;
  }

  return {
    runId: opts.runId,
    botTier: opts.bot.id,
    preowned: opts.preowned?.id ?? null,
    forceMode: opts.preowned?.mode ?? null,
    levelsCompleted,
    perLevel,
    finalTempo: lastFinalTempo,
    finalAbilities: lastFinalAbilities.map((a) => ({ id: a.id, tier: a.tier })),
  };
}

// ─── Ability impact harness ────────────────────────────────────────────────

export interface AbilityImpactOpts {
  trials: number;
  bot: Bot;
  runId: string;
  rookieStart: Coord;
  modes: AbilityForceMode[];
  onProgress?: (line: string) => void;
}

interface AbilityImpactRow {
  ability: AbilityId | null; // null = baseline (no preowned ability)
  mode: AbilityForceMode | null;
  trials: number;
  meanLevelsCompleted: number;
  medianLevelsCompleted: number;
  fullRunRate: number;
  perLevelWinRate: number[]; // index 0 = level 1 win rate, etc.
  meanAbilitiesAtEnd: number;
  meanFinalTempo: number;
}

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const sorted = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
  return sorted[mid];
}

function aggregate(
  outcomes: RunOutcome[],
  numLevels: number,
): AbilityImpactRow {
  const trials = outcomes.length;
  const completed = outcomes.map((o) => o.levelsCompleted);
  const fullRuns = outcomes.filter((o) => o.levelsCompleted >= numLevels).length;
  // Per-level win rate: for each level idx, count outcomes that reached that
  // level and won it. "Reached" = previous level was completed.
  const perLevelWinRate: number[] = [];
  for (let lvl = 0; lvl < numLevels; lvl++) {
    let reached = 0;
    let won = 0;
    for (const o of outcomes) {
      if (lvl < o.perLevel.length) {
        reached++;
        if (o.perLevel[lvl].win) won++;
      }
    }
    perLevelWinRate.push(reached > 0 ? won / reached : 0);
  }
  const meanAbilitiesAtEnd =
    outcomes.reduce((s, o) => s + o.finalAbilities.length, 0) / Math.max(1, trials);
  const meanFinalTempo =
    outcomes.reduce((s, o) => s + o.finalTempo, 0) / Math.max(1, trials);
  return {
    ability: outcomes[0]?.preowned as AbilityId | null,
    mode: outcomes[0]?.forceMode ?? null,
    trials,
    meanLevelsCompleted: completed.reduce((a, b) => a + b, 0) / Math.max(1, trials),
    medianLevelsCompleted: median(completed),
    fullRunRate: fullRuns / Math.max(1, trials),
    perLevelWinRate,
    meanAbilitiesAtEnd,
    meanFinalTempo,
  };
}

export function runAbilityImpact(opts: AbilityImpactOpts): {
  baseline: AbilityImpactRow;
  byAbility: Map<AbilityId, Map<AbilityForceMode, AbilityImpactRow>>;
} {
  const run = getRunById(opts.runId);
  const numLevels = run.levels.length;

  // Baseline: no preowned ability.
  opts.onProgress?.(`[ability-impact] baseline × ${opts.trials}`);
  const baselineOutcomes: RunOutcome[] = [];
  for (let i = 0; i < opts.trials; i++) {
    baselineOutcomes.push(
      simulateRun({
        runId: opts.runId,
        bot: opts.bot,
        seed: `ability-impact__baseline__${i}`,
        rookieStart: opts.rookieStart,
      }),
    );
  }
  const baseline = aggregate(baselineOutcomes, numLevels);
  baseline.ability = null;

  // For each ability × each mode.
  const byAbility = new Map<AbilityId, Map<AbilityForceMode, AbilityImpactRow>>();
  for (const ability of ALL_ABILITY_IDS) {
    const byMode = new Map<AbilityForceMode, AbilityImpactRow>();
    for (const mode of opts.modes) {
      opts.onProgress?.(`[ability-impact] ${ability} (${mode}) × ${opts.trials}`);
      const outs: RunOutcome[] = [];
      for (let i = 0; i < opts.trials; i++) {
        outs.push(
          simulateRun({
            runId: opts.runId,
            bot: opts.bot,
            seed: `ability-impact__${ability}__${mode}__${i}`,
            rookieStart: opts.rookieStart,
            preowned: { id: ability, mode },
          }),
        );
      }
      byMode.set(mode, aggregate(outs, numLevels));
    }
    byAbility.set(ability, byMode);
  }

  return { baseline, byAbility };
}

// ─── Markdown report ───────────────────────────────────────────────────────

function pct(x: number): string {
  return `${Math.round(x * 100)}%`;
}

function deltaPct(curr: number, base: number): string {
  const d = Math.round((curr - base) * 100);
  return d > 0 ? `+${d}pp` : `${d}pp`;
}

export function renderImpactReport(
  runId: string,
  trials: number,
  modes: AbilityForceMode[],
  result: ReturnType<typeof runAbilityImpact>,
): string {
  const lines: string[] = [];
  lines.push(`# Ability Impact — ${runId} (${trials} runs / ability / mode)`);
  lines.push(``);
  lines.push(
    `Each ability was force-seeded at the start of every level of a 10-level run and the bot played the full run. Compare end-of-run levels-completed vs the baseline (no preowned ability). Δ shows whether the ability materially helped progression.`,
  );
  lines.push(``);
  lines.push(`Modes:`);
  lines.push(`- **fixed-tN** — ability locked at the same tier all 10 levels`);
  lines.push(`- **upgrading** — start at T1, +1 tier every 2 levels (T1→T2 at L3, T3 at L5, T4 at L7, T5 at L9)`);
  lines.push(``);
  lines.push(
    `**Baseline**: mean levels completed **${result.baseline.meanLevelsCompleted.toFixed(2)}** (median ${result.baseline.medianLevelsCompleted}), full-run rate ${pct(result.baseline.fullRunRate)}, ${result.baseline.meanAbilitiesAtEnd.toFixed(2)} abilities held at end.`,
  );
  lines.push(``);

  for (const mode of modes) {
    lines.push(`## Mode: ${mode}`);
    lines.push(``);
    lines.push(`| Ability | Mean levels | Δ vs baseline | Median | Full-run rate | Abilities at end |`);
    lines.push(`|---|---:|---:|---:|---:|---:|`);
    const rows: { id: AbilityId; row: AbilityImpactRow }[] = [];
    for (const [id, byMode] of result.byAbility) {
      const row = byMode.get(mode);
      if (!row) continue;
      rows.push({ id, row });
    }
    rows.sort(
      (a, b) => b.row.meanLevelsCompleted - a.row.meanLevelsCompleted,
    );
    for (const { id, row } of rows) {
      const dMean = (row.meanLevelsCompleted - result.baseline.meanLevelsCompleted).toFixed(2);
      const sign = parseFloat(dMean) > 0 ? '+' : '';
      lines.push(
        `| ${ABILITY_DEFS[id].name} | ${row.meanLevelsCompleted.toFixed(2)} | ${sign}${dMean} | ${row.medianLevelsCompleted} | ${pct(row.fullRunRate)} | ${row.meanAbilitiesAtEnd.toFixed(2)} |`,
      );
    }
    lines.push(``);
  }

  return lines.join('\n');
}

// ─── CLI ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const cmd = process.argv[2] ?? '';
  if (cmd === 'ability-impact') {
    const trials = parseInt(process.argv[3] ?? '25', 10);
    const modeArg = process.argv[4] ?? 'fixed-t3,upgrading';
    const modes = modeArg.split(',').map((m) => m.trim()) as AbilityForceMode[];

    const runId = process.argv[5] ?? 'daily';
    const tierArg = (process.argv[6] ?? 'T3') as TierId;
    const rookieStart = { file: 4, rank: 1 };

    console.log(`[ability-impact] runId=${runId}, bot=${tierArg}, trials=${trials}, modes=${modeArg}`);
    const result = runAbilityImpact({
      trials,
      bot: BOTS[tierArg],
      runId,
      rookieStart,
      modes,
      onProgress: (s) => console.log(s),
    });

    const outDir = join(__dirname, '..', '..', 'data', 'run-playtest', 'ability-impact');
    mkdirSync(outDir, { recursive: true });
    const date = new Date().toISOString().slice(0, 10);
    const outPath = join(outDir, `${runId}_${tierArg}_${date}.md`);
    writeFileSync(outPath, renderImpactReport(runId, trials, modes, result));
    console.log(`[ability-impact] report written: ${outPath}`);
    return;
  }

  console.error(
    'Usage: simulate-run.ts ability-impact [trials=25] [modes=fixed-t3,upgrading] [runId=daily]',
  );
  process.exit(1);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
