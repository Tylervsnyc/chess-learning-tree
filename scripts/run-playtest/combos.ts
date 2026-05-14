/**
 * Pair-combo analysis — for every pair (A, B) of the 10 abilities, run sims
 * where both are seeded into the bot's owned set at T1 from level 1.
 *
 * The signal we want is *synergy*: does (A + B) over-perform the sum of
 * (A alone) + (B alone)? The math:
 *
 *   soloA_delta = winRate(preowned: A) - baseline
 *   soloB_delta = winRate(preowned: B) - baseline
 *   pair_delta  = winRate(preowned: A, B) - baseline
 *   synergy     = pair_delta - soloA_delta - soloB_delta
 *
 * Positive synergy = A + B is more than the sum of its parts (combo).
 * Negative synergy = A + B redundant or anti-synergistic.
 *
 * We emit only the upper triangle of the 10×10 matrix since A+B == B+A.
 *
 * ── Cost control ────────────────────────────────────────────────────────────
 * 45 pairs × 3 tiers × N trials × 110 levels is expensive (742K games at
 * N=50). We default `--combo-trials` to 30 and sample a representative
 * subset of 20 levels, picked by an even stride through the catalog so we
 * cover early/mid/late difficulty without paying the full sweep cost. The
 * `levelSampleSize` option overrides this if callers want broader coverage.
 *
 * The solo deltas use the same sampled subset so the synergy math stays
 * apples-to-apples — comparing pair-on-sample vs solo-on-sample.
 */

import {
  SHIPPED_ABILITY_IDS,
  maxUsesForTier,
} from '../../lib/run/abilities';
import type {
  AbilityId,
  OwnedAbility,
} from '../../lib/run/abilities';
import { runSweep } from './sweep';
import { aggregate } from './aggregate';
import { buildLevelCatalog } from './utils/levels';
import type { ComboResult, LevelTierStats, Outcome, TierId } from './types';

export interface ComboOpts {
  trials: number;
  baselineOutcomes: Outcome[];
  tiers?: TierId[];
  /** How many levels to sample. Default 20. Use full catalog if >= catalog.size. */
  levelSampleSize?: number;
  onProgress?: (line: string) => void;
}

export interface ComboRunResult {
  results: ComboResult[];
  sampledLevelIds: string[];
}

export function runCombos(opts: ComboOpts): ComboRunResult {
  const tiers: TierId[] = opts.tiers ?? ['T3', 'T4', 'T5'];
  const catalog = buildLevelCatalog();
  const sampleSize = opts.levelSampleSize ?? 20;
  const sampledLevelIds = pickSample(catalog.map((c) => c.levelId), sampleSize);
  // levelFilter passed to runSweep is a substring match. We rebuild it as
  // an exact-set filter by intersecting after the sweep — that lets us pass
  // the same simple options into runSweep without changing its surface.
  const sampleSet = new Set(sampledLevelIds);

  // Baseline on the sample — same trial count as combos, so noise is matched.
  opts.onProgress?.(`[combos] baseline on ${sampledLevelIds.length} levels`);
  const baselineRaw = runSweep({ trials: opts.trials, tiers });
  const baselineFiltered = baselineRaw.filter((o) => sampleSet.has(o.levelId));
  const baselineByTier = perTierWinRate(aggregate(baselineFiltered), tiers);

  // Solo deltas — pre-own each ability alone, average win-rate on the sample.
  const soloByAbilityTier = new Map<string, number>();
  for (const id of SHIPPED_ABILITY_IDS) {
    opts.onProgress?.(`[combos] solo ${id}`);
    const raw = runSweep({
      trials: opts.trials,
      tiers,
      preownedAbilities: [seedAbility(id)],
    });
    const filtered = raw.filter((o) => sampleSet.has(o.levelId));
    const stats = aggregate(filtered);
    for (const tier of tiers) {
      const wr = meanWinRate(stats.filter((s) => s.tier === tier));
      soloByAbilityTier.set(`${id}|${tier}`, wr);
    }
  }

  // Pair deltas — upper triangle only (A < B by SHIPPED_ABILITY_IDS index).
  const results: ComboResult[] = [];
  for (let i = 0; i < SHIPPED_ABILITY_IDS.length; i++) {
    for (let j = i + 1; j < SHIPPED_ABILITY_IDS.length; j++) {
      const A = SHIPPED_ABILITY_IDS[i];
      const B = SHIPPED_ABILITY_IDS[j];
      opts.onProgress?.(`[combos] pair ${A} + ${B}`);
      const raw = runSweep({
        trials: opts.trials,
        tiers,
        preownedAbilities: [seedAbility(A), seedAbility(B)],
      });
      const filtered = raw.filter((o) => sampleSet.has(o.levelId));
      const stats = aggregate(filtered);
      for (const tier of tiers) {
        const baseline = baselineByTier.get(tier) ?? 0;
        const pair = meanWinRate(stats.filter((s) => s.tier === tier));
        const soloA = soloByAbilityTier.get(`${A}|${tier}`) ?? baseline;
        const soloB = soloByAbilityTier.get(`${B}|${tier}`) ?? baseline;
        const pairDeltaPp = (pair - baseline) * 100;
        const soloADeltaPp = (soloA - baseline) * 100;
        const soloBDeltaPp = (soloB - baseline) * 100;
        results.push({
          abilityA: A,
          abilityB: B,
          tier,
          baselineWinRate: baseline,
          pairWinRate: pair,
          pairDeltaPp,
          soloADeltaPp,
          soloBDeltaPp,
          synergyPp: pairDeltaPp - soloADeltaPp - soloBDeltaPp,
        });
      }
    }
  }

  return { results, sampledLevelIds };
}

// ── helpers ─────────────────────────────────────────────────────────────────

/**
 * Pick `n` levels with an even stride through the catalog. Cheap, deterministic,
 * and biased toward covering the entire difficulty curve rather than a random
 * cluster. We use the catalog order — which is run-then-level — so the stride
 * naturally interleaves runs.
 */
function pickSample(allLevelIds: string[], n: number): string[] {
  if (n >= allLevelIds.length) return [...allLevelIds];
  const out: string[] = [];
  // Stride math: pick indices i = round(k * step) for k in [0, n).
  const step = (allLevelIds.length - 1) / Math.max(1, n - 1);
  const seen = new Set<number>();
  for (let k = 0; k < n; k++) {
    const idx = Math.round(k * step);
    if (seen.has(idx)) continue;
    seen.add(idx);
    out.push(allLevelIds[idx]);
  }
  return out;
}

function seedAbility(id: AbilityId): OwnedAbility {
  // Start at T1 — the combo question we care about is "does owning these
  // *at all* from level 1 reshape the run?", not "what about a maxed pair?".
  return {
    id,
    tier: 1,
    mutations: [],
    usesLeftThisLevel: maxUsesForTier(id, 1),
  };
}

function meanWinRate(arr: LevelTierStats[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b.winRate, 0) / arr.length;
}

function perTierWinRate(
  stats: LevelTierStats[],
  tiers: TierId[],
): Map<TierId, number> {
  const out = new Map<TierId, number>();
  for (const tier of tiers) {
    out.set(tier, meanWinRate(stats.filter((s) => s.tier === tier)));
  }
  return out;
}
