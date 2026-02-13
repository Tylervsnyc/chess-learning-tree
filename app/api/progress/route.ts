import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAllLessonIds, getTreeIdFromLessonId } from '@/lib/curriculum-registry';

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

  // Fetch completed lessons (passed only)
  // A lesson is "completed" if score >= 4 OR score is null (legacy data before pass/fail system)
  // Lessons with score < 4 are failed attempts — recorded but not counted as completed
  const { data: lessonProgress, error: lessonError } = await supabase
    .from('lesson_progress')
    .select('lesson_id, score')
    .eq('user_id', user.id);

  if (lessonError) {
    console.error('Error fetching lesson progress:', lessonError);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }

  // Fetch profile for streaks, progress tracking, and current position
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('current_streak, last_activity_date, lessons_completed_today, last_lesson_date, unlocked_levels, current_position')
    .eq('id', user.id)
    .single();

  // Handle missing profile (e.g., Google OAuth users where trigger didn't fire)
  if (profileError && profileError.code === 'PGRST116') {
    // No profile found - create one
        const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Player',
      });

    if (insertError) {
      console.error('Error creating profile:', insertError);
      // Return defaults even if insert fails
    }

    // Return default values for new user
    // Filter to only passed lessons (score >= 4 or null for legacy data)
    return NextResponse.json({
      completedLessons: (lessonProgress || [])
        .filter((lp) => lp.score === null || lp.score === undefined || lp.score >= 4)
        .map((lp) => lp.lesson_id),
      currentStreak: 0,
      lastActivityDate: null,
      lessonsCompletedToday: 0,
      lastLessonDate: null,
      unlockedLevels: [1],
      currentPosition: '1.1.1',
    });
  } else if (profileError) {
    console.error('Error fetching profile:', profileError);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }

  // Reset daily count if it's a new day
  const today = new Date().toISOString().split('T')[0];
  const isNewDay = profile?.last_lesson_date !== today;
  const lessonsCompletedToday = isNewDay ? 0 : (profile?.lessons_completed_today ?? 0);

  // Filter to only passed lessons (score >= 4 or null for legacy data)
  return NextResponse.json({
    completedLessons: (lessonProgress || [])
      .filter((lp) => lp.score === null || lp.score === undefined || lp.score >= 4)
      .map((lp) => lp.lesson_id),
    currentStreak: profile?.current_streak ?? 0,
    lastActivityDate: profile?.last_activity_date ?? null,
    lessonsCompletedToday,
    lastLessonDate: profile?.last_lesson_date ?? null,
    unlockedLevels: profile?.unlocked_levels ?? [1],
    currentPosition: profile?.current_position ?? '1.1.1',
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

  if (type === 'position') {
    // Update current position only (no lesson completion)
    const { currentPosition } = data;
    if (!currentPosition) {
      return NextResponse.json({ error: 'Missing currentPosition' }, { status: 400 });
    }

    const { error } = await supabase
      .from('profiles')
      .update({ current_position: currentPosition })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating current position:', error);
      return NextResponse.json({ error: 'Failed to update position' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  if (type === 'lesson') {
    // Record lesson completion (or failed attempt)
    const { lessonId, nextLessonId, currentPosition, updateStreak, score } = data;
    if (!lessonId) {
      return NextResponse.json({ error: 'Missing lessonId' }, { status: 400 });
    }

    // Determine if the user passed (4+ out of 6 correct on first attempt)
    // score is optional for backwards compatibility — if not provided, treat as pass
    const passed = score === undefined || score === null || score >= 4;

    // Validate lessonId exists in curriculum
    const allLessonIds = getAllLessonIds();
    if (!allLessonIds.includes(lessonId)) {
      return NextResponse.json({ error: 'Invalid lessonId' }, { status: 400 });
    }

    // Ensure profile exists (for foreign key constraints and streak updates below)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingProfile) {
      await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Player',
      });
    }

    // No unlock validation here — client UI enforces sequential order.
    // Server trusts the client and just stores the data. This prevents
    // cascading sync failures when earlier lessons are missing from the DB.

    // Build lesson_progress record — always store the attempt (even on fail)
    const lessonProgressRecord: Record<string, unknown> = {
      user_id: user.id,
      lesson_id: lessonId,
      tree_id: getTreeIdFromLessonId(lessonId),
      completed_at: new Date().toISOString(),
    };

    // Store score if provided (new pass/fail system)
    if (score !== undefined && score !== null) {
      lessonProgressRecord.score = score;
    }

    const { error } = await supabase.from('lesson_progress').upsert(
      lessonProgressRecord,
      { onConflict: 'user_id,lesson_id' }
    );

    if (error) {
      console.error('Error recording lesson completion:', error);
      return NextResponse.json({ error: 'Failed to record progress' }, { status: 500 });
    }

    // Build update object - include currentPosition if provided
    const updateData: Record<string, unknown> = {};

    // Only update daily count and streak for new completions (not replays)
    if (updateStreak !== false) {
      const today = new Date().toISOString().split('T')[0];
      const { data: profileData } = await supabase
        .from('profiles')
        .select('lessons_completed_today, last_lesson_date, current_streak, last_activity_date')
        .eq('id', user.id)
        .single();

      const isNewLessonDay = profileData?.last_lesson_date !== today;
      const newLessonCount = isNewLessonDay ? 1 : (profileData?.lessons_completed_today ?? 0) + 1;

      // Calculate streak using day-based logic (per RULES.md Section 11)
      const currentStreak = profileData?.current_streak ?? 0;
      const lastActivityDate = profileData?.last_activity_date;

      // Calculate yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak: number;
      if (lastActivityDate === today) {
        newStreak = currentStreak;
      } else if (lastActivityDate === yesterdayStr) {
        newStreak = currentStreak + 1;
      } else {
        newStreak = 1;
      }

      updateData.lessons_completed_today = newLessonCount;
      updateData.last_lesson_date = today;
      updateData.last_activity_date = today;
      updateData.current_streak = newStreak;
    }

    // Only update currentPosition if the user passed (score >= 4)
    // On fail, they stay on the same lesson
    if (currentPosition && passed) {
      updateData.current_position = currentPosition;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      // Don't fail the whole request for profile update failure
    }

    return NextResponse.json({ success: true, passed });
  }

  if (type === 'unlockLevel') {
    // Record level unlock (from passing a level test)
    const { unlockedLevels, currentPosition } = data;
    if (!unlockedLevels) {
      return NextResponse.json({ error: 'Missing level data' }, { status: 400 });
    }

    // Build update object - include currentPosition if provided
    const updateData: Record<string, unknown> = {
      unlocked_levels: unlockedLevels,
    };

    if (currentPosition) {
      updateData.current_position = currentPosition;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) {
      console.error('Error recording level unlock:', error);
      return NextResponse.json({ error: 'Failed to record level unlock' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  if (type === 'puzzle') {
    // Record puzzle attempt
    // NOTE: Per RULES.md Section 23, puzzle_attempts only has: puzzle_id, lesson_id, correct, attempts
    const { puzzleId, lessonId, correct, updateStreak } = data;
    if (!puzzleId || typeof correct !== 'boolean') {
      return NextResponse.json({ error: 'Missing required puzzle data' }, { status: 400 });
    }

    // Ensure profile exists (required for foreign key constraint)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingProfile) {
      await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Player',
      });
    }

    // Insert puzzle attempt (schema has minimal columns)
    const { error: puzzleError } = await supabase.from('puzzle_attempts').insert({
      user_id: user.id,
      puzzle_id: puzzleId,
      lesson_id: lessonId || null,
      correct,
    });

    if (puzzleError) {
      console.error('Error recording puzzle attempt:', puzzleError);
      return NextResponse.json({ error: 'Failed to record puzzle' }, { status: 500 });
    }

    // Update streak if requested
    // Per RULES.md Section 11: streak tracks daily activity, not per-puzzle
    if (updateStreak) {
      const today = new Date().toISOString().split('T')[0];

      // Fetch current profile
      const { data: streakProfile } = await supabase
        .from('profiles')
        .select('current_streak, last_activity_date')
        .eq('id', user.id)
        .maybeSingle();

      const currentStreak = streakProfile?.current_streak ?? 0;
      const lastActivityDate = streakProfile?.last_activity_date;

      // Calculate yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak: number;
      if (lastActivityDate === today) {
        // Already played today - don't change streak
        newStreak = currentStreak;
      } else if (lastActivityDate === yesterdayStr) {
        // Continuing streak from yesterday - increment
        newStreak = currentStreak + 1;
      } else {
        // Missed day(s) or first time - start fresh at 1
        newStreak = 1;
      }

      const { error: streakError } = await supabase
        .from('profiles')
        .update({
          current_streak: newStreak,
          last_activity_date: today,
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
