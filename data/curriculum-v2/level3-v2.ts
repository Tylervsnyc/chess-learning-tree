/**
 * Level 3 V2 Curriculum (1000-1200 ELO)
 * "Never Apologize for Being Great"
 *
 * You have the weapons. Now learn the setups.
 * Make them walk right into your traps.
 *
 * Introduces tactical enablers - the moves that make tactics possible:
 * - Deflection (force a defender away)
 * - Attraction (lure a piece to a bad square)
 * - Sacrifice (give up material for bigger gains)
 * - Plus longer calculations and combinations
 *
 * Uses "clean" puzzles: 3000+ plays, single tactical theme = highly verified
 */

import { LessonCriteria, Module, Level } from '../level1-curriculum';

export const level3V2: Level = {
  id: 'level-3',
  name: 'Level 3: Never Apologize for Being Great',
  ratingRange: '1000-1200',
  modules: [
    // ========================================
    // BLOCK 1: DEFLECTION
    // "Get that defender out of the way"
    // ========================================
    {
      id: 'mod-1',
      name: 'Deflection',
      description: 'Force the defender away from its duty',
      lessons: [
        {
          id: '3.1.1',
          name: 'Deflect the Defender',
          description: 'Attack what protects them',
          requiredTags: ['deflection'],
          excludeTags: ['mateIn1'],
          ratingMin: 1000,
          ratingMax: 1100,
          minPlays: 3000,
        },
        {
          id: '3.1.2',
          name: 'Deflection: Harder',
          description: 'Complex deflection patterns',
          requiredTags: ['deflection'],
          excludeTags: ['mateIn1'],
          ratingMin: 1075,
          ratingMax: 1175,
          minPlays: 3000,
        },
        {
          id: '3.1.R',
          name: 'Review: Deflection',
          description: 'Find the deflection',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['deflection'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // BLOCK 2: ATTRACTION
    // "Lure them to their doom"
    // ========================================
    {
      id: 'mod-2',
      name: 'Attraction',
      description: 'Lure pieces to vulnerable squares',
      lessons: [
        {
          id: '3.2.1',
          name: 'Attract the King',
          description: 'Lure the king into danger',
          requiredTags: ['attraction'],
          excludeTags: ['mateIn1'],
          ratingMin: 1000,
          ratingMax: 1125,
          minPlays: 3000,
        },
        {
          id: '3.2.2',
          name: 'Attraction: Harder',
          description: 'Complex attraction sacrifices',
          requiredTags: ['attraction'],
          ratingMin: 1075,
          ratingMax: 1200,
          minPlays: 3000,
        },
        {
          id: '3.2.R',
          name: 'Review: Attraction',
          description: 'Find the attraction',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['attraction'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // BLOCK 3: SACRIFICE
    // "Give to get more"
    // ========================================
    {
      id: 'mod-3',
      name: 'The Sacrifice',
      description: 'Give up material for a greater reward',
      lessons: [
        {
          id: '3.3.1',
          name: 'Sacrifice for Mate',
          description: 'Give up a piece to deliver checkmate',
          requiredTags: ['sacrifice'],
          ratingMin: 1000,
          ratingMax: 1125,
          minPlays: 3000,
        },
        {
          id: '3.3.2',
          name: 'Sacrifice: Harder',
          description: 'Complex sacrificial combinations',
          requiredTags: ['sacrifice'],
          ratingMin: 1075,
          ratingMax: 1200,
          minPlays: 3000,
        },
        {
          id: '3.3.R',
          name: 'Review: Sacrifice',
          description: 'Find the winning sacrifice',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['sacrifice'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // BLOCK 4: ADVANCED MECHANISMS
    // "Master your weapons"
    // ========================================
    {
      id: 'mod-4',
      name: 'Advanced Mechanisms',
      description: 'Level up your tactical weapons',
      lessons: [
        {
          id: '3.4.1',
          name: 'Advanced Forks',
          description: 'Harder fork puzzles',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1000,
          ratingMax: 1150,
          minPlays: 3000,
        },
        {
          id: '3.4.2',
          name: 'Advanced Pins',
          description: 'Harder pin puzzles',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 3000,
        },
        {
          id: '3.4.3',
          name: 'Advanced Discoveries',
          description: 'Complex discovered attacks',
          requiredTags: ['discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1025,
          ratingMax: 1200,
          minPlays: 3000,
        },
        {
          id: '3.4.R',
          name: 'Review: Advanced Mechanisms',
          description: 'Find the tactic',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['fork', 'pin', 'skewer', 'discoveredAttack'],
          excludeTags: ['mateIn1'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // BLOCK 5: LONGER CALCULATIONS
    // "See further ahead"
    // ========================================
    {
      id: 'mod-5',
      name: 'Longer Calculations',
      description: 'Calculate deeper - mate in 3 and 4',
      lessons: [
        {
          id: '3.5.1',
          name: 'Mate in 3: Level 3',
          description: 'Three-move checkmates at your level',
          requiredTags: ['mateIn3'],
          ratingMin: 1000,
          ratingMax: 1150,
          minPlays: 3000,
        },
        {
          id: '3.5.2',
          name: 'Mate in 4',
          description: 'Four-move checkmates',
          requiredTags: ['mateIn4'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 3000,
        },
        {
          id: '3.5.R',
          name: 'Review: Long Calculations',
          description: 'Find the deep checkmate',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn3', 'mateIn4'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // BLOCK 6: LEVEL 3 MASTERY
    // "The complete tactician"
    // ========================================
    {
      id: 'mod-6',
      name: 'Level 3 Mastery',
      description: 'All enablers and combinations',
      lessons: [
        {
          id: '3.6.1',
          name: 'Mixed Enablers',
          description: 'Deflection, attraction, or sacrifice?',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['deflection', 'attraction', 'sacrifice'],
          ratingMin: 1000,
          ratingMax: 1175,
          minPlays: 5000,
        },
        {
          id: '3.6.2',
          name: 'The Complete Tactician',
          description: 'Everything combined',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['deflection', 'attraction', 'sacrifice', 'fork', 'pin', 'skewer', 'discoveredAttack'],
          ratingMin: 1025,
          ratingMax: 1200,
          minPlays: 5000,
        },
        {
          id: '3.6.R',
          name: 'Level 3 Final',
          description: 'The ultimate tactical test',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['deflection', 'attraction', 'sacrifice', 'fork', 'pin', 'discoveredAttack', 'mateIn3', 'mateIn4'],
          ratingMin: 1050,
          ratingMax: 1200,
          minPlays: 5000,
        },
      ],
    },
  ],
};

// Helper functions
export function getAllLessonsL3V2(): LessonCriteria[] {
  return level3V2.modules.flatMap(m => m.lessons);
}

export function getLessonByIdL3V2(id: string): LessonCriteria | undefined {
  return getAllLessonsL3V2().find(l => l.id === id);
}

export function getModuleByIdL3V2(id: string): Module | undefined {
  return level3V2.modules.find(m => m.id === id);
}

export function getLessonCountL3V2(): number {
  return getAllLessonsL3V2().length;
}
