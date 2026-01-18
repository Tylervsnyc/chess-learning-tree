import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Chess } from 'chess.js';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating', '0400-0800');
const MIN_PLAYS = 500;

interface ForkPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  nbPlays: number;
  themes: string[];
  url: string;
  category: string;
  forkingPiece: string | null;
}

function getForkingPiece(fen: string, moves: string): string | null {
  try {
    const chess = new Chess(fen);
    const moveList = moves.split(' ');

    // Apply setup move
    const setup = moveList[0];
    chess.move({ from: setup.slice(0, 2), to: setup.slice(2, 4), promotion: setup[4] });

    // Get first solution move (the forking move)
    if (moveList.length > 1) {
      const forkMove = moveList[1];
      const from = forkMove.slice(0, 2);
      const piece = chess.get(from as any);
      if (piece) {
        const pieceNames: Record<string, string> = {
          'p': 'pawn', 'n': 'knight', 'b': 'bishop', 'r': 'rook', 'q': 'queen', 'k': 'king'
        };
        return pieceNames[piece.type] || null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function categorizeForkPuzzle(themes: string[]): string {
  // Fork for mate
  if (themes.includes('mateIn1')) return 'fork-for-mate-in-1';
  if (themes.includes('mateIn2')) return 'fork-for-mate-in-2';
  if (themes.includes('mateIn3') || themes.includes('mateIn4')) return 'fork-for-mate-in-3+';
  if (themes.includes('backRankMate')) return 'fork-for-back-rank-mate';
  if (themes.some(t => t.includes('Mate'))) return 'fork-for-mate-pattern';
  if (themes.includes('mate')) return 'fork-for-mate';

  // Fork + other tactics
  if (themes.includes('pin')) return 'fork-with-pin';
  if (themes.includes('skewer')) return 'fork-with-skewer';
  if (themes.includes('discoveredAttack')) return 'fork-discovered-attack';
  if (themes.includes('deflection')) return 'fork-deflection';
  if (themes.includes('attraction')) return 'fork-attraction';
  if (themes.includes('promotion')) return 'fork-for-promotion';
  if (themes.includes('trappedPiece')) return 'fork-traps-piece';

  // Fork defensive
  if (themes.includes('defensiveMove')) return 'defensive-fork';

  // Pure fork wins material
  if (themes.includes('crushing') || themes.includes('advantage')) return 'fork-wins-material';

  if (themes.includes('hangingPiece')) return 'fork-hanging-piece';

  return 'fork-other';
}

async function main() {
  const seenIds = new Set<string>();
  const categories: Record<string, ForkPuzzle[]> = {};
  const pieceCategories: Record<string, Record<string, number>> = {};

  // Read from fork.csv
  const forkFile = join(PUZZLES_DIR, 'fork.csv');
  const content = readFileSync(forkFile, 'utf-8');
  const lines = content.trim().split('\n');

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 9) continue;

    const puzzleId = parts[0];
    const nbPlays = parseInt(parts[6], 10);

    if (nbPlays < MIN_PLAYS) continue;
    if (seenIds.has(puzzleId)) continue;
    seenIds.add(puzzleId);

    const fen = parts[1];
    const moves = parts[2];
    const themes = parts[7].split(' ');
    const category = categorizeForkPuzzle(themes);
    const forkingPiece = getForkingPiece(fen, moves);

    const puzzle: ForkPuzzle = {
      puzzleId,
      fen,
      moves,
      rating: parseInt(parts[3], 10),
      nbPlays,
      themes,
      url: parts[8],
      category,
      forkingPiece
    };

    if (!categories[category]) categories[category] = [];
    categories[category].push(puzzle);

    // Track by piece
    if (forkingPiece) {
      if (!pieceCategories[category]) pieceCategories[category] = {};
      pieceCategories[category][forkingPiece] = (pieceCategories[category][forkingPiece] || 0) + 1;
    }
  }

  console.log(`\n=== FORK PUZZLE CATEGORIES (${MIN_PLAYS}+ plays, 400-800 rating) ===\n`);

  const sorted = Object.entries(categories).sort((a, b) => b[1].length - a[1].length);

  let total = 0;
  for (const [category, puzzles] of sorted) {
    console.log(`${category.padEnd(30)} ${puzzles.length.toString().padStart(5)} puzzles`);
    total += puzzles.length;

    // Show piece breakdown
    if (pieceCategories[category]) {
      const pieceSorted = Object.entries(pieceCategories[category]).sort((a, b) => b[1] - a[1]);
      for (const [piece, count] of pieceSorted) {
        console.log(`  └─ ${piece.padEnd(10)} ${count}`);
      }
    }

    console.log(`  Avg rating: ${Math.round(puzzles.reduce((sum, p) => sum + p.rating, 0) / puzzles.length)}`);
    console.log('');
  }

  console.log(`=== TOTAL FORK PUZZLES: ${total} ===`);

  // Also show overall piece breakdown
  console.log(`\n=== FORK BY PIECE (all categories) ===\n`);
  const allPieces: Record<string, number> = {};
  for (const cat of Object.values(pieceCategories)) {
    for (const [piece, count] of Object.entries(cat)) {
      allPieces[piece] = (allPieces[piece] || 0) + count;
    }
  }
  const pieceSorted = Object.entries(allPieces).sort((a, b) => b[1] - a[1]);
  for (const [piece, count] of pieceSorted) {
    console.log(`${piece.padEnd(10)} ${count}`);
  }
}

main();
