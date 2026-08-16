/**
 * Experiment runner.
 *
 * Given a hypothesis (mutation + prediction), apply the mutation to the
 * named level, run N trials at the predicted tier, compute the actual
 * win-rate, and return a verdict.
 *
 * Verdict rules (gap in pp = |actual - predicted| * 100):
 *   - confirmed     : gap <= 2 / max(0.01, confidence)
 *   - falsified     : gap >  5 / max(0.01, confidence)
 *   - inconclusive  : everything in between
 *
 * WHY confidence as a divisor: a HIGHER confidence prediction must hit a
 * TIGHTER target. A 0.6-confidence hypothesis can be confirmed within
 * 2/0.6 ≈ 3.3pp; a 0.4-confidence one needs only 2/0.4 = 5pp. This keeps
 * us honest: don't claim high confidence unless you really believe the model.
 */

import { T3 } from './bots/t3';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import { simulateGame } from './simulate';
import { buildLevelCatalog } from './utils/levels';
import { applyMutation } from './mutations';
import type { Bot, Outcome, TierId } from './types';
import type { Hypothesis } from './hypothesis-queue';
import type { Experiment, Verdict } from './experiment-log';

const BOTS: Record<TierId, Bot> = { T3, T4, T5 };

export interface RunExperimentOpts {
  date: string;             // YYYY-MM-DD label written into the Experiment record
  hypothesis: Hypothesis;
  trialsPerCell: number;
}

export async function runExperiment(opts: RunExperimentOpts): Promise<Experiment> {
  const { hypothesis, trialsPerCell, date } = opts;
  const catalog = buildLevelCatalog();
  const entry = catalog.find((c) => c.levelId === hypothesis.levelId);
  if (!entry) {
    // WHY explicit failure: a hypothesis pointing at a non-existent level
    // means the catalog changed between queue generation and execution.
    // Returning an inconclusive verdict keeps the pipeline alive while
    // surfacing the issue in the log.
    return {
      date,
      hypothesisId: hypothesis.id,
      modelVersion: hypothesis.modelVersion,
      hypothesis: hypothesis.hypothesis,
      levelId: hypothesis.levelId,
      mutation: hypothesis.mutation,
      prediction: hypothesis.prediction,
      actual: { tier: hypothesis.prediction.tier, winRate: 0, trials: 0 },
      verdict: 'inconclusive',
      deltaPp: 0,
      notes: `Level not found in catalog: ${hypothesis.levelId}`,
    };
  }

  const tier = hypothesis.prediction.tier;
  const bot = BOTS[tier];
  const mutatedPuzzle = applyMutation(entry.puzzle, hypothesis.mutation);

  let wins = 0;
  const outcomes: Outcome[] = [];
  for (let trial = 0; trial < trialsPerCell; trial++) {
    // Seed key includes the hypothesis id so different experiments don't
    // share trajectories. Determinism preserved within an experiment.
    const seed = `exp::${hypothesis.id}__${tier}__${trial}`;
    const r = simulateGame({
      puzzle: mutatedPuzzle,
      bot,
      seed,
    });
    // Strip `finalState` — experiment serialization doesn't need the
    // end-of-game board.
    const { finalState: _final, ...outcome } = r;
    void _final;
    outcomes.push({
      ...outcome,
      levelId: entry.levelId,
      runId: entry.runId,
      levelIndex: entry.levelIndex,
      level: mutatedPuzzle.level,
      tier,
      trial,
    });
    if (r.win) wins++;
  }
  const actualWinRate = trialsPerCell > 0 ? wins / trialsPerCell : 0;
  const deltaPp = (actualWinRate - hypothesis.prediction.winRate) * 100;
  const verdict = decideVerdict(deltaPp, hypothesis.prediction.confidence);

  return {
    date,
    hypothesisId: hypothesis.id,
    modelVersion: hypothesis.modelVersion,
    hypothesis: hypothesis.hypothesis,
    levelId: hypothesis.levelId,
    mutation: hypothesis.mutation,
    prediction: hypothesis.prediction,
    actual: { tier, winRate: actualWinRate, trials: trialsPerCell },
    verdict,
    deltaPp,
    notes: hypothesis.rationale,
  };
}

function decideVerdict(deltaPp: number, confidenceIn: number): Verdict {
  // WHY guard the divisor: a zero or negative confidence is a caller bug.
  // We clamp to 0.01 so the thresholds become enormous and the verdict is
  // effectively "inconclusive" rather than crashing.
  const confidence = Math.max(0.01, confidenceIn);
  const abs = Math.abs(deltaPp);
  const confirmThreshold = 2 / confidence;
  const falsifyThreshold = 5 / confidence;
  if (abs <= confirmThreshold) return 'confirmed';
  if (abs > falsifyThreshold) return 'falsified';
  return 'inconclusive';
}
