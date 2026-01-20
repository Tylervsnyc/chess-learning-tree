/**
 * Level 1 Curriculum (400-800 ELO)
 *
 * Built from actual puzzle availability in the Lichess database.
 * Each lesson = 6 puzzles matching the criteria.
 *
 * Puzzle selection criteria:
 * - requiredTags: ALL must be present
 * - excludeTags: NONE can be present
 * - ratingMin/ratingMax: puzzle difficulty range
 * - pieceFilter: for forks/mates, which piece does the tactic (analyzed from solution)
 * - minPlays: minimum solve count for quality (default 500)
 */

export interface LessonCriteria {
  id: string;
  name: string;
  description: string;
  requiredTags: string[];
  excludeTags?: string[];
  ratingMin: number;
  ratingMax: number;
  pieceFilter?: 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  minPlays?: number;
  // For mixed practice / best move lessons
  isMixedPractice?: boolean;  // If true, pulls from any theme (no theme validation)
  mixedThemes?: string[];     // Optional: limit to these themes (any match, not all)
}

export interface Module {
  id: string;
  name: string;
  description: string;
  lessons: LessonCriteria[];
}

export interface Level {
  id: string;
  name: string;
  ratingRange: string;
  modules: Module[];
}

export const level1: Level = {
  id: 'level-1',
  name: 'Level 1: Foundations',
  ratingRange: '400-800',
  modules: [
    // ========================================
    // MODULE 1: GETTING STARTED
    // ========================================
    {
      id: 'mod-1',
      name: 'Getting Started',
      description: 'Learn the basic tactical patterns',
      lessons: [
        {
          id: '1.1.1',
          name: 'Easy Forks',
          description: 'Attack two pieces at once - easiest patterns',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 600,
        },
        {
          id: '1.1.2',
          name: 'Easy Discovered Attacks',
          description: 'Reveal an attack by moving another piece',
          requiredTags: ['discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 700,
        },
        {
          id: '1.1.3',
          name: 'Easy Skewers',
          description: 'Attack a piece and win the one behind it',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 700,
        },
        // Module Review
        {
          id: '1.1.R',
          name: 'Module 1 Review: Best Move',
          description: 'Find the best move - any tactic from this module',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['fork', 'discoveredAttack', 'skewer'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 700,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 2: MATE IN 1
    // ========================================
    {
      id: 'mod-2',
      name: 'Mate in 1',
      description: 'Deliver checkmate in one move',
      lessons: [
        // Queen mates
        {
          id: '1.2.1',
          name: 'Queen Mate in 1: Easy',
          description: 'Checkmate with the queen - easiest',
          requiredTags: ['mateIn1'],
          ratingMin: 400,
          ratingMax: 500,
          pieceFilter: 'queen',
        },
        {
          id: '1.2.2',
          name: 'Queen Mate in 1: Medium',
          description: 'Checkmate with the queen - medium',
          requiredTags: ['mateIn1'],
          ratingMin: 500,
          ratingMax: 600,
          pieceFilter: 'queen',
        },
        {
          id: '1.2.3',
          name: 'Queen Mate in 1: Hard',
          description: 'Checkmate with the queen - harder',
          requiredTags: ['mateIn1'],
          ratingMin: 600,
          ratingMax: 750,
          pieceFilter: 'queen',
        },
        // Mixed Practice after 4 lessons
        {
          id: '1.2.M',
          name: 'Mixed Practice: Mate in 1',
          description: 'Find the checkmate - any piece',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn1'],
          ratingMin: 400,
          ratingMax: 600,
          minPlays: 5000,
        },
        // Rook mates
        {
          id: '1.2.4',
          name: 'Rook Mate in 1: Easy',
          description: 'Checkmate with the rook - easiest',
          requiredTags: ['mateIn1'],
          ratingMin: 400,
          ratingMax: 550,
          pieceFilter: 'rook',
        },
        {
          id: '1.2.5',
          name: 'Rook Mate in 1: Medium',
          description: 'Checkmate with the rook - medium',
          requiredTags: ['mateIn1'],
          ratingMin: 550,
          ratingMax: 700,
          pieceFilter: 'rook',
        },
        {
          id: '1.2.6',
          name: 'Rook Mate in 1: Hard',
          description: 'Checkmate with the rook - harder',
          requiredTags: ['mateIn1'],
          ratingMin: 700,
          ratingMax: 800,
          pieceFilter: 'rook',
        },
        // Bishop mates
        {
          id: '1.2.7',
          name: 'Bishop Mate in 1',
          description: 'Checkmate with the bishop',
          requiredTags: ['mateIn1'],
          ratingMin: 400,
          ratingMax: 800,
          pieceFilter: 'bishop',
        },
        // Knight mates
        {
          id: '1.2.8',
          name: 'Knight Mate in 1',
          description: 'Checkmate with the knight',
          requiredTags: ['mateIn1'],
          ratingMin: 400,
          ratingMax: 800,
          pieceFilter: 'knight',
        },
        // Module Review
        {
          id: '1.2.R',
          name: 'Module 2 Review: Best Move',
          description: 'Find the mate in 1 - any piece, any pattern',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn1'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 3: BACK RANK MATE
    // ========================================
    {
      id: 'mod-3',
      name: 'Back Rank Mate',
      description: 'Checkmate on the back rank',
      lessons: [
        {
          id: '1.3.1',
          name: 'Back Rank Mate in 1: Easy',
          description: 'Back rank checkmate - easiest',
          requiredTags: ['backRankMate', 'mateIn1'],
          ratingMin: 400,
          ratingMax: 550,
        },
        {
          id: '1.3.2',
          name: 'Back Rank Mate in 1: Medium',
          description: 'Back rank checkmate - medium',
          requiredTags: ['backRankMate', 'mateIn1'],
          ratingMin: 550,
          ratingMax: 700,
        },
        {
          id: '1.3.3',
          name: 'Back Rank Mate in 1: Hard',
          description: 'Back rank checkmate - harder',
          requiredTags: ['backRankMate', 'mateIn1'],
          ratingMin: 700,
          ratingMax: 800,
        },
        {
          id: '1.3.4',
          name: 'Back Rank Mate in 2: Easy',
          description: 'Back rank in 2 moves - easier',
          requiredTags: ['backRankMate', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 600,
        },
        {
          id: '1.3.5',
          name: 'Back Rank Mate in 2: Hard',
          description: 'Back rank in 2 moves - harder',
          requiredTags: ['backRankMate', 'mateIn2'],
          ratingMin: 600,
          ratingMax: 800,
        },
        // Module Review
        {
          id: '1.3.R',
          name: 'Module 3 Review: Best Move',
          description: 'Find the back rank mate - any variation',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['backRankMate'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 4: KNIGHT FORKS
    // ========================================
    {
      id: 'mod-4',
      name: 'Knight Forks',
      description: 'Attack two pieces at once with a knight',
      lessons: [
        {
          id: '1.4.1',
          name: 'Knight Forks: Very Easy',
          description: 'Knight attacks two pieces - easiest',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 575,
          pieceFilter: 'knight',
        },
        {
          id: '1.4.2',
          name: 'Knight Forks: Easy',
          description: 'Knight attacks two pieces - easy',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 450,
          ratingMax: 625,
          pieceFilter: 'knight',
        },
        {
          id: '1.4.3',
          name: 'Knight Forks: Medium',
          description: 'Knight attacks two pieces - medium',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 525,
          ratingMax: 700,
          pieceFilter: 'knight',
        },
        {
          id: '1.4.4',
          name: 'Knight Forks: Medium-Hard',
          description: 'Knight attacks two pieces - medium-hard',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 600,
          ratingMax: 750,
          pieceFilter: 'knight',
        },
        // Mixed Practice after 4 lessons
        {
          id: '1.4.M',
          name: 'Mixed Practice: Knight Forks',
          description: 'Find the knight fork - varying difficulty',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 750,
          minPlays: 5000,
        },
        {
          id: '1.4.5',
          name: 'Knight Forks: Hard',
          description: 'Knight attacks two pieces - hard',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 700,
          ratingMax: 800,
          pieceFilter: 'knight',
        },
        // Module Review
        {
          id: '1.4.R',
          name: 'Module 4 Review: Best Move',
          description: 'Find the best fork with the knight',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 5: OTHER FORKS
    // ========================================
    {
      id: 'mod-5',
      name: 'Other Forks',
      description: 'Forks with pawns, bishops, rooks, and queens',
      lessons: [
        {
          id: '1.5.1',
          name: 'Pawn Forks',
          description: 'Attack two pieces with a pawn',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          pieceFilter: 'pawn',
        },
        {
          id: '1.5.2',
          name: 'Bishop Forks',
          description: 'Attack two pieces with a bishop',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          pieceFilter: 'bishop',
        },
        {
          id: '1.5.3',
          name: 'Rook Forks',
          description: 'Attack two pieces with a rook',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          pieceFilter: 'rook',
        },
        {
          id: '1.5.4',
          name: 'Queen Forks',
          description: 'Attack two pieces with the queen',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          pieceFilter: 'queen',
        },
        // Module Review
        {
          id: '1.5.R',
          name: 'Module 5 Review: Best Move',
          description: 'Find the fork - any piece',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 6: PINS & DISCOVERIES
    // ========================================
    {
      id: 'mod-6',
      name: 'Pins & Discoveries',
      description: 'Win material with pins and discovered attacks',
      lessons: [
        {
          id: '1.6.1',
          name: 'Pin Wins Material: Easy',
          description: 'Use a pin to win material - easier',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
          ratingMin: 400,
          ratingMax: 700,
        },
        {
          id: '1.6.2',
          name: 'Pin Wins Material: Medium',
          description: 'Use a pin to win material - medium',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
          ratingMin: 550,
          ratingMax: 775,
        },
        {
          id: '1.6.3',
          name: 'Pin Wins Material: Hard',
          description: 'Use a pin to win material - harder',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
          ratingMin: 700,
          ratingMax: 800,
        },
        {
          id: '1.6.4',
          name: 'Discovery Wins Material',
          description: 'Use discovered attacks to win pieces',
          requiredTags: ['discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2', 'mate'],
          ratingMin: 550,
          ratingMax: 750,
        },
        // Module Review
        {
          id: '1.6.R',
          name: 'Module 6 Review: Best Move',
          description: 'Find the pin or discovery',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['pin', 'discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 7: SKEWERS
    // ========================================
    {
      id: 'mod-7',
      name: 'Skewers',
      description: 'Attack a valuable piece, win the one behind it',
      lessons: [
        {
          id: '1.7.1',
          name: 'Skewers: Easy',
          description: 'Basic skewer patterns',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 700,
        },
        {
          id: '1.7.2',
          name: 'Skewers: Medium',
          description: 'Skewer puzzles - medium',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 550,
          ratingMax: 775,
        },
        {
          id: '1.7.3',
          name: 'Skewers: Hard',
          description: 'Skewer puzzles - harder',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 700,
          ratingMax: 800,
        },
        // Module Review
        {
          id: '1.7.R',
          name: 'Module 7 Review: Best Move',
          description: 'Find the skewer',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 8: DISCOVERED ATTACKS
    // ========================================
    {
      id: 'mod-8',
      name: 'Discovered Attacks',
      description: 'Move a piece to reveal an attack from another',
      lessons: [
        {
          id: '1.8.1',
          name: 'Discovered Attacks: Easy',
          description: 'Basic discovered attacks',
          requiredTags: ['discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 700,
        },
        {
          id: '1.8.2',
          name: 'Discovered Attacks: Medium',
          description: 'Discovered attacks - medium',
          requiredTags: ['discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 550,
          ratingMax: 775,
        },
        {
          id: '1.8.3',
          name: 'Discovered Attacks: Hard',
          description: 'Discovered attacks - harder',
          requiredTags: ['discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 700,
          ratingMax: 800,
        },
        // Module Review
        {
          id: '1.8.R',
          name: 'Module 8 Review: Best Move',
          description: 'Find the discovery',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['discoveredAttack'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 9: MATE IN 2
    // ========================================
    {
      id: 'mod-9',
      name: 'Mate in 2',
      description: 'Deliver checkmate in two moves',
      lessons: [
        {
          id: '1.9.1',
          name: 'Mate in 2: Very Easy',
          description: 'Two-move checkmates - easiest',
          requiredTags: ['mateIn2'],
          excludeTags: ['backRankMate'],
          ratingMin: 400,
          ratingMax: 525,
        },
        {
          id: '1.9.2',
          name: 'Mate in 2: Easy',
          description: 'Two-move checkmates - easy',
          requiredTags: ['mateIn2'],
          excludeTags: ['backRankMate'],
          ratingMin: 525,
          ratingMax: 600,
        },
        {
          id: '1.9.3',
          name: 'Mate in 2: Medium',
          description: 'Two-move checkmates - medium',
          requiredTags: ['mateIn2'],
          excludeTags: ['backRankMate'],
          ratingMin: 600,
          ratingMax: 700,
        },
        {
          id: '1.9.4',
          name: 'Mate in 2: Hard',
          description: 'Two-move checkmates - hard',
          requiredTags: ['mateIn2'],
          excludeTags: ['backRankMate'],
          ratingMin: 700,
          ratingMax: 800,
        },
        // Module Review
        {
          id: '1.9.R',
          name: 'Module 9 Review: Best Move',
          description: 'Find the mate in 2',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn2'],
          excludeTags: ['backRankMate'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 10: FAMOUS MATE PATTERNS
    // ========================================
    {
      id: 'mod-10',
      name: 'Famous Checkmate Patterns',
      description: 'Learn named checkmate patterns',
      lessons: [
        {
          id: '1.10.1',
          name: 'Opera Mate',
          description: 'Rook and bishop checkmate pattern',
          requiredTags: ['operaMate'],
          ratingMin: 400,
          ratingMax: 800,
        },
        {
          id: '1.10.2',
          name: "Pillsbury's Mate",
          description: 'Rook and bishop back rank pattern',
          requiredTags: ['pillsburysMate'],
          ratingMin: 400,
          ratingMax: 800,
        },
        {
          id: '1.10.3',
          name: 'Smothered Mate',
          description: 'Knight checkmate on a trapped king',
          requiredTags: ['smotheredMate'],
          ratingMin: 400,
          ratingMax: 800,
        },
        {
          id: '1.10.4',
          name: 'Arabian Mate',
          description: 'Rook and knight checkmate pattern',
          requiredTags: ['arabianMate'],
          ratingMin: 400,
          ratingMax: 800,
        },
        {
          id: '1.10.5',
          name: 'Double Bishop Mate',
          description: 'Two bishops deliver checkmate',
          requiredTags: ['doubleBishopMate'],
          ratingMin: 400,
          ratingMax: 800,
        },
        {
          id: '1.10.6',
          name: 'Hook Mate',
          description: 'Rook and knight hook checkmate',
          requiredTags: ['hookMate'],
          ratingMin: 400,
          ratingMax: 800,
        },
        // Module Review
        {
          id: '1.10.R',
          name: 'Module 10 Review: Best Move',
          description: 'Find the famous checkmate pattern',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['operaMate', 'pillsburysMate', 'smotheredMate', 'arabianMate', 'doubleBishopMate', 'hookMate'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 11: PROMOTION
    // ========================================
    {
      id: 'mod-11',
      name: 'Pawn Promotion',
      description: 'Promote pawns to win',
      lessons: [
        {
          id: '1.11.1',
          name: 'Simple Promotion',
          description: 'Promote a pawn to win - basic',
          requiredTags: ['promotion'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 650,
        },
        {
          id: '1.11.2',
          name: 'Promotion Tactics',
          description: 'Promotion with tactical ideas',
          requiredTags: ['promotion'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 650,
          ratingMax: 800,
        },
        {
          id: '1.11.3',
          name: 'Promotion: Advanced',
          description: 'Complex promotion tactics',
          requiredTags: ['promotion'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 600,
          ratingMax: 800,
        },
        // Module Review
        {
          id: '1.11.R',
          name: 'Module 11 Review: Best Move',
          description: 'Find the promotion tactic',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['promotion'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 12: DEFLECTION & ATTRACTION
    // ========================================
    {
      id: 'mod-12',
      name: 'Deflection & Attraction',
      description: 'Force pieces away from or to key squares',
      lessons: [
        {
          id: '1.12.1',
          name: 'Deflection',
          description: 'Force a defender away from its duty',
          requiredTags: ['deflection'],
          ratingMin: 400,
          ratingMax: 800,
        },
        {
          id: '1.12.2',
          name: 'Attraction',
          description: 'Lure a piece to a vulnerable square',
          requiredTags: ['attraction'],
          ratingMin: 400,
          ratingMax: 800,
        },
        // Module Review
        {
          id: '1.12.R',
          name: 'Module 12 Review: Best Move',
          description: 'Find the deflection or attraction',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['deflection', 'attraction'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 13: ENDGAMES
    // ========================================
    {
      id: 'mod-13',
      name: 'Basic Endgames',
      description: 'Win in simplified positions',
      lessons: [
        {
          id: '1.13.1',
          name: 'Rook Endgames: Easy',
          description: 'Rook endings - basic wins',
          requiredTags: ['rookEndgame'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 750,
        },
        {
          id: '1.13.2',
          name: 'Rook Endgames: Medium',
          description: 'Rook endings - medium difficulty',
          requiredTags: ['rookEndgame'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 600,
          ratingMax: 800,
        },
        {
          id: '1.13.3',
          name: 'Pawn Endgames',
          description: 'King and pawn endings',
          requiredTags: ['pawnEndgame'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
        },
        {
          id: '1.13.4',
          name: 'Queen Endgames',
          description: 'Queen endings',
          requiredTags: ['queenEndgame'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
        },
        // Module Review
        {
          id: '1.13.R',
          name: 'Module 13 Review: Best Move',
          description: 'Find the winning endgame move',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['rookEndgame', 'pawnEndgame', 'queenEndgame'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 14: COMBINATIONS (Theme Mixing)
    // ========================================
    {
      id: 'mod-14',
      name: 'Combinations',
      description: 'Puzzles combining multiple themes',
      lessons: [
        {
          id: '1.14.1',
          name: 'Back Rank + Sacrifice',
          description: 'Sacrifice to deliver back rank mate',
          requiredTags: ['backRankMate', 'sacrifice'],
          ratingMin: 400,
          ratingMax: 700,
        },
        {
          id: '1.14.2',
          name: 'Back Rank + Sacrifice: Hard',
          description: 'Back rank with sacrifice - harder',
          requiredTags: ['backRankMate', 'sacrifice'],
          ratingMin: 700,
          ratingMax: 800,
        },
        {
          id: '1.14.3',
          name: 'Mate in 2: Back Rank',
          description: 'Two-move back rank checkmates',
          requiredTags: ['mateIn2', 'backRankMate'],
          ratingMin: 600,
          ratingMax: 800,
        },
        {
          id: '1.14.4',
          name: 'Back Rank + Fork',
          description: 'Fork creates back rank threat',
          requiredTags: ['backRankMate', 'fork'],
          ratingMin: 400,
          ratingMax: 800,
        },
        {
          id: '1.14.5',
          name: 'Queen Mate in 2',
          description: 'Two-move checkmates with the queen',
          requiredTags: ['mateIn2'],
          ratingMin: 600,
          ratingMax: 800,
          pieceFilter: 'queen',
        },
        // Module Review
        {
          id: '1.14.R',
          name: 'Module 14 Review: Best Move',
          description: 'Find the combination',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['backRankMate', 'sacrifice', 'fork', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 15: MATE IN 3
    // ========================================
    {
      id: 'mod-15',
      name: 'Mate in 3',
      description: 'Deliver checkmate in three moves',
      lessons: [
        {
          id: '1.15.1',
          name: 'Mate in 3: Easy',
          description: 'Three-move checkmates - easier',
          requiredTags: ['mateIn3'],
          ratingMin: 400,
          ratingMax: 650,
        },
        {
          id: '1.15.2',
          name: 'Mate in 3: Hard',
          description: 'Three-move checkmates - harder',
          requiredTags: ['mateIn3'],
          ratingMin: 650,
          ratingMax: 800,
        },
        // Module Review
        {
          id: '1.15.R',
          name: 'Module 15 Review: Best Move',
          description: 'Find the mate in 3',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn3'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },
  ],
};

// Helper functions
export function getAllLessons(): LessonCriteria[] {
  return level1.modules.flatMap(m => m.lessons);
}

export function getLessonById(id: string): LessonCriteria | undefined {
  return getAllLessons().find(l => l.id === id);
}

export function getModuleById(id: string): Module | undefined {
  return level1.modules.find(m => m.id === id);
}

export function getLessonsForModule(moduleId: string): LessonCriteria[] {
  const module = getModuleById(moduleId);
  return module?.lessons || [];
}

// Count total lessons
export function getLessonCount(): number {
  return getAllLessons().length;
}
