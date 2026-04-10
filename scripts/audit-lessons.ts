import { getAllLessonIds, getLessonById } from '../lib/curriculum-registry';
import { loadPuzzleFile } from '../lib/puzzle-file-loader';

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

const lessonIds = getAllLessonIds();
const problems: { id: string; name: string; reason: string; candidates: number }[] = [];

for (const lid of lessonIds) {
  const lesson = getLessonById(lid);
  if (!lesson) continue;
  const themes = lesson.isMixedPractice
    ? (lesson.mixedThemes || [])
    : lesson.requiredTags;
  if (!themes.length) continue;

  const level = getLevelFromRating(lesson.ratingMin);
  const puzzles: any[] = [];
  const missing: string[] = [];
  for (const t of themes) {
    const file = loadPuzzleFile(level, t);
    if (file) puzzles.push(...file.puzzles);
    else missing.push(t);
  }

  const dedup = Array.from(new Map(puzzles.map(p => [p.puzzleId, p])).values());
  let filtered = dedup.filter(p => p.rating >= lesson.ratingMin && p.rating <= lesson.ratingMax);
  filtered = filtered.filter(p => p.nbPlays >= (lesson.minPlays || 1000));

  if (lesson.isMixedPractice) {
    filtered = filtered.filter(p => themes.some(t => p.allThemes.includes(t)));
  } else {
    filtered = filtered.filter(p => themes.every(t => p.allThemes.includes(t)));
  }

  if (lesson.excludeTags?.length) {
    filtered = filtered.filter(p => !lesson.excludeTags!.some(t => p.allThemes.includes(t)));
  }

  if (filtered.length === 0) {
    const reason = missing.length ? `missing files: ${missing.join(',')}` : `0 puzzles match filter (tags=${themes.join('+')}, rating=${lesson.ratingMin}-${lesson.ratingMax}, minPlays=${lesson.minPlays || 1000})`;
    problems.push({ id: lesson.id, name: lesson.name, reason, candidates: dedup.length });
  } else if (filtered.length < 6) {
    problems.push({ id: lesson.id, name: lesson.name, reason: `ONLY ${filtered.length} puzzles (<6 needed)`, candidates: dedup.length });
  }
}

console.log(`\nTotal lessons checked: ${lessonIds.length}`);
console.log(`Problem lessons: ${problems.length}\n`);
for (const p of problems) {
  console.log(`${p.id} — ${p.name}`);
  console.log(`   ${p.reason}`);
}
