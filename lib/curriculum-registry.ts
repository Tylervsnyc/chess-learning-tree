/**
 * Curriculum Registry - Single Source of Truth
 *
 * This file is the ONLY place you need to update when adding a new level.
 * Everything else derives from this configuration.
 */

import { level1V2, LessonCriteria, Section, Block, Level } from '@/data/staging/level1-v2-curriculum';
import { level2V2 } from '@/data/staging/level2-v2-curriculum';
import { level3V2 } from '@/data/staging/level3-v2-curriculum';

// Re-export types for convenience
export type { LessonCriteria, Section, Block, Level };

/**
 * Level configuration - ADD NEW LEVELS HERE
 */
export interface LevelConfig {
  level: number;
  data: Level;
  puzzleDir: string;      // Folder name in data/puzzles-by-rating/
  treeId: string;         // Used for progress tracking
  color: string;          // Primary UI color
  darkColor: string;      // Shadow/accent color
}

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    data: level1V2,
    puzzleDir: '0400-0800',
    treeId: '400-800',
    color: '#58CC02',
    darkColor: '#3d8c01',
  },
  {
    level: 2,
    data: level2V2,
    puzzleDir: '0800-1200',
    treeId: '800-1200',
    color: '#1CB0F6',
    darkColor: '#1487c0',
  },
  {
    level: 3,
    data: level3V2,
    puzzleDir: '0800-1200',  // Level 3 lessons are rated 1000-1250, which fits in 800-1200 folder
    treeId: '1200+',
    color: '#CE82FF',
    darkColor: '#a855c7',
  },
  // ============================================================
  // TO ADD LEVEL 4:
  // 1. Create data/staging/level4-v2-curriculum.ts
  // 2. Import it above
  // 3. Add entry here:
  // {
  //   level: 4,
  //   data: level4V2,
  //   puzzleDir: '1600-2000',
  //   treeId: '1600-2000',
  //   color: '#FF9500',
  //   darkColor: '#cc7700',
  // },
  // ============================================================
];

/**
 * Get level config by level number
 */
export function getLevelConfig(levelNum: number): LevelConfig | undefined {
  return LEVELS.find(l => l.level === levelNum);
}

/**
 * Get level number from lesson ID (e.g., "2.1.3" -> 2)
 */
export function getLevelFromLessonId(lessonId: string): number {
  return parseInt(lessonId.split('.')[0], 10);
}

/**
 * Get level config from lesson ID
 */
export function getLevelConfigForLesson(lessonId: string): LevelConfig | undefined {
  const levelNum = getLevelFromLessonId(lessonId);
  return getLevelConfig(levelNum);
}

/**
 * All available puzzle directories in order of difficulty
 */
export const PUZZLE_DIRS = [
  { dir: '0400-0800', minRating: 400, maxRating: 800 },
  { dir: '0800-1200', minRating: 800, maxRating: 1200 },
  { dir: '1200-1600', minRating: 1200, maxRating: 1600 },
  { dir: '1600-2000', minRating: 1600, maxRating: 2000 },
  { dir: '2000-plus', minRating: 2000, maxRating: 3000 },
];

/**
 * Get the best puzzle directory for a lesson based on its rating range.
 * Uses the lesson's actual ratingMin/ratingMax to pick the right folder.
 */
export function getPuzzleDirForLesson(lessonId: string): string {
  const lesson = getLessonById(lessonId);
  if (!lesson) {
    // Fallback to level-based selection
    const config = getLevelConfigForLesson(lessonId);
    return config?.puzzleDir ?? '0400-0800';
  }

  // Use the midpoint of the lesson's rating range to pick folder
  const targetRating = (lesson.ratingMin + lesson.ratingMax) / 2;

  for (const { dir, minRating, maxRating } of PUZZLE_DIRS) {
    if (targetRating >= minRating && targetRating < maxRating) {
      return dir;
    }
  }

  return '0400-0800';
}

/**
 * Get puzzle directories to try for a lesson, in order of preference.
 * Returns primary folder first, then adjacent folders as fallbacks.
 */
export function getPuzzleDirsForLesson(lessonId: string): string[] {
  const primary = getPuzzleDirForLesson(lessonId);
  const primaryIndex = PUZZLE_DIRS.findIndex(p => p.dir === primary);

  const dirs = [primary];

  // Add adjacent folders as fallbacks
  if (primaryIndex > 0) {
    dirs.push(PUZZLE_DIRS[primaryIndex - 1].dir);
  }
  if (primaryIndex < PUZZLE_DIRS.length - 1) {
    dirs.push(PUZZLE_DIRS[primaryIndex + 1].dir);
  }

  return dirs;
}

/**
 * Get tree ID for progress tracking from lesson ID
 */
export function getTreeIdFromLessonId(lessonId: string): string {
  const config = getLevelConfigForLesson(lessonId);
  return config?.treeId ?? '400-800';
}

/**
 * Find a lesson by ID across all levels
 */
export function getLessonById(lessonId: string): LessonCriteria | null {
  for (const { data } of LEVELS) {
    for (const block of data.blocks) {
      for (const section of block.sections) {
        const lesson = section.lessons.find(l => l.id === lessonId);
        if (lesson) return lesson;
      }
    }
  }
  return null;
}

/**
 * Find lesson with full context (section, block, level)
 */
export interface LessonWithContext {
  lesson: LessonCriteria;
  section: Section;
  block: Block;
  level: Level;
  levelConfig: LevelConfig;
}

export function getLessonWithContext(lessonId: string): LessonWithContext | null {
  for (const config of LEVELS) {
    for (const block of config.data.blocks) {
      for (const section of block.sections) {
        const lesson = section.lessons.find(l => l.id === lessonId);
        if (lesson) {
          return {
            lesson,
            section,
            block,
            level: config.data,
            levelConfig: config,
          };
        }
      }
    }
  }
  return null;
}

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
  const config = getLevelConfig(levelNum);
  if (!config) return [];

  const ids: string[] = [];
  for (const block of config.data.blocks) {
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

/**
 * Get the first lesson ID for a given level
 */
export function getFirstLessonIdForLevel(levelNum: number): string | null {
  const config = getLevelConfig(levelNum);
  if (!config) return null;

  const firstBlock = config.data.blocks[0];
  const firstSection = firstBlock?.sections[0];
  const firstLesson = firstSection?.lessons[0];

  return firstLesson?.id ?? null;
}

/**
 * Get intro messages for a lesson (block intro and/or theme intro)
 */
export interface IntroMessages {
  blockIntro: string | null;
  themeIntro: string | null;
}

export function getIntroMessagesForLesson(lessonId: string): IntroMessages {
  const context = getLessonWithContext(lessonId);
  if (!context) {
    return { blockIntro: null, themeIntro: null };
  }

  const { lesson, section, block } = context;

  // Check if this is the first lesson in the block
  const isFirstLessonInBlock = block.sections[0]?.lessons[0]?.id === lesson.id;

  // Check if this is the first lesson in the section
  const isFirstLessonInSection = section.lessons[0]?.id === lesson.id;

  return {
    blockIntro: isFirstLessonInBlock ? (block.blockIntroMessage ?? null) : null,
    themeIntro: isFirstLessonInSection ? (section.themeIntroMessage ?? null) : null,
  };
}
