#!/usr/bin/env tsx
/**
 * Daily Maintenance Check for Chess Path
 *
 * Validates the health of the app's data:
 * 1. All lessons have enough puzzles (>=6)
 * 2. Daily challenge has coverage for today + future
 * 3. All sections have quip responses
 * 4. Puzzle files are valid JSON
 * 5. Auto-fix: Generate missing puzzle files from CSVs
 *
 * Usage:
 *   npx tsx scripts/maintenance-check.ts           # Run all checks
 *   npx tsx scripts/maintenance-check.ts --fix     # Auto-fix missing puzzle files
 *   npx tsx scripts/maintenance-check.ts --level 3 # Check specific level only
 */

import * as fs from 'fs';
import * as path from 'path';
import { Chess } from 'chess.js';
import { createClient } from '@supabase/supabase-js';

// Import curriculum
import { level1V2, LessonCriteria } from '../data/staging/level1-v2-curriculum';
import { level2V2 } from '../data/staging/level2-v2-curriculum';
import { level3V2 } from '../data/staging/level3-v2-curriculum';
import { level4V2 } from '../data/staging/level4-v2-curriculum';
import { level5V2 } from '../data/staging/level5-v2-curriculum';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const LEVELS = [
  { num: 1, data: level1V2, puzzleDir: '0400-0800' },
  { num: 2, data: level2V2, puzzleDir: '0800-1200' },
  { num: 3, data: level3V2, puzzleDir: '0800-1200' },
  { num: 4, data: level4V2, puzzleDir: '1200-1600' },
  { num: 5, data: level5V2, puzzleDir: '1200-1600' },
];

const CLEAN_PUZZLES_DIR = path.join(process.cwd(), 'data', 'clean-puzzles-v2');
const RAW_PUZZLES_DIR = path.join(process.cwd(), 'data', 'puzzles-by-rating');
const DAILY_CHALLENGE_FILE = path.join(process.cwd(), 'data', 'daily-challenge-puzzles.json');

const MIN_PUZZLES_PER_LESSON = 6;
const MIN_PUZZLE_QUALITY_PLAYS = 500;

// Colors for console output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface CleanPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  nbPlays: number;
  theme: string;
  allThemes: string[];
}

interface CleanPuzzleFile {
  level: number;
  theme: string;
  count: number;
  puzzles: CleanPuzzle[];
}

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  details?: string[];
  fixable?: boolean;
}

interface LessonIssue {
  lessonId: string;
  lessonName: string;
  themes: string[];
  available: number;
  afterFilters: number;
  missingThemes: string[];
  reason: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

const fileCache: Record<string, CleanPuzzleFile | null> = {};

function loadPuzzleFile(level: number, theme: string): CleanPuzzleFile | null {
  const cacheKey = `level${level}-${theme}`;
  if (cacheKey in fileCache) return fileCache[cacheKey];

  const filePath = path.join(CLEAN_PUZZLES_DIR, `${cacheKey}.json`);
  if (!fs.existsSync(filePath)) {
    fileCache[cacheKey] = null;
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as CleanPuzzleFile;
    fileCache[cacheKey] = data;
    return data;
  } catch {
    fileCache[cacheKey] = null;
    return null;
  }
}

function getPieceType(fen: string, moves: string): string | null {
  try {
    const chess = new Chess(fen);
    const moveList = moves.split(' ');
    const setupMove = moveList[0];
    chess.move({
      from: setupMove.slice(0, 2),
      to: setupMove.slice(2, 4),
      promotion: setupMove.length > 4 ? setupMove[4] : undefined
    });
    const playerMove = moveList[1];
    if (!playerMove) return null;
    const piece = chess.get(playerMove.slice(0, 2) as any);
    return piece ? piece.type : null;
  } catch {
    return null;
  }
}

function getLevelFromRating(ratingMin: number, levelNum: number): number {
  // Use the actual level number from the lesson ID since puzzle files are named level{N}-{theme}.json
  return levelNum;
}

function printHeader(title: string) {
  console.log('\n' + '═'.repeat(70));
  console.log(`${BOLD}${CYAN}${title}${RESET}`);
  console.log('═'.repeat(70));
}

function printResult(result: CheckResult) {
  const icon = result.passed ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
  const color = result.passed ? GREEN : RED;
  console.log(`\n${icon} ${BOLD}${result.name}${RESET}`);
  console.log(`  ${color}${result.message}${RESET}`);
  if (result.details?.length) {
    for (const detail of result.details.slice(0, 20)) {
      console.log(`  ${DIM}${detail}${RESET}`);
    }
    if (result.details.length > 20) {
      console.log(`  ${DIM}... and ${result.details.length - 20} more${RESET}`);
    }
  }
  if (result.fixable && !result.passed) {
    console.log(`  ${YELLOW}→ Run with --fix to auto-repair${RESET}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 1: LESSONS HAVE PUZZLES
// ═══════════════════════════════════════════════════════════════════════════

function checkLessonPuzzles(levelFilter?: number): { result: CheckResult; issues: LessonIssue[] } {
  const issues: LessonIssue[] = [];
  let totalLessons = 0;
  let okLessons = 0;

  for (const { num, data } of LEVELS) {
    if (levelFilter && num !== levelFilter) continue;

    for (const block of data.blocks) {
      for (const section of block.sections) {
        for (const lesson of section.lessons) {
          totalLessons++;
          const result = countAvailablePuzzles(lesson, num);

          if (result.afterFilters >= MIN_PUZZLES_PER_LESSON) {
            okLessons++;
          } else {
            issues.push({
              lessonId: lesson.id,
              lessonName: lesson.name,
              themes: lesson.isMixedPractice ? (lesson.mixedThemes || []) : lesson.requiredTags,
              available: result.available,
              afterFilters: result.afterFilters,
              missingThemes: result.missingThemes,
              reason: result.reason,
            });
          }
        }
      }
    }
  }

  const passed = issues.length === 0;
  return {
    result: {
      name: 'Lesson Puzzle Availability',
      passed,
      message: passed
        ? `All ${totalLessons} lessons have at least ${MIN_PUZZLES_PER_LESSON} puzzles`
        : `${issues.length} of ${totalLessons} lessons have insufficient puzzles`,
      details: issues.map(i =>
        `[${i.lessonId}] ${i.lessonName}: ${i.afterFilters}/${MIN_PUZZLES_PER_LESSON} - ${i.reason}`
      ),
      fixable: issues.some(i => i.missingThemes.length > 0),
    },
    issues,
  };
}

function countAvailablePuzzles(lesson: LessonCriteria, levelNum: number): {
  available: number;
  afterFilters: number;
  missingThemes: string[];
  reason: string;
} {
  const puzzleLevel = getLevelFromRating(lesson.ratingMin, levelNum);
  const themes = lesson.isMixedPractice
    ? (lesson.mixedThemes || [])
    : lesson.requiredTags;

  let allPuzzles: CleanPuzzle[] = [];
  const missingThemes: string[] = [];

  for (const theme of themes) {
    // Try the expected level first, then fallback to adjacent levels
    let data = loadPuzzleFile(puzzleLevel, theme);
    if (!data && puzzleLevel > 1) data = loadPuzzleFile(puzzleLevel - 1, theme);
    if (!data && puzzleLevel < 5) data = loadPuzzleFile(puzzleLevel + 1, theme);

    if (data) {
      allPuzzles.push(...data.puzzles);
    } else {
      missingThemes.push(theme);
    }
  }

  if (missingThemes.length === themes.length) {
    return {
      available: 0,
      afterFilters: 0,
      missingThemes,
      reason: `Missing theme files: ${missingThemes.join(', ')}`,
    };
  }

  const totalLoaded = allPuzzles.length;

  // Apply rating filter
  allPuzzles = allPuzzles.filter(p =>
    p.rating >= lesson.ratingMin && p.rating <= lesson.ratingMax
  );

  // Apply plays filter
  const minPlays = lesson.minPlays || MIN_PUZZLE_QUALITY_PLAYS;
  allPuzzles = allPuzzles.filter(p => p.nbPlays >= minPlays);

  // Apply exclude themes
  if (lesson.excludeTags?.length) {
    allPuzzles = allPuzzles.filter(p =>
      !lesson.excludeTags!.some(t => p.allThemes.includes(t))
    );
  }

  // Apply piece filter
  if (lesson.pieceFilter) {
    const pieceMap: Record<string, string> = {
      queen: 'q', rook: 'r', bishop: 'b', knight: 'n', pawn: 'p'
    };
    const targetPiece = pieceMap[lesson.pieceFilter];
    allPuzzles = allPuzzles.filter(p => {
      const piece = getPieceType(p.fen, p.moves);
      return piece === targetPiece;
    });
  }

  let reason = 'OK';
  if (missingThemes.length > 0) {
    reason = `Missing themes: ${missingThemes.join(', ')}`;
  } else if (allPuzzles.length < MIN_PUZZLES_PER_LESSON) {
    if (lesson.pieceFilter) {
      reason = `pieceFilter="${lesson.pieceFilter}" too restrictive`;
    } else {
      reason = `Rating ${lesson.ratingMin}-${lesson.ratingMax} too narrow (${totalLoaded} loaded, ${allPuzzles.length} after filters)`;
    }
  }

  return {
    available: totalLoaded,
    afterFilters: allPuzzles.length,
    missingThemes,
    reason,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 2: DAILY CHALLENGE COVERAGE
// ═══════════════════════════════════════════════════════════════════════════

function checkDailyChallenge(): CheckResult {
  if (!fs.existsSync(DAILY_CHALLENGE_FILE)) {
    return {
      name: 'Daily Challenge Coverage',
      passed: false,
      message: 'Daily challenge puzzles file not found',
      details: [`Expected: ${DAILY_CHALLENGE_FILE}`],
    };
  }

  try {
    const content = fs.readFileSync(DAILY_CHALLENGE_FILE, 'utf-8');
    const data = JSON.parse(content);

    const today = new Date().toISOString().split('T')[0];
    const coverageEnd = data.coverageEnd;
    const daysCount = Object.keys(data.days || {}).length;

    // Check if today is covered
    const todayCovered = data.days && data.days[today];
    const todayPuzzles = todayCovered ? data.days[today].length : 0;

    // Check how many days of coverage remain
    const endDate = new Date(coverageEnd);
    const todayDate = new Date(today);
    const daysRemaining = Math.ceil((endDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));

    const details: string[] = [
      `Coverage: ${data.coverageStart} to ${data.coverageEnd}`,
      `Total days: ${daysCount}`,
      `Today (${today}): ${todayPuzzles} puzzles`,
      `Days remaining: ${daysRemaining}`,
    ];

    if (!todayCovered) {
      return {
        name: 'Daily Challenge Coverage',
        passed: false,
        message: `Today (${today}) has no puzzles!`,
        details,
      };
    }

    if (daysRemaining < 7) {
      return {
        name: 'Daily Challenge Coverage',
        passed: false,
        message: `Only ${daysRemaining} days of coverage remaining - regenerate soon!`,
        details,
      };
    }

    if (todayPuzzles < 7) {
      return {
        name: 'Daily Challenge Coverage',
        passed: false,
        message: `Today only has ${todayPuzzles} puzzles (need 7+)`,
        details,
      };
    }

    return {
      name: 'Daily Challenge Coverage',
      passed: true,
      message: `${daysRemaining} days of coverage, ${todayPuzzles} puzzles for today`,
      details,
    };
  } catch (e) {
    return {
      name: 'Daily Challenge Coverage',
      passed: false,
      message: `Failed to parse daily challenge file: ${e}`,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 3: QUIP COVERAGE (Section IDs have responses)
// ═══════════════════════════════════════════════════════════════════════════

function checkQuipCoverage(): CheckResult {
  // Dynamically import the responses file
  const responsesPath = path.join(process.cwd(), 'data', 'staging', 'v2-puzzle-responses.ts');

  if (!fs.existsSync(responsesPath)) {
    return {
      name: 'Quip Response Coverage',
      passed: false,
      message: 'v2-puzzle-responses.ts not found',
    };
  }

  // Extract section IDs from curriculum
  const allSectionIds: string[] = [];
  for (const { data } of LEVELS) {
    for (const block of data.blocks) {
      for (const section of block.sections) {
        allSectionIds.push(section.id);
      }
    }
  }

  // Read the responses file and check for section IDs
  const content = fs.readFileSync(responsesPath, 'utf-8');
  const missingSections: string[] = [];

  for (const sectionId of allSectionIds) {
    // Look for the section ID as a key in the responses
    const pattern = new RegExp(`['"]${sectionId.replace('.', '\\.')}['"]\\s*:`);
    if (!pattern.test(content)) {
      missingSections.push(sectionId);
    }
  }

  if (missingSections.length > 0) {
    return {
      name: 'Quip Response Coverage',
      passed: false,
      message: `${missingSections.length} sections missing quip responses`,
      details: missingSections.map(s => `Section ${s} has no responses`),
    };
  }

  return {
    name: 'Quip Response Coverage',
    passed: true,
    message: `All ${allSectionIds.length} sections have quip responses`,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 4: PUZZLE FILE INTEGRITY
// ═══════════════════════════════════════════════════════════════════════════

function checkPuzzleFileIntegrity(): CheckResult {
  const puzzleFiles = fs.readdirSync(CLEAN_PUZZLES_DIR).filter(f =>
    f.endsWith('.json') && f !== 'summary.json'
  );
  const issues: string[] = [];
  let totalPuzzles = 0;

  for (const file of puzzleFiles) {
    const filePath = path.join(CLEAN_PUZZLES_DIR, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content) as CleanPuzzleFile;

      if (!data.puzzles || !Array.isArray(data.puzzles)) {
        issues.push(`${file}: missing or invalid puzzles array`);
        continue;
      }

      totalPuzzles += data.puzzles.length;

      if (data.puzzles.length === 0) {
        issues.push(`${file}: empty puzzle array`);
      }

      // Spot check first puzzle for required fields
      if (data.puzzles.length > 0) {
        const p = data.puzzles[0];
        if (!p.puzzleId || !p.fen || !p.moves || typeof p.rating !== 'number') {
          issues.push(`${file}: puzzle missing required fields`);
        }
      }
    } catch (e) {
      issues.push(`${file}: JSON parse error - ${e}`);
    }
  }

  if (issues.length > 0) {
    return {
      name: 'Puzzle File Integrity',
      passed: false,
      message: `${issues.length} puzzle files have issues`,
      details: issues,
    };
  }

  return {
    name: 'Puzzle File Integrity',
    passed: true,
    message: `${puzzleFiles.length} puzzle files OK (${totalPuzzles.toLocaleString()} total puzzles)`,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 5: LESSON ID UNIQUENESS
// ═══════════════════════════════════════════════════════════════════════════

function checkLessonIdUniqueness(): CheckResult {
  const idCounts: Record<string, number> = {};
  let totalLessons = 0;

  for (const { data } of LEVELS) {
    for (const block of data.blocks) {
      for (const section of block.sections) {
        for (const lesson of section.lessons) {
          totalLessons++;
          idCounts[lesson.id] = (idCounts[lesson.id] || 0) + 1;
        }
      }
    }
  }

  const duplicates = Object.entries(idCounts)
    .filter(([, count]) => count > 1)
    .map(([id, count]) => `${id} appears ${count} times`);

  if (duplicates.length > 0) {
    return {
      name: 'Lesson ID Uniqueness',
      passed: false,
      message: `${duplicates.length} duplicate lesson IDs found`,
      details: duplicates,
    };
  }

  return {
    name: 'Lesson ID Uniqueness',
    passed: true,
    message: `All ${totalLessons} lesson IDs are unique`,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 6: DATABASE CONNECTIVITY
// ═══════════════════════════════════════════════════════════════════════════

async function checkDatabaseConnectivity(): Promise<CheckResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      name: 'Database Connectivity',
      passed: false,
      message: 'Missing Supabase environment variables',
      details: [
        !supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL not set' : '',
        !serviceRoleKey ? 'SUPABASE_SERVICE_ROLE_KEY not set' : '',
      ].filter(Boolean),
    };
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Try a simple query - count profiles
    const startTime = Date.now();
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    const latency = Date.now() - startTime;

    if (error) {
      return {
        name: 'Database Connectivity',
        passed: false,
        message: `Database query failed: ${error.message}`,
        details: [error.details || '', error.hint || ''].filter(Boolean),
      };
    }

    return {
      name: 'Database Connectivity',
      passed: true,
      message: `Connected successfully (${latency}ms latency, ${count} profiles)`,
      details: [`Supabase URL: ${supabaseUrl.replace(/https?:\/\//, '').split('.')[0]}...`],
    };
  } catch (e) {
    return {
      name: 'Database Connectivity',
      passed: false,
      message: `Connection error: ${e}`,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK 7: FEATURE FLAG STATUS
// ═══════════════════════════════════════════════════════════════════════════

function checkFeatureFlags(): CheckResult {
  const flagsPath = path.join(process.cwd(), 'lib', 'config', 'feature-flags.ts');

  if (!fs.existsSync(flagsPath)) {
    return {
      name: 'Feature Flag Status',
      passed: false,
      message: 'feature-flags.ts not found',
    };
  }

  try {
    const content = fs.readFileSync(flagsPath, 'utf-8');

    // Parse flags from the file
    const flagMatches = content.matchAll(/(\w+):\s*(true|false)/g);
    const flags: { name: string; enabled: boolean }[] = [];

    for (const match of flagMatches) {
      flags.push({
        name: match[1],
        enabled: match[2] === 'true',
      });
    }

    if (flags.length === 0) {
      return {
        name: 'Feature Flag Status',
        passed: true,
        message: 'No feature flags defined',
      };
    }

    const enabledCount = flags.filter(f => f.enabled).length;
    const disabledCount = flags.filter(f => !f.enabled).length;

    return {
      name: 'Feature Flag Status',
      passed: true,
      message: `${flags.length} flags (${enabledCount} enabled, ${disabledCount} disabled)`,
      details: flags.map(f => `${f.enabled ? '🟢' : '⚫'} ${f.name}: ${f.enabled ? 'ON' : 'OFF'}`),
    };
  } catch (e) {
    return {
      name: 'Feature Flag Status',
      passed: false,
      message: `Error reading flags: ${e}`,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTO-FIX: Generate missing puzzle files from CSVs
// ═══════════════════════════════════════════════════════════════════════════

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  popularity: number;
  nbPlays: number;
  themes: string[];
  gameUrl: string;
}

function generateMissingPuzzleFiles(issues: LessonIssue[]): void {
  // Collect all missing themes by level
  const missingByLevel: Record<number, Set<string>> = {};

  for (const issue of issues) {
    for (const theme of issue.missingThemes) {
      const levelNum = parseInt(issue.lessonId.split('.')[0], 10);
      if (!missingByLevel[levelNum]) missingByLevel[levelNum] = new Set();
      missingByLevel[levelNum].add(theme);
    }
  }

  // Map level to puzzle directory
  const levelToPuzzleDir: Record<number, string> = {
    1: '0400-0800',
    2: '0800-1200',
    3: '0800-1200',
    4: '1200-1600',
    5: '1200-1600',
  };

  const levelToFileLevel: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
  };

  let generated = 0;
  let failed = 0;

  for (const [levelStr, themes] of Object.entries(missingByLevel)) {
    const levelNum = parseInt(levelStr, 10);
    const puzzleDir = levelToPuzzleDir[levelNum];
    const fileLevel = levelToFileLevel[levelNum];

    for (const theme of themes) {
      console.log(`  Generating level${fileLevel}-${theme}.json from ${puzzleDir}/${theme}.csv...`);

      const csvPath = path.join(RAW_PUZZLES_DIR, puzzleDir, `${theme}.csv`);
      if (!fs.existsSync(csvPath)) {
        console.log(`    ${RED}CSV not found: ${csvPath}${RESET}`);
        failed++;
        continue;
      }

      try {
        const puzzles = parseCsvFile(csvPath, theme);
        if (puzzles.length === 0) {
          console.log(`    ${YELLOW}No puzzles found in CSV${RESET}`);
          failed++;
          continue;
        }

        // Determine rating range for this level
        const ratingRanges: Record<number, { min: number; max: number }> = {
          1: { min: 400, max: 800 },
          2: { min: 800, max: 1200 },
          3: { min: 1000, max: 1300 },
          4: { min: 1200, max: 1600 },
          5: { min: 1400, max: 1700 },
        };
        const range = ratingRanges[fileLevel];

        // Filter puzzles to rating range and quality
        const filtered = puzzles.filter(p =>
          p.rating >= range.min &&
          p.rating <= range.max &&
          p.nbPlays >= MIN_PUZZLE_QUALITY_PLAYS
        );

        const output: CleanPuzzleFile = {
          level: fileLevel,
          theme,
          count: filtered.length,
          puzzles: filtered.map(p => ({
            puzzleId: p.puzzleId,
            fen: p.fen,
            moves: p.moves,
            rating: p.rating,
            nbPlays: p.nbPlays,
            theme,
            allThemes: p.themes,
          })),
        };

        const outputPath = path.join(CLEAN_PUZZLES_DIR, `level${fileLevel}-${theme}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
        console.log(`    ${GREEN}Generated ${filtered.length} puzzles${RESET}`);
        generated++;
      } catch (e) {
        console.log(`    ${RED}Error: ${e}${RESET}`);
        failed++;
      }
    }
  }

  console.log(`\n  ${GREEN}Generated ${generated} files${RESET}, ${RED}${failed} failed${RESET}`);
}

function parseCsvFile(csvPath: string, theme: string): RawPuzzle[] {
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');
  const puzzles: RawPuzzle[] = [];

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 9) continue;

    puzzles.push({
      puzzleId: parts[0],
      fen: parts[1],
      moves: parts[2],
      rating: parseInt(parts[3], 10),
      popularity: parseInt(parts[5], 10),
      nbPlays: parseInt(parts[6], 10),
      themes: parts[7].split(' '),
      gameUrl: parts[8],
    });
  }

  return puzzles;
}

// ═══════════════════════════════════════════════════════════════════════════
// ENVIRONMENT
// ═══════════════════════════════════════════════════════════════════════════

function loadEnvFile() {
  // Load .env.local if it exists (Next.js convention)
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.slice(0, eqIndex);
        let value = trimmed.slice(eqIndex + 1);
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  loadEnvFile();
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  const levelArg = args.find(a => a.startsWith('--level='))?.split('=')[1] ||
                   args[args.indexOf('--level') + 1];
  const levelFilter = levelArg ? parseInt(levelArg, 10) : undefined;

  console.log('\n' + '═'.repeat(70));
  console.log(`${BOLD}${CYAN}♞ CHESS PATH MAINTENANCE CHECK${RESET}`);
  console.log(`${DIM}${new Date().toISOString()}${RESET}`);
  console.log('═'.repeat(70));

  if (levelFilter) {
    console.log(`${YELLOW}Filtering to Level ${levelFilter} only${RESET}`);
  }

  const results: CheckResult[] = [];

  // Run all checks
  printHeader('1. LESSON PUZZLE AVAILABILITY');
  const lessonCheck = checkLessonPuzzles(levelFilter);
  results.push(lessonCheck.result);
  printResult(lessonCheck.result);

  if (shouldFix && lessonCheck.issues.length > 0) {
    console.log(`\n${YELLOW}Attempting to auto-fix missing puzzle files...${RESET}`);
    generateMissingPuzzleFiles(lessonCheck.issues);
  }

  printHeader('2. DAILY CHALLENGE COVERAGE');
  const dailyResult = checkDailyChallenge();
  results.push(dailyResult);
  printResult(dailyResult);

  printHeader('3. QUIP RESPONSE COVERAGE');
  const quipResult = checkQuipCoverage();
  results.push(quipResult);
  printResult(quipResult);

  printHeader('4. PUZZLE FILE INTEGRITY');
  const integrityResult = checkPuzzleFileIntegrity();
  results.push(integrityResult);
  printResult(integrityResult);

  printHeader('5. LESSON ID UNIQUENESS');
  const uniqueResult = checkLessonIdUniqueness();
  results.push(uniqueResult);
  printResult(uniqueResult);

  printHeader('6. DATABASE CONNECTIVITY');
  const dbResult = await checkDatabaseConnectivity();
  results.push(dbResult);
  printResult(dbResult);

  printHeader('7. FEATURE FLAG STATUS');
  const flagsResult = checkFeatureFlags();
  results.push(flagsResult);
  printResult(flagsResult);

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log(`${BOLD}SUMMARY${RESET}`);
  console.log('═'.repeat(70));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  for (const r of results) {
    const icon = r.passed ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    console.log(`  ${icon} ${r.name}`);
  }

  console.log('');
  if (failed === 0) {
    console.log(`${GREEN}${BOLD}All ${passed} checks passed!${RESET}`);
  } else {
    console.log(`${RED}${BOLD}${failed} of ${passed + failed} checks failed${RESET}`);
  }
  console.log('═'.repeat(70) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
