import { useMemo } from 'react';
import { ThemeProgress } from '@/types/curriculum';
import { mockUserProgress, mockThemeProgress } from '@/data/progress';

export function useProgress(lessonId: string) {
  const lessonProgress = useMemo(() => {
    return mockUserProgress.find(p => p.lessonId === lessonId);
  }, [lessonId]);

  const themesProgress = useMemo<ThemeProgress[]>(() => {
    return mockThemeProgress.filter(tp => tp.themeId.startsWith(lessonId));
  }, [lessonId]);

  const completedThemesCount = useMemo(() => {
    return themesProgress.filter(tp => tp.completed).length;
  }, [themesProgress]);

  const totalPuzzlesSolved = useMemo(() => {
    return themesProgress.reduce((acc, tp) => acc + tp.puzzlesSolved, 0);
  }, [themesProgress]);

  const totalPuzzles = useMemo(() => {
    return themesProgress.reduce((acc, tp) => acc + tp.totalPuzzles, 0);
  }, [themesProgress]);

  return {
    lessonProgress,
    themesProgress,
    completedThemesCount,
    totalPuzzlesSolved,
    totalPuzzles,
    completionPercent: totalPuzzles > 0 ? (totalPuzzlesSolved / totalPuzzles) * 100 : 0,
  };
}
