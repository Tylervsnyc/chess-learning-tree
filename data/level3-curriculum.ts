/**
 * Level 3 Curriculum (1000-1200 ELO)
 *
 * Data analysis of 189,805 puzzles at 1000-1200 ELO shows:
 * - 16.8% mateIn2
 * - 15.3% fork
 * - 10.2% mateIn1
 * - 6.8% discoveredAttack
 * - 4.5% pin (NOW MAJOR)
 * - 3.7% deflection (NOW MAJOR)
 * - 3.1% mateIn3
 * - 3.1% backRankMate
 * - 2.7% skewer
 * - 1.9% attraction (EMERGING)
 * - 1.6% defensiveMove (EMERGING)
 *
 * Key themes: Pins and deflection become major. Attraction appears.
 * Defensive moves start to matter. This level requires deeper calculation.
 */

import { LessonCriteria, Module, Level } from './level1-curriculum';

export const level3: Level = {
  id: 'level-3',
  name: 'Level 3: Tactical Depth',
  ratingRange: '1000-1200',
  modules: [
    // ========================================
    // MODULE 1: PINS MASTERY
    // ========================================
    {
      id: 'mod-1',
      name: 'Pins Mastery',
      description: 'Advanced pin tactics and combinations',
      lessons: [
        {
          id: '3.1.1',
          name: 'Pins: Advanced Patterns',
          description: 'Complex pin setups',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1000,
          ratingMax: 1075,
          minPlays: 1000,
        },
        {
          id: '3.1.2',
          name: 'Pins: Expert',
          description: 'Multi-step pin combinations',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1050,
          ratingMax: 1125,
          minPlays: 1000,
        },
        {
          id: '3.1.3',
          name: 'Pins: Mastery',
          description: 'The most challenging pin puzzles',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1100,
          ratingMax: 1200,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 2: DEFLECTION MASTERY
    // ========================================
    {
      id: 'mod-2',
      name: 'Deflection Mastery',
      description: 'Advanced deflection tactics',
      lessons: [
        {
          id: '3.2.1',
          name: 'Deflection: Advanced',
          description: 'Complex deflection patterns',
          requiredTags: ['deflection'],
          ratingMin: 1000,
          ratingMax: 1100,
          minPlays: 1000,
        },
        {
          id: '3.2.2',
          name: 'Deflection: Expert',
          description: 'Multi-step deflection combinations',
          requiredTags: ['deflection'],
          ratingMin: 1075,
          ratingMax: 1175,
          minPlays: 1000,
        },
        {
          id: '3.2.3',
          name: 'Deflection: Mastery',
          description: 'Master the art of deflection',
          requiredTags: ['deflection'],
          ratingMin: 1125,
          ratingMax: 1200,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 3: ATTRACTION
    // ========================================
    {
      id: 'mod-3',
      name: 'Attraction',
      description: 'Lure pieces to vulnerable squares',
      lessons: [
        {
          id: '3.3.1',
          name: 'Attraction: Introduction',
          description: 'Force pieces to bad squares',
          requiredTags: ['attraction'],
          ratingMin: 1000,
          ratingMax: 1100,
          minPlays: 1000,
        },
        {
          id: '3.3.2',
          name: 'Attraction: Practice',
          description: 'More attraction patterns',
          requiredTags: ['attraction'],
          ratingMin: 1050,
          ratingMax: 1150,
          minPlays: 1000,
        },
        {
          id: '3.3.3',
          name: 'Attraction: Advanced',
          description: 'Complex attraction combinations',
          requiredTags: ['attraction'],
          ratingMin: 1100,
          ratingMax: 1200,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 4: REVIEW - Forcing Moves
    // ========================================
    {
      id: 'mod-4',
      name: 'Review: Forcing Moves',
      description: 'Pins, deflection, attraction - no hints!',
      lessons: [
        {
          id: '3.4.1',
          name: 'Review Set 1',
          description: 'Mixed forcing move puzzles',
          requiredTags: [],
          ratingMin: 1000,
          ratingMax: 1100,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 5: EXPERT FORKS
    // ========================================
    {
      id: 'mod-5',
      name: 'Expert Forks',
      description: 'The most challenging fork patterns',
      lessons: [
        {
          id: '3.5.1',
          name: 'Knight Forks: Expert',
          description: 'Difficult knight fork setups',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1000,
          ratingMax: 1100,
          pieceFilter: 'knight',
          minPlays: 1000,
        },
        {
          id: '3.5.2',
          name: 'Knight Forks: Master',
          description: 'Master-level knight forks',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1075,
          ratingMax: 1175,
          pieceFilter: 'knight',
          minPlays: 1000,
        },
        {
          id: '3.5.3',
          name: 'Complex Forks',
          description: 'Multi-step fork combinations',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1100,
          ratingMax: 1200,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 6: DISCOVERED ATTACKS ADVANCED
    // ========================================
    {
      id: 'mod-6',
      name: 'Discovered Attacks: Expert',
      description: 'Complex discovered attack patterns',
      lessons: [
        {
          id: '3.6.1',
          name: 'Discovered Attacks: Expert',
          description: 'Advanced discovered attacks',
          requiredTags: ['discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1000,
          ratingMax: 1100,
          minPlays: 1000,
        },
        {
          id: '3.6.2',
          name: 'Discovered Check: Expert',
          description: 'Powerful discovered check patterns',
          requiredTags: ['discoveredCheck'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 1000,
        },
        {
          id: '3.6.3',
          name: 'Double Check',
          description: 'The devastating double check',
          requiredTags: ['doubleCheck'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 7: DEFENSIVE MOVES
    // ========================================
    {
      id: 'mod-7',
      name: 'Defensive Tactics',
      description: 'Find the saving defensive resource',
      lessons: [
        {
          id: '3.7.1',
          name: 'Defensive Move: Introduction',
          description: 'Find the move that saves the position',
          requiredTags: ['defensiveMove'],
          ratingMin: 1000,
          ratingMax: 1100,
          minPlays: 1000,
        },
        {
          id: '3.7.2',
          name: 'Defensive Move: Practice',
          description: 'More defensive resources',
          requiredTags: ['defensiveMove'],
          ratingMin: 1050,
          ratingMax: 1150,
          minPlays: 1000,
        },
        {
          id: '3.7.3',
          name: 'Defensive Move: Advanced',
          description: 'Complex defensive tactics',
          requiredTags: ['defensiveMove'],
          ratingMin: 1100,
          ratingMax: 1200,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 8: REVIEW - Mixed Tactics
    // ========================================
    {
      id: 'mod-8',
      name: 'Review: Mixed Tactics',
      description: 'All tactics together - no hints!',
      lessons: [
        {
          id: '3.8.1',
          name: 'Review Set 2',
          description: 'Mixed tactical puzzles',
          requiredTags: [],
          ratingMin: 1025,
          ratingMax: 1125,
          minPlays: 1000,
        },
        {
          id: '3.8.2',
          name: 'Review Set 3',
          description: 'Harder mixed puzzles',
          requiredTags: [],
          ratingMin: 1100,
          ratingMax: 1200,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 9: MATE IN 2 & 3 EXPERT
    // ========================================
    {
      id: 'mod-9',
      name: 'Checkmate Calculation',
      description: 'Complex mating sequences',
      lessons: [
        {
          id: '3.9.1',
          name: 'Mate in 2: Expert',
          description: 'Difficult two-move checkmates',
          requiredTags: ['mateIn2'],
          ratingMin: 1000,
          ratingMax: 1100,
          minPlays: 1000,
        },
        {
          id: '3.9.2',
          name: 'Mate in 2: Master',
          description: 'The trickiest mate in 2 puzzles',
          requiredTags: ['mateIn2'],
          ratingMin: 1075,
          ratingMax: 1200,
          minPlays: 1000,
        },
        {
          id: '3.9.3',
          name: 'Mate in 3: Expert',
          description: 'Three-move checkmates at expert level',
          requiredTags: ['mateIn3'],
          ratingMin: 1000,
          ratingMax: 1125,
          minPlays: 1000,
        },
        {
          id: '3.9.4',
          name: 'Mate in 3: Master',
          description: 'Master-level three-move mates',
          requiredTags: ['mateIn3'],
          ratingMin: 1100,
          ratingMax: 1200,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 10: INTERFERENCE & CLEARANCE
    // ========================================
    {
      id: 'mod-10',
      name: 'Advanced Tactics',
      description: 'Interference, clearance, and more',
      lessons: [
        {
          id: '3.10.1',
          name: 'Interference',
          description: 'Block the defender\'s line',
          requiredTags: ['interference'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 1000,
        },
        {
          id: '3.10.2',
          name: 'Clearance',
          description: 'Clear a square or line for another piece',
          requiredTags: ['clearance'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 1000,
        },
        {
          id: '3.10.3',
          name: 'X-Ray Attacks',
          description: 'Attack through another piece',
          requiredTags: ['xRayAttack'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 11: INTERMEZZO
    // ========================================
    {
      id: 'mod-11',
      name: 'Intermezzo',
      description: 'The in-between move (zwischenzug)',
      lessons: [
        {
          id: '3.11.1',
          name: 'Intermezzo: Introduction',
          description: 'Insert a surprise move before recapturing',
          requiredTags: ['intermezzo'],
          ratingMin: 1000,
          ratingMax: 1125,
          minPlays: 1000,
        },
        {
          id: '3.11.2',
          name: 'Intermezzo: Practice',
          description: 'More zwischenzug patterns',
          requiredTags: ['intermezzo'],
          ratingMin: 1075,
          ratingMax: 1200,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 12: ENDGAME TACTICS
    // ========================================
    {
      id: 'mod-12',
      name: 'Endgame Tactics',
      description: 'Win in simplified positions',
      lessons: [
        {
          id: '3.12.1',
          name: 'Rook Endgames: Advanced',
          description: 'Complex rook ending tactics',
          requiredTags: ['rookEndgame'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1000,
          ratingMax: 1150,
          minPlays: 1000,
        },
        {
          id: '3.12.2',
          name: 'Pawn Endgames: Advanced',
          description: 'Complex pawn ending tactics',
          requiredTags: ['pawnEndgame'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 1000,
        },
        {
          id: '3.12.3',
          name: 'Queen Endgames',
          description: 'Tactics in queen endings',
          requiredTags: ['queenEndgame'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1000,
          ratingMax: 1200,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 13: QUIET MOVES
    // ========================================
    {
      id: 'mod-13',
      name: 'Quiet Moves',
      description: 'Non-forcing moves that create winning threats',
      lessons: [
        {
          id: '3.13.1',
          name: 'Quiet Move: Introduction',
          description: 'The powerful non-check, non-capture',
          requiredTags: ['quietMove'],
          ratingMin: 1000,
          ratingMax: 1150,
          minPlays: 1000,
        },
        {
          id: '3.13.2',
          name: 'Quiet Move: Practice',
          description: 'More quiet move patterns',
          requiredTags: ['quietMove'],
          ratingMin: 1075,
          ratingMax: 1200,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 14: FINAL REVIEW
    // ========================================
    {
      id: 'mod-14',
      name: 'Level 3 Final',
      description: 'Prove your tactical depth',
      lessons: [
        {
          id: '3.14.1',
          name: 'Final Review: Medium',
          description: 'Mixed puzzles from all topics',
          requiredTags: [],
          ratingMin: 1000,
          ratingMax: 1125,
          minPlays: 1000,
        },
        {
          id: '3.14.2',
          name: 'Final Review: Hard',
          description: 'The ultimate challenge',
          requiredTags: [],
          ratingMin: 1100,
          ratingMax: 1200,
          minPlays: 1000,
        },
      ],
    },
  ],
};

// Helper functions
export function getAllLessonsLevel3(): LessonCriteria[] {
  return level3.modules.flatMap(m => m.lessons);
}

export function getLessonByIdLevel3(id: string): LessonCriteria | undefined {
  return getAllLessonsLevel3().find(l => l.id === id);
}

export function getModuleByIdLevel3(id: string): Module | undefined {
  return level3.modules.find(m => m.id === id);
}

export function getLessonCountLevel3(): number {
  return getAllLessonsLevel3().length;
}
