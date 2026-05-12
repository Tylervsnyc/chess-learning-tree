/**
 * Forced-take analysis — disambiguates "bots own this but never use it" from
 * "bots actively avoid this." For each ability, run two sweeps:
 *
 *   force-accept: bots MUST take the ability whenever it appears in an offer
 *   force-skip:   bots MUST refuse the ability whenever it appears in an offer
 *
 * Compare each scenario's win-rate to the baseline.
 *
 *   acceptDeltaPp > 0  → forcing takes helped; bots were leaving value on the
 *                        table (the ability is good but they ignored it)
 *   acceptDeltaPp < 0  → forcing takes hurt; the ability is actively a trap
 *                        when picked
 *   skipDeltaPp   > 0  → forcing skips helped; bots were taking it when they
 *                        shouldn't (mirrors ablation's "trap" tag)
 *   skipDeltaPp   < 0  → forcing skips hurt; bots correctly want this ability
 *
 * The pair (acceptDeltaPp, skipDeltaPp) tells you whether an ability's
 * "low usage" comes from rationality or from bot blind-spot.
 */

import { ALL_ABILITY_IDS } from '../../lib/run/abilities';
import type { AbilityId } from '../../lib/run/abilities';
import { aggregate } from './aggregate';
import { runSweep } from './sweep';
import type { ForcedTakeResult, LevelTierStats, Outcome, TierId } from './types';

export interface ForcedTakeOpts {
  trials: number;
  baselineOutcomes: Outcome[];
  tiers?: TierId[];
  onProgress?: (line: string) => void;
}

export function runForcedTake(opts: ForcedTakeOpts): {
  results: ForcedTakeResult[];
  rawAccept: Record<AbilityId, Outcome[]>;
  rawSkip: Record<AbilityId, Outcome[]>;
} {
  const tiers: TierId[] = opts.tiers ?? ['T3', 'T4', 'T5'];
  // Tier-average baseline win-rate — same shape ablation uses so the deltas
  // are directly comparable.
  const baselineStats = aggregate(opts.baselineOutcomes);
  const baselineWinByTier = new Map<TierId, number>();
  for (const tier of tiers) {
    const arr = baselineStats.filter((s) => s.tier === tier);
    baselineWinByTier.set(tier, meanWinRate(arr));
  }

  const results: ForcedTakeResult[] = [];
  const rawAccept: Record<string, Outcome[]> = {};
  const rawSkip: Record<string, Outcome[]> = {};

  for (const ability of ALL_ABILITY_IDS) {
    opts.onProgress?.(`[forced-take] force-accept ${ability}`);
    const acceptOutcomes = runSweep({
      trials: opts.trials,
      tiers,
      forcedAcceptIds: new Set([ability]),
    });
    rawAccept[ability] = acceptOutcomes;
    const acceptStats = aggregate(acceptOutcomes);

    opts.onProgress?.(`[forced-take] force-skip ${ability}`);
    const skipOutcomes = runSweep({
      trials: opts.trials,
      tiers,
      forcedSkipIds: new Set([ability]),
    });
    rawSkip[ability] = skipOutcomes;
    const skipStats = aggregate(skipOutcomes);

    for (const tier of tiers) {
      const baseline = baselineWinByTier.get(tier) ?? 0;
      const acceptTier = meanWinRate(acceptStats.filter((s) => s.tier === tier));
      const skipTier = meanWinRate(skipStats.filter((s) => s.tier === tier));
      results.push({
        ability,
        tier,
        baselineWinRate: baseline,
        forceAcceptWinRate: acceptTier,
        forceSkipWinRate: skipTier,
        acceptDeltaPp: (acceptTier - baseline) * 100,
        skipDeltaPp: (skipTier - baseline) * 100,
      });
    }
  }

  return {
    results,
    rawAccept: rawAccept as Record<AbilityId, Outcome[]>,
    rawSkip: rawSkip as Record<AbilityId, Outcome[]>,
  };
}

function meanWinRate(arr: LevelTierStats[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b.winRate, 0) / arr.length;
}
