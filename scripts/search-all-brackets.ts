/**
 * Search ALL rating brackets for skill-stack puzzles
 * Higher ratings may have more complex combinations
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { Chess, Square } from 'chess.js';

const BASE_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');
const BRACKETS = ['0400-0800', '0800-1200', '1200-1600', '1600-2000'];

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string[];
  bracket: string;
}

const PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 100
};

function loadPuzzlesFromBracket(bracket: string, theme: string, limit: number = 2000): RawPuzzle[] {
  const filePath = join(BASE_DIR, bracket, `${theme}.csv`);
  if (!existsSync(filePath)) return [];

  const content = readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const puzzles: RawPuzzle[] = [];

  for (let i = 1; i < lines.length && puzzles.length < limit; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 9) continue;

    puzzles.push({
      puzzleId: parts[0],
      fen: parts[1],
      moves: parts[2],
      rating: parseInt(parts[3], 10),
      themes: parts[7].split(' '),
      bracket,
    });
  }
  return puzzles;
}

// Check if a move creates a fork (attacks 2+ pieces)
function isForkingMove(chess: Chess, from: Square, to: Square): boolean {
  try {
    const piece = chess.get(from);
    if (!piece) return false;

    const testChess = new Chess(chess.fen());
    const move = testChess.move({ from, to });
    if (!move) return false;

  const opponentColor = piece.color === 'w' ? 'b' : 'w';
  const attackedMoves = testChess.moves({ square: to, verbose: true });

  let valuableTargets = 0;
  for (const m of attackedMoves) {
    const target = testChess.get(m.to as Square);
    if (target && target.color === opponentColor) {
      if (PIECE_VALUES[target.type] >= 3 || target.type === 'k') {
        valuableTargets++;
      }
    }
  }

  return valuableTargets >= 2;
  } catch {
    return false;
  }
}

// Check if puzzle has a real fork that leads to mate
function isValidForkToMate(puzzle: RawPuzzle): { valid: boolean; reason: string } {
  try {
    const chess = new Chess(puzzle.fen);
    const moveList = puzzle.moves.split(' ');

  // Apply setup
  chess.move({
    from: moveList[0].slice(0, 2) as Square,
    to: moveList[0].slice(2, 4) as Square,
    promotion: moveList[0][4] as any
  });

  let forkMoveIndex = -1;
  let mateMoveIndex = -1;
  const forkDetails: string[] = [];

  // Play through solution
  for (let i = 1; i < moveList.length; i++) {
    const uci = moveList[i];
    const from = uci.slice(0, 2) as Square;
    const to = uci.slice(2, 4) as Square;
    const isPlayerMove = i % 2 === 1;

    if (isPlayerMove) {
      // Check for fork BEFORE making move
      if (forkMoveIndex === -1 && isForkingMove(chess, from, to)) {
        forkMoveIndex = Math.ceil(i / 2);
        const piece = chess.get(from);
        forkDetails.push(`${piece?.type.toUpperCase()} fork on move ${forkMoveIndex}`);
      }
    }

    chess.move({ from, to, promotion: uci[4] as any });

    if (isPlayerMove && chess.isCheckmate()) {
      mateMoveIndex = Math.ceil(i / 2);
    }
  }

  // Valid if fork comes before mate and fork is in first 2 moves
  if (forkMoveIndex > 0 && mateMoveIndex > forkMoveIndex && forkMoveIndex <= 2) {
    return { valid: true, reason: `${forkDetails.join(', ')} → mate on move ${mateMoveIndex}` };
  }

  if (mateMoveIndex > 0 && forkMoveIndex < 0) {
    return { valid: false, reason: 'Mate without fork - incidental tag' };
  }

  return { valid: false, reason: `Fork move ${forkMoveIndex}, mate move ${mateMoveIndex}` };
  } catch {
    return { valid: false, reason: 'Error parsing puzzle' };
  }
}

function formatSolution(puzzle: RawPuzzle): string {
  const chess = new Chess(puzzle.fen);
  const moveList = puzzle.moves.split(' ');
  const lines: string[] = [];

  const setup = chess.move({
    from: moveList[0].slice(0, 2) as Square,
    to: moveList[0].slice(2, 4) as Square,
    promotion: moveList[0][4] as any
  });
  lines.push(`Setup: ${setup?.san}`);

  for (let i = 1; i < moveList.length; i++) {
    const uci = moveList[i];
    const move = chess.move({
      from: uci.slice(0, 2) as Square,
      to: uci.slice(2, 4) as Square,
      promotion: uci[4] as any
    });
    const prefix = i % 2 === 1 ? `${Math.ceil(i / 2)}.` : '...';
    lines.push(`  ${prefix} ${move?.san}`);
  }

  return lines.join('\n');
}

async function main() {
  console.log('SEARCHING ALL RATING BRACKETS FOR SKILL-STACK PUZZLES\n');

  const combos = [
    { theme1: 'fork', theme2: 'mateIn2', validator: isValidForkToMate },
    { theme1: 'fork', theme2: 'mateIn3', validator: isValidForkToMate },
  ];

  for (const combo of combos) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`SEARCHING: ${combo.theme1} → ${combo.theme2}`);
    console.log(`${'='.repeat(70)}`);

    for (const bracket of BRACKETS) {
      console.log(`\n📂 ${bracket}:`);

      const puzzles = loadPuzzlesFromBracket(bracket, combo.theme1, 3000);
      const candidates = puzzles.filter(p => p.themes.includes(combo.theme2));

      console.log(`   Found ${candidates.length} puzzles with both tags`);

      let validCount = 0;
      const validPuzzles: RawPuzzle[] = [];

      for (const puzzle of candidates) {
        const result = combo.validator(puzzle);
        if (result.valid) {
          validCount++;
          if (validPuzzles.length < 3) {
            validPuzzles.push(puzzle);
            console.log(`\n   ✓ ${puzzle.puzzleId} (${puzzle.rating}): ${result.reason}`);
            console.log(`     URL: https://lichess.org/training/${puzzle.puzzleId}`);
            console.log(formatSolution(puzzle).split('\n').map(l => '     ' + l).join('\n'));
          }
        }
      }

      console.log(`\n   VALID: ${validCount}/${candidates.length}`);
    }
  }
}

main();
