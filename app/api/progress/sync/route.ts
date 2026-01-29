import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTreeIdFromLessonId } from '@/lib/progress-sync';

interface LocalProgress {
  completedLessons: string[];
  themePerformance: Record<string, { attempts: number; solved: number; puzzleIds: string[] }>;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string | null;
  // Progress tracking fields
  lessonsCompletedToday?: number;
  lastLessonDate?: string | null;
  unlockedLevels?: number[];
  puzzleAttempts?: Array<{
    puzzleId: string;
    lessonId: string;
    correct: boolean;
    timestamp: number;
    themes?: string[];
    rating?: number;
    fen?: string;
    solution?: string;
  }>;
}

/**
 * POST /api/progress/sync
 * Bulk sync localStorage data on login - merges local with server and returns canonical state
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

  const localProgress: LocalProgress = await request.json();

  // Fetch existing server data
  const [lessonResult, themeResult, profileResult] = await Promise.all([
    supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('completed', true),
    supabase.from('theme_performance').select('theme, attempts, solved').eq('user_id', user.id),
    supabase
      .from('profiles')
      .select('current_streak, best_streak, last_played_date, current_lesson_id, current_level, lessons_completed_today, last_lesson_date, unlocked_levels')
      .eq('id', user.id)
      .single(),
  ]);

  const serverLessons = new Set((lessonResult.data || []).map((lp) => lp.lesson_id));
  const serverThemes: Record<string, { attempts: number; solved: number }> = {};
  for (const tp of themeResult.data || []) {
    serverThemes[tp.theme] = { attempts: tp.attempts, solved: tp.solved };
  }
  const serverProfile = profileResult.data;

  // Merge completed lessons (union)
  const newLessons = localProgress.completedLessons.filter((id) => !serverLessons.has(id));

  // Insert new lessons
  if (newLessons.length > 0) {
    const lessonRows = newLessons.map((lessonId) => ({
      user_id: user.id,
      lesson_id: lessonId,
      tree_id: getTreeIdFromLessonId(lessonId),
      completed: true,
      completed_at: new Date().toISOString(),
    }));

    const { error: lessonError } = await supabase.from('lesson_progress').upsert(lessonRows, {
      onConflict: 'user_id,lesson_id',
    });

    if (lessonError) {
      console.error('Error syncing lessons:', lessonError);
    }
  }

  // Merge theme performance (take max of each stat)
  const themeUpdates: Array<{ theme: string; attempts: number; solved: number }> = [];
  for (const [theme, localStats] of Object.entries(localProgress.themePerformance)) {
    const serverStats = serverThemes[theme];
    if (!serverStats) {
      // New theme, insert
      themeUpdates.push({
        theme,
        attempts: localStats.attempts,
        solved: localStats.solved,
      });
    } else if (localStats.attempts > serverStats.attempts || localStats.solved > serverStats.solved) {
      // Local has more, update to max
      themeUpdates.push({
        theme,
        attempts: Math.max(localStats.attempts, serverStats.attempts),
        solved: Math.max(localStats.solved, serverStats.solved),
      });
    }
  }

  // Upsert theme performance
  if (themeUpdates.length > 0) {
    for (const update of themeUpdates) {
      const { error: themeError } = await supabase.from('theme_performance').upsert(
        {
          user_id: user.id,
          theme: update.theme,
          attempts: update.attempts,
          solved: update.solved,
          last_attempted_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,theme' }
      );

      if (themeError) {
        console.error('Error syncing theme:', themeError);
      }
    }
  }

  // Merge streaks (take max)
  const mergedStreak = Math.max(localProgress.currentStreak, serverProfile?.current_streak ?? 0);
  const mergedBestStreak = Math.max(localProgress.bestStreak, serverProfile?.best_streak ?? 0);
  const mergedLastPlayed =
    !localProgress.lastPlayedDate
      ? serverProfile?.last_played_date
      : !serverProfile?.last_played_date
        ? localProgress.lastPlayedDate
        : localProgress.lastPlayedDate > serverProfile.last_played_date
          ? localProgress.lastPlayedDate
          : serverProfile.last_played_date;

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

  // Update profile with merged data
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      current_streak: mergedStreak,
      best_streak: mergedBestStreak,
      last_played_date: mergedLastPlayed,
      unlocked_levels: mergedUnlockedLevels,
      lessons_completed_today: mergedLessonsCompletedToday,
      last_lesson_date: mergedLastLessonDate,
    })
    .eq('id', user.id);

  if (profileError) {
    console.error('Error updating profile:', profileError);
  }

  // Build merged response
  const allLessons = Array.from(new Set([...serverLessons, ...localProgress.completedLessons]));

  const mergedThemePerformance: Record<string, { attempts: number; solved: number; puzzleIds: string[] }> = {};
  // Start with server themes
  for (const [theme, stats] of Object.entries(serverThemes)) {
    mergedThemePerformance[theme] = { ...stats, puzzleIds: [] };
  }
  // Merge local themes
  for (const [theme, localStats] of Object.entries(localProgress.themePerformance)) {
    if (!mergedThemePerformance[theme]) {
      mergedThemePerformance[theme] = localStats;
    } else {
      mergedThemePerformance[theme] = {
        attempts: Math.max(mergedThemePerformance[theme].attempts, localStats.attempts),
        solved: Math.max(mergedThemePerformance[theme].solved, localStats.solved),
        puzzleIds: Array.from(
          new Set([...mergedThemePerformance[theme].puzzleIds, ...localStats.puzzleIds])
        ),
      };
    }
  }

  return NextResponse.json({
    completedLessons: allLessons,
    themePerformance: mergedThemePerformance,
    currentStreak: mergedStreak,
    bestStreak: mergedBestStreak,
    lastPlayedDate: mergedLastPlayed,
    // Progress tracking fields
    currentLessonId: serverProfile?.current_lesson_id ?? null,
    currentLevel: serverProfile?.current_level ?? 1,
    lessonsCompletedToday: mergedLessonsCompletedToday,
    lastLessonDate: mergedLastLessonDate,
    unlockedLevels: mergedUnlockedLevels,
  });
}
