/**
 * Generate static puzzle sets for each lesson
 *
 * Selection Funnel:
 * 1. Load all puzzles from CSV files (2000+ plays minimum)
 * 2. Filter by lesson criteria (rating range, tags, piece filter)
 * 3. Verify primary theme matches using theme analyzer
 * 4. Run difficulty analysis on candidates
 * 5. Select optimal 6-puzzle arc using selectLessonPuzzles()
 *    - Slot 1-2: Warmup (easy, obvious patterns)
 *    - Slot 3-4: Core (at-level challenge)
 *    - Slot 5-6: Stretch (harder, boss level finish)
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Chess } from 'chess.js';
import { level1, LessonCriteria, Level } from '../data/level1-curriculum';
import { level2 } from '../data/level2-curriculum';
import { level3 } from '../data/level3-curriculum';
import { level4 } from '../data/level4-curriculum';
import { level5 } from '../data/level5-curriculum';
import {
  analyzePuzzle,
  selectLessonPuzzles,
  PuzzleAnalysis,
  SlotAssignment,
} from '../lib/theme-analyzer';

const PUZZLES_BASE_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');
const MIN_PLAYS = 1000; // Lowered for higher levels which have fewer puzzles
const PUZZLES_PER_LESSON = 6;

// Map each level to its puzzle bracket
interface LevelConfig {
  level: Level;
  puzzleBracket: string;
}

const LEVEL_CONFIGS: LevelConfig[] = [
  { level: level1, puzzleBracket: '0400-0800' },
  { level: level2, puzzleBracket: '0800-1200' },
  { level: level3, puzzleBracket: '0800-1200' }, // Level 3 (1000-1200) uses 0800-1200 bracket
  { level: level4, puzzleBracket: '1200-1600' },
  { level: level5, puzzleBracket: '1200-1600' }, // Level 5 (1400-1600) uses 1200-1600 bracket
];

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

  // Mate in N (in order of specificity)
  if (themes.includes('mateIn1')) return 'mateIn1';
  if (themes.includes('mateIn2')) return 'mateIn2';
  if (themes.includes('mateIn3')) return 'mateIn3';
  if (themes.includes('mateIn4')) return 'mateIn4';
  if (themes.includes('mateIn5')) return 'mateIn5';
  if (themes.includes('mate')) return 'mate';

  // Key tactical themes (in priority order)
  if (themes.includes('intermezzo')) return 'intermezzo';
  if (themes.includes('xRayAttack')) return 'xRayAttack';
  if (themes.includes('doubleCheck')) return 'doubleCheck';
  if (themes.includes('discoveredCheck')) return 'discoveredCheck';
  if (themes.includes('attraction')) return 'attraction';
  if (themes.includes('deflection')) return 'deflection';
  if (themes.includes('discoveredAttack')) return 'discoveredAttack';
  if (themes.includes('exposedKing')) return 'exposedKing';
  if (themes.includes('fork')) return 'fork';
  if (themes.includes('pin')) return 'pin';
  if (themes.includes('skewer')) return 'skewer';
  if (themes.includes('interference')) return 'interference';
  if (themes.includes('clearance')) return 'clearance';
  if (themes.includes('advancedPawn')) return 'advancedPawn';
  if (themes.includes('promotion')) return 'promotion';
  if (themes.includes('trappedPiece')) return 'trappedPiece';
  if (themes.includes('hangingPiece')) return 'hangingPiece';
  if (themes.includes('defensiveMove')) return 'defensiveMove';
  if (themes.includes('quietMove')) return 'quietMove';
  if (themes.includes('sacrifice')) return 'sacrifice';

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

// Get a signature of the player's first move: "piece-destinationSquare"
// e.g., "knight-e4" or "queen-h7"
// Used to ensure variety - no consecutive puzzles with same piece to same square
function getFirstMoveSignature(fen: string, moves: string): string | null {
  try {
    const chess = new Chess(fen);
    const moveList = moves.split(' ');

    // Apply setup move (opponent's last move)
    const setup = moveList[0];
    chess.move({
      from: setup.slice(0, 2),
      to: setup.slice(2, 4),
      promotion: setup[4] as any
    });

    // Get first solution move
    if (moveList.length > 1) {
      const firstMove = moveList[1];
      const from = firstMove.slice(0, 2);
      const to = firstMove.slice(2, 4);
      const piece = chess.get(from as any);
      if (piece) {
        const pieceNames: Record<string, string> = {
          'p': 'pawn', 'n': 'knight', 'b': 'bishop',
          'r': 'rook', 'q': 'queen', 'k': 'king'
        };
        return `${pieceNames[piece.type]}-${to}`;
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

// Cache for loaded puzzles by bracket
const puzzleCache: Map<string, RawPuzzle[]> = new Map();

function loadPuzzlesForBracket(bracket: string): RawPuzzle[] {
  // Return cached if available
  if (puzzleCache.has(bracket)) {
    return puzzleCache.get(bracket)!;
  }

  const puzzlesDir = join(PUZZLES_BASE_DIR, bracket);
  const themeFiles = readdirSync(puzzlesDir).filter(f => f.endsWith('.csv'));
  const seenIds = new Set<string>();
  const puzzles: RawPuzzle[] = [];

  for (const file of themeFiles) {
    const content = readFileSync(join(puzzlesDir, file), 'utf-8');
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

  console.log(`  Loaded ${puzzles.length} puzzles from ${bracket} with ${MIN_PLAYS}+ plays`);
  puzzleCache.set(bracket, puzzles);
  return puzzles;
}

// Check if puzzle matches lesson criteria AND our theme analyzer confirms it
function matchesLesson(puzzle: RawPuzzle, lesson: LessonCriteria): boolean {
  // Check rating range
  if (puzzle.rating < lesson.ratingMin || puzzle.rating > lesson.ratingMax) {
    return false;
  }

  // Check minimum plays (for high-quality "best move" lessons)
  if (lesson.minPlays && puzzle.nbPlays < lesson.minPlays) {
    return false;
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

  // MIXED PRACTICE: Skip theme validation, just check mixedThemes if provided
  if (lesson.isMixedPractice) {
    // If mixedThemes specified, puzzle must have at least one
    if (lesson.mixedThemes && lesson.mixedThemes.length > 0) {
      const hasMatchingTheme = lesson.mixedThemes.some(t => puzzle.themes.includes(t));
      if (!hasMatchingTheme) {
        return false;
      }
    }
    // Mixed practice passes without theme validation
    return true;
  }

  // Check required tags (for themed lessons)
  for (const tag of lesson.requiredTags) {
    if (!puzzle.themes.includes(tag)) {
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
  } else if (lesson.requiredTags.includes('mateIn4')) {
    if (predictedTheme !== 'mateIn4' && !MATE_PATTERNS.includes(predictedTheme)) {
      return false;
    }
  } else if (lesson.requiredTags.includes('mateIn5')) {
    if (predictedTheme !== 'mateIn5' && !MATE_PATTERNS.includes(predictedTheme)) {
      return false;
    }
  } else if (lesson.requiredTags.includes('intermezzo')) {
    if (predictedTheme !== 'intermezzo') {
      return false;
    }
  } else if (lesson.requiredTags.includes('quietMove')) {
    if (predictedTheme !== 'quietMove') {
      return false;
    }
  } else if (lesson.requiredTags.includes('defensiveMove')) {
    if (predictedTheme !== 'defensiveMove') {
      return false;
    }
  } else if (lesson.requiredTags.includes('exposedKing')) {
    if (predictedTheme !== 'exposedKing') {
      return false;
    }
  } else if (lesson.requiredTags.includes('trappedPiece')) {
    if (predictedTheme !== 'trappedPiece') {
      return false;
    }
  } else if (lesson.requiredTags.includes('advancedPawn')) {
    if (predictedTheme !== 'advancedPawn' && predictedTheme !== 'promotion') {
      return false;
    }
  } else if (lesson.requiredTags.includes('xRayAttack')) {
    if (predictedTheme !== 'xRayAttack') {
      return false;
    }
  } else if (lesson.requiredTags.includes('interference')) {
    if (predictedTheme !== 'interference') {
      return false;
    }
  } else if (lesson.requiredTags.includes('clearance')) {
    if (predictedTheme !== 'clearance') {
      return false;
    }
  } else if (lesson.requiredTags.includes('doubleCheck')) {
    if (predictedTheme !== 'doubleCheck' && predictedTheme !== 'discoveredAttack') {
      return false;
    }
  } else if (lesson.requiredTags.includes('discoveredCheck')) {
    if (predictedTheme !== 'discoveredCheck' && predictedTheme !== 'discoveredAttack') {
      return false;
    }
  } else if (lesson.requiredTags.includes('sacrifice')) {
    // Sacrifice is often combined with other themes, be more lenient
    if (!puzzle.themes.includes('sacrifice')) {
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

interface PuzzleSlotInfo {
  puzzleId: string;
  slot: 1 | 2 | 3 | 4 | 5 | 6;
  lichessRating: number;
  trueDifficulty: number;
  executingPiece: string | null;
  solutionOutcome: string;
}

interface LessonPuzzleSet {
  lessonId: string;
  lessonName: string;
  targetElo: number;
  puzzles: PuzzleSlotInfo[];
  puzzleCount: number;
  criteria: {
    requiredTags: string[];
    ratingRange: string;
    pieceFilter?: string;
  };
}

async function main() {
  console.log('='.repeat(60));
  console.log('GENERATING PUZZLE SETS FOR LEVELS 1-5');
  console.log('='.repeat(60));
  console.log('\nUsing 6-puzzle lesson arc with difficulty analysis:');
  console.log('  Slot 1-2: Warmup  (obvious patterns, confidence builders)');
  console.log('  Slot 3-4: Core    (at-level challenges)');
  console.log('  Slot 5-6: Stretch (harder puzzles, boss level finish)\n');

  const lessonPuzzleSets: LessonPuzzleSet[] = [];

  // Process each level
  for (const config of LEVEL_CONFIGS) {
    const { level, puzzleBracket } = config;
    console.log('\n' + '='.repeat(60));
    console.log(`LEVEL: ${level.name} (${level.ratingRange})`);
    console.log(`Puzzle Bracket: ${puzzleBracket}`);
    console.log('='.repeat(60));

    // Load puzzles for this bracket
    const allPuzzles = loadPuzzlesForBracket(puzzleBracket);
    const allLessons = level.modules.flatMap(m => m.lessons);

    console.log(`Processing ${allLessons.length} lessons...\n`);

    for (const lesson of allLessons) {
      // Step 1: Filter by lesson criteria
      const matching = allPuzzles.filter(p => matchesLesson(p, lesson));

      if (matching.length === 0) {
        lessonPuzzleSets.push({
          lessonId: lesson.id,
          lessonName: lesson.name,
          targetElo: Math.round((lesson.ratingMin + lesson.ratingMax) / 2),
          puzzles: [],
          puzzleCount: 0,
          criteria: {
            requiredTags: lesson.requiredTags,
            ratingRange: `${lesson.ratingMin}-${lesson.ratingMax}`,
            pieceFilter: lesson.pieceFilter,
          },
        });
        console.log(`✗ ${lesson.id.padEnd(8)} ${lesson.name.padEnd(35)} 0/${PUZZLES_PER_LESSON} (no matches)`);
        continue;
      }

      // Step 2: Prepare candidates for difficulty analysis
      const candidates = matching.map(p => ({
        puzzleId: p.puzzleId,
        fen: p.fen,
        moves: p.moves,
        rating: p.rating,
        themes: p.themes.join(' '),
        url: p.url,
      }));

      // Step 3: Target ELO for this lesson (midpoint of range)
      const targetElo = Math.round((lesson.ratingMin + lesson.ratingMax) / 2);

      // Step 4: Select optimal 6-puzzle arc using difficulty analysis
      const slotAssignments = selectLessonPuzzles(candidates, targetElo);

      // Step 5: Build puzzle set with slot info
      const puzzles: PuzzleSlotInfo[] = slotAssignments.map(sa => ({
        puzzleId: sa.puzzleId,
        slot: sa.slot,
        lichessRating: sa.analysis.rating,
        trueDifficulty: sa.analysis.trueDifficultyScore,
        executingPiece: sa.analysis.executingPiece,
        solutionOutcome: sa.analysis.solutionOutcome,
      }));

      const puzzleSet: LessonPuzzleSet = {
        lessonId: lesson.id,
        lessonName: lesson.name,
        targetElo,
        puzzles,
        puzzleCount: puzzles.length,
        criteria: {
          requiredTags: lesson.requiredTags,
          ratingRange: `${lesson.ratingMin}-${lesson.ratingMax}`,
          pieceFilter: lesson.pieceFilter,
        },
      };

      lessonPuzzleSets.push(puzzleSet);

      // Log status with difficulty info
      const status = puzzles.length >= PUZZLES_PER_LESSON
        ? '✓'
        : puzzles.length > 0
          ? '⚠'
          : '✗';

      const diffRange = puzzles.length > 0
        ? `[${Math.min(...puzzles.map(p => p.trueDifficulty))}-${Math.max(...puzzles.map(p => p.trueDifficulty))}]`
        : '';

      console.log(
        `${status} ${lesson.id.padEnd(8)} ${lesson.name.padEnd(35)} ` +
        `${puzzles.length}/${PUZZLES_PER_LESSON} ` +
        `(${matching.length} candidates) ` +
        `${diffRange}`
      );
    }
  } // End of level config loop

  // Summary
  const complete = lessonPuzzleSets.filter(s => s.puzzleCount >= PUZZLES_PER_LESSON).length;
  const partial = lessonPuzzleSets.filter(s => s.puzzleCount > 0 && s.puzzleCount < PUZZLES_PER_LESSON).length;
  const empty = lessonPuzzleSets.filter(s => s.puzzleCount === 0).length;

  console.log(`\n=== SUMMARY ===`);
  console.log(`Complete (6 puzzles): ${complete}`);
  console.log(`Partial (1-5 puzzles): ${partial}`);
  console.log(`Empty (0 puzzles): ${empty}`);

  // Write JSON output (with full difficulty data)
  const outputPath = join(process.cwd(), 'data', 'lesson-puzzle-sets.json');
  writeFileSync(outputPath, JSON.stringify(lessonPuzzleSets, null, 2));
  console.log(`\nWritten to: ${outputPath}`);

  // Generate TypeScript file for import (simpler format for runtime use)
  const tsOutput = `// Auto-generated lesson puzzle sets
// Generated with difficulty analysis and 6-puzzle lesson arc
// Slot 1-2: Warmup | Slot 3-4: Core | Slot 5-6: Stretch

export interface PuzzleSlot {
  puzzleId: string;
  slot: 1 | 2 | 3 | 4 | 5 | 6;
  trueDifficulty: number;
}

export interface LessonPuzzleSet {
  lessonId: string;
  lessonName: string;
  targetElo: number;
  puzzles: PuzzleSlot[];
}

export const lessonPuzzleSets: LessonPuzzleSet[] = ${JSON.stringify(
    lessonPuzzleSets.map(s => ({
      lessonId: s.lessonId,
      lessonName: s.lessonName,
      targetElo: s.targetElo,
      puzzles: s.puzzles.map(p => ({
        puzzleId: p.puzzleId,
        slot: p.slot,
        trueDifficulty: p.trueDifficulty,
      })),
    })),
    null,
    2
  )};

export function getPuzzlesForLesson(lessonId: string): PuzzleSlot[] {
  const set = lessonPuzzleSets.find(s => s.lessonId === lessonId);
  return set?.puzzles || [];
}

export function getPuzzleIdsForLesson(lessonId: string): string[] {
  return getPuzzlesForLesson(lessonId).map(p => p.puzzleId);
}
`;

  const tsOutputPath = join(process.cwd(), 'data', 'lesson-puzzle-sets.ts');
  writeFileSync(tsOutputPath, tsOutput);
  console.log(`Written to: ${tsOutputPath}`);

  // Print sample lesson arc for verification
  const sampleLesson = lessonPuzzleSets.find(s => s.puzzleCount === 6);
  if (sampleLesson) {
    console.log(`\n=== SAMPLE LESSON ARC: ${sampleLesson.lessonName} ===`);
    console.log(`Target ELO: ${sampleLesson.targetElo}\n`);
    console.log('Slot  Puzzle ID   Lichess  TrueDiff  Piece   Outcome');
    console.log('----  ----------  -------  --------  ------  --------');
    for (const p of sampleLesson.puzzles) {
      const slotLabel = p.slot <= 2 ? 'Warm' : p.slot <= 4 ? 'Core' : 'Strch';
      console.log(
        `${p.slot} ${slotLabel}  ${p.puzzleId.padEnd(10)}  ${String(p.lichessRating).padEnd(7)}  ${String(p.trueDifficulty).padEnd(8)}  ${(p.executingPiece || '?').padEnd(6)}  ${p.solutionOutcome}`
      );
    }
  }
}

main();
