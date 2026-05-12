/**
 * Versioned model files for the multivariate difficulty model.
 *
 * WHY: improvements have to PROVE themselves. Every night we refit the model
 * with the latest data, but we only publish a new version if the held-out R²
 * actually improves on the prior version (a majority-of-tiers vote keeps
 * one noisy tier from blocking a real gain). Otherwise we stay on the prior
 * version. This is the "scientific method as infrastructure" guarantee:
 * the model that drives hypothesis-queue predictions is one that beat its
 * predecessor on out-of-sample data.
 *
 * Layout:
 *   data/run-playtest/models/model-v1.json
 *   data/run-playtest/models/model-v2.json
 *   …
 *   data/run-playtest/models/current.json   (a copy of the latest published)
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { RegressionReport, TierRegression } from './regression';
import type { TierId } from './types';

export interface ModelTier {
  /** Mirrors RegressionReport tier but flattened so the file is easy to inspect. */
  tier: TierId;
  coefficients: Record<string, number>;
  intercept: number;          // un-standardized intercept (predicted-y when all features at training mean)
  xMeans: Record<string, number>;
  xStds: Record<string, number>;
  yMean: number;
  yStd: number;
  trainR2: number;
  heldoutR2: number;
  samples: number;
}

export interface Model {
  version: number;
  date: string;               // YYYY-MM-DD when this version was published
  tiers: Record<TierId, ModelTier>;
}

const MODELS_REL = 'data/run-playtest/models';

function repoRoot(): string {
  return join(__dirname, '..', '..');
}

function modelsDir(): string {
  return join(repoRoot(), MODELS_REL);
}

function modelPath(version: number): string {
  return join(modelsDir(), `model-v${version}.json`);
}

/** Discover the highest committed model version on disk. Returns 0 if none. */
function latestVersionNumber(): number {
  const dir = modelsDir();
  if (!existsSync(dir)) return 0;
  let max = 0;
  for (const file of readdirSync(dir)) {
    const m = /^model-v(\d+)\.json$/.exec(file);
    if (!m) continue;
    const n = parseInt(m[1], 10);
    if (n > max) max = n;
  }
  return max;
}

export function loadCurrent(): Model | null {
  const v = latestVersionNumber();
  if (v === 0) return null;
  const path = modelPath(v);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Model;
  } catch {
    return null;
  }
}

/**
 * Build a Model object from a RegressionReport. Translates standardized-X /
 * standardized-y coefficients back into a single-step prediction form:
 *   predicted_y = intercept + Σ coefficients[k] * (x_k - xMean_k) / xStd_k * yStd
 *
 * We store the standardized coefficients directly (so existing regression
 * code can be reused) and remember the standardization params so the
 * hypothesis-queue can score predictions without rerunning the fit.
 */
export function modelFromRegression(
  date: string,
  version: number,
  report: RegressionReport,
): Model {
  const tiers = {} as Record<TierId, ModelTier>;
  for (const tr of report.tiers) {
    tiers[tr.tier] = modelTierFromRegression(tr);
  }
  return { version, date, tiers };
}

function modelTierFromRegression(tr: TierRegression): ModelTier {
  return {
    tier: tr.tier,
    // WHY: we store the std-y / std-x coefficients (the canonical regression
    // coefficient table) AND the standardization stats. The predict() helper
    // un-standardizes at inference time.
    coefficients: { ...tr.stdCoefficients },
    intercept: tr.yMean,           // predicted-y when every feature is at xMean
    xMeans: { ...tr.xMeans },
    xStds: { ...tr.xStds },
    yMean: tr.yMean,
    yStd: tr.yStd,
    trainR2: tr.trainR2,
    heldoutR2: tr.holdoutR2,
    samples: tr.samples,
  };
}

/**
 * Predict win-rate for a feature dictionary under a given tier of a model.
 *
 * coefficients are Δy_raw per σ_x_raw (yStd has already been folded in by
 * the regression). So:
 *   predicted = yMean + Σ coef_k * (x_k - xMean_k) / xStd_k
 */
export function predictWinRate(
  model: Model,
  tier: TierId,
  features: Record<string, number>,
): number | null {
  const t = model.tiers[tier];
  if (!t) return null;
  let y = t.intercept;
  for (const [feat, coef] of Object.entries(t.coefficients)) {
    const xStd = t.xStds[feat] ?? 0;
    if (xStd === 0) continue;
    const x = features[feat];
    if (typeof x !== 'number' || !Number.isFinite(x)) continue;
    const xMean = t.xMeans[feat] ?? 0;
    y += coef * ((x - xMean) / xStd);
  }
  // Clamp to a sane range — the linear model can extrapolate outside [0,1]
  // on mutated puzzles, and downstream consumers want a win probability.
  if (y < 0) y = 0;
  if (y > 1) y = 1;
  return y;
}

export interface PublishResult {
  published: boolean;
  version: number;             // version that is now "current" (new or prior)
  priorVersion: number;        // 0 if there was no prior
  reason: string;
  heldOutR2: Record<TierId, number>;
  priorHeldOutR2?: Record<TierId, number>;
}

/**
 * Decide whether to publish a new model version.
 *
 * Rule: publish IFF held-out R² beats the prior version on ≥2 of 3 tiers.
 *   - If there is no prior version, the candidate is published as v1.
 *   - Otherwise the file is NOT written and we return reason="…".
 *
 * Side effect: writes model-vN.json AND current.json on publish.
 */
export async function proposeNewVersion(
  candidate: Omit<Model, 'version'>,
  heldOutR2: Record<TierId, number>,
): Promise<PublishResult> {
  const prior = loadCurrent();
  const dir = modelsDir();
  mkdirSync(dir, { recursive: true });

  if (!prior) {
    // No prior — bootstrap as v1. Nothing to beat, by definition.
    const version = 1;
    const model: Model = { ...candidate, version };
    writeFileSync(modelPath(version), JSON.stringify(model, null, 2));
    writeFileSync(join(dir, 'current.json'), JSON.stringify(model, null, 2));
    return {
      published: true,
      version,
      priorVersion: 0,
      reason: 'No prior model — bootstrapped as v1.',
      heldOutR2,
    };
  }

  const priorHeldOut: Record<TierId, number> = {
    T3: prior.tiers.T3?.heldoutR2 ?? -Infinity,
    T4: prior.tiers.T4?.heldoutR2 ?? -Infinity,
    T5: prior.tiers.T5?.heldoutR2 ?? -Infinity,
  };
  const tiers: TierId[] = ['T3', 'T4', 'T5'];
  let wins = 0;
  const perTier: string[] = [];
  for (const t of tiers) {
    const newR2 = heldOutR2[t] ?? -Infinity;
    const oldR2 = priorHeldOut[t];
    const delta = newR2 - oldR2;
    perTier.push(`${t}: ${oldR2.toFixed(2)}→${newR2.toFixed(2)} (Δ${delta >= 0 ? '+' : ''}${delta.toFixed(2)})`);
    if (newR2 > oldR2 + 1e-6) wins++;
  }

  if (wins >= 2) {
    const version = prior.version + 1;
    const model: Model = { ...candidate, version };
    writeFileSync(modelPath(version), JSON.stringify(model, null, 2));
    writeFileSync(join(dir, 'current.json'), JSON.stringify(model, null, 2));
    return {
      published: true,
      version,
      priorVersion: prior.version,
      reason: `Held-out R² improved on ${wins}/3 tiers. ${perTier.join(' · ')}`,
      heldOutR2,
      priorHeldOutR2: priorHeldOut,
    };
  }

  return {
    published: false,
    version: prior.version,
    priorVersion: prior.version,
    reason: `Only beat prior on ${wins}/3 tiers (need ≥2). ${perTier.join(' · ')}`,
    heldOutR2,
    priorHeldOutR2: priorHeldOut,
  };
}
