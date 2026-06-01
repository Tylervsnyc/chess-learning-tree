import { NextRequest, NextResponse } from 'next/server';
import {
  Puzzle,
  LessonSelectionCriteria,
  selectPuzzlesForLesson,
} from '@/lib/puzzle-selector';
import { CleanPuzzle, loadPuzzleFile } from '@/lib/puzzle-file-loader';
import { buildSchedule } from '@/lib/workout/schedule';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/workout/puzzles?minutes=16
 *
 * Returns an ordered list of puzzles that RAMP from ~800 ELO up to ~2000 ELO,
 * for use in the Interval Workout's chess segments. Difficulty climbs as the
 * user works through the queue.
 *
 * Mirrors /api/puzzles/lesson: loads `level{N}-{theme}.json` files via
 * loadPuzzleFile and selects with selectPuzzlesForLesson (which caps at ~6 per
 * call). We call it once per band per theme and concatenate the bands in
 * ascending ELO order.
 */

// Mirror of getLevelFromRating in /api/puzzles/lesson.
function getLevelFromRating(ratingMin: number): number {
  if (ratingMin < 800) return 1;
  if (ratingMin < 1000) return 2;
  if (ratingMin < 1200) return 3;
  if (ratingMin < 1400) return 4;
  if (ratingMin < 1600) return 5;
  if (ratingMin < 1800) return 6;
  if (ratingMin < 2000) return 7;
  return 8;
}

function transformToPuzzle(p: CleanPuzzle): Puzzle {
  return {
    id: p.puzzleId,
    fen: p.fen,
    moves: p.moves.split(' '),
    rating: p.rating,
    popularity: p.popularity,
    plays: p.nbPlays,
    theme: p.theme,
    themes: p.allThemes,
    url: `https://lichess.org/training/${p.puzzleId}`,
  };
}

// ELO bands, ascending. Each maps to a level file via getLevelFromRating(min).
const BANDS: { min: number; max: number }[] = [
  { min: 800, max: 1000 },
  { min: 1000, max: 1200 },
  { min: 1200, max: 1400 },
  { min: 1400, max: 1600 },
  { min: 1600, max: 1800 },
  { min: 1800, max: 2000 },
];

// Common tactical themes that exist across all the levels we use.
const THEMES = ['fork', 'pin', 'skewer', 'hangingPiece', 'discoveredAttack', 'mateIn2'];

export async function GET(request: NextRequest) {
  const minutes = parseInt(request.nextUrl.searchParams.get('minutes') || '16');
  const safeMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : 16;

  // Estimate how many puzzles we need. Difficulty is adaptive (it can drop on a
  // wrong answer, so the user may revisit a band), so we over-provision: ~20 per
  // chess segment. A 32-min session = 4 chess segments → ~80 puzzles.
  const schedule = buildSchedule(safeMinutes);
  const chessSegments = schedule.filter((s) => s.kind === 'chess').length || 1;
  const targetCount = Math.min(120, Math.max(40, chessSegments * 20));

  // How many puzzles to take from each band so the ramp spans the bands evenly.
  const perBand = Math.ceil(targetCount / BANDS.length);

  // Puzzles this user has already been served in past workouts. We exclude
  // these so every session feels fresh. Anonymous users (or a DB read failure)
  // get an empty set — i.e. the original, repeat-allowing behavior.
  const excludeHistory = new Set<string>();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: seenRows } = await supabase
        .from('workout_seen_puzzles')
        .select('puzzle_id')
        .eq('user_id', user.id);
      for (const row of seenRows ?? []) {
        if (typeof row.puzzle_id === 'string') excludeHistory.add(row.puzzle_id);
      }
    }
  } catch (err) {
    console.error('workout puzzles: seen-set read failed', err);
  }

  const orderedPuzzles: Puzzle[] = [];
  const seen = new Set<string>();

  for (const band of BANDS) {
    const level = getLevelFromRating(band.min);
    const bandPool: Puzzle[] = [];

    // Load each theme file for this level and gather candidates.
    for (const theme of THEMES) {
      const data = loadPuzzleFile(level, theme);
      if (data) {
        bandPool.push(...data.puzzles.map(transformToPuzzle));
      }
    }

    if (bandPool.length === 0) continue;

    // selectPuzzlesForLesson caps at ~6, so call it per theme until we have
    // enough for this band, then sort the band ascending by rating.
    const bandSelected: Puzzle[] = [];

    // Fill the band, excluding the user's history. If history exhausts the
    // band (far-future: thousands of puzzles seen), do a second pass that
    // allows repeats so the queue is never short — a stale puzzle beats a gap.
    const fillBand = (allowRepeats: boolean) => {
      for (const theme of THEMES) {
        if (bandSelected.length >= perBand) break;

        const criteria: LessonSelectionCriteria = {
          themes: [theme],
          isMixedPractice: false,
          ratingMin: band.min,
          ratingMax: band.max,
          minPlays: 1000,
          excludePuzzleIds: [
            ...seen,
            ...bandSelected.map((p) => p.id),
            ...(allowRepeats ? [] : excludeHistory),
          ],
        };

        const result = selectPuzzlesForLesson(bandPool, criteria);
        for (const p of result.puzzles) {
          if (seen.has(p.id) || bandSelected.some((s) => s.id === p.id)) continue;
          bandSelected.push(p);
        }
      }
    };

    fillBand(false);
    if (bandSelected.length < perBand && excludeHistory.size > 0) {
      console.warn(
        `workout puzzles: band ${band.min}-${band.max} ran dry after history ` +
          `exclusion (${bandSelected.length}/${perBand}); allowing repeats`,
      );
      fillBand(true);
    }

    // Ascending within the band so difficulty climbs smoothly.
    bandSelected.sort((a, b) => a.rating - b.rating);
    for (const p of bandSelected.slice(0, perBand)) {
      seen.add(p.id);
      orderedPuzzles.push(p);
    }
  }

  const puzzles = orderedPuzzles.map((p) => ({
    id: p.id,
    puzzleId: p.id,
    fen: p.fen,
    moves: p.moves,
    rating: p.rating,
    themes: p.themes,
    theme: p.theme,
    url: p.url,
  }));

  return NextResponse.json({ puzzles });
}
