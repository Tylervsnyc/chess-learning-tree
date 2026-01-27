/**
 * Run Chain Analysis on Puzzle Database
 *
 * Usage: npx tsx scripts/run-chain-analysis.ts [--level 400-800] [--sample 50] [--limit 1000] [--min-plays 3000]
 */

import * as fs from 'fs';
import * as path from 'path';
import { analyzePuzzleChain, ChainAnalysis } from '../lib/chain-analyzer';

const RATING_BRACKETS: Record<string, string> = {
  '400-800': '0400-0800.csv',
  '800-1200': '0800-1200.csv',
  '1200-1600': '1200-1600.csv',
  '1600-2000': '1600-2000.csv',
  '2000+': '2000-plus.csv',
};

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) { result.push(current); current = ''; }
    else current += char;
  }
  result.push(current);
  return result;
}

interface Stats {
  total: number;
  byOutcome: Record<string, number>;
  byPrimaryTheme: Record<string, number>;
  byTeachAs: Record<string, number>;
  combinations: {
    total: number;
    clean: number;
    mixed: number;
    ambiguous: number;
    flows: Record<string, number>;
  };
  confidence: {
    high: number;    // > 0.8
    medium: number;  // 0.6-0.8
    low: number;     // < 0.6
  };
  errors: number;
}

async function run() {
  // Parse args
  const args = process.argv.slice(2);
  const levelArg = args.find(a => a.startsWith('--level='))?.split('=')[1] || '400-800';
  const sampleRate = parseInt(args.find(a => a.startsWith('--sample='))?.split('=')[1] || '50');
  const limit = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '0');
  const minPlays = parseInt(args.find(a => a.startsWith('--min-plays='))?.split('=')[1] || '0');

  const fileName = RATING_BRACKETS[levelArg];
  if (!fileName) {
    console.error(`Unknown level: ${levelArg}`);
    console.error(`Available: ${Object.keys(RATING_BRACKETS).join(', ')}`);
    process.exit(1);
  }

  const filePath = path.join(process.cwd(), 'data', 'puzzles-by-rating', fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`CHAIN ANALYSIS: ${levelArg}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`File: ${fileName}`);
  console.log(`Sample rate: 1 in ${sampleRate}`);
  if (limit > 0) console.log(`Limit: ${limit} puzzles`);
  if (minPlays > 0) console.log(`Min plays filter: ${minPlays.toLocaleString()}+`);
  console.log('');

  const lines = fs.readFileSync(filePath, 'utf-8').split('\n').slice(1);
  const totalLines = lines.length;
  const expectedPuzzles = limit > 0 ? Math.min(limit, Math.ceil(totalLines / sampleRate)) : Math.ceil(totalLines / sampleRate);

  console.log(`Total lines: ${totalLines.toLocaleString()}`);
  console.log(`Expected puzzles: ~${expectedPuzzles.toLocaleString()}`);
  console.log('');

  const stats: Stats = {
    total: 0,
    byOutcome: {},
    byPrimaryTheme: {},
    byTeachAs: {},
    combinations: {
      total: 0,
      clean: 0,
      mixed: 0,
      ambiguous: 0,
      flows: {},
    },
    confidence: { high: 0, medium: 0, low: 0 },
    errors: 0,
  };

  const examples: {
    cleanCombinations: ChainAnalysis[];
    pureThemes: Record<string, ChainAnalysis[]>;
  } = {
    cleanCombinations: [],
    pureThemes: {},
  };

  const startTime = Date.now();
  let processed = 0;

  for (let i = 0; i < lines.length && (limit === 0 || stats.total < limit); i += sampleRate) {
    const line = lines[i];
    if (!line?.trim()) continue;

    const fields = parseCsvLine(line);
    const [puzzleId, fen, moves, rating, , , nbPlaysStr, themesStr] = fields;
    if (!puzzleId || !fen || !moves || !themesStr) continue;

    // Filter by minimum plays if specified
    const nbPlays = parseInt(nbPlaysStr) || 0;
    if (minPlays > 0 && nbPlays < minPlays) continue;

    try {
      const analysis = analyzePuzzleChain(
        puzzleId,
        fen,
        moves,
        parseInt(rating) || 1000,
        themesStr
      );

      stats.total++;

      // Outcome stats
      stats.byOutcome[analysis.outcome.type] = (stats.byOutcome[analysis.outcome.type] || 0) + 1;

      // Primary theme stats
      stats.byPrimaryTheme[analysis.verdict.primaryTheme] = (stats.byPrimaryTheme[analysis.verdict.primaryTheme] || 0) + 1;

      // TeachAs stats
      stats.byTeachAs[analysis.verdict.teachAs] = (stats.byTeachAs[analysis.verdict.teachAs] || 0) + 1;

      // Combination stats
      if (analysis.combination.isTrueCombination) {
        stats.combinations.total++;
        stats.combinations[analysis.combination.quality]++;
        stats.combinations.flows[analysis.combination.flow] = (stats.combinations.flows[analysis.combination.flow] || 0) + 1;

        // Save examples of clean combinations
        if (analysis.combination.quality === 'clean' && examples.cleanCombinations.length < 10) {
          examples.cleanCombinations.push(analysis);
        }
      }

      // Confidence stats
      if (analysis.verdict.confidence > 0.8) stats.confidence.high++;
      else if (analysis.verdict.confidence > 0.6) stats.confidence.medium++;
      else stats.confidence.low++;

      // Save examples of pure themes
      if (!analysis.combination.isTrueCombination && analysis.verdict.confidence > 0.8) {
        const theme = analysis.verdict.primaryTheme;
        if (!examples.pureThemes[theme]) examples.pureThemes[theme] = [];
        if (examples.pureThemes[theme].length < 3) {
          examples.pureThemes[theme].push(analysis);
        }
      }

    } catch (e) {
      stats.errors++;
    }

    processed++;
    if (processed % 500 === 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = processed / elapsed;
      const remaining = expectedPuzzles - processed;
      const eta = remaining / rate;
      process.stdout.write(`\r  Processed ${processed} puzzles... (${rate.toFixed(0)}/sec, ETA: ${eta.toFixed(0)}s)   `);
    }
  }

  const elapsed = (Date.now() - startTime) / 1000;
  console.log(`\r  Done! ${stats.total} puzzles in ${elapsed.toFixed(1)}s (${(stats.total / elapsed).toFixed(0)}/sec)     \n`);

  // Print results
  console.log(`${'='.repeat(70)}`);
  console.log('RESULTS');
  console.log(`${'='.repeat(70)}\n`);

  console.log(`OUTCOMES:`);
  const sortedOutcomes = Object.entries(stats.byOutcome).sort((a, b) => b[1] - a[1]);
  for (const [outcome, count] of sortedOutcomes) {
    const pct = (count / stats.total * 100).toFixed(1);
    console.log(`  ${outcome.padEnd(15)} ${count.toString().padStart(6)} (${pct}%)`);
  }

  console.log(`\nPRIMARY THEMES:`);
  const sortedThemes = Object.entries(stats.byPrimaryTheme).sort((a, b) => b[1] - a[1]);
  for (const [theme, count] of sortedThemes.slice(0, 15)) {
    const pct = (count / stats.total * 100).toFixed(1);
    console.log(`  ${theme.padEnd(20)} ${count.toString().padStart(6)} (${pct}%)`);
  }

  console.log(`\nTEACH AS (curriculum labels):`);
  const sortedTeachAs = Object.entries(stats.byTeachAs).sort((a, b) => b[1] - a[1]);
  for (const [label, count] of sortedTeachAs.slice(0, 15)) {
    const pct = (count / stats.total * 100).toFixed(1);
    console.log(`  ${label.padEnd(30)} ${count.toString().padStart(6)} (${pct}%)`);
  }

  console.log(`\nCOMBINATIONS:`);
  console.log(`  Total:     ${stats.combinations.total} (${(stats.combinations.total / stats.total * 100).toFixed(1)}%)`);
  console.log(`  Clean:     ${stats.combinations.clean}`);
  console.log(`  Mixed:     ${stats.combinations.mixed}`);
  console.log(`  Ambiguous: ${stats.combinations.ambiguous}`);

  if (Object.keys(stats.combinations.flows).length > 0) {
    console.log(`\n  Top combination flows:`);
    const sortedFlows = Object.entries(stats.combinations.flows).sort((a, b) => b[1] - a[1]);
    for (const [flow, count] of sortedFlows.slice(0, 10)) {
      console.log(`    ${flow}: ${count}`);
    }
  }

  console.log(`\nCONFIDENCE DISTRIBUTION:`);
  console.log(`  High (>0.8):   ${stats.confidence.high} (${(stats.confidence.high / stats.total * 100).toFixed(1)}%)`);
  console.log(`  Medium:        ${stats.confidence.medium} (${(stats.confidence.medium / stats.total * 100).toFixed(1)}%)`);
  console.log(`  Low (<0.6):    ${stats.confidence.low} (${(stats.confidence.low / stats.total * 100).toFixed(1)}%)`);

  if (stats.errors > 0) {
    console.log(`\n  Errors: ${stats.errors}`);
  }

  // Print examples
  if (examples.cleanCombinations.length > 0) {
    console.log(`\n${'='.repeat(70)}`);
    console.log('EXAMPLE: CLEAN COMBINATIONS');
    console.log(`${'='.repeat(70)}\n`);

    for (const ex of examples.cleanCombinations.slice(0, 5)) {
      console.log(`Puzzle: ${ex.puzzleId}`);
      console.log(`  Flow: ${ex.combination.flow}`);
      console.log(`  Moves:`);
      for (const m of ex.moves) {
        console.log(`    ${m.moveNumber}. ${m.san} - ${m.theme.name} (${(m.theme.confidence * 100).toFixed(0)}%)`);
      }
      console.log(`  URL: https://lichess.org/training/${ex.puzzleId}`);
      console.log('');
    }
  }

  // Save detailed results to JSON
  const suffix = minPlays > 0 ? `-${minPlays}plays` : '';
  const outputPath = path.join(process.cwd(), 'data', `chain-analysis-${levelArg}${suffix}.json`);
  fs.writeFileSync(outputPath, JSON.stringify({
    level: levelArg,
    minPlays,
    sampleRate,
    stats,
    examples: {
      cleanCombinations: examples.cleanCombinations.slice(0, 20),
      pureThemes: Object.fromEntries(
        Object.entries(examples.pureThemes).map(([k, v]) => [k, v.slice(0, 5)])
      ),
    },
  }, null, 2));
  console.log(`\nDetailed results saved to: ${outputPath}`);
}

run().catch(console.error);
