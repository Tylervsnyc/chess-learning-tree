import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { analyzePuzzle, selectLessonPuzzles, PuzzleAnalysis, SlotAssignment } from '@/lib/theme-analyzer';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  nbPlays: number;
  themes: string[];
  url: string;
}

function loadPuzzlesFromBracket(bracket: string, theme?: string, limit = 100): RawPuzzle[] {
  const bracketDir = join(PUZZLES_DIR, bracket);
  if (!existsSync(bracketDir)) return [];

  const files = theme
    ? [`${theme}.csv`]
    : readdirSync(bracketDir).filter(f => f.endsWith('.csv'));

  const puzzles: RawPuzzle[] = [];
  const seenIds = new Set<string>();

  for (const file of files) {
    const filePath = join(bracketDir, file);
    if (!existsSync(filePath)) continue;

    const content = readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');

    for (let i = 1; i < lines.length && puzzles.length < limit; i++) {
      const parts = lines[i].split(',');
      if (parts.length < 9) continue;

      const puzzleId = parts[0];
      if (seenIds.has(puzzleId)) continue;
      seenIds.add(puzzleId);

      puzzles.push({
        puzzleId,
        fen: parts[1],
        moves: parts[2],
        rating: parseInt(parts[3], 10),
        nbPlays: parseInt(parts[6], 10),
        themes: parts[7].split(' '),
        url: parts[8],
      });
    }
  }

  return puzzles;
}

function findPuzzleById(puzzleId: string): RawPuzzle | null {
  const brackets = ['0400-0800', '0800-1200', '1200-1600', '1600-2000', '2000-plus'];

  for (const bracket of brackets) {
    const bracketDir = join(PUZZLES_DIR, bracket);
    if (!existsSync(bracketDir)) continue;

    const files = readdirSync(bracketDir).filter(f => f.endsWith('.csv'));

    for (const file of files) {
      const content = readFileSync(join(bracketDir, file), 'utf-8');
      const lines = content.trim().split('\n');

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length < 9) continue;
        if (parts[0] === puzzleId) {
          return {
            puzzleId: parts[0],
            fen: parts[1],
            moves: parts[2],
            rating: parseInt(parts[3], 10),
            nbPlays: parseInt(parts[6], 10),
            themes: parts[7].split(' '),
            url: parts[8],
          };
        }
      }
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'single';

  try {
    // Mode 1: Analyze a single puzzle by ID
    if (mode === 'single') {
      const puzzleId = searchParams.get('puzzleId');
      if (!puzzleId) {
        return NextResponse.json({ error: 'puzzleId required' }, { status: 400 });
      }

      const puzzle = findPuzzleById(puzzleId);
      if (!puzzle) {
        return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 });
      }

      const analysis = analyzePuzzle(
        puzzle.puzzleId,
        puzzle.fen,
        puzzle.moves,
        puzzle.rating,
        puzzle.themes.join(' '),
        puzzle.url
      );

      return NextResponse.json({ puzzle, analysis });
    }

    // Mode 2: Generate 6-puzzle lesson arc
    if (mode === 'lesson') {
      const bracket = searchParams.get('bracket') || '0400-0800';
      const theme = searchParams.get('theme') || 'fork';
      const targetElo = parseInt(searchParams.get('targetElo') || '500', 10);
      const minPlays = parseInt(searchParams.get('minPlays') || '2000', 10);

      // Load candidate puzzles
      const allPuzzles = loadPuzzlesFromBracket(bracket, theme, 500);
      const filtered = allPuzzles.filter(p => p.nbPlays >= minPlays);

      if (filtered.length === 0) {
        return NextResponse.json({
          error: 'No puzzles found matching criteria',
          candidates: 0,
        }, { status: 404 });
      }

      // Prepare for selectLessonPuzzles
      const candidates = filtered.map(p => ({
        puzzleId: p.puzzleId,
        fen: p.fen,
        moves: p.moves,
        rating: p.rating,
        themes: p.themes.join(' '),
        url: p.url,
      }));

      // Run the lesson selection algorithm
      const lessonArc = selectLessonPuzzles(candidates, targetElo);

      return NextResponse.json({
        targetElo,
        bracket,
        theme,
        candidateCount: filtered.length,
        lessonArc,
      });
    }

    // Mode 3: Analyze multiple puzzles (for comparison)
    if (mode === 'batch') {
      const bracket = searchParams.get('bracket') || '0400-0800';
      const theme = searchParams.get('theme');
      const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

      const puzzles = loadPuzzlesFromBracket(bracket, theme || undefined, limit);

      const analyzed = puzzles.map(p => {
        const analysis = analyzePuzzle(
          p.puzzleId,
          p.fen,
          p.moves,
          p.rating,
          p.themes.join(' '),
          p.url
        );
        return {
          puzzleId: p.puzzleId,
          lichessRating: p.rating,
          trueDifficulty: analysis.trueDifficultyScore,
          recommendedSlot: analysis.recommendedSlot,
          difficultyFactors: analysis.difficultyFactors,
          executingPiece: analysis.executingPiece,
          solutionOutcome: analysis.solutionOutcome,
          difficultyReasoning: analysis.difficultyReasoning,
        };
      });

      // Sort by true difficulty
      analyzed.sort((a, b) => a.trueDifficulty - b.trueDifficulty);

      return NextResponse.json({
        bracket,
        theme: theme || 'all',
        count: analyzed.length,
        puzzles: analyzed,
      });
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({
      error: 'Analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
