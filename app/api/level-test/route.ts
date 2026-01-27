import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getLevelTestConfig, LEVEL_TEST_CONFIG } from '@/data/level-unlock-tests';
import * as fs from 'fs';
import * as path from 'path';

interface CleanPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  popularity: number;
  nbPlays: number;
  theme: string;
  allThemes: string[];
  gameUrl: string;
}

interface CleanPuzzleFile {
  level: number;
  ratingRange: string;
  theme: string;
  count: number;
  puzzles: CleanPuzzle[];
}

// Cache loaded files
const fileCache: Record<string, CleanPuzzleFile> = {};

function loadPuzzleFile(level: number, theme: string): CleanPuzzleFile | null {
  const cacheKey = `level${level}-${theme}`;

  if (fileCache[cacheKey]) {
    return fileCache[cacheKey];
  }

  const filePath = path.join(process.cwd(), 'data', 'clean-puzzles-v2', `${cacheKey}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as CleanPuzzleFile;
    fileCache[cacheKey] = data;
    return data;
  } catch (e) {
    console.error(`Error loading puzzle file ${filePath}:`, e);
    return null;
  }
}

/**
 * GET /api/level-test?transition=1-2
 *
 * Returns puzzles for a level unlock test.
 * Selects the least recently used variant for the user.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const transition = searchParams.get('transition');

  if (!transition) {
    return NextResponse.json(
      { error: 'Missing transition parameter (e.g., ?transition=1-2)' },
      { status: 400 }
    );
  }

  const testConfig = getLevelTestConfig(transition);
  if (!testConfig) {
    return NextResponse.json(
      { error: `Invalid transition: ${transition}` },
      { status: 400 }
    );
  }

  // Get user's test history to select variant
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let selectedVariant = testConfig.variants[0];

  if (user) {
    // Get user's past attempts for this transition
    const { data: attempts } = await supabase
      .from('level_test_attempts')
      .select('variant_id, attempted_at')
      .eq('user_id', user.id)
      .eq('from_level', testConfig.fromLevel)
      .eq('to_level', testConfig.toLevel)
      .order('attempted_at', { ascending: false });

    if (attempts && attempts.length > 0) {
      // Find least recently used variant
      const variantUsage = testConfig.variants.map(v => {
        const lastAttempt = attempts.find(a => a.variant_id === v.id);
        return {
          variant: v,
          lastUsed: lastAttempt ? new Date(lastAttempt.attempted_at).getTime() : 0,
        };
      });

      // Sort by last used (oldest/never used first)
      variantUsage.sort((a, b) => a.lastUsed - b.lastUsed);
      selectedVariant = variantUsage[0].variant;
    }
  }

  // Collect puzzles from each theme in the variant
  const puzzlesPerTheme = Math.ceil(LEVEL_TEST_CONFIG.puzzleCount / selectedVariant.themes.length);
  const allPuzzles: Array<{
    id: string;
    fen: string;
    moves: string[];
    rating: number;
    theme: string;
  }> = [];

  for (const theme of selectedVariant.themes) {
    // Try to load from the target level
    const data = loadPuzzleFile(testConfig.toLevel, theme);

    if (data) {
      // Filter by rating range
      const filtered = data.puzzles.filter(
        p => p.rating >= testConfig.ratingMin && p.rating <= testConfig.ratingMax
      );

      // Shuffle and take required number
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, puzzlesPerTheme);

      allPuzzles.push(
        ...selected.map(p => ({
          id: p.puzzleId,
          fen: p.fen,
          moves: p.moves.split(' '),
          rating: p.rating,
          theme: p.theme,
        }))
      );
    }
  }

  // Shuffle all puzzles and take exact count needed
  const shuffledAll = [...allPuzzles].sort(() => Math.random() - 0.5);
  const finalPuzzles = shuffledAll.slice(0, LEVEL_TEST_CONFIG.puzzleCount);

  if (finalPuzzles.length < LEVEL_TEST_CONFIG.puzzleCount) {
    console.warn(
      `Only found ${finalPuzzles.length} puzzles for test ${transition}, needed ${LEVEL_TEST_CONFIG.puzzleCount}`
    );
  }

  return NextResponse.json({
    transition,
    variantId: selectedVariant.id,
    config: LEVEL_TEST_CONFIG,
    targetLevel: {
      number: testConfig.toLevel,
      key: testConfig.levelKey,
      name: testConfig.levelName,
    },
    puzzles: finalPuzzles,
  });
}

/**
 * POST /api/level-test
 *
 * Record a test attempt result and optionally unlock the level.
 *
 * Body: {
 *   transition: '1-2',
 *   variantId: '1-2-v1',
 *   passed: true,
 *   correctCount: 8,
 *   wrongCount: 2
 * }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Must be logged in to record test results' },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { transition, variantId, passed, correctCount, wrongCount } = body;

  if (!transition || !variantId || passed === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const testConfig = getLevelTestConfig(transition);
  if (!testConfig) {
    return NextResponse.json(
      { error: `Invalid transition: ${transition}` },
      { status: 400 }
    );
  }

  // Record the attempt
  const { error: attemptError } = await supabase.from('level_test_attempts').insert({
    user_id: user.id,
    from_level: testConfig.fromLevel,
    to_level: testConfig.toLevel,
    variant_id: variantId,
    passed,
    correct_count: correctCount,
    wrong_count: wrongCount,
  });

  if (attemptError) {
    console.error('Error recording test attempt:', attemptError);
    return NextResponse.json(
      { error: 'Failed to record test attempt' },
      { status: 500 }
    );
  }

  // If passed, unlock the level
  if (passed) {
    // Get current unlocked levels
    const { data: profile } = await supabase
      .from('profiles')
      .select('unlocked_levels')
      .eq('id', user.id)
      .single();

    const currentLevels: number[] = profile?.unlocked_levels || [1];

    if (!currentLevels.includes(testConfig.toLevel)) {
      const newLevels = [...currentLevels, testConfig.toLevel].sort((a, b) => a - b);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ unlocked_levels: newLevels })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error unlocking level:', updateError);
        return NextResponse.json(
          { error: 'Failed to unlock level' },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({
    success: true,
    passed,
    unlockedLevel: passed ? testConfig.toLevel : null,
    redirectTo: passed ? `/learn?level=${testConfig.levelKey}` : '/learn',
  });
}
