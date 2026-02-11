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

const POOL_FILE = path.join(process.cwd(), 'data', 'video-puzzle-pool.json');
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
  renders: { puzzleId: string; date: string; file: string }[];
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

function generateCaption(puzzle: PoolPuzzle, quip: string): string {
  // Pick a hook based on theme
  const hooks = THEME_HOOKS[puzzle.theme] || ['Can you solve this? 🤔', 'Find the best move!'];
  let hash = 0;
  for (let i = 0; i < puzzle.puzzleId.length; i++) {
    hash = ((hash << 7) - hash) + puzzle.puzzleId.charCodeAt(i);
    hash = hash & hash;
  }
  const hook = hooks[Math.abs(hash) % hooks.length];

  // Pick 5-6 hashtags (always include core ones + rotate others)
  const core = ['#chess', '#chesspuzzle', '#chesspath', '#dailypuzzle'];
  const extra = HASHTAGS.filter(h => !core.includes(h));
  const picked = extra.slice(Math.abs(hash) % extra.length, Math.abs(hash) % extra.length + 2);
  const tags = [...core, ...picked].join(' ');

  return `${hook}

Rating: ${puzzle.rating} ⭐
"${quip}"

Play daily puzzles free → chesspath.app

${tags}`;
}

function main() {
  // Load pool
  if (!fs.existsSync(POOL_FILE)) {
    console.error('Pool file not found. Run: npx tsx scripts/curate-video-puzzles.ts');
    process.exit(1);
  }
  const pool: { puzzles: PoolPuzzle[] } = JSON.parse(fs.readFileSync(POOL_FILE, 'utf-8'));

  // Load usage
  let usage: UsageData = { usedPuzzleIds: [], renders: [] };
  if (fs.existsSync(USAGE_FILE)) {
    usage = JSON.parse(fs.readFileSync(USAGE_FILE, 'utf-8'));
  }

  // Find next unused puzzle
  const usedSet = new Set(usage.usedPuzzleIds);
  const puzzle = pool.puzzles.find((p) => !usedSet.has(p.puzzleId));

  if (!puzzle) {
    console.error('All puzzles have been used! Re-run curation script to refill the pool.');
    process.exit(1);
  }

  console.log(`Selected puzzle: ${puzzle.puzzleId} (${puzzle.theme}, rating ${puzzle.rating})`);

  // Ensure output dir exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const now = new Date();
  const dateStr = `${now.getMonth() + 1}.${now.getDate()}.${String(now.getFullYear()).slice(-2)}`;
  const outputFile = path.join(OUTPUT_DIR, `daily.${dateStr}-${puzzle.puzzleId}.mp4`);

  // Build Remotion input props
  const rawMoves = puzzle.moves.split(' ');

  // Import quip function inline (can't import TS at runtime easily)
  // Use a simple hash to pick a quip
  const QUIPS = [
    'That piece never saw it coming!',
    'Chess is a series of surprises.',
    'The board whispers if you listen.',
    'Attack is the best defense!',
    'The king has nowhere to hide.',
    'Checkmate is the ultimate argument.',
    'The quiet move speaks loudest.',
    'That rook had places to be!',
    'Rooks belong on open files.',
    'GG, well played!',
    'Calculated, not lucky.',
    'Every puzzle makes you stronger.',
    'Think twice, move once.',
    'Free piece? Yes please!',
    'Mating nets are beautiful.',
    'A forced mate is pure art.',
    'Pins win pieces.',
    'The discovered attack strikes!',
    'Clean technique wins games.',
    'Pattern recognition is a superpower.',
  ];
  let hash = 0;
  for (let i = 0; i < puzzle.puzzleId.length; i++) {
    hash = ((hash << 5) - hash) + puzzle.puzzleId.charCodeAt(i);
    hash = hash & hash;
  }
  const quip = QUIPS[Math.abs(hash) % QUIPS.length];

  const inputProps = {
    puzzleId: puzzle.puzzleId,
    rawFen: puzzle.fen,
    rawMoves,
    rating: puzzle.rating,
    themes: puzzle.allThemes,
    quip,
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
  const caption = generateCaption(puzzle, quip);
  const captionFile = outputFile.replace('.mp4', '.txt');
  fs.writeFileSync(captionFile, caption);

  // Mark puzzle as used
  usage.usedPuzzleIds.push(puzzle.puzzleId);
  usage.renders.push({
    puzzleId: puzzle.puzzleId,
    date: dateStr,
    file: path.basename(outputFile),
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
