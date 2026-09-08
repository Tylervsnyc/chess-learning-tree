'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useUser';
import { UserTier, UserPermissions, LessonAccess, LESSON_LIMITS } from '@/types/permissions';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { PRO_FREE_LIMITS } from '@/lib/subscription';
import { getLevelFromLessonId } from '@/lib/curriculum-registry';

const STORAGE_KEY = 'chess_path_lessons';

interface LessonTrackingData {
  lessonsCompletedToday: number;
  totalLessonsAsAnon: number;
  lastResetDate: string; // YYYY-MM-DD
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function getStoredLessonData(): LessonTrackingData {
  if (typeof window === 'undefined') {
    return { lessonsCompletedToday: 0, totalLessonsAsAnon: 0, lastResetDate: getTodayDateString() };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as LessonTrackingData;
      // Reset daily count if it's a new day
      if (data.lastResetDate !== getTodayDateString()) {
        return {
          ...data,
          lessonsCompletedToday: 0,
          lastResetDate: getTodayDateString(),
        };
      }
      return data;
    }
  } catch (e) {
    console.error('Error reading lesson data:', e);
  }

  return { lessonsCompletedToday: 0, totalLessonsAsAnon: 0, lastResetDate: getTodayDateString() };
}

function saveLessonData(data: LessonTrackingData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving lesson data:', e);
  }
}

/**
 * Gate C only, with NO network: is a level behind Pro for this user? Use this
 * on surfaces that don't need the daily-limit machinery (Learn page, level
 * tests) — `usePermissions()` fetches /api/progress or /api/anonymous-lessons
 * on mount, which those pages never needed (perf convention: no new requests
 * per page). Same rule as usePermissions().isLevelProLocked.
 */
export function useLevelProLock() {
  const { user, profile, loading } = useUser();
  const tier: UserTier = !user
    ? 'anonymous'
    : profile?.is_admin
      ? 'admin'
      : profile?.subscription_status === 'premium' || profile?.subscription_status === 'trial'
        ? 'premium'
        : 'free';
  const maxFreeLevel: number | null =
    FEATURE_FLAGS.PRO && !loading && tier !== 'premium' && tier !== 'admin'
      ? PRO_FREE_LIMITS.FREE_LESSON_LEVELS
      : null;
  const isLevelProLocked = useCallback(
    (level: number): boolean => maxFreeLevel !== null && level > maxFreeLevel,
    [maxFreeLevel],
  );
  return { isLevelProLocked, maxFreeLevel };
}

export function usePermissions() {
  const { user, profile, loading: userLoading } = useUser();
  const [lessonData, setLessonData] = useState<LessonTrackingData>(getStoredLessonData);
  const [loading, setLoading] = useState(true);

  // Determine user tier
  const determineTier = (): UserTier => {
    if (!user) return 'anonymous';
    if (profile?.is_admin) return 'admin';
    if (profile?.subscription_status === 'premium' || profile?.subscription_status === 'trial') return 'premium';
    return 'free';
  };
  const tier = determineTier();

  // Combined loading state - true until both local state and user are loaded
  const isLoading = loading || userLoading;

  // Gate C (Chess Path lesson depth): levels 1..FREE_LESSON_LEVELS are free,
  // the rest are Pro. ONLY while FEATURE_FLAGS.PRO is on; premium/admin never
  // locked; while loading → permissive (null) so nothing flashes locked.
  const maxFreeLevel: number | null =
    FEATURE_FLAGS.PRO && !isLoading && tier !== 'premium' && tier !== 'admin'
      ? PRO_FREE_LIMITS.FREE_LESSON_LEVELS
      : null;

  // Calculate permissions
  // IMPORTANT: While loading, we default to permissive values to prevent
  // flash of "blocked" content before auth completes
  const permissions: UserPermissions = (() => {
    const data = lessonData;

    // While still loading, return permissive defaults to prevent blocking UI flash
    // The actual tier will be calculated once loading completes
    if (isLoading) {
      return {
        tier: 'anonymous' as UserTier, // Will be recalculated
        dailyLessonLimit: null,
        lessonsCompletedToday: 0,
        lessonsRemainingToday: null,
        maxFreeLevel: null,
        canAccessLesson: true, // Don't block while loading!
        canSkipLevels: true,   // Don't block while loading!
        canAccessAllPuzzles: false,
        shouldPromptSignup: false,
        shouldPromptPremium: false,
        dailyResetTime: null,
      };
    }

    // All features unlocked during development — re-enable tier gating later
    return {
      tier,
      dailyLessonLimit: null,
      lessonsCompletedToday: data.lessonsCompletedToday,
      lessonsRemainingToday: null,
      maxFreeLevel,
      canAccessLesson: true,
      canSkipLevels: true,
      canAccessAllPuzzles: true,
      shouldPromptSignup: false,
      shouldPromptPremium: false,
      dailyResetTime: null,
    };
  })();

  // Initialize
  useEffect(() => {
    setLessonData(getStoredLessonData());
    setLoading(false);
  }, []);

  // Fetch server-side daily count for authenticated users
  // This prevents bypassing limits by clearing localStorage
  useEffect(() => {
    if (user && !userLoading) {
      fetch('/api/progress')
        .then(res => res.json())
        .then(data => {
          if (data.lessonsCompletedToday !== undefined) {
            setLessonData(prev => {
              // Server value takes priority
              const serverCount = data.lessonsCompletedToday;
              const updated = {
                ...prev,
                lessonsCompletedToday: serverCount,
                lastResetDate: data.lastLessonDate || prev.lastResetDate,
              };
              saveLessonData(updated);
              return updated;
            });
          }
        })
        .catch(err => console.error('Failed to fetch server progress:', err));
    }
  }, [user, userLoading]);

  // Fetch server-side lesson count for ANONYMOUS users (uses httpOnly cookie)
  // This prevents bypassing limits by clearing localStorage
  useEffect(() => {
    if (!user && !userLoading) {
      fetch('/api/anonymous-lessons')
        .then(res => res.json())
        .then(data => {
          if (data.lessonsCompleted !== undefined) {
            setLessonData(prev => {
              // Server value (from httpOnly cookie) takes priority
              const serverCount = data.lessonsCompleted;
              // Take the max of local and server to prevent regression
              const updated = {
                ...prev,
                totalLessonsAsAnon: Math.max(prev.totalLessonsAsAnon, serverCount),
              };
              saveLessonData(updated);
              return updated;
            });
          }
        })
        .catch(err => console.error('Failed to fetch anonymous lesson count:', err));
    }
  }, [user, userLoading]);

  // Refresh data when user changes
  useEffect(() => {
    if (!userLoading) {
      setLessonData(getStoredLessonData());
    }
  }, [user, userLoading]);

  // Record a completed lesson
  // Returns { shouldPromptSignup } so callers get the freshly-computed value
  // (avoids stale closure — React batches re-renders, so the derived
  //  shouldPromptSignup from permissions hasn't recalculated yet)
  const recordLessonComplete = useCallback((): { shouldPromptSignup: boolean } => {
    let newShouldPromptSignup = false;

    setLessonData(prev => {
      const updated: LessonTrackingData = {
        ...prev,
        lessonsCompletedToday: prev.lessonsCompletedToday + 1,
        totalLessonsAsAnon: tier === 'anonymous'
          ? prev.totalLessonsAsAnon + 1
          : prev.totalLessonsAsAnon,
        lastResetDate: getTodayDateString(),
      };

      // Pre-calculate signup prompt for callers (avoids stale closure issue)
      if (tier === 'anonymous') {
        const limit = LESSON_LIMITS.anonymous.totalLessons;
        const remaining = Math.max(0, limit - updated.totalLessonsAsAnon);
        newShouldPromptSignup = remaining === 0;
      }

      saveLessonData(updated);
      return updated;
    });

    // For anonymous users, also update the server-side httpOnly cookie
    // This prevents bypassing limits by clearing localStorage
    if (tier === 'anonymous') {
      fetch('/api/anonymous-lessons', { method: 'POST' })
        .catch(err => console.error('Failed to update anonymous lesson count:', err));
    }

    return { shouldPromptSignup: newShouldPromptSignup };
  }, [tier]);

  // Reset daily count (for testing or manual reset)
  const resetDailyCount = useCallback(() => {
    setLessonData(prev => {
      const updated: LessonTrackingData = {
        ...prev,
        lessonsCompletedToday: 0,
        lastResetDate: getTodayDateString(),
      };
      saveLessonData(updated);
      return updated;
    });
  }, []);

  // Is this level behind Pro for THIS user? (false with PRO off, for Pro/admin,
  // and while loading.) Progression unlocking (useProgress) is a separate axis —
  // a level can be progression-unlocked AND Pro-locked.
  const isLevelProLocked = useCallback((level: number): boolean => {
    return maxFreeLevel !== null && level > maxFreeLevel;
  }, [maxFreeLevel]);

  // Why a lesson is or isn't open: signup / daily limit first (existing rules),
  // then the Pro level gate. 'ok' is the only value that lets the lesson render.
  const lessonAccess = useCallback((lessonId: string): LessonAccess => {
    if (tier === 'admin') return 'ok';
    if (!permissions.canAccessLesson) {
      return permissions.shouldPromptSignup ? 'signup' : 'daily_limit';
    }
    if (isLevelProLocked(getLevelFromLessonId(lessonId))) return 'pro';
    return 'ok';
  }, [tier, permissions.canAccessLesson, permissions.shouldPromptSignup, isLevelProLocked]);

  // Check if user can access a specific lesson (boolean view of lessonAccess)
  const canAccessLessonById = useCallback((lessonId: string): boolean => {
    return lessonAccess(lessonId) === 'ok';
  }, [lessonAccess]);

  return {
    ...permissions,
    loading: isLoading,
    recordLessonComplete,
    resetDailyCount,
    canAccessLessonById,
    lessonAccess,
    isLevelProLocked,
  };
}
