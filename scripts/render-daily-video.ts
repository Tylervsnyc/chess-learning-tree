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

function parseArgs() {
  const args: Record<string, string> = {};
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--(\w[\w-]*)=(.+)$/);
    if (match) args[match[1]] = match[2];
  }
  return args;
}

function main() {
  const args = parseArgs();
  const minRating = args['min-rating'] ? parseInt(args['min-rating'], 10) : 0;
  const dateOverride = args['date']; // e.g. "2.14.26"

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

  // Find next unused puzzle (with optional min rating filter)
  const usedSet = new Set(usage.usedPuzzleIds);
  const puzzle = pool.puzzles.find((p) => !usedSet.has(p.puzzleId) && p.rating >= minRating);

  if (!puzzle) {
    console.error(`No unused puzzles found${minRating ? ` with rating >= ${minRating}` : ''}! Re-run curation script to refill the pool.`);
    process.exit(1);
  }

  console.log(`Selected puzzle: ${puzzle.puzzleId} (${puzzle.theme}, rating ${puzzle.rating})`);

  const now = new Date();
  const dateStr = dateOverride || `${now.getMonth() + 1}.${now.getDate()}.${String(now.getFullYear()).slice(-2)}`;
  const dayDir = path.join(OUTPUT_DIR, dateStr);
  fs.mkdirSync(dayDir, { recursive: true });

  const outputFile = path.join(dayDir, `daily.${dateStr}-${puzzle.puzzleId}.mp4`);

  // Build Remotion input props
  const rawMoves = puzzle.moves.split(' ');

  // Theme-aware quips — match the quip to what actually happens in the puzzle
  const THEME_QUIPS: Record<string, string[]> = {
    mateIn1: ['One move. Game over.', 'Checkmate in one — clinical.', 'The simplest mates hit hardest.'],
    mateIn2: ['Two moves, no escape.', 'A forced mate is pure art.', 'Calculated to the end.'],
    mateIn3: ['Three moves deep — beautiful.', 'The king never had a chance.', 'Mating nets are beautiful.'],
    backRankMate: ['Back rank = no escape.', 'That back rank was asking for it.', 'Never forget your back rank!'],
    smotheredMate: ['Smothered by the knight!', 'The knight closes the coffin.', 'Nowhere to run, nowhere to hide.'],
    fork: ['Two targets, one move. Ouch.', 'Fork it over!', 'Double attack, double trouble.'],
    pin: ['Pinned and helpless.', 'Can\'t move, won\'t move.', 'That pin is devastating.'],
    skewer: ['Skewered right through!', 'Step aside, lose the piece behind.', 'X-ray vision wins again.'],
    sacrifice: ['Sometimes you gotta give to get.', 'Sacrifice accepted… checkmate incoming.', 'Material is temporary, checkmate is forever.'],
    discoveredAttack: ['The hidden threat reveals itself!', 'Move one piece, attack with another.', 'Discovered attacks are sneaky.'],
    kingsideAttack: ['The king is under siege!', 'Kingside assault — no mercy.', 'Storm the castle!'],
    queensideAttack: ['Queenside pressure cracks through!', 'The attack comes from the flank.', 'Queenside demolition.'],
    deflection: ['Deflect the defender, win the game.', 'That defender had one job.', 'Remove the guard!'],
    attraction: ['Lured right into the trap.', 'Come closer… checkmate.', 'The perfect bait.'],
    hangingPiece: ['Free piece? Yes please!', 'That piece was just hanging there.', 'Always check for hanging pieces.'],
    trappedPiece: ['Nowhere to go!', 'That piece is stuck.', 'Trapped and captured.'],
    clearance: ['Clear the path, deliver the blow.', 'Make way for the real threat!', 'Clearance sacrifice — beautiful.'],
    intermezzo: ['In-between move changes everything!', 'The zwischenzug strikes!', 'Surprise — not done yet.'],
    quietMove: ['The quiet move speaks loudest.', 'Subtle but deadly.', 'Sometimes the best move looks boring.'],
    endgame: ['Endgame technique wins games.', 'Clean conversion.', 'Technique over tactics.'],
  };
  const FALLBACK_QUIPS = [
    'Calculated, not lucky.',
    'Every puzzle makes you stronger.',
    'Pattern recognition is a superpower.',
    'Think twice, move once.',
    'GG, well played!',
    'Clean technique wins games.',
  ];
  const themeQuips = THEME_QUIPS[puzzle.theme] || FALLBACK_QUIPS;
  let hash = 0;
  for (let i = 0; i < puzzle.puzzleId.length; i++) {
    hash = ((hash << 5) - hash) + puzzle.puzzleId.charCodeAt(i);
    hash = hash & hash;
  }
  const quip = themeQuips[Math.abs(hash) % themeQuips.length];

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
