/**
 * Chess Path V2 Curriculum
 *
 * 3 Levels:
 * - Level 1 (400-800): Checkmate, Winning Material, Endgame
 * - Level 2 (800-1000): Mechanisms (fork, pin, skewer, discovery)
 * - Level 3 (1000-1200): Enablers (deflection, attraction, sacrifice, combinations)
 *
 * No diagnostic - everyone starts at 1.1.1
 * Optional skip quiz to jump ahead
 */

import { Level, LessonCriteria, Module } from '../level1-curriculum';
import { level1V2 } from './level1-v2';
import { level2V2 } from './level2-v2';
import { level3V2 } from './level3-v2';

// Export individual levels
export { level1V2 } from './level1-v2';
export { level2V2 } from './level2-v2';
export { level3V2 } from './level3-v2';

// All levels in order
export const LEVELS_V2: Level[] = [level1V2, level2V2, level3V2];

// Helper: Get all lessons across all levels
export function getAllLessonsAllLevels(): LessonCriteria[] {
  return LEVELS_V2.flatMap(level => level.modules.flatMap(m => m.lessons));
}

// Helper: Get a lesson by ID from any level
export function getLessonByIdAllLevels(id: string): LessonCriteria | undefined {
  return getAllLessonsAllLevels().find(l => l.id === id);
}

// Helper: Get level by lesson ID
export function getLevelByLessonId(lessonId: string): Level | undefined {
  const levelNum = lessonId.split('.')[0];
  const index = parseInt(levelNum) - 1;
  return LEVELS_V2[index];
}

// Helper: Get module by lesson ID
export function getModuleByLessonId(lessonId: string): Module | undefined {
  const level = getLevelByLessonId(lessonId);
  if (!level) return undefined;

  const parts = lessonId.split('.');
  const moduleNum = parseInt(parts[1]);
  return level.modules.find(m => m.id === `mod-${moduleNum}`);
}

// Stats
export function getCurriculumStats() {
  const stats = LEVELS_V2.map(level => ({
    id: level.id,
    name: level.name,
    ratingRange: level.ratingRange,
    moduleCount: level.modules.length,
    lessonCount: level.modules.reduce((sum, m) => sum + m.lessons.length, 0),
  }));

  return {
    levels: stats,
    totalLessons: stats.reduce((sum, s) => sum + s.lessonCount, 0),
    totalModules: stats.reduce((sum, s) => sum + s.moduleCount, 0),
  };
}
