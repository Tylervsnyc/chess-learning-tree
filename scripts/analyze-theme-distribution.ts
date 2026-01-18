import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Chess } from 'chess.js';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating', '0400-0800');
const MIN_PLAYS = 1000;

// Theme classification logic (simplified from theme-analyzer.ts)
const MATE_PATTERNS = [
  'backRankMate', 'smotheredMate', 'arabianMate', 'anastasiasMate',
  'bodensMate', 'doubleBishopMate', 'hookMate', 'operaMate',
  'pillsburysMate', 'suffocationMate'
];

const ENDGAME_TYPES = ['rookEndgame', 'pawnEndgame', 'bishopEndgame', 'knightEndgame', 'queenEndgame', 'queenRookEndgame'];

function getPrimaryTheme(themes: string, moves: string): string {
  const themeList = themes.split(' ');

  // Check for specific mate patterns first
  for (const pattern of MATE_PATTERNS) {
    if (themeList.includes(pattern)) return pattern;
  }

  // Mate in N
  if (themeList.includes('mateIn1')) return 'mateIn1';
  if (themeList.includes('mateIn2')) return 'mateIn2';
  if (themeList.includes('mateIn3')) return 'mateIn3';
  if (themeList.includes('mateIn4')) return 'mateIn4';
  if (themeList.includes('mate')) return 'mate';

  // Key tactical themes
  if (themeList.includes('intermezzo')) return 'intermezzo';
  if (themeList.includes('attraction')) return 'attraction';
  if (themeList.includes('deflection')) return 'deflection';
  if (themeList.includes('discoveredAttack')) return 'discoveredAttack';
  if (themeList.includes('fork')) return 'fork';
  if (themeList.includes('pin')) return 'pin';
  if (themeList.includes('skewer')) return 'skewer';
  if (themeList.includes('interference')) return 'interference';
  if (themeList.includes('clearance')) return 'clearance';
  if (themeList.includes('promotion')) return 'promotion';
  if (themeList.includes('trappedPiece')) return 'trappedPiece';
  if (themeList.includes('hangingPiece')) return 'hangingPiece';
  if (themeList.includes('defensiveMove')) return 'defensiveMove';
  if (themeList.includes('quietMove')) return 'quietMove';

  // Endgame types
  for (const eg of ENDGAME_TYPES) {
    if (themeList.includes(eg)) return eg;
  }

  // Fallback categories
  if (themeList.includes('endgame')) return 'endgame';
  if (themeList.includes('middlegame')) return 'middlegame';
  if (themeList.includes('crushing')) return 'crushing';
  if (themeList.includes('advantage')) return 'advantage';

  return 'other';
}

// Analyze which piece delivers mate or does the tactic
function analyzePieceInvolved(fen: string, moves: string): string | null {
  try {
    const chess = new Chess(fen);
    const moveList = moves.split(' ');

    // Apply setup move
    const setup = moveList[0];
    chess.move({ from: setup.slice(0, 2), to: setup.slice(2, 4), promotion: setup[4] });

    // Get first solution move
    if (moveList.length > 1) {
      const firstMove = moveList[1];
      const from = firstMove.slice(0, 2);
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

async function main() {
  const themeFiles = readdirSync(PUZZLES_DIR).filter(f => f.endsWith('.csv'));

  const seenIds = new Set<string>();
  const primaryThemeCounts: Record<string, number> = {};
  const subThemeCounts: Record<string, Record<string, number>> = {};

  let totalPuzzles = 0;

  for (const file of themeFiles) {
    const content = readFileSync(join(PUZZLES_DIR, file), 'utf-8');
    const lines = content.trim().split('\n');

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length < 9) continue;

      const puzzleId = parts[0];
      const fen = parts[1];
      const moves = parts[2];
      const nbPlays = parseInt(parts[6], 10);
      const themes = parts[7];

      if (nbPlays < MIN_PLAYS) continue;
      if (seenIds.has(puzzleId)) continue;
      seenIds.add(puzzleId);

      totalPuzzles++;

      const primary = getPrimaryTheme(themes, moves);
      primaryThemeCounts[primary] = (primaryThemeCounts[primary] || 0) + 1;

      // For certain themes, track sub-categories by piece
      if (['mateIn1', 'mateIn2', 'fork', 'hangingPiece'].includes(primary)) {
        const piece = analyzePieceInvolved(fen, moves);
        if (piece) {
          if (!subThemeCounts[primary]) subThemeCounts[primary] = {};
          const subKey = `${primary}_${piece}`;
          subThemeCounts[primary][piece] = (subThemeCounts[primary][piece] || 0) + 1;
        }
      }
    }
  }

  console.log(`\n=== PRIMARY THEME DISTRIBUTION (${totalPuzzles} puzzles with ${MIN_PLAYS}+ plays) ===\n`);

  // Sort by count
  const sorted = Object.entries(primaryThemeCounts).sort((a, b) => b[1] - a[1]);

  for (const [theme, count] of sorted) {
    const pct = ((count / totalPuzzles) * 100).toFixed(1);
    console.log(`${theme.padEnd(20)} ${count.toString().padStart(6)} (${pct}%)`);

    // Show sub-breakdown if available
    if (subThemeCounts[theme]) {
      const subSorted = Object.entries(subThemeCounts[theme]).sort((a, b) => b[1] - a[1]);
      for (const [piece, subCount] of subSorted) {
        console.log(`  └─ ${piece.padEnd(16)} ${subCount.toString().padStart(6)}`);
      }
    }
  }

  console.log(`\n=== TOTAL: ${totalPuzzles} unique puzzles ===`);
}

main();
