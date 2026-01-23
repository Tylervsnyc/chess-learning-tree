/**
 * Level 1 Curriculum v2 - ENDS → MEANS Framework
 *
 * Based on the insight that chess themes fall into two categories:
 * - ENDS (Goals): The result you're trying to achieve (mate, winning material)
 * - MEANS (Tools): Methods that ENABLE the ends (sacrifice, deflection, attraction)
 *
 * Teaching order:
 * 1. First teach ENDS so students know WHAT they're trying to achieve
 * 2. Then teach MEANS showing HOW to achieve what they already understand
 *
 * This creates the "aha!" moment: "Oh, THAT'S how I get the fork I already know!"
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
  isMixedPractice?: boolean;
  mixedThemes?: string[];
}

export interface Module {
  id: string;
  name: string;
  description: string;
  themeType: 'end' | 'means' | 'mixed'; // New: classify the module
  lessons: LessonCriteria[];
}

export interface Level {
  id: string;
  name: string;
  ratingRange: string;
  modules: Module[];
}

export const level1v2: Level = {
  id: 'level-1-v2',
  name: 'Level 1: Foundations',
  ratingRange: '400-800',
  modules: [
    // ════════════════════════════════════════════════════════════════
    // PHASE 1: ENDS (Goals) - "Here's what you're trying to achieve"
    // ════════════════════════════════════════════════════════════════

    // ========================================
    // MODULE 1: CHECKMATE IN 1 (END)
    // "This is checkmate - recognize the final blow"
    // ========================================
    {
      id: 'mod-1',
      name: 'Checkmate in 1',
      description: 'Recognize and deliver checkmate in one move',
      themeType: 'end',
      lessons: [
        {
          id: '1.1.1',
          name: 'Queen Checkmates: Easy',
          description: 'Deliver checkmate with the queen',
          requiredTags: ['mateIn1'],
          ratingMin: 400,
          ratingMax: 600,
          pieceFilter: 'queen',
        },
        {
          id: '1.1.2',
          name: 'Queen Checkmates: Medium',
          description: 'Queen checkmates - slightly harder',
          requiredTags: ['mateIn1'],
          ratingMin: 550,
          ratingMax: 750,
          pieceFilter: 'queen',
        },
        {
          id: '1.1.3',
          name: 'Rook Checkmates: Easy',
          description: 'Deliver checkmate with the rook',
          requiredTags: ['mateIn1'],
          ratingMin: 400,
          ratingMax: 600,
          pieceFilter: 'rook',
        },
        {
          id: '1.1.4',
          name: 'Rook Checkmates: Medium',
          description: 'Rook checkmates - slightly harder',
          requiredTags: ['mateIn1'],
          ratingMin: 550,
          ratingMax: 800,
          pieceFilter: 'rook',
        },
        {
          id: '1.1.5',
          name: 'Knight & Bishop Checkmates',
          description: 'Checkmate with minor pieces',
          requiredTags: ['mateIn1'],
          ratingMin: 400,
          ratingMax: 800,
          pieceFilter: 'knight',
        },
        {
          id: '1.1.R',
          name: 'Review: Find the Checkmate',
          description: 'Checkmate in 1 - any piece',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn1'],
          ratingMin: 400,
          ratingMax: 650,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 2: BACK RANK MATE (END)
    // "The most common checkmate pattern"
    // ========================================
    {
      id: 'mod-2',
      name: 'Back Rank Mate',
      description: 'The most common checkmate pattern - king trapped on the back rank',
      themeType: 'end',
      lessons: [
        {
          id: '1.2.1',
          name: 'Back Rank Mate in 1: Easy',
          description: 'Simple back rank checkmates',
          requiredTags: ['backRankMate', 'mateIn1'],
          ratingMin: 400,
          ratingMax: 550,
        },
        {
          id: '1.2.2',
          name: 'Back Rank Mate in 1: Medium',
          description: 'Back rank checkmates - medium',
          requiredTags: ['backRankMate', 'mateIn1'],
          ratingMin: 550,
          ratingMax: 700,
        },
        {
          id: '1.2.3',
          name: 'Back Rank Mate in 1: Hard',
          description: 'Back rank checkmates - harder',
          requiredTags: ['backRankMate', 'mateIn1'],
          ratingMin: 700,
          ratingMax: 800,
        },
        {
          id: '1.2.R',
          name: 'Review: Back Rank Patterns',
          description: 'Find the back rank mate',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['backRankMate', 'mateIn1'],
          ratingMin: 400,
          ratingMax: 750,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 3: SMOTHERED MATE (END)
    // "A beautiful pattern - knight checkmates trapped king"
    // ========================================
    {
      id: 'mod-3',
      name: 'Smothered Mate',
      description: 'Knight checkmates a king trapped by its own pieces',
      themeType: 'end',
      lessons: [
        {
          id: '1.3.1',
          name: 'Smothered Mate: Easy',
          description: 'Knight delivers mate to a trapped king',
          requiredTags: ['smotheredMate', 'mateIn1'],
          ratingMin: 400,
          ratingMax: 650,
        },
        {
          id: '1.3.2',
          name: 'Smothered Mate: Medium',
          description: 'Smothered mate - slightly harder',
          requiredTags: ['smotheredMate', 'mateIn1'],
          ratingMin: 650,
          ratingMax: 800,
        },
        {
          id: '1.3.R',
          name: 'Review: Smothered Mate',
          description: 'Find the smothered mate',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['smotheredMate'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 3000,
        },
      ],
    },

    // ========================================
    // MODULE 4: KNIGHT FORKS (END)
    // "Attack two pieces at once - win material"
    // ========================================
    {
      id: 'mod-4',
      name: 'Knight Forks',
      description: 'Attack two pieces at once with a knight',
      themeType: 'end',
      lessons: [
        {
          id: '1.4.1',
          name: 'Knight Forks: Very Easy',
          description: 'Knight attacks two pieces - easiest',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 550,
          pieceFilter: 'knight',
        },
        {
          id: '1.4.2',
          name: 'Knight Forks: Easy',
          description: 'Knight forks - slightly harder',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 500,
          ratingMax: 625,
          pieceFilter: 'knight',
        },
        {
          id: '1.4.3',
          name: 'Knight Forks: Medium',
          description: 'Knight forks - medium difficulty',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 575,
          ratingMax: 700,
          pieceFilter: 'knight',
        },
        {
          id: '1.4.4',
          name: 'Knight Forks: Hard',
          description: 'Knight forks - harder patterns',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 650,
          ratingMax: 800,
          pieceFilter: 'knight',
        },
        {
          id: '1.4.R',
          name: 'Review: Knight Forks',
          description: 'Find the knight fork',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 750,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 5: OTHER FORKS (END)
    // "Any piece can fork!"
    // ========================================
    {
      id: 'mod-5',
      name: 'Other Forks',
      description: 'Forks with pawns, bishops, rooks, and queens',
      themeType: 'end',
      lessons: [
        {
          id: '1.5.1',
          name: 'Pawn Forks',
          description: 'Attack two pieces with a pawn',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 800,
          pieceFilter: 'pawn',
        },
        {
          id: '1.5.2',
          name: 'Queen Forks',
          description: 'Attack two pieces with the queen',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 750,
          pieceFilter: 'queen',
        },
        {
          id: '1.5.3',
          name: 'Rook Forks',
          description: 'Attack two pieces with a rook',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 800,
          pieceFilter: 'rook',
        },
        {
          id: '1.5.4',
          name: 'Bishop Forks',
          description: 'Attack two pieces with a bishop',
          requiredTags: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 800,
          pieceFilter: 'bishop',
        },
        {
          id: '1.5.R',
          name: 'Review: All Forks',
          description: 'Find the fork - any piece',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['fork'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 6: HANGING PIECES (END)
    // "Take free stuff!"
    // ========================================
    {
      id: 'mod-6',
      name: 'Hanging Pieces',
      description: 'Capture undefended pieces',
      themeType: 'end',
      lessons: [
        {
          id: '1.6.1',
          name: 'Hanging Pieces: Easy',
          description: 'Capture undefended pieces - easiest',
          requiredTags: ['hangingPiece'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 600,
        },
        {
          id: '1.6.2',
          name: 'Hanging Pieces: Medium',
          description: 'Hanging pieces - find the target',
          requiredTags: ['hangingPiece'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 550,
          ratingMax: 750,
        },
        {
          id: '1.6.3',
          name: 'Hanging Pieces: Hard',
          description: 'Hanging pieces - less obvious',
          requiredTags: ['hangingPiece'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 700,
          ratingMax: 800,
        },
        {
          id: '1.6.R',
          name: 'Review: Hanging Pieces',
          description: 'Find the hanging piece',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['hangingPiece'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 7: SKEWERS (END)
    // "Attack through a piece to win what's behind"
    // ========================================
    {
      id: 'mod-7',
      name: 'Skewers',
      description: 'Attack a valuable piece, win the one behind it',
      themeType: 'end',
      lessons: [
        {
          id: '1.7.1',
          name: 'Skewers: Easy',
          description: 'Basic skewer patterns',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 650,
        },
        {
          id: '1.7.2',
          name: 'Skewers: Medium',
          description: 'Skewer patterns - medium',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 600,
          ratingMax: 750,
        },
        {
          id: '1.7.3',
          name: 'Skewers: Hard',
          description: 'Skewer patterns - harder',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 700,
          ratingMax: 800,
        },
        {
          id: '1.7.R',
          name: 'Review: Skewers',
          description: 'Find the skewer',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['skewer'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ========================================
    // MODULE 8: PROMOTION (END)
    // "Get your pawn to the other side!"
    // ========================================
    {
      id: 'mod-8',
      name: 'Pawn Promotion',
      description: 'Promote pawns to win',
      themeType: 'end',
      lessons: [
        {
          id: '1.8.1',
          name: 'Simple Promotion',
          description: 'Promote a pawn to win - basic',
          requiredTags: ['promotion', 'advancedPawn'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 600,
        },
        {
          id: '1.8.2',
          name: 'Promotion Tactics',
          description: 'Promotion with obstacles to overcome',
          requiredTags: ['promotion', 'advancedPawn'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 550,
          ratingMax: 750,
        },
        {
          id: '1.8.3',
          name: 'Promotion: Advanced',
          description: 'Complex promotion tactics',
          requiredTags: ['promotion'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 700,
          ratingMax: 800,
        },
        {
          id: '1.8.R',
          name: 'Review: Promotion',
          description: 'Find the promotion',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['promotion'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // CHECKPOINT: ENDS REVIEW
    // "You know the GOALS - let's make sure"
    // ════════════════════════════════════════════════════════════════
    {
      id: 'mod-checkpoint-1',
      name: 'Checkpoint: All Goals',
      description: 'Review all the tactical goals before learning the tools',
      themeType: 'mixed',
      lessons: [
        {
          id: '1.CP.1',
          name: 'Checkpoint: Mates',
          description: 'Find the checkmate - any pattern',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn1', 'backRankMate', 'smotheredMate'],
          ratingMin: 400,
          ratingMax: 700,
          minPlays: 5000,
        },
        {
          id: '1.CP.2',
          name: 'Checkpoint: Win Material',
          description: 'Win material - any tactic',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['fork', 'skewer', 'hangingPiece'],
          excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 750,
          minPlays: 5000,
        },
        {
          id: '1.CP.R',
          name: 'Checkpoint: Everything',
          description: 'Find the best move - any goal',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn1', 'backRankMate', 'fork', 'skewer', 'hangingPiece', 'promotion'],
          ratingMin: 400,
          ratingMax: 750,
          minPlays: 5000,
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // PHASE 2: MEANS → ENDS (Tools) - "Here's HOW to achieve the goals"
    // ════════════════════════════════════════════════════════════════

    // ========================================
    // MODULE 9: SACRIFICE → BACK RANK MATE (MEANS → END)
    // "Give up material to force the back rank mate you already know"
    // ========================================
    {
      id: 'mod-9',
      name: 'Sacrifice for Back Rank',
      description: 'Give up material to force the back rank mate you already know',
      themeType: 'means',
      lessons: [
        {
          id: '1.9.1',
          name: 'Sacrifice → Back Rank: Easy',
          description: 'Sacrifice to force back rank mate - easier',
          requiredTags: ['sacrifice', 'backRankMate'],
          ratingMin: 400,
          ratingMax: 600,
        },
        {
          id: '1.9.2',
          name: 'Sacrifice → Back Rank: Medium',
          description: 'Sacrifice to force back rank mate - medium',
          requiredTags: ['sacrifice', 'backRankMate'],
          ratingMin: 550,
          ratingMax: 700,
        },
        {
          id: '1.9.3',
          name: 'Sacrifice → Back Rank: Hard',
          description: 'Sacrifice to force back rank mate - harder',
          requiredTags: ['sacrifice', 'backRankMate'],
          ratingMin: 650,
          ratingMax: 800,
        },
        {
          id: '1.9.R',
          name: 'Review: Sacrifice → Back Rank',
          description: 'Sacrifice for back rank mate',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['sacrifice', 'backRankMate'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 3000,
        },
      ],
    },

    // ========================================
    // MODULE 10: SACRIFICE → MATE IN 2 (MEANS → END)
    // "Sacrifice to force checkmate in 2 moves"
    // ========================================
    {
      id: 'mod-10',
      name: 'Sacrifice for Mate in 2',
      description: 'Give up material to force checkmate in 2 moves',
      themeType: 'means',
      lessons: [
        {
          id: '1.10.1',
          name: 'Sacrifice → Mate in 2: Easy',
          description: 'Sacrifice to force mate in 2 - easier',
          requiredTags: ['sacrifice', 'mateIn2'],
          excludeTags: ['backRankMate'], // Already covered above
          ratingMin: 400,
          ratingMax: 600,
        },
        {
          id: '1.10.2',
          name: 'Sacrifice → Mate in 2: Medium',
          description: 'Sacrifice to force mate in 2 - medium',
          requiredTags: ['sacrifice', 'mateIn2'],
          excludeTags: ['backRankMate'],
          ratingMin: 550,
          ratingMax: 700,
        },
        {
          id: '1.10.3',
          name: 'Sacrifice → Mate in 2: Hard',
          description: 'Sacrifice to force mate in 2 - harder',
          requiredTags: ['sacrifice', 'mateIn2'],
          excludeTags: ['backRankMate'],
          ratingMin: 650,
          ratingMax: 800,
        },
        {
          id: '1.10.R',
          name: 'Review: Sacrifice → Mate',
          description: 'Sacrifice for checkmate',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['sacrifice', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 3000,
        },
      ],
    },

    // ========================================
    // MODULE 11: SACRIFICE → MATE IN 3 (MEANS → END)
    // "Longer sacrificial combinations"
    // ========================================
    {
      id: 'mod-11',
      name: 'Sacrifice for Mate in 3',
      description: 'Sacrifice to force checkmate in 3 moves',
      themeType: 'means',
      lessons: [
        {
          id: '1.11.1',
          name: 'Sacrifice → Mate in 3: Easy',
          description: 'Sacrifice to force mate in 3 - easier',
          requiredTags: ['sacrifice', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 650,
        },
        {
          id: '1.11.2',
          name: 'Sacrifice → Mate in 3: Hard',
          description: 'Sacrifice to force mate in 3 - harder',
          requiredTags: ['sacrifice', 'mateIn3'],
          ratingMin: 600,
          ratingMax: 800,
        },
        {
          id: '1.11.R',
          name: 'Review: Sacrifice → Mate in 3',
          description: 'Sacrifice for mate in 3',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['sacrifice', 'mateIn3'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 12: QUIET MOVE → PROMOTION (MEANS → END)
    // "Subtle pawn moves that lead to unstoppable promotion"
    // ========================================
    {
      id: 'mod-12',
      name: 'Quiet Moves for Promotion',
      description: 'Subtle pawn moves that lead to unstoppable promotion',
      themeType: 'means',
      lessons: [
        {
          id: '1.12.1',
          name: 'Quiet Move → Promotion: Easy',
          description: 'Subtle move enables promotion - easier',
          requiredTags: ['quietMove', 'promotion'],
          ratingMin: 400,
          ratingMax: 650,
        },
        {
          id: '1.12.2',
          name: 'Quiet Move → Promotion: Medium',
          description: 'Quiet move enables promotion - medium',
          requiredTags: ['quietMove', 'promotion'],
          ratingMin: 600,
          ratingMax: 750,
        },
        {
          id: '1.12.3',
          name: 'Quiet Move → Promotion: Hard',
          description: 'Quiet move enables promotion - harder',
          requiredTags: ['quietMove', 'promotion'],
          ratingMin: 700,
          ratingMax: 800,
        },
        {
          id: '1.12.R',
          name: 'Review: Quiet Moves',
          description: 'Find the quiet winning move',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['quietMove', 'promotion'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 2000,
        },
      ],
    },

    // ========================================
    // MODULE 13: DEFLECTION → MATE (MEANS → END)
    // "Force the defender away, then checkmate"
    // ========================================
    {
      id: 'mod-13',
      name: 'Deflection for Mate',
      description: 'Force the defender away, then deliver checkmate',
      themeType: 'means',
      lessons: [
        {
          id: '1.13.1',
          name: 'Deflection → Mate: Easy',
          description: 'Deflect defender to enable mate - easier',
          requiredTags: ['deflection', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 650,
        },
        {
          id: '1.13.2',
          name: 'Deflection → Mate: Hard',
          description: 'Deflect defender to enable mate - harder',
          requiredTags: ['deflection', 'mateIn2'],
          ratingMin: 600,
          ratingMax: 800,
        },
        {
          id: '1.13.R',
          name: 'Review: Deflection',
          description: 'Deflect the defender',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['deflection'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 14: ATTRACTION → MATE (MEANS → END)
    // "Lure the king into a mating net"
    // ========================================
    {
      id: 'mod-14',
      name: 'Attraction for Mate',
      description: 'Lure the king into a mating net',
      themeType: 'means',
      lessons: [
        {
          id: '1.14.1',
          name: 'Attraction → Mate: Easy',
          description: 'Lure king to enable mate - easier',
          requiredTags: ['attraction', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 650,
        },
        {
          id: '1.14.2',
          name: 'Attraction → Mate: Hard',
          description: 'Lure king to enable mate - harder',
          requiredTags: ['attraction', 'mateIn2'],
          ratingMin: 600,
          ratingMax: 800,
        },
        {
          id: '1.14.R',
          name: 'Review: Attraction',
          description: 'Lure the piece to its doom',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['attraction'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 15: DEFLECTION → SKEWER (MEANS → END)
    // "Move the defender, then skewer"
    // ========================================
    {
      id: 'mod-15',
      name: 'Deflection for Skewer',
      description: 'Move the defender out of the way, then skewer',
      themeType: 'means',
      lessons: [
        {
          id: '1.15.1',
          name: 'Deflection → Skewer',
          description: 'Deflect defender to enable skewer',
          requiredTags: ['deflection', 'skewer'],
          ratingMin: 400,
          ratingMax: 800,
        },
        {
          id: '1.15.R',
          name: 'Review: Deflection Combinations',
          description: 'Deflect and win',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['deflection', 'skewer', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 16: CLEARANCE → MATE (MEANS → END)
    // "Move your own piece out of the way"
    // ========================================
    {
      id: 'mod-16',
      name: 'Clearance for Mate',
      description: 'Move your own piece to open a mating line',
      themeType: 'means',
      lessons: [
        {
          id: '1.16.1',
          name: 'Clearance → Mate',
          description: 'Clear the line for checkmate',
          requiredTags: ['clearance', 'mateIn2'],
          ratingMin: 400,
          ratingMax: 800,
        },
        {
          id: '1.16.R',
          name: 'Review: Clearance',
          description: 'Clear the way',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['clearance'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 500,
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // FINAL CHECKPOINT: MEANS + ENDS
    // "Put it all together"
    // ════════════════════════════════════════════════════════════════
    {
      id: 'mod-final',
      name: 'Final: Goals & Tools',
      description: 'Combine everything you have learned',
      themeType: 'mixed',
      lessons: [
        {
          id: '1.F.1',
          name: 'Final: Sacrifice Combinations',
          description: 'Sacrifice to achieve a goal',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['sacrifice'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
        {
          id: '1.F.2',
          name: 'Final: Deflection & Attraction',
          description: 'Force pieces where you want them',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['deflection', 'attraction'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 3000,
        },
        {
          id: '1.F.3',
          name: 'Final: Find the Best Move',
          description: 'Any tactic, any pattern - find the best move',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn1', 'mateIn2', 'backRankMate', 'fork', 'skewer', 'sacrifice', 'deflection', 'attraction'],
          ratingMin: 400,
          ratingMax: 800,
          minPlays: 5000,
        },
        {
          id: '1.F.R',
          name: 'Level 1 Complete!',
          description: 'Master review - everything from Level 1',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn1', 'mateIn2', 'mateIn3', 'backRankMate', 'smotheredMate', 'fork', 'skewer', 'hangingPiece', 'promotion', 'sacrifice', 'deflection', 'attraction'],
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
  return level1v2.modules.flatMap(m => m.lessons);
}

export function getLessonById(id: string): LessonCriteria | undefined {
  return getAllLessons().find(l => l.id === id);
}

export function getModuleById(id: string): Module | undefined {
  return level1v2.modules.find(m => m.id === id);
}

export function getLessonsForModule(moduleId: string): LessonCriteria[] {
  const module = getModuleById(moduleId);
  return module?.lessons || [];
}

export function getLessonCount(): number {
  return getAllLessons().length;
}

export function getEndModules(): Module[] {
  return level1v2.modules.filter(m => m.themeType === 'end');
}

export function getMeansModules(): Module[] {
  return level1v2.modules.filter(m => m.themeType === 'means');
}

// Summary for testing
export function getCurriculumSummary(): string {
  const ends = getEndModules();
  const means = getMeansModules();
  const total = getAllLessons().length;

  return `
Level 1 v2 Curriculum Summary (ENDS → MEANS Framework)
═══════════════════════════════════════════════════════

PHASE 1: ENDS (Goals) - ${ends.length} modules
${ends.map(m => `  • ${m.name} (${m.lessons.length} lessons)`).join('\n')}

PHASE 2: MEANS → ENDS (Tools) - ${means.length} modules
${means.map(m => `  • ${m.name} (${m.lessons.length} lessons)`).join('\n')}

Total: ${level1v2.modules.length} modules, ${total} lessons
`;
}
