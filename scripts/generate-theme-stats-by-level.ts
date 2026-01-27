/**
 * Generate Theme Statistics by Rating Level
 *
 * Uses curriculum v2 validation rules to count only PRIMARY themes
 * (themes that aren't absorbed by outcomes or invalidated by hierarchy rules)
 *
 * Run with: npx tsx scripts/generate-theme-stats-by-level.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { PUZZLE_VALIDATION_RULES } from '../data/curriculum-v2-config';
import { analyzePuzzle } from '../lib/theme-analyzer';

const RATING_BRACKETS = [
  { id: '400-800', file: '0400-0800.csv', label: '400-800', color: '#58CC02' },
  // { id: '800-1200', file: '0800-1200.csv', label: '800-1200', color: '#1CB0F6' },
  // { id: '1200-1600', file: '1200-1600.csv', label: '1200-1600', color: '#FF9600' },
];

// Theme categorization (aligned with curriculum v2)
const THEME_CATEGORIES = {
  outcomes: [
    'mate', 'mateIn1', 'mateIn2', 'mateIn3', 'mateIn4', 'mateIn5',
    'backRankMate', 'smotheredMate', 'hookMate', 'arabianMate', 'anastasiasMate',
    'bodensMate', 'doubleBishopMate', 'dovetailMate', 'operaMate', 'pillsburysMate',
    'suffocationMate', 'checkmate',
    'crushing', 'advantage', 'hangingPiece', 'trappedPiece',
    'promotion', 'underPromotion', 'materialGain',
  ],
  mechanisms: ['fork', 'pin', 'skewer', 'discoveredAttack', 'discoveredCheck', 'doubleCheck', 'xRayAttack'],
  enablers: ['attraction', 'deflection', 'clearance', 'capturingDefender', 'destructionOfDefender',
             'interference', 'overloading', 'intermezzo', 'zwischenzug', 'sacrifice',
             'quietMove', 'advancedPawn'],
  endgames: ['endgame', 'rookEndgame', 'pawnEndgame', 'queenEndgame', 'bishopEndgame',
             'knightEndgame', 'queenRookEndgame'],
};

// Map Lichess theme names to our hierarchy themes
const LICHESS_TO_HIERARCHY: Record<string, string> = {
  // MECHANISMS
  fork: 'fork',
  pin: 'pin',
  skewer: 'skewer',
  discoveredAttack: 'discoveredAttack',
  doubleCheck: 'doubleCheck',
  xRayAttack: 'xRayAttack',

  // ENABLERS
  attraction: 'attraction',
  deflection: 'deflection',
  clearance: 'clearance',
  capturingDefender: 'destructionOfDefender',
  interference: 'interference',
  sacrifice: 'sacrifice',

  // OUTCOMES
  mate: 'checkmate',
  mateIn1: 'checkmate',
  mateIn2: 'checkmate',
  mateIn3: 'checkmate',
  mateIn4: 'checkmate',
  backRankMate: 'checkmate',
  smotheredMate: 'checkmate',
  hookMate: 'checkmate',
  arabianMate: 'checkmate',
  anastasiasMate: 'checkmate',
  bodensMate: 'checkmate',
  doubleBishopMate: 'checkmate',
  operaMate: 'checkmate',
  pillsburysMate: 'checkmate',
  suffocationMate: 'checkmate',
  crushing: 'materialGain',
  advantage: 'advantage',
  hangingPiece: 'materialGain',
  trappedPiece: 'materialGain',
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

function getCategory(theme: string): string | null {
  for (const [cat, themes] of Object.entries(THEME_CATEGORIES)) {
    if (themes.includes(theme)) return cat;
  }
  return null;
}

// Get player move count from UCI moves string
function getPlayerMoveCount(moves: string): number {
  const moveList = moves.split(' ').slice(1); // Remove setup move
  return Math.ceil(moveList.length / 2);
}

// Check if a theme is validated as PRIMARY using curriculum v2 rules
function isValidPrimaryTheme(
  theme: string,
  allThemes: string[],
  moves: string,
  predictedPrimaryTheme: string
): boolean {
  // Map Lichess themes to hierarchy themes
  const hierarchyThemes = allThemes
    .map(t => LICHESS_TO_HIERARCHY[t])
    .filter(Boolean);

  const requestedLevel = PUZZLE_VALIDATION_RULES.getThemeLevel(theme);

  // If we can't categorize this theme, fall back to basic matching
  if (!requestedLevel) {
    const normalizedPrimary = predictedPrimaryTheme.toLowerCase();
    const normalizedTheme = theme.toLowerCase();
    return normalizedPrimary.includes(normalizedTheme) || normalizedTheme.includes(normalizedPrimary);
  }

  const moveCount = getPlayerMoveCount(moves);

  // RULE 4: Outcomes absorb mechanisms
  // If this is a MECHANISM and the puzzle has checkmate, the mechanism is incidental
  if (requestedLevel === 'MECHANISM') {
    const hasMate = allThemes.some(t =>
      t === 'mate' || t.startsWith('mateIn') ||
      ['backRankMate', 'smotheredMate', 'hookMate', 'arabianMate', 'anastasiasMate',
       'bodensMate', 'doubleBishopMate', 'operaMate', 'pillsburysMate', 'suffocationMate'].includes(t)
    );
    if (hasMate) return false;
  }

  // RULE 5: Enablers must enable something
  if (requestedLevel === 'ENABLER') {
    const hasMechanism = hierarchyThemes.some(t =>
      PUZZLE_VALIDATION_RULES.getThemeLevel(t) === 'MECHANISM'
    );
    const hasOutcome = hierarchyThemes.some(t =>
      PUZZLE_VALIDATION_RULES.getThemeLevel(t) === 'OUTCOME'
    );
    if (!hasMechanism && !hasOutcome) return false;
  }

  // RULE 1: Single-move puzzles can only have one mechanism as primary
  if (moveCount === 1 && requestedLevel === 'MECHANISM') {
    const mechanismsInPuzzle = hierarchyThemes.filter(t =>
      PUZZLE_VALIDATION_RULES.getThemeLevel(t) === 'MECHANISM'
    );
    if (mechanismsInPuzzle.length > 1) {
      const mappedRequested = LICHESS_TO_HIERARCHY[theme] || theme.toLowerCase();
      if (mechanismsInPuzzle[0] !== mappedRequested) return false;
    }
  }

  // Check if predicted primary theme matches this theme
  const normalizedPrimary = predictedPrimaryTheme.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normalizedRequested = theme.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (normalizedPrimary.includes(normalizedRequested) || normalizedRequested.includes(normalizedPrimary)) {
    return true;
  }

  // Use the hierarchy validation
  const validation = PUZZLE_VALIDATION_RULES.isValidMultiThemeCombination(hierarchyThemes, moveCount);
  const mappedRequested = LICHESS_TO_HIERARCHY[theme] || theme.toLowerCase();
  return validation.primaryTheme?.toLowerCase() === mappedRequested.toLowerCase();
}

async function analyze() {
  const dataDir = path.join(process.cwd(), 'data', 'puzzles-by-rating');
  const results: Record<string, {
    label: string;
    color: string;
    totalPuzzles: number;
    validatedPuzzles: number;
    themeCounts: Record<string, number>;
    categoryTotals: Record<string, number>;
  }> = {};

  // Lower sample rate to get more accurate stats (but slower)
  const SAMPLE_RATE = 10;

  for (const bracket of RATING_BRACKETS) {
    const fp = path.join(dataDir, bracket.file);
    if (!fs.existsSync(fp)) {
      console.log(`Skipping ${bracket.file} (not found)`);
      continue;
    }

    console.log(`Analyzing ${bracket.file} with curriculum v2 rules...`);
    const lines = fs.readFileSync(fp, 'utf-8').split('\n').slice(1);

    const themeCounts: Record<string, number> = {};
    const categoryTotals: Record<string, number> = { outcomes: 0, mechanisms: 0, enablers: 0, endgames: 0 };
    let total = 0;
    let validated = 0;

    for (let i = 0; i < lines.length; i += SAMPLE_RATE) {
      const line = lines[i];
      if (!line?.trim()) continue;

      const fields = parseCsvLine(line);
      const [puzzleId, fen, moves, rating, , , , themeStr] = fields;
      if (!themeStr || !puzzleId) continue;

      total++;
      const themes = themeStr.split(' ').filter(Boolean);

      // Use analyzePuzzle to get the predicted primary theme
      let predictedPrimaryTheme = '';
      try {
        const analysis = analyzePuzzle(
          puzzleId,
          fen,
          moves,
          parseInt(rating) || 1000,
          themeStr,
          `https://lichess.org/training/${puzzleId}`
        );
        predictedPrimaryTheme = analysis.predictedPrimaryTheme;
      } catch {
        // Fall back to first theme
        predictedPrimaryTheme = themes[0] || '';
      }

      // For each theme, check if it's a valid PRIMARY theme
      let foundValidTheme = false;
      for (const theme of themes) {
        if (isValidPrimaryTheme(theme, themes, moves, predictedPrimaryTheme)) {
          themeCounts[theme] = (themeCounts[theme] || 0) + 1;
          const cat = getCategory(theme);
          if (cat) {
            categoryTotals[cat]++;
          }
          foundValidTheme = true;
        }
      }
      if (foundValidTheme) validated++;

      // Progress indicator
      if (total % 1000 === 0) {
        process.stdout.write(`\r  Processed ${total} puzzles...`);
      }
    }

    console.log(`\r  ${total} puzzles sampled, ${validated} with valid primary themes`);

    results[bracket.id] = {
      label: bracket.label,
      color: bracket.color,
      totalPuzzles: total,
      validatedPuzzles: validated,
      themeCounts,
      categoryTotals,
    };
  }

  // Calculate percentages and top themes per bracket
  const output = {
    brackets: RATING_BRACKETS.map(b => ({ id: b.id, label: b.label, color: b.color })),
    stats: {} as Record<string, {
      label: string;
      color: string;
      totalPuzzles: number;
      topThemes: Array<{ theme: string; count: number; percentage: number; category: string | null }>;
      categoryBreakdown: Record<string, { count: number; percentage: number }>;
    }>,
  };

  for (const [id, data] of Object.entries(results)) {
    const sortedThemes = Object.entries(data.themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([theme, count]) => ({
        theme,
        count,
        percentage: Math.round(count / data.totalPuzzles * 1000) / 10,
        category: getCategory(theme),
      }));

    const categoryBreakdown: Record<string, { count: number; percentage: number }> = {};
    for (const [cat, count] of Object.entries(data.categoryTotals)) {
      categoryBreakdown[cat] = {
        count,
        percentage: Math.round(count / data.totalPuzzles * 1000) / 10,
      };
    }

    output.stats[id] = {
      label: data.label,
      color: data.color,
      totalPuzzles: data.totalPuzzles,
      topThemes: sortedThemes,
      categoryBreakdown,
    };
  }

  // Save results
  const outputPath = path.join(process.cwd(), 'data', 'theme-stats-by-level.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nSaved to ${outputPath}`);

  // Print summary
  console.log('\n=== VALIDATED THEME DISTRIBUTION BY LEVEL ===\n');
  console.log('(Only counting themes that are PRIMARY per curriculum v2 rules)\n');
  for (const [id, data] of Object.entries(output.stats)) {
    console.log(`${data.label} (${data.totalPuzzles} puzzles):`);
    console.log(`  Top 5 validated primary themes:`);
    for (const t of data.topThemes.slice(0, 5)) {
      console.log(`    ${t.theme}: ${t.percentage}% (${t.category || 'uncategorized'})`);
    }
    console.log('');
  }

  // Print comparison: how much the counts changed with validation
  console.log('\n=== VALIDATION IMPACT ===');
  console.log('Themes that are commonly INVALIDATED (absorbed by outcomes or rule violations):\n');

  for (const bracket of RATING_BRACKETS) {
    const data = results[bracket.id];
    if (!data) continue;

    console.log(`${bracket.label}:`);
    console.log(`  Mechanisms absorption rate: ${
      data.categoryTotals.outcomes > 0
        ? Math.round((1 - data.categoryTotals.mechanisms / (data.categoryTotals.mechanisms + data.categoryTotals.outcomes * 0.3)) * 100)
        : 0
    }% of potential mechanisms were absorbed by outcomes`);
  }
}

analyze().catch(console.error);
