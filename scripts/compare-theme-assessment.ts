/**
 * Compare Theme Assessment: Our Analysis vs Lichess Tags
 *
 * This script applies our predictPrimaryTheme() logic to the puzzle database
 * and compares how we classify puzzles vs how Lichess tags them.
 *
 * Run with: npx tsx scripts/compare-theme-assessment.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { analyzePuzzle } from '../lib/theme-analyzer';

// Theme categories for grouping
const MECHANISM_THEMES = ['fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck'];
const ENABLER_THEMES = ['attraction', 'deflection', 'interference', 'clearance', 'sacrifice', 'capturingDefender'];
const MATE_THEMES = ['mateIn1', 'mateIn2', 'mateIn3', 'mateIn4', 'mateIn5', 'checkmate', 'mate',
  'backRankMate', 'smotheredMate', 'arabianMate', 'anastasiasMate', 'bodensMate',
  'doubleBishopMate', 'hookMate', 'operaMate'];
const ENDGAME_THEMES = ['endgame', 'rookEndgame', 'pawnEndgame', 'bishopEndgame', 'knightEndgame', 'queenEndgame'];
const META_THEMES = ['crushing', 'advantage', 'short', 'long', 'veryLong', 'oneMove',
  'opening', 'middlegame', 'master', 'masterVsMaster', 'superGM'];

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

function getLichessPrimaryTheme(themes: string[]): string {
  // Filter out meta themes to find what Lichess considers the "tactical" theme
  const tacticalThemes = themes.filter(t => !META_THEMES.includes(t));

  // Lichess puts the most relevant theme first (usually)
  // But we want to find the "mechanism" theme if present
  const mechanism = tacticalThemes.find(t => MECHANISM_THEMES.includes(t));
  if (mechanism) return mechanism;

  const enabler = tacticalThemes.find(t => ENABLER_THEMES.includes(t));
  if (enabler) return enabler;

  const mate = tacticalThemes.find(t => MATE_THEMES.includes(t));
  if (mate) return mate;

  // Return first non-meta theme
  return tacticalThemes[0] || themes[0] || 'unknown';
}

function normalizeTheme(theme: string): string {
  // Normalize for comparison
  if (theme.startsWith('mateIn')) return 'checkmate';
  if (MATE_THEMES.includes(theme)) return 'checkmate';
  if (theme === 'crushing' || theme === 'advantage') return 'material';
  return theme;
}

interface ComparisonResult {
  puzzleId: string;
  lichessThemes: string[];
  lichessPrimary: string;
  ourPrimary: string;
  reasoning: string;
  match: boolean;
  categoryMatch: boolean;
}

async function analyze() {
  const dataDir = path.join(process.cwd(), 'data', 'puzzles-by-rating');
  const files = ['0400-0800.csv']; // Just puzzles under 1000

  const results: ComparisonResult[] = [];
  const themeDisagreements = new Map<string, number>();
  const ourThemeCounts = new Map<string, number>();
  const lichessThemeCounts = new Map<string, number>();

  let totalAnalyzed = 0;
  let exactMatches = 0;
  let categoryMatches = 0;
  let errors = 0;

  // Sample every Nth puzzle for reasonable analysis time
  const SAMPLE_RATE = 100; // Analyze every 100th puzzle for speed

  for (const file of files) {
    const fp = path.join(dataDir, file);
    if (!fs.existsSync(fp)) {
      console.log(`Skipping ${file} (not found)`);
      continue;
    }

    console.log(`Analyzing ${file}...`);
    const lines = fs.readFileSync(fp, 'utf-8').split('\n').slice(1);

    for (let i = 0; i < lines.length; i += SAMPLE_RATE) {
      const line = lines[i];
      if (!line?.trim()) continue;

      const fields = parseCsvLine(line);
      if (fields.length < 8) continue;

      const [puzzleId, fen, moves, rating, , , , themesStr] = fields;
      if (!puzzleId || !fen || !moves || !themesStr) continue;

      const lichessThemes = themesStr.split(' ').filter(Boolean);

      try {
        // Run our analysis
        const analysis = analyzePuzzle(
          puzzleId,
          fen,
          moves,
          parseInt(rating) || 1000,
          themesStr,
          `https://lichess.org/training/${puzzleId}`
        );

        const lichessPrimary = getLichessPrimaryTheme(lichessThemes);
        const ourPrimary = analysis.predictedPrimaryTheme;

        // Normalize for comparison
        const lichessNorm = normalizeTheme(lichessPrimary);
        const ourNorm = normalizeTheme(ourPrimary.split(' ')[0]); // Handle "mateIn2 (sacrifice)"

        const exactMatch = lichessNorm === ourNorm || lichessPrimary === ourPrimary;
        const categoryMatch = exactMatch ||
          (lichessThemes.includes(ourNorm) || lichessThemes.some(t => ourPrimary.includes(t)));

        if (exactMatch) exactMatches++;
        if (categoryMatch) categoryMatches++;

        // Track disagreements
        if (!exactMatch) {
          const key = `${lichessPrimary} → ${ourPrimary}`;
          themeDisagreements.set(key, (themeDisagreements.get(key) || 0) + 1);
        }

        // Track theme counts
        ourThemeCounts.set(ourPrimary, (ourThemeCounts.get(ourPrimary) || 0) + 1);
        lichessThemeCounts.set(lichessPrimary, (lichessThemeCounts.get(lichessPrimary) || 0) + 1);

        results.push({
          puzzleId,
          lichessThemes,
          lichessPrimary,
          ourPrimary,
          reasoning: analysis.reasoning,
          match: exactMatch,
          categoryMatch,
        });

        totalAnalyzed++;

        // Progress indicator
        if (totalAnalyzed % 500 === 0) {
          console.log(`  Analyzed ${totalAnalyzed} puzzles...`);
        }

      } catch (err) {
        errors++;
        // Skip puzzles that fail to parse
      }
    }
  }

  // Output results
  console.log('\n' + '='.repeat(70));
  console.log('COMPARISON: Our Theme Assessment vs Lichess Tags');
  console.log('='.repeat(70));

  console.log(`\nTotal puzzles analyzed: ${totalAnalyzed}`);
  console.log(`Parse errors (skipped): ${errors}`);
  console.log(`\nAgreement rates:`);
  console.log(`  Exact match:    ${exactMatches} (${(exactMatches/totalAnalyzed*100).toFixed(1)}%)`);
  console.log(`  Category match: ${categoryMatches} (${(categoryMatches/totalAnalyzed*100).toFixed(1)}%)`);
  console.log(`  Disagreement:   ${totalAnalyzed - categoryMatches} (${((totalAnalyzed-categoryMatches)/totalAnalyzed*100).toFixed(1)}%)`);

  // Top disagreements
  console.log('\n' + '-'.repeat(70));
  console.log('TOP RECLASSIFICATIONS (Lichess → Our Assessment)');
  console.log('-'.repeat(70));

  const sortedDisagreements = [...themeDisagreements.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25);

  for (const [key, count] of sortedDisagreements) {
    const pct = (count / totalAnalyzed * 100).toFixed(1);
    console.log(`  ${key}: ${count} (${pct}%)`);
  }

  // Theme distribution comparison
  console.log('\n' + '-'.repeat(70));
  console.log('THEME DISTRIBUTION COMPARISON');
  console.log('-'.repeat(70));

  // Collect all unique themes
  const allThemes = new Set([...ourThemeCounts.keys(), ...lichessThemeCounts.keys()]);
  const themeComparison: Array<{theme: string, lichess: number, ours: number, diff: number}> = [];

  for (const theme of allThemes) {
    const lichess = lichessThemeCounts.get(theme) || 0;
    const ours = ourThemeCounts.get(theme) || 0;
    themeComparison.push({ theme, lichess, ours, diff: ours - lichess });
  }

  // Sort by absolute difference
  themeComparison.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

  console.log('\nBiggest differences (sorted by delta):');
  console.log('Theme'.padEnd(25) + 'Lichess'.padStart(10) + 'Ours'.padStart(10) + 'Delta'.padStart(10));
  console.log('-'.repeat(55));

  for (const row of themeComparison.slice(0, 20)) {
    const delta = row.diff > 0 ? `+${row.diff}` : `${row.diff}`;
    console.log(
      row.theme.padEnd(25) +
      row.lichess.toString().padStart(10) +
      row.ours.toString().padStart(10) +
      delta.padStart(10)
    );
  }

  // Key insight: fork reclassification
  console.log('\n' + '-'.repeat(70));
  console.log('FORK ANALYSIS (The Big Question)');
  console.log('-'.repeat(70));

  const forkPuzzles = results.filter(r => r.lichessThemes.includes('fork'));
  const forkKeptAsFork = forkPuzzles.filter(r => r.ourPrimary === 'fork');
  const forkReclassified = forkPuzzles.filter(r => r.ourPrimary !== 'fork');

  console.log(`\nPuzzles tagged 'fork' by Lichess: ${forkPuzzles.length}`);
  console.log(`  Kept as fork (primary theme):  ${forkKeptAsFork.length} (${(forkKeptAsFork.length/forkPuzzles.length*100).toFixed(1)}%)`);
  console.log(`  Reclassified:                  ${forkReclassified.length} (${(forkReclassified.length/forkPuzzles.length*100).toFixed(1)}%)`);

  // Where did fork puzzles go?
  const forkReclassTo = new Map<string, number>();
  for (const r of forkReclassified) {
    forkReclassTo.set(r.ourPrimary, (forkReclassTo.get(r.ourPrimary) || 0) + 1);
  }

  console.log('\nFork puzzles reclassified to:');
  const forkDestinations = [...forkReclassTo.entries()].sort((a, b) => b[1] - a[1]);
  for (const [theme, count] of forkDestinations.slice(0, 10)) {
    console.log(`  → ${theme}: ${count}`);
  }

  // Sample reclassified puzzles
  console.log('\n' + '-'.repeat(70));
  console.log('SAMPLE RECLASSIFICATIONS');
  console.log('-'.repeat(70));

  const samples = results.filter(r => !r.match).slice(0, 10);
  for (const sample of samples) {
    console.log(`\nPuzzle: ${sample.puzzleId}`);
    console.log(`  Lichess tags: ${sample.lichessThemes.join(', ')}`);
    console.log(`  Lichess primary: ${sample.lichessPrimary}`);
    console.log(`  Our primary: ${sample.ourPrimary}`);
    console.log(`  Reasoning: ${sample.reasoning}`);
  }

  // Save full results
  const outputPath = path.join(process.cwd(), 'data', 'theme-comparison-results.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    summary: {
      totalAnalyzed,
      exactMatches,
      categoryMatches,
      exactMatchRate: (exactMatches / totalAnalyzed * 100).toFixed(1) + '%',
      categoryMatchRate: (categoryMatches / totalAnalyzed * 100).toFixed(1) + '%',
    },
    topReclassifications: sortedDisagreements.slice(0, 50),
    themeDistribution: themeComparison,
    forkAnalysis: {
      total: forkPuzzles.length,
      keptAsFork: forkKeptAsFork.length,
      reclassified: forkReclassified.length,
      destinations: forkDestinations,
    },
    sampleReclassifications: samples,
  }, null, 2));

  console.log(`\nFull results saved to: ${outputPath}`);
}

analyze().catch(console.error);
