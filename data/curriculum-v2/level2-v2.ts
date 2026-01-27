/**
 * Level 2 V2 Curriculum (800-1000 ELO)
 * "The Assassin's Toolkit"
 *
 * Now that you know how to win, so do they.
 * Time to learn the weapons that extract maximum cruelty.
 *
 * Introduces tactical mechanisms:
 * - Forks (attack two things at once)
 * - Pins (freeze a piece in place)
 * - Skewers (attack through a piece)
 * - Discovered attacks (reveal hidden threats)
 *
 * Uses "clean" puzzles: 3000+ plays, single tactical theme = highly verified
 */

import { LessonCriteria, Module, Level } from '../level1-curriculum';

export const level2V2: Level = {
  id: 'level-2',
  name: "Level 2: The Assassin's Toolkit",
  ratingRange: '800-1000',
  modules: [
    // ========================================
    // BLOCK 1: THE FORK
    // "Attack two things. They can only save one."
    // ========================================
    {
      id: 'mod-1',
      name: 'The Fork',
      description: 'Attack two things - they can only save one',
      lessons: [
        {
          id: '2.1.1',
          name: 'Knight Forks: Easy',
          description: 'The knight is the ultimate assassin',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 900,
          pieceFilter: 'knight',
          minPlays: 3000,
        },
        {
          id: '2.1.2',
          name: 'Knight Forks: Medium',
          description: 'More complex knight attacks',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 875,
          ratingMax: 975,
          pieceFilter: 'knight',
          minPlays: 3000,
        },
        {
          id: '2.1.3',
          name: 'Pawn Forks',
          description: 'Little pawn, big damage',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 1000,
          pieceFilter: 'pawn',
          minPlays: 3000,
        },
        {
          id: '2.1.4',
          name: 'Queen & Rook Forks',
          description: 'Long-range double attacks',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 1000,
          minPlays: 3000,
        },
        {
          id: '2.1.R',
          name: 'Review: Forks',
          description: 'Find the fork',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 1000,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // BLOCK 2: THE PIN
    // "Freeze them in place"
    // ========================================
    {
      id: 'mod-2',
      name: 'The Pin',
      description: 'Freeze a piece - it cannot move',
      lessons: [
        {
          id: '2.2.1',
          name: 'Absolute Pins',
          description: 'Pin to the king - frozen solid',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
          ratingMin: 800,
          ratingMax: 925,
          minPlays: 3000,
        },
        {
          id: '2.2.2',
          name: 'Winning Pinned Pieces',
          description: 'Pile on the frozen target',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
          ratingMin: 875,
          ratingMax: 1000,
          minPlays: 3000,
        },
        {
          id: '2.2.R',
          name: 'Review: Pins',
          description: 'Find the pin',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['pin'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 1000,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // BLOCK 3: THE SKEWER
    // "Attack through them"
    // ========================================
    {
      id: 'mod-3',
      name: 'The Skewer',
      description: 'Attack through a piece to win another',
      lessons: [
        {
          id: '2.3.1',
          name: 'Skewers: Easy',
          description: 'Attack a piece, win the one behind',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 925,
          minPlays: 3000,
        },
        {
          id: '2.3.2',
          name: 'Royal Skewers',
          description: 'Skewer through the king',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 875,
          ratingMax: 1000,
          minPlays: 3000,
        },
        {
          id: '2.3.R',
          name: 'Review: Skewers',
          description: 'Find the skewer',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 1000,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // BLOCK 4: DISCOVERED ATTACKS
    // "The hidden threat"
    // ========================================
    {
      id: 'mod-4',
      name: 'Discovered Attack',
      description: 'Move one piece, reveal another threat',
      lessons: [
        {
          id: '2.4.1',
          name: 'Basic Discoveries',
          description: 'Uncover a hidden attack',
          requiredTags: ['discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2', 'doubleCheck'],
          ratingMin: 800,
          ratingMax: 925,
          minPlays: 3000,
        },
        {
          id: '2.4.2',
          name: 'Discovery + Attack',
          description: 'Two devastating threats at once',
          requiredTags: ['discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 875,
          ratingMax: 1000,
          minPlays: 3000,
        },
        {
          id: '2.4.R',
          name: 'Review: Discoveries',
          description: 'Find the discovered attack',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 1000,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // BLOCK 5: TACTICAL CHECKMATES
    // "Use your weapons to deliver the kill"
    // ========================================
    {
      id: 'mod-5',
      name: 'Tactical Checkmates',
      description: 'Combine mechanisms with checkmate',
      lessons: [
        {
          id: '2.5.1',
          name: 'Mate in 2: Level 2',
          description: 'Two-move mates at your level',
          requiredTags: ['mateIn2'],
          ratingMin: 800,
          ratingMax: 950,
          minPlays: 3000,
        },
        {
          id: '2.5.2',
          name: 'Mate in 3',
          description: 'Calculate three moves ahead',
          requiredTags: ['mateIn3'],
          ratingMin: 800,
          ratingMax: 1000,
          minPlays: 3000,
        },
        {
          id: '2.5.R',
          name: 'Review: Tactical Mates',
          description: 'Find the checkmate',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn2', 'mateIn3'],
          ratingMin: 800,
          ratingMax: 1000,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // BLOCK 6: LEVEL 2 MASTERY
    // "Deploy your full arsenal"
    // ========================================
    {
      id: 'mod-6',
      name: 'Level 2 Mastery',
      description: 'All mechanisms combined',
      lessons: [
        {
          id: '2.6.1',
          name: 'Mixed Mechanisms',
          description: 'Fork, pin, skewer, or discovery?',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['fork', 'pin', 'skewer', 'discoveredAttack'],
          excludeTags: ['mateIn1'],
          ratingMin: 800,
          ratingMax: 975,
          minPlays: 5000,
        },
        {
          id: '2.6.R',
          name: 'Level 2 Final',
          description: 'Prove your tactical mastery',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['fork', 'pin', 'skewer', 'discoveredAttack', 'mateIn2', 'mateIn3'],
          ratingMin: 850,
          ratingMax: 1000,
          minPlays: 5000,
        },
      ],
    },
  ],
};

// Helper functions
export function getAllLessonsL2V2(): LessonCriteria[] {
  return level2V2.modules.flatMap(m => m.lessons);
}

export function getLessonByIdL2V2(id: string): LessonCriteria | undefined {
  return getAllLessonsL2V2().find(l => l.id === id);
}

export function getModuleByIdL2V2(id: string): Module | undefined {
  return level2V2.modules.find(m => m.id === id);
}

export function getLessonCountL2V2(): number {
  return getAllLessonsL2V2().length;
}
