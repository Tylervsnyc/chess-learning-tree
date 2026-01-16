import { UserProgress, ThemeProgress, NodeStatus } from '@/types/curriculum';
import { curriculum } from './curriculum';

// Mock user progress: 3 lessons completed, 4th in progress
export const mockUserProgress: UserProgress[] = [
  {
    lessonId: '1.1',
    status: 'completed',
    themesCompleted: ['1.1.1', '1.1.2', '1.1.3', '1.1.4', '1.1.5', '1.1.6'],
  },
  {
    lessonId: '1.2',
    status: 'completed',
    themesCompleted: ['1.2.1', '1.2.2', '1.2.3', '1.2.4', '1.2.5', '1.2.6'],
  },
  {
    lessonId: '1.3',
    status: 'completed',
    themesCompleted: ['1.3.1', '1.3.2', '1.3.3', '1.3.4', '1.3.5', '1.3.6'],
  },
  {
    lessonId: '1.4',
    status: 'in_progress',
    themesCompleted: ['1.4.1', '1.4.2', '1.4.3'], // 3 of 6 completed
  },
];

// Mock theme progress with puzzle counts
export const mockThemeProgress: ThemeProgress[] = [
  // Lesson 1.1 - All completed
  { themeId: '1.1.1', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.1.2', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.1.3', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.1.4', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.1.5', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.1.6', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  // Lesson 1.2 - All completed
  { themeId: '1.2.1', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.2.2', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.2.3', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.2.4', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.2.5', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.2.6', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  // Lesson 1.3 - All completed
  { themeId: '1.3.1', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.3.2', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.3.3', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.3.4', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.3.5', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.3.6', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  // Lesson 1.4 - In progress (3 of 6 completed)
  { themeId: '1.4.1', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.4.2', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.4.3', completed: true, puzzlesSolved: 10, totalPuzzles: 10 },
  { themeId: '1.4.4', completed: false, puzzlesSolved: 5, totalPuzzles: 10 },
  { themeId: '1.4.5', completed: false, puzzlesSolved: 0, totalPuzzles: 10 },
  { themeId: '1.4.6', completed: false, puzzlesSolved: 0, totalPuzzles: 10 },
];

// Helper function to get lesson status
export function getLessonStatus(lessonId: string): NodeStatus {
  const progress = mockUserProgress.find(p => p.lessonId === lessonId);
  if (progress) {
    return progress.status;
  }

  // Check if the previous lesson is completed or in progress
  const lessonIndex = curriculum.findIndex(l => l.id === lessonId);
  if (lessonIndex === 0) {
    return 'available'; // First lesson is always available
  }

  const previousLesson = curriculum[lessonIndex - 1];
  const previousProgress = mockUserProgress.find(p => p.lessonId === previousLesson.id);

  if (previousProgress?.status === 'completed') {
    return 'available';
  }

  return 'locked';
}

// Helper function to get theme progress
export function getThemeProgress(themeId: string): ThemeProgress | undefined {
  return mockThemeProgress.find(p => p.themeId === themeId);
}

// Helper function to get lesson completion percentage
export function getLessonCompletionPercent(lessonId: string): number {
  const progress = mockUserProgress.find(p => p.lessonId === lessonId);
  if (!progress) return 0;

  const lesson = curriculum.find(l => l.id === lessonId);
  if (!lesson) return 0;

  return (progress.themesCompleted.length / lesson.themes.length) * 100;
}
