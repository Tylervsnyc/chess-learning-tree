/**
 * Shared puzzle file loading utilities.
 *
 * Used by: /api/puzzles/clean, /api/puzzles/lesson, /api/level-test
 */

import * as fs from 'fs';
import * as path from 'path';

export interface CleanPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  popularity: number;
  nbPlays: number;
  theme: string;
  allThemes: string[];
  gameUrl: string;
}

export interface CleanPuzzleFile {
  level: number;
  ratingRange: string;
  theme: string;
  count: number;
  puzzles: CleanPuzzle[];
}

// Cache loaded files (bounded: ~8 levels × ~15 themes = ~120 max entries)
const fileCache: Record<string, CleanPuzzleFile> = {};

// Cache available themes per level
const themeListCache: Record<number, string[]> = {};

export function loadPuzzleFile(level: number, theme: string): CleanPuzzleFile | null {
  const cacheKey = `level${level}-${theme}`;

  if (fileCache[cacheKey]) {
    return fileCache[cacheKey];
  }

  const filePath = path.join(process.cwd(), 'data', 'clean-puzzles-v2', `${cacheKey}.json`);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as CleanPuzzleFile;
    fileCache[cacheKey] = data;
    return data;
  } catch {
    return null;
  }
}

export function listAvailableThemes(level: number): string[] {
  if (themeListCache[level]) {
    return themeListCache[level];
  }

  const dir = path.join(process.cwd(), 'data', 'clean-puzzles-v2');
  const prefix = `level${level}-`;

  try {
    const files = fs.readdirSync(dir).filter(f => f.startsWith(prefix) && f.endsWith('.json'));
    const themes = files.map(f => f.replace(prefix, '').replace('.json', ''));
    themeListCache[level] = themes;
    return themes;
  } catch {
    return [];
  }
}
