#!/usr/bin/env tsx
/**
 * Check Lesson Puzzles Availability
 *
 * Verifies that all lessons in the V2 curriculum have enough puzzles
 * by simulating the puzzle selection API.
 *
 * Usage:
 *   npx tsx scripts/check-lesson-puzzles.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { Chess } from 'chess.js';
import { level1V2, LessonCriteria } from '../data/staging/level1-v2-curriculum';
import { level2V2 } from '../data/staging/level2-v2-curriculum';
import { level3V2 } from '../data/staging/level3-v2-curriculum';

interface CleanPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  nbPlays: number;
  theme: string;
  allThemes: string[];
}

interface CleanPuzzleFile {
  puzzles: CleanPuzzle[];
}

// Cache loaded files
const fileCache: Record<string, CleanPuzzleFile> = {};

function loadPuzzleFile(level: number, theme: string): CleanPuzzleFile | null {
  const cacheKey = `level${level}-${theme}`;
  if (fileCache[cacheKey]) return fileCache[cacheKey];

  const filePath = path.join(process.cwd(), 'data', 'clean-puzzles-v2', `${cacheKey}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as CleanPuzzleFile;
    fileCache[cacheKey] = data;
    return data;
  } catch {
    return null;
  }
}

function getPieceType(fen: string, moves: string): string | null {
  try {
    const chess = new Chess(fen);
    const moveList = moves.split(' ');

    // Apply setup move
    const setupMove = moveList[0];
    chess.move({
      from: setupMove.slice(0, 2),
      to: setupMove.slice(2, 4),
      promotion: setupMove.length > 4 ? setupMove[4] : undefined
    });

    // Get player's first move piece
    const playerMove = moveList[1];
    if (!playerMove) return null;

    const piece = chess.get(playerMove.slice(0, 2) as any);
    return piece ? piece.type : null;
  } catch {
    return null;
  }
}

function getLevelFromRating(ratingMin: number): number {
  if (ratingMin < 800) return 1;
  if (ratingMin < 1000) return 2;
  return 3;
}

function countAvailablePuzzles(lesson: LessonCriteria): {
  available: number;
  afterFilters: number;
  details: string;
} {
  const level = getLevelFromRating(lesson.ratingMin);
  const themes = lesson.isMixedPractice
    ? (lesson.mixedThemes || [])
    : lesson.requiredTags;

  let allPuzzles: CleanPuzzle[] = [];
  const loadedThemes: string[] = [];
  const missingThemes: string[] = [];

  for (const theme of themes) {
    const data = loadPuzzleFile(level, theme);
    if (data) {
      loadedThemes.push(theme);
      allPuzzles.push(...data.puzzles);
    } else {
      missingThemes.push(theme);
    }
  }

  const totalLoaded = allPuzzles.length;

  // Apply rating filter
  allPuzzles = allPuzzles.filter(p =>
    p.rating >= lesson.ratingMin && p.rating <= lesson.ratingMax
  );

  // Apply plays filter
  const minPlays = lesson.minPlays || 1000;
  allPuzzles = allPuzzles.filter(p => p.nbPlays >= minPlays);

  // Apply exclude themes
  if (lesson.excludeTags?.length) {
    allPuzzles = allPuzzles.filter(p =>
      !lesson.excludeTags!.some(t => p.allThemes.includes(t))
    );
  }

  // Apply piece filter
  if (lesson.pieceFilter) {
    const pieceMap: Record<string, string> = {
      queen: 'q', rook: 'r', bishop: 'b', knight: 'n', pawn: 'p'
    };
    const targetPiece = pieceMap[lesson.pieceFilter];

    allPuzzles = allPuzzles.filter(p => {
      const piece = getPieceType(p.fen, p.moves);
      return piece === targetPiece;
    });
  }

  let details = '';
  if (missingThemes.length > 0) {
    details += `Missing theme files: ${missingThemes.join(', ')}. `;
  }
  if (lesson.pieceFilter && allPuzzles.length < 6) {
    details += `pieceFilter="${lesson.pieceFilter}" too restrictive. `;
  }
  if (loadedThemes.length > 0 && totalLoaded > 0 && allPuzzles.length < 6) {
    details += `Rating ${lesson.ratingMin}-${lesson.ratingMax} too narrow? `;
  }

  return {
    available: totalLoaded,
    afterFilters: allPuzzles.length,
    details: details || 'OK',
  };
}

// Main
console.log('\n🎯 LESSON PUZZLE AVAILABILITY CHECK\n');
console.log('Checking all lessons have at least 6 puzzles available...\n');

const levels = [
  { num: 1, data: level1V2 },
  { num: 2, data: level2V2 },
  { num: 3, data: level3V2 },
];

let totalLessons = 0;
let issueCount = 0;

for (const { num, data } of levels) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`LEVEL ${num}: ${data.name}`);
  console.log('='.repeat(60));

  for (const block of data.blocks) {
    for (const section of block.sections) {
      for (const lesson of section.lessons) {
        totalLessons++;
        const result = countAvailablePuzzles(lesson);

        const status = result.afterFilters >= 6 ? '✓' : '✗';
        const color = result.afterFilters >= 6 ? '' : '\x1b[31m';
        const reset = '\x1b[0m';

        if (result.afterFilters < 6) {
          issueCount++;
          console.log(`${color}${status} [${lesson.id}] ${lesson.name}${reset}`);
          console.log(`   Loaded: ${result.available} → After filters: ${result.afterFilters}`);
          console.log(`   Tags: ${lesson.requiredTags.join(', ')}`);
          if (lesson.pieceFilter) console.log(`   Piece: ${lesson.pieceFilter}`);
          console.log(`   Issue: ${result.details}`);
        }
      }
    }
  }
}

console.log(`\n${'='.repeat(60)}`);
if (issueCount === 0) {
  console.log(`🎉 All ${totalLessons} lessons have enough puzzles!`);
} else {
  console.log(`❌ ${issueCount} of ${totalLessons} lessons have puzzle availability issues`);
}
console.log('='.repeat(60) + '\n');

if (issueCount > 0) process.exit(1);
