/**
 * FAST Theme Statistics Generator
 *
 * Applies curriculum v2 hierarchy rules WITHOUT full puzzle analysis
 * Much faster - skips chess.js entirely, just uses tag-based rules
 *
 * Run with: npx tsx scripts/generate-theme-stats-fast.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const RATING_BRACKETS = [
  { id: '400-800', file: '0400-0800.csv', label: '400-800', color: '#58CC02' },
  { id: '800-1200', file: '0800-1200.csv', label: '800-1200', color: '#1CB0F6' },
  { id: '1200-1600', file: '1200-1600.csv', label: '1200-1600', color: '#FF9600' },
  { id: '1600-2000', file: '1600-2000.csv', label: '1600-2000', color: '#FF4B4B' },
  { id: '2000+', file: '2000-plus.csv', label: '2000+', color: '#A560E8' },
];

// Theme hierarchy from curriculum v2
const HIERARCHY = {
  FORCING: ['check', 'capture', 'threat'],
  ENABLER: ['attraction', 'deflection', 'clearance', 'capturingDefender', 'interference', 'sacrifice'],
  MECHANISM: ['fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck', 'xRayAttack', 'discoveredCheck'],
  OUTCOME: ['checkmate', 'materialGain', 'equality', 'advantage'],
};

// Lichess tags that indicate checkmate outcome
const MATE_TAGS = [
  'mate', 'mateIn1', 'mateIn2', 'mateIn3', 'mateIn4', 'mateIn5',
  'backRankMate', 'smotheredMate', 'hookMate', 'arabianMate', 'anastasiasMate',
  'bodensMate', 'doubleBishopMate', 'operaMate', 'pillsburysMate', 'suffocationMate',
  'dovetailMate'
];

// Theme categorization for display
const THEME_CATEGORIES: Record<string, string[]> = {
  outcomes: [...MATE_TAGS, 'crushing', 'advantage', 'hangingPiece', 'trappedPiece', 'promotion'],
  mechanisms: HIERARCHY.MECHANISM,
  enablers: [...HIERARCHY.ENABLER, 'quietMove', 'advancedPawn', 'intermezzo', 'zwischenzug'],
  endgames: ['endgame', 'rookEndgame', 'pawnEndgame', 'queenEndgame', 'bishopEndgame', 'knightEndgame', 'queenRookEndgame'],
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

function getHierarchyLevel(theme: string): string | null {
  for (const [level, themes] of Object.entries(HIERARCHY)) {
    if (themes.includes(theme)) return level;
  }
  // Map Lichess tags to levels
  if (MATE_TAGS.includes(theme) || ['crushing', 'advantage', 'hangingPiece', 'trappedPiece'].includes(theme)) {
    return 'OUTCOME';
  }
  return null;
}

/**
 * FAST validation - just use tags, no chess analysis
 *
 * Rules applied:
 * - RULE 4: If puzzle has mate tag, mechanisms are absorbed (not primary)
 * - RULE 5: Enablers need something to enable (mechanism or outcome)
 * - RULE 1: Only count first mechanism if multiple present
 */
function getValidPrimaryThemes(themes: string[]): string[] {
  const validThemes: string[] = [];

  // Check if this is a checkmate puzzle
  const hasMate = themes.some(t => MATE_TAGS.includes(t));

  // Check what levels are present
  const hasMechanism = themes.some(t => HIERARCHY.MECHANISM.includes(t));
  const hasOutcome = hasMate || themes.some(t => ['crushing', 'advantage', 'hangingPiece', 'trappedPiece'].includes(t));

  let mechanismCounted = false;

  for (const theme of themes) {
    const level = getHierarchyLevel(theme);

    // RULE 4: Mechanisms absorbed by checkmate outcomes
    if (level === 'MECHANISM' && hasMate) {
      continue; // Skip - absorbed by mate
    }

    // RULE 1: Only one mechanism per puzzle (count first one)
    if (level === 'MECHANISM') {
      if (mechanismCounted) continue;
      mechanismCounted = true;
      validThemes.push(theme);
      continue;
    }

    // RULE 5: Enablers must enable something
    if (level === 'ENABLER') {
      if (!hasMechanism && !hasOutcome) continue;
      validThemes.push(theme);
      continue;
    }

    // Outcomes and other themes pass through
    if (level === 'OUTCOME' || MATE_TAGS.includes(theme)) {
      validThemes.push(theme);
      continue;
    }

    // Non-hierarchy themes (endgame types, game phases) pass through
    if (!level) {
      validThemes.push(theme);
    }
  }

  return validThemes;
}

async function analyze() {
  const dataDir = path.join(process.cwd(), 'data', 'puzzles-by-rating');

  // Track both raw and validated counts for comparison
  const results: Record<string, {
    label: string;
    color: string;
    totalPuzzles: number;
    rawThemeCounts: Record<string, number>;
    validatedThemeCounts: Record<string, number>;
    rawCategoryTotals: Record<string, number>;
    validatedCategoryTotals: Record<string, number>;
  }> = {};

  const SAMPLE_RATE = 50; // Fast sampling

  for (const bracket of RATING_BRACKETS) {
    const fp = path.join(dataDir, bracket.file);
    if (!fs.existsSync(fp)) {
      console.log(`Skipping ${bracket.file} (not found)`);
      continue;
    }

    console.log(`Analyzing ${bracket.file}...`);
    const lines = fs.readFileSync(fp, 'utf-8').split('\n').slice(1);

    const rawThemeCounts: Record<string, number> = {};
    const validatedThemeCounts: Record<string, number> = {};
    const rawCategoryTotals: Record<string, number> = { outcomes: 0, mechanisms: 0, enablers: 0, endgames: 0 };
    const validatedCategoryTotals: Record<string, number> = { outcomes: 0, mechanisms: 0, enablers: 0, endgames: 0 };
    let total = 0;

    for (let i = 0; i < lines.length; i += SAMPLE_RATE) {
      const line = lines[i];
      if (!line?.trim()) continue;

      const fields = parseCsvLine(line);
      const themeStr = fields[7];
      if (!themeStr) continue;

      total++;
      const themes = themeStr.split(' ').filter(Boolean);

      // Count RAW themes (old behavior)
      for (const theme of themes) {
        rawThemeCounts[theme] = (rawThemeCounts[theme] || 0) + 1;
        const cat = getCategory(theme);
        if (cat) rawCategoryTotals[cat]++;
      }

      // Count VALIDATED themes (new behavior with curriculum v2 rules)
      const validThemes = getValidPrimaryThemes(themes);
      for (const theme of validThemes) {
        validatedThemeCounts[theme] = (validatedThemeCounts[theme] || 0) + 1;
        const cat = getCategory(theme);
        if (cat) validatedCategoryTotals[cat]++;
      }
    }

    results[bracket.id] = {
      label: bracket.label,
      color: bracket.color,
      totalPuzzles: total,
      rawThemeCounts,
      validatedThemeCounts,
      rawCategoryTotals,
      validatedCategoryTotals,
    };

    console.log(`  ${total} puzzles sampled`);
  }

  // Build output for the JSON file (using validated counts)
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
    const sortedThemes = Object.entries(data.validatedThemeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([theme, count]) => ({
        theme,
        count,
        percentage: Math.round(count / data.totalPuzzles * 1000) / 10,
        category: getCategory(theme),
      }));

    const categoryBreakdown: Record<string, { count: number; percentage: number }> = {};
    for (const [cat, count] of Object.entries(data.validatedCategoryTotals)) {
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

  // Print comparison: RAW vs VALIDATED
  console.log('\n' + '='.repeat(70));
  console.log('CURRICULUM V2 VALIDATION IMPACT');
  console.log('='.repeat(70));

  for (const bracket of RATING_BRACKETS) {
    const data = results[bracket.id];
    if (!data) continue;

    console.log(`\n${bracket.label} (${data.totalPuzzles} puzzles):`);
    console.log('-'.repeat(50));

    // Show mechanism absorption
    const rawMechanisms = data.rawCategoryTotals.mechanisms;
    const validatedMechanisms = data.validatedCategoryTotals.mechanisms;
    const absorbed = rawMechanisms - validatedMechanisms;
    const absorptionRate = rawMechanisms > 0 ? Math.round(absorbed / rawMechanisms * 100) : 0;

    console.log(`\n  MECHANISMS (fork, pin, skewer, etc.):`);
    console.log(`    Raw count:       ${rawMechanisms} (${Math.round(rawMechanisms / data.totalPuzzles * 100)}%)`);
    console.log(`    After validation: ${validatedMechanisms} (${Math.round(validatedMechanisms / data.totalPuzzles * 100)}%)`);
    console.log(`    Absorbed by mate: ${absorbed} (${absorptionRate}% filtered out)`);

    // Show specific theme changes
    console.log(`\n  KEY THEME CHANGES:`);
    const keyThemes = ['fork', 'pin', 'skewer', 'discoveredAttack', 'deflection', 'attraction'];
    for (const theme of keyThemes) {
      const raw = data.rawThemeCounts[theme] || 0;
      const validated = data.validatedThemeCounts[theme] || 0;
      if (raw > 0) {
        const change = Math.round((validated - raw) / raw * 100);
        console.log(`    ${theme.padEnd(18)} ${raw.toString().padStart(5)} → ${validated.toString().padStart(5)} (${change > 0 ? '+' : ''}${change}%)`);
      }
    }

    // Top 5 validated themes
    console.log(`\n  TOP 5 PRIMARY THEMES (after validation):`);
    const top5 = Object.entries(data.validatedThemeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    for (const [theme, count] of top5) {
      const pct = Math.round(count / data.totalPuzzles * 100);
      console.log(`    ${theme.padEnd(18)} ${count.toString().padStart(5)} (${pct}%)`);
    }
  }
}

analyze().catch(console.error);
