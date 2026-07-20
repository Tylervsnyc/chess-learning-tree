/**
 * Render a Chess Path Classics reel (famous combinations, one per day).
 *
 * Reads a classics week file (default data/classics/tal-week.json), derives
 * the highlight segment from the full game moves with chess.js (validating
 * every ply), and renders the ClassicsReel Remotion composition.
 *
 * Usage:
 *   npx tsx scripts/render-classics.ts --day=1
 *   npx tsx scripts/render-classics.ts --day=all
 *   npx tsx scripts/render-classics.ts --day=2 --week=data/classics/tal-week.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Chess } from 'chess.js';

const ENTRY_POINT = path.join(process.cwd(), 'remotion', 'index.ts');
const OUTPUT_DIR = path.join(process.cwd(), 'out', 'videos', 'classics');

interface ClassicDay {
  day: number;
  id: string;
  white: string;
  black: string;
  event: string;
  year: number;
  result: string;
  heroColor: 'white' | 'black';
  byline: string;
  hook: string;
  moves: string; // full game SAN, space separated
  startPly: number; // 1-based ply of the opponent's setup move
  plyCount: number; // setup + combination plies
  annotations: Record<string, string>; // solution ply index -> "!" / "!!"
  resultText: string;
  quip: string;
  caption: string;
}

interface ClassicsWeek {
  series: string;
  heroName: string;
  days: ClassicDay[];
}

function parseArgs() {
  const args: Record<string, string> = {};
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--(\w[\w-]*)=(.+)$/);
    if (match) args[match[1]] = match[2];
  }
  return args;
}

/** Replay the full game, extract the highlight segment as render props. */
function buildProps(week: ClassicsWeek, entry: ClassicDay) {
  const sans = entry.moves.trim().split(/\s+/);
  const chess = new Chess();

  // Validate the entire game first — a classics reel must replay the real game.
  for (let i = 0; i < sans.length; i++) {
    try {
      chess.move(sans[i]);
    } catch {
      throw new Error(`${entry.id}: illegal move "${sans[i]}" at ply ${i + 1}`);
    }
  }

  const seg = new Chess();
  for (let i = 0; i < entry.startPly - 1; i++) seg.move(sans[i]);
  const rawFen = seg.fen();

  const rawMoves: string[] = [];
  const displaySan: string[] = [];
  const endPly = Math.min(entry.startPly - 1 + entry.plyCount, sans.length);
  for (let i = entry.startPly - 1; i < endPly; i++) {
    const moveNum = Math.floor(i / 2) + 1;
    const isWhite = i % 2 === 0;
    const m = seg.move(sans[i]);
    rawMoves.push(m.from + m.to + (m.promotion ?? ''));
    if (i > entry.startPly - 1) {
      const suffix = entry.annotations[String(i - entry.startPly)] ?? '';
      displaySan.push(`${moveNum}${isWhite ? '.' : '...'} ${m.san}${suffix}`);
    }
  }

  return {
    classicId: entry.id,
    rawFen,
    rawMoves,
    displaySan,
    heroName: week.heroName,
    weekLabel: `${week.series} · Day ${entry.day} of ${week.days.length}`,
    byline: entry.byline,
    hook: entry.hook,
    resultText: entry.resultText,
    quip: entry.quip,
  };
}

function renderDay(week: ClassicsWeek, weekSlug: string, entry: ClassicDay) {
  const props = buildProps(week, entry);
  const dayDir = path.join(OUTPUT_DIR, weekSlug);
  fs.mkdirSync(dayDir, { recursive: true });
  const outputFile = path.join(dayDir, `${weekSlug}.day${entry.day}.${entry.id}.mp4`);

  console.log(`Rendering Day ${entry.day}: ${entry.byline}`);
  console.log(`  Combination: ${props.displaySan.join(' ')}`);

  const propsJson = JSON.stringify(props);
  execSync(
    `npx remotion render ${ENTRY_POINT} ClassicsReel "${outputFile}" --props='${propsJson.replace(/'/g, "'\\''")}' --config=remotion.config.ts`,
    { stdio: 'inherit', timeout: 600000 },
  );

  const captionFile = outputFile.replace('.mp4', '.txt');
  fs.writeFileSync(captionFile, entry.caption);

  console.log(`\n  Video:   ${outputFile}`);
  console.log(`  Caption: ${captionFile}\n`);
  return outputFile;
}

function main() {
  const args = parseArgs();
  const weekFile = args['week'] || path.join('data', 'classics', 'tal-week.json');
  const week: ClassicsWeek = JSON.parse(fs.readFileSync(weekFile, 'utf-8'));
  const weekSlug = path.basename(weekFile).replace('.json', '');

  const dayArg = args['day'];
  if (!dayArg) {
    console.error('Usage: npx tsx scripts/render-classics.ts --day=1 (or --day=all)');
    process.exit(1);
  }

  const entries =
    dayArg === 'all'
      ? week.days
      : week.days.filter((d) => d.day === parseInt(dayArg, 10));

  if (entries.length === 0) {
    console.error(`No day "${dayArg}" in ${weekFile} (has days ${week.days.map((d) => d.day).join(', ')})`);
    process.exit(1);
  }

  for (const entry of entries) renderDay(week, weekSlug, entry);
  console.log('Done!');
}

main();
