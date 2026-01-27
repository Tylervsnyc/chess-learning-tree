/**
 * Level 1 V2 Curriculum (400-800 ELO)
 * "How to Lose Friends and Infuriate People"
 *
 * Structure based on available clean puzzles:
 * - Block 1: Checkmate (mateIn1, mateIn2, backRankMate) - ~17k puzzles available
 * - Block 2: Winning Material (hanging/trapped, crushing) - ~2k puzzles available
 * - Block 3: Named Mate Patterns (smothered, arabian, etc.) - ~1k puzzles available
 * - Block 4: Review - mixed practice
 *
 * Uses "clean" puzzles: 1000+ plays, single tactical theme = community verified
 */

import { LessonCriteria, Module, Level } from '../level1-curriculum';

export const level1V2: Level = {
  id: 'level-1',
  name: 'Level 1: How to Lose Friends',
  ratingRange: '400-800',
  modules: [
    // ========================================
    // BLOCK 1: MATE IN ONE
    // "End the game. No mercy."
    // ========================================
    {
      id: 'mod-1',
      name: 'Mate in 1',
      description: 'End the game in one move',
      lessons: [
        {
          id: '1.1.1',
          name: 'Queen Checkmates',
          description: 'Deliver mate with the queen',
          requiredTags: ['mateIn1'],
          ratingMin: 400,
          ratingMax: 550,
          pieceFilter: 'queen',
          minPlays: 1000,
        },
        {
          id: '1.1.2',
          name: 'Rook Checkmates',
          description: 'Deliver mate with the rook',
          requiredTags: ['mateIn1'],
          ratingMin: 400,
          ratingMax: 600,
          pieceFilter: 'rook',
          minPlays: 1000,
        },
        {
          id: '1.1.3',
          name: 'Queen Mate: Harder',
          description: 'Trickier queen checkmates',
          requiredTags: ['mateIn1'],
          ratingMin: 550,
          ratingMax: 700,
          pieceFilter: 'queen',
          minPlays: 1000,
        },
        {
          id: '1.1.4',
          name: 'Rook Mate: Harder',
          description: 'Trickier rook checkmates',
          requiredTags: ['mateIn1'],
          ratingMin: 600,
          ratingMax: 750,
          pieceFilter: 'rook',
          minPlays: 1000,
        },
        {
          id: '1.1.R',
          name: 'Review: Mate in 1',
          description: 'Find the checkmate',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn1'],
          ratingMin: 400,
          ratingMax: 750,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // BLOCK 2: BACK RANK MATE
    // "They forgot to make a door."
    // ========================================
    {
      id: 'mod-2',
      name: 'Back Rank Mate',
      description: 'Trap the king on the back rank',
      lessons: [
        {
          id: '1.2.1',
          name: 'Back Rank: Easy',
          description: 'Simple back rank patterns',
          requiredTags: ['backRankMate'],
          ratingMin: 400,
          ratingMax: 550,
          minPlays: 1000,
        },
        {
          id: '1.2.2',
          name: 'Back Rank: Medium',
          description: 'Back rank with setup moves',
          requiredTags: ['backRankMate'],
          ratingMin: 500,
          ratingMax: 650,
          minPlays: 1000,
        },
        {
          id: '1.2.3',
          name: 'Back Rank: Harder',
          description: 'Sneaky back rank checkmates',
          requiredTags: ['backRankMate'],
          ratingMin: 600,
          ratingMax: 750,
          minPlays: 1000,
        },
        {
          id: '1.2.R',
          name: 'Review: Back Rank',
          description: 'Find the back rank mate',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['backRankMate'],
          ratingMin: 400,
          ratingMax: 750,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // BLOCK 3: MATE IN TWO
    // "Plan ahead - one move isn't enough."
    // ========================================
    {
      id: 'mod-3',
      name: 'Mate in 2',
      description: 'Checkmate in two moves',
      lessons: [
        {
          id: '1.3.1',
          name: 'Mate in 2: Easy',
          description: 'Simple two-move checkmates',
          requiredTags: ['mateIn2'],
          ratingMin: 400,
          ratingMax: 525,
          minPlays: 1000,
        },
        {
          id: '1.3.2',
          name: 'Mate in 2: Medium',
          description: 'Two-move mates with obstacles',
          requiredTags: ['mateIn2'],
          ratingMin: 525,
          ratingMax: 625,
          minPlays: 1000,
        },
        {
          id: '1.3.3',
          name: 'Mate in 2: Harder',
          description: 'Tricky two-move checkmates',
          requiredTags: ['mateIn2'],
          ratingMin: 625,
          ratingMax: 750,
          minPlays: 1000,
        },
        {
          id: '1.3.R',
          name: 'Review: Mate in 2',
          description: 'Find the two-move checkmate',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn2'],
          ratingMin: 400,
          ratingMax: 750,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // BLOCK 4: WINNING MATERIAL
    // "Take their stuff. They left it hanging."
    // ========================================
    {
      id: 'mod-4',
      name: 'Winning Material',
      description: 'Take what they give you',
      lessons: [
        {
          id: '1.4.1',
          name: 'Hanging Pieces',
          description: 'Grab the undefended piece',
          requiredTags: ['hangingPiece'],
          excludeTags: ['mateIn1', 'mateIn2', 'fork', 'pin', 'skewer'],
          ratingMin: 400,
          ratingMax: 700,
          minPlays: 1000,
        },
        {
          id: '1.4.2',
          name: 'Crushing: Easy',
          description: 'Convert your big advantage',
          requiredTags: ['crushing'],
          excludeTags: ['mateIn1', 'mateIn2', 'fork', 'pin', 'skewer', 'discoveredAttack'],
          ratingMin: 400,
          ratingMax: 575,
          minPlays: 1000,
        },
        {
          id: '1.4.3',
          name: 'Crushing: Medium',
          description: 'Find the winning move',
          requiredTags: ['crushing'],
          excludeTags: ['mateIn1', 'mateIn2', 'fork', 'pin', 'skewer', 'discoveredAttack'],
          ratingMin: 525,
          ratingMax: 675,
          minPlays: 1000,
        },
        {
          id: '1.4.4',
          name: 'Crushing: Harder',
          description: 'Crush them completely',
          requiredTags: ['crushing'],
          excludeTags: ['mateIn1', 'mateIn2', 'fork', 'pin', 'skewer', 'discoveredAttack'],
          ratingMin: 625,
          ratingMax: 800,
          minPlays: 1000,
        },
        {
          id: '1.4.R',
          name: 'Review: Win Material',
          description: 'Find the free piece',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['hangingPiece', 'crushing'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 750,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // BLOCK 5: THE FORK
    // "Attack two things. They can only save one."
    // ========================================
    {
      id: 'mod-5',
      name: 'The Fork',
      description: 'Attack two things at once',
      lessons: [
        {
          id: '1.5.1',
          name: 'Knight Forks: Easy',
          description: 'The knight is the fork master',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 550,
          pieceFilter: 'knight',
          minPlays: 1000,
        },
        {
          id: '1.5.2',
          name: 'Knight Forks: Harder',
          description: 'Trickier knight forks',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 525,
          ratingMax: 700,
          pieceFilter: 'knight',
          minPlays: 1000,
        },
        {
          id: '1.5.3',
          name: 'Pawn Forks',
          description: 'Little pawn, big damage',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 650,
          pieceFilter: 'pawn',
          minPlays: 1000,
        },
        {
          id: '1.5.4',
          name: 'Queen & Rook Forks',
          description: 'Long-range double attacks',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 450,
          ratingMax: 700,
          minPlays: 1000,
        },
        {
          id: '1.5.R',
          name: 'Review: Forks',
          description: 'Find the fork',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 750,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // BLOCK 6: FAMOUS CHECKMATE PATTERNS
    // "Learn the classics."
    // ========================================
    {
      id: 'mod-6',
      name: 'Classic Checkmates',
      description: 'Named patterns the pros use',
      lessons: [
        {
          id: '1.6.1',
          name: 'Smothered Mate',
          description: 'Knight checkmate on a trapped king',
          requiredTags: ['smotheredMate'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 1000,
        },
        {
          id: '1.6.2',
          name: 'Arabian Mate',
          description: 'Rook and knight corner checkmate',
          requiredTags: ['arabianMate'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 1000,
        },
        {
          id: '1.6.3',
          name: 'Double Bishop Mate',
          description: 'Two bishops deliver checkmate',
          requiredTags: ['doubleBishopMate'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 1000,
        },
        {
          id: '1.6.4',
          name: 'Hook Mate',
          description: 'Rook and knight hook pattern',
          requiredTags: ['hookMate'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 1000,
        },
        {
          id: '1.6.R',
          name: 'Review: Classic Mates',
          description: 'Find the famous pattern',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['smotheredMate', 'arabianMate', 'doubleBishopMate', 'hookMate', 'dovetailMate'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // BLOCK 7: LEVEL 1 MASTERY
    // "Show what you've learned"
    // ========================================
    {
      id: 'mod-7',
      name: 'Level 1 Mastery',
      description: 'Mixed practice - all themes',
      lessons: [
        {
          id: '1.7.1',
          name: 'Mixed: Mate or Material',
          description: 'Checkmate or win a piece?',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn1', 'mateIn2', 'backRankMate', 'hangingPiece', 'crushing', 'fork'],
          ratingMin: 400,
          ratingMax: 700,
          minPlays: 2000,
        },
        {
          id: '1.7.2',
          name: 'Mixed: All Level 1',
          description: 'Everything you learned',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn1', 'mateIn2', 'backRankMate', 'hangingPiece', 'crushing', 'fork', 'smotheredMate', 'arabianMate'],
          ratingMin: 450,
          ratingMax: 750,
          minPlays: 2000,
        },
        {
          id: '1.7.R',
          name: 'Level 1 Final',
          description: 'Prove your mastery',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn1', 'mateIn2', 'backRankMate', 'hangingPiece', 'crushing', 'fork', 'smotheredMate', 'arabianMate', 'doubleBishopMate'],
          ratingMin: 500,
          ratingMax: 800,
          minPlays: 3000,
        },
      ],
    },
  ],
};

// Helper functions
export function getAllLessonsV2(): LessonCriteria[] {
  return level1V2.modules.flatMap(m => m.lessons);
}

export function getLessonByIdV2(id: string): LessonCriteria | undefined {
  return getAllLessonsV2().find(l => l.id === id);
}

export function getModuleByIdV2(id: string): Module | undefined {
  return level1V2.modules.find(m => m.id === id);
}

export function getLessonsForModuleV2(moduleId: string): LessonCriteria[] {
  const module = getModuleByIdV2(moduleId);
  return module?.lessons || [];
}

export function getLessonCountV2(): number {
  return getAllLessonsV2().length;
}
