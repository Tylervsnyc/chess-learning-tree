#!/usr/bin/env node

/**
 * Find Replacement Puzzles
 *
 * Searches puzzle CSV files for puzzles matching specific criteria,
 * filtering by which piece makes the first move.
 *
 * Usage: node scripts/find-replacements.js <piece> <tag> <minRating> <maxRating> [count]
 * Example: node scripts/find-replacements.js queen mateIn1 400 500 10
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Chess piece detection from FEN
function fenToBoard(fen) {
  const board = {};
  const [position] = fen.split(' ');
  const rows = position.split('/');

  for (let rank = 0; rank < 8; rank++) {
    let file = 0;
    for (const char of rows[rank]) {
      if (/[1-8]/.test(char)) {
        file += parseInt(char);
      } else {
        const square = String.fromCharCode(97 + file) + (8 - rank);
        board[square] = char;
        file++;
      }
    }
  }
  return board;
}

function getPieceType(pieceChar) {
  const lower = pieceChar.toLowerCase();
  switch (lower) {
    case 'k': return 'king';
    case 'q': return 'queen';
    case 'r': return 'rook';
    case 'b': return 'bishop';
    case 'n': return 'knight';
    case 'p': return 'pawn';
    default: return null;
  }
}

function getMovingPiece(fen, moves) {
  if (!moves || moves.length === 0) return null;
  const board = fenToBoard(fen);
  const firstMove = moves.split(' ')[0];
  const fromSquare = firstMove.slice(0, 2);
  const piece = board[fromSquare];
  return piece ? getPieceType(piece) : null;
}

// Get the appropriate CSV file for a rating range
function getCsvFile(minRating, maxRating) {
  const avgRating = (minRating + maxRating) / 2;

  if (avgRating < 800) return '0400-0800.csv';
  if (avgRating < 1200) return '0800-1200.csv';
  if (avgRating < 1600) return '1200-1600.csv';
  if (avgRating < 2000) return '1600-2000.csv';
  return '2000-plus.csv';
}

// Load existing puzzle IDs to avoid duplicates
function loadExistingPuzzleIds() {
  const puzzleSetsPath = path.join(__dirname, '..', 'data', 'lesson-puzzle-sets.ts');
  const content = fs.readFileSync(puzzleSetsPath, 'utf-8');

  const ids = new Set();
  const idRegex = /"id":\s*"([^"]+)"/g;
  let match;
  while ((match = idRegex.exec(content)) !== null) {
    ids.add(match[1]);
  }
  return ids;
}

async function findReplacements(piece, requiredTag, minRating, maxRating, count = 10, excludeTag = null) {
  const csvFile = getCsvFile(minRating, maxRating);
  const csvPath = path.join(__dirname, '..', 'data', 'puzzles-by-rating', csvFile);

  console.log(`Searching ${csvFile} for ${piece} ${requiredTag} puzzles (${minRating}-${maxRating})...`);
  if (excludeTag) console.log(`Excluding tag: ${excludeTag}`);

  const existingIds = loadExistingPuzzleIds();
  const results = [];

  const fileStream = fs.createReadStream(csvPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (lineNum === 1) continue; // Skip header

    // CSV format: PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
    const parts = line.split(',');
    if (parts.length < 8) continue;

    const id = parts[0];
    const fen = parts[1];
    const moves = parts[2];
    const rating = parseInt(parts[3]);
    const nbPlays = parseInt(parts[6]);
    const themes = parts[7];

    // Skip if already used
    if (existingIds.has(id)) continue;

    // Check rating range
    if (rating < minRating || rating > maxRating) continue;

    // Check required tag
    if (!themes.includes(requiredTag)) continue;

    // Check excluded tag
    if (excludeTag && themes.includes(excludeTag)) continue;

    // Check minimum plays for quality
    if (nbPlays < 500) continue;

    // Check piece filter
    const movingPiece = getMovingPiece(fen, moves);
    if (movingPiece !== piece) continue;

    results.push({
      id,
      fen,
      moves,
      rating,
      themes: themes.split(' '),
      url: parts[8] || `https://lichess.org/training/${id}`
    });

    if (results.length >= count) break;
  }

  return results;
}

// Format as TypeScript for lesson-puzzle-sets.ts
function formatAsTs(puzzles) {
  return puzzles.map(p => `      {
        "id": "${p.id}",
        "fen": "${p.fen}",
        "moves": "${p.moves}",
        "rating": ${p.rating},
        "themes": ${JSON.stringify(p.themes)},
        "url": "${p.url}"
      }`).join(',\n');
}

// Main
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 4) {
    console.log('Usage: node scripts/find-replacements.js <piece> <tag> <minRating> <maxRating> [count] [excludeTag]');
    console.log('');
    console.log('Arguments:');
    console.log('  piece      - queen, rook, bishop, knight, pawn');
    console.log('  tag        - mateIn1, mateIn2, fork, etc.');
    console.log('  minRating  - minimum puzzle rating');
    console.log('  maxRating  - maximum puzzle rating');
    console.log('  count      - number of puzzles to find (default: 10)');
    console.log('  excludeTag - tag to exclude (optional)');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/find-replacements.js queen mateIn1 400 500 6');
    console.log('  node scripts/find-replacements.js knight fork 400 575 6 mateIn1');
    process.exit(0);
  }

  const piece = args[0];
  const tag = args[1];
  const minRating = parseInt(args[2]);
  const maxRating = parseInt(args[3]);
  const count = parseInt(args[4]) || 10;
  const excludeTag = args[5] || null;

  const puzzles = await findReplacements(piece, tag, minRating, maxRating, count, excludeTag);

  console.log(`\nFound ${puzzles.length} puzzles:\n`);

  for (const p of puzzles) {
    console.log(`${p.id} (${p.rating}) - ${p.themes.join(', ')}`);
    console.log(`  ${p.url}`);
  }

  console.log('\n--- TypeScript format ---\n');
  console.log(formatAsTs(puzzles));
}

main().catch(console.error);
