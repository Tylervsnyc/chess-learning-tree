'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from './useUser';
import { mergeProgress, type ServerProgress } from '@/lib/progress-sync';

const STORAGE_KEY = 'chess-learning-progress';
const PENDING_SYNC_KEY = 'chess-pending-syncs';

// Sync status for UI feedback
export type SyncState = 'idle' | 'syncing' | 'error' | 'offline';

// Queue for failed syncs that need retry
interface PendingSync {
  type: 'lesson' | 'puzzle' | 'unlockLevel';
  data: Record<string, unknown>;
  timestamp: number;
}

// Persist pending syncs to localStorage
function savePendingSyncs(syncs: PendingSync[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(syncs));
  } catch {
    // Ignore storage errors
  }
}

// Load pending syncs from localStorage
function loadPendingSyncs(): PendingSync[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(PENDING_SYNC_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parsing errors
  }
  return [];
}

export interface PuzzleAttempt {
  puzzleId: string;
  lessonId: string;
  correct: boolean;
  timestamp: number;
  timeSpentMs?: number; // Time spent solving the puzzle
  themes?: string[]; // Primary themes of the puzzle
  rating?: number; // Puzzle rating
  fen?: string; // Position for review
  solution?: string; // Solution for review
}

/**
 * Progress interface - matches RULES.md Section 23
 * NOTE: Removed themePerformance, bestStreak, currentLessonId (not in DB schema)
 */
export interface Progress {
  completedLessons: string[];
  puzzleAttempts: PuzzleAttempt[];
  totalPuzzlesSolved: number;
  totalPuzzlesAttempted: number;
  currentStreak: number;
  lastActivityDate: string | null;
  // Starting lesson from diagnostic placement (all lessons before this are unlocked)
  startingLessonId: string | null;
  // Daily lesson tracking for free user limits
  lessonsCompletedToday: number;
  lastLessonDate: string | null;
  // Unlocked levels (level numbers user can access)
  unlockedLevels: number[];
}

const DEFAULT_PROGRESS: Progress = {
  completedLessons: [],
  puzzleAttempts: [],
  totalPuzzlesSolved: 0,
  totalPuzzlesAttempted: 0,
  currentStreak: 0,
  lastActivityDate: null,
  startingLessonId: null,
  lessonsCompletedToday: 0,
  lastLessonDate: null,
  unlockedLevels: [1], // Level 1 always unlocked by default
};

function getStoredProgress(): Progress {
  if (typeof window === 'undefined') {
    return DEFAULT_PROGRESS;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate old format
      return { ...DEFAULT_PROGRESS, ...parsed };
    }
  } catch {
    // Ignore parsing errors
  }
  return DEFAULT_PROGRESS;
}

function saveProgress(progress: Progress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage errors
  }
}

// Helper to check if a date is yesterday
function isYesterday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split('T')[0];
}

// Helper to check if a date is today
function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
}

/**
 * Calculate the new streak based on the last activity date
 * Per RULES.md Section 11: "Complete 1 lesson OR 1 daily challenge per day"
 *
 * Logic:
 * - If already played today: don't change streak
 * - If last activity was yesterday: continue streak (increment by 1)
 * - Otherwise: start fresh at 1
 */
function calculateNewStreak(currentStreak: number, lastActivityDate: string | null): {
  newStreak: number;
  extended: boolean;
  previousStreak: number;
} {
  // If already played today, don't change streak
  if (isToday(lastActivityDate)) {
    return { newStreak: currentStreak, extended: false, previousStreak: currentStreak };
  }

  // If last activity was yesterday, continue the streak
  if (isYesterday(lastActivityDate)) {
    return { newStreak: currentStreak + 1, extended: true, previousStreak: currentStreak };
  }

  // Missed day(s) or first time - start fresh at 1
  return { newStreak: 1, extended: currentStreak === 0, previousStreak: currentStreak };
}

export function useLessonProgress() {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [pendingSyncs, setPendingSyncs] = useState<PendingSync[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  // Streak popup state
  const [streakJustExtended, setStreakJustExtended] = useState(false);
  const [previousStreak, setPreviousStreak] = useState(0);
  const { user, profile } = useUser();
  const hasSyncedRef = useRef(false);
  const previousUserIdRef = useRef<string | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load pending syncs from localStorage on mount
  useEffect(() => {
    const stored = loadPendingSyncs();
    if (stored.length > 0) {
      setPendingSyncs(stored);
    }
  }, []);

  // Save pending syncs to localStorage when they change
  useEffect(() => {
    savePendingSyncs(pendingSyncs);
  }, [pendingSyncs]);

  // Track online/offline status
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Sync state will be updated when we retry
      if (syncState === 'offline') {
        setSyncState('idle');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncState('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncState]);

  // Helper to sync data with retry tracking
  const syncToServer = useCallback(async (
    type: 'lesson' | 'puzzle' | 'unlockLevel',
    data: Record<string, unknown>
  ): Promise<boolean> => {
    if (!user) return true; // No user, nothing to sync

    // If offline, queue immediately without trying
    if (!navigator.onLine) {
      setSyncState('offline');
      setPendingSyncs(prev => {
        const exists = prev.some(p =>
          p.type === type && JSON.stringify(p.data) === JSON.stringify(data)
        );
        if (exists) return prev;
        return [...prev, { type, data, timestamp: Date.now() }];
      });
      return false;
    }

    setSyncState('syncing');

    // Clear any existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });

      if (response.ok) {
        setSyncState('idle');
        // Remove from pending if it was there
        setPendingSyncs(prev => prev.filter(p =>
          !(p.type === type && JSON.stringify(p.data) === JSON.stringify(data))
        ));
        return true;
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (err) {
      console.error(`Failed to sync ${type}:`, err);

      // Determine if it's an offline error
      const isOfflineError = !navigator.onLine;
      setSyncState(isOfflineError ? 'offline' : 'error');

      // Add to pending syncs if not already there
      setPendingSyncs(prev => {
        const exists = prev.some(p =>
          p.type === type && JSON.stringify(p.data) === JSON.stringify(data)
        );
        if (exists) return prev;
        return [...prev, { type, data, timestamp: Date.now() }];
      });

      // Auto-clear error state after 5 seconds (not for offline)
      if (!isOfflineError) {
        syncTimeoutRef.current = setTimeout(() => {
          setSyncState(prev => prev === 'error' ? 'idle' : prev);
        }, 5000);
      }

      return false;
    }
  }, [user]);

  // Retry all pending syncs
  const retryPendingSyncs = useCallback(async () => {
    if (pendingSyncs.length === 0 || !navigator.onLine) return;

    for (const pending of pendingSyncs) {
      await syncToServer(pending.type, pending.data);
    }
  }, [pendingSyncs, syncToServer]);

  // Auto-retry pending syncs when coming back online
  useEffect(() => {
    if (isOnline && pendingSyncs.length > 0 && user) {
      // Small delay to let connection stabilize
      const timer = setTimeout(() => {
        retryPendingSyncs();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingSyncs.length, user, retryPendingSyncs]);

  // Load from localStorage on mount (instant)
  useEffect(() => {
    const localProgress = getStoredProgress();
    setProgress(localProgress);
    setLoaded(true);
  }, []);

  // Listen for localStorage changes from OTHER tabs
  // This prevents data loss when multiple tabs are open
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;

      try {
        const newProgress = JSON.parse(event.newValue);
        // Merge with current state using the same strategy as server sync
        setProgress(prev => {
          // Take union of completed lessons (never lose progress)
          const completedLessons = Array.from(
            new Set([...prev.completedLessons, ...(newProgress.completedLessons || [])])
          );

          // Take max of numeric values
          const merged: Progress = {
            ...prev,
            ...newProgress,
            completedLessons,
            totalPuzzlesSolved: Math.max(prev.totalPuzzlesSolved, newProgress.totalPuzzlesSolved || 0),
            totalPuzzlesAttempted: Math.max(prev.totalPuzzlesAttempted, newProgress.totalPuzzlesAttempted || 0),
            currentStreak: Math.max(prev.currentStreak, newProgress.currentStreak || 0),
            lessonsCompletedToday: Math.max(prev.lessonsCompletedToday, newProgress.lessonsCompletedToday || 0),
            // Merge unlocked levels
            unlockedLevels: Array.from(
              new Set([...prev.unlockedLevels, ...(newProgress.unlockedLevels || [1])])
            ).sort((a, b) => a - b),
          };

          return merged;
        });
      } catch {
        // Ignore parsing errors from other tabs
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch and merge server data when authenticated
  useEffect(() => {
    if (!loaded || !user) return;

    const abortController = new AbortController();

    const fetchServerProgress = async () => {
      try {
        const response = await fetch('/api/progress', {
          signal: abortController.signal,
        });
        if (!response.ok) return;

        const serverProgress: ServerProgress = await response.json();

        setProgress(prev => {
          const merged = mergeProgress(prev, serverProgress);
          saveProgress(merged);
          return merged;
        });
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Failed to fetch server progress:', error);
      }
    };

    fetchServerProgress();

    return () => abortController.abort();
  }, [loaded, user?.id]);

  // Sync localStorage data to server on login
  useEffect(() => {
    const currentUserId = user?.id ?? null;
    const previousUserId = previousUserIdRef.current;

    // Detect login (went from no user to having user)
    const justLoggedIn = previousUserId === null && currentUserId !== null;
    previousUserIdRef.current = currentUserId;

    if (!justLoggedIn || !loaded || hasSyncedRef.current) return;

    const localProgress = getStoredProgress();
    const hasLocalData = localProgress.completedLessons.length > 0;

    if (!hasLocalData) {
      hasSyncedRef.current = true;
      return;
    }

    const abortController = new AbortController();

    const syncToServer = async () => {
      try {
        const response = await fetch('/api/progress/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            completedLessons: localProgress.completedLessons,
            currentStreak: localProgress.currentStreak,
            lastActivityDate: localProgress.lastActivityDate,
          }),
          signal: abortController.signal,
        });

        if (response.ok) {
          const mergedFromServer: ServerProgress = await response.json();
          setProgress(prev => {
            const merged = mergeProgress(prev, mergedFromServer);
            saveProgress(merged);
            return merged;
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Failed to sync progress to server:', error);
      }
      hasSyncedRef.current = true;
    };

    syncToServer();

    return () => abortController.abort();
  }, [user?.id, loaded]);

  // Reset sync flag on logout
  useEffect(() => {
    if (!user) {
      hasSyncedRef.current = false;
    }
  }, [user]);

  const completeLesson = useCallback((lessonId: string, allLessonIds?: string[]) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) {
        return prev;
      }

      // Track daily lesson count
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = prev.lastLessonDate !== today;
      const newLessonsCompletedToday = isNewDay ? 1 : prev.lessonsCompletedToday + 1;

      // Calculate next lesson ID if allLessonIds provided
      let nextLessonId: string | null = null;
      if (allLessonIds) {
        const currentIndex = allLessonIds.indexOf(lessonId);
        nextLessonId = allLessonIds[currentIndex + 1] || null;
      }

      // Update streak using day-based logic (per RULES.md Section 11)
      const streakResult = calculateNewStreak(prev.currentStreak, prev.lastActivityDate);

      // Trigger streak popup if streak was extended
      if (streakResult.extended) {
        setPreviousStreak(streakResult.previousStreak);
        setStreakJustExtended(true);
      }

      const newProgress = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        currentLessonId: nextLessonId, // Update local state immediately
        lessonsCompletedToday: newLessonsCompletedToday,
        lastLessonDate: today,
        currentStreak: streakResult.newStreak,
        lastActivityDate: today,
      };
      saveProgress(newProgress);

      // Sync to server with error tracking
      if (user) {
        syncToServer('lesson', { lessonId, nextLessonId, updateStreak: true });
      }

      return newProgress;
    });
  }, [user, syncToServer]);

  const recordPuzzleAttempt = useCallback((
    puzzleId: string,
    lessonId: string,
    correct: boolean,
    options?: {
      themes?: string[];
      rating?: number;
      fen?: string;
      solution?: string;
      timeSpentMs?: number;
    }
  ) => {
    setProgress(prev => {
      const today = new Date().toISOString().split('T')[0];

      const attempt: PuzzleAttempt = {
        puzzleId,
        lessonId,
        correct,
        timestamp: Date.now(),
        timeSpentMs: options?.timeSpentMs,
        themes: options?.themes,
        rating: options?.rating,
        fen: options?.fen,
        solution: options?.solution,
      };

      // NOTE: Streak is NOT updated per puzzle attempt
      // Per RULES.md Section 11, streak tracks daily activity (lessons/daily challenge)
      // Wrong puzzles do NOT reset the streak

      const newProgress = {
        ...prev,
        puzzleAttempts: [...prev.puzzleAttempts, attempt],
        totalPuzzlesAttempted: prev.totalPuzzlesAttempted + 1,
        totalPuzzlesSolved: correct ? prev.totalPuzzlesSolved + 1 : prev.totalPuzzlesSolved,
        // Don't update streak or lastActivityDate for individual puzzle attempts
        // Streak is managed by completeLesson() and recordDailyActivity()
      };
      saveProgress(newProgress);

      // Sync to server with error tracking
      // NOTE: updateStreak is false - we don't want per-puzzle streak updates
      if (user) {
        syncToServer('puzzle', {
          puzzleId,
          correct,
          themes: options?.themes,
          rating: options?.rating,
          fen: options?.fen,
          solution: options?.solution,
          timeSpentMs: options?.timeSpentMs,
          updateStreak: false,
        });
      }

      return newProgress;
    });
  }, [user, syncToServer]);

  const isLessonCompleted = useCallback((lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  // Check if a lesson is unlocked
  // Per RULES.md Section 2:
  // - Levels BELOW highest unlocked → ALL lessons fully open
  // - Highest unlocked level → first lesson + sequential
  // - Levels above highest → locked
  const isLessonUnlocked = useCallback((lessonId: string, allLessonIds: string[]) => {
    // Admin: ALL lessons unlocked always
    if (profile?.is_admin) return true;

    // If lesson is already completed, it's unlocked
    if (progress.completedLessons.includes(lessonId)) return true;

    // First lesson of entire curriculum is always unlocked
    const index = allLessonIds.indexOf(lessonId);
    if (index === 0) return true;

    // Parse level from lessonId (format: level.section.lesson, e.g., "1.3.2")
    const lessonLevel = parseInt(lessonId.split('.')[0], 10);

    // Get highest unlocked level
    const highestUnlocked = Math.max(...progress.unlockedLevels);

    // Levels BELOW highest → ALL lessons fully open
    if (lessonLevel < highestUnlocked) {
      return true;
    }

    // Highest unlocked level → first lesson + sequential
    if (lessonLevel === highestUnlocked) {
      const levelLessons = allLessonIds.filter(id => parseInt(id.split('.')[0], 10) === lessonLevel);
      const indexInLevel = levelLessons.indexOf(lessonId);

      // First lesson of the level is always unlocked
      if (indexInLevel === 0) return true;

      // Otherwise, previous lesson in this level must be completed
      const previousLessonInLevel = levelLessons[indexInLevel - 1];
      return progress.completedLessons.includes(previousLessonInLevel);
    }

    // Levels above highest → locked
    return false;
  }, [progress.completedLessons, progress.unlockedLevels, profile?.is_admin]);

  // Set the starting lesson (called after diagnostic placement)
  const setStartingLesson = useCallback((lessonId: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        startingLessonId: lessonId,
      };
      saveProgress(newProgress);
      return newProgress;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    saveProgress(DEFAULT_PROGRESS);
  }, []);

  // Check if a level is unlocked
  const isLevelUnlocked = useCallback((level: number) => {
    return progress.unlockedLevels.includes(level);
  }, [progress.unlockedLevels]);

  // Unlock a level (called after passing level test)
  // When unlocking level N, automatically unlock ALL levels 1 through N
  const unlockLevel = useCallback((level: number) => {
    setProgress(prev => {
      // Create array of all levels from 1 to target level [1, 2, 3, ..., level]
      const allLevelsUpTo = Array.from({ length: level }, (_, i) => i + 1);
      const newUnlockedLevels = [...new Set([...prev.unlockedLevels, ...allLevelsUpTo])].sort((a, b) => a - b);

      // Skip if nothing changed
      if (newUnlockedLevels.length === prev.unlockedLevels.length) {
        return prev;
      }

      const newProgress = {
        ...prev,
        unlockedLevels: newUnlockedLevels,
      };
      saveProgress(newProgress);

      // Sync to server with error tracking
      if (user) {
        syncToServer('unlockLevel', { level, unlockedLevels: newUnlockedLevels });
      }

      return newProgress;
    });
  }, [user, syncToServer]);

  // Refresh unlocked levels from server (call after test completion)
  const refreshUnlockedLevels = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/profile/unlocked-levels');
      if (response.ok) {
        const { unlockedLevels } = await response.json();
        setProgress(prev => {
          // Merge with local state (keep higher of both)
          const merged = [...new Set([...prev.unlockedLevels, ...unlockedLevels])].sort((a, b) => a - b);
          const newProgress = { ...prev, unlockedLevels: merged };
          saveProgress(newProgress);
          return newProgress;
        });
      }
    } catch (error) {
      console.error('Failed to refresh unlocked levels:', error);
    }
  }, [user]);

  // Record daily activity (for daily challenge completion)
  // This updates the streak using day-based logic
  const recordDailyActivity = useCallback(() => {
    setProgress(prev => {
      const today = new Date().toISOString().split('T')[0];

      // Update streak using day-based logic (per RULES.md Section 11)
      const streakResult = calculateNewStreak(prev.currentStreak, prev.lastActivityDate);

      // Trigger streak popup if streak was extended
      if (streakResult.extended) {
        setPreviousStreak(streakResult.previousStreak);
        setStreakJustExtended(true);
      }

      const newProgress = {
        ...prev,
        currentStreak: streakResult.newStreak,
        lastActivityDate: today,
      };
      saveProgress(newProgress);

      // Sync to server
      if (user) {
        syncToServer('puzzle', {
          puzzleId: 'daily-challenge',
          correct: true,
          updateStreak: true,
        });
      }

      return newProgress;
    });
  }, [user, syncToServer]);

  // Dismiss streak celebration popup
  const dismissStreakCelebration = useCallback(() => {
    setStreakJustExtended(false);
  }, []);

  return {
    completedLessons: progress.completedLessons,
    puzzleAttempts: progress.puzzleAttempts,
    totalPuzzlesSolved: progress.totalPuzzlesSolved,
    totalPuzzlesAttempted: progress.totalPuzzlesAttempted,
    currentStreak: progress.currentStreak,
    lastActivityDate: progress.lastActivityDate,
    lessonsCompletedToday: progress.lessonsCompletedToday,
    lastLessonDate: progress.lastLessonDate,
    completeLesson,
    recordPuzzleAttempt,
    isLessonCompleted,
    isLessonUnlocked,
    setStartingLesson,
    startingLessonId: progress.startingLessonId,
    resetProgress,
    loaded,
    // Level unlock functions
    unlockedLevels: progress.unlockedLevels,
    isLevelUnlocked,
    unlockLevel,
    refreshUnlockedLevels,
    // Sync status for UI feedback
    syncState,
    hasPendingSyncs: pendingSyncs.length > 0,
    retryPendingSyncs,
    isOnline,
    // Streak celebration
    streakJustExtended,
    previousStreak,
    dismissStreakCelebration,
    recordDailyActivity,
  };
}
