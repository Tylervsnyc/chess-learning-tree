const fs = require('fs');
const path = require('path');
const { Chess } = require('chess.js');

const PUZZLES_DIR = path.join(__dirname, '..', 'data', 'puzzles-by-rating');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'diagnostic-puzzles.json');

// Rating buckets we need puzzles for
const BUCKETS = [
  { key: '500', dir: '0400-0800', targetRating: 600, range: 150 },
  { key: '800', dir: '0800-1200', targetRating: 950, range: 150 },
  { key: '1100', dir: '0800-1200', targetRating: 1100, range: 150 },
  { key: '1400', dir: '1200-1600', targetRating: 1400, range: 200 },
  { key: '1700', dir: '1600-2000', targetRating: 1750, range: 200 },
];

// Themes to pull from (variety)
const THEMES = ['fork', 'pin', 'discoveredAttack', 'mate', 'hanging', 'skewer', 'backRankMate', 'sacrifice'];

const PUZZLES_PER_BUCKET = 20;

function processPuzzle(raw) {
  try {
    const chess = new Chess(raw.fen);
    const moveList = raw.moves.split(' ');

    // Apply setup move
    const setupUci = moveList[0];
    const lastMoveFrom = setupUci.slice(0, 2);
    const lastMoveTo = setupUci.slice(2, 4);

    const setupResult = chess.move({
      from: lastMoveFrom,
      to: lastMoveTo,
      promotion: setupUci[4] || undefined
    });

    if (!setupResult) return null;

    const setupMove = setupResult.san;
    const puzzleFen = chess.fen();
    const playerColor = chess.turn() === 'w' ? 'white' : 'black';

    // Get solution in SAN
    const solutionMoves = [];
    for (let i = 1; i < moveList.length; i++) {
      const uci = moveList[i];
      const result = chess.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci[4] || undefined
      });
      if (result) {
        solutionMoves.push(result.san);
      }
    }

    // Format solution with move numbers
    const solution = formatSolution(solutionMoves, playerColor === 'black');

    return {
      puzzleId: raw.puzzleId,
      fen: raw.fen,
      puzzleFen,
      moves: raw.moves,
      rating: raw.rating,
      themes: raw.themes,
      url: raw.url,
      setupMove,
      lastMoveFrom,
      lastMoveTo,
      solution,
      solutionMoves,
      playerColor,
    };
  } catch (e) {
    return null;
  }
}

function formatSolution(moves, startsAsBlack) {
  if (moves.length === 0) return '';
  const parts = [];
  let moveNum = 1;
  let isWhiteMove = !startsAsBlack;

  for (let i = 0; i < moves.length; i++) {
    const san = moves[i];
    if (isWhiteMove) {
      parts.push(`${moveNum}.${san}`);
    } else {
      if (i === 0 && startsAsBlack) {
        parts.push(`${moveNum}...${san}`);
      } else {
        parts.push(san);
      }
      moveNum++;
    }
    isWhiteMove = !isWhiteMove;
  }
  return parts.join(' ');
}

function loadPuzzlesFromCSV(filePath, targetRating, range, limit) {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const puzzles = [];

  for (let i = 1; i < lines.length && puzzles.length < limit * 3; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 9) continue;

    const rating = parseInt(parts[3], 10);
    const nbPlays = parseInt(parts[6], 10);

    // Filter by rating range and popularity
    if (Math.abs(rating - targetRating) <= range && nbPlays >= 1000) {
      puzzles.push({
        puzzleId: parts[0],
        fen: parts[1],
        moves: parts[2],
        rating,
        themes: parts[7].split(' '),
        url: parts[8],
      });
    }
  }

  return puzzles;
}

function main() {
  const result = {};

  for (const bucket of BUCKETS) {
    console.log(`Processing bucket ${bucket.key}...`);
    const bucketDir = path.join(PUZZLES_DIR, bucket.dir);
    let allPuzzles = [];

    // Load from multiple themes
    for (const theme of THEMES) {
      const csvPath = path.join(bucketDir, `${theme}.csv`);
      const puzzles = loadPuzzlesFromCSV(csvPath, bucket.targetRating, bucket.range, 10);
      allPuzzles.push(...puzzles);
    }

    // Also try general files
    const mateFile = path.join(bucketDir, 'mateIn2.csv');
    if (fs.existsSync(mateFile)) {
      allPuzzles.push(...loadPuzzlesFromCSV(mateFile, bucket.targetRating, bucket.range, 10));
    }

    // Deduplicate by puzzleId
    const seen = new Set();
    allPuzzles = allPuzzles.filter(p => {
      if (seen.has(p.puzzleId)) return false;
      seen.add(p.puzzleId);
      return true;
    });

    // Sort by popularity (nbPlays) and take top N
    allPuzzles.sort(() => Math.random() - 0.5); // Shuffle first
    allPuzzles = allPuzzles.slice(0, PUZZLES_PER_BUCKET);

    // Process into final format
    const processed = allPuzzles
      .map(processPuzzle)
      .filter(p => p !== null);

    result[bucket.key] = processed;
    console.log(`  Found ${processed.length} puzzles for bucket ${bucket.key}`);
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
  console.log(`\nWrote ${OUTPUT_FILE}`);
}

main();
