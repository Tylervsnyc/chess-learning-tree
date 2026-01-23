/**
 * Find examples of skill-stacking puzzles from the database
 * Shows puzzles that have BOTH themes to help verify they're valid combos
 */

import { readFileSync } from 'fs';
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

// Load puzzles from a theme file
function loadPuzzlesFromFile(theme: string): RawPuzzle[] {
  const filePath = join(PUZZLES_DIR, `${theme}.csv`);
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const puzzles: RawPuzzle[] = [];

    for (let i = 1; i < lines.length && puzzles.length < 5000; i++) {
      const parts = lines[i].split(',');
      if (parts.length < 9) continue;

      puzzles.push({
        puzzleId: parts[0],
        fen: parts[1],
        moves: parts[2],
        rating: parseInt(parts[3], 10),
        themes: parts[7].split(' '),
        url: parts[8],
      });
    }
    return puzzles;
  } catch {
    return [];
  }
}

// Format solution moves nicely
function formatSolution(fen: string, moves: string): string {
  const chess = new Chess(fen);
  const moveList = moves.split(' ');
  const formatted: string[] = [];

  // Apply setup move
  const setup = moveList[0];
  const setupResult = chess.move({
    from: setup.slice(0, 2),
    to: setup.slice(2, 4),
    promotion: setup[4] as any
  });
  formatted.push(`Setup: ${setupResult?.san || setup}`);

  // Get player color
  const playerColor = chess.turn() === 'w' ? 'White' : 'Black';
  formatted.push(`${playerColor} to move`);

  // Solution moves
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

// Find puzzles with both themes
function findSkillStackPuzzles(theme1: string, theme2: string, limit: number = 5): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`FINDING: ${theme1} → ${theme2}`);
  console.log(`${'='.repeat(60)}`);

  const puzzles = loadPuzzlesFromFile(theme1);
  console.log(`Loaded ${puzzles.length} puzzles from ${theme1}.csv`);

  // Find puzzles with both themes
  const matches = puzzles.filter(p => p.themes.includes(theme2));
  console.log(`Found ${matches.length} puzzles with both ${theme1} AND ${theme2}\n`);

  if (matches.length === 0) {
    console.log('No matches found!\n');
    return;
  }

  // Show examples
  const examples = matches.slice(0, limit);

  for (const puzzle of examples) {
    console.log(`─────────────────────────────────────────`);
    console.log(`Puzzle: ${puzzle.puzzleId}`);
    console.log(`Rating: ${puzzle.rating}`);
    console.log(`Themes: ${puzzle.themes.join(', ')}`);
    console.log(`URL: https://lichess.org/training/${puzzle.puzzleId}`);
    console.log(`\nSolution:`);
    console.log(formatSolution(puzzle.fen, puzzle.moves));

    // Validate with our skill-stack validator
    const order = getSkillStackOrder([theme1, theme2]);
    if (order) {
      const result = verifySkillStackSequence(puzzle.fen, puzzle.moves, order[0], order[1]);
      console.log(`\nSkill-Stack Valid: ${result.valid ? '✓ YES' : '✗ NO'}`);
      console.log(`Reasoning: ${result.reasoning}`);
    }

    console.log('');
  }
}

// Main - find examples of different combos
async function main() {
  console.log('SKILL-STACKING PUZZLE EXAMPLES');
  console.log('Finding puzzles that have BOTH themes\n');

  // Fork → Mate combinations
  findSkillStackPuzzles('fork', 'mateIn2', 5);
  findSkillStackPuzzles('fork', 'mate', 3);

  // Pin combinations
  findSkillStackPuzzles('pin', 'fork', 5);
  findSkillStackPuzzles('pin', 'mateIn2', 3);

  // Remove defender combinations
  findSkillStackPuzzles('capturingDefender', 'fork', 3);
  findSkillStackPuzzles('capturingDefender', 'mateIn2', 3);

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY OF AVAILABLE COMBOS');
  console.log(`${'='.repeat(60)}`);

  const combos = [
    ['fork', 'mateIn2'],
    ['fork', 'mate'],
    ['fork', 'mateIn3'],
    ['pin', 'fork'],
    ['pin', 'mateIn2'],
    ['pin', 'mate'],
    ['capturingDefender', 'fork'],
    ['capturingDefender', 'mateIn2'],
    ['deflection', 'fork'],
    ['deflection', 'mateIn2'],
  ];

  for (const [t1, t2] of combos) {
    const puzzles = loadPuzzlesFromFile(t1);
    const matches = puzzles.filter(p => p.themes.includes(t2));
    console.log(`${t1} + ${t2}: ${matches.length} puzzles`);
  }
}

main();
