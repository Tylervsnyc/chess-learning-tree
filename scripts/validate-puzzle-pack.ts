/**
 * Replay every lesson's real selection criteria against the offline puzzle pack.
 *
 *   npx tsx scripts/validate-puzzle-pack.ts [packDir]
 *
 * The pack is a lossy trim of data/clean-puzzles-v2 (see build-puzzle-pack.mjs).
 * Lossy is fine; lossy in a way that empties a specific lesson is not — and you
 * would only find that out by tapping that one lesson on a train. So this walks
 * all 446 lessons through the exact same path /api/puzzles/lesson takes and
 * reports the ones that come out thin.
 */
import * as fs from 'fs';
import * as path from 'path';
import { getAllLessonIds, getLessonById } from '../lib/curriculum-registry';
import { selectPuzzlesForLesson, type Puzzle } from '../lib/puzzle-selector';

const PACK = process.argv[2] || 'data/offline-puzzle-pack';
const PUZZLES_PER_LESSON = 6;

// Same mapping as app/api/puzzles/lesson/route.ts
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

const cache = new Map<string, Puzzle[]>();
function load(level: number, theme: string): Puzzle[] {
  const key = `level${level}-${theme}`;
  if (cache.has(key)) return cache.get(key)!;
  const file = path.join(PACK, `${key}.json`);
  let out: Puzzle[] = [];
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    out = data.puzzles.map((p: any) => ({
      id: p.puzzleId, fen: p.fen, moves: p.moves.split(' '), rating: p.rating,
      popularity: p.popularity, plays: p.nbPlays, theme: p.theme, themes: p.allThemes,
      url: `https://lichess.org/training/${p.puzzleId}`,
    }));
  }
  cache.set(key, out);
  return out;
}

const thin: { id: string; got: number; themes: string }[] = [];
const empty: { id: string; themes: string }[] = [];
let ok = 0;

for (const id of getAllLessonIds()) {
  const lesson: any = getLessonById(id);
  if (!lesson) continue;

  const themes: string[] = lesson.isMixedPractice
    ? (lesson.mixedThemes ?? [])
    : (lesson.requiredTags ?? []);
  if (!themes.length) continue;

  const level = levelFromRating(lesson.ratingMin);
  const candidates = themes.flatMap((t) => load(level, t));

  const result = selectPuzzlesForLesson(candidates, {
    themes,
    isMixedPractice: !!lesson.isMixedPractice,
    excludeThemes: lesson.excludeTags,
    ratingMin: lesson.ratingMin,
    ratingMax: lesson.ratingMax,
    minPlays: lesson.minPlays ?? 1000,
    pieceFilter: lesson.pieceFilter || undefined,
  });

  const got = result.puzzles.length;
  if (got === 0) empty.push({ id, themes: themes.join(',') });
  else if (got < PUZZLES_PER_LESSON) thin.push({ id, got, themes: themes.join(',') });
  else ok++;
}

console.log(`\npack: ${PACK}`);
console.log(`full lessons (${PUZZLES_PER_LESSON} puzzles): ${ok}`);
console.log(`thin  (1-${PUZZLES_PER_LESSON - 1}):              ${thin.length}`);
console.log(`EMPTY (0):                    ${empty.length}`);

if (thin.length) {
  console.log('\nthin lessons:');
  for (const t of thin.slice(0, 25)) console.log(`  ${t.id}  got ${t.got}  [${t.themes}]`);
  if (thin.length > 25) console.log(`  ... +${thin.length - 25} more`);
}
if (empty.length) {
  console.log('\nEMPTY lessons (these would be unplayable offline):');
  for (const e of empty.slice(0, 25)) console.log(`  ${e.id}  [${e.themes}]`);
  if (empty.length > 25) console.log(`  ... +${empty.length - 25} more`);
}

// Strict on purpose: the pack currently yields a full 6 for all 446 lessons, so
// ANY shortfall means the trim (or the curriculum) moved and someone should look.
process.exit(empty.length || thin.length ? 1 : 0);
