/**
 * Analyze how themes naturally connect in puzzles
 * Output data for visualization
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const BASE_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');

interface ThemeConnection {
  theme1: string;
  theme2: string;
  count: number;
  percentage: number; // % of theme1 puzzles that also have theme2
}

interface ThemeStats {
  theme: string;
  totalPuzzles: number;
  connections: { theme: string; count: number; percentage: number }[];
}

interface BracketAnalysis {
  bracket: string;
  ratingRange: string;
  totalPuzzles: number;
  themes: ThemeStats[];
  topConnections: ThemeConnection[];
}

// Themes we care about (tactical themes, not meta-themes)
const TACTICAL_THEMES = [
  'fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck',
  'deflection', 'attraction', 'capturingDefender', 'interference',
  'clearance', 'sacrifice', 'trappedPiece', 'hangingPiece',
  'mateIn1', 'mateIn2', 'mateIn3', 'backRankMate', 'smotheredMate',
  'promotion', 'advancedPawn', 'exposedKing', 'quietMove',
  'defensiveMove', 'intermezzo', 'xRayAttack'
];

// Meta themes to exclude from connections (these describe outcome/phase, not tactics)
const META_THEMES = [
  'mate', 'crushing', 'advantage', 'equality',
  'short', 'long', 'veryLong', 'oneMove',
  'middlegame', 'endgame', 'opening',
  'master', 'masterVsMaster', 'superGM'
];

function loadAllPuzzlesFromBracket(bracket: string): { themes: string[] }[] {
  const dir = join(BASE_DIR, bracket);
  const files = readdirSync(dir).filter(f => f.endsWith('.csv'));
  const seenIds = new Set<string>();
  const puzzles: { themes: string[] }[] = [];

  for (const file of files) {
    const content = readFileSync(join(dir, file), 'utf-8');
    const lines = content.trim().split('\n');

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length < 9) continue;

      const puzzleId = parts[0];
      if (seenIds.has(puzzleId)) continue;
      seenIds.add(puzzleId);

      const themes = parts[7].split(' ').filter(t =>
        TACTICAL_THEMES.includes(t) && !META_THEMES.includes(t)
      );

      if (themes.length > 0) {
        puzzles.push({ themes });
      }
    }
  }

  return puzzles;
}

function analyzeThemeConnections(puzzles: { themes: string[] }[]): {
  themeStats: Map<string, ThemeStats>;
  connections: ThemeConnection[];
} {
  // Count occurrences of each theme
  const themeCounts = new Map<string, number>();
  const coOccurrence = new Map<string, Map<string, number>>();

  for (const puzzle of puzzles) {
    const themes = puzzle.themes;

    // Count each theme
    for (const theme of themes) {
      themeCounts.set(theme, (themeCounts.get(theme) || 0) + 1);
    }

    // Count co-occurrences
    for (let i = 0; i < themes.length; i++) {
      for (let j = i + 1; j < themes.length; j++) {
        const t1 = themes[i];
        const t2 = themes[j];

        // Bidirectional counting
        if (!coOccurrence.has(t1)) coOccurrence.set(t1, new Map());
        if (!coOccurrence.has(t2)) coOccurrence.set(t2, new Map());

        coOccurrence.get(t1)!.set(t2, (coOccurrence.get(t1)!.get(t2) || 0) + 1);
        coOccurrence.get(t2)!.set(t1, (coOccurrence.get(t2)!.get(t1) || 0) + 1);
      }
    }
  }

  // Build theme stats
  const themeStats = new Map<string, ThemeStats>();
  const allConnections: ThemeConnection[] = [];

  for (const [theme, count] of themeCounts) {
    const connections: { theme: string; count: number; percentage: number }[] = [];
    const themeCoOccur = coOccurrence.get(theme);

    if (themeCoOccur) {
      for (const [otherTheme, coCount] of themeCoOccur) {
        const percentage = Math.round((coCount / count) * 100);
        connections.push({ theme: otherTheme, count: coCount, percentage });

        // Add to all connections (only once per pair)
        if (theme < otherTheme) {
          allConnections.push({
            theme1: theme,
            theme2: otherTheme,
            count: coCount,
            percentage: Math.round((coCount / Math.min(count, themeCounts.get(otherTheme) || 1)) * 100)
          });
        }
      }
    }

    connections.sort((a, b) => b.percentage - a.percentage);

    themeStats.set(theme, {
      theme,
      totalPuzzles: count,
      connections: connections.slice(0, 10) // Top 10 connections
    });
  }

  // Sort connections by count
  allConnections.sort((a, b) => b.count - a.count);

  return { themeStats, connections: allConnections };
}

function analyzeBracket(bracket: string, ratingRange: string): BracketAnalysis {
  console.log(`\nAnalyzing ${bracket}...`);
  const puzzles = loadAllPuzzlesFromBracket(bracket);
  console.log(`  Loaded ${puzzles.length} puzzles`);

  const { themeStats, connections } = analyzeThemeConnections(puzzles);

  // Convert to array and sort by puzzle count
  const themes = Array.from(themeStats.values())
    .sort((a, b) => b.totalPuzzles - a.totalPuzzles);

  return {
    bracket,
    ratingRange,
    totalPuzzles: puzzles.length,
    themes,
    topConnections: connections.slice(0, 50)
  };
}

async function main() {
  console.log('ANALYZING THEME CONNECTIONS ACROSS RATING BRACKETS\n');

  const analyses: BracketAnalysis[] = [];

  // Analyze each bracket
  const brackets = [
    { bracket: '0400-0800', ratingRange: '400-800 (Beginner)' },
    { bracket: '0800-1200', ratingRange: '800-1200 (Casual)' },
    { bracket: '1200-1600', ratingRange: '1200-1600 (Club)' },
  ];

  for (const { bracket, ratingRange } of brackets) {
    const analysis = analyzeBracket(bracket, ratingRange);
    analyses.push(analysis);
  }

  // Output summary to console
  for (const analysis of analyses) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`${analysis.ratingRange}`);
    console.log(`Total Puzzles: ${analysis.totalPuzzles}`);
    console.log(`${'='.repeat(70)}`);

    console.log('\nTOP THEMES:');
    for (const theme of analysis.themes.slice(0, 15)) {
      console.log(`  ${theme.theme.padEnd(20)} ${theme.totalPuzzles} puzzles`);
    }

    console.log('\nSTRONGEST THEME CONNECTIONS:');
    for (const conn of analysis.topConnections.slice(0, 20)) {
      console.log(`  ${conn.theme1} + ${conn.theme2}: ${conn.count} puzzles (${conn.percentage}%)`);
    }

    console.log('\nTHEME RELATIONSHIP DETAILS:');
    for (const theme of analysis.themes.slice(0, 8)) {
      console.log(`\n  ${theme.theme} (${theme.totalPuzzles} puzzles):`);
      for (const conn of theme.connections.slice(0, 5)) {
        console.log(`    → ${conn.theme}: ${conn.count} (${conn.percentage}%)`);
      }
    }
  }

  // Save data for visualization
  const outputPath = join(process.cwd(), 'data', 'staging', 'theme-connections.json');
  writeFileSync(outputPath, JSON.stringify(analyses, null, 2));
  console.log(`\n\nData saved to: ${outputPath}`);
}

main();
