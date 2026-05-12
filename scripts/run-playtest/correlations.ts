/**
 * Compute Pearson correlations between each feature and win-rate per tier.
 *
 * Univariate only — Phase 3 will upgrade to multivariate regression. But
 * univariate is already revealing: "open files correlates +0.7 with T3 win
 * rate" is a strong signal worth shipping in the first digest.
 */

import type { LevelFeatures } from './features';
import type { LevelTierStats, TierId } from './types';

export interface FeatureCorrelation {
  feature: string;
  tier: TierId;
  pearson: number;        // -1..1
  meanWhenHigh: number;   // mean win-rate on top quartile of feature
  meanWhenLow: number;    // mean win-rate on bottom quartile
  samples: number;
}

const FEATURE_KEYS: (keyof LevelFeatures)[] = [
  'pieceCount',
  'pawnCount',
  'knightCount',
  'bishopCount',
  'queenCount',
  'density',
  'openFiles',
  'defendedPieces',
  'pawnChainLen',
  'hazardCount',
  'hazardsInApproach',
  'moveLimit',
  'moveLimitTightness',
  'enemiesPerTurn',
  'allowedFormsCount',
  'threatDensity',
  'approachWidth',
  'chokePointCount',
  'minLegalDistance',
];

export function correlateFeatures(
  features: LevelFeatures[],
  stats: LevelTierStats[],
): FeatureCorrelation[] {
  const out: FeatureCorrelation[] = [];
  const tiers: TierId[] = ['T3', 'T4', 'T5'];
  for (const tier of tiers) {
    const tierStats = stats.filter((s) => s.tier === tier);
    const byLevelId = new Map(tierStats.map((s) => [s.levelId, s]));
    const aligned = features
      .map((f) => ({ f, s: byLevelId.get(f.levelId) }))
      .filter((x): x is { f: LevelFeatures; s: LevelTierStats } => x.s !== undefined);

    if (aligned.length < 4) continue;

    const ys = aligned.map((a) => a.s.winRate);
    for (const key of FEATURE_KEYS) {
      const xs = aligned.map((a) => Number(a.f[key]));
      if (variance(xs) === 0) continue; // constant feature, skip
      const pearson = pearsonCorrelation(xs, ys);
      const quartile = topBottomQuartileMeans(xs, ys);
      out.push({
        feature: String(key),
        tier,
        pearson,
        meanWhenHigh: quartile.high,
        meanWhenLow: quartile.low,
        samples: aligned.length,
      });
    }
  }

  // Sort by absolute Pearson per tier, strongest first.
  out.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier.localeCompare(b.tier);
    return Math.abs(b.pearson) - Math.abs(a.pearson);
  });
  return out;
}

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
}

function variance(xs: number[]): number {
  const m = mean(xs);
  return xs.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, xs.length);
}

function pearsonCorrelation(xs: number[], ys: number[]): number {
  if (xs.length !== ys.length || xs.length === 0) return 0;
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < xs.length; i++) {
    const ax = xs[i] - mx;
    const ay = ys[i] - my;
    num += ax * ay;
    dx += ax * ax;
    dy += ay * ay;
  }
  const denom = Math.sqrt(dx * dy);
  if (denom === 0) return 0;
  return num / denom;
}

function topBottomQuartileMeans(
  xs: number[],
  ys: number[],
): { high: number; low: number } {
  const pairs = xs.map((x, i) => ({ x, y: ys[i] }));
  pairs.sort((a, b) => a.x - b.x);
  const q = Math.max(1, Math.floor(pairs.length / 4));
  const low = mean(pairs.slice(0, q).map((p) => p.y));
  const high = mean(pairs.slice(-q).map((p) => p.y));
  return { high, low };
}
