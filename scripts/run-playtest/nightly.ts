#!/usr/bin/env -S npx tsx
/**
 * Nightly orchestrator. Runs the full pipeline and writes outputs.
 *
 * Usage:
 *   npx tsx scripts/run-playtest/nightly.ts [--sweep-trials=N] [--ablation-trials=M] [--quick]
 *
 * Defaults:
 *   --sweep-trials=200  (baseline trials per (level, tier))
 *   --ablation-trials=120
 *   --quick             shortcut: trials=20, ablation=10, skips features
 *
 * Outputs:
 *   data/run-playtest/raw/YYYY-MM-DD/sweep.json
 *   data/run-playtest/raw/YYYY-MM-DD/ablation.json
 *   data/run-playtest/raw/YYYY-MM-DD/features.json
 *   data/run-playtest/raw/YYYY-MM-DD/correlations.json
 *   data/run-playtest/digests/YYYY-MM-DD.md
 *   data/run-playtest/digests/latest.md   (copy)
 */

import { mkdirSync, writeFileSync, copyFileSync } from 'fs';
import { join } from 'path';
import { runSweep } from './sweep';
import { aggregate } from './aggregate';
import { runAblation } from './ablation';
import { extractFeatures } from './features';
import { correlateFeatures } from './correlations';
import { renderDigest } from './digest';
import { buildLevelCatalog } from './utils/levels';

interface CliOpts {
  sweepTrials: number;
  ablationTrials: number;
  quick: boolean;
  skipAblation: boolean;
  skipFeatures: boolean;
}

function parseArgs(): CliOpts {
  const opts: CliOpts = {
    sweepTrials: 200,
    ablationTrials: 120,
    quick: false,
    skipAblation: false,
    skipFeatures: false,
  };
  for (const arg of process.argv.slice(2)) {
    if (arg === '--quick') opts.quick = true;
    else if (arg === '--skip-ablation') opts.skipAblation = true;
    else if (arg === '--skip-features') opts.skipFeatures = true;
    else if (arg.startsWith('--sweep-trials='))
      opts.sweepTrials = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--ablation-trials='))
      opts.ablationTrials = parseInt(arg.split('=')[1], 10);
  }
  if (opts.quick) {
    opts.sweepTrials = 20;
    opts.ablationTrials = 10;
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

    // ─── Digest ─────────────────────────────────────────────────────────
    const md = renderDigest({
      date,
      trialsPerCell: opts.sweepTrials,
      ablationTrials: opts.skipAblation ? 0 : opts.ablationTrials,
      baselineStats: sweepStats,
      ablation: ablationResults,
      features,
      correlations,
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
