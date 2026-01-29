import { level1V2 } from '@/data/staging/level1-v2-curriculum';
import { level2V2 } from '@/data/staging/level2-v2-curriculum';
import { level3V2 } from '@/data/staging/level3-v2-curriculum';

// Level configurations
const LEVELS = [
  { level: 1, data: level1V2 },
  { level: 2, data: level2V2 },
  { level: 3, data: level3V2 },
];

/**
 * Get all lesson IDs across all levels in order
 */
export function getAllLessonIds(): string[] {
  const ids: string[] = [];
  for (const { data } of LEVELS) {
    for (const block of data.blocks) {
      for (const section of block.sections) {
        for (const lesson of section.lessons) {
          ids.push(lesson.id);
        }
      }
    }
  }
  return ids;
}

/**
 * Get lesson IDs for a specific level
 */
export function getLevelLessonIds(levelNum: number): string[] {
  const levelConfig = LEVELS.find(l => l.level === levelNum);
  if (!levelConfig) return [];

  const ids: string[] = [];
  for (const block of levelConfig.data.blocks) {
    for (const section of block.sections) {
      for (const lesson of section.lessons) {
        ids.push(lesson.id);
      }
    }
  }
  return ids;
}

/**
 * Get the next lesson ID after the given lessonId
 */
export function getNextLessonId(lessonId: string): string | null {
  const allIds = getAllLessonIds();
  const currentIndex = allIds.indexOf(lessonId);
  if (currentIndex === -1 || currentIndex >= allIds.length - 1) {
    return null;
  }
  return allIds[currentIndex + 1];
}
