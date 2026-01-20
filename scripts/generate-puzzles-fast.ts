/**
 * Fast puzzle generation script - selects puzzles by theme and rating
 * Embeds full puzzle data for Vercel deployment (no runtime CSV access)
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Chess } from 'chess.js';
import { level1, LessonCriteria, Level } from '../data/level1-curriculum';
import { level2 } from '../data/level2-curriculum';
import { level3 } from '../data/level3-curriculum';
import { level4 } from '../data/level4-curriculum';
import { level5 } from '../data/level5-curriculum';

const PUZZLES_BASE_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');
const MIN_PLAYS = 500;

interface LevelConfig {
  level: Level;
  puzzleBracket: string;
}

const LEVEL_CONFIGS: LevelConfig[] = [
  { level: level1, puzzleBracket: '0400-0800' },
  { level: level2, puzzleBracket: '0800-1200' },
  { level: level3, puzzleBracket: '0800-1200' },
  { level: level4, puzzleBracket: '1200-1600' },
  { level: level5, puzzleBracket: '1200-1600' },
];

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  nbPlays: number;
  themes: string[];
  url: string;
}

// Embedded puzzle format (what we save)
interface EmbeddedPuzzle {
  id: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string[];
  url: string;
}

// Cache for loaded puzzles
const puzzleCache: Map<string, RawPuzzle[]> = new Map();

function loadPuzzlesForBracket(bracket: string): RawPuzzle[] {
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

  console.log(`  Loaded ${puzzles.length} puzzles from ${bracket}`);
  puzzleCache.set(bracket, puzzles);
  return puzzles;
}

function getMovingPiece(fen: string, moves: string): string | null {
  try {
    const chess = new Chess(fen);
    const moveList = moves.split(' ');

    const setup = moveList[0];
    chess.move({
      from: setup.slice(0, 2),
      to: setup.slice(2, 4),
      promotion: setup[4] as any
    });

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

function matchesLesson(puzzle: RawPuzzle, lesson: LessonCriteria): boolean {
  if (puzzle.rating < lesson.ratingMin || puzzle.rating > lesson.ratingMax) {
    return false;
  }

  if (lesson.minPlays && puzzle.nbPlays < lesson.minPlays) {
    return false;
  }

  if (lesson.excludeTags) {
    for (const tag of lesson.excludeTags) {
      if (puzzle.themes.includes(tag)) {
        return false;
      }
    }
  }

  if (lesson.pieceFilter) {
    const movingPiece = getMovingPiece(puzzle.fen, puzzle.moves);
    if (movingPiece !== lesson.pieceFilter) {
      return false;
    }
  }

  if (lesson.isMixedPractice) {
    if (lesson.mixedThemes && lesson.mixedThemes.length > 0) {
      const hasMatchingTheme = lesson.mixedThemes.some(t => puzzle.themes.includes(t));
      if (!hasMatchingTheme) {
        return false;
      }
    }
    return true;
  }

  for (const tag of lesson.requiredTags) {
    if (!puzzle.themes.includes(tag)) {
      return false;
    }
  }

  return true;
}

function selectPuzzles(candidates: RawPuzzle[], targetElo: number): RawPuzzle[] {
  const sorted = [...candidates].sort((a, b) => a.rating - b.rating);
  const selected: RawPuzzle[] = [];
  const usedIds = new Set<string>();

  // Warmup (below target)
  const warmup = sorted.filter(p => p.rating < targetElo - 25);
  for (let i = 0; i < Math.min(2, warmup.length) && selected.length < 2; i++) {
    const idx = Math.floor(Math.random() * warmup.length);
    const puzzle = warmup[idx];
    if (!usedIds.has(puzzle.puzzleId)) {
      selected.push(puzzle);
      usedIds.add(puzzle.puzzleId);
    }
  }

  // Core (around target)
  const core = sorted.filter(p => p.rating >= targetElo - 50 && p.rating <= targetElo + 50);
  for (let i = 0; i < core.length && selected.length < 4; i++) {
    const idx = Math.floor(Math.random() * core.length);
    const puzzle = core[idx];
    if (!usedIds.has(puzzle.puzzleId)) {
      selected.push(puzzle);
      usedIds.add(puzzle.puzzleId);
    }
  }

  // Stretch (above target)
  const stretch = sorted.filter(p => p.rating > targetElo + 25);
  for (let i = 0; i < stretch.length && selected.length < 6; i++) {
    const idx = Math.floor(Math.random() * stretch.length);
    const puzzle = stretch[idx];
    if (!usedIds.has(puzzle.puzzleId)) {
      selected.push(puzzle);
      usedIds.add(puzzle.puzzleId);
    }
  }

  // Fill remaining
  const remaining = candidates.filter(p => !usedIds.has(p.puzzleId));
  for (let i = 0; i < remaining.length && selected.length < 6; i++) {
    const idx = Math.floor(Math.random() * remaining.length);
    const puzzle = remaining[idx];
    if (!usedIds.has(puzzle.puzzleId)) {
      selected.push(puzzle);
      usedIds.add(puzzle.puzzleId);
    }
  }

  return selected.sort((a, b) => a.rating - b.rating);
}

interface LessonPuzzleSet {
  lessonId: string;
  lessonName: string;
  puzzles: EmbeddedPuzzle[];
}

async function main() {
  console.log('='.repeat(60));
  console.log('FAST PUZZLE GENERATION FOR LEVELS 1-5');
  console.log('(Embedding full puzzle data for Vercel)');
  console.log('='.repeat(60));

  const allLessonPuzzleSets: LessonPuzzleSet[] = [];

  for (const config of LEVEL_CONFIGS) {
    const { level, puzzleBracket } = config;
    console.log('\n' + '='.repeat(60));
    console.log(`${level.name} (${level.ratingRange})`);
    console.log(`Bracket: ${puzzleBracket}`);
    console.log('='.repeat(60));

    const allPuzzles = loadPuzzlesForBracket(puzzleBracket);
    const lessons = level.modules.flatMap(m => m.lessons);

    console.log(`Processing ${lessons.length} lessons...\n`);

    let complete = 0, partial = 0, empty = 0;

    for (const lesson of lessons) {
      const matching = allPuzzles.filter(p => matchesLesson(p, lesson));
      const targetElo = Math.round((lesson.ratingMin + lesson.ratingMax) / 2);

      if (matching.length === 0) {
        allLessonPuzzleSets.push({
          lessonId: lesson.id,
          lessonName: lesson.name,
          puzzles: [],
        });
        console.log(`✗ ${lesson.id.padEnd(8)} ${lesson.name.padEnd(40)} 0/6 (no matches)`);
        empty++;
        continue;
      }

      const selected = selectPuzzles(matching, targetElo);

      // Convert to embedded format (full data, no nbPlays)
      const embeddedPuzzles: EmbeddedPuzzle[] = selected.map(p => ({
        id: p.puzzleId,
        fen: p.fen,
        moves: p.moves,
        rating: p.rating,
        themes: p.themes,
        url: p.url,
      }));

      allLessonPuzzleSets.push({
        lessonId: lesson.id,
        lessonName: lesson.name,
        puzzles: embeddedPuzzles,
      });

      const status = selected.length >= 6 ? '✓' : selected.length > 0 ? '⚠' : '✗';
      const ratingRange = selected.length > 0
        ? `[${Math.min(...selected.map(p => p.rating))}-${Math.max(...selected.map(p => p.rating))}]`
        : '';

      console.log(
        `${status} ${lesson.id.padEnd(8)} ${lesson.name.padEnd(40)} ` +
        `${selected.length}/6 (${matching.length} candidates) ${ratingRange}`
      );

      if (selected.length >= 6) complete++;
      else if (selected.length > 0) partial++;
      else empty++;
    }

    console.log(`\n${level.name} Summary: ${complete} complete, ${partial} partial, ${empty} empty`);
  }

  // Write output with full puzzle data
  const tsOutput = `// Auto-generated lesson puzzle sets with FULL puzzle data
// Generated with ${MIN_PLAYS}+ plays filter
// This file contains all puzzle data embedded for Vercel deployment

export interface EmbeddedPuzzle {
  id: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string[];
  url: string;
}

export interface LessonPuzzleSet {
  lessonId: string;
  lessonName: string;
  puzzles: EmbeddedPuzzle[];
}

export const lessonPuzzleSets: LessonPuzzleSet[] = ${JSON.stringify(allLessonPuzzleSets, null, 2)};

export function getPuzzlesForLesson(lessonId: string): EmbeddedPuzzle[] {
  const set = lessonPuzzleSets.find(s => s.lessonId === lessonId);
  return set?.puzzles || [];
}

export function getLessonInfo(lessonId: string): { name: string } | null {
  const set = lessonPuzzleSets.find(s => s.lessonId === lessonId);
  return set ? { name: set.lessonName } : null;
}
`;

  const outputPath = join(process.cwd(), 'data', 'lesson-puzzle-sets.ts');
  writeFileSync(outputPath, tsOutput);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Written to: ${outputPath}`);

  const totalComplete = allLessonPuzzleSets.filter(s => s.puzzles.length >= 6).length;
  const totalPartial = allLessonPuzzleSets.filter(s => s.puzzles.length > 0 && s.puzzles.length < 6).length;
  const totalEmpty = allLessonPuzzleSets.filter(s => s.puzzles.length === 0).length;
  const totalPuzzles = allLessonPuzzleSets.reduce((sum, s) => sum + s.puzzles.length, 0);

  console.log(`\nFINAL SUMMARY:`);
  console.log(`  Total lessons: ${allLessonPuzzleSets.length}`);
  console.log(`  Complete (6 puzzles): ${totalComplete}`);
  console.log(`  Partial (1-5 puzzles): ${totalPartial}`);
  console.log(`  Empty (0 puzzles): ${totalEmpty}`);
  console.log(`  Total puzzles assigned: ${totalPuzzles}`);
}

main();
