/**
 * Level 4 Curriculum (1200-1400 ELO)
 *
 * Data analysis of puzzles at 1200-1400 ELO shows:
 * - 18.5% mateIn2 (dominant)
 * - 13.2% fork
 * - 8.1% mateIn1
 * - 7.4% discoveredAttack
 * - 5.8% pin (MAJOR)
 * - 4.9% deflection (MAJOR)
 * - 4.2% mateIn3
 * - 3.8% backRankMate
 * - 3.5% attraction (MAJOR)
 * - 2.9% skewer
 * - 2.6% quietMove (EMERGING)
 * - 2.3% defensiveMove
 * - 2.1% trappedPiece (EMERGING)
 * - 1.9% exposedKing (EMERGING)
 * - 1.8% sacrifice (for material, not mate)
 * - 1.5% advancedPawn
 *
 * Key themes: Deeper calculation required. Quiet moves and trapped pieces become
 * more important. Exposed king tactics emerge. Multi-step combinations dominate.
 */

import { LessonCriteria, Module, Level } from './level1-curriculum';

export const level4: Level = {
  id: 'level-4',
  name: 'Level 4: Advanced Tactics',
  ratingRange: '1200-1400',
  modules: [
    // ========================================
    // MODULE 1: ADVANCED PINS
    // ========================================
    {
      id: 'mod-1',
      name: 'Advanced Pins',
      description: 'Complex pin tactics and exploiting pinned pieces',
      lessons: [
        {
          id: '4.1.1',
          name: 'Exploiting Pins: Advanced',
          description: 'Attack and win pinned pieces',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1'],
          ratingMin: 1200,
          ratingMax: 1275,
          minPlays: 1000,
        },
        {
          id: '4.1.2',
          name: 'Pin Combinations',
          description: 'Multi-step combinations involving pins',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1'],
          ratingMin: 1250,
          ratingMax: 1325,
          minPlays: 1000,
        },
        {
          id: '4.1.3',
          name: 'Pins: Expert Level',
          description: 'The most challenging pin puzzles',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1'],
          ratingMin: 1300,
          ratingMax: 1400,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '4.1.R',
          name: 'Module 1 Review: Pins',
          description: 'Find the pin tactic - any variation',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['pin'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 2: ADVANCED DEFLECTION
    // ========================================
    {
      id: 'mod-2',
      name: 'Advanced Deflection',
      description: 'Force defenders away with precision',
      lessons: [
        {
          id: '4.2.1',
          name: 'Deflection: Complex Patterns',
          description: 'Multi-step deflection tactics',
          requiredTags: ['deflection'],
          ratingMin: 1200,
          ratingMax: 1300,
          minPlays: 1000,
        },
        {
          id: '4.2.2',
          name: 'Deflection with Sacrifice',
          description: 'Sacrifice to deflect defenders',
          requiredTags: ['deflection', 'sacrifice'],
          ratingMin: 1250,
          ratingMax: 1350,
          minPlays: 1000,
        },
        {
          id: '4.2.3',
          name: 'Deflection: Expert',
          description: 'Expert-level deflection combinations',
          requiredTags: ['deflection'],
          ratingMin: 1300,
          ratingMax: 1400,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '4.2.R',
          name: 'Module 2 Review: Deflection',
          description: 'Find the deflection tactic',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['deflection'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 3: ATTRACTION MASTERY
    // ========================================
    {
      id: 'mod-3',
      name: 'Attraction Mastery',
      description: 'Lure pieces to decisive squares',
      lessons: [
        {
          id: '4.3.1',
          name: 'Attraction: Advanced Patterns',
          description: 'Complex attraction combinations',
          requiredTags: ['attraction'],
          ratingMin: 1200,
          ratingMax: 1300,
          minPlays: 1000,
        },
        {
          id: '4.3.2',
          name: 'Attraction to Fork',
          description: 'Attract pieces to set up forks',
          requiredTags: ['attraction', 'fork'],
          ratingMin: 1225,
          ratingMax: 1325,
          minPlays: 1000,
        },
        {
          id: '4.3.3',
          name: 'Attraction: Expert',
          description: 'Expert-level attraction tactics',
          requiredTags: ['attraction'],
          ratingMin: 1300,
          ratingMax: 1400,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '4.3.R',
          name: 'Module 3 Review: Attraction',
          description: 'Find the attraction tactic',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['attraction'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 4: EXPOSED KING
    // ========================================
    {
      id: 'mod-4',
      name: 'Exposed King',
      description: 'Exploit the vulnerable king position',
      lessons: [
        {
          id: '4.4.1',
          name: 'Exposed King: Introduction',
          description: 'Recognize and exploit weak king positions',
          requiredTags: ['exposedKing'],
          ratingMin: 1200,
          ratingMax: 1300,
          minPlays: 1000,
        },
        {
          id: '4.4.2',
          name: 'Exposed King: Attack Patterns',
          description: 'Coordinate attacks against the exposed king',
          requiredTags: ['exposedKing'],
          ratingMin: 1250,
          ratingMax: 1350,
          minPlays: 1000,
        },
        {
          id: '4.4.3',
          name: 'Exposed King: Advanced',
          description: 'Complex attacks on the vulnerable king',
          requiredTags: ['exposedKing'],
          ratingMin: 1300,
          ratingMax: 1400,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '4.4.R',
          name: 'Module 4 Review: Exposed King',
          description: 'Exploit the exposed king',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['exposedKing'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 5: REVIEW - Forcing Moves
    // ========================================
    {
      id: 'mod-5',
      name: 'Review: Forcing Moves',
      description: 'Pins, deflection, attraction, exposed king - no hints!',
      lessons: [
        {
          id: '4.5.1',
          name: 'Mixed Forcing Moves: Set 1',
          description: 'Identify the forcing move concept',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['pin', 'deflection', 'attraction', 'exposedKing'],
          ratingMin: 1200,
          ratingMax: 1300,
          minPlays: 1000,
        },
        {
          id: '4.5.2',
          name: 'Mixed Forcing Moves: Set 2',
          description: 'Harder mixed forcing move puzzles',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['pin', 'deflection', 'attraction', 'exposedKing'],
          ratingMin: 1275,
          ratingMax: 1400,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 6: TRAPPED PIECES
    // ========================================
    {
      id: 'mod-6',
      name: 'Trapped Pieces',
      description: 'Win material by trapping pieces',
      lessons: [
        {
          id: '4.6.1',
          name: 'Trapping the Queen',
          description: 'Trap the opponent queen',
          requiredTags: ['trappedPiece'],
          ratingMin: 1200,
          ratingMax: 1300,
          minPlays: 1000,
        },
        {
          id: '4.6.2',
          name: 'Trapping Minor Pieces',
          description: 'Trap knights and bishops',
          requiredTags: ['trappedPiece'],
          ratingMin: 1225,
          ratingMax: 1325,
          minPlays: 1000,
        },
        {
          id: '4.6.3',
          name: 'Trapping Rooks',
          description: 'Trap rooks in awkward positions',
          requiredTags: ['trappedPiece'],
          ratingMin: 1275,
          ratingMax: 1400,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '4.6.R',
          name: 'Module 6 Review: Trapped Pieces',
          description: 'Find the trapped piece',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['trappedPiece'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 7: QUIET MOVES ADVANCED
    // ========================================
    {
      id: 'mod-7',
      name: 'Quiet Moves: Advanced',
      description: 'Powerful non-forcing moves that win',
      lessons: [
        {
          id: '4.7.1',
          name: 'Quiet Move: Threats',
          description: 'Create unstoppable threats without checks',
          requiredTags: ['quietMove'],
          ratingMin: 1200,
          ratingMax: 1300,
          minPlays: 1000,
        },
        {
          id: '4.7.2',
          name: 'Quiet Move: Multiple Threats',
          description: 'Quiet moves creating double threats',
          requiredTags: ['quietMove'],
          ratingMin: 1250,
          ratingMax: 1350,
          minPlays: 1000,
        },
        {
          id: '4.7.3',
          name: 'Quiet Move: Expert',
          description: 'The most challenging quiet move puzzles',
          requiredTags: ['quietMove'],
          ratingMin: 1300,
          ratingMax: 1400,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '4.7.R',
          name: 'Module 7 Review: Quiet Moves',
          description: 'Find the winning quiet move',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['quietMove'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 8: MATE IN 3 ADVANCED
    // ========================================
    {
      id: 'mod-8',
      name: 'Mate in 3: Advanced',
      description: 'Three-move checkmates requiring calculation',
      lessons: [
        {
          id: '4.8.1',
          name: 'Mate in 3: Intermediate',
          description: 'Challenging three-move mates',
          requiredTags: ['mateIn3'],
          ratingMin: 1200,
          ratingMax: 1300,
          minPlays: 1000,
        },
        {
          id: '4.8.2',
          name: 'Mate in 3: With Sacrifice',
          description: 'Three-move mates starting with sacrifice',
          requiredTags: ['mateIn3', 'sacrifice'],
          ratingMin: 1250,
          ratingMax: 1350,
          minPlays: 1000,
        },
        {
          id: '4.8.3',
          name: 'Mate in 3: Expert',
          description: 'Expert-level three-move checkmates',
          requiredTags: ['mateIn3'],
          ratingMin: 1300,
          ratingMax: 1400,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '4.8.R',
          name: 'Module 8 Review: Mate in 3',
          description: 'Find the mate in 3',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn3'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 9: MATE IN 2 EXPERT
    // ========================================
    {
      id: 'mod-9',
      name: 'Mate in 2: Expert',
      description: 'Complex two-move checkmates',
      lessons: [
        {
          id: '4.9.1',
          name: 'Mate in 2: Hidden Patterns',
          description: 'Non-obvious two-move mates',
          requiredTags: ['mateIn2'],
          ratingMin: 1200,
          ratingMax: 1300,
          minPlays: 1000,
        },
        {
          id: '4.9.2',
          name: 'Mate in 2: Quiet First Move',
          description: 'Two-move mates starting with quiet moves',
          requiredTags: ['mateIn2', 'quietMove'],
          ratingMin: 1250,
          ratingMax: 1350,
          minPlays: 1000,
        },
        {
          id: '4.9.3',
          name: 'Mate in 2: Expert',
          description: 'The trickiest two-move mates',
          requiredTags: ['mateIn2'],
          ratingMin: 1300,
          ratingMax: 1400,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '4.9.R',
          name: 'Module 9 Review: Mate in 2',
          description: 'Find the mate in 2',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn2'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 10: REVIEW - Checkmate Patterns
    // ========================================
    {
      id: 'mod-10',
      name: 'Review: Checkmate',
      description: 'Mixed checkmate puzzles - any length',
      lessons: [
        {
          id: '4.10.1',
          name: 'Checkmate Patterns: Mixed',
          description: 'Find the checkmate - 1, 2, or 3 moves',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn1', 'mateIn2', 'mateIn3', 'backRankMate', 'smotheredMate'],
          ratingMin: 1200,
          ratingMax: 1350,
          minPlays: 1000,
        },
        {
          id: '4.10.2',
          name: 'Checkmate Patterns: Challenge',
          description: 'Harder mixed checkmate puzzles',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn1', 'mateIn2', 'mateIn3', 'backRankMate', 'smotheredMate'],
          ratingMin: 1275,
          ratingMax: 1400,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 11: DISCOVERED ATTACKS EXPERT
    // ========================================
    {
      id: 'mod-11',
      name: 'Discovered Attacks: Expert',
      description: 'Complex discovered attack patterns',
      lessons: [
        {
          id: '4.11.1',
          name: 'Discovered Attack: Multi-Step',
          description: 'Set up and execute discovered attacks',
          requiredTags: ['discoveredAttack'],
          excludeTags: ['mateIn1'],
          ratingMin: 1200,
          ratingMax: 1300,
          minPlays: 1000,
        },
        {
          id: '4.11.2',
          name: 'Double Check: Advanced',
          description: 'Devastating double check combinations',
          requiredTags: ['doubleCheck'],
          ratingMin: 1225,
          ratingMax: 1350,
          minPlays: 1000,
        },
        {
          id: '4.11.3',
          name: 'Discovered Attack: Expert',
          description: 'Expert-level discovered attacks',
          requiredTags: ['discoveredAttack'],
          excludeTags: ['mateIn1'],
          ratingMin: 1300,
          ratingMax: 1400,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '4.11.R',
          name: 'Module 11 Review: Discoveries',
          description: 'Find the discovered attack',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['discoveredAttack', 'doubleCheck'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 12: DEFENSIVE TACTICS
    // ========================================
    {
      id: 'mod-12',
      name: 'Defensive Tactics',
      description: 'Find the saving defensive resource',
      lessons: [
        {
          id: '4.12.1',
          name: 'Defensive Move: Counterattack',
          description: 'Defend by creating your own threat',
          requiredTags: ['defensiveMove'],
          ratingMin: 1200,
          ratingMax: 1300,
          minPlays: 1000,
        },
        {
          id: '4.12.2',
          name: 'Defensive Move: Resource',
          description: 'Find the only saving move',
          requiredTags: ['defensiveMove'],
          ratingMin: 1250,
          ratingMax: 1350,
          minPlays: 1000,
        },
        {
          id: '4.12.3',
          name: 'Defensive Move: Expert',
          description: 'Expert-level defensive resources',
          requiredTags: ['defensiveMove'],
          ratingMin: 1300,
          ratingMax: 1400,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '4.12.R',
          name: 'Module 12 Review: Defense',
          description: 'Find the defensive resource',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['defensiveMove'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 13: ADVANCED ENDGAMES
    // ========================================
    {
      id: 'mod-13',
      name: 'Advanced Endgames',
      description: 'Complex endgame tactics',
      lessons: [
        {
          id: '4.13.1',
          name: 'Rook Endgames: Expert',
          description: 'Complex rook ending tactics',
          requiredTags: ['rookEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1200,
          ratingMax: 1350,
          minPlays: 1000,
        },
        {
          id: '4.13.2',
          name: 'Pawn Endgames: Expert',
          description: 'Complex pawn ending tactics',
          requiredTags: ['pawnEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 1000,
        },
        {
          id: '4.13.3',
          name: 'Queen Endgames: Expert',
          description: 'Queen ending combinations',
          requiredTags: ['queenEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 1000,
        },
        {
          id: '4.13.4',
          name: 'Bishop Endgames',
          description: 'Bishop ending tactics',
          requiredTags: ['bishopEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '4.13.R',
          name: 'Module 13 Review: Endgames',
          description: 'Find the winning endgame move',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['rookEndgame', 'pawnEndgame', 'queenEndgame', 'bishopEndgame'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 14: ADVANCED COMBINATIONS
    // ========================================
    {
      id: 'mod-14',
      name: 'Advanced Combinations',
      description: 'Multi-theme tactical combinations',
      lessons: [
        {
          id: '4.14.1',
          name: 'Sacrifice for Attack',
          description: 'Material sacrifice to create attack',
          requiredTags: ['sacrifice'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1200,
          ratingMax: 1325,
          minPlays: 1000,
        },
        {
          id: '4.14.2',
          name: 'Clearance Sacrifice',
          description: 'Sacrifice to clear a square or line',
          requiredTags: ['clearance', 'sacrifice'],
          ratingMin: 1250,
          ratingMax: 1375,
          minPlays: 1000,
        },
        {
          id: '4.14.3',
          name: 'Interference: Advanced',
          description: 'Block defensive lines',
          requiredTags: ['interference'],
          ratingMin: 1250,
          ratingMax: 1400,
          minPlays: 1000,
        },
        // Module Review
        {
          id: '4.14.R',
          name: 'Module 14 Review: Combinations',
          description: 'Find the combination',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['sacrifice', 'clearance', 'interference'],
          ratingMin: 1200,
          ratingMax: 1400,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 15: FINAL REVIEW
    // ========================================
    {
      id: 'mod-15',
      name: 'Level 4 Final',
      description: 'Prove your advanced tactical skills',
      lessons: [
        {
          id: '4.15.1',
          name: 'Final Review: Medium',
          description: 'Mixed puzzles from all Level 4 topics',
          requiredTags: [],
          isMixedPractice: true,
          ratingMin: 1200,
          ratingMax: 1325,
          minPlays: 1000,
        },
        {
          id: '4.15.2',
          name: 'Final Review: Hard',
          description: 'The ultimate Level 4 challenge',
          requiredTags: [],
          isMixedPractice: true,
          ratingMin: 1300,
          ratingMax: 1400,
          minPlays: 1000,
        },
      ],
    },
  ],
};

// Helper functions
export function getAllLessonsLevel4(): LessonCriteria[] {
  return level4.modules.flatMap(m => m.lessons);
}

export function getLessonByIdLevel4(id: string): LessonCriteria | undefined {
  return getAllLessonsLevel4().find(l => l.id === id);
}

export function getModuleByIdLevel4(id: string): Module | undefined {
  return level4.modules.find(m => m.id === id);
}

export function getLessonCountLevel4(): number {
  return getAllLessonsLevel4().length;
}
