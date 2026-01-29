import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTreeIdFromLessonId } from '@/lib/progress-sync';
import { getAllLessonIds } from '@/lib/curriculum-registry';

/**
 * GET /api/progress
 * Fetch user's progress (completed lessons, theme performance, streaks)
 */
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch completed lessons
  const { data: lessonProgress, error: lessonError } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('completed', true);

  if (lessonError) {
    console.error('Error fetching lesson progress:', lessonError);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }

  // Fetch theme performance
  const { data: themePerf, error: themeError } = await supabase
    .from('theme_performance')
    .select('theme, attempts, solved')
    .eq('user_id', user.id);

  if (themeError) {
    console.error('Error fetching theme performance:', themeError);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }

  // Fetch profile for streaks and progress tracking
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('current_streak, best_streak, last_played_date, current_lesson_id, current_level, lessons_completed_today, last_lesson_date, unlocked_levels')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }

  // Transform theme performance to match local format
  const themePerformance: Record<string, { attempts: number; solved: number; puzzleIds: string[] }> = {};
  for (const tp of themePerf || []) {
    themePerformance[tp.theme] = {
      attempts: tp.attempts,
      solved: tp.solved,
      puzzleIds: [], // Server doesn't track individual puzzle IDs per theme
    };
  }

  // Reset daily count if it's a new day
  const today = new Date().toISOString().split('T')[0];
  const isNewDay = profile?.last_lesson_date !== today;
  const lessonsCompletedToday = isNewDay ? 0 : (profile?.lessons_completed_today ?? 0);

  return NextResponse.json({
    completedLessons: (lessonProgress || []).map((lp) => lp.lesson_id),
    themePerformance,
    currentStreak: profile?.current_streak ?? 0,
    bestStreak: profile?.best_streak ?? 0,
    lastPlayedDate: profile?.last_played_date ?? null,
    // Progress tracking fields
    currentLessonId: profile?.current_lesson_id ?? null,
    currentLevel: profile?.current_level ?? 1,
    lessonsCompletedToday,
    lastLessonDate: profile?.last_lesson_date ?? null,
    unlockedLevels: profile?.unlocked_levels ?? [1],
  });
}

/**
 * POST /api/progress
 * Record a lesson completion or puzzle attempt
 * Body: { type: 'lesson' | 'puzzle', data: {...} }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { type, data } = body;

  if (type === 'lesson') {
    // Record lesson completion
    const { lessonId, nextLessonId } = data;
    if (!lessonId) {
      return NextResponse.json({ error: 'Missing lessonId' }, { status: 400 });
    }

    // Server-side unlock validation
    const allLessonIds = getAllLessonIds();
    const lessonIndex = allLessonIds.indexOf(lessonId);

    if (lessonIndex === -1) {
      return NextResponse.json({ error: 'Invalid lessonId' }, { status: 400 });
    }

    // Fetch user's completed lessons and admin status
    const [existingProgressResult, profileResult] = await Promise.all([
      supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('completed', true),
      supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single(),
    ]);

    const completedLessons = (existingProgressResult.data || []).map(p => p.lesson_id);
    const isAdmin = profileResult.data?.is_admin ?? false;
    // Note: startingLessonId is stored in localStorage only for now
    // Server validation uses sequential unlock logic (previous lesson must be complete)

    // Check unlock status using sequential unlock logic
    let isUnlocked = false;

    // First lesson is always unlocked
    if (lessonIndex === 0) {
      isUnlocked = true;
    }
    // Already completed lessons are "unlocked" (replay)
    else if (completedLessons.includes(lessonId)) {
      isUnlocked = true;
    }
    // Check if previous lesson is completed (sequential unlock)
    else if (lessonIndex > 0) {
      const previousLessonId = allLessonIds[lessonIndex - 1];
      if (completedLessons.includes(previousLessonId)) {
        isUnlocked = true;
      }
    }

    // Reject if locked and not admin
    if (!isUnlocked && !isAdmin) {
      return NextResponse.json({ error: 'Lesson is locked' }, { status: 403 });
    }

    const treeId = getTreeIdFromLessonId(lessonId);

    const { error } = await supabase.from('lesson_progress').upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        tree_id: treeId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    );

    if (error) {
      console.error('Error recording lesson completion:', error);
      return NextResponse.json({ error: 'Failed to record progress' }, { status: 500 });
    }

    // Update daily count and current lesson position
    const today = new Date().toISOString().split('T')[0];
    const { data: profile } = await supabase
      .from('profiles')
      .select('lessons_completed_today, last_lesson_date')
      .eq('id', user.id)
      .single();

    const isNewDay = profile?.last_lesson_date !== today;
    const newCount = isNewDay ? 1 : (profile?.lessons_completed_today ?? 0) + 1;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        lessons_completed_today: newCount,
        last_lesson_date: today,
        current_lesson_id: nextLessonId ?? null, // Track next lesson to do
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      // Don't fail the whole request for profile update failure
    }

    return NextResponse.json({ success: true });
  }

  if (type === 'unlockLevel') {
    // Record level unlock (from passing a level test)
    const { level, unlockedLevels } = data;
    if (!level || !unlockedLevels) {
      return NextResponse.json({ error: 'Missing level data' }, { status: 400 });
    }

    // Fetch current profile to get current_level
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_level')
      .eq('id', user.id)
      .single();

    const { error } = await supabase
      .from('profiles')
      .update({
        unlocked_levels: unlockedLevels,
        current_level: Math.max(level, profile?.current_level ?? 1),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error recording level unlock:', error);
      return NextResponse.json({ error: 'Failed to record level unlock' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  if (type === 'puzzle') {
    // Record puzzle attempt
    const { puzzleId, correct, themes, rating, fen, solution, timeSpentMs, updateStreak } = data;
    if (!puzzleId || typeof correct !== 'boolean') {
      return NextResponse.json({ error: 'Missing required puzzle data' }, { status: 400 });
    }

    // Insert puzzle attempt (triggers theme_performance update via DB trigger)
    const { error: puzzleError } = await supabase.from('puzzle_attempts').insert({
      user_id: user.id,
      puzzle_id: puzzleId,
      correct,
      themes: themes || [],
      rating,
      fen,
      solution,
      time_spent_ms: timeSpentMs,
    });

    if (puzzleError) {
      console.error('Error recording puzzle attempt:', puzzleError);
      return NextResponse.json({ error: 'Failed to record puzzle' }, { status: 500 });
    }

    // Update streak if requested
    if (updateStreak) {
      const today = new Date().toISOString().split('T')[0];

      // Fetch current profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_streak, best_streak, last_played_date')
        .eq('id', user.id)
        .single();

      let newStreak = 0;
      if (correct) {
        const isNewDay = profile?.last_played_date !== today;
        newStreak = isNewDay ? 1 : (profile?.current_streak ?? 0) + 1;
      }
      const newBestStreak = Math.max(newStreak, profile?.best_streak ?? 0);

      const { error: streakError } = await supabase
        .from('profiles')
        .update({
          current_streak: newStreak,
          best_streak: newBestStreak,
          last_played_date: today,
        })
        .eq('id', user.id);

      if (streakError) {
        console.error('Error updating streak:', streakError);
        // Don't fail the whole request for streak update failure
      }
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}
