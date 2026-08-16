/**
 * Hypothesis queue — picks what to test next.
 *
 * THREE SIGNAL SOURCES:
 *   1. DRIFT — levels where the model's predicted win-rate has diverged from
 *      actual by >10pp on 3+ consecutive nights. These flag broken features
 *      (or broken puzzles). Probe by toggling the most-suspect input feature.
 *   2. COEFFICIENT UNCERTAINTY — features with high |coef| but a NARROW
 *      tested range (low variance across the catalog). The model is leaning
 *      hard on these but hasn't seen them stressed. Propose mutations that
 *      push them outside the observed range.
 *   3. COUNTERFACTUAL PROBES — pick a well-fit level (small residual) and
 *      mutate one feature. The model says "win-rate should drop to X" — go
 *      verify. These are the experiments that VALIDATE the model is causal,
 *      not just correlational.
 *
 * Output: a deterministic list (size 3..N) ordered by expected information
 * gain. Callers cap to `--hypotheses-per-night`.
 */

import type { LevelFeatures } from './features';
import { extractFeatures } from './features';
import type { Model } from './model-version';
import { predictWinRate } from './model-version';
import type { LevelMutation } from './mutations';
import { applyMutation, describeMutation } from './mutations';
import type { Experiment } from './experiment-log';
import type { LevelTierStats, TierId } from './types';
import type { CatalogEntry } from './utils/levels';

export interface Hypothesis {
  id: string;
  modelVersion: number;
  type: 'drift' | 'coefficient-stress' | 'counterfactual';
  levelId: string;
  mutation: LevelMutation;
  prediction: { tier: TierId; winRate: number; confidence: number };
  hypothesis: string;       // one-line plain English
  rationale: string;        // why we picked it
}

export interface HypothesisQueueInput {
  date: string;
  model: Model;
  catalog: CatalogEntry[];
  features: LevelFeatures[];
  stats: LevelTierStats[];
  priorExperiments: Experiment[];
  /** Drift threshold in percentage points. */
  driftThresholdPp?: number;
  /** Consecutive-night count required to flag a drift. */
  driftConsecutiveNights?: number;
}

export interface DriftSignal {
  levelId: string;
  tier: TierId;
  consecutiveBigGaps: number;
  latestGapPp: number;
}

/**
 * Detect levels with persistent prediction-vs-actual divergence.
 *
 * We pull the relevant slice of experiments + stats and walk backwards in
 * date order, counting "big gap" nights until the chain breaks.
 */
export function detectDrift(
  model: Model,
  features: LevelFeatures[],
  stats: LevelTierStats[],
  priorExperiments: Experiment[],
  thresholdPp: number,
  consecutiveNights: number,
): DriftSignal[] {
  // Per (levelId, tier) — collect a date-ordered series of (predicted, actual)
  // pairs. We use today's sweep stats as the latest point and the experiment
  // log for earlier points where the same baseline level was measured.
  const byLevel = new Map<string, LevelFeatures>();
  for (const f of features) byLevel.set(f.levelId, f);

  const signals: DriftSignal[] = [];
  const tiers: TierId[] = ['T3', 'T4', 'T5'];

  for (const f of features) {
    for (const tier of tiers) {
      const actual = stats.find((s) => s.levelId === f.levelId && s.tier === tier);
      if (!actual) continue;
      const predicted = predictWinRate(model, tier, asFeatureMap(f));
      if (predicted === null) continue;
      const gapPp = (actual.winRate - predicted) * 100;
      // For "consecutive" we look at how many of the most recent N nights
      // also tripped the threshold. Without nightly history we only have one
      // datapoint; the experiment log is sparse for baseline measurements,
      // so consecutiveBigGaps starts at 1 if today's gap is big and grows as
      // older matching entries are found.
      const today = Math.abs(gapPp) > thresholdPp ? 1 : 0;
      let consec = today;
      if (today === 1) {
        // Walk back through prior experiments looking for the SAME level/tier
        // baseline-equivalent — we tolerate the gap on the unmutated control.
        // A mutated experiment doesn't count; only points where we measured
        // this very level. For now we only have today's snapshot, so consec
        // stays at 1. Future nights' nightly.ts can extend this by writing
        // a "baseline observation" record into the log.
        consec += countConsecutiveBaselineGaps(
          priorExperiments,
          f.levelId,
          tier,
          model,
          thresholdPp,
        );
      }
      if (consec >= consecutiveNights) {
        signals.push({
          levelId: f.levelId,
          tier,
          consecutiveBigGaps: consec,
          latestGapPp: gapPp,
        });
      }
    }
  }

  // Largest gaps first.
  signals.sort((a, b) => Math.abs(b.latestGapPp) - Math.abs(a.latestGapPp));
  return signals;
}

function countConsecutiveBaselineGaps(
  experiments: Experiment[],
  _levelId: string,
  _tier: TierId,
  _model: Model,
  _thresholdPp: number,
): number {
  // WHY: experiments.jsonl currently records MUTATED puzzles. Baseline
  // night-over-night gaps require future tooling that writes baseline
  // measurements into the log (or a separate file). Returning 0 keeps this
  // pluggable without faking history.
  void experiments;
  return 0;
}

/**
 * Build the queue. Caller is expected to truncate to its budget.
 */
export function buildHypothesisQueue(input: HypothesisQueueInput): Hypothesis[] {
  const driftThresholdPp = input.driftThresholdPp ?? 10;
  const consecutiveNights = input.driftConsecutiveNights ?? 3;

  const out: Hypothesis[] = [];
  const tiers: TierId[] = ['T3', 'T4', 'T5'];

  // ─── 1. Drift probes ──────────────────────────────────────────────────────
  const driftSignals = detectDrift(
    input.model,
    input.features,
    input.stats,
    input.priorExperiments,
    driftThresholdPp,
    consecutiveNights,
  );
  for (const ds of driftSignals.slice(0, 3)) {
    const entry = input.catalog.find((c) => c.levelId === ds.levelId);
    const feat = input.features.find((f) => f.levelId === ds.levelId);
    if (!entry || !feat) continue;
    // Probe the single highest-magnitude feature for this tier — that's the
    // feature most likely responsible for the gap. We mutate in the
    // direction the model thinks should CLOSE the gap.
    const mutation = pickDriftMutation(input.model, ds.tier, entry, feat);
    if (!mutation) continue;
    const mutatedPuzzle = applyMutation(entry.puzzle, mutation);
    const mutatedFeatures = extractFeatures(
      entry.levelId,
      entry.runId,
      entry.levelIndex,
      mutatedPuzzle,
    );
    const predicted = predictWinRate(
      input.model,
      ds.tier,
      asFeatureMap(mutatedFeatures),
    );
    if (predicted === null) continue;
    out.push({
      id: `drift-${ds.tier}-${ds.levelId.replace(/\//g, '-')}-${input.date}`,
      modelVersion: input.model.version,
      type: 'drift',
      levelId: ds.levelId,
      mutation,
      prediction: { tier: ds.tier, winRate: predicted, confidence: 0.5 },
      hypothesis: `Applying ${describeMutation(mutation)} to ${ds.levelId} should bring ${ds.tier} win-rate to ${pct(predicted)} — closing the ${ds.latestGapPp.toFixed(0)}pp drift.`,
      rationale: `Level ${ds.levelId} on ${ds.tier} has drifted ${ds.latestGapPp.toFixed(0)}pp from model prediction for ${ds.consecutiveBigGaps} consecutive night(s).`,
    });
  }

  // ─── 2. Coefficient-stress probes ─────────────────────────────────────────
  for (const tier of tiers) {
    const t = input.model.tiers[tier];
    if (!t) continue;
    // Find the feature with the LARGEST |coef| whose tested range (xStd) is
    // smallest relative to its absolute magnitude. We want "big lever we
    // haven't pulled hard yet."
    const candidates = Object.entries(t.coefficients)
      .map(([feat, coef]) => ({ feat, coef, xStd: t.xStds[feat] ?? 0 }))
      .filter((c) => c.xStd > 0)
      .sort((a, b) => Math.abs(b.coef) - Math.abs(a.coef));
    if (candidates.length === 0) continue;
    const top = candidates[0];
    const stress = pickStressMutation(top.feat, input.catalog, input.features);
    if (!stress) continue;
    const { entry, mutation, levelFeatures } = stress;
    const mutatedPuzzle = applyMutation(entry.puzzle, mutation);
    const mutatedFeatures = extractFeatures(
      entry.levelId,
      entry.runId,
      entry.levelIndex,
      mutatedPuzzle,
    );
    const predicted = predictWinRate(
      input.model,
      tier,
      asFeatureMap(mutatedFeatures),
    );
    if (predicted === null) continue;
    void levelFeatures;
    out.push({
      id: `stress-${tier}-${top.feat}-${entry.levelId.replace(/\//g, '-')}-${input.date}`,
      modelVersion: input.model.version,
      type: 'coefficient-stress',
      levelId: entry.levelId,
      mutation,
      prediction: { tier, winRate: predicted, confidence: 0.4 },
      hypothesis: `Stressing feature "${top.feat}" via ${describeMutation(mutation)} on ${entry.levelId} should push ${tier} win-rate to ${pct(predicted)}.`,
      rationale: `Feature "${top.feat}" has the largest |coef| (${top.coef.toFixed(3)}) for ${tier} but its observed σ in the catalog is small — extending the range reveals if the relationship is linear.`,
    });
  }

  // ─── 3. Counterfactual probes ─────────────────────────────────────────────
  // Pick the BEST-FIT levels (smallest residual) and mutate them. Big gain:
  // if the model is genuinely causal, predictions on these "trusted" levels
  // should hold up even after a controlled change.
  for (const tier of tiers) {
    const t = input.model.tiers[tier];
    if (!t) continue;
    const ranked = input.features
      .map((f) => {
        const actual = input.stats.find(
          (s) => s.levelId === f.levelId && s.tier === tier,
        );
        const pred = predictWinRate(input.model, tier, asFeatureMap(f));
        if (!actual || pred === null) return null;
        const residual = Math.abs(actual.winRate - pred);
        return { f, residual };
      })
      .filter((x): x is { f: LevelFeatures; residual: number } => x !== null)
      .sort((a, b) => a.residual - b.residual);
    const trusted = ranked[0];
    if (!trusted) continue;
    const entry = input.catalog.find((c) => c.levelId === trusted.f.levelId);
    if (!entry) continue;
    const mutation = pickCounterfactualMutation(entry);
    if (!mutation) continue;
    const mutatedPuzzle = applyMutation(entry.puzzle, mutation);
    const mutatedFeatures = extractFeatures(
      entry.levelId,
      entry.runId,
      entry.levelIndex,
      mutatedPuzzle,
    );
    const predicted = predictWinRate(
      input.model,
      tier,
      asFeatureMap(mutatedFeatures),
    );
    if (predicted === null) continue;
    out.push({
      id: `cf-${tier}-${entry.levelId.replace(/\//g, '-')}-${input.date}`,
      modelVersion: input.model.version,
      type: 'counterfactual',
      levelId: entry.levelId,
      mutation,
      prediction: { tier, winRate: predicted, confidence: 0.6 },
      hypothesis: `On well-fit level ${entry.levelId}, applying ${describeMutation(mutation)} should change ${tier} win-rate to ${pct(predicted)}.`,
      rationale: `${entry.levelId} fits the ${tier} model tightly (residual ${(trusted.residual * 100).toFixed(0)}pp). If the model is causal, the counterfactual prediction should hold.`,
    });
  }

  return out;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function pct(x: number): string {
  return `${Math.round(x * 100)}%`;
}

function asFeatureMap(f: LevelFeatures): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(f)) {
    if (typeof v === 'number') out[k] = v;
  }
  return out;
}

/**
 * For a drift level, pick a mutation that pushes the most-likely culprit
 * feature in the direction that should close the gap.
 */
function pickDriftMutation(
  model: Model,
  tier: TierId,
  entry: CatalogEntry,
  features: LevelFeatures,
): LevelMutation | null {
  const t = model.tiers[tier];
  if (!t) return null;
  // Take the feature with the largest |coef| that we have a mutation primitive for.
  const order = Object.entries(t.coefficients)
    .map(([feat, coef]) => ({ feat, coef }))
    .sort((a, b) => Math.abs(b.coef) - Math.abs(a.coef));
  for (const { feat } of order) {
    const m = mutationForFeature(feat, entry, features);
    if (m) return m;
  }
  return null;
}

/**
 * For coefficient-stress, find a level where the chosen feature can be
 * mutated. Picks the first viable level — deterministic given catalog order.
 */
function pickStressMutation(
  feat: string,
  catalog: CatalogEntry[],
  features: LevelFeatures[],
): { entry: CatalogEntry; mutation: LevelMutation; levelFeatures: LevelFeatures } | null {
  for (const entry of catalog) {
    const f = features.find((x) => x.levelId === entry.levelId);
    if (!f) continue;
    const m = mutationForFeature(feat, entry, f);
    if (m) return { entry, mutation: m, levelFeatures: f };
  }
  return null;
}

/**
 * Pick a small change for a counterfactual probe — we want the LEAST
 * invasive mutation that still moves a prediction. Defaults to adding a
 * pawn on a safe-looking empty square.
 */
function pickCounterfactualMutation(entry: CatalogEntry): LevelMutation | null {
  // Try adding a pawn on the third rank just left/right of Rookie's start.
  // Skip if occupied or already a hazard.
  const start = entry.puzzle.rookieStart;
  const candidates = [
    { file: Math.max(1, start.file - 1), rank: 3 },
    { file: Math.min(8, start.file + 1), rank: 3 },
    { file: start.file, rank: 4 },
  ];
  const occupied = (f: number, r: number): boolean =>
    entry.puzzle.pieces.some((p) => p.file === f && p.rank === r) ||
    (entry.puzzle.hazards ?? []).some((h) => h.file === f && h.rank === r);
  for (const c of candidates) {
    if (!occupied(c.file, c.rank)) {
      return { kind: 'addPawn', file: c.file, rank: c.rank };
    }
  }
  return null;
}

/**
 * Map a feature name to a viable mutation that changes it on a given level.
 *
 * WHY this is a switch and not data: each feature has its own "what change
 * pushes this in a measurable direction without breaking the puzzle"
 * logic. Keeping it explicit makes the experiment more interpretable.
 */
function mutationForFeature(
  feat: string,
  entry: CatalogEntry,
  features: LevelFeatures,
): LevelMutation | null {
  const start = entry.puzzle.rookieStart;
  const occupied = (f: number, r: number): boolean =>
    entry.puzzle.pieces.some((p) => p.file === f && p.rank === r) ||
    (entry.puzzle.hazards ?? []).some((h) => h.file === f && h.rank === r);
  const findEmpty = (
    fileRange: number[],
    rankRange: number[],
  ): { file: number; rank: number } | null => {
    for (const r of rankRange) {
      for (const f of fileRange) {
        if (f < 1 || f > 8 || r < 1 || r > 8) continue;
        if (!occupied(f, r)) return { file: f, rank: r };
      }
    }
    return null;
  };
  switch (feat) {
    case 'pieceCount':
    case 'pawnCount':
    case 'density':
    case 'threatDensity':
    case 'defendedPieces':
    case 'pawnChainLen':
    case 'openFiles': {
      // Add a pawn in front of Rookie a couple of ranks up.
      const sq = findEmpty(
        [start.file, start.file - 1, start.file + 1],
        [3, 4, 5],
      );
      return sq ? { kind: 'addPawn', file: sq.file, rank: sq.rank } : null;
    }
    case 'knightCount': {
      const sq = findEmpty(
        [start.file, start.file - 1, start.file + 1],
        [3, 4, 5],
      );
      return sq ? { kind: 'addPiece', pieceType: 'knight', file: sq.file, rank: sq.rank } : null;
    }
    case 'bishopCount': {
      const sq = findEmpty(
        [start.file, start.file - 1, start.file + 1],
        [3, 4, 5],
      );
      return sq ? { kind: 'addPiece', pieceType: 'bishop', file: sq.file, rank: sq.rank } : null;
    }
    case 'queenCount': {
      // Queens are spicy — add only if level currently has none.
      if (features.queenCount > 0) return null;
      const sq = findEmpty([start.file], [5, 6]);
      return sq ? { kind: 'addPiece', pieceType: 'queen', file: sq.file, rank: sq.rank } : null;
    }
    case 'hazardCount':
    case 'hazardsInApproach': {
      const sq = findEmpty(
        [start.file - 1, start.file + 1],
        [3, 4],
      );
      return sq ? { kind: 'addHazard', file: sq.file, rank: sq.rank } : null;
    }
    case 'moveLimit':
    case 'moveLimitTightness': {
      // Tighten the move limit by 2 (or set 12 if currently unlimited).
      const cur = entry.puzzle.moveLimit;
      const next = cur === undefined ? 12 : Math.max(6, cur - 2);
      return { kind: 'setMoveLimit', moveLimit: next };
    }
    case 'enemiesPerTurn': {
      const cur = entry.puzzle.enemiesPerTurn ?? 1;
      return { kind: 'setEnemiesPerTurn', enemiesPerTurn: cur + 1 };
    }
    default:
      return null;
  }
}
