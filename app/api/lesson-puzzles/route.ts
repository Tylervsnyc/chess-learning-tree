import { NextRequest, NextResponse } from 'next/server';
import { Chess } from 'chess.js';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import lessonData from '@/data/lesson-puzzle-sets.json';
import puzzleData from '@/data/lesson-puzzles-full.json';
import { level1v2 } from '@/data/staging/level1-curriculum-v2';
import { level1Ends } from '@/data/staging/level1-ends-only';

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

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string[];
  url: string;
}

interface LessonPuzzle {
  puzzleId: string;
  fen: string;
  puzzleFen: string;
  moves: string;
  rating: number;
  themes: string[];
  url: string;
  setupMove: string;
  lastMoveFrom: string;
  lastMoveTo: string;
  solution: string;
  solutionMoves: string[];
  playerColor: 'white' | 'black';
}

// Type the puzzle data
const puzzleMap = puzzleData as Record<string, RawPuzzle>;

// Get lesson info from the JSON data
function getLessonInfo(lessonId: string): LessonInfo | null {
  const lesson = (lessonData as LessonInfo[]).find(l => l.lessonId === lessonId);
  return lesson || null;
}

// Process raw puzzle into lesson format
function processPuzzle(raw: RawPuzzle): LessonPuzzle {
  const chess = new Chess(raw.fen);
  const moveList = raw.moves.split(' ');

  // Apply setup move
  const setupUci = moveList[0];
  const lastMoveFrom = setupUci.slice(0, 2);
  const lastMoveTo = setupUci.slice(2, 4);

  const setupResult = chess.move({
    from: lastMoveFrom,
    to: lastMoveTo,
    promotion: setupUci[4] as 'q' | 'r' | 'b' | 'n' | undefined
  });

  const setupMove = setupResult?.san || setupUci;
  const puzzleFen = chess.fen();
  const playerColor = chess.turn() === 'w' ? 'white' : 'black';

  // Get solution in SAN
  const solutionMoves: string[] = [];
  for (let i = 1; i < moveList.length; i++) {
    const uci = moveList[i];
    const result = chess.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci[4] as 'q' | 'r' | 'b' | 'n' | undefined
    });
    if (result) {
      solutionMoves.push(result.san);
    }
  }

  // Format solution with move numbers
  const solution = formatSolution(solutionMoves, playerColor === 'black');

  return {
    puzzleId: raw.puzzleId,
    fen: raw.fen,
    puzzleFen,
    moves: raw.moves,
    rating: raw.rating,
    themes: raw.themes,
    url: raw.url,
    setupMove,
    lastMoveFrom,
    lastMoveTo,
    solution,
    solutionMoves,
    playerColor,
  };
}

function formatSolution(moves: string[], startsAsBlack: boolean): string {
  if (moves.length === 0) return '';
  const parts: string[] = [];
  let moveNum = 1;
  let isWhiteMove = !startsAsBlack;

  for (let i = 0; i < moves.length; i++) {
    const san = moves[i];
    if (isWhiteMove) {
      parts.push(`${moveNum}.${san}`);
    } else {
      if (i === 0 && startsAsBlack) {
        parts.push(`${moveNum}...${san}`);
      } else {
        parts.push(san);
      }
      moveNum++;
    }
    isWhiteMove = !isWhiteMove;
  }
  return parts.join(' ');
}

// Dynamic puzzle loading for v2 curriculum
const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating', '0400-0800');

interface PuzzleWithMeta extends RawPuzzle {
  sacrificePiece?: string;
  gamePhase?: string;
  matePattern?: string;
}

function loadDynamicPuzzles(
  requiredTags: string[],
  excludeTags: string[],
  ratingMin: number,
  ratingMax: number,
  isMixedPractice: boolean,
  mixedThemes: string[],
  pieceFilter: string | undefined,
  count: number
): RawPuzzle[] {
  const filterMap: Record<string, string> = { queen: 'q', rook: 'r', bishop: 'b', knight: 'n', pawn: 'p' };
  const pieceNames: Record<string, string> = { q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };

  // Load puzzles from cache (fast after first request)
  const allPuzzles = loadPuzzlesFromDirectory(PUZZLES_DIR);
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

// Find lesson in v2 curriculum (Module structure)
function getV2LessonInfo(lessonId: string) {
  for (const mod of level1v2.modules) {
    const lesson = mod.lessons.find(l => l.id === lessonId);
    if (lesson) return { lesson, module: mod };
  }
  return null;
}

// Find lesson in level1Ends curriculum (Block → Section → Lesson structure)
function getEndsLessonInfo(lessonId: string) {
  for (const block of level1Ends.blocks) {
    for (const section of block.sections) {
      const lesson = section.lessons.find(l => l.id === lessonId);
      if (lesson) return { lesson, section, block };
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lessonId = searchParams.get('lessonId');
  const count = parseInt(searchParams.get('count') || '6', 10);
  const curriculumVersion = searchParams.get('curriculumVersion');

  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId required' }, { status: 400 });
  }

  // Check for level1Ends curriculum first (Block → Section → Lesson)
  // Try dynamic loading, but fall through to static data if it fails
  if (lessonId.startsWith('1.')) {
    const endsInfo = getEndsLessonInfo(lessonId);
    if (endsInfo) {
      const { lesson, section, block } = endsInfo;

      try {
        const rawPuzzles = loadDynamicPuzzles(
          lesson.requiredTags || [],
          lesson.excludeTags || [],
          lesson.ratingMin,
          lesson.ratingMax,
          lesson.isMixedPractice || false,
          lesson.mixedThemes || [],
          lesson.pieceFilter,
          count
        );

        // Only return if we actually found puzzles, otherwise fall through to static data
        if (rawPuzzles.length > 0) {
          const puzzles = rawPuzzles.map(processPuzzle);

          return NextResponse.json({
            lessonId,
            lessonName: lesson.name,
            lessonDescription: lesson.description,
            sectionName: section.name,
            blockName: block.name,
            isReview: section.isReview || false,
            puzzles,
            puzzleCount: puzzles.length,
            isDynamic: true,
          });
        }
        // If no puzzles found, fall through to static data below
      } catch (error) {
        // Log error but don't fail - fall through to static data
        console.log(`Dynamic puzzle loading failed for ${lessonId}, falling back to static data:`, error);
      }
    }
  }

  // Check for v2 curriculum (Module structure) - only if not already handled above
  if (curriculumVersion === 'v2') {
    const v2Info = getV2LessonInfo(lessonId);
    if (v2Info) {
      const { lesson, module } = v2Info;

      try {
        const rawPuzzles = loadDynamicPuzzles(
          lesson.requiredTags || [],
          lesson.excludeTags || [],
          lesson.ratingMin,
          lesson.ratingMax,
          lesson.isMixedPractice || false,
          lesson.mixedThemes || [],
          lesson.pieceFilter,
          count
        );

        // Only return if we actually found puzzles
        if (rawPuzzles.length > 0) {
          const puzzles = rawPuzzles.map(processPuzzle);

          return NextResponse.json({
            lessonId,
            lessonName: lesson.name,
            lessonDescription: lesson.description,
            moduleName: module.name,
            moduleType: module.themeType,
            puzzles,
            puzzleCount: puzzles.length,
            isDynamic: true,
          });
        }
        // Fall through to static data
      } catch (error) {
        console.log(`V2 puzzle loading failed for ${lessonId}, falling back to static data:`, error);
      }
    }
  }

  // Fall back to original v1 curriculum
  const lessonInfo = getLessonInfo(lessonId);
  if (!lessonInfo) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  // Load puzzles from the embedded JSON data
  const rawPuzzles: RawPuzzle[] = [];
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
    const puzzles = rawPuzzles.map(processPuzzle);

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
