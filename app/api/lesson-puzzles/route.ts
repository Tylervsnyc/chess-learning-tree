import { NextRequest, NextResponse } from 'next/server';
import { Chess } from 'chess.js';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import lessonData from '@/data/lesson-puzzle-sets.json';
import puzzleData from '@/data/lesson-puzzles-full.json';
import { getLessonWithContext, getPuzzleDirsForLesson } from '@/lib/curriculum-registry';
import { processPuzzleFromCSV, RawPuzzleCSV } from '@/lib/puzzle-utils';

// ============================================================================
// PUZZLE CACHE - Prevents re-reading large CSV files on every request
// ============================================================================
interface CachedPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string[];
}

interface PuzzleCache {
  puzzles: CachedPuzzle[];
  loadedAt: number;
}

// In-memory cache for parsed puzzle files (keyed by directory)
const puzzleFileCache = new Map<string, PuzzleCache>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Load and cache all puzzles from a directory.
 * Returns cached data if available and not expired.
 */
function loadPuzzlesFromDirectory(dir: string): CachedPuzzle[] {
  const cached = puzzleFileCache.get(dir);
  const now = Date.now();

  // Return cached data if still valid
  if (cached && (now - cached.loadedAt) < CACHE_TTL_MS) {
    return cached.puzzles;
  }

  if (!existsSync(dir)) return [];

  const puzzles: CachedPuzzle[] = [];
  const files = readdirSync(dir).filter(f => f.endsWith('.csv'));

  for (const file of files) {
    try {
      const content = readFileSync(join(dir, file), 'utf-8');
      const lines = content.trim().split('\n');

      // Skip header, parse each line
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length < 9) continue;

        puzzles.push({
          puzzleId: parts[0],
          fen: parts[1],
          moves: parts[2],
          rating: parseInt(parts[3], 10),
          themes: parts[7].split(' '),
        });
      }
    } catch (err) {
      console.error(`Failed to parse puzzle file ${file}:`, err);
    }
  }

  // Cache the parsed data
  puzzleFileCache.set(dir, { puzzles, loadedAt: now });
  console.log(`Cached ${puzzles.length} puzzles from ${dir}`);

  return puzzles;
}
// ============================================================================

interface LessonInfo {
  lessonId: string;
  lessonName: string;
  puzzleIds: string[];
  puzzleCount: number;
}

// Type the puzzle data
const puzzleMap = puzzleData as Record<string, RawPuzzleCSV>;

// Get lesson info from the JSON data
function getLessonInfo(lessonId: string): LessonInfo | null {
  const lesson = (lessonData as LessonInfo[]).find(l => l.lessonId === lessonId);
  return lesson || null;
}

// Dynamic puzzle loading for v2 curriculum
const PUZZLES_BASE_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');

interface PuzzleWithMeta extends RawPuzzleCSV {
  sacrificePiece?: string;
  gamePhase?: string;
  matePattern?: string;
}

function loadDynamicPuzzles(
  puzzleDir: string,
  requiredTags: string[],
  excludeTags: string[],
  ratingMin: number,
  ratingMax: number,
  isMixedPractice: boolean,
  mixedThemes: string[],
  pieceFilter: string | undefined,
  count: number
): RawPuzzleCSV[] {
  const filterMap: Record<string, string> = { queen: 'q', rook: 'r', bishop: 'b', knight: 'n', pawn: 'p' };
  const pieceNames: Record<string, string> = { q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };

  // Load puzzles from the appropriate directory based on lesson level
  const fullPuzzleDir = join(PUZZLES_BASE_DIR, puzzleDir);
  const allPuzzles = loadPuzzlesFromDirectory(fullPuzzleDir);
  if (allPuzzles.length === 0) return [];

  // Filter puzzles based on criteria
  const matchingPuzzles: PuzzleWithMeta[] = [];
  const targetCount = Math.max(count * 10, 60);

  // Shuffle indices for random selection
  const indices = Array.from({ length: allPuzzles.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  for (const idx of indices) {
    if (matchingPuzzles.length >= targetCount) break;

    const puzzle = allPuzzles[idx];
    const { rating, themes, fen, moves } = puzzle;

    // Rating filter
    if (rating < ratingMin || rating > ratingMax) continue;

    // Theme filter
    if (isMixedPractice && mixedThemes.length > 0) {
      if (!mixedThemes.some(t => themes.includes(t))) continue;
    } else if (requiredTags.length > 0) {
      if (!requiredTags.every(t => themes.includes(t))) continue;
    }

    // Exclude tags
    if (excludeTags.length > 0 && excludeTags.some(t => themes.includes(t))) continue;

    // Determine metadata for diversity
    let sacrificePiece: string | undefined;
    let gamePhase: string | undefined;
    let matePattern: string | undefined;

    // Game phase
    if (themes.includes('endgame')) gamePhase = 'endgame';
    else if (themes.includes('middlegame')) gamePhase = 'middlegame';
    else if (themes.includes('opening')) gamePhase = 'opening';

    // Mate pattern
    if (themes.includes('backRankMate')) matePattern = 'backRank';
    else if (themes.includes('smotheredMate')) matePattern = 'smothered';
    else if (themes.includes('arabianMate')) matePattern = 'arabian';
    else matePattern = 'other';

    // Get the piece making the first move (for sacrifice diversity)
    // Only do this expensive check if we need piece filtering
    if (pieceFilter) {
      try {
        const chess = new Chess(fen);
        const moveList = moves.split(' ');
        chess.move({
          from: moveList[0].slice(0, 2),
          to: moveList[0].slice(2, 4),
          promotion: moveList[0][4] as 'q' | 'r' | 'b' | 'n' | undefined,
        });
        if (moveList[1]) {
          const from = moveList[1].slice(0, 2);
          const piece = chess.get(from as any);
          if (piece) {
            sacrificePiece = pieceNames[piece.type];
            if (piece.type !== filterMap[pieceFilter]) continue;
          }
        }
      } catch {
        continue;
      }
    }

    matchingPuzzles.push({
      puzzleId: puzzle.puzzleId,
      fen: puzzle.fen,
      moves: puzzle.moves,
      rating: puzzle.rating,
      themes: puzzle.themes,
      url: `https://lichess.org/training/${puzzle.puzzleId}`,
      sacrificePiece,
      gamePhase,
      matePattern,
    });
  }

  // Apply diversity selection
  const selected = selectDiversePuzzles(matchingPuzzles, count);

  // Strip metadata before returning
  return selected.map(({ sacrificePiece, gamePhase, matePattern, ...puzzle }) => puzzle);
}

// Select puzzles with maximum diversity across different dimensions
function selectDiversePuzzles(puzzles: PuzzleWithMeta[], count: number): PuzzleWithMeta[] {
  if (puzzles.length <= count) return puzzles;

  const selected: PuzzleWithMeta[] = [];
  const usedPatterns = new Set<string>();
  const usedPieces = new Set<string>();
  const usedPhases = new Set<string>();

  // Shuffle first
  const shuffled = puzzles.sort(() => Math.random() - 0.5);

  // First pass: try to get maximum diversity
  for (const puzzle of shuffled) {
    if (selected.length >= count) break;

    const patternKey = puzzle.matePattern || 'unknown';
    const pieceKey = puzzle.sacrificePiece || 'unknown';
    const phaseKey = puzzle.gamePhase || 'unknown';

    // Calculate diversity score (prefer puzzles that add new dimensions)
    const isNewPattern = !usedPatterns.has(patternKey);
    const isNewPiece = !usedPieces.has(pieceKey);
    const isNewPhase = !usedPhases.has(phaseKey);

    // In first pass, prioritize puzzles that add new variety
    if (selected.length < count / 2) {
      // First half: strongly prefer diversity
      if (isNewPattern || isNewPiece || isNewPhase) {
        selected.push(puzzle);
        usedPatterns.add(patternKey);
        usedPieces.add(pieceKey);
        usedPhases.add(phaseKey);
      }
    } else {
      // Second half: accept any that aren't exact duplicates
      const diversityKey = `${patternKey}-${pieceKey}`;
      if (!selected.some(p => `${p.matePattern}-${p.sacrificePiece}` === diversityKey)) {
        selected.push(puzzle);
        usedPatterns.add(patternKey);
        usedPieces.add(pieceKey);
        usedPhases.add(phaseKey);
      }
    }
  }

  // If we still need more, just add remaining
  if (selected.length < count) {
    for (const puzzle of shuffled) {
      if (selected.length >= count) break;
      if (!selected.includes(puzzle)) {
        selected.push(puzzle);
      }
    }
  }

  return selected.sort(() => Math.random() - 0.5);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lessonId = searchParams.get('lessonId');
  const count = parseInt(searchParams.get('count') || '6', 10);

  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId required' }, { status: 400 });
  }

  // Try to find lesson in the curriculum registry (all levels)
  const context = getLessonWithContext(lessonId);

  if (context) {
    const { lesson, section, block, levelConfig } = context;
    const puzzleDirs = getPuzzleDirsForLesson(lessonId);

    // Try each puzzle directory in order until we find puzzles
    for (const puzzleDir of puzzleDirs) {
      try {
        const rawPuzzles = loadDynamicPuzzles(
          puzzleDir,
          lesson.requiredTags || [],
          lesson.excludeTags || [],
          lesson.ratingMin,
          lesson.ratingMax,
          lesson.isMixedPractice || false,
          lesson.mixedThemes || [],
          lesson.pieceFilter,
          count
        );

        if (rawPuzzles.length > 0) {
          const puzzles = rawPuzzles.map(p => processPuzzleFromCSV(p)).filter(Boolean);

          return NextResponse.json({
            lessonId,
            lessonName: lesson.name,
            lessonDescription: lesson.description,
            sectionName: section.name,
            blockName: block.name,
            levelName: levelConfig.data.name,
            isReview: section.isReview || false,
            puzzles,
            puzzleCount: puzzles.length,
            isDynamic: true,
            puzzleDir, // Which folder the puzzles came from
          });
        }
        // No puzzles in this folder, try next one
        console.log(`No puzzles found in ${puzzleDir} for ${lessonId}, trying next folder...`);
      } catch (error) {
        console.log(`Puzzle loading failed from ${puzzleDir} for ${lessonId}:`, error);
      }
    }

    // If we tried all folders and found nothing, log a warning
    console.warn(`No puzzles found in any folder for lesson ${lessonId}. Tried: ${puzzleDirs.join(', ')}`);
  }

  // Fall back to original v1 curriculum (legacy static puzzles)
  const lessonInfo = getLessonInfo(lessonId);
  if (!lessonInfo) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  // Load puzzles from the embedded JSON data
  const rawPuzzles: RawPuzzleCSV[] = [];
  for (const puzzleId of lessonInfo.puzzleIds || []) {
    const puzzle = puzzleMap[puzzleId];
    if (puzzle) {
      rawPuzzles.push(puzzle);
    }
  }

  if (rawPuzzles.length === 0) {
    return NextResponse.json({
      error: 'Puzzles not yet generated for this lesson',
      lessonId,
      lessonName: lessonInfo.lessonName,
      needsGeneration: true,
    }, { status: 404 });
  }

  try {
    // Process into lesson format
    const puzzles = rawPuzzles.map(p => processPuzzleFromCSV(p)).filter(Boolean);

    return NextResponse.json({
      lessonId,
      lessonName: lessonInfo.lessonName,
      lessonDescription: '',
      puzzles,
      puzzleCount: puzzles.length,
      isStatic: true,
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error}` }, { status: 500 });
  }
}
