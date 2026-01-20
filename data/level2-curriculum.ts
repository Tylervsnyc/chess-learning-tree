/**
 * Level 2 Curriculum (800-1000 ELO)
 *
 * Data analysis of 89,048 puzzles at 800-1000 ELO shows:
 * - 20.9% fork (DOMINANT)
 * - 20.4% mateIn2
 * - 15.1% mateIn1
 * - 5.9% discoveredAttack
 * - 5.7% backRankMate
 * - 3.4% skewer
 * - 2.1% pin (EMERGING)
 * - 2.1% mateIn3
 * - 1.6% deflection (EMERGING)
 *
 * Key themes: Forks dominate. Pins and deflection start to appear.
 * This level deepens tactical pattern recognition.
 */

import { LessonCriteria, Module, Level } from './level1-curriculum';

export const level2: Level = {
  id: 'level-2',
  name: 'Level 2: Tactical Growth',
  ratingRange: '800-1000',
  modules: [
    // ========================================
    // MODULE 1: ADVANCED FORKS
    // ========================================
    {
      id: 'mod-1',
      name: 'Advanced Forks',
      description: 'Master the fork at a higher level',
      lessons: [
        {
          id: '2.1.1',
          name: 'Knight Forks: Intermediate',
          description: 'Knight attacks two pieces - trickier patterns',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 875,
          pieceFilter: 'knight',
          minPlays: 1000,
        },
        {
          id: '2.1.2',
          name: 'Knight Forks: Advanced',
          description: 'Complex knight fork setups',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 850,
          ratingMax: 925,
          pieceFilter: 'knight',
          minPlays: 1000,
        },
        {
          id: '2.1.3',
          name: 'Knight Forks: Expert',
          description: 'Multi-step knight fork combinations',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 900,
          ratingMax: 1000,
          pieceFilter: 'knight',
          minPlays: 1000,
        },
        {
          id: '2.1.4',
          name: 'Queen & Rook Forks',
          description: 'Double attacks with heavy pieces',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 950,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 2: PINS INTRODUCTION
    // ========================================
    {
      id: 'mod-2',
      name: 'Pins',
      description: 'Immobilize pieces with the pin tactic',
      lessons: [
        {
          id: '2.2.1',
          name: 'Pins: Introduction',
          description: 'Learn the pin - a piece cannot move',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1', 'mateIn2', 'fork'],
          ratingMin: 800,
          ratingMax: 900,
          minPlays: 1000,
        },
        {
          id: '2.2.2',
          name: 'Pins: Exploiting',
          description: 'Attack pinned pieces to win material',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 850,
          ratingMax: 950,
          minPlays: 1000,
        },
        {
          id: '2.2.3',
          name: 'Pins: Advanced',
          description: 'Complex pin combinations',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 900,
          ratingMax: 1000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 3: REVIEW - Find the Best Move
    // ========================================
    {
      id: 'mod-3',
      name: 'Review: Forks & Pins',
      description: 'Mixed puzzles - no theme hints!',
      lessons: [
        {
          id: '2.3.1',
          name: 'Review Set 1',
          description: 'Apply forks and pins without hints',
          requiredTags: [],
          ratingMin: 800,
          ratingMax: 900,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 4: DISCOVERED ATTACKS
    // ========================================
    {
      id: 'mod-4',
      name: 'Discovered Attacks',
      description: 'Move one piece, reveal an attack from another',
      lessons: [
        {
          id: '2.4.1',
          name: 'Discovered Attacks: Intermediate',
          description: 'Reveal hidden attacks',
          requiredTags: ['discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 900,
          minPlays: 1000,
        },
        {
          id: '2.4.2',
          name: 'Discovered Attacks: Advanced',
          description: 'Complex discovered attack patterns',
          requiredTags: ['discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 875,
          ratingMax: 975,
          minPlays: 1000,
        },
        {
          id: '2.4.3',
          name: 'Discovered Check',
          description: 'Discovered attacks with check',
          requiredTags: ['discoveredCheck'],
          ratingMin: 800,
          ratingMax: 1000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 5: DEFLECTION INTRODUCTION
    // ========================================
    {
      id: 'mod-5',
      name: 'Deflection',
      description: 'Force defenders away from their duties',
      lessons: [
        {
          id: '2.5.1',
          name: 'Deflection: Introduction',
          description: 'Lure a defender away',
          requiredTags: ['deflection'],
          ratingMin: 800,
          ratingMax: 925,
          minPlays: 1000,
        },
        {
          id: '2.5.2',
          name: 'Deflection: Practice',
          description: 'More deflection patterns',
          requiredTags: ['deflection'],
          ratingMin: 875,
          ratingMax: 1000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 6: SKEWERS
    // ========================================
    {
      id: 'mod-6',
      name: 'Skewers',
      description: 'Attack a valuable piece, win the one behind',
      lessons: [
        {
          id: '2.6.1',
          name: 'Skewers: Intermediate',
          description: 'Skewer patterns at higher level',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 900,
          minPlays: 1000,
        },
        {
          id: '2.6.2',
          name: 'Skewers: Advanced',
          description: 'Complex skewer setups',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 875,
          ratingMax: 1000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 7: REVIEW - Mixed Tactics
    // ========================================
    {
      id: 'mod-7',
      name: 'Review: Mixed Tactics',
      description: 'All tactics together - no hints!',
      lessons: [
        {
          id: '2.7.1',
          name: 'Review Set 2',
          description: 'Mixed tactical puzzles',
          requiredTags: [],
          ratingMin: 825,
          ratingMax: 925,
          minPlays: 1000,
        },
        {
          id: '2.7.2',
          name: 'Review Set 3',
          description: 'Harder mixed puzzles',
          requiredTags: [],
          ratingMin: 900,
          ratingMax: 1000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 8: MATE IN 2 ADVANCED
    // ========================================
    {
      id: 'mod-8',
      name: 'Mate in 2: Advanced',
      description: 'Harder two-move checkmates',
      lessons: [
        {
          id: '2.8.1',
          name: 'Mate in 2: Intermediate',
          description: 'Two-move mates at 800+ level',
          requiredTags: ['mateIn2'],
          ratingMin: 800,
          ratingMax: 900,
          minPlays: 1000,
        },
        {
          id: '2.8.2',
          name: 'Mate in 2: Hard',
          description: 'Trickier two-move checkmates',
          requiredTags: ['mateIn2'],
          ratingMin: 875,
          ratingMax: 975,
          minPlays: 1000,
        },
        {
          id: '2.8.3',
          name: 'Mate in 2 with Sacrifice',
          description: 'Sacrifice to deliver mate in 2',
          requiredTags: ['mateIn2', 'sacrifice'],
          ratingMin: 800,
          ratingMax: 1000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 9: MATE IN 3
    // ========================================
    {
      id: 'mod-9',
      name: 'Mate in 3',
      description: 'Calculate three moves ahead',
      lessons: [
        {
          id: '2.9.1',
          name: 'Mate in 3: Practice',
          description: 'Three-move checkmate patterns',
          requiredTags: ['mateIn3'],
          ratingMin: 800,
          ratingMax: 900,
          minPlays: 1000,
        },
        {
          id: '2.9.2',
          name: 'Mate in 3: Advanced',
          description: 'Harder three-move mates',
          requiredTags: ['mateIn3'],
          ratingMin: 875,
          ratingMax: 1000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 10: BACK RANK & FAMOUS MATES
    // ========================================
    {
      id: 'mod-10',
      name: 'Checkmate Patterns',
      description: 'Back rank and famous mate patterns',
      lessons: [
        {
          id: '2.10.1',
          name: 'Back Rank: Advanced',
          description: 'Complex back rank combinations',
          requiredTags: ['backRankMate'],
          ratingMin: 800,
          ratingMax: 950,
          minPlays: 1000,
        },
        {
          id: '2.10.2',
          name: 'Smothered Mate: Advanced',
          description: 'Knight smothers the king',
          requiredTags: ['smotheredMate'],
          ratingMin: 800,
          ratingMax: 1000,
          minPlays: 1000,
        },
        {
          id: '2.10.3',
          name: 'Opera & Arabian Mate',
          description: 'Classic mating patterns',
          requiredTags: ['operaMate'],
          ratingMin: 800,
          ratingMax: 1000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 11: HANGING PIECES
    // ========================================
    {
      id: 'mod-11',
      name: 'Hanging Pieces',
      description: 'Spot and capture undefended material',
      lessons: [
        {
          id: '2.11.1',
          name: 'Hanging Piece Tactics',
          description: 'Find the undefended piece',
          requiredTags: ['hangingPiece'],
          ratingMin: 800,
          ratingMax: 950,
          minPlays: 1000,
        },
        {
          id: '2.11.2',
          name: 'Capturing Defenders',
          description: 'Remove the defender to win material',
          requiredTags: ['capturingDefender'],
          ratingMin: 800,
          ratingMax: 1000,
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
      description: 'Tactical play in simplified positions',
      lessons: [
        {
          id: '2.12.1',
          name: 'Rook Endgame Tactics',
          description: 'Tactics in rook endings',
          requiredTags: ['rookEndgame'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 1000,
          minPlays: 1000,
        },
        {
          id: '2.12.2',
          name: 'Pawn Endgame Tactics',
          description: 'Win in king and pawn endings',
          requiredTags: ['pawnEndgame'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 800,
          ratingMax: 1000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 13: FINAL REVIEW
    // ========================================
    {
      id: 'mod-13',
      name: 'Level 2 Final',
      description: 'Prove your tactical growth',
      lessons: [
        {
          id: '2.13.1',
          name: 'Final Review: Medium',
          description: 'Mixed puzzles from all topics',
          requiredTags: [],
          ratingMin: 800,
          ratingMax: 925,
          minPlays: 1000,
        },
        {
          id: '2.13.2',
          name: 'Final Review: Hard',
          description: 'Challenge yourself!',
          requiredTags: [],
          ratingMin: 900,
          ratingMax: 1000,
          minPlays: 1000,
        },
      ],
    },
  ],
};

// Helper functions
export function getAllLessonsLevel2(): LessonCriteria[] {
  return level2.modules.flatMap(m => m.lessons);
}

export function getLessonByIdLevel2(id: string): LessonCriteria | undefined {
  return getAllLessonsLevel2().find(l => l.id === id);
}

export function getModuleByIdLevel2(id: string): Module | undefined {
  return level2.modules.find(m => m.id === id);
}

export function getLessonCountLevel2(): number {
  return getAllLessonsLevel2().length;
}
