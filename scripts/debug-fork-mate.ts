/**
 * Debug why fork → mate puzzles are failing validation
 * Let's look at a few examples in detail
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Chess, Square, Move } from 'chess.js';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating', '0400-0800');

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string[];
}

// Piece values
const PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 100
};

function loadForkPuzzles(): RawPuzzle[] {
  const filePath = join(PUZZLES_DIR, 'fork.csv');
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const puzzles: RawPuzzle[] = [];

  for (let i = 1; i < lines.length && puzzles.length < 100; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 9) continue;

    const themes = parts[7].split(' ');
    // Only get puzzles with mateIn2
    if (!themes.includes('mateIn2')) continue;

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

// Get all squares a piece attacks
function getAttackedSquares(chess: Chess, square: Square): Square[] {
  const attacked: Square[] = [];
  const moves = chess.moves({ square, verbose: true });
  for (const move of moves) {
    attacked.push(move.to as Square);
  }
  return attacked;
}

// Detailed fork analysis
function analyzeFork(chess: Chess, from: Square, to: Square): {
  isFork: boolean;
  targets: { square: Square; piece: string; value: number }[];
  reasoning: string;
} {
  const targets: { square: Square; piece: string; value: number }[] = [];
  const movingPiece = chess.get(from);

  if (!movingPiece) {
    return { isFork: false, targets: [], reasoning: 'No piece on from square' };
  }

  // Make the move
  const testChess = new Chess(chess.fen());
  const move = testChess.move({ from, to });
  if (!move) {
    return { isFork: false, targets: [], reasoning: 'Invalid move' };
  }

  // Get attacked squares after the move
  const attackedSquares = getAttackedSquares(testChess, to);
  const opponentColor = movingPiece.color === 'w' ? 'b' : 'w';

  for (const sq of attackedSquares) {
    const piece = testChess.get(sq);
    if (piece && piece.color === opponentColor) {
      const value = PIECE_VALUES[piece.type] || 0;
      if (value >= 3 || piece.type === 'k') {
        targets.push({
          square: sq,
          piece: piece.type.toUpperCase(),
          value
        });
      }
    }
  }

  const isFork = targets.length >= 2;
  const reasoning = isFork
    ? `${movingPiece.type.toUpperCase()} on ${to} attacks ${targets.map(t => `${t.piece}@${t.square}`).join(', ')}`
    : targets.length === 1
      ? `Only attacks 1 target: ${targets[0].piece}@${targets[0].square}`
      : 'No valuable targets attacked';

  return { isFork, targets, reasoning };
}

function debugPuzzle(puzzle: RawPuzzle): void {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Puzzle: ${puzzle.puzzleId} (Rating: ${puzzle.rating})`);
  console.log(`Themes: ${puzzle.themes.join(', ')}`);
  console.log(`URL: https://lichess.org/training/${puzzle.puzzleId}`);

  const chess = new Chess(puzzle.fen);
  const moveList = puzzle.moves.split(' ');

  // Apply setup move
  const setupUci = moveList[0];
  const setupMove = chess.move({
    from: setupUci.slice(0, 2) as Square,
    to: setupUci.slice(2, 4) as Square,
    promotion: setupUci[4] as any
  });
  console.log(`\nSetup: ${setupMove?.san || setupUci}`);
  console.log(`Player: ${chess.turn() === 'w' ? 'White' : 'Black'} to move`);

  // Analyze each player move
  console.log('\nSolution analysis:');

  for (let i = 1; i < moveList.length; i++) {
    const uci = moveList[i];
    const from = uci.slice(0, 2) as Square;
    const to = uci.slice(2, 4) as Square;

    const isPlayerMove = i % 2 === 1;
    const moveNum = Math.ceil(i / 2);
    const prefix = isPlayerMove ? `  ${moveNum}.` : '     ...';

    if (isPlayerMove) {
      // Check for fork BEFORE making the move
      const forkAnalysis = analyzeFork(chess, from, to);

      const move = chess.move({ from, to, promotion: uci[4] as any });
      const isCheck = move?.san.includes('+') || move?.san.includes('#');
      const isCapture = !!move?.captured;
      const isMate = chess.isCheckmate();

      console.log(`${prefix} ${move?.san}`);
      console.log(`       Fork: ${forkAnalysis.isFork ? 'YES' : 'NO'} - ${forkAnalysis.reasoning}`);
      if (isCheck) console.log('       → Gives CHECK');
      if (isCapture) console.log(`       → CAPTURES ${move?.captured?.toUpperCase()}`);
      if (isMate) console.log('       → CHECKMATE!');
    } else {
      const move = chess.move({ from, to, promotion: uci[4] as any });
      console.log(`${prefix} ${move?.san}`);
    }
  }

  // Conclusion
  console.log('\nConclusion:');
  let foundFork = false;
  let forkMoveNum = 0;
  let mateMoveNum = 0;

  const chess2 = new Chess(puzzle.fen);
  chess2.move({ from: moveList[0].slice(0, 2) as Square, to: moveList[0].slice(2, 4) as Square, promotion: moveList[0][4] as any });

  for (let i = 1; i < moveList.length; i++) {
    const uci = moveList[i];
    const isPlayerMove = i % 2 === 1;

    if (isPlayerMove) {
      const from = uci.slice(0, 2) as Square;
      const to = uci.slice(2, 4) as Square;

      if (!foundFork) {
        const forkAnalysis = analyzeFork(chess2, from, to);
        if (forkAnalysis.isFork) {
          foundFork = true;
          forkMoveNum = Math.ceil(i / 2);
        }
      }

      chess2.move({ from, to, promotion: uci[4] as any });

      if (chess2.isCheckmate()) {
        mateMoveNum = Math.ceil(i / 2);
      }
    } else {
      const from = uci.slice(0, 2) as Square;
      const to = uci.slice(2, 4) as Square;
      chess2.move({ from, to, promotion: uci[4] as any });
    }
  }

  if (foundFork && mateMoveNum > 0 && forkMoveNum < mateMoveNum) {
    console.log(`✓ VALID: Fork on move ${forkMoveNum}, mate on move ${mateMoveNum}`);
  } else if (foundFork) {
    console.log(`⚠ Fork found on move ${forkMoveNum}, but mate on move ${mateMoveNum} (fork not enabling)`);
  } else if (mateMoveNum > 0) {
    console.log(`✗ Mate on move ${mateMoveNum}, but NO FORK DETECTED - incidental tag`);
  } else {
    console.log(`✗ Neither fork nor mate detected properly`);
  }
}

async function main() {
  console.log('DEBUGGING FORK → MATE PUZZLES');
  console.log('Looking at why these puzzles fail validation\n');

  const puzzles = loadForkPuzzles();
  console.log(`Found ${puzzles.length} fork+mateIn2 puzzles to analyze`);

  // Debug first 10
  for (const puzzle of puzzles.slice(0, 10)) {
    debugPuzzle(puzzle);
  }
}

main();
