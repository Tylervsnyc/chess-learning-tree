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

export interface ThemeStats {
  attempts: number;
  solved: number;
  puzzleIds: string[]; // IDs of puzzles attempted for this theme
}

export interface Progress {
  completedLessons: string[];
  puzzleAttempts: PuzzleAttempt[];
  totalPuzzlesSolved: number;
  totalPuzzlesAttempted: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string | null;
  themePerformance: Record<string, ThemeStats>;
  // Starting lesson from diagnostic placement (all lessons before this are unlocked)
  startingLessonId: string | null;
  // Current lesson ID (the next lesson user should do)
  currentLessonId: string | null;
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
  bestStreak: 0,
  lastPlayedDate: null,
  themePerformance: {},
  startingLessonId: null,
  currentLessonId: null,
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

export function useLessonProgress() {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [pendingSyncs, setPendingSyncs] = useState<PendingSync[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const { user } = useUser();
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
            bestStreak: Math.max(prev.bestStreak, newProgress.bestStreak || 0),
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
    const hasLocalData =
      localProgress.completedLessons.length > 0 ||
      Object.keys(localProgress.themePerformance).length > 0;

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
            themePerformance: localProgress.themePerformance,
            currentStreak: localProgress.currentStreak,
            bestStreak: localProgress.bestStreak,
            lastPlayedDate: localProgress.lastPlayedDate,
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

      const newProgress = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        currentLessonId: nextLessonId, // Update local state immediately
        lessonsCompletedToday: newLessonsCompletedToday,
        lastLessonDate: today,
      };
      saveProgress(newProgress);

      // Sync to server with error tracking
      if (user) {
        syncToServer('lesson', { lessonId, nextLessonId });
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
      const isNewDay = prev.lastPlayedDate !== today;

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

      // Update streak
      let newStreak = prev.currentStreak;
      if (correct) {
        newStreak = isNewDay ? 1 : prev.currentStreak + 1;
      } else {
        newStreak = 0;
      }

      // Update theme performance
      const newThemePerformance = { ...prev.themePerformance };
      if (options?.themes && options.themes.length > 0) {
        // Use the first theme as the primary theme
        const primaryTheme = options.themes[0];
        if (!newThemePerformance[primaryTheme]) {
          newThemePerformance[primaryTheme] = { attempts: 0, solved: 0, puzzleIds: [] };
        }
        newThemePerformance[primaryTheme] = {
          attempts: newThemePerformance[primaryTheme].attempts + 1,
          solved: newThemePerformance[primaryTheme].solved + (correct ? 1 : 0),
          puzzleIds: [...newThemePerformance[primaryTheme].puzzleIds, puzzleId],
        };
      }

      const newProgress = {
        ...prev,
        puzzleAttempts: [...prev.puzzleAttempts, attempt],
        totalPuzzlesAttempted: prev.totalPuzzlesAttempted + 1,
        totalPuzzlesSolved: correct ? prev.totalPuzzlesSolved + 1 : prev.totalPuzzlesSolved,
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        lastPlayedDate: today,
        themePerformance: newThemePerformance,
      };
      saveProgress(newProgress);

      // Sync to server with error tracking
      if (user) {
        syncToServer('puzzle', {
          puzzleId,
          correct,
          themes: options?.themes,
          rating: options?.rating,
          fen: options?.fen,
          solution: options?.solution,
          timeSpentMs: options?.timeSpentMs,
          updateStreak: true,
        });
      }

      return newProgress;
    });
  }, [user, syncToServer]);

  const isLessonCompleted = useCallback((lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  // Check if a lesson is unlocked
  // Unlock rules:
  // - First lesson is always unlocked
  // - If user has a startingLessonId (from diagnostic): all lessons before it are unlocked
  // - Lessons after starting point require completing the previous lesson
  const isLessonUnlocked = useCallback((lessonId: string, allLessonIds: string[]) => {
    const index = allLessonIds.indexOf(lessonId);

    // First lesson is always unlocked
    if (index === 0) return true;

    // If lesson is already completed, it's unlocked
    if (progress.completedLessons.includes(lessonId)) return true;

    // If user has a starting lesson from diagnostic
    if (progress.startingLessonId) {
      const startingIndex = allLessonIds.indexOf(progress.startingLessonId);

      // All lessons before and including the starting lesson are unlocked
      if (startingIndex >= 0 && index <= startingIndex) {
        return true;
      }
    }

    // For lessons after the starting point: require previous lesson completed
    const previousLessonId = allLessonIds[index - 1];
    return progress.completedLessons.includes(previousLessonId);
  }, [progress.completedLessons, progress.startingLessonId]);

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
  const unlockLevel = useCallback((level: number) => {
    setProgress(prev => {
      if (prev.unlockedLevels.includes(level)) {
        return prev;
      }

      const newUnlockedLevels = [...prev.unlockedLevels, level].sort((a, b) => a - b);
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

  return {
    completedLessons: progress.completedLessons,
    puzzleAttempts: progress.puzzleAttempts,
    totalPuzzlesSolved: progress.totalPuzzlesSolved,
    totalPuzzlesAttempted: progress.totalPuzzlesAttempted,
    currentStreak: progress.currentStreak,
    bestStreak: progress.bestStreak,
    lastPlayedDate: progress.lastPlayedDate,
    themePerformance: progress.themePerformance,
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
    // Current lesson (next lesson user should do)
    currentLessonId: progress.currentLessonId,
    // Sync status for UI feedback
    syncState,
    hasPendingSyncs: pendingSyncs.length > 0,
    retryPendingSyncs,
    isOnline,
  };
}
