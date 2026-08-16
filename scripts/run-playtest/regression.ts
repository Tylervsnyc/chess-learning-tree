/**
 * Multivariate ridge regression of level features → win-rate per tier.
 *
 * Why ridge, not OLS: features are correlated (pieceCount ↔ density,
 * threatDensity ↔ defendedPieces, …). Plain OLS produces unstable
 * coefficients and inflated R². λ=0.1 on standardized features is a
 * mild prior that keeps coefficients comparable in magnitude without
 * washing out real signal.
 *
 * Why hold-out: train R² is meaningless with 19 features over ~30
 * levels — the model can overfit. A deterministic 20% hold-out
 * (seeded by tier name hash) gives a stable read on generalization
 * across nights.
 *
 * Why standardize: the digest says "each std-dev of X changes win-rate
 * by N pp." That requires features and target on comparable scales.
 * Predictions in original units are not needed downstream, so we keep
 * everything in standardized space and store mean/std for any consumer
 * that wants to un-standardize.
 *
 * Why Gauss-Jordan, not LU/QR: the system is 19×19. Numerical conditioning
 * is fine with λ>0, and Gauss-Jordan with partial pivoting is short,
 * dependency-free, and easy to audit. If we ever push to 100+ features
 * we should switch to QR.
 */

import type { LevelFeatures } from './features';
import type { LevelTierStats, TierId } from './types';

// Same set the univariate correlator uses. Keeping these aligned matters
// because the digest cross-references both views.
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

const RIDGE_LAMBDA = 0.1;
const HOLDOUT_FRACTION = 0.2;

export interface FeatureImportance {
  feature: string;
  /** Coefficient on the standardized feature (interpretable as Δy per σ_x). */
  stdCoef: number;
  /** |stdCoef| — magnitude only, for ranking. */
  importance: number;
}

export interface TierRegression {
  tier: TierId;
  samples: number;
  trainSize: number;
  holdoutSize: number;
  /** Coefficients on standardized features, keyed by feature name. */
  stdCoefficients: Record<string, number>;
  /** Mean of y on the training set (the intercept in standardized-y space is 0). */
  yMean: number;
  yStd: number;
  /** Per-feature standardization params, useful for un-standardizing if needed. */
  xMeans: Record<string, number>;
  xStds: Record<string, number>;
  trainR2: number;
  holdoutR2: number;
  importance: FeatureImportance[];
  /** Top 5 features by importance, pre-sorted for digest convenience. */
  top5: FeatureImportance[];
}

export interface RegressionReport {
  tiers: TierRegression[];
}

export function regressFeatures(
  features: LevelFeatures[],
  stats: LevelTierStats[],
): RegressionReport {
  const tiers: TierId[] = ['T3', 'T4', 'T5'];
  const out: TierRegression[] = [];
  for (const tier of tiers) {
    const tr = fitTier(tier, features, stats);
    if (tr) out.push(tr);
  }
  return { tiers: out };
}

function fitTier(
  tier: TierId,
  features: LevelFeatures[],
  stats: LevelTierStats[],
): TierRegression | null {
  const tierStats = stats.filter((s) => s.tier === tier);
  const byLevelId = new Map(tierStats.map((s) => [s.levelId, s]));
  const aligned = features
    .map((f) => ({ f, s: byLevelId.get(f.levelId) }))
    .filter((x): x is { f: LevelFeatures; s: LevelTierStats } => x.s !== undefined);

  // Need at least (features + a few) samples to fit anything meaningful.
  // With 19 features, 25 is a soft floor; below that the hold-out can't
  // even contain a sample.
  if (aligned.length < Math.max(FEATURE_KEYS.length + 2, 6)) return null;

  // Deterministic shuffle by tier hash, then split. Index → priority via
  // a tier-seeded LCG keeps the hold-out stable across nights as long as
  // the level catalog doesn't change order.
  const seed = hashString(`regression::${tier}`);
  const order = deterministicShuffleIndices(aligned.length, seed);
  const holdoutN = Math.max(1, Math.round(aligned.length * HOLDOUT_FRACTION));
  const holdoutIdx = new Set(order.slice(0, holdoutN));

  const train = aligned.filter((_, i) => !holdoutIdx.has(i));
  const holdout = aligned.filter((_, i) => holdoutIdx.has(i));

  // Build raw X (n × p) and y (n) from training set.
  const xRawTrain = train.map((a) => FEATURE_KEYS.map((k) => Number(a.f[k])));
  const yRawTrain = train.map((a) => a.s.winRate);

  // Standardize features. Constant features (std=0) get coefficient 0
  // and effectively drop out.
  const xMeans = columnMeans(xRawTrain);
  const xStds = columnStds(xRawTrain, xMeans);
  const xTrain = standardize(xRawTrain, xMeans, xStds);

  // Standardize y too so the coefficients have a clean "Δy_std per σ_x"
  // interpretation. We un-standardize at the end so the digest can talk
  // about pp directly.
  const yMean = mean(yRawTrain);
  const yStd = std(yRawTrain, yMean);
  const yTrain = yRawTrain.map((y) => (yStd > 0 ? (y - yMean) / yStd : 0));

  // β = (XᵀX + λI)⁻¹ Xᵀy
  const xtx = mulATA(xTrain);
  const p = FEATURE_KEYS.length;
  for (let i = 0; i < p; i++) xtx[i][i] += RIDGE_LAMBDA;
  const xty = mulATv(xTrain, yTrain);
  const beta = solve(xtx, xty);

  // Convert beta (standardized X, standardized y) → coefficients that
  // explain Δy_raw per σ_x_raw. That's beta * yStd. This is the form the
  // digest narrates.
  const stdCoef: Record<string, number> = {};
  for (let j = 0; j < FEATURE_KEYS.length; j++) {
    stdCoef[String(FEATURE_KEYS[j])] = beta[j] * yStd;
  }

  // Train R² in the un-standardized space (predict raw winRate).
  const yHatTrainStd = matVec(xTrain, beta);
  const yHatTrain = yHatTrainStd.map((v) => v * yStd + yMean);
  const trainR2 = r2(yRawTrain, yHatTrain);

  // Hold-out R² — standardize hold-out X with TRAINING stats (no peeking).
  let holdoutR2 = 0;
  if (holdout.length > 0) {
    const xRawHold = holdout.map((a) => FEATURE_KEYS.map((k) => Number(a.f[k])));
    const yRawHold = holdout.map((a) => a.s.winRate);
    const xHold = standardize(xRawHold, xMeans, xStds);
    const yHatHoldStd = matVec(xHold, beta);
    const yHatHold = yHatHoldStd.map((v) => v * yStd + yMean);
    holdoutR2 = r2(yRawHold, yHatHold);
  }

  // Importance = |stdCoef|. Because both X and y were standardized
  // before fitting, |beta_j| already encodes magnitude — multiplying by
  // yStd just rescales uniformly, so the ordering is preserved.
  const importance: FeatureImportance[] = FEATURE_KEYS.map((k) => {
    const c = stdCoef[String(k)] ?? 0;
    return { feature: String(k), stdCoef: c, importance: Math.abs(c) };
  });
  importance.sort((a, b) => b.importance - a.importance);
  const top5 = importance.slice(0, 5);

  const xMeansRec: Record<string, number> = {};
  const xStdsRec: Record<string, number> = {};
  FEATURE_KEYS.forEach((k, j) => {
    xMeansRec[String(k)] = xMeans[j];
    xStdsRec[String(k)] = xStds[j];
  });

  return {
    tier,
    samples: aligned.length,
    trainSize: train.length,
    holdoutSize: holdout.length,
    stdCoefficients: stdCoef,
    yMean,
    yStd,
    xMeans: xMeansRec,
    xStds: xStdsRec,
    trainR2,
    holdoutR2,
    importance,
    top5,
  };
}

// ─── matrix ops ─────────────────────────────────────────────────────────────

function mulATA(x: number[][]): number[][] {
  // XᵀX — symmetric p×p. Hand-rolled because we don't want a numeric dep
  // and matrix-multiply is the most performance-sensitive op here.
  const n = x.length;
  const p = x[0]?.length ?? 0;
  const out: number[][] = [];
  for (let i = 0; i < p; i++) out.push(new Array<number>(p).fill(0));
  for (let i = 0; i < p; i++) {
    for (let j = i; j < p; j++) {
      let s = 0;
      for (let r = 0; r < n; r++) s += x[r][i] * x[r][j];
      out[i][j] = s;
      out[j][i] = s;
    }
  }
  return out;
}

function mulATv(x: number[][], v: number[]): number[] {
  const n = x.length;
  const p = x[0]?.length ?? 0;
  const out = new Array<number>(p).fill(0);
  for (let j = 0; j < p; j++) {
    let s = 0;
    for (let r = 0; r < n; r++) s += x[r][j] * v[r];
    out[j] = s;
  }
  return out;
}

function matVec(x: number[][], v: number[]): number[] {
  const n = x.length;
  const p = v.length;
  const out = new Array<number>(n).fill(0);
  for (let r = 0; r < n; r++) {
    let s = 0;
    for (let j = 0; j < p; j++) s += x[r][j] * v[j];
    out[r] = s;
  }
  return out;
}

/**
 * Solve A x = b via Gauss-Jordan elimination with partial pivoting.
 * In-place on a copy. λI added by caller keeps A well-conditioned.
 */
function solve(aIn: number[][], bIn: number[]): number[] {
  const n = aIn.length;
  // Augmented matrix [A | b]
  const m: number[][] = aIn.map((row, i) => [...row, bIn[i]]);
  for (let col = 0; col < n; col++) {
    // Partial pivot — pick the row with largest |value| in this column
    // from row `col` downward. Necessary even with ridge: ill-scaled
    // features can still produce small pivots.
    let pivot = col;
    let pivotMag = Math.abs(m[col][col]);
    for (let r = col + 1; r < n; r++) {
      const mag = Math.abs(m[r][col]);
      if (mag > pivotMag) {
        pivot = r;
        pivotMag = mag;
      }
    }
    if (pivotMag < 1e-12) {
      // Singular even after ridge — shouldn't happen with λ>0 unless
      // the feature matrix is degenerate. Zero out the row's solution
      // contribution; downstream coefficient for this column becomes 0.
      continue;
    }
    if (pivot !== col) {
      const tmp = m[col];
      m[col] = m[pivot];
      m[pivot] = tmp;
    }
    const pv = m[col][col];
    for (let j = col; j <= n; j++) m[col][j] /= pv;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = m[r][col];
      if (f === 0) continue;
      for (let j = col; j <= n; j++) m[r][j] -= f * m[col][j];
    }
  }
  return m.map((row) => row[n]);
}

// ─── stats helpers ──────────────────────────────────────────────────────────

function columnMeans(x: number[][]): number[] {
  const n = x.length;
  const p = x[0]?.length ?? 0;
  const out = new Array<number>(p).fill(0);
  for (let j = 0; j < p; j++) {
    let s = 0;
    for (let r = 0; r < n; r++) s += x[r][j];
    out[j] = n > 0 ? s / n : 0;
  }
  return out;
}

function columnStds(x: number[][], means: number[]): number[] {
  const n = x.length;
  const p = means.length;
  const out = new Array<number>(p).fill(0);
  for (let j = 0; j < p; j++) {
    let s = 0;
    for (let r = 0; r < n; r++) {
      const d = x[r][j] - means[j];
      s += d * d;
    }
    out[j] = n > 0 ? Math.sqrt(s / n) : 0;
  }
  return out;
}

function standardize(
  x: number[][],
  means: number[],
  stds: number[],
): number[][] {
  return x.map((row) =>
    row.map((v, j) => (stds[j] > 0 ? (v - means[j]) / stds[j] : 0)),
  );
}

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  let s = 0;
  for (const x of xs) s += x;
  return s / xs.length;
}

function std(xs: number[], m: number): number {
  if (xs.length === 0) return 0;
  let s = 0;
  for (const x of xs) s += (x - m) ** 2;
  return Math.sqrt(s / xs.length);
}

function r2(yTrue: number[], yPred: number[]): number {
  if (yTrue.length === 0) return 0;
  const mTrue = mean(yTrue);
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < yTrue.length; i++) {
    ssRes += (yTrue[i] - yPred[i]) ** 2;
    ssTot += (yTrue[i] - mTrue) ** 2;
  }
  // ssTot==0 → all targets identical → R² undefined; report 0 so we
  // don't show a spurious 1.0.
  if (ssTot === 0) return 0;
  return 1 - ssRes / ssTot;
}

// ─── deterministic hold-out shuffle ─────────────────────────────────────────

function hashString(s: string): number {
  // FNV-1a 32-bit. Plenty of entropy for seeding an LCG over <50 levels.
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function deterministicShuffleIndices(n: number, seed: number): number[] {
  // Fisher-Yates with a tier-seeded LCG. Same seed → same split forever,
  // which is what we want for night-over-night stability.
  const idx = Array.from({ length: n }, (_, i) => i);
  let state = seed || 1;
  const rand = (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = idx[i];
    idx[i] = idx[j];
    idx[j] = t;
  }
  return idx;
}
