import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTreeIdFromLessonId } from '@/lib/curriculum-registry';

interface LocalProgress {
  completedLessons: string[];
  currentStreak: number;
  lastActivityDate: string | null;
  currentPosition?: string;
  // Progress tracking fields
  lessonsCompletedToday?: number;
  lastLessonDate?: string | null;
  unlockedLevels?: number[];
}

/**
 * POST /api/progress/sync
 * Bulk sync localStorage data on login - merges local with server and returns canonical state
 */

/**
 * When the time a lesson was completed locally is imported on login, use the
 * day the user actually last did a lesson (or was last active) rather than the
 * current time. Falls back to a fixed past timestamp when no local date exists,
 * so a migration import can never trip today's streak by itself.
 */
function importTimestamp(local: LocalProgress): string {
  const day = local.lastLessonDate || local.lastActivityDate;
  if (day && /^\d{4}-\d{2}-\d{2}$/.test(day)) {
    // Noon UTC of that day — lands on the right calendar day in essentially all TZs.
    return new Date(`${day}T12:00:00Z`).toISOString();
  }
  // No local date info: backdate well into the past so it isn't counted as today.
  return '2020-01-01T00:00:00Z';
}
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const localProgress: LocalProgress = await request.json();

  // Fetch existing server data
  // NOTE: Per RULES.md Section 23, we removed: elo_rating, current_lesson_id, current_level, best_streak, theme_performance
  const [lessonResult, profileResult] = await Promise.all([
    supabase
      .from('lesson_progress')
      .select('lesson_id, score')
      .eq('user_id', user.id),
    supabase
      .from('profiles')
      .select('current_streak, last_activity_date, lessons_completed_today, last_lesson_date, unlocked_levels, current_position')
      .eq('id', user.id)
      .single(),
  ]);

  // Only count passed lessons as "completed" (score >= 4 or null for legacy data)
  const serverLessons = new Set(
    (lessonResult.data || [])
      .filter((lp) => lp.score === null || lp.score === undefined || lp.score >= 4)
      .map((lp) => lp.lesson_id)
  );
  const serverProfile = profileResult.data;

  // Merge completed lessons (union)
  const newLessons = localProgress.completedLessons.filter((id) => !serverLessons.has(id));

  // Insert new lessons.
  // These are completions imported from localStorage on login — they happened
  // in an EARLIER session, not "now". Stamping them with the current time would
  // re-date old guest progress to today and falsely trip today's streak (the
  // streak is derived from lesson_progress.completed_at). So we backdate them to
  // the day the user actually last did a lesson locally. This still preserves the
  // intended happy path (finish the tutorial today as a guest → sign up → day-1
  // streak), while stale progress from a prior day no longer counts as today.
  if (newLessons.length > 0) {
    const importedCompletedAt = importTimestamp(localProgress);
    const lessonRows = newLessons.map((lessonId) => ({
      user_id: user.id,
      lesson_id: lessonId,
      tree_id: getTreeIdFromLessonId(lessonId),
      completed_at: importedCompletedAt,
    }));

    const { error: lessonError } = await supabase.from('lesson_progress').upsert(lessonRows, {
      onConflict: 'user_id,lesson_id',
    });

    if (lessonError) {
      console.error('Error syncing lessons:', lessonError);
    }
  }

  // Merge streaks - but NOT for new users (prevents localStorage contamination from previous sessions)
  // A "new user" has no completed lessons AND no activity date on server
  const isNewUser = serverLessons.size === 0 && !serverProfile?.last_activity_date;
  const mergedStreak = isNewUser
    ? (serverProfile?.current_streak ?? 0)  // New user: use server default (0)
    : Math.max(localProgress.currentStreak, serverProfile?.current_streak ?? 0);
  const mergedLastActivity =
    !localProgress.lastActivityDate
      ? serverProfile?.last_activity_date
      : !serverProfile?.last_activity_date
        ? localProgress.lastActivityDate
        : localProgress.lastActivityDate > serverProfile.last_activity_date
          ? localProgress.lastActivityDate
          : serverProfile.last_activity_date;

  // Merge unlocked levels (union of local and server)
  const serverUnlockedLevels = serverProfile?.unlocked_levels ?? [1];
  const localUnlockedLevels = localProgress.unlockedLevels ?? [1];
  const mergedUnlockedLevels = Array.from(
    new Set([...serverUnlockedLevels, ...localUnlockedLevels])
  ).sort((a, b) => a - b);

  // Handle daily lesson count - server takes priority but reset on new day
  const today = new Date().toISOString().split('T')[0];
  const serverIsNewDay = serverProfile?.last_lesson_date !== today;
  const mergedLessonsCompletedToday = serverIsNewDay
    ? (localProgress.lastLessonDate === today ? (localProgress.lessonsCompletedToday ?? 0) : 0)
    : (serverProfile?.lessons_completed_today ?? 0);
  const mergedLastLessonDate =
    !localProgress.lastLessonDate
      ? serverProfile?.last_lesson_date
      : !serverProfile?.last_lesson_date
        ? localProgress.lastLessonDate
        : localProgress.lastLessonDate > serverProfile.last_lesson_date
          ? localProgress.lastLessonDate
          : serverProfile.last_lesson_date;

  // Merge currentPosition: local wins unless local is at default
  const localPosition = localProgress.currentPosition;
  const serverPosition = serverProfile?.current_position;
  const localIsDefault = !localPosition || localPosition === '1.1.1';
  const serverHasProgress = serverPosition && serverPosition !== '1.1.1';
  const mergedCurrentPosition = (localIsDefault && serverHasProgress)
    ? serverPosition
    : (localPosition || serverPosition || '1.1.1');

  // Update profile with merged data
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      current_streak: mergedStreak,
      last_activity_date: mergedLastActivity,
      unlocked_levels: mergedUnlockedLevels,
      lessons_completed_today: mergedLessonsCompletedToday,
      last_lesson_date: mergedLastLessonDate,
      current_position: mergedCurrentPosition,
    })
    .eq('id', user.id);

  if (profileError) {
    console.error('Error updating profile:', profileError);
  }

  // Build merged response
  const allLessons = Array.from(new Set([...serverLessons, ...localProgress.completedLessons]));

  return NextResponse.json({
    completedLessons: allLessons,
    currentStreak: mergedStreak,
    lastActivityDate: mergedLastActivity,
    lessonsCompletedToday: mergedLessonsCompletedToday,
    lastLessonDate: mergedLastLessonDate,
    unlockedLevels: mergedUnlockedLevels,
    currentPosition: mergedCurrentPosition,
  });
}
