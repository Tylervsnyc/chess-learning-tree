import { useMemo } from 'react';
import { Lesson, NodeStatus } from '@/types/curriculum';
import { curriculum } from '@/data/curriculum';
import { getLessonStatus, getLessonCompletionPercent } from '@/data/progress';

interface LessonState {
  lesson: Lesson;
  status: NodeStatus;
  progress: number;
  position: 'left' | 'center' | 'right';
}

export function useTreeNavigation() {
  const lessonStates = useMemo<LessonState[]>(() => {
    const pattern: ('left' | 'center' | 'right')[] = ['center', 'right', 'center', 'left'];

    return curriculum.map((lesson, index) => ({
      lesson,
      status: getLessonStatus(lesson.id),
      progress: getLessonCompletionPercent(lesson.id),
      position: pattern[index % 4],
    }));
  }, []);

  const currentLesson = useMemo(() => {
    return lessonStates.find(
      ls => ls.status === 'in_progress' || ls.status === 'available'
    );
  }, [lessonStates]);

  const completedCount = useMemo(() => {
    return lessonStates.filter(ls => ls.status === 'completed').length;
  }, [lessonStates]);

  return {
    lessonStates,
    currentLesson,
    completedCount,
    totalLessons: curriculum.length,
  };
}
