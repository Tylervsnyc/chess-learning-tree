/**
 * Aggregate raw sweep outcomes into per-(level, tier) summary stats.
 */

import type { AbilityId } from '../../lib/run/abilities';
import type { PieceType } from '../../lib/run/types';
import type { LevelTierStats, Outcome, TierId } from './types';

export function aggregate(outcomes: Outcome[]): LevelTierStats[] {
  const byKey = new Map<string, Outcome[]>();
  for (const r of outcomes) {
    const key = `${r.levelId}|${r.tier}`;
    const arr = byKey.get(key) ?? [];
    arr.push(r);
    byKey.set(key, arr);
  }

  const out: LevelTierStats[] = [];
  for (const [, arr] of byKey) {
    const first = arr[0];
    const wins = arr.filter((a) => a.win).length;
    const fails = arr.filter((a) => !a.win);
    const movesAvg =
      arr.reduce((s, a) => s + a.movesUsed, 0) / Math.max(1, arr.length);
    const captured = fails.filter((a) => a.failMode === 'captured').length;
    const moveLimit = fails.filter((a) => a.failMode === 'move-limit').length;
    const deadEnd = fails.filter((a) => a.failMode === 'dead-end').length;

    const killerCounts: Record<PieceType, number> = {
      pawn: 0,
      knight: 0,
      bishop: 0,
      queen: 0,
    };
    for (const a of fails) {
      if (a.capturedBy) killerCounts[a.capturedBy]++;
    }
    let topKiller: PieceType | null = null;
    let topCount = 0;
    for (const k of Object.keys(killerCounts) as PieceType[]) {
      if (killerCounts[k] > topCount) {
        topCount = killerCounts[k];
        topKiller = k;
      }
    }

    out.push({
      levelId: first.levelId,
      runId: first.runId,
      levelIndex: first.levelIndex,
      level: first.level,
      tier: first.tier,
      trials: arr.length,
      wins,
      winRate: wins / Math.max(1, arr.length),
      meanMoves: movesAvg,
      capturedRate: captured / Math.max(1, fails.length || 1),
      moveLimitRate: moveLimit / Math.max(1, fails.length || 1),
      deadEndRate: deadEnd / Math.max(1, fails.length || 1),
      topKiller,
      meanAbilitiesTaken:
        arr.reduce((s, a) => s + a.abilitiesTaken.length, 0) /
        Math.max(1, arr.length),
      meanAbilitiesUsed:
        arr.reduce((s, a) => s + a.abilitiesUsed.length, 0) /
        Math.max(1, arr.length),
    });
  }

  // Stable sort: by (runId, levelIndex, tier).
  out.sort((a, b) => {
    if (a.runId !== b.runId) return a.runId.localeCompare(b.runId);
    if (a.levelIndex !== b.levelIndex) return a.levelIndex - b.levelIndex;
    return tierOrder(a.tier) - tierOrder(b.tier);
  });

  return out;
}

function tierOrder(t: TierId): number {
  return t === 'T3' ? 0 : t === 'T4' ? 1 : 2;
}

/** Per-ability take-rate across the whole sweep. */
export function abilityTakeRates(outcomes: Outcome[]): Map<AbilityId, number> {
  const counts = new Map<AbilityId, number>();
  const totals = outcomes.length;
  for (const r of outcomes) {
    for (const id of r.abilitiesTaken) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  const rates = new Map<AbilityId, number>();
  for (const [id, c] of counts) rates.set(id, c / Math.max(1, totals));
  return rates;
}
