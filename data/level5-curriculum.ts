/**
 * Level 5 Curriculum (1400-1600 ELO)
 *
 * Data analysis of puzzles at 1400-1600 ELO shows:
 * - 19.2% mateIn2 (still dominant)
 * - 11.8% fork
 * - 6.5% mateIn3 (INCREASING)
 * - 6.2% mateIn1
 * - 5.9% pin
 * - 5.4% discoveredAttack
 * - 4.8% deflection
 * - 4.2% attraction
 * - 3.6% quietMove (MAJOR)
 * - 3.2% backRankMate
 * - 2.9% defensiveMove
 * - 2.8% skewer
 * - 2.5% trappedPiece
 * - 2.3% exposedKing
 * - 2.1% mateIn4 (EMERGING)
 * - 1.9% advancedPawn (EMERGING)
 * - 1.7% intermezzo (EMERGING)
 * - 1.5% xRayAttack (EMERGING)
 *
 * Key themes: Deeper calculation (mateIn4 appears). Intermezzo (zwischenzug) becomes
 * important. Advanced pawn play emerges. X-Ray attacks and quiet moves dominate.
 * Players must calculate 4+ moves ahead consistently.
 */

import { LessonCriteria, Module, Level } from './level1-curriculum';

export const level5: Level = {
  id: 'level-5',
  name: 'Level 5: Calculation Mastery',
  ratingRange: '1400-1600',
  modules: [
    // ========================================
    // MODULE 1: INTERMEZZO (ZWISCHENZUG)
    // ========================================
    {
      id: 'mod-1',
      name: 'Intermezzo Mastery',
      description: 'The devastating in-between move',
      lessons: [
        {
          id: '5.1.1',
          name: 'Intermezzo: Patterns',
          description: 'Recognize intermezzo opportunities',
          requiredTags: ['intermezzo'],
          ratingMin: 1400,
          ratingMax: 1500,
          minPlays: 1000,
        },
        {
          id: '5.1.2',
          name: 'Intermezzo: With Check',
          description: 'In-between moves that give check',
          requiredTags: ['intermezzo'],
          ratingMin: 1450,
          ratingMax: 1550,
          minPlays: 1000,
        },
        {
          id: '5.1.3',
          name: 'Intermezzo: Expert',
          description: 'Complex intermezzo combinations',
          requiredTags: ['intermezzo'],
          ratingMin: 1500,
          ratingMax: 1600,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '5.1.R',
          name: 'Module 1 Review: Intermezzo',
          description: 'Find the zwischenzug',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['intermezzo'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 2: QUIET MOVES MASTERY
    // ========================================
    {
      id: 'mod-2',
      name: 'Quiet Moves: Mastery',
      description: 'The hardest moves to find',
      lessons: [
        {
          id: '5.2.1',
          name: 'Quiet Move: Zugzwang',
          description: 'Force opponent into losing moves',
          requiredTags: ['quietMove'],
          ratingMin: 1400,
          ratingMax: 1500,
          minPlays: 1000,
        },
        {
          id: '5.2.2',
          name: 'Quiet Move: Domination',
          description: 'Control the board without forcing moves',
          requiredTags: ['quietMove'],
          ratingMin: 1450,
          ratingMax: 1550,
          minPlays: 1000,
        },
        {
          id: '5.2.3',
          name: 'Quiet Move: Mastery',
          description: 'Expert quiet move puzzles',
          requiredTags: ['quietMove'],
          ratingMin: 1500,
          ratingMax: 1600,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '5.2.R',
          name: 'Module 2 Review: Quiet Moves',
          description: 'Find the winning quiet move',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['quietMove'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 3: ADVANCED PAWN PLAY
    // ========================================
    {
      id: 'mod-3',
      name: 'Advanced Pawn Play',
      description: 'Pawn tactics and promotion threats',
      lessons: [
        {
          id: '5.3.1',
          name: 'Advanced Pawn: Promotion Race',
          description: 'Win the race to promote',
          requiredTags: ['advancedPawn'],
          ratingMin: 1400,
          ratingMax: 1500,
          minPlays: 1000,
        },
        {
          id: '5.3.2',
          name: 'Advanced Pawn: Breakthrough',
          description: 'Pawn breakthrough combinations',
          requiredTags: ['advancedPawn'],
          ratingMin: 1450,
          ratingMax: 1550,
          minPlays: 1000,
        },
        {
          id: '5.3.3',
          name: 'Advanced Pawn: Expert',
          description: 'Complex pawn play tactics',
          requiredTags: ['advancedPawn'],
          ratingMin: 1500,
          ratingMax: 1600,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '5.3.R',
          name: 'Module 3 Review: Pawn Play',
          description: 'Find the pawn tactic',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['advancedPawn', 'promotion'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 4: X-RAY ATTACKS
    // ========================================
    {
      id: 'mod-4',
      name: 'X-Ray Attacks',
      description: 'Attack through another piece',
      lessons: [
        {
          id: '5.4.1',
          name: 'X-Ray: Introduction',
          description: 'Basic X-Ray attack patterns',
          requiredTags: ['xRayAttack'],
          ratingMin: 1400,
          ratingMax: 1500,
          minPlays: 1000,
        },
        {
          id: '5.4.2',
          name: 'X-Ray: Defense',
          description: 'X-Ray defensive resources',
          requiredTags: ['xRayAttack'],
          ratingMin: 1450,
          ratingMax: 1550,
          minPlays: 1000,
        },
        {
          id: '5.4.3',
          name: 'X-Ray: Expert',
          description: 'Complex X-Ray combinations',
          requiredTags: ['xRayAttack'],
          ratingMin: 1500,
          ratingMax: 1600,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '5.4.R',
          name: 'Module 4 Review: X-Ray',
          description: 'Find the X-Ray tactic',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['xRayAttack'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 5: REVIEW - Subtle Tactics
    // ========================================
    {
      id: 'mod-5',
      name: 'Review: Subtle Tactics',
      description: 'Intermezzo, quiet moves, X-Ray - no hints!',
      lessons: [
        {
          id: '5.5.1',
          name: 'Subtle Tactics: Set 1',
          description: 'Identify the subtle tactic',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['intermezzo', 'quietMove', 'xRayAttack', 'advancedPawn'],
          ratingMin: 1400,
          ratingMax: 1525,
          minPlays: 1000,
        },
        {
          id: '5.5.2',
          name: 'Subtle Tactics: Set 2',
          description: 'Harder subtle tactic puzzles',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['intermezzo', 'quietMove', 'xRayAttack', 'advancedPawn'],
          ratingMin: 1475,
          ratingMax: 1600,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 6: MATE IN 4
    // ========================================
    {
      id: 'mod-6',
      name: 'Mate in 4',
      description: 'Four-move checkmate sequences',
      lessons: [
        {
          id: '5.6.1',
          name: 'Mate in 4: Introduction',
          description: 'Calculate four moves ahead',
          requiredTags: ['mateIn4'],
          ratingMin: 1400,
          ratingMax: 1500,
          minPlays: 1000,
        },
        {
          id: '5.6.2',
          name: 'Mate in 4: With Sacrifice',
          description: 'Four-move mates with sacrifices',
          requiredTags: ['mateIn4', 'sacrifice'],
          ratingMin: 1450,
          ratingMax: 1550,
          minPlays: 1000,
        },
        {
          id: '5.6.3',
          name: 'Mate in 4: Expert',
          description: 'Expert four-move checkmates',
          requiredTags: ['mateIn4'],
          ratingMin: 1500,
          ratingMax: 1600,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '5.6.R',
          name: 'Module 6 Review: Mate in 4',
          description: 'Find the mate in 4',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn4'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 7: MATE IN 3 MASTERY
    // ========================================
    {
      id: 'mod-7',
      name: 'Mate in 3: Mastery',
      description: 'Complex three-move checkmates',
      lessons: [
        {
          id: '5.7.1',
          name: 'Mate in 3: Quiet Moves',
          description: 'Three-move mates with quiet moves',
          requiredTags: ['mateIn3', 'quietMove'],
          ratingMin: 1400,
          ratingMax: 1500,
          minPlays: 1000,
        },
        {
          id: '5.7.2',
          name: 'Mate in 3: Multiple Defenses',
          description: 'Handle multiple defensive tries',
          requiredTags: ['mateIn3'],
          ratingMin: 1450,
          ratingMax: 1550,
          minPlays: 1000,
        },
        {
          id: '5.7.3',
          name: 'Mate in 3: Mastery',
          description: 'Master-level three-move mates',
          requiredTags: ['mateIn3'],
          ratingMin: 1500,
          ratingMax: 1600,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '5.7.R',
          name: 'Module 7 Review: Mate in 3',
          description: 'Find the mate in 3',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn3'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 8: EXPOSED KING MASTERY
    // ========================================
    {
      id: 'mod-8',
      name: 'Exposed King: Mastery',
      description: 'Devastating attacks on the exposed king',
      lessons: [
        {
          id: '5.8.1',
          name: 'Exposed King: Piece Coordination',
          description: 'Coordinate pieces against the king',
          requiredTags: ['exposedKing'],
          ratingMin: 1400,
          ratingMax: 1500,
          minPlays: 1000,
        },
        {
          id: '5.8.2',
          name: 'Exposed King: Sacrifice',
          description: 'Sacrifice to expose the king',
          requiredTags: ['exposedKing', 'sacrifice'],
          ratingMin: 1450,
          ratingMax: 1550,
          minPlays: 1000,
        },
        {
          id: '5.8.3',
          name: 'Exposed King: Mastery',
          description: 'Expert attacks on vulnerable kings',
          requiredTags: ['exposedKing'],
          ratingMin: 1500,
          ratingMax: 1600,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '5.8.R',
          name: 'Module 8 Review: Exposed King',
          description: 'Exploit the exposed king',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['exposedKing'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 9: REVIEW - Checkmate Calculation
    // ========================================
    {
      id: 'mod-9',
      name: 'Review: Checkmate Calculation',
      description: 'Mixed mating puzzles - any depth',
      lessons: [
        {
          id: '5.9.1',
          name: 'Checkmate Calculation: Mixed',
          description: 'Find the checkmate - any length',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn2', 'mateIn3', 'mateIn4', 'backRankMate'],
          ratingMin: 1400,
          ratingMax: 1525,
          minPlays: 1000,
        },
        {
          id: '5.9.2',
          name: 'Checkmate Calculation: Challenge',
          description: 'The hardest checkmate puzzles',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn2', 'mateIn3', 'mateIn4', 'backRankMate'],
          ratingMin: 1475,
          ratingMax: 1600,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 10: COMPLEX PINS & SKEWERS
    // ========================================
    {
      id: 'mod-10',
      name: 'Pins & Skewers: Mastery',
      description: 'The most complex line tactics',
      lessons: [
        {
          id: '5.10.1',
          name: 'Pin Mastery: Setup',
          description: 'Create winning pins through preparation',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1'],
          ratingMin: 1400,
          ratingMax: 1500,
          minPlays: 1000,
        },
        {
          id: '5.10.2',
          name: 'Skewer Mastery',
          description: 'Expert skewer combinations',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1'],
          ratingMin: 1450,
          ratingMax: 1550,
          minPlays: 1000,
        },
        {
          id: '5.10.3',
          name: 'Pin & Skewer: Expert',
          description: 'Complex line tactic combinations',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['pin', 'skewer'],
          excludeTags: ['mateIn1'],
          ratingMin: 1500,
          ratingMax: 1600,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '5.10.R',
          name: 'Module 10 Review: Line Tactics',
          description: 'Find the pin or skewer',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['pin', 'skewer'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 11: COMPLEX COMBINATIONS
    // ========================================
    {
      id: 'mod-11',
      name: 'Complex Combinations',
      description: 'Multi-theme tactical sequences',
      lessons: [
        {
          id: '5.11.1',
          name: 'Deflection + Fork',
          description: 'Deflect then fork',
          requiredTags: ['deflection', 'fork'],
          ratingMin: 1400,
          ratingMax: 1500,
          minPlays: 1000,
        },
        {
          id: '5.11.2',
          name: 'Attraction + Discovery',
          description: 'Attract then discover',
          requiredTags: ['attraction', 'discoveredAttack'],
          ratingMin: 1450,
          ratingMax: 1550,
          minPlays: 1000,
        },
        {
          id: '5.11.3',
          name: 'Complex Multi-Tactic',
          description: 'Combinations with multiple tactical ideas',
          requiredTags: ['sacrifice'],
          excludeTags: ['mateIn1'],
          ratingMin: 1500,
          ratingMax: 1600,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '5.11.R',
          name: 'Module 11 Review: Combinations',
          description: 'Find the combination',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['deflection', 'attraction', 'discoveredAttack', 'sacrifice'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 12: DEFENSIVE MASTERY
    // ========================================
    {
      id: 'mod-12',
      name: 'Defensive Mastery',
      description: 'Find the saving resource',
      lessons: [
        {
          id: '5.12.1',
          name: 'Defensive: Perpetual Check',
          description: 'Save with perpetual check',
          requiredTags: ['defensiveMove'],
          ratingMin: 1400,
          ratingMax: 1500,
          minPlays: 1000,
        },
        {
          id: '5.12.2',
          name: 'Defensive: Stalemate Trick',
          description: 'Force stalemate when losing',
          requiredTags: ['defensiveMove'],
          ratingMin: 1450,
          ratingMax: 1550,
          minPlays: 1000,
        },
        {
          id: '5.12.3',
          name: 'Defensive: Only Move',
          description: 'Find the one saving move',
          requiredTags: ['defensiveMove'],
          ratingMin: 1500,
          ratingMax: 1600,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '5.12.R',
          name: 'Module 12 Review: Defense',
          description: 'Find the defensive resource',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['defensiveMove'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 13: ENDGAME MASTERY
    // ========================================
    {
      id: 'mod-13',
      name: 'Endgame Mastery',
      description: 'Expert endgame tactics',
      lessons: [
        {
          id: '5.13.1',
          name: 'Rook Endgames: Mastery',
          description: 'Expert rook ending tactics',
          requiredTags: ['rookEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1400,
          ratingMax: 1550,
          minPlays: 1000,
        },
        {
          id: '5.13.2',
          name: 'Pawn Endgames: Mastery',
          description: 'Expert pawn ending tactics',
          requiredTags: ['pawnEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 1000,
        },
        {
          id: '5.13.3',
          name: 'Knight Endgames',
          description: 'Knight ending tactics',
          requiredTags: ['knightEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 1000,
        },
        {
          id: '5.13.4',
          name: 'Queen Endgames: Mastery',
          description: 'Expert queen ending combinations',
          requiredTags: ['queenEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '5.13.R',
          name: 'Module 13 Review: Endgames',
          description: 'Find the winning endgame move',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['rookEndgame', 'pawnEndgame', 'knightEndgame', 'queenEndgame'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 14: INTERFERENCE & CLEARANCE
    // ========================================
    {
      id: 'mod-14',
      name: 'Interference & Clearance',
      description: 'Block or clear lines with precision',
      lessons: [
        {
          id: '5.14.1',
          name: 'Interference: Expert',
          description: 'Block defensive lines decisively',
          requiredTags: ['interference'],
          ratingMin: 1400,
          ratingMax: 1500,
          minPlays: 1000,
        },
        {
          id: '5.14.2',
          name: 'Clearance: Expert',
          description: 'Clear squares and lines for your pieces',
          requiredTags: ['clearance'],
          ratingMin: 1450,
          ratingMax: 1550,
          minPlays: 1000,
        },
        {
          id: '5.14.3',
          name: 'Line Control: Mastery',
          description: 'Master interference and clearance',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['interference', 'clearance'],
          ratingMin: 1500,
          ratingMax: 1600,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '5.14.R',
          name: 'Module 14 Review: Line Control',
          description: 'Control the lines',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['interference', 'clearance'],
          ratingMin: 1400,
          ratingMax: 1600,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 15: FINAL REVIEW
    // ========================================
    {
      id: 'mod-15',
      name: 'Level 5 Final',
      description: 'Prove your calculation mastery',
      lessons: [
        {
          id: '5.15.1',
          name: 'Final Review: Medium',
          description: 'Mixed puzzles from all Level 5 topics',
          requiredTags: [],
          isMixedPractice: true,
          ratingMin: 1400,
          ratingMax: 1525,
          minPlays: 1000,
        },
        {
          id: '5.15.2',
          name: 'Final Review: Hard',
          description: 'The ultimate Level 5 challenge',
          requiredTags: [],
          isMixedPractice: true,
          ratingMin: 1500,
          ratingMax: 1600,
          minPlays: 1000,
        },
      ],
    },
  ],
};

// Helper functions
export function getAllLessonsLevel5(): LessonCriteria[] {
  return level5.modules.flatMap(m => m.lessons);
}

export function getLessonByIdLevel5(id: string): LessonCriteria | undefined {
  return getAllLessonsLevel5().find(l => l.id === id);
}

export function getModuleByIdLevel5(id: string): Module | undefined {
  return level5.modules.find(m => m.id === id);
}

export function getLessonCountLevel5(): number {
  return getAllLessonsLevel5().length;
}
