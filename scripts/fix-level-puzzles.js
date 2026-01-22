#!/usr/bin/env node

/**
 * Fix Level Puzzles
 *
 * Automatically finds and replaces misclassified puzzles for an entire level.
 * Uses the verification script to identify issues, then finds replacements.
 *
 * Supports two puzzle formats:
 * - Full format: { id, fen, moves, rating, themes, url }
 * - Slim format: { puzzleId, slot, trueDifficulty } (looks up data from CSV)
 *
 * Usage: node scripts/fix-level-puzzles.js <level>
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Global puzzle cache for slim format lookups
let puzzleCache = null;

// ===== Chess piece detection =====
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

// ===== Build puzzle cache from CSV files =====
async function buildPuzzleCache() {
  if (puzzleCache) return puzzleCache;

  puzzleCache = new Map();
  const csvDir = path.join(__dirname, '..', 'data', 'puzzles-by-rating');
  const csvFiles = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'));

  console.log('Building puzzle cache from CSV files...');

  for (const csvFile of csvFiles) {
    const csvPath = path.join(csvDir, csvFile);
    const fileStream = fs.createReadStream(csvPath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let lineNum = 0;
    for await (const line of rl) {
      lineNum++;
      if (lineNum === 1) continue; // Skip header

      const parts = line.split(',');
      if (parts.length < 8) continue;

      const id = parts[0];
      const fen = parts[1];
      const moves = parts[2];
      const rating = parseInt(parts[3]);
      const themes = parts[7];

      puzzleCache.set(id, {
        id,
        fen,
        moves,
        rating,
        themes: themes.split(' '),
        url: parts[8] || `https://lichess.org/training/${id}`
      });
    }
  }

  console.log(`Loaded ${puzzleCache.size} puzzles into cache\n`);
  return puzzleCache;
}

// Normalize puzzle to full format (handles both slim and full formats)
function normalizePuzzle(puzzle, cache) {
  // Full format already has themes
  if (puzzle.themes) {
    return { ...puzzle, isSlimFormat: false };
  }

  // Slim format - look up from cache
  const puzzleId = puzzle.puzzleId || puzzle.id;
  const cached = cache.get(puzzleId);

  if (!cached) {
    return {
      id: puzzleId,
      puzzleId: puzzleId,
      rating: puzzle.trueDifficulty || 0,
      themes: [],
      fen: null,
      moves: null,
      notFound: true,
      isSlimFormat: true,
      slot: puzzle.slot,
      trueDifficulty: puzzle.trueDifficulty
    };
  }

  return {
    ...cached,
    puzzleId: puzzleId,
    slot: puzzle.slot,
    trueDifficulty: puzzle.trueDifficulty,
    isSlimFormat: true
  };
}

// ===== Load data =====
function loadCurriculum(level) {
  const curriculumPath = path.join(__dirname, '..', 'data', `level${level}-curriculum.ts`);
  const content = fs.readFileSync(curriculumPath, 'utf-8');

  const lessons = [];
  const lessonRegex = /\{\s*id:\s*['"]([^'"]+)['"]\s*,\s*name:\s*['"]([^'"]+)['"]\s*,\s*description:\s*['"]([^'"]+)['"]\s*,\s*requiredTags:\s*\[([^\]]*)\]/g;

  let match;
  while ((match = lessonRegex.exec(content)) !== null) {
    const lesson = {
      id: match[1],
      name: match[2],
      requiredTags: match[4].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(t => t),
    };

    const lessonStart = match.index;
    const lessonEnd = content.indexOf('}', lessonStart + match[0].length);
    const lessonBlock = content.slice(lessonStart, lessonEnd + 1);

    const excludeMatch = lessonBlock.match(/excludeTags:\s*\[([^\]]*)\]/);
    if (excludeMatch) {
      lesson.excludeTags = excludeMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(t => t);
    }

    const ratingMinMatch = lessonBlock.match(/ratingMin:\s*(\d+)/);
    const ratingMaxMatch = lessonBlock.match(/ratingMax:\s*(\d+)/);
    if (ratingMinMatch) lesson.ratingMin = parseInt(ratingMinMatch[1]);
    if (ratingMaxMatch) lesson.ratingMax = parseInt(ratingMaxMatch[1]);

    const pieceFilterMatch = lessonBlock.match(/pieceFilter:\s*['"](\w+)['"]/);
    if (pieceFilterMatch) lesson.pieceFilter = pieceFilterMatch[1];

    if (lessonBlock.includes('isMixedPractice: true')) {
      lesson.isMixedPractice = true;
    }

    const mixedThemesMatch = lessonBlock.match(/mixedThemes:\s*\[([^\]]*)\]/);
    if (mixedThemesMatch) {
      lesson.mixedThemes = mixedThemesMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(t => t);
    }

    lessons.push(lesson);
  }

  return lessons;
}

function loadPuzzleSets() {
  const puzzleSetsPath = path.join(__dirname, '..', 'data', 'lesson-puzzle-sets.ts');
  const content = fs.readFileSync(puzzleSetsPath, 'utf-8');

  const startMatch = content.match(/export const lessonPuzzleSets[^=]*=\s*\[/);
  if (!startMatch) throw new Error('Could not find lessonPuzzleSets array');

  const startIdx = startMatch.index + startMatch[0].length - 1;
  let depth = 1;
  let endIdx = startIdx + 1;
  while (depth > 0 && endIdx < content.length) {
    if (content[endIdx] === '[') depth++;
    else if (content[endIdx] === ']') depth--;
    endIdx++;
  }

  return JSON.parse(content.slice(startIdx, endIdx));
}

function loadExistingPuzzleIds() {
  const puzzleSetsPath = path.join(__dirname, '..', 'data', 'lesson-puzzle-sets.ts');
  const content = fs.readFileSync(puzzleSetsPath, 'utf-8');

  const ids = new Set();
  // Match both "id": "xxx" and "puzzleId": "xxx" formats
  const idRegex = /"(?:id|puzzleId)":\s*"([^"]+)"/g;
  let match;
  while ((match = idRegex.exec(content)) !== null) {
    ids.add(match[1]);
  }
  return ids;
}

// ===== Verify puzzles =====
function verifyPuzzle(puzzle, lesson) {
  const issues = [];

  if (!lesson.isMixedPractice && lesson.requiredTags.length > 0) {
    for (const tag of lesson.requiredTags) {
      if (!puzzle.themes.includes(tag)) {
        issues.push(`Missing required tag: ${tag}`);
      }
    }
  }

  if (lesson.isMixedPractice && lesson.mixedThemes && lesson.mixedThemes.length > 0) {
    const hasAnyTheme = lesson.mixedThemes.some(theme => puzzle.themes.includes(theme));
    if (!hasAnyTheme) {
      issues.push(`Missing any of mixedThemes: ${lesson.mixedThemes.join(', ')}`);
    }
  }

  if (lesson.excludeTags) {
    for (const tag of lesson.excludeTags) {
      if (puzzle.themes.includes(tag)) {
        issues.push(`Has excluded tag: ${tag}`);
      }
    }
  }

  if (lesson.ratingMin && puzzle.rating < lesson.ratingMin) {
    issues.push(`Rating ${puzzle.rating} below min ${lesson.ratingMin}`);
  }
  if (lesson.ratingMax && puzzle.rating > lesson.ratingMax) {
    issues.push(`Rating ${puzzle.rating} above max ${lesson.ratingMax}`);
  }

  if (lesson.pieceFilter) {
    const movingPiece = getMovingPiece(puzzle.fen, puzzle.moves);
    if (movingPiece && movingPiece !== lesson.pieceFilter) {
      issues.push(`Piece mismatch: expected ${lesson.pieceFilter}, got ${movingPiece}`);
    }
  }

  return issues;
}

// ===== Find replacements =====
function getCsvFile(minRating, maxRating) {
  const avgRating = (minRating + maxRating) / 2;
  if (avgRating < 800) return '0400-0800.csv';
  if (avgRating < 1200) return '0800-1200.csv';
  if (avgRating < 1600) return '1200-1600.csv';
  if (avgRating < 2000) return '1600-2000.csv';
  return '2000-plus.csv';
}

async function findReplacements(lesson, count, existingIds) {
  const csvFile = getCsvFile(lesson.ratingMin, lesson.ratingMax);
  const csvPath = path.join(__dirname, '..', 'data', 'puzzles-by-rating', csvFile);

  const results = [];
  const requiredTag = lesson.requiredTags[0] || (lesson.mixedThemes ? lesson.mixedThemes[0] : null);

  if (!requiredTag) return results;

  const fileStream = fs.createReadStream(csvPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (lineNum === 1) continue;

    const parts = line.split(',');
    if (parts.length < 8) continue;

    const id = parts[0];
    const fen = parts[1];
    const moves = parts[2];
    const rating = parseInt(parts[3]);
    const nbPlays = parseInt(parts[6]);
    const themes = parts[7];

    if (existingIds.has(id)) continue;
    if (rating < lesson.ratingMin || rating > lesson.ratingMax) continue;

    // Check required tag
    if (!themes.includes(requiredTag)) continue;

    // Check excluded tags
    if (lesson.excludeTags) {
      let hasExcluded = false;
      for (const excl of lesson.excludeTags) {
        if (themes.includes(excl)) { hasExcluded = true; break; }
      }
      if (hasExcluded) continue;
    }

    if (nbPlays < 500) continue;

    // Check piece filter
    if (lesson.pieceFilter) {
      const movingPiece = getMovingPiece(fen, moves);
      if (movingPiece !== lesson.pieceFilter) continue;
    }

    results.push({
      id,
      fen,
      moves,
      rating,
      themes: themes.split(' '),
      url: parts[8] || `https://lichess.org/training/${id}`
    });

    existingIds.add(id); // Don't reuse

    if (results.length >= count) break;
  }

  return results;
}

// ===== Apply fixes =====
async function fixLevel(level) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Fixing Level ${level} Puzzles`);
  console.log('='.repeat(60));

  const lessons = loadCurriculum(level);
  const puzzleSets = loadPuzzleSets();
  const existingIds = loadExistingPuzzleIds();

  const levelPrefix = `${level}.`;
  const levelLessons = lessons.filter(l => l.id.startsWith(levelPrefix));

  // Check if we need the cache (slim format detection)
  const levelPuzzleSets = puzzleSets.filter(ps => ps.lessonId.startsWith(levelPrefix));
  const isSlimFormat = levelPuzzleSets.some(ps =>
    ps.puzzles && ps.puzzles.length > 0 && ps.puzzles[0].puzzleId !== undefined
  );

  let cache = new Map();
  if (isSlimFormat) {
    cache = await buildPuzzleCache();
  }

  let totalFixed = 0;
  const fixes = [];

  for (const lesson of levelLessons) {
    const puzzleSet = puzzleSets.find(ps => ps.lessonId === lesson.id);
    if (!puzzleSet) continue;

    const badPuzzles = [];
    for (const rawPuzzle of puzzleSet.puzzles) {
      const puzzle = normalizePuzzle(rawPuzzle, cache);
      if (puzzle.notFound) {
        badPuzzles.push({ puzzle, rawPuzzle, issues: ['Puzzle not found in CSV'] });
        continue;
      }
      const issues = verifyPuzzle(puzzle, lesson);
      if (issues.length > 0) {
        badPuzzles.push({ puzzle, rawPuzzle, issues });
      }
    }

    if (badPuzzles.length === 0) continue;

    console.log(`\n[FIXING] ${lesson.id}: ${lesson.name}`);
    console.log(`  Need ${badPuzzles.length} replacements`);

    const replacements = await findReplacements(lesson, badPuzzles.length, existingIds);

    if (replacements.length < badPuzzles.length) {
      console.log(`  WARNING: Only found ${replacements.length} replacements`);
    }

    for (let i = 0; i < Math.min(badPuzzles.length, replacements.length); i++) {
      const { puzzle: oldPuzzle, rawPuzzle } = badPuzzles[i];
      const newPuzzle = replacements[i];

      fixes.push({
        lessonId: lesson.id,
        oldPuzzle,
        rawPuzzle,
        newPuzzle,
        isSlimFormat: oldPuzzle.isSlimFormat
      });

      console.log(`  ${oldPuzzle.id} -> ${newPuzzle.id}`);
      totalFixed++;
    }
  }

  // Apply fixes to file
  if (fixes.length > 0) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Applying ${fixes.length} fixes...`);

    const puzzleSetsPath = path.join(__dirname, '..', 'data', 'lesson-puzzle-sets.ts');
    let content = fs.readFileSync(puzzleSetsPath, 'utf-8');

    for (const fix of fixes) {
      // Different handling for slim vs full format
      if (fix.isSlimFormat) {
        // For slim format, search for puzzleId and replace the slim object
        const oldPattern = `"puzzleId": "${fix.oldPuzzle.puzzleId || fix.oldPuzzle.id}"`;
        const idx = content.indexOf(oldPattern);

        if (idx === -1) {
          console.log(`  Could not find puzzle ${fix.oldPuzzle.puzzleId || fix.oldPuzzle.id} in file`);
          continue;
        }

        // Find the start and end of the slim puzzle object
        let start = idx;
        while (start > 0 && content[start] !== '{') start--;

        let end = idx;
        let depth = 1;
        while (end < content.length && depth > 0) {
          end++;
          if (content[end] === '{') depth++;
          else if (content[end] === '}') depth--;
        }

        // Create new slim format puzzle with same slot but new puzzleId and rating
        const newSlimPuzzle = {
          puzzleId: fix.newPuzzle.id,
          slot: fix.rawPuzzle.slot,
          trueDifficulty: fix.newPuzzle.rating
        };
        const newContent = JSON.stringify(newSlimPuzzle, null, 8);

        content = content.slice(0, start) + newContent + content.slice(end + 1);
      } else {
        // Full format - replace entire puzzle object
        const oldPattern = `"id": "${fix.oldPuzzle.id}"`;
        const idx = content.indexOf(oldPattern);

        if (idx === -1) {
          console.log(`  Could not find puzzle ${fix.oldPuzzle.id} in file`);
          continue;
        }

        // Find the start and end of the puzzle object
        let start = idx;
        while (start > 0 && content[start] !== '{') start--;

        let end = idx;
        let depth = 1;
        while (end < content.length && depth > 0) {
          end++;
          if (content[end] === '{') depth++;
          else if (content[end] === '}') depth--;
        }

        const newContent = JSON.stringify(fix.newPuzzle, null, 8);

        content = content.slice(0, start) + newContent + content.slice(end + 1);
      }
    }

    fs.writeFileSync(puzzleSetsPath, content);
    console.log('Fixes applied!');
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total puzzles fixed: ${totalFixed}`);

  return totalFixed;
}

// Main
const level = process.argv[2] || '1';
fixLevel(level).catch(console.error);
