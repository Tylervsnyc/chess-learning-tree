'use client';

import { useState, useCallback, useEffect } from 'react';

export type SelectedLevel = 'beginner' | 'intermediate' | 'advanced' | null;

export interface OnboardingState {
  selectedLevel: SelectedLevel;
  currentRating: number;
  puzzlesCompleted: number;
  puzzlesCorrect: number;
  puzzlesSeen: string[];
}

const STORAGE_KEY = 'chess-onboarding-state';

const DEFAULT_STATE: OnboardingState = {
  selectedLevel: null,
  currentRating: 700,
  puzzlesCompleted: 0,
  puzzlesCorrect: 0,
  puzzlesSeen: [],
};

// Adaptive rating algorithm
export function getNextRating(current: number, correct: boolean, puzzleNum: number): number {
  const baseAdjust = 150;
  const convergence = 1 - (puzzleNum / 12); // Decreases impact over time
  const adjust = Math.round(baseAdjust * convergence);
  return correct
    ? Math.min(1600, current + adjust)
    : Math.max(400, current - adjust);
}

// Determine final ELO bracket from diagnostic rating
export function getFinalEloFromDiagnostic(rating: number): number {
  if (rating < 700) return 600;
  if (rating < 900) return 800;
  if (rating < 1100) return 1000;
  return 1200;
}

// Get ELO assignment based on manual selection and placement results
export function getPlacementElo(
  level: SelectedLevel,
  passed: boolean
): { elo: number; suggestedLevel?: SelectedLevel } {
  switch (level) {
    case 'beginner':
      return { elo: 600 };
    case 'intermediate':
      return passed
        ? { elo: 900 }
        : { elo: 750, suggestedLevel: 'beginner' };
    case 'advanced':
      return passed
        ? { elo: 1200 }
        : { elo: 1050, suggestedLevel: 'intermediate' };
    default:
      return { elo: 600 };
  }
}

// Get puzzle rating to fetch based on level
export function getPlacementPuzzleRating(level: SelectedLevel): number {
  switch (level) {
    case 'intermediate':
      return 1000;
    case 'advanced':
      return 1300;
    default:
      return 800;
  }
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({ ...DEFAULT_STATE, ...parsed });
      }
    } catch {
      // Ignore errors, use default state
    }
    setIsLoaded(true);
  }, []);

  // Persist state to localStorage
  const persistState = useCallback((newState: OnboardingState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Select a level (manual path)
  const selectLevel = useCallback((level: SelectedLevel) => {
    const newState = { ...state, selectedLevel: level };
    setState(newState);
    persistState(newState);
  }, [state, persistState]);

  // Record puzzle result
  const recordResult = useCallback((puzzleId: string, correct: boolean) => {
    const newPuzzlesCompleted = state.puzzlesCompleted + 1;
    const newPuzzlesCorrect = correct ? state.puzzlesCorrect + 1 : state.puzzlesCorrect;
    const newRating = getNextRating(state.currentRating, correct, newPuzzlesCompleted);

    const newState: OnboardingState = {
      ...state,
      puzzlesCompleted: newPuzzlesCompleted,
      puzzlesCorrect: newPuzzlesCorrect,
      currentRating: newRating,
      puzzlesSeen: [...state.puzzlesSeen, puzzleId],
    };

    setState(newState);
    persistState(newState);

    return {
      puzzlesCompleted: newPuzzlesCompleted,
      puzzlesCorrect: newPuzzlesCorrect,
      currentRating: newRating,
    };
  }, [state, persistState]);

  // Reset onboarding state
  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  }, []);

  // Clear state after completion (called when saving to DB)
  const complete = useCallback(() => {
    reset();
  }, [reset]);

  // Check if placement test passed (3/5 threshold)
  const isPlacementPassed = useCallback((correct: number, total: number) => {
    return correct >= Math.ceil(total * 0.6); // 3/5 = 60%
  }, []);

  return {
    state,
    isLoaded,
    selectLevel,
    recordResult,
    reset,
    complete,
    isPlacementPassed,
  };
}
