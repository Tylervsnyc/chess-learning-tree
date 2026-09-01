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
import { runPowerTest, type PowerReport } from './ability-power-test';
import { runAbilityImpact } from './simulate-run';
import type { AbilityForceMode } from './simulate-run';
import { generateLevels } from './generate-levels';
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
  hypothesesPerNight: number;
  experimentTrials: number;
  quick: boolean;
  skipAblation: boolean;
  skipFeatures: boolean;
  skipHypotheses: boolean;
  skipAbilityImpact: boolean;
  // WHY off by default: full level-gen costs ~100 min at 20 trials/cell, well
  // beyond the nightly's ~30 min runtime budget. The cloud-agent triggers
  // this manually via --enable-level-gen on a slower overnight schedule.
  enableLevelGen: boolean;
  levelGenTrials: number;
  levelGenSeedOffset: number;
  abilityImpactRunId: string;
  abilityImpactTrials: number;
  skipPowerReport: boolean;
  powerTrials: number;
  powerBotTier: TierId;
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
    hypothesesPerNight: 3,
    experimentTrials: 60,
    quick: false,
    skipAblation: false,
    skipFeatures: false,
    skipHypotheses: false,
    skipAbilityImpact: false,
    enableLevelGen: false,
    levelGenTrials: 20,
    levelGenSeedOffset: 0,
    // the-gauntlet at T3 has the best signal-to-noise — baseline 2.00 levels,
    // so any ability that helps shows up clearly. Cost: ~3 min at 5 trials.
    abilityImpactRunId: 'the-gauntlet',
    abilityImpactTrials: 5,
    skipPowerReport: false,
    // ~10 trials × 16 abilities × 3 tiers × 10 levels ≈ a few minutes —
    // noisy per cell but the mean-over-panel is stable enough for a daily
    // trend line; the standalone CLI covers high-precision runs.
    powerTrials: 10,
    powerBotTier: 'T4',
  };
  let hypothesesExplicit = false;
  let fullMode = false;
  for (const arg of process.argv.slice(2)) {
    if (arg === '--quick') opts.quick = true;
    else if (arg === '--full') fullMode = true;
    else if (arg === '--skip-ablation') opts.skipAblation = true;
    else if (arg === '--skip-features') opts.skipFeatures = true;
    else if (arg === '--skip-hypotheses') opts.skipHypotheses = true;
    else if (arg === '--skip-ability-impact') opts.skipAbilityImpact = true;
    else if (arg === '--skip-power-report') opts.skipPowerReport = true;
    else if (arg.startsWith('--power-trials='))
      opts.powerTrials = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--ability-impact-run='))
      opts.abilityImpactRunId = arg.split('=')[1];
    else if (arg.startsWith('--ability-impact-trials='))
      opts.abilityImpactTrials = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--sweep-trials='))
      opts.sweepTrials = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--ablation-trials='))
      opts.ablationTrials = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--hypotheses-per-night=')) {
      opts.hypothesesPerNight = parseInt(arg.split('=')[1], 10);
      hypothesesExplicit = true;
    } else if (arg.startsWith('--experiment-trials='))
      opts.experimentTrials = parseInt(arg.split('=')[1], 10);
    else if (arg === '--enable-level-gen') opts.enableLevelGen = true;
    else if (arg === '--disable-level-gen') opts.enableLevelGen = false;
    else if (arg.startsWith('--level-gen-trials='))
      opts.levelGenTrials = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--level-gen-seed-offset='))
      opts.levelGenSeedOffset = parseInt(arg.split('=')[1], 10);
  }
  if (fullMode) {
    opts.sweepTrials = 200;
    opts.ablationTrials = 120;
    if (!hypothesesExplicit) opts.hypothesesPerNight = 5;
    opts.experimentTrials = 80;
  }
  if (opts.quick) {
    opts.sweepTrials = 20;
    opts.ablationTrials = 10;
    if (!hypothesesExplicit) opts.hypothesesPerNight = 1;
    opts.experimentTrials = 10;
    opts.powerTrials = 4;
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

  // Forced-take + pair-combo experiments were retired together with the
  // candidate-ability batch — they only added value when the team needed to
  // measure unshipped abilities. The general ablation above covers the
  // shipped roster.
  const forcedTakeResults: ForcedTakeResult[] = [];
  const comboResults: ComboResult[] = [];
  const comboSampledLevels: string[] = [];

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

  // ─── Ability power report (experimental vs shipped roster) ────────────
  // Daily answer to "are the prototype abilities correctly powered, and
  // should any be promoted?" — full-roster lift leaderboard + verdicts.
  let powerReport: PowerReport | null = null;
  if (!opts.skipPowerReport) {
    console.log(
      `[nightly] ability power report (${opts.powerTrials} trials × full roster at ${opts.powerBotTier})`,
    );
    const tP = Date.now();
    powerReport = runPowerTest({
      trials: opts.powerTrials,
      botTier: opts.powerBotTier,
      fullRoster: true,
      log: (s) => console.log(s),
    });
    writeFileSync(
      join(rawDir, 'ability-power-test.json'),
      JSON.stringify(powerReport, null, 2),
    );
    console.log(
      `[nightly] power report done in ${((Date.now() - tP) / 1000).toFixed(1)}s`,
    );
  } else {
    caveats.push('Ability power report skipped this run.');
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
      powerReport,
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

  // ─── Level generator ──────────────────────────────────────────────────
  // WHY opt-in: ~100 min at 20 trials × 40 sims × 50 candidates. Lives at
  // the end so the rest of the digest pipeline ships before this phase
  // starts. Outputs go to data/run-playtest/candidate-levels/$DATE/
  // which is NOT covered by the run-playtest/raw/ gitignore, so the files
  // can be committed by the orchestrator after the run.
  if (opts.enableLevelGen) {
    console.log(
      `[nightly] level-gen (${opts.levelGenTrials} trials × 2 tiers × 50 candidates, seedOffset=${opts.levelGenSeedOffset})`,
    );
    const tG = Date.now();
    const lg = generateLevels({
      trialsPerCell: opts.levelGenTrials,
      seedOffset: opts.levelGenSeedOffset,
      date,
      onProgress: (s) => console.log(s),
    });
    console.log(
      `[nightly] level-gen done in ${((Date.now() - tG) / 1000).toFixed(1)}s — outDir ${lg.outDir}`,
    );
  } else {
    caveats.push('Level generator skipped (use --enable-level-gen to run).');
  }

  console.log(`[nightly] done in ${((Date.now() - t0) / 1000).toFixed(1)}s total`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
