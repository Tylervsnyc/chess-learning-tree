/**
 * Extract Clean Puzzles for Chess Path V2
 *
 * Clean = high plays + single tactical theme (community-vetted)
 * - Level 1: 1000+ plays
 * - Level 2-3: 3000+ plays
 *
 * These are unambiguous teaching puzzles.
 *
 * Usage: npx tsx scripts/extract-clean-puzzles.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// THEME DEFINITIONS
// ============================================================================

// Tactical mechanisms (how you win material or force something)
const MECHANISMS = ['fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck', 'xRayAttack'];

// Tactical enablers (the setup move that makes tactics possible)
const ENABLERS = ['attraction', 'deflection', 'clearance', 'interference', 'sacrifice', 'exposedKing'];

// Named mate patterns
const MATE_PATTERNS = [
  'backRankMate', 'smotheredMate', 'hookMate', 'arabianMate', 'anastasiasMate',
  'bodensMate', 'doubleBishopMate', 'dovetailMate', 'suffocationMate'
];

// Mate depth tags
const MATE_DEPTH_TAGS = ['mateIn1', 'mateIn2', 'mateIn3', 'mateIn4', 'mateIn5'];

// Winning material themes (Level 1 focus)
const MATERIAL_THEMES = ['hangingPiece', 'trappedPiece', 'crushing'];

// Endgame themes (Level 1 focus) - use lower play threshold
const ENDGAME_THEMES = ['pawnEndgame', 'rookEndgame', 'queenEndgame', 'bishopEndgame', 'knightEndgame'];

// Quiet moves (no check, no capture - Level 3)
const QUIET_MOVE_THEMES = ['quietMove'];

// Positional themes (zugzwang, etc.)
const POSITIONAL_THEMES = ['zugzwang'];

// Attack themes (king attacks)
const ATTACK_THEMES = ['kingsideAttack', 'queensideAttack'];

// Defensive themes
const DEFENSIVE_THEMES = ['defensiveMove', 'intermezzo'];

// Promotion themes
const PROMOTION_THEMES = ['promotion', 'underPromotion'];

// All "noise" tags that don't represent the primary tactic
const NOISE_TAGS = [
  'short', 'long', 'veryLong',  // length indicators
  'oneMove', 'crushing', 'advantage', 'equality',  // outcome indicators (crushing is special - we extract it)
  'middlegame', 'endgame', 'opening',  // phase indicators
  'master', 'masterVsMaster', 'superGM',  // player skill indicators
];

// All tactical themes we want to extract
const ALL_TACTICAL_THEMES = [
  ...MECHANISMS,
  ...ENABLERS,
  ...MATE_PATTERNS,
  ...MATE_DEPTH_TAGS,
  ...MATERIAL_THEMES,
  ...ENDGAME_THEMES,
  ...QUIET_MOVE_THEMES,
  ...POSITIONAL_THEMES,
  ...ATTACK_THEMES,
  ...DEFENSIVE_THEMES,
  ...PROMOTION_THEMES,
];

// Themes that need lower play thresholds (less commonly played)
const LOW_THRESHOLD_THEMES = [
  ...ENDGAME_THEMES,
  ...QUIET_MOVE_THEMES,
  ...POSITIONAL_THEMES,
  ...ATTACK_THEMES,
  ...DEFENSIVE_THEMES,
  'attraction',
  'clearance',
  'interference',
  'sacrifice',
];

// V2 ELO ranges with appropriate min plays thresholds
const V2_LEVELS = [
  { level: 1, label: '400-800', file: '0400-0800.csv', minRating: 400, maxRating: 800, minPlays: 1000, lowMinPlays: 200 },
  { level: 2, label: '800-1000', file: '0800-1200.csv', minRating: 800, maxRating: 1000, minPlays: 3000, lowMinPlays: 500 },
  { level: 3, label: '1000-1200', file: '0800-1200.csv', minRating: 1000, maxRating: 1200, minPlays: 3000, lowMinPlays: 500 },
  { level: 4, label: '1200-1400', file: '1200-1600.csv', minRating: 1200, maxRating: 1400, minPlays: 1000, lowMinPlays: 100 },
  { level: 5, label: '1400-1600', file: '1200-1600.csv', minRating: 1400, maxRating: 1600, minPlays: 500, lowMinPlays: 50 },
];

interface CleanPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  popularity: number;
  nbPlays: number;
  theme: string;  // The ONE tactical theme
  allThemes: string[];
  gameUrl: string;
}

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

/**
 * Determine the primary theme for a puzzle
 * Returns null if ambiguous or not clean
 */
function determinePrimaryTheme(themes: string[]): string | null {
  // Filter to just tactical themes
  const tacticalThemes = themes.filter(t => ALL_TACTICAL_THEMES.includes(t));

  // Special case: mateIn1/mateIn2 with a named pattern
  const mateDepth = themes.find(t => MATE_DEPTH_TAGS.includes(t));
  const matePattern = themes.find(t => MATE_PATTERNS.includes(t));

  // If it has a named mate pattern, that's the primary theme
  if (matePattern) {
    // But only if there's no other conflicting mechanism
    const otherMechanisms = tacticalThemes.filter(t =>
      MECHANISMS.includes(t) && t !== 'discoveredAttack' // discovered attack can coexist with mate
    );
    if (otherMechanisms.length === 0) {
      return matePattern;
    }
  }

  // If it's a mate puzzle without a pattern, categorize by depth
  if (mateDepth && !matePattern) {
    const otherTactical = tacticalThemes.filter(t =>
      !MATE_DEPTH_TAGS.includes(t) && t !== 'mate'
    );
    if (otherTactical.length === 0) {
      return mateDepth;
    }
    // Has mate + mechanism - ambiguous unless it's just discoveredAttack
    if (otherTactical.length === 1 && otherTactical[0] === 'discoveredAttack') {
      return mateDepth; // Mate with discovery is still primarily a mate puzzle
    }
    return null; // Ambiguous
  }

  // Winning material puzzles (Level 1 focus)
  const materialThemes = tacticalThemes.filter(t => MATERIAL_THEMES.includes(t));
  if (materialThemes.length > 0) {
    // hangingPiece and trappedPiece are clean if no other mechanism
    const mechanisms = tacticalThemes.filter(t => MECHANISMS.includes(t));
    if (mechanisms.length === 0) {
      // Prefer hangingPiece > trappedPiece > crushing
      if (materialThemes.includes('hangingPiece')) return 'hangingPiece';
      if (materialThemes.includes('trappedPiece')) return 'trappedPiece';
      if (materialThemes.includes('crushing')) return 'crushing';
    }
  }

  // Endgame puzzles
  const endgameThemes = tacticalThemes.filter(t => ENDGAME_THEMES.includes(t));
  if (endgameThemes.length === 1) {
    // Single endgame type with no conflicting mechanisms
    const mechanisms = tacticalThemes.filter(t => MECHANISMS.includes(t));
    if (mechanisms.length === 0) {
      return endgameThemes[0];
    }
  }

  // Promotion puzzles
  if (tacticalThemes.includes('promotion') || tacticalThemes.includes('underPromotion')) {
    const mechanisms = tacticalThemes.filter(t => MECHANISMS.includes(t));
    if (mechanisms.length === 0) {
      return tacticalThemes.includes('underPromotion') ? 'underPromotion' : 'promotion';
    }
  }

  // Quiet move puzzles (no check, no capture)
  if (tacticalThemes.includes('quietMove')) {
    const mechanisms = tacticalThemes.filter(t => MECHANISMS.includes(t));
    if (mechanisms.length === 0) {
      return 'quietMove';
    }
  }

  // Zugzwang puzzles (positional)
  if (tacticalThemes.includes('zugzwang')) {
    const mechanisms = tacticalThemes.filter(t => MECHANISMS.includes(t));
    if (mechanisms.length === 0) {
      return 'zugzwang';
    }
  }

  // Attack themes (kingsideAttack, queensideAttack)
  for (const attackTheme of ATTACK_THEMES) {
    if (tacticalThemes.includes(attackTheme)) {
      const mechanisms = tacticalThemes.filter(t => MECHANISMS.includes(t));
      if (mechanisms.length === 0) {
        return attackTheme;
      }
    }
  }

  // Defensive themes (defensiveMove, intermezzo)
  for (const defTheme of DEFENSIVE_THEMES) {
    if (tacticalThemes.includes(defTheme)) {
      const mechanisms = tacticalThemes.filter(t => MECHANISMS.includes(t));
      if (mechanisms.length === 0) {
        return defTheme;
      }
    }
  }

  // Mechanism puzzles (fork, pin, skewer, etc.)
  const mechanisms = tacticalThemes.filter(t => MECHANISMS.includes(t));
  if (mechanisms.length === 1) {
    // Clean single mechanism
    return mechanisms[0];
  }

  // Enabler puzzles (deflection, attraction, etc.)
  const enablers = tacticalThemes.filter(t => ENABLERS.includes(t));
  if (enablers.length === 1 && mechanisms.length === 0) {
    return enablers[0];
  }

  // If we have exactly one tactical theme overall
  if (tacticalThemes.length === 1) {
    return tacticalThemes[0];
  }

  // Ambiguous - multiple tactical themes
  return null;
}

function extractCleanPuzzles(
  filePath: string,
  minRating: number,
  maxRating: number,
  minPlays: number,
  lowMinPlays: number
): Map<string, CleanPuzzle[]> {
  const puzzlesByTheme = new Map<string, CleanPuzzle[]>();

  const lines = fs.readFileSync(filePath, 'utf-8').split('\n').slice(1);

  let totalProcessed = 0;
  let totalCleaned = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    totalProcessed++;

    const fields = parseCsvLine(line);
    const [puzzleId, fen, moves, ratingStr, ratingDev, popularityStr, nbPlaysStr, themesStr, gameUrl] = fields;

    const rating = parseInt(ratingStr) || 0;
    const nbPlays = parseInt(nbPlaysStr) || 0;
    const popularity = parseInt(popularityStr) || 0;

    // Filter by rating range
    if (rating < minRating || rating >= maxRating) continue;

    const themes = themesStr?.split(' ') || [];
    const primaryTheme = determinePrimaryTheme(themes);

    if (!primaryTheme) continue;

    // Use lower threshold for sparse themes
    const requiredPlays = LOW_THRESHOLD_THEMES.includes(primaryTheme) ? lowMinPlays : minPlays;
    if (nbPlays < requiredPlays) continue;

    totalCleaned++;

    const puzzle: CleanPuzzle = {
      puzzleId,
      fen,
      moves,
      rating,
      popularity,
      nbPlays,
      theme: primaryTheme,
      allThemes: themes,
      gameUrl: gameUrl || '',
    };

    if (!puzzlesByTheme.has(primaryTheme)) {
      puzzlesByTheme.set(primaryTheme, []);
    }
    puzzlesByTheme.get(primaryTheme)!.push(puzzle);
  }

  console.log(`  Processed ${totalProcessed} puzzles, ${totalCleaned} clean (${((totalCleaned / totalProcessed) * 100).toFixed(1)}%)`);

  // Sort each theme by rating (easy to hard), then by popularity (most played first)
  for (const [theme, puzzles] of puzzlesByTheme) {
    puzzles.sort((a, b) => {
      if (a.rating !== b.rating) return a.rating - b.rating;
      return b.popularity - a.popularity;
    });
  }

  return puzzlesByTheme;
}

// ============================================================================
// MAIN
// ============================================================================

const outputDir = path.join(process.cwd(), 'data', 'clean-puzzles-v2');
fs.mkdirSync(outputDir, { recursive: true });

const summary: Record<string, Record<string, number>> = {};

for (const levelConfig of V2_LEVELS) {
  const filePath = path.join(process.cwd(), 'data', 'puzzles-by-rating', levelConfig.file);

  if (!fs.existsSync(filePath)) {
    console.log(`Skipping level ${levelConfig.level}: file not found at ${filePath}`);
    continue;
  }

  console.log(`\nProcessing Level ${levelConfig.level} (${levelConfig.label})...`);

  const puzzlesByTheme = extractCleanPuzzles(
    filePath,
    levelConfig.minRating,
    levelConfig.maxRating,
    levelConfig.minPlays,
    levelConfig.lowMinPlays
  );

  summary[`level${levelConfig.level}`] = {};

  // Save each theme to its own file (cap at 1000 per theme)
  for (const [theme, puzzles] of puzzlesByTheme) {
    const outputFile = path.join(outputDir, `level${levelConfig.level}-${theme}.json`);

    fs.writeFileSync(outputFile, JSON.stringify({
      level: levelConfig.level,
      ratingRange: levelConfig.label,
      theme,
      count: puzzles.length,
      puzzles: puzzles.slice(0, 1000), // Cap at 1000 per theme
    }, null, 2));

    summary[`level${levelConfig.level}`][theme] = puzzles.length;
    console.log(`    ${theme}: ${puzzles.length} puzzles`);
  }
}

// Save summary
const summaryFile = path.join(outputDir, 'summary.json');
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

console.log(`\n${'='.repeat(70)}`);
console.log('EXTRACTION COMPLETE');
console.log(`${'='.repeat(70)}`);
console.log(`Files saved to: ${outputDir}`);
console.log(`Summary saved to: ${summaryFile}`);

// Print summary table
console.log('\nPuzzle counts by level and theme:');
console.log('-'.repeat(70));

const allThemes = new Set<string>();
for (const levelData of Object.values(summary)) {
  for (const theme of Object.keys(levelData)) {
    allThemes.add(theme);
  }
}

const sortedThemes = [...allThemes].sort();
console.log('Theme'.padEnd(25) + 'Level 1'.padStart(12) + 'Level 2'.padStart(12) + 'Level 3'.padStart(12));
console.log('-'.repeat(61));

for (const theme of sortedThemes) {
  const l1 = summary.level1?.[theme] || 0;
  const l2 = summary.level2?.[theme] || 0;
  const l3 = summary.level3?.[theme] || 0;
  console.log(
    theme.padEnd(25) +
    l1.toString().padStart(12) +
    l2.toString().padStart(12) +
    l3.toString().padStart(12)
  );
}

// Category totals
console.log('\n' + '='.repeat(61));
console.log('Category Totals:');

const categories = {
  'Checkmates (mateIn1-5)': MATE_DEPTH_TAGS,
  'Named Mate Patterns': MATE_PATTERNS,
  'Mechanisms': MECHANISMS,
  'Enablers': ENABLERS,
  'Winning Material': MATERIAL_THEMES,
  'Endgames': ENDGAME_THEMES,
  'Quiet Moves': QUIET_MOVE_THEMES,
  'Positional': POSITIONAL_THEMES,
  'Attack': ATTACK_THEMES,
  'Defensive': DEFENSIVE_THEMES,
  'Promotion': PROMOTION_THEMES,
};

for (const [category, themeList] of Object.entries(categories)) {
  let l1 = 0, l2 = 0, l3 = 0;
  for (const theme of themeList) {
    l1 += summary.level1?.[theme] || 0;
    l2 += summary.level2?.[theme] || 0;
    l3 += summary.level3?.[theme] || 0;
  }
  if (l1 + l2 + l3 > 0) {
    console.log(`  ${category}:`.padEnd(30) + `L1: ${l1}`.padEnd(15) + `L2: ${l2}`.padEnd(15) + `L3: ${l3}`);
  }
}
