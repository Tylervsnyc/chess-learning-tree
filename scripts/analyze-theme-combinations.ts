import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating', '0400-0800');
const MIN_PLAYS = 500;

// Tactical themes we care about combining
const TACTICAL_THEMES = [
  'fork', 'pin', 'skewer', 'discoveredAttack', 'backRankMate',
  'deflection', 'attraction', 'interference', 'promotion',
  'trappedPiece', 'hangingPiece', 'sacrifice', 'intermezzo',
  'smotheredMate', 'arabianMate', 'pillsburysMate', 'operaMate',
  'hookMate', 'doubleBishopMate', 'anastasiasMate', 'bodensMate'
];

async function main() {
  const seenIds = new Set<string>();
  const combinations: Record<string, number> = {};
  const themeFiles = readdirSync(PUZZLES_DIR).filter(f => f.endsWith('.csv'));

  for (const file of themeFiles) {
    const content = readFileSync(join(PUZZLES_DIR, file), 'utf-8');
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

      // Find tactical themes in this puzzle
      const tacticalInPuzzle = themes.filter(t => TACTICAL_THEMES.includes(t));

      // Only interested in puzzles with 2+ tactical themes
      if (tacticalInPuzzle.length >= 2) {
        // Sort to normalize (fork+pin same as pin+fork)
        const combo = tacticalInPuzzle.sort().join(' + ');
        combinations[combo] = (combinations[combo] || 0) + 1;
      }
    }
  }

  console.log(`\n=== THEME COMBINATIONS (${MIN_PLAYS}+ plays) ===\n`);
  console.log('Puzzles that teach MULTIPLE tactical concepts together:\n');

  const sorted = Object.entries(combinations)
    .filter(([_, count]) => count >= 5)  // At least 5 puzzles
    .sort((a, b) => b[1] - a[1]);

  for (const [combo, count] of sorted) {
    console.log(`${combo.padEnd(50)} ${count.toString().padStart(5)} puzzles`);
  }

  console.log(`\n=== COMBINATIONS WITH 2-4 PUZZLES ===\n`);

  const rare = Object.entries(combinations)
    .filter(([_, count]) => count >= 2 && count < 5)
    .sort((a, b) => b[1] - a[1]);

  for (const [combo, count] of rare) {
    console.log(`${combo.padEnd(50)} ${count.toString().padStart(5)} puzzles`);
  }
}

main();
