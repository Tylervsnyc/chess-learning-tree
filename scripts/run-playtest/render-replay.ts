/**
 * Rookie's Run — replay video renderer.
 *
 * Reads a DecisionTrace JSON, invokes Remotion to produce a portrait MP4,
 * and optionally a GIF. Intended for marketing — pick the best sims, render
 * them, post to socials.
 *
 * Usage:
 *   npx tsx scripts/run-playtest/render-replay.ts <traceFile> [--gif] [--out=<path>]
 *
 * Default output:
 *   data/run-playtest/replays/<runId>__<level>__<tier>__<trial>.mp4
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import type { DecisionTrace } from './types';

const REPO_ROOT = process.cwd();
// Why a dedicated entry point: the main remotion/Root.tsx imports several
// experimental reels (DataRiverDailyReel et al.) whose source files aren't
// committed yet, which breaks bundling. The replay entry only loads what
// it needs and keeps marketing renders unblocked.
const ENTRY_POINT = path.join(REPO_ROOT, 'remotion', 'replay', 'index.tsx');
const DEFAULT_OUT_DIR = path.join(REPO_ROOT, 'data', 'run-playtest', 'replays');
const COMPOSITION_ID = 'RookiesRunReplay';

interface CliArgs {
  traceFile: string;
  outPath: string | null;
  emitGif: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  // First positional arg is the trace path. The rest are --flags.
  const positional: string[] = [];
  let outPath: string | null = null;
  let emitGif = false;
  for (const a of argv) {
    if (a === '--gif') {
      emitGif = true;
      continue;
    }
    const m = a.match(/^--out=(.+)$/);
    if (m) {
      outPath = m[1];
      continue;
    }
    if (a.startsWith('--')) {
      throw new Error(`Unknown flag: ${a}`);
    }
    positional.push(a);
  }
  if (positional.length !== 1) {
    throw new Error(
      'Usage: npx tsx scripts/run-playtest/render-replay.ts <traceFile> [--gif] [--out=<path>]',
    );
  }
  return { traceFile: positional[0], outPath, emitGif };
}

/** Build the default output path from a trace's identifying fields. */
function defaultOutputPath(trace: DecisionTrace): string {
  const slug = `${trace.runId}__${trace.level}__${trace.tier}__${trace.trial}.mp4`;
  return path.join(DEFAULT_OUT_DIR, slug);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  const tracePath = path.isAbsolute(args.traceFile)
    ? args.traceFile
    : path.join(REPO_ROOT, args.traceFile);
  if (!fs.existsSync(tracePath)) {
    console.error(`Trace file not found: ${tracePath}`);
    process.exit(1);
  }
  const trace = JSON.parse(fs.readFileSync(tracePath, 'utf-8')) as DecisionTrace;

  const outputFile = args.outPath
    ? path.isAbsolute(args.outPath)
      ? args.outPath
      : path.join(REPO_ROOT, args.outPath)
    : defaultOutputPath(trace);

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  // Why pass the trace via --props=<file>: large traces blow past shell
  // argv length limits on macOS (~256KB ARG_MAX). Writing a temp props file
  // sidesteps that entirely. Remotion's CLI accepts a path here.
  const propsPath = path.join(
    DEFAULT_OUT_DIR,
    `.props-${path.basename(outputFile, '.mp4')}.json`,
  );
  fs.mkdirSync(path.dirname(propsPath), { recursive: true });
  fs.writeFileSync(propsPath, JSON.stringify({ trace }));

  console.log(`Rendering ${path.basename(tracePath)} → ${outputFile}`);
  console.log(`  Turns: ${trace.decisionLog.length}`);
  console.log(`  Outcome: ${trace.outcome.win ? 'WIN' : `LOSS (${trace.outcome.failMode})`}`);

  try {
    execSync(
      `npx remotion render "${ENTRY_POINT}" ${COMPOSITION_ID} "${outputFile}" --props="${propsPath}" --config=remotion.config.ts`,
      { stdio: 'inherit', timeout: 10 * 60 * 1000 },
    );
  } catch (err) {
    console.error('Render failed:', err);
    fs.rmSync(propsPath, { force: true });
    process.exit(1);
  }

  if (args.emitGif) {
    const gifFile = outputFile.replace(/\.mp4$/u, '.gif');
    console.log(`Rendering GIF ${gifFile}`);
    try {
      execSync(
        `npx remotion render "${ENTRY_POINT}" ${COMPOSITION_ID} "${gifFile}" --props="${propsPath}" --config=remotion.config.ts --codec=gif`,
        { stdio: 'inherit', timeout: 10 * 60 * 1000 },
      );
    } catch (err) {
      console.error('GIF render failed:', err);
      // Don't fail the whole command — MP4 already exists.
    }
  }

  // Why delete the tmp props file: it's regenerated each run; leaving it
  // around clutters the replays/ dir and could shadow committed samples.
  fs.rmSync(propsPath, { force: true });

  console.log('\nDone.');
  console.log(`  Video: ${outputFile}`);
}

main();
