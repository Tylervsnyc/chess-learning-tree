/**
 * Find VALID skill-stacking puzzles - ones where theme1 actually enables theme2
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Chess } from 'chess.js';
import { verifySkillStackSequence, getSkillStackOrder } from '../lib/skill-stack-validator';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating', '0400-0800');

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string[];
  url: string;
}

// Load ALL puzzles (we need to search across theme files)
function loadAllPuzzles(): RawPuzzle[] {
  const files = readdirSync(PUZZLES_DIR).filter(f => f.endsWith('.csv'));
  const seenIds = new Set<string>();
  const puzzles: RawPuzzle[] = [];

  for (const file of files) {
    const content = readFileSync(join(PUZZLES_DIR, file), 'utf-8');
    const lines = content.trim().split('\n');

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length < 9) continue;

      const puzzleId = parts[0];
      if (seenIds.has(puzzleId)) continue;
      seenIds.add(puzzleId);

      puzzles.push({
        puzzleId,
        fen: parts[1],
        moves: parts[2],
        rating: parseInt(parts[3], 10),
        themes: parts[7].split(' '),
        url: parts[8],
      });
    }
  }

  return puzzles;
}

// Format solution moves nicely
function formatSolution(fen: string, moves: string): string {
  const chess = new Chess(fen);
  const moveList = moves.split(' ');
  const formatted: string[] = [];

  const setup = moveList[0];
  const setupResult = chess.move({
    from: setup.slice(0, 2),
    to: setup.slice(2, 4),
    promotion: setup[4] as any
  });
  formatted.push(`Setup: ${setupResult?.san || setup}`);

  const playerColor = chess.turn() === 'w' ? 'White' : 'Black';
  formatted.push(`${playerColor} to move`);

  for (let i = 1; i < moveList.length; i++) {
    const uci = moveList[i];
    const result = chess.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci[4] as any
    });
    const label = i % 2 === 1 ? `  ${Math.ceil(i/2)}. ` : ' ... ';
    formatted.push(`${label}${result?.san || uci}`);
  }

  return formatted.join('\n');
}

// Find VALID skill-stack puzzles
function findValidSkillStacks(
  allPuzzles: RawPuzzle[],
  theme1: string,
  theme2: string,
  limit: number = 5
): RawPuzzle[] {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`SEARCHING: Valid ${theme1} → ${theme2} puzzles`);
  console.log(`${'='.repeat(60)}`);

  // Find puzzles with both themes
  const candidates = allPuzzles.filter(p =>
    p.themes.includes(theme1) && p.themes.includes(theme2)
  );
  console.log(`Candidates with both tags: ${candidates.length}`);

  const validPuzzles: RawPuzzle[] = [];
  let checkedCount = 0;

  for (const puzzle of candidates) {
    checkedCount++;

    const order = getSkillStackOrder([theme1, theme2]);
    if (!order) continue;

    const result = verifySkillStackSequence(puzzle.fen, puzzle.moves, order[0], order[1]);

    if (result.valid) {
      validPuzzles.push(puzzle);

      console.log(`\n✓ VALID: ${puzzle.puzzleId} (Rating: ${puzzle.rating})`);
      console.log(`  Themes: ${puzzle.themes.join(', ')}`);
      console.log(`  URL: https://lichess.org/training/${puzzle.puzzleId}`);
      console.log(`  ${result.reasoning}`);
      console.log(`  Solution:`);
      console.log(formatSolution(puzzle.fen, puzzle.moves).split('\n').map(l => '    ' + l).join('\n'));

      if (validPuzzles.length >= limit) break;
    }

    // Progress update
    if (checkedCount % 100 === 0) {
      process.stdout.write(`  Checked ${checkedCount}/${candidates.length}...\r`);
    }
  }

  console.log(`\nFound ${validPuzzles.length} VALID puzzles out of ${candidates.length} candidates`);
  return validPuzzles;
}

async function main() {
  console.log('FINDING VALID SKILL-STACKING PUZZLES');
  console.log('These are puzzles where theme1 ACTUALLY enables theme2\n');

  console.log('Loading all puzzles...');
  const allPuzzles = loadAllPuzzles();
  console.log(`Loaded ${allPuzzles.length} unique puzzles\n`);

  // Test each combo
  const results: Record<string, number> = {};

  // Fork → Mate
  const forkMate = findValidSkillStacks(allPuzzles, 'fork', 'mateIn2', 5);
  results['fork → mateIn2'] = forkMate.length;

  // Pin → Fork
  const pinFork = findValidSkillStacks(allPuzzles, 'pin', 'fork', 5);
  results['pin → fork'] = pinFork.length;

  // Pin → Mate
  const pinMate = findValidSkillStacks(allPuzzles, 'pin', 'mateIn2', 5);
  results['pin → mateIn2'] = pinMate.length;

  // Deflection → Mate (deflection is "remove defender" style)
  const deflectionMate = findValidSkillStacks(allPuzzles, 'deflection', 'mateIn2', 5);
  results['deflection → mateIn2'] = deflectionMate.length;

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY: Valid Skill-Stack Puzzles Found');
  console.log(`${'='.repeat(60)}`);

  for (const [combo, count] of Object.entries(results)) {
    const status = count >= 5 ? '✓' : count > 0 ? '⚠' : '✗';
    console.log(`${status} ${combo}: ${count >= 5 ? '5+' : count} valid puzzles found`);
  }
}

main();
