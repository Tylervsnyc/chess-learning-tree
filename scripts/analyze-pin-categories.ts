import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating', '0400-0800');
const MIN_PLAYS = 500;

interface PinPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  nbPlays: number;
  themes: string[];
  url: string;
  category: string;
}

function categorizePinPuzzle(themes: string[]): string {
  // Check what the pin combines with, in priority order

  // Pin for mate patterns
  if (themes.includes('mateIn1')) return 'pin-for-mate-in-1';
  if (themes.includes('mateIn2')) return 'pin-for-mate-in-2';
  if (themes.includes('mateIn3') || themes.includes('mateIn4')) return 'pin-for-mate-in-3+';
  if (themes.includes('backRankMate')) return 'pin-for-back-rank-mate';
  if (themes.some(t => t.includes('Mate') && t !== 'backRankMate')) return 'pin-for-mate-pattern';
  if (themes.includes('mate')) return 'pin-for-mate';

  // Pin + other tactics
  if (themes.includes('fork')) return 'pin-to-fork';
  if (themes.includes('skewer')) return 'pin-with-skewer';
  if (themes.includes('discoveredAttack')) return 'pin-discovered-attack';
  if (themes.includes('deflection')) return 'pin-deflection';
  if (themes.includes('attraction')) return 'pin-attraction';
  if (themes.includes('interference')) return 'pin-interference';
  if (themes.includes('promotion')) return 'pin-for-promotion';
  if (themes.includes('trappedPiece')) return 'pin-traps-piece';

  // Pin defensive
  if (themes.includes('defensiveMove')) return 'defensive-pin';

  // Pure pin wins material
  if (themes.includes('crushing') || themes.includes('advantage')) return 'pin-wins-material';

  // Hangng piece via pin
  if (themes.includes('hangingPiece')) return 'pin-hanging-piece';

  return 'pin-other';
}

async function main() {
  const seenIds = new Set<string>();
  const categories: Record<string, PinPuzzle[]> = {};

  // Read from the pin.csv file specifically
  const pinFile = join(PUZZLES_DIR, 'pin.csv');
  const content = readFileSync(pinFile, 'utf-8');
  const lines = content.trim().split('\n');

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 9) continue;

    const puzzleId = parts[0];
    const nbPlays = parseInt(parts[6], 10);

    if (nbPlays < MIN_PLAYS) continue;
    if (seenIds.has(puzzleId)) continue;
    seenIds.add(puzzleId);

    const themes = parts[7].split(' ');
    const category = categorizePinPuzzle(themes);

    const puzzle: PinPuzzle = {
      puzzleId,
      fen: parts[1],
      moves: parts[2],
      rating: parseInt(parts[3], 10),
      nbPlays,
      themes,
      url: parts[8],
      category
    };

    if (!categories[category]) categories[category] = [];
    categories[category].push(puzzle);
  }

  // Also check other files for pin-tagged puzzles we might have missed
  const otherFiles = readdirSync(PUZZLES_DIR).filter(f => f.endsWith('.csv') && f !== 'pin.csv');

  for (const file of otherFiles) {
    const content = readFileSync(join(PUZZLES_DIR, file), 'utf-8');
    const lines = content.trim().split('\n');

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length < 9) continue;

      const puzzleId = parts[0];
      const nbPlays = parseInt(parts[6], 10);
      const themes = parts[7].split(' ');

      if (!themes.includes('pin')) continue;
      if (nbPlays < MIN_PLAYS) continue;
      if (seenIds.has(puzzleId)) continue;
      seenIds.add(puzzleId);

      const category = categorizePinPuzzle(themes);

      const puzzle: PinPuzzle = {
        puzzleId,
        fen: parts[1],
        moves: parts[2],
        rating: parseInt(parts[3], 10),
        nbPlays,
        themes,
        url: parts[8],
        category
      };

      if (!categories[category]) categories[category] = [];
      categories[category].push(puzzle);
    }
  }

  console.log(`\n=== PIN PUZZLE CATEGORIES (${MIN_PLAYS}+ plays, 400-800 rating) ===\n`);

  // Sort categories by count
  const sorted = Object.entries(categories).sort((a, b) => b[1].length - a[1].length);

  let total = 0;
  for (const [category, puzzles] of sorted) {
    console.log(`${category.padEnd(30)} ${puzzles.length.toString().padStart(5)} puzzles`);
    total += puzzles.length;

    // Show a few example puzzle IDs
    const examples = puzzles.slice(0, 3).map(p => p.puzzleId).join(', ');
    console.log(`  Examples: ${examples}`);
    console.log(`  Avg rating: ${Math.round(puzzles.reduce((sum, p) => sum + p.rating, 0) / puzzles.length)}`);
    console.log('');
  }

  console.log(`=== TOTAL PIN PUZZLES: ${total} ===`);
}

main();
