/**
 * Level 1 V2 Curriculum (400-800 ELO)
 * "How to Lose Friends and Infuriate People"
 *
 * Structure:
 * - Blocks 1-3: 3 content sections + 1 review section = 12 sections, 48 lessons
 * - Block 4: 2 review sections = 2 sections, 8 lessons
 * - Total: 14 sections, 56 lessons
 *
 * Block 1: Checkmates - End the game with authority
 * Block 2: Winning Material - Take their stuff (including forks)
 * Block 3: Endgames - Convert your advantage
 * Block 4: Final Review - Prove your mastery
 *
 * Clean puzzles: 1000+ plays, single tactical theme = community verified
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

export interface Section {
  id: string;
  name: string;
  description: string;
  themeIntroMessage?: string;
  isReview?: boolean;
  lessons: LessonCriteria[];
}

export interface Block {
  id: string;
  name: string;
  description: string;
  blockIntroMessage?: string;
  sections: Section[];
}

export interface Level {
  id: string;
  name: string;
  ratingRange: string;
  blocks: Block[];
}

export const level1V2: Level = {
  id: 'level-1',
  name: 'Level 1: How to Lose Friends',
  ratingRange: '400-800',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: CHECKMATES
    // "End the Game. No Mercy."
    // Interleaved by piece type for variety within each section
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'End the Game',
      description: 'Learn to deliver checkmate',
      blockIntroMessage: `Welcome to Chess Path!

Here's the secret to winning at chess: checkmate. That's it. Trap their king so it can't escape, and you win.

We're starting with one-move checkmates. These are the easiest puzzles in chess - find the killer move and end the game.`,
      sections: [
        // Section 1: Easy Mates - Queen then Rook
        {
          id: 'sec-1',
          name: 'Mate in One: Queen & Rook',
          description: 'End games with your strongest pieces',
          themeIntroMessage: `Your queen and rooks are checkmate machines.

The queen moves in any direction. Rooks control entire ranks and files. Both can trap a king against the edge of the board.

Look for where they can attack the king while blocking all escape routes. One move. Game over.`,
          lessons: [
            {
              id: '1.1.1',
              name: 'Queen Checkmate: Easy',
              description: 'Deliver mate with the queen',
              requiredTags: ['mateIn1'],
              pieceFilter: 'queen',
              ratingMin: 400,
              ratingMax: 500,
              minPlays: 1000,
            },
            {
              id: '1.1.2',
              name: 'Rook Checkmate: Easy',
              description: 'Deliver mate with the rook',
              requiredTags: ['mateIn1'],
              pieceFilter: 'rook',
              ratingMin: 400,
              ratingMax: 500,
              minPlays: 1000,
            },
            {
              id: '1.1.3',
              name: 'Queen Checkmate: More Practice',
              description: 'More one-move queen mates',
              requiredTags: ['mateIn1'],
              pieceFilter: 'queen',
              ratingMin: 450,
              ratingMax: 550,
              minPlays: 1000,
            },
            {
              id: '1.1.4',
              name: 'Rook Checkmate: More Practice',
              description: 'More one-move rook mates',
              requiredTags: ['mateIn1'],
              pieceFilter: 'rook',
              ratingMin: 450,
              ratingMax: 550,
              minPlays: 1000,
            },
          ],
        },
        // Section 2: Mating Patterns (famous patterns)
        {
          id: 'sec-2',
          name: 'Classic Checkmate Patterns',
          description: 'Learn the patterns that win games',
          themeIntroMessage: `Now for the fun stuff - famous checkmate patterns.

These patterns have names because they happen all the time. Back rank mate? The most common checkmate in beginner games. Smothered mate? Pure style points.

Learn the patterns, spot them in your games.`,
          lessons: [
            {
              id: '1.2.1',
              name: 'Back Rank Mate',
              description: 'Trap the king behind its pawns',
              requiredTags: ['backRankMate'],
              ratingMin: 400,
              ratingMax: 500,
              minPlays: 1000,
            },
            {
              id: '1.2.2',
              name: 'Smothered Mate',
              description: 'Knight traps the enclosed king',
              requiredTags: ['smotheredMate'],
              ratingMin: 400,
              ratingMax: 600,
              minPlays: 1000,
            },
            {
              id: '1.2.3',
              name: 'Arabian Mate',
              description: 'Knight and rook team up',
              requiredTags: ['arabianMate'],
              ratingMin: 400,
              ratingMax: 600,
              minPlays: 1000,
            },
            {
              id: '1.2.4',
              name: 'Hook Mate',
              description: 'Rook and knight on the edge',
              requiredTags: ['hookMate'],
              ratingMin: 450,
              ratingMax: 650,
              minPlays: 1000,
            },
          ],
        },
        // Section 3: Multi-Move Checkmates
        {
          id: 'sec-3',
          name: 'Multi-Move Checkmates',
          description: 'Plan ahead for the kill',
          themeIntroMessage: `Think one move deeper.

Mate in one is great. But sometimes you need to set up the kill shot first.

Make a forcing move (usually a check), wait for their response, THEN deliver checkmate. Two moves. Still pretty quick.`,
          lessons: [
            {
              id: '1.3.1',
              name: 'Mate in 2: Easy',
              description: 'Simple two-move checkmates',
              requiredTags: ['mateIn2'],
              ratingMin: 400,
              ratingMax: 475,
              minPlays: 1000,
            },
            {
              id: '1.3.2',
              name: 'Mate in 2: Medium',
              description: 'Two-move patterns',
              requiredTags: ['mateIn2'],
              ratingMin: 450,
              ratingMax: 525,
              minPlays: 1000,
            },
            {
              id: '1.3.3',
              name: 'Mate in 2: Harder',
              description: 'Tricky two-move checkmates',
              requiredTags: ['mateIn2'],
              ratingMin: 500,
              ratingMax: 550,
              minPlays: 1000,
            },
            {
              id: '1.3.4',
              name: 'Mate in 3: Introduction',
              description: 'Plan three moves ahead',
              requiredTags: ['mateIn3'],
              ratingMin: 400,
              ratingMax: 650,
              minPlays: 1000,
            },
          ],
        },
        // Section 4: Block 1 Review
        {
          id: 'sec-4',
          name: 'Review: Checkmates',
          description: 'Mixed checkmate practice',
          themeIntroMessage: `Time to prove you can find the mate.

We're mixing it all up now - queen mates, rook mates, back rank, mating patterns. You won't know what's coming.

Find the checkmate. Every time.`,
          isReview: true,
          lessons: [
            {
              id: '1.4.1',
              name: 'Review: Mate in 1',
              description: 'Find the one-move checkmate',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn1'],
              ratingMin: 400,
              ratingMax: 550,
              minPlays: 1000,
            },
            {
              id: '1.4.2',
              name: 'Review: Mating Patterns',
              description: 'Classic mating patterns',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['backRankMate', 'smotheredMate', 'arabianMate', 'hookMate'],
              ratingMin: 400,
              ratingMax: 650,
              minPlays: 500,
            },
            {
              id: '1.4.3',
              name: 'Review: Mate in 2',
              description: 'Two-move checkmates',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn2'],
              ratingMin: 400,
              ratingMax: 550,
              minPlays: 1000,
            },
            {
              id: '1.4.4',
              name: 'Review: All Checkmates',
              description: 'Mixed mating practice',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn1', 'mateIn2', 'backRankMate', 'smotheredMate'],
              ratingMin: 400,
              ratingMax: 600,
              minPlays: 500,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 2: WINNING MATERIAL
    // "Take Their Stuff"
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-2',
      name: 'Take Their Stuff',
      description: 'Win pieces with tactics',
      blockIntroMessage: `Time to get greedy.

Not every position has checkmate. But you can almost always steal something. A knight here, a rook there - pretty soon they're playing with scraps.

The fork is your new best friend. One piece, two targets, maximum chaos.`,
      sections: [
        // Section 5: Hanging Pieces & Crushing
        {
          id: 'sec-5',
          name: 'Free Pieces',
          description: 'Grab what they leave hanging',
          themeIntroMessage: `Some pieces are just... sitting there.

Undefended. Alone. Waiting for you to take them.

Before you calculate anything fancy, always ask: "Did they leave something hanging?"`,
          lessons: [
            {
              id: '1.5.1',
              name: 'Hanging Pieces',
              description: 'Take the undefended piece',
              requiredTags: ['hangingPiece'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork', 'pin', 'skewer'],
              ratingMin: 400,
              ratingMax: 600,
              minPlays: 1000,
            },
            {
              id: '1.5.2',
              name: 'Crushing: Easy',
              description: 'Convert your big advantage',
              requiredTags: ['crushing'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork', 'pin', 'skewer'],
              ratingMin: 400,
              ratingMax: 525,
              minPlays: 1000,
            },
            {
              id: '1.5.3',
              name: 'Crushing: Medium',
              description: 'Find the winning move',
              requiredTags: ['crushing'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork', 'pin', 'skewer'],
              ratingMin: 500,
              ratingMax: 625,
              minPlays: 1000,
            },
            {
              id: '1.5.4',
              name: 'Crushing: Harder',
              description: 'Crush them completely',
              requiredTags: ['crushing'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork', 'pin', 'skewer'],
              ratingMin: 575,
              ratingMax: 750,
              minPlays: 1000,
            },
          ],
        },
        // Section 6: Knight Forks
        {
          id: 'sec-6',
          name: 'Forks',
          description: 'Attack two pieces at once',
          themeIntroMessage: `The fork: chess's most satisfying tactic.

Attack two things at once - they can only save one. Knights are the fork masters, but any piece can do it.

Put a piece where it attacks two things at once, and watch them panic.`,
          lessons: [
            {
              id: '1.6.1',
              name: 'Knight Fork: Basics',
              description: 'The knight attacks two pieces',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 400,
              ratingMax: 525,
              pieceFilter: 'knight',
              minPlays: 1000,
            },
            {
              id: '1.6.2',
              name: 'Fork: All Pieces',
              description: 'Any piece can fork',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 425,
              ratingMax: 550,
              minPlays: 1000,
            },
            {
              id: '1.6.3',
              name: 'Knight Fork: Royal',
              description: 'Fork the king and queen',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 500,
              ratingMax: 625,
              pieceFilter: 'knight',
              minPlays: 1000,
            },
            {
              id: '1.6.4',
              name: 'Fork: Challenge',
              description: 'Find the devastating fork',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 575,
              ratingMax: 700,
              minPlays: 1000,
            },
          ],
        },
        // Section 7: Pins & Skewers
        {
          id: 'sec-7',
          name: 'Pins & Skewers',
          description: 'Line attacks that win material',
          themeIntroMessage: `Pins and skewers - the line attacks.

A pin freezes a piece because something valuable is behind it. A skewer attacks the valuable piece, and when it moves, you take what's behind it.

Same idea, different order. Both devastating.`,
          lessons: [
            {
              id: '1.7.1',
              name: 'Pin: Introduction',
              description: 'Learn how pins work',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 400,
              ratingMax: 550,
              minPlays: 1000,
            },
            {
              id: '1.7.2',
              name: 'Pin: Win Material',
              description: 'Use pins to win pieces',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 500,
              ratingMax: 700,
              minPlays: 1000,
            },
            {
              id: '1.7.3',
              name: 'Skewer: Introduction',
              description: 'Learn how skewers work',
              requiredTags: ['skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 450,
              ratingMax: 600,
              minPlays: 1000,
            },
            {
              id: '1.7.4',
              name: 'Skewer: Win Material',
              description: 'Use skewers to win pieces',
              requiredTags: ['skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 550,
              ratingMax: 750,
              minPlays: 1000,
            },
          ],
        },
        // Section 8: Block 2 Review
        {
          id: 'sec-8',
          name: 'Review: Winning Material',
          description: 'Mixed tactics practice',
          themeIntroMessage: `Time to show off your tactical vision.

Forks, pins, skewers, hanging pieces - it's all mixed up now. Just like a real game.

See the tactic, win the piece.`,
          isReview: true,
          lessons: [
            {
              id: '1.8.1',
              name: 'Review: Forks',
              description: 'Find the double attack',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 400,
              ratingMax: 650,
              minPlays: 1000,
            },
            {
              id: '1.8.2',
              name: 'Review: Pins & Skewers',
              description: 'The line attacks',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin', 'skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 450,
              ratingMax: 700,
              minPlays: 500,
            },
            {
              id: '1.8.3',
              name: 'Review: Free Pieces',
              description: 'Grab what they give you',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['hangingPiece', 'crushing'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 400,
              ratingMax: 650,
              minPlays: 1000,
            },
            {
              id: '1.8.4',
              name: 'Review: All Tactics',
              description: 'Mixed tactical practice',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'pin', 'skewer', 'hangingPiece'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 450,
              ratingMax: 700,
              minPlays: 500,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 3: ENDGAMES
    // "Convert Your Advantage"
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-3',
      name: 'Break Their Spirit',
      description: 'Convert your advantage to victory',
      blockIntroMessage: `You took their stuff. Now what?

The board is empty, you have more pieces, and... you need to actually convert that into a win. This is where beginners throw away games.

Let's make sure that's not you.`,
      sections: [
        // Section 9: Rook Endgames
        {
          id: 'sec-9',
          name: 'Rook Endgames',
          description: 'The most common endgame',
          themeIntroMessage: `The most common endgame. By far.

Rooks survive because they hide in the back. When the dust settles, there's usually at least one rook left.

Rule #1: Keep your rook active. A passive rook is a losing rook.`,
          lessons: [
            {
              id: '1.9.1',
              name: 'Rook Endgame: Basics',
              description: 'Simple rook endgames',
              requiredTags: ['rookEndgame'],
              ratingMin: 400,
              ratingMax: 550,
              minPlays: 500,
            },
            {
              id: '1.9.2',
              name: 'Rook Endgame: Patterns',
              description: 'Key rook endgame ideas',
              requiredTags: ['rookEndgame'],
              ratingMin: 475,
              ratingMax: 625,
              minPlays: 500,
            },
            {
              id: '1.9.3',
              name: 'Rook Endgame: Active Rook',
              description: 'Keep your rook active',
              requiredTags: ['rookEndgame'],
              ratingMin: 550,
              ratingMax: 700,
              minPlays: 500,
            },
            {
              id: '1.9.4',
              name: 'Rook Endgame: Challenge',
              description: 'Find the winning technique',
              requiredTags: ['rookEndgame'],
              ratingMin: 625,
              ratingMax: 800,
              minPlays: 500,
            },
          ],
        },
        // Section 10: Pawn Endgames & Promotion
        {
          id: 'sec-10',
          name: 'Pawn Endgames',
          description: 'King and pawn battles',
          themeIntroMessage: `Every pawn dreams of becoming a queen.

In pawn endgames, your king is finally allowed to fight. Push those pawns, escort them down the board, and make a new queen.

The "opposition" is your secret weapon. You'll see.`,
          lessons: [
            {
              id: '1.10.1',
              name: 'Pawn Endgame: Easy',
              description: 'Simple pawn endgames',
              requiredTags: ['pawnEndgame'],
              ratingMin: 400,
              ratingMax: 600,
              minPlays: 100,
            },
            {
              id: '1.10.2',
              name: 'Pawn Endgame: Medium',
              description: 'Control the key squares',
              requiredTags: ['pawnEndgame'],
              ratingMin: 500,
              ratingMax: 700,
              minPlays: 100,
            },
            {
              id: '1.10.3',
              name: 'Promotion Tactics',
              description: 'Race to make a queen',
              requiredTags: ['promotion'],
              ratingMin: 550,
              ratingMax: 800,
              minPlays: 100,
            },
            {
              id: '1.10.4',
              name: 'Pawn Endgame: Challenge',
              description: 'Find the winning path',
              requiredTags: ['pawnEndgame'],
              ratingMin: 650,
              ratingMax: 800,
              minPlays: 100,
            },
          ],
        },
        // Section 11: Advanced Tactics & Minor Endgames
        {
          id: 'sec-11',
          name: 'Advanced Tactics',
          description: 'Sneaky tactics and piece endgames',
          themeIntroMessage: `Time for the sneaky stuff.

Deflection forces a defender to abandon what it's protecting. Trapped pieces have no escape. X-ray attacks go through pieces.

Plus: knight, bishop, and queen endgames to finish converting your advantage.`,
          lessons: [
            {
              id: '1.11.1',
              name: 'Deflection: Basics',
              description: 'Force the defender away',
              requiredTags: ['deflection'],
              ratingMin: 675,
              ratingMax: 800,
              minPlays: 100,
            },
            {
              id: '1.11.2',
              name: 'Trapped Piece',
              description: 'Catch the piece with no escape',
              requiredTags: ['trappedPiece'],
              ratingMin: 625,
              ratingMax: 800,
              minPlays: 100,
            },
            {
              id: '1.11.3',
              name: 'Knight Endgame',
              description: 'Knight endgame techniques',
              requiredTags: ['knightEndgame'],
              ratingMin: 400,
              ratingMax: 700,
              minPlays: 100,
            },
            {
              id: '1.11.4',
              name: 'Bishop Endgame',
              description: 'Bishop endgame techniques',
              requiredTags: ['bishopEndgame'],
              ratingMin: 475,
              ratingMax: 800,
              minPlays: 100,
            },
          ],
        },
        // Section 12: Block 3 Review
        {
          id: 'sec-12',
          name: 'Review: Endgames',
          description: 'Mixed endgame practice',
          themeIntroMessage: `Time to prove you can convert.

Rook endgames, pawn endgames, minor pieces - it's all here. Find the winning technique.`,
          isReview: true,
          lessons: [
            {
              id: '1.12.1',
              name: 'Review: Rook Endings',
              description: 'Rook endgame mastery',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame'],
              ratingMin: 400,
              ratingMax: 800,
              minPlays: 100,
            },
            {
              id: '1.12.2',
              name: 'Review: Pawn Endings',
              description: 'King and pawn mastery',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pawnEndgame', 'promotion'],
              ratingMin: 400,
              ratingMax: 800,
              minPlays: 100,
            },
            {
              id: '1.12.3',
              name: 'Review: Minor Pieces',
              description: 'Knight and bishop mastery',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['knightEndgame', 'bishopEndgame'],
              ratingMin: 400,
              ratingMax: 800,
              minPlays: 100,
            },
            {
              id: '1.12.4',
              name: 'Review: All Endgames',
              description: 'Mixed endgame mastery',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame', 'pawnEndgame', 'knightEndgame', 'bishopEndgame'],
              ratingMin: 400,
              ratingMax: 800,
              minPlays: 100,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 4: FINAL REVIEW (2 sections only)
    // "Prove Yourself"
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-4',
      name: 'Display Your Strength',
      description: 'Final mixed practice - prove your mastery',
      blockIntroMessage: `The final boss awaits.

Everything you've learned - checkmates, tactics, endgames - all mixed together. Just like a real game.

Prove you've been paying attention. Pass this, and you're ready for Level 2.`,
      sections: [
        // Section 13: Level 1 Review
        {
          id: 'sec-13',
          name: 'Level 1 Review',
          description: 'Mixed practice from all blocks',
          themeIntroMessage: `Time to put it all together.

Checkmates, tactics, endgames - anything goes. Figure out what the position needs.`,
          isReview: true,
          lessons: [
            {
              id: '1.13.1',
              name: 'Mixed: Checkmates',
              description: 'Find the mate',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn1', 'mateIn2', 'backRankMate', 'smotheredMate'],
              ratingMin: 400,
              ratingMax: 600,
              minPlays: 500,
            },
            {
              id: '1.13.2',
              name: 'Mixed: Tactics',
              description: 'Win material',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'pin', 'skewer', 'hangingPiece'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 400,
              ratingMax: 700,
              minPlays: 500,
            },
            {
              id: '1.13.3',
              name: 'Mixed: Endgames',
              description: 'Convert your advantage',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame', 'pawnEndgame', 'knightEndgame'],
              ratingMin: 400,
              ratingMax: 800,
              minPlays: 100,
            },
            {
              id: '1.13.4',
              name: 'Mixed: Everything',
              description: 'All Level 1 themes',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn1', 'fork', 'pin', 'crushing', 'rookEndgame'],
              ratingMin: 400,
              ratingMax: 750,
              minPlays: 500,
            },
          ],
        },
        // Section 14: Level 1 Final
        {
          id: 'sec-14',
          name: 'Level 1 Final',
          description: 'The ultimate test',
          themeIntroMessage: `The final challenge.

Everything at once. You've got this.`,
          isReview: true,
          lessons: [
            {
              id: '1.14.1',
              name: 'Final: Mates & Patterns',
              description: 'Checkmates and mating patterns',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn1', 'mateIn2', 'smotheredMate', 'arabianMate', 'hookMate'],
              ratingMin: 400,
              ratingMax: 650,
              minPlays: 500,
            },
            {
              id: '1.14.2',
              name: 'Final: Winning Material',
              description: 'All tactical patterns',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'pin', 'skewer', 'hangingPiece', 'crushing'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 450,
              ratingMax: 750,
              minPlays: 500,
            },
            {
              id: '1.14.3',
              name: 'Final: Converting',
              description: 'Endgames and advanced tactics',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame', 'pawnEndgame', 'deflection', 'trappedPiece'],
              ratingMin: 450,
              ratingMax: 800,
              minPlays: 100,
            },
            {
              id: '1.14.4',
              name: 'Level 1 Mastery',
              description: 'Prove you\'re ready for Level 2',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn2', 'fork', 'pin', 'skewer', 'crushing', 'discoveredAttack'],
              ratingMin: 500,
              ratingMax: 800,
              minPlays: 500,
            },
          ],
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function getAllSections(): Section[] {
  return level1V2.blocks.flatMap(b => b.sections);
}

export function getAllLessons(): LessonCriteria[] {
  return getAllSections().flatMap(s => s.lessons);
}

export function getLessonById(id: string): LessonCriteria | undefined {
  return getAllLessons().find(l => l.id === id);
}

export function getSectionById(id: string): Section | undefined {
  return getAllSections().find(s => s.id === id);
}

export function getBlockById(id: string): Block | undefined {
  return level1V2.blocks.find(b => b.id === id);
}

export function getLessonCount(): number {
  return getAllLessons().length;
}

export function getSectionCount(): number {
  return getAllSections().length;
}

export function getBlockCount(): number {
  return level1V2.blocks.length;
}

// Stats helper
export function getCurriculumStats() {
  const sections = getAllSections();
  const lessons = getAllLessons();
  const reviewSections = sections.filter(s => s.isReview);
  const contentSections = sections.filter(s => !s.isReview);

  return {
    blocks: level1V2.blocks.length,
    totalSections: sections.length,
    contentSections: contentSections.length,
    reviewSections: reviewSections.length,
    totalLessons: lessons.length,
    totalPuzzles: lessons.length * 6,
    averageLessonsPerSection: (lessons.length / sections.length).toFixed(1),
  };
}

// ═══════════════════════════════════════════════════════════════
// INTRO MESSAGE HELPERS
// ═══════════════════════════════════════════════════════════════

export interface IntroMessages {
  blockIntro?: {
    title: string;
    message: string;
  };
  themeIntro?: {
    title: string;
    message: string;
  };
}

/**
 * Get the block and section for a given lesson ID
 */
export function getLessonContext(lessonId: string): { block: Block; section: Section } | null {
  for (const block of level1V2.blocks) {
    for (const section of block.sections) {
      const lesson = section.lessons.find(l => l.id === lessonId);
      if (lesson) {
        return { block, section };
      }
    }
  }
  return null;
}

/**
 * Check if a lesson is the first in its block
 */
export function isFirstLessonInBlock(lessonId: string): boolean {
  const context = getLessonContext(lessonId);
  if (!context) return false;

  const { block } = context;
  const firstSection = block.sections[0];
  if (!firstSection || firstSection.lessons.length === 0) return false;

  return firstSection.lessons[0].id === lessonId;
}

/**
 * Check if a lesson is the first in its section
 */
export function isFirstLessonInSection(lessonId: string): boolean {
  const context = getLessonContext(lessonId);
  if (!context) return false;

  const { section } = context;
  if (section.lessons.length === 0) return false;

  return section.lessons[0].id === lessonId;
}

/**
 * Get intro messages to show for a lesson
 * Returns block intro if first in block, theme intro if first in section
 */
export function getIntroMessages(lessonId: string): IntroMessages {
  const context = getLessonContext(lessonId);
  if (!context) return {};

  const { block, section } = context;
  const messages: IntroMessages = {};

  // Check if first lesson in block
  if (isFirstLessonInBlock(lessonId) && block.blockIntroMessage) {
    messages.blockIntro = {
      title: block.name,
      message: block.blockIntroMessage,
    };
  }

  // Check if first lesson in section
  if (isFirstLessonInSection(lessonId) && section.themeIntroMessage) {
    messages.themeIntro = {
      title: section.name,
      message: section.themeIntroMessage,
    };
  }

  return messages;
}
