/**
 * Analyze Theme Connections in Puzzle Database
 * Run with: npx tsx scripts/analyze-theme-connections.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const THEME_CATEGORIES = {
  outcomes: [
    'mate', 'mateIn1', 'mateIn2', 'mateIn3', 'mateIn4', 'mateIn5',
    'backRankMate', 'smotheredMate', 'hookMate', 'arabianMate', 'anastasiasMate',
    'bodensMate', 'doubleBishopMate', 'dovetailMate',
    'crushing', 'advantage', 'hangingPiece', 'trappedPiece',
    'endgame', 'rookEndgame', 'pawnEndgame', 'queenEndgame', 'bishopEndgame', 'knightEndgame',
    'promotion', 'underPromotion',
  ],
  mechanisms: ['fork', 'pin', 'skewer', 'discoveredAttack', 'discoveredCheck', 'doubleCheck', 'exposedKing'],
  enablers: ['attraction', 'deflection', 'clearance', 'capturingDefender', 'interference', 'overloading', 'xRayAttack', 'intermezzo', 'zwischenzug', 'sacrifice', 'quietMove', 'advancedPawn'],
  context: ['opening', 'middlegame', 'kingsideAttack', 'queensideAttack', 'short', 'long', 'veryLong', 'oneMove', 'master', 'masterVsMaster', 'superGM', 'defensiveMove', 'equality', 'zugzwang', 'castling', 'enPassant'],
};

const CATEGORY_LOOKUP: Record<string, string> = {};
Object.entries(THEME_CATEGORIES).forEach(([cat, themes]) => {
  themes.forEach(t => CATEGORY_LOOKUP[t] = cat);
});

function categorizeThemes(str: string) {
  const themes = str.split(' ').filter(Boolean);
  const result = { outcomes: [] as string[], mechanisms: [] as string[], enablers: [] as string[], context: [] as string[], unknown: [] as string[] };
  themes.forEach(t => {
    const cat = CATEGORY_LOOKUP[t];
    if (cat === 'outcomes') result.outcomes.push(t);
    else if (cat === 'mechanisms') result.mechanisms.push(t);
    else if (cat === 'enablers') result.enablers.push(t);
    else if (cat === 'context') result.context.push(t);
    else result.unknown.push(t);
  });
  return result;
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

async function analyze() {
  const dataDir = path.join(process.cwd(), 'data', 'puzzles-by-rating');
  const files = ['0400-0800.csv', '0800-1200.csv', '1200-1600.csv'];
  const coOccurrences = new Map<string, number>();
  const themeCounts = new Map<string, number>();
  let total = 0;

  for (const file of files) {
    const fp = path.join(dataDir, file);
    if (!fs.existsSync(fp)) continue;
    console.log('Analyzing ' + file + '...');
    const lines = fs.readFileSync(fp, 'utf-8').split('\n').slice(1);
    for (let i = 0; i < lines.length; i += 10) {
      const line = lines[i];
      if (!line?.trim()) continue;
      const fields = parseCsvLine(line);
      const themeStr = fields[7];
      if (!themeStr) continue;
      const cat = categorizeThemes(themeStr);
      total++;
      [...cat.outcomes, ...cat.mechanisms, ...cat.enablers].forEach(t => themeCounts.set(t, (themeCounts.get(t) || 0) + 1));
      cat.enablers.forEach(e => cat.mechanisms.forEach(m => coOccurrences.set(e + ' -> ' + m, (coOccurrences.get(e + ' -> ' + m) || 0) + 1)));
      cat.mechanisms.forEach(m => cat.outcomes.forEach(o => coOccurrences.set(m + ' -> ' + o, (coOccurrences.get(m + ' -> ' + o) || 0) + 1)));
      if (cat.mechanisms.length === 0 && cat.enablers.length > 0) {
        cat.enablers.forEach(e => cat.outcomes.forEach(o => coOccurrences.set(e + ' -> ' + o + ' (direct)', (coOccurrences.get(e + ' -> ' + o + ' (direct)') || 0) + 1)));
      }
    }
  }

  console.log('\nTotal puzzles: ' + total);
  console.log('\n--- MECHANISMS ---');
  [...themeCounts.entries()].filter(([t]) => CATEGORY_LOOKUP[t] === 'mechanisms').sort((a,b) => b[1] - a[1]).forEach(([t, c]) => console.log('  ' + t + ': ' + c));
  console.log('\n--- ENABLERS ---');
  [...themeCounts.entries()].filter(([t]) => CATEGORY_LOOKUP[t] === 'enablers').sort((a,b) => b[1] - a[1]).forEach(([t, c]) => console.log('  ' + t + ': ' + c));
  console.log('\n--- ENABLER -> MECHANISM ---');
  [...coOccurrences.entries()].filter(([k]) => CATEGORY_LOOKUP[k.split(' -> ')[0]] === 'enablers' && CATEGORY_LOOKUP[k.split(' -> ')[1]] === 'mechanisms').sort((a,b) => b[1] - a[1]).slice(0,15).forEach(([k, c]) => console.log('  ' + k + ': ' + c));
  console.log('\n--- MECHANISM -> OUTCOME ---');
  [...coOccurrences.entries()].filter(([k]) => CATEGORY_LOOKUP[k.split(' -> ')[0]] === 'mechanisms' && CATEGORY_LOOKUP[k.split(' -> ')[1]] === 'outcomes').sort((a,b) => b[1] - a[1]).slice(0,20).forEach(([k, c]) => console.log('  ' + k + ': ' + c));

  const outputData = { totalPuzzles: total, themeCounts: Object.fromEntries(themeCounts), coOccurrences: Object.fromEntries(coOccurrences) };
  fs.writeFileSync(path.join(process.cwd(), 'data', 'theme-connections-analysis.json'), JSON.stringify(outputData, null, 2));
  console.log('\nSaved to data/theme-connections-analysis.json');
}

analyze();
