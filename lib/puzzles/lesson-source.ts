/**
 * Where a lesson's 6 puzzles come from.
 *
 * On the web that's GET /api/puzzles/lesson, which reads 173,691 puzzles off the
 * server's disk. Inside the offline app there is no server, so the identical
 * selection runs on-device against the bundled pack — same lib/puzzle-selector,
 * same criteria, same response shape.
 *
 * Both paths return the same object so the lesson page doesn't care which ran.
 */
import { IS_OFFLINE_APP } from '@/lib/config/offline';
import { selectPuzzlesForLesson, type Puzzle } from '@/lib/puzzle-selector';
import { loadPackFile } from './pack-client';

export interface LessonPuzzlesResult {
  puzzles?: Puzzle[];
  error?: string;
}

/** Same mapping as app/api/puzzles/lesson/route.ts — level is derived from ratingMin. */
function levelFromRating(ratingMin: number): number {
  if (ratingMin < 800) return 1;
  if (ratingMin < 1000) return 2;
  if (ratingMin < 1200) return 3;
  if (ratingMin < 1400) return 4;
  if (ratingMin < 1600) return 5;
  if (ratingMin < 1800) return 6;
  if (ratingMin < 2000) return 7;
  return 8;
}

async function selectOnDevice(params: URLSearchParams): Promise<LessonPuzzlesResult> {
  const themesParam = params.get('themes');
  if (!themesParam) return { error: 'Missing required parameter: themes' };

  const themes = themesParam.split(',').map((t) => t.trim());
  const ratingMin = parseInt(params.get('ratingMin') || '400');
  const ratingMax = parseInt(params.get('ratingMax') || '800');
  const level = levelFromRating(ratingMin);

  const files = await Promise.all(themes.map((t) => loadPackFile(level, t)));
  const candidates = files.flat();

  if (candidates.length === 0) {
    return { error: `No puzzles found for themes: ${themes.join(', ')}` };
  }

  const result = selectPuzzlesForLesson(candidates, {
    themes,
    isMixedPractice: params.get('mixed') === 'true',
    excludeThemes: params.get('excludeThemes')?.split(',').map((t) => t.trim()),
    ratingMin,
    ratingMax,
    minPlays: parseInt(params.get('minPlays') || '1000'),
    pieceFilter: (params.get('pieceFilter') as never) || undefined,
    excludePuzzleIds: params.get('excludeIds')?.split(',').map((id) => id.trim()),
  });

  return { puzzles: result.puzzles };
}

export async function fetchLessonPuzzles(params: URLSearchParams): Promise<LessonPuzzlesResult> {
  if (IS_OFFLINE_APP) return selectOnDevice(params);

  try {
    const response = await fetch(`/api/puzzles/lesson?${params}`);
    const data = await response.json();
    if (!response.ok) return { error: data.error || 'Failed to load puzzles' };
    return { puzzles: data.puzzles };
  } catch {
    return { error: 'Failed to load puzzles' };
  }
}
