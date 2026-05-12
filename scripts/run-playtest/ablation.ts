/**
 * Ablation — re-run the sweep with one ability removed from the offer pool,
 * for each ability in the game. Compare per-level win rates against baseline.
 *
 * Negative deltaPp = removing the ability *hurt* players (it was a crutch).
 * Positive deltaPp = removing the ability *helped* players (it was a trap).
 * Near-zero = ability is dead weight (bots never use it effectively).
 */

import { ALL_ABILITY_IDS } from '../../lib/run/abilities';
import type { AbilityId } from '../../lib/run/abilities';
import { aggregate } from './aggregate';
import { runSweep } from './sweep';
import type { AblationResult, LevelTierStats, Outcome, TierId } from './types';

export interface AblationOpts {
  trials: number;
  baselineOutcomes: Outcome[];
  tiers?: TierId[];
  onProgress?: (line: string) => void;
}

export function runAblation(opts: AblationOpts): {
  results: AblationResult[];
  rawByAbility: Record<AbilityId, Outcome[]>;
} {
  const tiers: TierId[] = opts.tiers ?? ['T3', 'T4', 'T5'];
  const baselineStats = aggregate(opts.baselineOutcomes);
  const baselineByKey = new Map<string, LevelTierStats>();
  for (const s of baselineStats) baselineByKey.set(`${s.levelId}|${s.tier}`, s);

  const baselineWinByTier = new Map<TierId, number>();
  for (const tier of tiers) {
    const arr = baselineStats.filter((s) => s.tier === tier);
    baselineWinByTier.set(
      tier,
      arr.reduce((a, b) => a + b.winRate, 0) / Math.max(1, arr.length),
    );
  }

  const results: AblationResult[] = [];
  const rawByAbility: Record<string, Outcome[]> = {};

  for (const ability of ALL_ABILITY_IDS) {
    opts.onProgress?.(`[ablation] sweeping without ${ability}`);
    const ablatedOutcomes = runSweep({
      trials: opts.trials,
      tiers,
      excludedAbilities: new Set([ability]),
    });
    rawByAbility[ability] = ablatedOutcomes;
    const ablatedStats = aggregate(ablatedOutcomes);
    const ablatedByKey = new Map<string, LevelTierStats>();
    for (const s of ablatedStats) ablatedByKey.set(`${s.levelId}|${s.tier}`, s);

    for (const tier of tiers) {
      const baselineTier = baselineWinByTier.get(tier) ?? 0;
      const ablatedTierArr = ablatedStats.filter((s) => s.tier === tier);
      const ablatedTier =
        ablatedTierArr.reduce((a, b) => a + b.winRate, 0) /
        Math.max(1, ablatedTierArr.length);

      const perLevel: { levelId: string; deltaPp: number }[] = [];
      for (const s of ablatedTierArr) {
        const baseline = baselineByKey.get(`${s.levelId}|${s.tier}`);
        if (!baseline) continue;
        perLevel.push({
          levelId: s.levelId,
          deltaPp: (s.winRate - baseline.winRate) * 100,
        });
      }

      results.push({
        ability,
        tier,
        baselineWinRate: baselineTier,
        ablatedWinRate: ablatedTier,
        deltaPp: (ablatedTier - baselineTier) * 100,
        perLevel,
      });
    }
  }

  return { results, rawByAbility: rawByAbility as Record<AbilityId, Outcome[]> };
}

/** Tag each ability with an interpretation based on its tier deltas. */
export function tagAbility(perTier: AblationResult[]): {
  ability: AbilityId;
  tag: string;
  note: string;
} {
  const t3 = perTier.find((r) => r.tier === 'T3');
  const t4 = perTier.find((r) => r.tier === 'T4');
  const t5 = perTier.find((r) => r.tier === 'T5');
  const ability = perTier[0].ability;

  const minDelta = Math.min(
    t3?.deltaPp ?? 0,
    t4?.deltaPp ?? 0,
    t5?.deltaPp ?? 0,
  );

  // negative deltaPp = removing ability hurt players → ability was helpful
  // positive deltaPp = removing ability helped players → ability was a trap

  // OP: removing it dropped win-% by 15+ percentage points anywhere
  if (minDelta < -15) {
    return { ability, tag: 'op', note: 'Major crutch — players lean on it heavily.' };
  }
  // Trash: removing it changed nothing across tiers (within ±2pp)
  if (
    Math.abs(t3?.deltaPp ?? 0) < 2 &&
    Math.abs(t4?.deltaPp ?? 0) < 2 &&
    Math.abs(t5?.deltaPp ?? 0) < 2
  ) {
    return {
      ability,
      tag: 'trash',
      note: 'No measurable effect — bots never use it meaningfully.',
    };
  }
  // Expert-only: T5 drop is significant but T3 is flat
  if ((t5?.deltaPp ?? 0) < -5 && Math.abs(t3?.deltaPp ?? 0) < 2) {
    return {
      ability,
      tag: 'expert-only',
      note: 'Only helps strong players — beginners ignore it.',
    };
  }
  // Trap: removing it *helped* (positive delta) at T3
  if ((t3?.deltaPp ?? 0) > 5) {
    return {
      ability,
      tag: 'trap',
      note: 'Beginners take it but it hurts them.',
    };
  }
  return { ability, tag: 'normal', note: 'Modest helpful effect.' };
}
