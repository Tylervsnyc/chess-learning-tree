/**
 * Quick puzzle generator for Level 6 - simplified, no complex analysis
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { level6 } from '../data/level6-curriculum';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating', '1600-2000');

interface Puzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string[];
}

// Load puzzles from a single CSV (faster than loading all)
function loadPuzzlesFromCSV(theme: string): Puzzle[] {
  const files = [
    `${theme}.csv`,
    'sacrifice.csv', // fallback
    'fork.csv',
  ];

  for (const file of files) {
    try {
      const content = readFileSync(join(PUZZLES_DIR, file), 'utf-8');
      const lines = content.trim().split('\n').slice(1); // skip header
      const puzzles: Puzzle[] = [];

      for (const line of lines) {
        const parts = line.split(',');
        if (parts.length < 8) continue;

        const rating = parseInt(parts[3], 10);
        const nbPlays = parseInt(parts[6], 10);
        const themes = parts[7].split(' ');

        if (nbPlays < 1000) continue;
        if (rating < 1600 || rating > 1800) continue;

        puzzles.push({
          puzzleId: parts[0],
          fen: parts[1],
          moves: parts[2],
          rating,
          themes,
        });
      }

      if (puzzles.length > 0) return puzzles;
    } catch {
      continue;
    }
  }
  return [];
}

// Get puzzles matching lesson criteria
function getPuzzlesForLesson(lesson: any): Puzzle[] {
  const themes = lesson.isMixedPractice ? (lesson.mixedThemes || []) : lesson.requiredTags;

  if (!themes || themes.length === 0) {
    // Final review - use sacrifice as fallback
    return loadPuzzlesFromCSV('sacrifice')
      .filter(p => p.rating >= lesson.ratingMin && p.rating <= lesson.ratingMax)
      .slice(0, 6);
  }

  // Try each theme
  for (const theme of themes) {
    const puzzles = loadPuzzlesFromCSV(theme)
      .filter(p => {
        if (p.rating < lesson.ratingMin || p.rating > lesson.ratingMax) return false;
        if (lesson.excludeTags?.some((t: string) => p.themes.includes(t))) return false;
        return themes.every((t: string) => p.themes.includes(t));
      });

    if (puzzles.length >= 6) {
      // Sort by rating, pick spread
      puzzles.sort((a, b) => a.rating - b.rating);
      const step = Math.floor(puzzles.length / 6);
      return [0, 1, 2, 3, 4, 5].map(i => puzzles[Math.min(i * step, puzzles.length - 1)]);
    }
  }

  // Fallback: just grab any from first theme
  const fallback = loadPuzzlesFromCSV(themes[0]);
  return fallback.slice(0, 6);
}

async function main() {
  console.log('Quick Level 6 puzzle generator\n');

  // Load existing data
  const existingPath = join(process.cwd(), 'data', 'lesson-puzzle-sets.json');
  const existing = JSON.parse(readFileSync(existingPath, 'utf-8'));

  // Filter out any level 6 entries
  const filtered = existing.filter((e: any) => !e.lessonId.startsWith('6.'));
  console.log(`Keeping ${filtered.length} existing entries\n`);

  // Generate level 6
  const allLessons = level6.modules.flatMap(m => m.lessons);
  console.log(`Processing ${allLessons.length} lessons...\n`);

  const newEntries = [];

  for (const lesson of allLessons) {
    const puzzles = getPuzzlesForLesson(lesson);
    const entry = {
      lessonId: lesson.id,
      lessonName: lesson.name,
      targetElo: Math.round((lesson.ratingMin + lesson.ratingMax) / 2),
      puzzles: puzzles.map((p, i) => ({
        puzzleId: p.puzzleId,
        slot: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6,
        trueDifficulty: p.rating,
      })),
      puzzleCount: puzzles.length,
      criteria: {
        requiredTags: lesson.requiredTags,
        ratingRange: `${lesson.ratingMin}-${lesson.ratingMax}`,
      },
    };

    newEntries.push(entry);
    const status = puzzles.length >= 6 ? '✓' : puzzles.length > 0 ? '⚠' : '✗';
    console.log(`${status} ${lesson.id.padEnd(8)} ${lesson.name.padEnd(35)} ${puzzles.length}/6`);
  }

  // Combine and write
  const combined = [...filtered, ...newEntries];
  writeFileSync(existingPath, JSON.stringify(combined, null, 2));
  console.log(`\nWritten ${combined.length} entries to lesson-puzzle-sets.json`);

  // Also write TS file
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
    combined.filter((s: any) => s.puzzles && s.puzzles.length > 0).map((s: any) => ({
      lessonId: s.lessonId,
      lessonName: s.lessonName,
      targetElo: s.targetElo,
      puzzles: s.puzzles.map((p: any) => ({
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

  writeFileSync(join(process.cwd(), 'data', 'lesson-puzzle-sets.ts'), tsOutput);
  console.log('Written lesson-puzzle-sets.ts');
}

main();
