/**
 * Curriculum Utilities
 *
 * Re-exports from curriculum-registry for backwards compatibility.
 * New code should import directly from @/lib/curriculum-registry
 */

export {
  LEVELS,
  getLevelConfig,
  getLevelFromLessonId,
  getLevelConfigForLesson,
  getPuzzleDirForLesson,
  getTreeIdFromLessonId,
  getLessonById,
  getLessonWithContext,
  getAllLessonIds,
  getLevelLessonIds,
  getNextLessonId,
  getIntroMessagesForLesson,
} from './curriculum-registry';

export type {
  LevelConfig,
  LessonWithContext,
  IntroMessages,
  LessonCriteria,
  Section,
  Block,
  Level,
} from './curriculum-registry';
