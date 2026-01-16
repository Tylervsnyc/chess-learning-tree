export type NodeStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface Theme {
  id: string;        // e.g., "1.1.1"
  lessonId: string;  // e.g., "1.1"
  name: string;      // e.g., "Mate in 1 basics"
  order: number;     // 1-6 within the lesson
}

export interface Lesson {
  id: string;        // e.g., "1.1"
  name: string;      // e.g., "Mate in 1"
  order: number;     // 1-25
  themes: Theme[];
}

export interface UserProgress {
  lessonId: string;
  status: NodeStatus;
  themesCompleted: string[]; // Array of theme IDs completed
}

export interface ThemeProgress {
  themeId: string;
  completed: boolean;
  puzzlesSolved: number;
  totalPuzzles: number;
}
