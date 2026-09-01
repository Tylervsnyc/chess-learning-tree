/**
 * Ability power test — is a (new) ability correctly powered?
 *
 * Protocol: on a fixed panel of known levels, compare win% with the ability
 * PRE-OWNED at a given tier vs (a) a no-ability baseline and (b) the same
 * protocol run for established REFERENCE abilities. An ability is "correctly
 * powered" when its win-rate lift lands inside the reference band, and its
 * lift grows with tier.
 *
 *   npx tsx scripts/run-playtest/ability-power-test.ts [trials=25] [tier=T4] [--full]
 *
 * Test abilities: the EXPERIMENTAL set. `--full` benchmarks against the
 * ENTIRE shipped roster (the daily-report mode, used by nightly.ts); default
 * uses a quick 3-yardstick spread (surge / freeze-ray / drones).
 * Output: table + JSON at data/run-playtest/raw/ability-power-test.json.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  EXPERIMENTAL_ABILITY_IDS,
  SHIPPED_ABILITY_IDS,
  maxUsesForTier,
  type AbilityId,
  type AbilityTier,
  type OwnedAbility,
} from '../../lib/run/abilities';
import { simulateGame } from './simulate';
import { buildLevelCatalog } from './utils/levels';
import { T3 } from './bots/t3';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import type { Bot, TierId } from './types';

const BOTS: Record<TierId, Bot> = { T3, T4, T5 };

/**
 * The level panel: a difficulty spread of long-lived, hand-authored levels
 * (the digest's classics) — mid levels where an ability should HELP, and
 * late levels where the right ability should be DECISIVE.
 */
export const POWER_PANEL: string[] = [
  'iron-curtain/4',
  'iron-curtain/6',
  'iron-curtain/8',
  'the-gauntlet/5',
  'the-gauntlet/7',
  'cavalry-charge/4',
  'cavalry-charge/7',
  'pawn-tsunami/5',
  'pawn-tsunami/7',
  'royal-court/6',
];

const TIERS: AbilityTier[] = [1, 3, 5];
/** Beyond the reference band by more than this = out of band. */
const MARGIN = 0.05;

export interface PowerCell {
  ability: AbilityId;
  tier: AbilityTier;
  kind: 'test' | 'reference';
  perLevel: Record<string, { win: number; delta: number }>;
  meanDelta: number;
}

export interface PowerVerdict {
  ability: AbilityId;
  /** meanDelta per tested tier, in TIERS order. */
  deltas: number[];
  /** Rises (within noise) from T1 → T5. */
  monotonic: boolean;
  /** Worst placement across tiers vs the reference band. */
  placement: 'underpowered' | 'in-band' | 'overpowered';
  /** One-line promote/hold/rework recommendation for the report. */
  recommendation: string;
}

export interface PowerReport {
  botTier: TierId;
  trials: number;
  panel: string[];
  tiers: AbilityTier[];
  baseline: Record<string, number>;
  cells: PowerCell[];
  verdicts: PowerVerdict[];
}

function makeOwned(id: AbilityId, tier: AbilityTier): OwnedAbility {
  return { id, tier, mutations: [], usesLeftThisLevel: maxUsesForTier(id, tier) };
}

export interface PowerTestOpts {
  trials: number;
  botTier: TierId;
  /** Benchmark against the whole shipped roster (daily-report mode). */
  fullRoster: boolean;
  log?: (line: string) => void;
}

export function runPowerTest(opts: PowerTestOpts): PowerReport {
  const log = opts.log ?? (() => {});
  const bot = BOTS[opts.botTier];
  const testAbilities: AbilityId[] = [...EXPERIMENTAL_ABILITY_IDS];
  const referenceAbilities: AbilityId[] = opts.fullRoster
    ? [...SHIPPED_ABILITY_IDS]
    : ['freeze-ray', 'surge', 'drones'];

  const catalog = buildLevelCatalog().filter((e) => POWER_PANEL.includes(e.levelId));
  const missing = POWER_PANEL.filter((id) => !catalog.some((e) => e.levelId === id));
  if (missing.length > 0) {
    log(`[power] panel levels not found (skipped): ${missing.join(', ')}`);
  }
  log(
    `[power] ${catalog.length} levels × ${opts.trials} trials × ${opts.botTier} · ` +
      `${testAbilities.length} test + ${referenceAbilities.length} reference abilities × tiers ${TIERS.join('/')}`,
  );

  // Baseline win% per level.
  const baseline: Record<string, number> = {};
  for (const entry of catalog) {
    let wins = 0;
    for (let t = 0; t < opts.trials; t++) {
      const r = simulateGame({
        puzzle: entry.puzzle,
        runId: entry.runId,
        bot,
        seed: `power-base__${entry.levelId}__${t}`,
      });
      if (r.win) wins++;
    }
    baseline[entry.levelId] = wins / opts.trials;
    log(`[base] ${entry.levelId}\t${((wins / opts.trials) * 100).toFixed(0)}%`);
  }

  const cells: PowerCell[] = [];
  for (const kind of ['reference', 'test'] as const) {
    const ids = kind === 'test' ? testAbilities : referenceAbilities;
    for (const ability of ids) {
      for (const tier of TIERS) {
        const perLevel: PowerCell['perLevel'] = {};
        let sumDelta = 0;
        for (const entry of catalog) {
          let wins = 0;
          for (let t = 0; t < opts.trials; t++) {
            const r = simulateGame({
              puzzle: entry.puzzle,
              runId: entry.runId,
              bot,
              seed: `power-${ability}-T${tier}__${entry.levelId}__${t}`,
              preownedAbilities: [makeOwned(ability, tier)],
            });
            if (r.win) wins++;
          }
          const win = wins / opts.trials;
          const delta = win - (baseline[entry.levelId] ?? 0);
          perLevel[entry.levelId] = { win, delta };
          sumDelta += delta;
        }
        const meanDelta = sumDelta / catalog.length;
        cells.push({ ability, tier, kind, perLevel, meanDelta });
        log(
          `[${kind === 'test' ? 'TEST' : 'ref '}] ${ability}@T${tier}\tmeanΔ ${(meanDelta * 100).toFixed(1)}pp`,
        );
      }
    }
  }

  const verdicts = computeVerdicts(cells);
  return {
    botTier: opts.botTier,
    trials: opts.trials,
    panel: POWER_PANEL,
    tiers: TIERS,
    baseline,
    cells,
    verdicts,
  };
}

function computeVerdicts(cells: PowerCell[]): PowerVerdict[] {
  const out: PowerVerdict[] = [];
  const testAbilities = [...new Set(cells.filter((c) => c.kind === 'test').map((c) => c.ability))];
  for (const ability of testAbilities) {
    const deltas = TIERS.map(
      (t) => cells.find((c) => c.ability === ability && c.tier === t)!.meanDelta,
    );
    const monotonic = deltas[0] <= deltas[1] + 0.03 && deltas[1] <= deltas[2] + 0.03;
    let placement: PowerVerdict['placement'] = 'in-band';
    for (const tier of TIERS) {
      const refs = cells.filter((c) => c.kind === 'reference' && c.tier === tier);
      const lo = Math.min(...refs.map((r) => r.meanDelta));
      const hi = Math.max(...refs.map((r) => r.meanDelta));
      const d = cells.find((c) => c.ability === ability && c.tier === tier)!.meanDelta;
      if (d < lo - MARGIN) placement = 'underpowered';
      if (d > hi + MARGIN) placement = 'overpowered';
    }
    const peak = deltas[deltas.length - 1];
    let recommendation: string;
    if (placement === 'underpowered' || peak < 0.05) {
      recommendation =
        'HOLD — lift is at/below the weakest shipped abilities. Rework the mechanic or buff tiers before considering promotion.';
    } else if (placement === 'overpowered') {
      recommendation =
        'HOLD — stronger than every shipped ability. Nerf tier scaling, then retest before promotion.';
    } else if (!monotonic) {
      recommendation =
        'HOLD — power does not rise with tier. Fix the tier curve, then retest.';
    } else if (peak >= 0.30) {
      recommendation =
        'PROMOTE CANDIDATE — top-band lift with a clean tier curve. Needs card art + FX, then ship behind the offer pool.';
    } else {
      recommendation =
        'PROMOTE CANDIDATE (mid-band) — healthy, non-dominant lift. Needs card art + FX.';
    }
    out.push({ ability, deltas, monotonic, placement, recommendation });
  }
  return out;
}

/** Render the report as markdown — used by digest.ts for the daily digest. */
export function renderPowerReport(report: PowerReport): string[] {
  const lines: string[] = [];
  lines.push(
    `Every ability pre-owned at T1/T3/T5 on a fixed ${report.panel.length}-level panel (${report.botTier}, ${report.trials} trials/cell), measured as win-rate lift vs owning nothing. Experimental abilities are bot-only until promoted.`,
  );
  lines.push(``);
  for (const tier of report.tiers) {
    const rows = report.cells
      .filter((c) => c.tier === tier)
      .sort((a, b) => b.meanDelta - a.meanDelta);
    lines.push(`### T${tier} leaderboard`);
    lines.push(``);
    lines.push(`| # | Ability | | Δ win% |`);
    lines.push(`|--:|---|---|--:|`);
    rows.forEach((c, i) => {
      lines.push(
        `| ${i + 1} | ${c.ability} | ${c.kind === 'test' ? '**NEW**' : ''} | ${(c.meanDelta * 100).toFixed(1)}pp |`,
      );
    });
    lines.push(``);
  }
  lines.push(`### New-ability verdicts`);
  lines.push(``);
  for (const v of report.verdicts) {
    lines.push(
      `- **${v.ability}** — ${v.deltas.map((d, i) => `T${report.tiers[i]} ${(d * 100).toFixed(1)}pp`).join(' → ')}${v.monotonic ? '' : ' (NOT monotonic)'} · ${v.recommendation}`,
    );
  }
  return lines;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI entry.

function main(): void {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const trials = parseInt(args[0] ?? '25', 10);
  const botTier = (args[1] ?? 'T4') as TierId;
  const fullRoster = process.argv.includes('--full');

  const report = runPowerTest({ trials, botTier, fullRoster, log: console.log });

  console.log('\n' + renderPowerReport(report).join('\n'));

  const outPath = path.join('data', 'run-playtest', 'raw', 'ability-power-test.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\n[power] wrote ${outPath}`);
}

if (require.main === module) {
  main();
}
