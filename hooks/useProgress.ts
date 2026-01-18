'use client';

import { useState, useEffect, useCallback } from 'react';

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

  // Load from localStorage on mount
  useEffect(() => {
    setProgress(getStoredProgress());
    setLoaded(true);
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) {
        return prev;
      }
      const newProgress = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      };
      saveProgress(newProgress);
      return newProgress;
    });
  }, []);

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
      return newProgress;
    });
  }, []);

  const isLessonCompleted = useCallback((lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  // Check if a lesson is unlocked
  // Lesson is unlocked if:
  // - It's the first lesson in the first module (1.1.1)
  // - The previous lesson is completed
  // - DEV MODE: All lessons unlocked for testing
  const isLessonUnlocked = useCallback((lessonId: string, allLessonIds: string[]) => {
    // TODO: Remove this line to re-enable sequential unlocking
    return true; // DEV MODE: All lessons unlocked for testing

    const index = allLessonIds.indexOf(lessonId);

    // First lesson is always unlocked
    if (index === 0) return true;

    // Otherwise, previous lesson must be completed
    const previousLessonId = allLessonIds[index - 1];
    return progress.completedLessons.includes(previousLessonId);
  }, [progress.completedLessons]);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    saveProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    completedLessons: progress.completedLessons,
    puzzleAttempts: progress.puzzleAttempts,
    totalPuzzlesSolved: progress.totalPuzzlesSolved,
    totalPuzzlesAttempted: progress.totalPuzzlesAttempted,
    currentStreak: progress.currentStreak,
    bestStreak: progress.bestStreak,
    lastPlayedDate: progress.lastPlayedDate,
    themePerformance: progress.themePerformance,
    completeLesson,
    recordPuzzleAttempt,
    isLessonCompleted,
    isLessonUnlocked,
    resetProgress,
    loaded,
  };
}
