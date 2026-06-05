import { loadPuzzleFile } from '../lib/puzzle-file-loader';

const broken = [
  { id: '4.1.3', name: 'Sacrifice: Clearance', level: 4, tags: ['sacrifice', 'clearance'] },
  { id: '4.1.4', name: 'Sacrifice: Attraction', level: 4, tags: ['sacrifice', 'attraction'] },
  { id: '5.3.2', name: 'Windmill: Classic', level: 5, tags: ['discoveredAttack', 'doubleCheck'] },
];

for (const b of broken) {
  console.log(`\n=== ${b.id} ${b.name} (level ${b.level}, tags=${b.tags.join('+')}) ===`);

  // Also check adjacent levels
  const levels = [b.level - 1, b.level, b.level + 1].filter(l => l >= 1 && l <= 8);
  const all: any[] = [];
  for (const lv of levels) {
    for (const t of b.tags) {
      const file = loadPuzzleFile(lv, t);
      if (file) all.push(...file.puzzles);
    }
  }
  const dedup = Array.from(new Map(all.map(p => [p.puzzleId, p])).values());
  const both = dedup.filter(p => b.tags.every(t => p.allThemes.includes(t)));

  console.log(`  Total with BOTH tags (levels ${levels.join(',')}): ${both.length}`);
  if (both.length === 0) {
    // Try ANY (mixed)
    const either = dedup.filter(p => b.tags.some(t => p.allThemes.includes(t)));
    console.log(`  (fallback) With EITHER tag: ${either.length}`);
    console.log(`  => Recommend: isMixedPractice=true`);
    continue;
  }

  const ratings = both.map(p => p.rating).sort((a, b) => a - b);
  console.log(`  Rating range: ${ratings[0]} - ${ratings[ratings.length - 1]}`);
  console.log(`  Median rating: ${ratings[Math.floor(ratings.length / 2)]}`);

  // Histogram by 200-point buckets
  const buckets: Record<string, number> = {};
  for (const r of ratings) {
    const bucket = `${Math.floor(r / 200) * 200}-${Math.floor(r / 200) * 200 + 199}`;
    buckets[bucket] = (buckets[bucket] || 0) + 1;
  }
  console.log(`  Histogram:`);
  for (const [bk, count] of Object.entries(buckets)) {
    console.log(`    ${bk}: ${count}`);
  }

  // Find tightest window containing at least 20 puzzles with minPlays >= 500
  const wellPlayed = both.filter(p => p.nbPlays >= 500).map(p => p.rating).sort((a, b) => a - b);
  console.log(`  With 500+ plays: ${wellPlayed.length}`);
  if (wellPlayed.length >= 10) {
    console.log(`  Suggested rating window (500+ plays): ${wellPlayed[0]} - ${wellPlayed[wellPlayed.length - 1]}`);
  }
  const anyPlays = both.filter(p => p.nbPlays >= 100).map(p => p.rating).sort((a, b) => a - b);
  console.log(`  With 100+ plays: ${anyPlays.length}`);
  if (anyPlays.length >= 10) {
    console.log(`  Suggested rating window (100+ plays): ${anyPlays[0]} - ${anyPlays[anyPlays.length - 1]}`);
  }
}
