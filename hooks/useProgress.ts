'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from './useUser';
import { mergeProgress, type ServerProgress } from '@/lib/progress-sync';

const STORAGE_KEY = 'chess-learning-progress';

export interface PuzzleAttempt {
  puzzleId: string;
  lessonId: string;
  correct: boolean;
  timestamp: number;
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
  const { user } = useUser();
  const hasSyncedRef = useRef(false);
  const previousUserIdRef = useRef<string | null>(null);

  // Load from localStorage on mount (instant)
  useEffect(() => {
    const localProgress = getStoredProgress();
    setProgress(localProgress);
    setLoaded(true);
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

      // Fire-and-forget server update if authenticated
      if (user) {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'lesson',
            data: { lessonId, nextLessonId },
          }),
        }).catch(err => console.error('Failed to sync lesson completion:', err));
      }

      return newProgress;
    });
  }, [user]);

  const recordPuzzleAttempt = useCallback((
    puzzleId: string,
    lessonId: string,
    correct: boolean,
    options?: {
      themes?: string[];
      rating?: number;
      fen?: string;
      solution?: string;
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

      // Fire-and-forget server update if authenticated
      if (user) {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'puzzle',
            data: {
              puzzleId,
              correct,
              themes: options?.themes,
              rating: options?.rating,
              fen: options?.fen,
              solution: options?.solution,
              updateStreak: true,
            },
          }),
        }).catch(err => console.error('Failed to sync puzzle attempt:', err));
      }

      return newProgress;
    });
  }, [user]);

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

      // Sync to server if authenticated
      if (user) {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'unlockLevel',
            data: { level, unlockedLevels: newUnlockedLevels },
          }),
        }).catch(err => console.error('Failed to sync level unlock:', err));
      }

      return newProgress;
    });
  }, [user]);

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
  };
}
