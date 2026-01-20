/**
 * Level 6 Curriculum (1600-1800 ELO)
 *
 * Data analysis of puzzles at 1600-1800 ELO shows:
 * - 20.1% mateIn2 (still dominant)
 * - 10.4% fork
 * - 8.2% mateIn3
 * - 5.1% mateIn4 (MAJOR)
 * - 4.9% pin
 * - 4.8% discoveredAttack
 * - 4.5% deflection
 * - 4.2% quietMove (MAJOR)
 * - 3.9% attraction
 * - 3.5% mateIn1
 * - 3.1% defensiveMove (MAJOR)
 * - 2.9% skewer
 * - 2.7% intermezzo
 * - 2.5% exposedKing
 * - 2.3% advancedPawn
 * - 2.1% trappedPiece
 * - 1.9% mateIn5 (EMERGING)
 * - 1.8% xRayAttack
 * - 1.6% hangingPiece
 * - 1.4% interference
 * - 1.2% clearance
 *
 * Key themes: Deep calculation (mateIn5 appears). Quiet moves and defensive
 * resources are critical. Complex multi-phase combinations. Players must
 * consistently calculate 5+ moves ahead and handle prophylactic thinking.
 */

import { LessonCriteria, Module, Level } from './level1-curriculum';

export const level6: Level = {
  id: 'level-6',
  name: 'Level 6: Expert Calculation',
  ratingRange: '1600-1800',
  modules: [
    // ========================================
    // MODULE 1: MATE IN 5
    // ========================================
    {
      id: 'mod-1',
      name: 'Mate in 5',
      description: 'Five-move checkmate sequences',
      lessons: [
        {
          id: '6.1.1',
          name: 'Mate in 5: Introduction',
          description: 'Calculate five moves ahead to checkmate',
          requiredTags: ['mateIn5'],
          ratingMin: 1600,
          ratingMax: 1700,
          minPlays: 1000,
        },
        {
          id: '6.1.2',
          name: 'Mate in 5: Forcing Lines',
          description: 'Find the forcing mating sequence',
          requiredTags: ['mateIn5'],
          ratingMin: 1650,
          ratingMax: 1750,
          minPlays: 1000,
        },
        {
          id: '6.1.3',
          name: 'Mate in 5: Expert',
          description: 'Expert five-move checkmates',
          requiredTags: ['mateIn5'],
          ratingMin: 1700,
          ratingMax: 1800,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '6.1.R',
          name: 'Module 1 Review: Mate in 5',
          description: 'Find the mate in 5',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn5'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 2: MATE IN 4 MASTERY
    // ========================================
    {
      id: 'mod-2',
      name: 'Mate in 4: Mastery',
      description: 'Complex four-move checkmates',
      lessons: [
        {
          id: '6.2.1',
          name: 'Mate in 4: Hidden Patterns',
          description: 'Non-obvious four-move mates',
          requiredTags: ['mateIn4'],
          ratingMin: 1600,
          ratingMax: 1700,
          minPlays: 1000,
        },
        {
          id: '6.2.2',
          name: 'Mate in 4: Quiet First Move',
          description: 'Four-move mates starting quietly',
          requiredTags: ['mateIn4', 'quietMove'],
          ratingMin: 1650,
          ratingMax: 1750,
          minPlays: 1000,
        },
        {
          id: '6.2.3',
          name: 'Mate in 4: Mastery',
          description: 'Master-level four-move mates',
          requiredTags: ['mateIn4'],
          ratingMin: 1700,
          ratingMax: 1800,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '6.2.R',
          name: 'Module 2 Review: Mate in 4',
          description: 'Find the mate in 4',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn4'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 3: QUIET MOVE EXCELLENCE
    // ========================================
    {
      id: 'mod-3',
      name: 'Quiet Move Excellence',
      description: 'The most difficult moves to find',
      lessons: [
        {
          id: '6.3.1',
          name: 'Quiet Move: Prophylaxis',
          description: 'Prevent opponent threats quietly',
          requiredTags: ['quietMove'],
          ratingMin: 1600,
          ratingMax: 1700,
          minPlays: 1000,
        },
        {
          id: '6.3.2',
          name: 'Quiet Move: Waiting',
          description: 'The waiting move that wins',
          requiredTags: ['quietMove'],
          ratingMin: 1650,
          ratingMax: 1750,
          minPlays: 1000,
        },
        {
          id: '6.3.3',
          name: 'Quiet Move: Excellence',
          description: 'Master the art of quiet moves',
          requiredTags: ['quietMove'],
          ratingMin: 1700,
          ratingMax: 1800,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '6.3.R',
          name: 'Module 3 Review: Quiet Moves',
          description: 'Find the winning quiet move',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['quietMove'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 4: DEFENSIVE EXCELLENCE
    // ========================================
    {
      id: 'mod-4',
      name: 'Defensive Excellence',
      description: 'Find the saving resource in critical positions',
      lessons: [
        {
          id: '6.4.1',
          name: 'Defensive: Counterplay',
          description: 'Create counterplay when attacked',
          requiredTags: ['defensiveMove'],
          ratingMin: 1600,
          ratingMax: 1700,
          minPlays: 1000,
        },
        {
          id: '6.4.2',
          name: 'Defensive: Fortress',
          description: 'Build an impenetrable fortress',
          requiredTags: ['defensiveMove'],
          ratingMin: 1650,
          ratingMax: 1750,
          minPlays: 1000,
        },
        {
          id: '6.4.3',
          name: 'Defensive: Excellence',
          description: 'Expert defensive resources',
          requiredTags: ['defensiveMove'],
          ratingMin: 1700,
          ratingMax: 1800,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '6.4.R',
          name: 'Module 4 Review: Defense',
          description: 'Find the defensive resource',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['defensiveMove'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 5: REVIEW - Deep Calculation
    // ========================================
    {
      id: 'mod-5',
      name: 'Review: Deep Calculation',
      description: 'Long checkmates and quiet moves - no hints!',
      lessons: [
        {
          id: '6.5.1',
          name: 'Deep Calculation: Set 1',
          description: 'Calculate deeply to find the solution',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn4', 'mateIn5', 'quietMove'],
          ratingMin: 1600,
          ratingMax: 1725,
          minPlays: 1000,
        },
        {
          id: '6.5.2',
          name: 'Deep Calculation: Set 2',
          description: 'Harder deep calculation puzzles',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn4', 'mateIn5', 'quietMove', 'defensiveMove'],
          ratingMin: 1675,
          ratingMax: 1800,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 6: INTERMEZZO EXCELLENCE
    // ========================================
    {
      id: 'mod-6',
      name: 'Intermezzo Excellence',
      description: 'The devastating in-between move mastered',
      lessons: [
        {
          id: '6.6.1',
          name: 'Intermezzo: Multiple',
          description: 'Multiple intermezzos in one line',
          requiredTags: ['intermezzo'],
          ratingMin: 1600,
          ratingMax: 1700,
          minPlays: 1000,
        },
        {
          id: '6.6.2',
          name: 'Intermezzo: Quiet',
          description: 'Quiet in-between moves',
          requiredTags: ['intermezzo'],
          ratingMin: 1650,
          ratingMax: 1750,
          minPlays: 1000,
        },
        {
          id: '6.6.3',
          name: 'Intermezzo: Excellence',
          description: 'Master the zwischenzug',
          requiredTags: ['intermezzo'],
          ratingMin: 1700,
          ratingMax: 1800,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '6.6.R',
          name: 'Module 6 Review: Intermezzo',
          description: 'Find the zwischenzug',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['intermezzo'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 7: EXPOSED KING EXCELLENCE
    // ========================================
    {
      id: 'mod-7',
      name: 'Exposed King Excellence',
      description: 'Devastating attacks on vulnerable kings',
      lessons: [
        {
          id: '6.7.1',
          name: 'Exposed King: Long Attack',
          description: 'Sustained attacks on the exposed king',
          requiredTags: ['exposedKing'],
          ratingMin: 1600,
          ratingMax: 1700,
          minPlays: 1000,
        },
        {
          id: '6.7.2',
          name: 'Exposed King: Opening Lines',
          description: 'Sacrifice to expose the king',
          requiredTags: ['exposedKing', 'sacrifice'],
          ratingMin: 1650,
          ratingMax: 1750,
          minPlays: 1000,
        },
        {
          id: '6.7.3',
          name: 'Exposed King: Excellence',
          description: 'Master attacks on vulnerable kings',
          requiredTags: ['exposedKing'],
          ratingMin: 1700,
          ratingMax: 1800,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '6.7.R',
          name: 'Module 7 Review: Exposed King',
          description: 'Exploit the exposed king',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['exposedKing'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 8: ADVANCED PAWN EXCELLENCE
    // ========================================
    {
      id: 'mod-8',
      name: 'Advanced Pawn Excellence',
      description: 'Complex pawn tactics and promotion',
      lessons: [
        {
          id: '6.8.1',
          name: 'Advanced Pawn: Complex Races',
          description: 'Complex promotion race calculation',
          requiredTags: ['advancedPawn'],
          ratingMin: 1600,
          ratingMax: 1700,
          minPlays: 1000,
        },
        {
          id: '6.8.2',
          name: 'Advanced Pawn: Underpromotion',
          description: 'When to underpromote',
          requiredTags: ['advancedPawn', 'promotion'],
          ratingMin: 1650,
          ratingMax: 1750,
          minPlays: 1000,
        },
        {
          id: '6.8.3',
          name: 'Advanced Pawn: Excellence',
          description: 'Expert pawn tactics',
          requiredTags: ['advancedPawn'],
          ratingMin: 1700,
          ratingMax: 1800,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '6.8.R',
          name: 'Module 8 Review: Pawn Play',
          description: 'Find the pawn tactic',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['advancedPawn', 'promotion'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 9: REVIEW - Attack & Defense
    // ========================================
    {
      id: 'mod-9',
      name: 'Review: Attack & Defense',
      description: 'Attack and defensive themes mixed',
      lessons: [
        {
          id: '6.9.1',
          name: 'Attack & Defense: Mixed',
          description: 'Is it attack or defense? Find out',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['exposedKing', 'defensiveMove', 'sacrifice'],
          ratingMin: 1600,
          ratingMax: 1725,
          minPlays: 1000,
        },
        {
          id: '6.9.2',
          name: 'Attack & Defense: Challenge',
          description: 'The hardest attack/defense puzzles',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['exposedKing', 'defensiveMove', 'sacrifice'],
          ratingMin: 1675,
          ratingMax: 1800,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 10: COMPLEX LINE TACTICS
    // ========================================
    {
      id: 'mod-10',
      name: 'Complex Line Tactics',
      description: 'Pins, skewers, X-rays at the highest level',
      lessons: [
        {
          id: '6.10.1',
          name: 'Pin Excellence',
          description: 'Expert pin combinations',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1'],
          ratingMin: 1600,
          ratingMax: 1700,
          minPlays: 1000,
        },
        {
          id: '6.10.2',
          name: 'Skewer Excellence',
          description: 'Expert skewer combinations',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1'],
          ratingMin: 1650,
          ratingMax: 1750,
          minPlays: 1000,
        },
        {
          id: '6.10.3',
          name: 'X-Ray Excellence',
          description: 'Expert X-Ray combinations',
          requiredTags: ['xRayAttack'],
          ratingMin: 1700,
          ratingMax: 1800,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '6.10.R',
          name: 'Module 10 Review: Line Tactics',
          description: 'Find the line tactic',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['pin', 'skewer', 'xRayAttack'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 11: MULTI-PHASE COMBINATIONS
    // ========================================
    {
      id: 'mod-11',
      name: 'Multi-Phase Combinations',
      description: 'Complex sequences with multiple tactical phases',
      lessons: [
        {
          id: '6.11.1',
          name: 'Multi-Phase: Setup + Execute',
          description: 'Prepare then execute the combination',
          requiredTags: ['sacrifice'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1600,
          ratingMax: 1700,
          minPlays: 1000,
        },
        {
          id: '6.11.2',
          name: 'Multi-Phase: Transform',
          description: 'Transform one advantage into another',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['deflection', 'attraction', 'fork'],
          ratingMin: 1650,
          ratingMax: 1750,
          minPlays: 1000,
        },
        {
          id: '6.11.3',
          name: 'Multi-Phase: Excellence',
          description: 'Master multi-phase combinations',
          requiredTags: ['sacrifice'],
          excludeTags: ['mateIn1'],
          ratingMin: 1700,
          ratingMax: 1800,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '6.11.R',
          name: 'Module 11 Review: Combinations',
          description: 'Find the combination',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['sacrifice', 'deflection', 'attraction', 'discoveredAttack'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 12: INTERFERENCE & CLEARANCE EXCELLENCE
    // ========================================
    {
      id: 'mod-12',
      name: 'Line Control Excellence',
      description: 'Master interference and clearance',
      lessons: [
        {
          id: '6.12.1',
          name: 'Interference Excellence',
          description: 'Block defensive lines precisely',
          requiredTags: ['interference'],
          ratingMin: 1600,
          ratingMax: 1700,
          minPlays: 1000,
        },
        {
          id: '6.12.2',
          name: 'Clearance Excellence',
          description: 'Clear lines with precision',
          requiredTags: ['clearance'],
          ratingMin: 1650,
          ratingMax: 1750,
          minPlays: 1000,
        },
        {
          id: '6.12.3',
          name: 'Line Control: Mastery',
          description: 'Master interference and clearance',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['interference', 'clearance'],
          ratingMin: 1700,
          ratingMax: 1800,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '6.12.R',
          name: 'Module 12 Review: Line Control',
          description: 'Control the lines',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['interference', 'clearance'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 13: ENDGAME EXCELLENCE
    // ========================================
    {
      id: 'mod-13',
      name: 'Endgame Excellence',
      description: 'Master-level endgame tactics',
      lessons: [
        {
          id: '6.13.1',
          name: 'Rook Endgames: Excellence',
          description: 'Master rook ending tactics',
          requiredTags: ['rookEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1600,
          ratingMax: 1750,
          minPlays: 1000,
        },
        {
          id: '6.13.2',
          name: 'Pawn Endgames: Excellence',
          description: 'Master pawn ending tactics',
          requiredTags: ['pawnEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 1000,
        },
        {
          id: '6.13.3',
          name: 'Minor Piece Endgames',
          description: 'Bishop and knight ending mastery',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['bishopEndgame', 'knightEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 1000,
        },
        {
          id: '6.13.4',
          name: 'Queen Endgames: Excellence',
          description: 'Master queen ending combinations',
          requiredTags: ['queenEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '6.13.R',
          name: 'Module 13 Review: Endgames',
          description: 'Find the winning endgame move',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['rookEndgame', 'pawnEndgame', 'bishopEndgame', 'knightEndgame', 'queenEndgame'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 14: HANGING PIECES & TRAPS
    // ========================================
    {
      id: 'mod-14',
      name: 'Tactical Alertness',
      description: 'Spot hanging pieces and set traps',
      lessons: [
        {
          id: '6.14.1',
          name: 'Hanging Pieces: Expert',
          description: 'Spot and exploit hanging pieces',
          requiredTags: ['hangingPiece'],
          ratingMin: 1600,
          ratingMax: 1700,
          minPlays: 1000,
        },
        {
          id: '6.14.2',
          name: 'Trapped Pieces: Expert',
          description: 'Trap pieces with precision',
          requiredTags: ['trappedPiece'],
          ratingMin: 1650,
          ratingMax: 1750,
          minPlays: 1000,
        },
        {
          id: '6.14.3',
          name: 'Tactical Alertness: Mastery',
          description: 'Master tactical awareness',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['hangingPiece', 'trappedPiece'],
          ratingMin: 1700,
          ratingMax: 1800,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '6.14.R',
          name: 'Module 14 Review: Alertness',
          description: 'Stay tactically alert',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['hangingPiece', 'trappedPiece'],
          ratingMin: 1600,
          ratingMax: 1800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 15: FINAL REVIEW
    // ========================================
    {
      id: 'mod-15',
      name: 'Level 6 Final',
      description: 'Prove your expert calculation skills',
      lessons: [
        {
          id: '6.15.1',
          name: 'Final Review: Medium',
          description: 'Mixed puzzles from all Level 6 topics',
          requiredTags: [],
          isMixedPractice: true,
          ratingMin: 1600,
          ratingMax: 1725,
          minPlays: 1000,
        },
        {
          id: '6.15.2',
          name: 'Final Review: Hard',
          description: 'The ultimate Level 6 challenge',
          requiredTags: [],
          isMixedPractice: true,
          ratingMin: 1700,
          ratingMax: 1800,
          minPlays: 1000,
        },
        {
          id: '6.15.3',
          name: 'Grand Master Challenge',
          description: 'The absolute hardest puzzles',
          requiredTags: [],
          isMixedPractice: true,
          ratingMin: 1750,
          ratingMax: 1800,
          minPlays: 500,
        },
      ],
    },
  ],
};

// Helper functions
export function getAllLessonsLevel6(): LessonCriteria[] {
  return level6.modules.flatMap(m => m.lessons);
}

export function getLessonByIdLevel6(id: string): LessonCriteria | undefined {
  return getAllLessonsLevel6().find(l => l.id === id);
}

export function getModuleByIdLevel6(id: string): Module | undefined {
  return level6.modules.find(m => m.id === id);
}

export function getLessonCountLevel6(): number {
  return getAllLessonsLevel6().length;
}
