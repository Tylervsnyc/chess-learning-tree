/**
 * Render Daily Puzzle Video
 *
 * Picks the next unused puzzle from video-puzzle-pool.json,
 * renders a 1080x1920 MP4 via Remotion CLI,
 * and marks the puzzle as used in video-puzzle-usage.json.
 *
 * Usage: npm run video:render
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Chess } from 'chess.js';
import { describeResult } from '../remotion/lib/describe-result';
import { getVideoQuip } from '../remotion/lib/video-quips';
import { DIFFICULT_DOW } from '../lib/ig-difficult-days';

const POOL_FILE = path.join(process.cwd(), 'data', 'video-puzzle-pool.json');
const HARD_POOL_FILE = path.join(process.cwd(), 'data', 'video-puzzle-pool-hard.json');
const USAGE_FILE = path.join(process.cwd(), 'data', 'video-puzzle-usage.json');
const OUTPUT_DIR = path.join(process.cwd(), 'out', 'videos');
const ENTRY_POINT = path.join(process.cwd(), 'remotion', 'index.ts');

interface PoolPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  theme: string;
  allThemes: string[];
  gameUrl: string;
}

interface UsageData {
  usedPuzzleIds: string[];
  renders: { puzzleId: string; date: string; file: string; difficult?: boolean }[];
}

// Theme → hook text for captions
const THEME_HOOKS: Record<string, string[]> = {
  mateIn1: ['Checkmate in ONE move!', 'Can you spot the mate?'],
  mateIn2: ['Checkmate in 2 — can you see it?', 'Find the forced mate in 2!'],
  mateIn3: ['Checkmate in 3 moves!', 'This mate is BEAUTIFUL'],
  backRankMate: ['Back rank is WIDE open 👀', 'Classic back rank mate!'],
  smotheredMate: ['Smothered mate alert! 🐴', 'The knight delivers!'],
  fork: ['Fork incoming! 🍴', 'Can you find the fork?'],
  pin: ['This pin wins material!', 'Pinned and helpless!'],
  skewer: ['Skewer right through!', 'X-ray vision required 👀'],
  sacrifice: ['Would you sacrifice here? 🔥', 'SACRIFICE for the win!'],
  discoveredAttack: ['Discovered attack incoming!', 'The hidden threat!'],
  kingsideAttack: ['Kingside is under siege!', 'Attack the king!'],
  queensideAttack: ['Queenside pressure!', 'Can you crack the queenside?'],
  deflection: ['Deflect and conquer!', 'Move that defender!'],
  attraction: ['Lure them in! 🎯', 'The perfect trap!'],
};

const HASHTAGS = [
  '#chess', '#chesspuzzle', '#chesspath', '#chessreels',
  '#checkmate', '#chessmoves', '#learnchess', '#dailypuzzle',
  '#chesstactics', '#chesslife',
];

const DIFFICULT_HOOKS = [
  "DIFFICULT PUZZLE 🔥 Only the sharp eyes get this one.",
  "This one's TOUGH. Think you can crack it?",
  "DIFFICULT PUZZLE. Most people miss it — can you?",
];

function generateCaption(puzzle: PoolPuzzle, quip: string, difficult = false): string {
  let hash = 0;
  for (let i = 0; i < puzzle.puzzleId.length; i++) {
    hash = ((hash << 7) - hash) + puzzle.puzzleId.charCodeAt(i);
    hash = hash & hash;
  }

  // Pick a hook — difficult days get a harder framing
  const hooks = difficult
    ? DIFFICULT_HOOKS
    : THEME_HOOKS[puzzle.theme] || ['Can you solve this? 🤔', 'Find the best move!'];
  const hook = hooks[Math.abs(hash) % hooks.length];

  // Difficult days ask viewers to comment their guess before the reveal
  const guessLine = difficult
    ? '\nDrop your guess in the comments BEFORE you watch the solution 👇\n'
    : '';

  // Pick 5-6 hashtags (always include core ones + rotate others)
  const core = ['#chess', '#chesspuzzle', '#chesspath', '#dailypuzzle'];
  const extra = HASHTAGS.filter(h => !core.includes(h));
  const picked = extra.slice(Math.abs(hash) % extra.length, Math.abs(hash) % extra.length + 2);
  const tags = [...core, ...picked].join(' ');

  return `${hook}
${guessLine}
Rating: ${puzzle.rating} ⭐
"${quip}"

Play daily puzzles free → chesspath.app

${tags}`;
}

function parseArgs() {
  const args: Record<string, string> = {};
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--(\w[\w-]*)=(.+)$/);
    if (match) args[match[1]] = match[2];
  }
  return args;
}

// Difficult days draw from a dedicated 2000+ pool (video-puzzle-pool-hard.json).
// Cadence is the canonical DIFFICULT_DOW set in lib/ig-queue (one source of truth).
// dateStr is "M.D.YY"; local getDay() gives its calendar weekday.
function isDifficultDate(dateStr: string): boolean {
  const [m, d, y] = dateStr.split('.').map((n) => parseInt(n, 10));
  if (!m || !d || !y) return false;
  const day = new Date(2000 + y, m - 1, d).getDay();
  return DIFFICULT_DOW.has(day);
}

function main() {
  const args = parseArgs();
  const minRating = args['min-rating'] ? parseInt(args['min-rating'], 10) : 0;
  const dateOverride = args['date']; // e.g. "2.14.26"

  // Resolve the target date (used for the output folder AND the difficult-day check)
  const now = new Date();
  const dateStr = dateOverride || `${now.getMonth() + 1}.${now.getDate()}.${String(now.getFullYear()).slice(-2)}`;

  // Difficult puzzle on Thu/Sat (by target date), or forced via --difficult / --no-difficult
  const forceOn = process.argv.includes('--difficult');
  const forceOff = process.argv.includes('--no-difficult');
  const difficult = forceOff ? false : forceOn || isDifficultDate(dateStr);

  // Difficult days pull from the dedicated 2000+ hard pool; normal days from the main pool.
  const poolFile = difficult ? HARD_POOL_FILE : POOL_FILE;
  if (!fs.existsSync(poolFile)) {
    const script = difficult ? 'scripts/curate-video-puzzles-hard.ts' : 'scripts/curate-video-puzzles.ts';
    console.error(`Pool file not found (${path.basename(poolFile)}). Run: npx tsx ${script}`);
    process.exit(1);
  }
  const pool: { puzzles: PoolPuzzle[] } = JSON.parse(fs.readFileSync(poolFile, 'utf-8'));
  if (difficult) {
    console.log(`DIFFICULT day (${dateStr}) — selecting from the 2000+ hard pool`);
  }

  // Load usage
  let usage: UsageData = { usedPuzzleIds: [], renders: [] };
  if (fs.existsSync(USAGE_FILE)) {
    usage = JSON.parse(fs.readFileSync(USAGE_FILE, 'utf-8'));
  }

  // Find next unused puzzle (with optional min rating filter)
  const usedSet = new Set(usage.usedPuzzleIds);
  const puzzle = pool.puzzles.find((p) => !usedSet.has(p.puzzleId) && p.rating >= minRating);

  if (!puzzle) {
    console.error(`No unused puzzles found${minRating ? ` with rating >= ${minRating}` : ''}! Re-run curation script to refill the pool.`);
    process.exit(1);
  }

  console.log(`Selected puzzle: ${puzzle.puzzleId} (${puzzle.theme}, rating ${puzzle.rating})`);

  if (difficult) {
    const remainingHard = pool.puzzles.filter(
      (p) => !usedSet.has(p.puzzleId) && p.puzzleId !== puzzle.puzzleId,
    ).length;
    if (remainingHard < 10) {
      console.warn(`⚠ Only ${remainingHard} unused puzzles left in the hard pool — top up via scripts/curate-video-puzzles-hard.ts`);
    }
  }

  const dayDir = path.join(OUTPUT_DIR, dateStr);
  fs.mkdirSync(dayDir, { recursive: true });

  const outputFile = path.join(dayDir, `daily.${dateStr}-${puzzle.puzzleId}.mp4`);

  // Build Remotion input props
  const rawMoves = puzzle.moves.split(' ');

  // Analyze the puzzle to get accurate result + context-aware quip
  const setupUci = rawMoves[0];
  const chess = new Chess(puzzle.fen);
  chess.move({ from: setupUci.slice(0, 2), to: setupUci.slice(2, 4), promotion: setupUci.length > 4 ? setupUci[4] : undefined });
  const puzzleFen = chess.fen();
  const playerColor = chess.turn() === 'w' ? 'white' : 'black';
  const solutionUciMoves = rawMoves.slice(1);

  // Play through to get final position
  const finalChess = new Chess(puzzleFen);
  for (const uci of solutionUciMoves) {
    try { finalChess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci.length > 4 ? uci[4] : undefined }); } catch { break; }
  }

  const result = describeResult(puzzleFen, finalChess.fen(), playerColor as 'white' | 'black', puzzle.allThemes, solutionUciMoves);
  const quip = getVideoQuip(puzzle.puzzleId, result, puzzle.allThemes, puzzle.theme);

  console.log(`  Result: "${result.text}" (${result.category})`);

  const inputProps = {
    puzzleId: puzzle.puzzleId,
    rawFen: puzzle.fen,
    rawMoves,
    rating: puzzle.rating,
    themes: puzzle.allThemes,
    quip,
    difficult,
  };

  const propsJson = JSON.stringify(inputProps);

  console.log(`Rendering ${puzzle.puzzleId} → ${path.basename(outputFile)}...`);
  console.log(`  Moves: ${puzzle.moves}`);
  console.log(`  Quip: "${quip}"`);

  try {
    execSync(
      `npx remotion render ${ENTRY_POINT} DailyPuzzleVideo "${outputFile}" --props='${propsJson.replace(/'/g, "'\\''")}' --config=remotion.config.ts`,
      { stdio: 'inherit', timeout: 300000 },
    );
  } catch (err) {
    console.error('Render failed:', err);
    process.exit(1);
  }

  // Generate caption + hashtags
  const caption = generateCaption(puzzle, quip, difficult);
  const captionFile = outputFile.replace('.mp4', '.txt');
  fs.writeFileSync(captionFile, caption);

  // Mark puzzle as used
  usage.usedPuzzleIds.push(puzzle.puzzleId);
  usage.renders.push({
    puzzleId: puzzle.puzzleId,
    date: dateStr,
    file: path.basename(outputFile),
    difficult,
  });
  fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));

  console.log(`\nDone!`);
  console.log(`  Video:   ${outputFile}`);
  console.log(`  Caption: ${captionFile}`);
  console.log(`  Puzzles remaining: ${pool.puzzles.length - usage.usedPuzzleIds.length}`);
  console.log(`\n--- CAPTION ---`);
  console.log(caption);
  console.log(`--- END ---`);
}

main();
