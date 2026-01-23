/**
 * Find puzzles where a KNIGHT FORK leads to mate
 * Knight forks are more likely to be "real" forks that enable something
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { Chess, Square } from 'chess.js';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating', '0400-0800');

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string[];
}

const PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 100
};

function loadForkPuzzles(): RawPuzzle[] {
  const filePath = join(PUZZLES_DIR, 'fork.csv');
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const puzzles: RawPuzzle[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 9) continue;

    const themes = parts[7].split(' ');
    // Get puzzles with mateIn2 or mateIn3 - more moves = more chance for real fork
    if (!themes.includes('mateIn2') && !themes.includes('mateIn3')) continue;

    puzzles.push({
      puzzleId: parts[0],
      fen: parts[1],
      moves: parts[2],
      rating: parseInt(parts[3], 10),
      themes,
    });
  }
  return puzzles;
}

// Check if first move is a knight move that attacks 2+ pieces
function isKnightForkMove(chess: Chess, uci: string): {
  isFork: boolean;
  isCheck: boolean;
  targets: string[];
} {
  const from = uci.slice(0, 2) as Square;
  const to = uci.slice(2, 4) as Square;
  const piece = chess.get(from);

  if (!piece || piece.type !== 'n') {
    return { isFork: false, isCheck: false, targets: [] };
  }

  // Make the move
  const testChess = new Chess(chess.fen());
  const move = testChess.move({ from, to });
  if (!move) {
    return { isFork: false, isCheck: false, targets: [] };
  }

  const isCheck = move.san.includes('+') || move.san.includes('#');

  // Knight on 'to' square - what does it attack?
  const targets: string[] = [];
  const opponentColor = piece.color === 'w' ? 'b' : 'w';
  const knightMoves = testChess.moves({ square: to, verbose: true });

  for (const m of knightMoves) {
    const target = testChess.get(m.to as Square);
    if (target && target.color === opponentColor) {
      const value = PIECE_VALUES[target.type] || 0;
      if (value >= 3 || target.type === 'k') {
        targets.push(`${target.type.toUpperCase()}@${m.to}`);
      }
    }
  }

  return {
    isFork: targets.length >= 2,
    isCheck,
    targets
  };
}

// Analyze puzzle for knight fork pattern
function analyzePuzzle(puzzle: RawPuzzle): {
  hasKnightFork: boolean;
  forkGivesCheck: boolean;
  forkLeadsToMate: boolean;
  details: string;
} {
  const chess = new Chess(puzzle.fen);
  const moveList = puzzle.moves.split(' ');

  // Apply setup move
  const setup = moveList[0];
  chess.move({
    from: setup.slice(0, 2) as Square,
    to: setup.slice(2, 4) as Square,
    promotion: setup[4] as any
  });

  // Check first player move (index 1)
  const firstPlayerMove = moveList[1];
  if (!firstPlayerMove) {
    return { hasKnightFork: false, forkGivesCheck: false, forkLeadsToMate: false, details: 'No solution moves' };
  }

  const forkResult = isKnightForkMove(chess, firstPlayerMove);

  if (!forkResult.isFork) {
    return { hasKnightFork: false, forkGivesCheck: false, forkLeadsToMate: false, details: 'First move not a knight fork' };
  }

  // Play through solution to check for mate
  let foundMate = false;
  const testChess = new Chess(chess.fen());

  for (let i = 1; i < moveList.length; i++) {
    const uci = moveList[i];
    testChess.move({
      from: uci.slice(0, 2) as Square,
      to: uci.slice(2, 4) as Square,
      promotion: uci[4] as any
    });

    if (testChess.isCheckmate()) {
      foundMate = true;
      break;
    }
  }

  return {
    hasKnightFork: true,
    forkGivesCheck: forkResult.isCheck,
    forkLeadsToMate: foundMate,
    details: `Knight forks: ${forkResult.targets.join(', ')}${forkResult.isCheck ? ' with CHECK' : ''}${foundMate ? ' → MATE' : ''}`
  };
}

function formatSolution(puzzle: RawPuzzle): string {
  const chess = new Chess(puzzle.fen);
  const moveList = puzzle.moves.split(' ');
  const lines: string[] = [];

  // Setup
  const setup = moveList[0];
  const setupMove = chess.move({
    from: setup.slice(0, 2) as Square,
    to: setup.slice(2, 4) as Square,
    promotion: setup[4] as any
  });
  lines.push(`Setup: ${setupMove?.san}`);
  lines.push(`${chess.turn() === 'w' ? 'White' : 'Black'} to move`);

  // Solution
  for (let i = 1; i < moveList.length; i++) {
    const uci = moveList[i];
    const move = chess.move({
      from: uci.slice(0, 2) as Square,
      to: uci.slice(2, 4) as Square,
      promotion: uci[4] as any
    });
    const isPlayerMove = i % 2 === 1;
    const moveNum = Math.ceil(i / 2);
    const prefix = isPlayerMove ? `${moveNum}.` : '  ...';
    lines.push(`  ${prefix} ${move?.san}`);
  }

  return lines.join('\n');
}

async function main() {
  console.log('SEARCHING FOR KNIGHT FORK → MATE PUZZLES');
  console.log('Looking for puzzles where knight fork ENABLES the mate\n');

  const puzzles = loadForkPuzzles();
  console.log(`Loaded ${puzzles.length} fork+mate puzzles\n`);

  const validPuzzles: { puzzle: RawPuzzle; analysis: ReturnType<typeof analyzePuzzle> }[] = [];

  for (const puzzle of puzzles) {
    const analysis = analyzePuzzle(puzzle);

    if (analysis.hasKnightFork && analysis.forkGivesCheck && analysis.forkLeadsToMate) {
      validPuzzles.push({ puzzle, analysis });

      console.log(`${'─'.repeat(60)}`);
      console.log(`✓ VALID: ${puzzle.puzzleId} (Rating: ${puzzle.rating})`);
      console.log(`  Themes: ${puzzle.themes.join(', ')}`);
      console.log(`  URL: https://lichess.org/training/${puzzle.puzzleId}`);
      console.log(`  ${analysis.details}`);
      console.log('  Solution:');
      console.log(formatSolution(puzzle).split('\n').map(l => '    ' + l).join('\n'));
      console.log('');

      if (validPuzzles.length >= 10) break;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`FOUND ${validPuzzles.length} VALID Knight Fork → Mate puzzles`);
  console.log(`${'='.repeat(60)}`);

  if (validPuzzles.length > 0) {
    console.log('\nThese puzzles demonstrate:');
    console.log('  1. Knight gives fork with CHECK');
    console.log('  2. Fork forces opponent response');
    console.log('  3. Mate follows as result');
  }
}

main();
