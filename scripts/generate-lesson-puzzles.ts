/**
 * Generate static puzzle sets for each lesson
 *
 * Criteria:
 * 1. 5000+ plays (well-vetted by community)
 * 2. Matches lesson tag requirements
 * 3. Our theme analyzer confirms the primary theme matches what we're teaching
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Chess } from 'chess.js';
import { level1, LessonCriteria } from '../data/level1-curriculum';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating', '0400-0800');
const MIN_PLAYS = 2000;
const PUZZLES_PER_LESSON = 6;

// ============================================
// Theme analyzer (from lib/theme-analyzer.ts)
// ============================================

const MATE_PATTERNS = [
  'backRankMate', 'smotheredMate', 'arabianMate', 'anastasiasMate',
  'bodensMate', 'doubleBishopMate', 'hookMate', 'operaMate',
  'pillsburysMate', 'suffocationMate'
];

const ENDGAME_TYPES = ['rookEndgame', 'pawnEndgame', 'bishopEndgame', 'knightEndgame', 'queenEndgame', 'queenRookEndgame'];

function predictPrimaryTheme(themes: string[]): string {
  // Check for specific mate patterns first
  for (const pattern of MATE_PATTERNS) {
    if (themes.includes(pattern)) return pattern;
  }

  // Mate in N
  if (themes.includes('mateIn1')) return 'mateIn1';
  if (themes.includes('mateIn2')) return 'mateIn2';
  if (themes.includes('mateIn3')) return 'mateIn3';
  if (themes.includes('mateIn4')) return 'mateIn4';
  if (themes.includes('mate')) return 'mate';

  // Key tactical themes (in priority order)
  if (themes.includes('intermezzo')) return 'intermezzo';
  if (themes.includes('attraction')) return 'attraction';
  if (themes.includes('deflection')) return 'deflection';
  if (themes.includes('discoveredAttack')) return 'discoveredAttack';
  if (themes.includes('fork')) return 'fork';
  if (themes.includes('pin')) return 'pin';
  if (themes.includes('skewer')) return 'skewer';
  if (themes.includes('interference')) return 'interference';
  if (themes.includes('clearance')) return 'clearance';
  if (themes.includes('promotion')) return 'promotion';
  if (themes.includes('trappedPiece')) return 'trappedPiece';
  if (themes.includes('hangingPiece')) return 'hangingPiece';
  if (themes.includes('defensiveMove')) return 'defensiveMove';
  if (themes.includes('quietMove')) return 'quietMove';

  // Endgame types
  for (const eg of ENDGAME_TYPES) {
    if (themes.includes(eg)) return eg;
  }

  // Fallback
  if (themes.includes('endgame')) return 'endgame';
  if (themes.includes('middlegame')) return 'middlegame';
  if (themes.includes('crushing')) return 'crushing';
  if (themes.includes('advantage')) return 'advantage';

  return 'other';
}

// Get the piece that makes the first solution move
function getMovingPiece(fen: string, moves: string): string | null {
  try {
    const chess = new Chess(fen);
    const moveList = moves.split(' ');

    // Apply setup move
    const setup = moveList[0];
    chess.move({
      from: setup.slice(0, 2),
      to: setup.slice(2, 4),
      promotion: setup[4] as any
    });

    // Get first solution move piece
    if (moveList.length > 1) {
      const firstMove = moveList[1];
      const from = firstMove.slice(0, 2);
      const piece = chess.get(from as any);
      if (piece) {
        const pieceNames: Record<string, string> = {
          'p': 'pawn', 'n': 'knight', 'b': 'bishop',
          'r': 'rook', 'q': 'queen', 'k': 'king'
        };
        return pieceNames[piece.type] || null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

// ============================================
// Puzzle loading and filtering
// ============================================

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  nbPlays: number;
  themes: string[];
  url: string;
}

function loadAllPuzzles(): RawPuzzle[] {
  const themeFiles = readdirSync(PUZZLES_DIR).filter(f => f.endsWith('.csv'));
  const seenIds = new Set<string>();
  const puzzles: RawPuzzle[] = [];

  for (const file of themeFiles) {
    const content = readFileSync(join(PUZZLES_DIR, file), 'utf-8');
    const lines = content.trim().split('\n');

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length < 9) continue;

      const puzzleId = parts[0];
      const nbPlays = parseInt(parts[6], 10);

      if (seenIds.has(puzzleId) || nbPlays < MIN_PLAYS) continue;
      seenIds.add(puzzleId);

      puzzles.push({
        puzzleId,
        fen: parts[1],
        moves: parts[2],
        rating: parseInt(parts[3], 10),
        nbPlays,
        themes: parts[7].split(' '),
        url: parts[8],
      });
    }
  }

  console.log(`Loaded ${puzzles.length} puzzles with ${MIN_PLAYS}+ plays`);
  return puzzles;
}

// Check if puzzle matches lesson criteria AND our theme analyzer confirms it
function matchesLesson(puzzle: RawPuzzle, lesson: LessonCriteria): boolean {
  // Check rating range
  if (puzzle.rating < lesson.ratingMin || puzzle.rating > lesson.ratingMax) {
    return false;
  }

  // Check required tags
  for (const tag of lesson.requiredTags) {
    if (!puzzle.themes.includes(tag)) {
      return false;
    }
  }

  // Check excluded tags
  if (lesson.excludeTags) {
    for (const tag of lesson.excludeTags) {
      if (puzzle.themes.includes(tag)) {
        return false;
      }
    }
  }

  // Check piece filter
  if (lesson.pieceFilter) {
    const movingPiece = getMovingPiece(puzzle.fen, puzzle.moves);
    if (movingPiece !== lesson.pieceFilter) {
      return false;
    }
  }

  // CRITICAL: Verify our theme analyzer agrees this is the primary theme
  const predictedTheme = predictPrimaryTheme(puzzle.themes);

  // The predicted theme should match one of the required tags
  // (allowing for some flexibility - e.g., backRankMate lesson should match backRankMate or mateIn1 with backRankMate)
  const mainRequiredTag = lesson.requiredTags[0]; // Primary tag

  // Special cases for combined lessons
  if (lesson.requiredTags.includes('backRankMate')) {
    if (predictedTheme !== 'backRankMate' && !predictedTheme.startsWith('mateIn')) {
      return false;
    }
  } else if (lesson.requiredTags.includes('fork')) {
    if (predictedTheme !== 'fork') {
      return false;
    }
  } else if (lesson.requiredTags.includes('pin')) {
    if (predictedTheme !== 'pin') {
      return false;
    }
  } else if (lesson.requiredTags.includes('skewer')) {
    if (predictedTheme !== 'skewer') {
      return false;
    }
  } else if (lesson.requiredTags.includes('discoveredAttack')) {
    if (predictedTheme !== 'discoveredAttack') {
      return false;
    }
  } else if (lesson.requiredTags.includes('hangingPiece')) {
    if (predictedTheme !== 'hangingPiece') {
      return false;
    }
  } else if (lesson.requiredTags.includes('mateIn1')) {
    if (predictedTheme !== 'mateIn1' && !MATE_PATTERNS.includes(predictedTheme)) {
      return false;
    }
  } else if (lesson.requiredTags.includes('mateIn2')) {
    if (predictedTheme !== 'mateIn2' && !MATE_PATTERNS.includes(predictedTheme)) {
      return false;
    }
  } else if (lesson.requiredTags.includes('mateIn3')) {
    if (predictedTheme !== 'mateIn3' && !MATE_PATTERNS.includes(predictedTheme)) {
      return false;
    }
  } else if (lesson.requiredTags.includes('promotion')) {
    if (predictedTheme !== 'promotion') {
      return false;
    }
  } else if (lesson.requiredTags.includes('deflection')) {
    if (predictedTheme !== 'deflection') {
      return false;
    }
  } else if (lesson.requiredTags.includes('attraction')) {
    if (predictedTheme !== 'attraction') {
      return false;
    }
  } else if (MATE_PATTERNS.includes(mainRequiredTag)) {
    // Famous mate patterns - must match exactly
    if (predictedTheme !== mainRequiredTag) {
      return false;
    }
  } else if (ENDGAME_TYPES.includes(mainRequiredTag)) {
    // Endgame types - can be the type or generic endgame
    if (predictedTheme !== mainRequiredTag && predictedTheme !== 'endgame') {
      return false;
    }
  }

  return true;
}

// ============================================
// Main generation
// ============================================

interface LessonPuzzleSet {
  lessonId: string;
  lessonName: string;
  puzzleIds: string[];
  puzzleCount: number;
  criteria: {
    requiredTags: string[];
    ratingRange: string;
    pieceFilter?: string;
  };
}

async function main() {
  console.log('Loading puzzles...');
  const allPuzzles = loadAllPuzzles();

  const lessonPuzzleSets: LessonPuzzleSet[] = [];
  const allLessons = level1.modules.flatMap(m => m.lessons);

  console.log(`\nGenerating puzzle sets for ${allLessons.length} lessons...\n`);

  for (const lesson of allLessons) {
    // Find matching puzzles
    const matching = allPuzzles.filter(p => matchesLesson(p, lesson));

    // Sort by rating, then by plays (higher plays = more reliable)
    matching.sort((a, b) => {
      if (a.rating !== b.rating) return a.rating - b.rating;
      return b.nbPlays - a.nbPlays;
    });

    // Take top puzzles
    const selected = matching.slice(0, PUZZLES_PER_LESSON);

    const puzzleSet: LessonPuzzleSet = {
      lessonId: lesson.id,
      lessonName: lesson.name,
      puzzleIds: selected.map(p => p.puzzleId),
      puzzleCount: selected.length,
      criteria: {
        requiredTags: lesson.requiredTags,
        ratingRange: `${lesson.ratingMin}-${lesson.ratingMax}`,
        pieceFilter: lesson.pieceFilter,
      },
    };

    lessonPuzzleSets.push(puzzleSet);

    // Log status
    const status = selected.length >= PUZZLES_PER_LESSON
      ? '✓'
      : selected.length > 0
        ? '⚠'
        : '✗';

    console.log(
      `${status} ${lesson.id.padEnd(8)} ${lesson.name.padEnd(35)} ` +
      `${selected.length}/${PUZZLES_PER_LESSON} puzzles ` +
      `(${matching.length} matched criteria)`
    );
  }

  // Summary
  const complete = lessonPuzzleSets.filter(s => s.puzzleCount >= PUZZLES_PER_LESSON).length;
  const partial = lessonPuzzleSets.filter(s => s.puzzleCount > 0 && s.puzzleCount < PUZZLES_PER_LESSON).length;
  const empty = lessonPuzzleSets.filter(s => s.puzzleCount === 0).length;

  console.log(`\n=== SUMMARY ===`);
  console.log(`Complete (6 puzzles): ${complete}`);
  console.log(`Partial (1-5 puzzles): ${partial}`);
  console.log(`Empty (0 puzzles): ${empty}`);

  // Write output
  const outputPath = join(process.cwd(), 'data', 'lesson-puzzle-sets.json');
  writeFileSync(outputPath, JSON.stringify(lessonPuzzleSets, null, 2));
  console.log(`\nWritten to: ${outputPath}`);

  // Also generate TypeScript file for import
  const tsOutput = `// Auto-generated lesson puzzle sets
// Generated with ${MIN_PLAYS}+ plays filter and theme analyzer verification

export interface LessonPuzzleSet {
  lessonId: string;
  lessonName: string;
  puzzleIds: string[];
}

export const lessonPuzzleSets: LessonPuzzleSet[] = ${JSON.stringify(
    lessonPuzzleSets.map(s => ({
      lessonId: s.lessonId,
      lessonName: s.lessonName,
      puzzleIds: s.puzzleIds,
    })),
    null,
    2
  )};

export function getPuzzleIdsForLesson(lessonId: string): string[] {
  const set = lessonPuzzleSets.find(s => s.lessonId === lessonId);
  return set?.puzzleIds || [];
}
`;

  const tsOutputPath = join(process.cwd(), 'data', 'lesson-puzzle-sets.ts');
  writeFileSync(tsOutputPath, tsOutput);
  console.log(`Written to: ${tsOutputPath}`);
}

main();
