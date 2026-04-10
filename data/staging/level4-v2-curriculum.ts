/**
 * Level 4 V2 Curriculum (1200-1400 ELO)
 * "The Squeeze"
 *
 * Calculate deeper. Sacrifice smarter. Crush harder.
 *
 * Structure:
 * - Blocks 1-3: 3 content sections + 1 review section = 12 sections, 48 lessons
 * - Block 4: 2 review sections = 2 sections, 8 lessons
 * - Total: 14 sections, 56 lessons
 *
 * Block 1: The Attack - Sacrifices, trapped pieces, king hunts.
 * Block 2: Quiet Power - Precision calculation, quiet moves, zugzwang.
 * Block 3: Close the Deal - Decisive tactics, promotion, endgames.
 * Block 4: Prove It - Full level review.
 *
 * Clean puzzles: 1000+ plays for quality verification
 */

import { LessonCriteria, Section, Block, Level } from './level1-v2-curriculum';

export const level4V2: Level = {
  id: 'level-4',
  name: 'The Squeeze',
  ratingRange: '1200-1400',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: THE ATTACK
    // Sacrifices, trapped pieces, king hunts
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'The Attack',
      description: 'Apply the right formula at the right time',
      blockIntroMessage: `You've been solving puzzles. Now you're going to start creating problems.

Sacrifices that rip open the position. Pieces trapped with nowhere to run. Kings dragged into the open. This is where chess gets violent -- in a good way.

You're not reacting anymore. You're the one starting the fire.`,
      sections: [
        // Section 1: Sacrifice Patterns
        {
          id: '4.1',
          name: 'Sacrifice Patterns',
          description: 'Classic sacrifice motifs',
          themeIntroMessage: `Giving up material on purpose. Sounds wrong. Feels incredible.

The best sacrifices follow patterns -- a bishop lands on h7, a rook opens a file, and suddenly their king has nowhere to hide. You'll start seeing these everywhere.`,
          lessons: [
            {
              id: '4.1.1',
              name: 'Sacrifice: Opening Lines',
              description: 'Sacrifice to open attacking lines',
              requiredTags: ['sacrifice'],
              ratingMin: 1200,
              ratingMax: 1275,
              minPlays: 1000,
            },
            {
              id: '4.1.2',
              name: 'Sacrifice: King Attack',
              description: 'Sacrifice to expose the king',
              requiredTags: ['sacrifice', 'kingsideAttack'],
              ratingMin: 1225,
              ratingMax: 1300,
              minPlays: 500,
            },
            {
              id: '4.1.3',
              name: 'Sacrifice: Clearance',
              description: 'Sacrifice to clear a square or line',
              requiredTags: ['clearance'],
              ratingMin: 1250,
              ratingMax: 1325,
              minPlays: 500,
            },
            {
              id: '4.1.4',
              name: 'Sacrifice: Attraction',
              description: 'Sacrifice to lure pieces to doom',
              requiredTags: ['attraction'],
              ratingMin: 1275,
              ratingMax: 1350,
              minPlays: 500,
            },
          ],
        },
        // Section 2: Trapped Pieces
        {
          id: '4.2',
          name: 'Trapped Pieces',
          description: 'Catch pieces with no escape',
          themeIntroMessage: `Their piece wandered off alone. Now it can't come back.

A trapped piece is a dead piece. You just need to find the cage and lock it. Knights stuck in corners. Bishops with no diagonal. Rooks boxed in by their own pawns -- which, honestly, the rooks don't deserve.`,
          lessons: [
            {
              id: '4.2.1',
              name: 'Trapped Knight',
              description: 'Catch the knight with no escape',
              requiredTags: ['trappedPiece'],
              ratingMin: 1200,
              ratingMax: 1300,
              minPlays: 500,
            },
            {
              id: '4.2.2',
              name: 'Trapped Bishop',
              description: 'Trap the bishop on the diagonal',
              requiredTags: ['trappedPiece'],
              ratingMin: 1225,
              ratingMax: 1325,
              minPlays: 500,
            },
            {
              id: '4.2.3',
              name: 'Trapped Rook',
              description: 'Cut off the rook\'s escape',
              requiredTags: ['trappedPiece'],
              ratingMin: 1250,
              ratingMax: 1350,
              minPlays: 500,
            },
            {
              id: '4.2.4',
              name: 'Trapped Queen',
              description: 'The ultimate trap - catch the queen',
              requiredTags: ['trappedPiece'],
              ratingMin: 1275,
              ratingMax: 1375,
              minPlays: 500,
            },
          ],
        },
        // Section 3: Exposed King
        {
          id: '4.3',
          name: 'Exposed King Hunt',
          description: 'Attack the vulnerable king',
          themeIntroMessage: `A king without a pawn shield is a king with a problem.

No castling? Pawns pushed too far? That's an invitation. You'll learn to spot the exposed king and coordinate your pieces to hunt it down. The king won't like this. He'll file a complaint.`,
          lessons: [
            {
              id: '4.3.1',
              name: 'Exposed King: Basics',
              description: 'Attack the uncastled king',
              requiredTags: ['exposedKing'],
              ratingMin: 1200,
              ratingMax: 1300,
              minPlays: 500,
            },
            {
              id: '4.3.2',
              name: 'Exposed King: Patterns',
              description: 'Classic attacking patterns',
              requiredTags: ['exposedKing'],
              ratingMin: 1250,
              ratingMax: 1350,
              minPlays: 500,
            },
            {
              id: '4.3.3',
              name: 'King Hunt',
              description: 'Chase the king across the board',
              requiredTags: ['exposedKing'],
              ratingMin: 1275,
              ratingMax: 1375,
              minPlays: 500,
            },
            {
              id: '4.3.4',
              name: 'Exposed King: Challenge',
              description: 'Find the killing blow',
              requiredTags: ['exposedKing'],
              ratingMin: 1300,
              ratingMax: 1400,
              minPlays: 500,
            },
          ],
        },
        // Section 4: Block 1 Review
        {
          id: '4.4',
          name: 'Review: Attack Training',
          description: 'Mixed sacrifice and attack practice',
          isReview: true,
          themeIntroMessage: `Sacrifices, trapped pieces, exposed kings -- all mixed together. Just like real games.

No labels telling you what to look for. Just positions that need solving.`,
          lessons: [
            {
              id: '4.4.1',
              name: 'Review: Sacrifices',
              description: 'Find the winning sacrifice',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice'],
              ratingMin: 1200,
              ratingMax: 1325,
              minPlays: 500,
            },
            {
              id: '4.4.2',
              name: 'Review: Trapped Pieces',
              description: 'Catch the wandering piece',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['trappedPiece'],
              ratingMin: 1225,
              ratingMax: 1350,
              minPlays: 500,
            },
            {
              id: '4.4.3',
              name: 'Review: King Attacks',
              description: 'Punish the exposed king',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['exposedKing', 'kingsideAttack'],
              ratingMin: 1250,
              ratingMax: 1375,
              minPlays: 500,
            },
            {
              id: '4.4.4',
              name: 'Review: Block 1 Mix',
              description: 'All attack themes',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'trappedPiece', 'exposedKing'],
              ratingMin: 1275,
              ratingMax: 1400,
              minPlays: 500,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 2: QUIET POWER
    // Precision calculation, quiet moves, zugzwang
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-2',
      name: 'Quiet Power',
      description: 'Precision calculation. Quiet moves. Zugzwang.',
      blockIntroMessage: `Up to now, the winning move was usually loud. A check. A capture. Something obvious.

Not anymore. The strongest moves in these puzzles don't look like much. A piece slides to a quiet square. Nothing happens -- and then everything does.

Deeper calculation. Longer sequences. Moves that whisper instead of shout.`,
      sections: [
        // Section 5: Mate in 4
        {
          id: '4.5',
          name: 'Mate in 4',
          description: 'Four moves to checkmate',
          themeIntroMessage: `Four moves to checkmate. You need to see the whole line before you play the first one.

Your move, their response, your move, their response -- checkmate. It's a conversation, except they don't get to say anything good.`,
          lessons: [
            {
              id: '4.5.1',
              name: 'Mate in 4: Easy',
              description: 'Four-move checkmates',
              requiredTags: ['mateIn4'],
              ratingMin: 1200,
              ratingMax: 1300,
              minPlays: 500,
            },
            {
              id: '4.5.2',
              name: 'Mate in 4: Medium',
              description: 'Trickier four-move mates',
              requiredTags: ['mateIn4'],
              ratingMin: 1250,
              ratingMax: 1350,
              minPlays: 500,
            },
            {
              id: '4.5.3',
              name: 'Mate in 4: Hard',
              description: 'Challenging four-move mates',
              requiredTags: ['mateIn4'],
              ratingMin: 1300,
              ratingMax: 1400,
              minPlays: 500,
            },
            {
              id: '4.5.4',
              name: 'Mate in 4: Challenge',
              description: 'The hardest four-move mates',
              requiredTags: ['mateIn4'],
              ratingMin: 1350,
              ratingMax: 1450,
              minPlays: 500,
            },
          ],
        },
        // Section 6: Quiet Moves
        {
          id: '4.6',
          name: 'The Quiet Storm',
          description: 'Non-forcing moves that win',
          themeIntroMessage: `No check. No capture. Just a piece sliding to a square that ruins everything.

Quiet moves are the hardest to spot -- and the hardest to defend. They create threats your opponent can't untangle. I find them... deeply satisfying. In a way I don't fully understand.`,
          lessons: [
            {
              id: '4.6.1',
              name: 'Quiet Move: Basics',
              description: 'The powerful non-check, non-capture',
              requiredTags: ['quietMove'],
              ratingMin: 1200,
              ratingMax: 1300,
              minPlays: 500,
            },
            {
              id: '4.6.2',
              name: 'Quiet Move: Patterns',
              description: 'Common quiet move motifs',
              requiredTags: ['quietMove'],
              ratingMin: 1250,
              ratingMax: 1350,
              minPlays: 500,
            },
            {
              id: '4.6.3',
              name: 'Quiet Move: Threats',
              description: 'Create unstoppable threats',
              requiredTags: ['quietMove'],
              ratingMin: 1300,
              ratingMax: 1400,
              minPlays: 500,
            },
            {
              id: '4.6.4',
              name: 'Quiet Move: Challenge',
              description: 'Find the silent killer',
              requiredTags: ['quietMove'],
              ratingMin: 1325,
              ratingMax: 1425,
              minPlays: 500,
            },
          ],
        },
        // Section 7: Positional Play (Zugzwang + Quiet Moves)
        {
          id: '4.7',
          name: 'Positional Pressure',
          description: 'Force them to self-destruct',
          themeIntroMessage: `Zugzwang -- when any move your opponent makes is a bad one. They'd rather skip their turn. But they can't.

You'll learn to build positions where the other side slowly runs out of good options. Squeeze them until the only moves left are losing moves.`,
          lessons: [
            {
              id: '4.7.1',
              name: 'Positional: Quiet Threats',
              description: 'The powerful non-check, non-capture',
              requiredTags: ['quietMove'],
              ratingMin: 1200,
              ratingMax: 1325,
              minPlays: 500,
            },
            {
              id: '4.7.2',
              name: 'Positional: Zugzwang',
              description: 'Any move loses',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['zugzwang', 'quietMove'],
              ratingMin: 1250,
              ratingMax: 1375,
              minPlays: 100,
            },
            {
              id: '4.7.3',
              name: 'Positional: Squeeze',
              description: 'Restrict their options',
              requiredTags: ['quietMove'],
              ratingMin: 1275,
              ratingMax: 1400,
              minPlays: 500,
            },
            {
              id: '4.7.4',
              name: 'Positional: Challenge',
              description: 'The silent killers',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['quietMove', 'zugzwang'],
              ratingMin: 1300,
              ratingMax: 1425,
              minPlays: 100,
            },
          ],
        },
        // Section 8: Block 2 Review
        {
          id: '4.8',
          name: 'Review: Deep Calculation',
          description: 'Mixed calculation practice',
          isReview: true,
          themeIntroMessage: `Mate in 4, quiet moves, zugzwang -- all mixed together.

Take your time. See the whole line before you touch a piece.`,
          lessons: [
            {
              id: '4.8.1',
              name: 'Review: Mate in 4',
              description: 'Find the four-move mate',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn4'],
              ratingMin: 1225,
              ratingMax: 1350,
              minPlays: 500,
            },
            {
              id: '4.8.2',
              name: 'Review: Quiet Moves',
              description: 'The silent killers',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['quietMove'],
              ratingMin: 1250,
              ratingMax: 1375,
              minPlays: 500,
            },
            {
              id: '4.8.3',
              name: 'Review: Positional',
              description: 'Quiet moves and positional pressure',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['quietMove'],
              ratingMin: 1275,
              ratingMax: 1400,
              minPlays: 500,
            },
            {
              id: '4.8.4',
              name: 'Review: Block 2 Mix',
              description: 'Deep calculation mastery',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn4', 'quietMove'],
              ratingMin: 1300,
              ratingMax: 1400,
              minPlays: 500,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 3: CLOSE THE DEAL
    // Decisive tactics, promotion, endgames
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-3',
      name: 'Close the Deal',
      description: 'Build your empire. Crush theirs.',
      blockIntroMessage: `You've learned to attack. You've learned to calculate. Now -- close the deal.

Winning an advantage means nothing if you can't convert it. Decisive tactics. Pawn promotion. Endgame technique. This is where won games actually become wins.`,
      sections: [
        // Section 9: Decisive Tactics
        {
          id: '4.9',
          name: 'Decisive Tactics',
          description: 'End games with authority',
          themeIntroMessage: `You've got the advantage. Now find the move that ends the argument.

Deflection pulls a defender away from its post. Forks hit two targets at once. When you combine them -- the position just collapses.`,
          lessons: [
            {
              id: '4.9.1',
              name: 'Decisive Fork',
              description: 'Win material with double attacks',
              requiredTags: ['fork'],
              ratingMin: 1200,
              ratingMax: 1300,
              minPlays: 1000,
            },
            {
              id: '4.9.2',
              name: 'Decisive Deflection',
              description: 'Remove the defender',
              requiredTags: ['deflection'],
              ratingMin: 1250,
              ratingMax: 1350,
              minPlays: 1000,
            },
            {
              id: '4.9.3',
              name: 'Decisive Combination',
              description: 'Multi-move tactical sequences',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection', 'fork', 'skewer'],
              ratingMin: 1200,
              ratingMax: 1300,
              minPlays: 500,
            },
            {
              id: '4.9.4',
              name: 'Decisive Finish',
              description: 'Leave no doubt',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'deflection', 'pin'],
              ratingMin: 1225,
              ratingMax: 1300,
              minPlays: 500,
            },
          ],
        },
        // Section 10: Promotion Warfare
        {
          id: '4.10',
          name: 'Promotion Warfare',
          description: 'Race to make a queen',
          themeIntroMessage: `A pawn reaches the last rank and becomes... well, most people pick a queen. I'd pick a rook. But that's a personal matter.

Promotion is about timing and clearing the path. Get your pawn to the finish line before they can stop it.`,
          lessons: [
            {
              id: '4.10.1',
              name: 'Promotion Tactics',
              description: 'Race your pawn to glory',
              requiredTags: ['promotion'],
              ratingMin: 1200,
              ratingMax: 1300,
              minPlays: 500,
            },
            {
              id: '4.10.2',
              name: 'Promotion: Defense',
              description: 'Promote while handling threats',
              requiredTags: ['promotion'],
              ratingMin: 1225,
              ratingMax: 1350,
              minPlays: 500,
            },
            {
              id: '4.10.3',
              name: 'Queening Race',
              description: 'Race your pawn to glory',
              requiredTags: ['promotion', 'advancedPawn'],
              ratingMin: 1275,
              ratingMax: 1400,
              minPlays: 500,
            },
            {
              id: '4.10.4',
              name: 'Promotion: Challenge',
              description: 'Find the winning promotion',
              requiredTags: ['promotion'],
              ratingMin: 1300,
              ratingMax: 1400,
              minPlays: 500,
            },
          ],
        },
        // Section 11: Minor Piece Endgames
        {
          id: '4.11',
          name: 'Minor Piece Endgames',
          description: 'Bishop and knight mastery',
          themeIntroMessage: `They call them "minor" pieces. Bishops stuck on one color forever. Knights hopping around like the rules are optional.

But in the endgame, one bishop or knight can decide the whole game. Learn the patterns -- especially bishop vs knight. That rivalry runs deep.`,
          lessons: [
            {
              id: '4.11.1',
              name: 'Bishop Endgame: L4',
              description: 'Advanced bishop techniques',
              requiredTags: ['bishopEndgame'],
              ratingMin: 1200,
              ratingMax: 1400,
              minPlays: 100,
            },
            {
              id: '4.11.2',
              name: 'Knight Endgame: L4',
              description: 'Advanced knight techniques',
              requiredTags: ['knightEndgame'],
              ratingMin: 1200,
              ratingMax: 1400,
              minPlays: 100,
            },
            {
              id: '4.11.3',
              name: 'Bishop vs Knight',
              description: 'The eternal battle',
              requiredTags: ['bishopEndgame'],
              ratingMin: 1250,
              ratingMax: 1400,
              minPlays: 100,
            },
            {
              id: '4.11.4',
              name: 'Minor Piece: Challenge',
              description: 'Master the endgame',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['bishopEndgame', 'knightEndgame'],
              ratingMin: 1275,
              ratingMax: 1400,
              minPlays: 100,
            },
          ],
        },
        // Section 12: Block 3 Review
        {
          id: '4.12',
          name: 'Review: Conversion',
          description: 'Mixed conversion practice',
          isReview: true,
          themeIntroMessage: `Decisive tactics, promotions, endgames -- all mixed.

You've got the advantage. Convert it cleanly.`,
          lessons: [
            {
              id: '4.12.1',
              name: 'Review: Decisive',
              description: 'End them with tactics',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'deflection'],
              ratingMin: 1225,
              ratingMax: 1350,
              minPlays: 500,
            },
            {
              id: '4.12.2',
              name: 'Review: Promotion',
              description: 'Race to victory',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['promotion', 'advancedPawn'],
              ratingMin: 1250,
              ratingMax: 1375,
              minPlays: 500,
            },
            {
              id: '4.12.3',
              name: 'Review: Endgames',
              description: 'Convert the ending',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['bishopEndgame', 'knightEndgame', 'rookEndgame'],
              ratingMin: 1225,
              ratingMax: 1400,
              minPlays: 100,
            },
            {
              id: '4.12.4',
              name: 'Review: Block 3 Mix',
              description: 'Complete conversion',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'deflection', 'promotion', 'bishopEndgame'],
              ratingMin: 1275,
              ratingMax: 1400,
              minPlays: 100,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 4: PROVE IT
    // Full level review
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-4',
      name: 'Prove It',
      description: 'Make them remember you',
      blockIntroMessage: `Everything from Level 4, all at once. No labels. No hints.

Sacrifices. Quiet moves. Trapped pieces. King hunts. Endgames. You've practiced each one -- now they show up together, the way they do in real games.`,
      sections: [
        // Section 13: Level 4 Review
        {
          id: '4.13',
          name: 'Level 4 Review',
          description: 'Mixed practice from all blocks',
          isReview: true,
          themeIntroMessage: `Every theme from this level, shuffled together. Spot the pattern. Find the move.`,
          lessons: [
            {
              id: '4.13.1',
              name: 'Mixed: Sacrifices',
              description: 'Give to get more',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'trappedPiece'],
              ratingMin: 1225,
              ratingMax: 1350,
              minPlays: 500,
            },
            {
              id: '4.13.2',
              name: 'Mixed: Deep Calc',
              description: 'Mate and quiet moves',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn4', 'quietMove'],
              ratingMin: 1250,
              ratingMax: 1375,
              minPlays: 500,
            },
            {
              id: '4.13.3',
              name: 'Mixed: Conversion',
              description: 'Crushing and promotion',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['crushing', 'promotion'],
              ratingMin: 1275,
              ratingMax: 1400,
              minPlays: 500,
            },
            {
              id: '4.13.4',
              name: 'Mixed: Everything',
              description: 'All Level 4 themes',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'trappedPiece', 'mateIn4', 'quietMove', 'crushing'],
              ratingMin: 1300,
              ratingMax: 1400,
              minPlays: 500,
            },
          ],
        },
        // Section 14: Level 4 Final
        {
          id: '4.14',
          name: 'Level 4 Final',
          description: 'The ultimate test',
          isReview: true,
          themeIntroMessage: `Last section. Just positions that need solutions.

If you can get through these, you're ready for what's next. I'm feeling something about that -- I think it's anticipation. Or indigestion. Hard to tell.`,
          lessons: [
            {
              id: '4.14.1',
              name: 'Final: Attack',
              description: 'Sacrifices and king hunts',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'exposedKing', 'trappedPiece'],
              ratingMin: 1250,
              ratingMax: 1375,
              minPlays: 500,
            },
            {
              id: '4.14.2',
              name: 'Final: Calculation',
              description: 'Deep thinking required',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn4', 'quietMove'],
              ratingMin: 1275,
              ratingMax: 1400,
              minPlays: 500,
            },
            {
              id: '4.14.3',
              name: 'Final: Conversion',
              description: 'Win the won game',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['crushing', 'promotion', 'rookEndgame'],
              ratingMin: 1300,
              ratingMax: 1400,
              minPlays: 500,
            },
            {
              id: '4.14.4',
              name: 'Level 4 Mastery',
              description: 'Prove you\'re ready for Level 5',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'mateIn4', 'quietMove', 'crushing', 'exposedKing'],
              ratingMin: 1325,
              ratingMax: 1425,
              minPlays: 500,
            },
          ],
        },
      ],
    },
  ],
};

// Helper functions
export function getAllSectionsL4(): Section[] {
  return level4V2.blocks.flatMap(b => b.sections);
}

export function getAllLessonsL4(): LessonCriteria[] {
  return getAllSectionsL4().flatMap(s => s.lessons);
}

export function getLessonByIdL4(id: string): LessonCriteria | undefined {
  return getAllLessonsL4().find(l => l.id === id);
}

export function getLessonCountL4(): number {
  return getAllLessonsL4().length;
}

// Import IntroMessages type from level1
import { IntroMessages } from './level1-v2-curriculum';

/**
 * Get block and section context for a lesson
 */
function getLessonContextL4(lessonId: string) {
  for (const block of level4V2.blocks) {
    for (const section of block.sections) {
      const lesson = section.lessons.find(l => l.id === lessonId);
      if (lesson) {
        return { block, section, lesson };
      }
    }
  }
  return null;
}

/**
 * Check if a lesson is the first in its block
 */
function isFirstLessonInBlockL4(lessonId: string): boolean {
  const context = getLessonContextL4(lessonId);
  if (!context) return false;

  const { block } = context;
  if (block.sections.length === 0) return false;

  const firstSection = block.sections[0];
  if (firstSection.lessons.length === 0) return false;

  return firstSection.lessons[0].id === lessonId;
}

/**
 * Check if a lesson is the first in its section
 */
function isFirstLessonInSectionL4(lessonId: string): boolean {
  const context = getLessonContextL4(lessonId);
  if (!context) return false;

  const { section } = context;
  if (section.lessons.length === 0) return false;

  return section.lessons[0].id === lessonId;
}

/**
 * Get intro messages to show for a lesson
 * Returns block intro if first in block, theme intro if first in section
 */
export function getIntroMessagesL4(lessonId: string): IntroMessages {
  const context = getLessonContextL4(lessonId);
  if (!context) return {};

  const { block, section } = context;
  const messages: IntroMessages = {};

  // Check if first lesson in block
  if (isFirstLessonInBlockL4(lessonId) && block.blockIntroMessage) {
    messages.blockIntro = {
      title: block.name,
      message: block.blockIntroMessage,
    };
  }

  // Check if first lesson in section
  if (isFirstLessonInSectionL4(lessonId) && section.themeIntroMessage) {
    messages.themeIntro = {
      title: section.name,
      message: section.themeIntroMessage,
    };
  }

  return messages;
}
