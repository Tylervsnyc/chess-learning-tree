#!/usr/bin/env node

/**
 * Puzzle Verification Script
 *
 * Verifies that puzzles in lesson-puzzle-sets.ts match their lesson criteria
 * from the curriculum files.
 *
 * Checks:
 * 1. Required tags are present
 * 2. Excluded tags are absent
 * 3. Rating is within range
 * 4. Piece filter matches (for fork/mate lessons)
 *
 * Supports two puzzle formats:
 * - Full format: { id, fen, moves, rating, themes, url }
 * - Slim format: { puzzleId, slot, trueDifficulty } (looks up data from CSV)
 *
 * Usage: node scripts/verify-puzzles.js [level]
 * Example: node scripts/verify-puzzles.js 1
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Global puzzle cache for slim format lookups
let puzzleCache = null;

// Chess piece detection from FEN and moves
function getSquareFromUCI(uci) {
  return uci.slice(0, 2);
}

function getTargetSquareFromUCI(uci) {
  return uci.slice(2, 4);
}

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
  const fromSquare = getSquareFromUCI(firstMove);
  const piece = board[fromSquare];

  return piece ? getPieceType(piece) : null;
}

// Build puzzle cache from CSV files for slim format lookups
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
    return puzzle;
  }

  // Slim format - look up from cache
  const puzzleId = puzzle.puzzleId || puzzle.id;
  const cached = cache.get(puzzleId);

  if (!cached) {
    return {
      id: puzzleId,
      rating: puzzle.trueDifficulty || 0,
      themes: [],
      fen: null,
      moves: null,
      notFound: true
    };
  }

  return {
    ...cached,
    slot: puzzle.slot,
    trueDifficulty: puzzle.trueDifficulty
  };
}

// Load curriculum data
function loadCurriculum(level) {
  const curriculumPath = path.join(__dirname, '..', 'data', `level${level}-curriculum.ts`);
  const content = fs.readFileSync(curriculumPath, 'utf-8');

  // Simple extraction of lesson data (not a full TS parser)
  const lessons = [];

  // Match lesson objects
  const lessonRegex = /\{\s*id:\s*['"]([^'"]+)['"]\s*,\s*name:\s*['"]([^'"]+)['"]\s*,\s*description:\s*['"]([^'"]+)['"]\s*,\s*requiredTags:\s*\[([^\]]*)\]/g;

  let match;
  while ((match = lessonRegex.exec(content)) !== null) {
    const lesson = {
      id: match[1],
      name: match[2],
      requiredTags: match[4].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(t => t),
    };

    // Extract other properties for this lesson
    const lessonStart = match.index;
    const lessonEnd = content.indexOf('}', lessonStart + match[0].length);
    const lessonBlock = content.slice(lessonStart, lessonEnd + 1);

    // excludeTags
    const excludeMatch = lessonBlock.match(/excludeTags:\s*\[([^\]]*)\]/);
    if (excludeMatch) {
      lesson.excludeTags = excludeMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(t => t);
    }

    // ratingMin/Max
    const ratingMinMatch = lessonBlock.match(/ratingMin:\s*(\d+)/);
    const ratingMaxMatch = lessonBlock.match(/ratingMax:\s*(\d+)/);
    if (ratingMinMatch) lesson.ratingMin = parseInt(ratingMinMatch[1]);
    if (ratingMaxMatch) lesson.ratingMax = parseInt(ratingMaxMatch[1]);

    // pieceFilter
    const pieceFilterMatch = lessonBlock.match(/pieceFilter:\s*['"](\w+)['"]/);
    if (pieceFilterMatch) lesson.pieceFilter = pieceFilterMatch[1];

    // isMixedPractice
    if (lessonBlock.includes('isMixedPractice: true')) {
      lesson.isMixedPractice = true;
    }

    // mixedThemes
    const mixedThemesMatch = lessonBlock.match(/mixedThemes:\s*\[([^\]]*)\]/);
    if (mixedThemesMatch) {
      lesson.mixedThemes = mixedThemesMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(t => t);
    }

    lessons.push(lesson);
  }

  return lessons;
}

// Load puzzle sets
function loadPuzzleSets() {
  const puzzleSetsPath = path.join(__dirname, '..', 'data', 'lesson-puzzle-sets.ts');
  const content = fs.readFileSync(puzzleSetsPath, 'utf-8');

  // Find the start and end of the array
  const startMatch = content.match(/export const lessonPuzzleSets[^=]*=\s*\[/);
  if (!startMatch) {
    throw new Error('Could not find lessonPuzzleSets array start');
  }

  const startIdx = startMatch.index + startMatch[0].length - 1; // Include the '['

  // Find the matching closing bracket
  let depth = 1;
  let endIdx = startIdx + 1;
  while (depth > 0 && endIdx < content.length) {
    if (content[endIdx] === '[') depth++;
    else if (content[endIdx] === ']') depth--;
    endIdx++;
  }

  const jsonStr = content.slice(startIdx, endIdx);

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Failed to parse puzzle sets:', e.message);
    // Try to show where the error is
    const errorPos = e.message.match(/position (\d+)/);
    if (errorPos) {
      const pos = parseInt(errorPos[1]);
      console.error('Context around error:', jsonStr.slice(Math.max(0, pos - 50), pos + 50));
    }
    return [];
  }
}

// Verify a single puzzle against lesson criteria
function verifyPuzzle(puzzle, lesson) {
  const issues = [];

  // 1. Check required tags
  if (!lesson.isMixedPractice && lesson.requiredTags.length > 0) {
    for (const tag of lesson.requiredTags) {
      if (!puzzle.themes.includes(tag)) {
        issues.push(`Missing required tag: ${tag}`);
      }
    }
  }

  // 2. For mixed practice, check that at least one mixedTheme is present
  if (lesson.isMixedPractice && lesson.mixedThemes && lesson.mixedThemes.length > 0) {
    const hasAnyTheme = lesson.mixedThemes.some(theme => puzzle.themes.includes(theme));
    if (!hasAnyTheme) {
      issues.push(`Missing any of mixedThemes: ${lesson.mixedThemes.join(', ')}`);
    }
  }

  // 3. Check excluded tags
  if (lesson.excludeTags) {
    for (const tag of lesson.excludeTags) {
      if (puzzle.themes.includes(tag)) {
        issues.push(`Has excluded tag: ${tag}`);
      }
    }
  }

  // 4. Check rating range
  if (lesson.ratingMin && puzzle.rating < lesson.ratingMin) {
    issues.push(`Rating ${puzzle.rating} below min ${lesson.ratingMin}`);
  }
  if (lesson.ratingMax && puzzle.rating > lesson.ratingMax) {
    issues.push(`Rating ${puzzle.rating} above max ${lesson.ratingMax}`);
  }

  // 5. Check piece filter
  if (lesson.pieceFilter) {
    const movingPiece = getMovingPiece(puzzle.fen, puzzle.moves);
    if (movingPiece && movingPiece !== lesson.pieceFilter) {
      issues.push(`Piece filter mismatch: expected ${lesson.pieceFilter}, got ${movingPiece}`);
    }
  }

  return issues;
}

// Main verification function
async function verifyLevel(level) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Verifying Level ${level} Puzzles`);
  console.log('='.repeat(60));

  const lessons = loadCurriculum(level);
  const puzzleSets = loadPuzzleSets();

  console.log(`Found ${lessons.length} lessons in curriculum`);
  console.log(`Found ${puzzleSets.length} puzzle sets loaded\n`);

  // Check if we need the cache (slim format detection)
  const levelPrefix = `${level}.`;
  const levelPuzzleSets = puzzleSets.filter(ps => ps.lessonId.startsWith(levelPrefix));
  const needsCache = levelPuzzleSets.some(ps =>
    ps.puzzles && ps.puzzles.length > 0 && ps.puzzles[0].puzzleId !== undefined
  );

  let cache = new Map();
  if (needsCache) {
    cache = await buildPuzzleCache();
  }

  let totalIssues = 0;
  let totalPuzzles = 0;
  let lessonsWithIssues = 0;
  let notFoundCount = 0;

  const levelLessons = lessons.filter(l => l.id.startsWith(levelPrefix));

  for (const lesson of levelLessons) {
    const puzzleSet = puzzleSets.find(ps => ps.lessonId === lesson.id);

    if (!puzzleSet) {
      console.log(`\n[MISSING] Lesson ${lesson.id}: ${lesson.name}`);
      console.log(`  No puzzle set found!`);
      totalIssues++;
      continue;
    }

    const rawPuzzles = puzzleSet.puzzles || [];
    const puzzles = rawPuzzles.map(p => normalizePuzzle(p, cache));
    totalPuzzles += puzzles.length;

    let lessonIssues = [];

    for (const puzzle of puzzles) {
      if (puzzle.notFound) {
        lessonIssues.push({ puzzle, issues: [`Puzzle not found in CSV files`] });
        notFoundCount++;
        continue;
      }
      const issues = verifyPuzzle(puzzle, lesson);
      if (issues.length > 0) {
        lessonIssues.push({ puzzle, issues });
      }
    }

    if (lessonIssues.length > 0) {
      lessonsWithIssues++;
      console.log(`\n[ISSUES] Lesson ${lesson.id}: ${lesson.name}`);
      console.log(`  Criteria: tags=${JSON.stringify(lesson.requiredTags)}, rating=${lesson.ratingMin}-${lesson.ratingMax}${lesson.pieceFilter ? `, piece=${lesson.pieceFilter}` : ''}`);

      for (const { puzzle, issues } of lessonIssues) {
        console.log(`  Puzzle ${puzzle.id} (rating ${puzzle.rating}):`);
        console.log(`    Themes: ${puzzle.themes ? puzzle.themes.join(', ') : 'N/A'}`);
        for (const issue of issues) {
          console.log(`    - ${issue}`);
          totalIssues++;
        }
      }
    } else {
      console.log(`[OK] Lesson ${lesson.id}: ${lesson.name} (${puzzles.length} puzzles)`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total lessons checked: ${levelLessons.length}`);
  console.log(`Total puzzles checked: ${totalPuzzles}`);
  console.log(`Lessons with issues: ${lessonsWithIssues}`);
  console.log(`Total issues found: ${totalIssues}`);
  if (notFoundCount > 0) {
    console.log(`Puzzles not in CSV: ${notFoundCount}`);
  }

  return totalIssues;
}

// Generate detailed report for a specific lesson
async function generateLessonReport(lessonId) {
  const lessons = loadCurriculum(lessonId.split('.')[0]);
  const puzzleSets = loadPuzzleSets();

  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) {
    console.log(`Lesson ${lessonId} not found`);
    return;
  }

  const puzzleSet = puzzleSets.find(ps => ps.lessonId === lessonId);
  if (!puzzleSet) {
    console.log(`No puzzles found for lesson ${lessonId}`);
    return;
  }

  // Check if we need the cache
  const rawPuzzles = puzzleSet.puzzles || [];
  const needsCache = rawPuzzles.length > 0 && rawPuzzles[0].puzzleId !== undefined;

  let cache = new Map();
  if (needsCache) {
    cache = await buildPuzzleCache();
  }

  const puzzles = rawPuzzles.map(p => normalizePuzzle(p, cache));

  console.log(`\nLesson ${lesson.id}: ${lesson.name}`);
  console.log('='.repeat(60));
  console.log(`Criteria:`);
  console.log(`  Required tags: ${JSON.stringify(lesson.requiredTags)}`);
  if (lesson.excludeTags) console.log(`  Excluded tags: ${JSON.stringify(lesson.excludeTags)}`);
  console.log(`  Rating range: ${lesson.ratingMin}-${lesson.ratingMax}`);
  if (lesson.pieceFilter) console.log(`  Piece filter: ${lesson.pieceFilter}`);
  console.log();

  for (const puzzle of puzzles) {
    if (puzzle.notFound) {
      console.log(`[NOT FOUND] ${puzzle.id}`);
      console.log(`  Puzzle not found in CSV files`);
      console.log();
      continue;
    }

    const issues = verifyPuzzle(puzzle, lesson);
    const movingPiece = getMovingPiece(puzzle.fen, puzzle.moves);
    const status = issues.length > 0 ? '[ISSUE]' : '[OK]';

    console.log(`${status} ${puzzle.id} (rating ${puzzle.rating})`);
    console.log(`  FEN: ${puzzle.fen}`);
    console.log(`  Moves: ${puzzle.moves}`);
    console.log(`  Themes: ${puzzle.themes.join(', ')}`);
    console.log(`  Moving piece: ${movingPiece}`);
    console.log(`  URL: ${puzzle.url}`);

    if (issues.length > 0) {
      for (const issue of issues) {
        console.log(`  >> ${issue}`);
      }
    }
    console.log();
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node scripts/verify-puzzles.js <level>         - Verify all lessons in a level');
    console.log('  node scripts/verify-puzzles.js <lessonId>      - Detailed report for specific lesson');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/verify-puzzles.js 1               - Verify Level 1');
    console.log('  node scripts/verify-puzzles.js 1.2.1           - Detail for "Queen Mate in 1: Easy"');
    process.exit(0);
  }

  const arg = args[0];

  if (arg.includes('.')) {
    // Specific lesson
    await generateLessonReport(arg);
  } else {
    // Verify level
    const issues = await verifyLevel(arg);
    process.exit(issues > 0 ? 1 : 0);
  }
}

main().catch(console.error);
