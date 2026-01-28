'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useUser';
import { UserTier, UserPermissions, LESSON_LIMITS } from '@/types/permissions';

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

export function usePermissions() {
  const { user, profile, loading: userLoading } = useUser();
  const [lessonData, setLessonData] = useState<LessonTrackingData>(getStoredLessonData);
  const [loading, setLoading] = useState(true);

  // Determine user tier
  const determineTier = (): UserTier => {
    if (!user) return 'anonymous';
    if (profile?.is_admin) return 'admin';
    if (profile?.subscription_status === 'premium') return 'premium';
    return 'free';
  };
  const tier = determineTier();

  // Combined loading state - true until both local state and user are loaded
  const isLoading = loading || userLoading;

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
        canAccessLesson: true, // Don't block while loading!
        canSkipLevels: true,   // Don't block while loading!
        canAccessAllPuzzles: false,
        shouldPromptSignup: false,
        shouldPromptPremium: false,
        dailyResetTime: null,
      };
    }

    switch (tier) {
      case 'anonymous': {
        const limit = LESSON_LIMITS.anonymous.totalLessons;
        const remaining = Math.max(0, limit - data.totalLessonsAsAnon);
        return {
          tier,
          dailyLessonLimit: limit,
          lessonsCompletedToday: data.totalLessonsAsAnon,
          lessonsRemainingToday: remaining,
          canAccessLesson: remaining > 0,
          canSkipLevels: false,
          canAccessAllPuzzles: false,
          shouldPromptSignup: remaining === 0,
          shouldPromptPremium: false,
          dailyResetTime: null, // Anonymous doesn't reset - must sign up
        };
      }

      case 'free': {
        const limit = LESSON_LIMITS.free.dailyLimit;
        const remaining = Math.max(0, limit - data.lessonsCompletedToday);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        return {
          tier,
          dailyLessonLimit: limit,
          lessonsCompletedToday: data.lessonsCompletedToday,
          lessonsRemainingToday: remaining,
          canAccessLesson: remaining > 0,
          canSkipLevels: true,
          canAccessAllPuzzles: false,
          shouldPromptSignup: false,
          shouldPromptPremium: remaining === 0,
          dailyResetTime: tomorrow,
        };
      }

      case 'admin':
      case 'premium': {
        const isAdmin = tier === 'admin';
        return {
          tier,
          dailyLessonLimit: null,
          lessonsCompletedToday: data.lessonsCompletedToday,
          lessonsRemainingToday: null,
          canAccessLesson: true,
          canSkipLevels: true,
          canAccessAllPuzzles: isAdmin,
          shouldPromptSignup: false,
          shouldPromptPremium: false,
          dailyResetTime: null,
        };
      }
    }
  })();

  // Initialize
  useEffect(() => {
    setLessonData(getStoredLessonData());
    setLoading(false);
  }, []);

  // Refresh data when user changes
  useEffect(() => {
    if (!userLoading) {
      setLessonData(getStoredLessonData());
    }
  }, [user, userLoading]);

  // Record a completed lesson
  const recordLessonComplete = useCallback(() => {
    setLessonData(prev => {
      const updated: LessonTrackingData = {
        ...prev,
        lessonsCompletedToday: prev.lessonsCompletedToday + 1,
        totalLessonsAsAnon: tier === 'anonymous'
          ? prev.totalLessonsAsAnon + 1
          : prev.totalLessonsAsAnon,
        lastResetDate: getTodayDateString(),
      };
      saveLessonData(updated);
      return updated;
    });
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

  // Check if user can access a specific lesson (for future use with level gating)
  const canAccessLessonById = useCallback((lessonId: string): boolean => {
    // Admin can access anything
    if (tier === 'admin') return true;

    // Everyone else follows normal permission rules
    return permissions.canAccessLesson;
  }, [tier, permissions.canAccessLesson]);

  return {
    ...permissions,
    loading: isLoading,
    recordLessonComplete,
    resetDailyCount,
    canAccessLessonById,
  };
}
