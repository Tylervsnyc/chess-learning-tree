#!/usr/bin/env -S npx tsx
/**
 * Nightly orchestrator. Runs the full pipeline and writes outputs.
 *
 * Usage:
 *   npx tsx scripts/run-playtest/nightly.ts [flags]
 *
 * Defaults (tuned for a ~30 min run that fits inside cloud-agent runtime caps):
 *   --sweep-trials=150       (baseline trials per (level, tier))
 *   --ablation-trials=80
 *   --hypotheses-per-night=3
 *   forced-take + combos are OFF by default — enable via --full or explicit flag
 *
 * Flags:
 *   --full                   weekly deep dive: enables forced-take + combos at full trial counts
 *   --quick                  fast smoke: trials=20, ablation=10, hypotheses=1, no combos / no forced-take
 *   --enable-forced-take     turn forced-take on (default off — too slow for nightly)
 *   --enable-combos          turn combos on
 *   --forced-take-trials=N
 *   --combo-trials=N         capped at 30 because 45 pairs × 3 tiers × N is expensive
 *   --combo-sample-size=N    representative subset of levels for combos
 *
 * Outputs:
 *   data/run-playtest/raw/YYYY-MM-DD/sweep.json
 *   data/run-playtest/raw/YYYY-MM-DD/ablation.json
 *   data/run-playtest/raw/YYYY-MM-DD/forced-take.json
 *   data/run-playtest/raw/YYYY-MM-DD/combos.json
 *   data/run-playtest/raw/YYYY-MM-DD/features.json
 *   data/run-playtest/raw/YYYY-MM-DD/correlations.json
 *   data/run-playtest/raw/YYYY-MM-DD/regression.json
 *   data/run-playtest/raw/YYYY-MM-DD/hypotheses.json
 *   data/run-playtest/raw/YYYY-MM-DD/experiments.json
 *   data/run-playtest/raw/YYYY-MM-DD/model-publish.json
 *   data/run-playtest/experiments.jsonl   (append-only, committed)
 *   data/run-playtest/models/model-vN.json
 *   data/run-playtest/digests/YYYY-MM-DD.md
 *   data/run-playtest/digests/latest.md   (copy)
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { runSweep } from './sweep';
import { aggregate } from './aggregate';
import { runAblation } from './ablation';
import { runForcedTake } from './forced-take';
import { runCombos } from './combos';
import { runAbilityImpact } from './simulate-run';
import type { AbilityForceMode } from './simulate-run';
import { T3 } from './bots/t3';
import { extractFeatures } from './features';
import { correlateFeatures } from './correlations';
import { regressFeatures } from './regression';
import { renderDigest } from './digest';
import { buildLevelCatalog } from './utils/levels';
import {
  loadCurrent,
  modelFromRegression,
  proposeNewVersion,
} from './model-version';
import type { PublishResult } from './model-version';
import { buildHypothesisQueue } from './hypothesis-queue';
import type { Hypothesis } from './hypothesis-queue';
import { runExperiment } from './experiment';
import { appendExperiment, readAll as readAllExperiments } from './experiment-log';
import type { Experiment } from './experiment-log';
import type { ComboResult, ForcedTakeResult, TierId } from './types';

interface CliOpts {
  sweepTrials: number;
  ablationTrials: number;
  forcedTakeTrials: number;
  comboTrials: number;
  comboSampleSize: number;
  hypothesesPerNight: number;
  experimentTrials: number;
  quick: boolean;
  skipAblation: boolean;
  skipFeatures: boolean;
  skipHypotheses: boolean;
  skipAbilityImpact: boolean;
  enableForcedTake: boolean;
  enableCombos: boolean;
  abilityImpactRunId: string;
  abilityImpactTrials: number;
}

function parseArgs(): CliOpts {
  // WHY these defaults: the nightly remote agent has a runtime cap (~60 min).
  // Forced-take + combos were the culprit when the 2026-05-13 run died
  // mid-pipeline (forced-take alone took 63 min at the old defaults). Both
  // are now opt-in via --full or explicit --enable-* flags. The trimmed sweep
  // + ablation budget hits ~30 min end-to-end, leaving plenty of headroom.
  const opts: CliOpts = {
    sweepTrials: 150,
    ablationTrials: 80,
    forcedTakeTrials: 60,
    comboTrials: 30,
    comboSampleSize: 20,
    hypothesesPerNight: 3,
    experimentTrials: 60,
    quick: false,
    skipAblation: false,
    skipFeatures: false,
    skipHypotheses: false,
    skipAbilityImpact: false,
    enableForcedTake: false,
    enableCombos: false,
    // the-gauntlet at T3 has the best signal-to-noise — baseline 2.00 levels,
    // so any ability that helps shows up clearly. Cost: ~3 min at 5 trials.
    abilityImpactRunId: 'the-gauntlet',
    abilityImpactTrials: 5,
  };
  let hypothesesExplicit = false;
  let forcedTakeExplicit = false;
  let combosExplicit = false;
  let fullMode = false;
  for (const arg of process.argv.slice(2)) {
    if (arg === '--quick') opts.quick = true;
    else if (arg === '--full') fullMode = true;
    else if (arg === '--skip-ablation') opts.skipAblation = true;
    else if (arg === '--skip-features') opts.skipFeatures = true;
    else if (arg === '--skip-hypotheses') opts.skipHypotheses = true;
    else if (arg === '--skip-ability-impact') opts.skipAbilityImpact = true;
    else if (arg.startsWith('--ability-impact-run='))
      opts.abilityImpactRunId = arg.split('=')[1];
    else if (arg.startsWith('--ability-impact-trials='))
      opts.abilityImpactTrials = parseInt(arg.split('=')[1], 10);
    else if (arg === '--enable-forced-take') {
      opts.enableForcedTake = true;
      forcedTakeExplicit = true;
    } else if (arg === '--disable-forced-take') {
      opts.enableForcedTake = false;
      forcedTakeExplicit = true;
    } else if (arg === '--enable-combos') {
      opts.enableCombos = true;
      combosExplicit = true;
    } else if (arg === '--disable-combos') {
      opts.enableCombos = false;
      combosExplicit = true;
    } else if (arg.startsWith('--sweep-trials='))
      opts.sweepTrials = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--ablation-trials='))
      opts.ablationTrials = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--forced-take-trials='))
      opts.forcedTakeTrials = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--combo-trials='))
      opts.comboTrials = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--combo-sample-size='))
      opts.comboSampleSize = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--hypotheses-per-night=')) {
      opts.hypothesesPerNight = parseInt(arg.split('=')[1], 10);
      hypothesesExplicit = true;
    } else if (arg.startsWith('--experiment-trials='))
      opts.experimentTrials = parseInt(arg.split('=')[1], 10);
  }
  if (fullMode) {
    // Weekly deep dive. Pushes everything on at production trial counts.
    opts.sweepTrials = 200;
    opts.ablationTrials = 120;
    opts.forcedTakeTrials = 80;
    if (!hypothesesExplicit) opts.hypothesesPerNight = 5;
    opts.experimentTrials = 80;
    if (!forcedTakeExplicit) opts.enableForcedTake = true;
    if (!combosExplicit) opts.enableCombos = true;
  }
  if (opts.quick) {
    opts.sweepTrials = 20;
    opts.ablationTrials = 10;
    opts.forcedTakeTrials = 10;
    if (!hypothesesExplicit) opts.hypothesesPerNight = 1;
    opts.experimentTrials = 10;
    if (!combosExplicit) opts.enableCombos = false;
    if (!forcedTakeExplicit) opts.enableForcedTake = false;
  }
  return opts;
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function main(): Promise<void> {
  const opts = parseArgs();
  const date = today();
  const repoRoot = join(__dirname, '..', '..');
  const rawDir = join(repoRoot, 'data', 'run-playtest', 'raw', date);
  const digestsDir = join(repoRoot, 'data', 'run-playtest', 'digests');
  mkdirSync(rawDir, { recursive: true });
  mkdirSync(digestsDir, { recursive: true });

  const caveats: string[] = [];

  // ─── Sweep ────────────────────────────────────────────────────────────
  console.log(`[nightly] ${date}: starting sweep (${opts.sweepTrials} trials per cell)`);
  const t0 = Date.now();
  const sweep = runSweep({
    trials: opts.sweepTrials,
    onProgress: (s) => console.log(s),
  });
  const sweepStats = aggregate(sweep);
  writeFileSync(join(rawDir, 'sweep.json'), JSON.stringify(sweep, null, 0));
  writeFileSync(join(rawDir, 'sweep-stats.json'), JSON.stringify(sweepStats, null, 2));
  console.log(`[nightly] sweep done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  // ─── Ablation ─────────────────────────────────────────────────────────
  let ablationResults: ReturnType<typeof runAblation>['results'] = [];
  if (!opts.skipAblation) {
    console.log(`[nightly] ablation (${opts.ablationTrials} trials × 10 abilities)`);
    const tA = Date.now();
    const { results } = runAblation({
      trials: opts.ablationTrials,
      baselineOutcomes: sweep,
      onProgress: (s) => console.log(s),
    });
    ablationResults = results;
    writeFileSync(join(rawDir, 'ablation.json'), JSON.stringify(results, null, 2));
    console.log(`[nightly] ablation done in ${((Date.now() - tA) / 1000).toFixed(1)}s`);
  } else {
    caveats.push('Ablation skipped this run (--skip-ablation).');
  }

  // ─── Forced-take ──────────────────────────────────────────────────────
  // WHY separate from ablation: ablation removes the ability from the offer
  // pool entirely. Forced-take leaves the pool alone but biases the *pick*.
  // The combination tells us whether low usage is rational or a blind-spot.
  let forcedTakeResults: ForcedTakeResult[] = [];
  if (opts.enableForcedTake) {
    console.log(
      `[nightly] forced-take (${opts.forcedTakeTrials} trials × 10 abilities × 2 scenarios)`,
    );
    const tF = Date.now();
    const { results } = runForcedTake({
      trials: opts.forcedTakeTrials,
      baselineOutcomes: sweep,
      onProgress: (s) => console.log(s),
    });
    forcedTakeResults = results;
    writeFileSync(
      join(rawDir, 'forced-take.json'),
      JSON.stringify(results, null, 2),
    );
    console.log(
      `[nightly] forced-take done in ${((Date.now() - tF) / 1000).toFixed(1)}s`,
    );
  } else {
    caveats.push('Forced-take skipped this run.');
  }

  // ─── Pair-combo ───────────────────────────────────────────────────────
  // Cost-heavy — see combos.ts header. We run on a small representative
  // level sample by default. Skipped in --quick.
  let comboResults: ComboResult[] = [];
  let comboSampledLevels: string[] = [];
  if (opts.enableCombos) {
    console.log(
      `[nightly] combos (${opts.comboTrials} trials × 45 pairs × 3 tiers on ${opts.comboSampleSize}-level sample)`,
    );
    const tC = Date.now();
    const { results, sampledLevelIds } = runCombos({
      trials: opts.comboTrials,
      baselineOutcomes: sweep,
      levelSampleSize: opts.comboSampleSize,
      onProgress: (s) => console.log(s),
    });
    comboResults = results;
    comboSampledLevels = sampledLevelIds;
    writeFileSync(
      join(rawDir, 'combos.json'),
      JSON.stringify({ sampledLevelIds, results }, null, 2),
    );
    console.log(`[nightly] combos done in ${((Date.now() - tC) / 1000).toFixed(1)}s`);
  } else {
    caveats.push('Pair-combos skipped this run.');
  }

  // ─── Ability Impact (run-level) ───────────────────────────────────────
  // The canonical ability ranking. Force-seeds each ability at T3 for the
  // full run, measures end-of-run levels reached vs no-ability baseline.
  // Catches what the per-level ablation misses: cross-level resource value
  // and abilities the offer system rarely fires.
  let abilityImpact: ReturnType<typeof runAbilityImpact> | null = null;
  if (!opts.skipAbilityImpact) {
    console.log(
      `[nightly] ability-impact (${opts.abilityImpactTrials} trials × 11 abilities on ${opts.abilityImpactRunId} at T3)`,
    );
    const tI = Date.now();
    abilityImpact = runAbilityImpact({
      trials: opts.abilityImpactTrials,
      bot: T3,
      runId: opts.abilityImpactRunId,
      rookieStart: { file: 4, rank: 1 },
      modes: ['fixed-t3'],
      onProgress: (s) => console.log(s),
    });
    writeFileSync(
      join(rawDir, 'ability-impact.json'),
      JSON.stringify(
        {
          runId: opts.abilityImpactRunId,
          baseline: abilityImpact.baseline,
          byAbility: Array.from(abilityImpact.byAbility.entries()).map(
            ([id, byMode]) => ({
              ability: id,
              modes: Array.from(byMode.entries()).map(([mode, row]) => ({ mode, ...row })),
            }),
          ),
        },
        null,
        2,
      ),
    );
    console.log(
      `[nightly] ability-impact done in ${((Date.now() - tI) / 1000).toFixed(1)}s`,
    );
  } else {
    caveats.push('Ability impact skipped this run.');
  }

  // ─── Features + correlations ──────────────────────────────────────────
  if (!opts.skipFeatures) {
    console.log(`[nightly] extracting level features`);
    const catalog = buildLevelCatalog();
    const features = catalog.map((e) =>
      extractFeatures(e.levelId, e.runId, e.levelIndex, e.puzzle),
    );
    const correlations = correlateFeatures(features, sweepStats);
    writeFileSync(join(rawDir, 'features.json'), JSON.stringify(features, null, 2));
    writeFileSync(
      join(rawDir, 'correlations.json'),
      JSON.stringify(correlations, null, 2),
    );

    // Multivariate ridge regression — runs after the univariate pass so
    // the digest can show both views and we can sanity-check that
    // strong Pearson features also rank high in importance.
    const regression = regressFeatures(features, sweepStats);
    writeFileSync(
      join(rawDir, 'regression.json'),
      JSON.stringify(regression, null, 2),
    );

    // ─── Hypothesis loop ─────────────────────────────────────────────────
    // WHY this lives between regression and digest: the loop needs the
    // freshly fit regression to refit/publish, the prior committed model
    // to generate predictions, and the digest needs the experiment results
    // + publish decision to render the "Hypothesis Ledger" section. The
    // append-only JSONL is the system's memory across nights.
    let hypothesisRunResults: Experiment[] = [];
    let publishResult: PublishResult | null = null;
    let hypothesesPlanned: Hypothesis[] = [];
    if (!opts.skipHypotheses) {
      const priorModel = loadCurrent();
      if (priorModel) {
        console.log(
          `[nightly] hypothesis loop (planning up to ${opts.hypothesesPerNight} for v${priorModel.version})`,
        );
        hypothesesPlanned = buildHypothesisQueue({
          date,
          model: priorModel,
          catalog,
          features,
          stats: sweepStats,
          priorExperiments: readAllExperiments(),
        }).slice(0, Math.max(0, opts.hypothesesPerNight));
        writeFileSync(
          join(rawDir, 'hypotheses.json'),
          JSON.stringify(hypothesesPlanned, null, 2),
        );
        for (const h of hypothesesPlanned) {
          console.log(`[nightly]   → ${h.id} (${h.type})`);
          const exp = await runExperiment({
            date,
            hypothesis: h,
            trialsPerCell: opts.experimentTrials,
          });
          appendExperiment(exp);
          hypothesisRunResults.push(exp);
        }
        writeFileSync(
          join(rawDir, 'experiments.json'),
          JSON.stringify(hypothesisRunResults, null, 2),
        );
      } else {
        console.log(
          `[nightly] no prior model — bootstrapping v1 from this night's regression`,
        );
        caveats.push(
          'Hypothesis loop skipped: no prior model to generate predictions. Bootstrapping v1 from this night.',
        );
      }

      // Refit + propose a new model version. The refit uses today's sweep
      // stats — that's the canonical "new evidence" that has to beat the
      // prior held-out R² on ≥2/3 tiers to be published.
      const heldOutR2 = {
        T3: regression.tiers.find((t) => t.tier === 'T3')?.holdoutR2 ?? 0,
        T4: regression.tiers.find((t) => t.tier === 'T4')?.holdoutR2 ?? 0,
        T5: regression.tiers.find((t) => t.tier === 'T5')?.holdoutR2 ?? 0,
      } as Record<TierId, number>;
      // proposeNewVersion picks the version number, so we pass 0 placeholder.
      const candidate = modelFromRegression(date, 0, regression);
      publishResult = await proposeNewVersion(candidate, heldOutR2);
      writeFileSync(
        join(rawDir, 'model-publish.json'),
        JSON.stringify(publishResult, null, 2),
      );
      console.log(
        `[nightly] model: ${publishResult.published ? 'PUBLISHED' : 'kept'} v${publishResult.version} — ${publishResult.reason}`,
      );
    } else {
      console.log(`[nightly] hypothesis loop skipped (--skip-hypotheses)`);
    }

    // ─── Digest ─────────────────────────────────────────────────────────
    const md = renderDigest({
      date,
      trialsPerCell: opts.sweepTrials,
      ablationTrials: opts.skipAblation ? 0 : opts.ablationTrials,
      baselineStats: sweepStats,
      ablation: ablationResults,
      forcedTake: forcedTakeResults,
      combos: comboResults,
      comboSampledLevels,
      features,
      correlations,
      regression,
      hypothesesPlanned,
      hypothesisResults: hypothesisRunResults,
      publishResult,
      abilityImpact: abilityImpact
        ? {
            runId: opts.abilityImpactRunId,
            baseline: abilityImpact.baseline,
            byAbility: abilityImpact.byAbility,
          }
        : null,
      caveats,
    });
    const digestPath = join(digestsDir, `${date}.md`);
    const latestPath = join(digestsDir, 'latest.md');
    writeFileSync(digestPath, md);
    writeFileSync(latestPath, md);
    console.log(`[nightly] digest written: ${digestPath}`);
  } else {
    console.log(`[nightly] features+digest skipped (--skip-features)`);
  }

  console.log(`[nightly] done in ${((Date.now() - t0) / 1000).toFixed(1)}s total`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
