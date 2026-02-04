/**
 * Level 4 V2 Curriculum (1200-1400 ELO)
 * "I Am the One Who Knocks"
 *
 * You're not in danger. You ARE the danger.
 * Calculate deeper. Sacrifice smarter. Crush harder.
 *
 * Structure:
 * - Blocks 1-3: 3 content sections + 1 review section = 12 sections, 48 lessons
 * - Block 4: 2 review sections = 2 sections, 8 lessons
 * - Total: 14 sections, 56 lessons
 *
 * Block 1: The Cook - Chemistry is change. So is their position.
 * Block 2: 99.1% Pure - Precision calculation. No half measures.
 * Block 3: Empire Business - Build your empire. Crush theirs.
 * Block 4: Say My Name - They'll remember this.
 *
 * Clean puzzles: 1000+ plays for quality verification
 */

import { LessonCriteria, Section, Block, Level } from './level1-v2-curriculum';

export const level4V2: Level = {
  id: 'level-4',
  name: 'Level 4: I Am the One Who Knocks',
  ratingRange: '1200-1400',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: THE COOK
    // "Chemistry is the study of change"
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'The Cook',
      description: 'Apply the right formula at the right time',
      blockIntroMessage: `Welcome to Level 4. You're not in danger. You ARE the danger.

Chemistry is the study of change. And your opponent's position? It's about to change dramatically.

Sacrifices. Trapped pieces. King hunts. You're not reacting anymore. You're the one who knocks.`,
      sections: [
        // Section 1: Sacrifice Patterns
        {
          id: '4.1',
          name: 'Sacrifice Patterns',
          description: 'Classic sacrifice motifs',
          themeIntroMessage: `The best sacrifices aren't improvised - they follow patterns.

Greek gift sacrifice on h7. Bishop sacrifice to open the king. Exchange sacrifice for activity.

Learn the patterns, spot them in your games.`,
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
              requiredTags: ['sacrifice', 'clearance'],
              ratingMin: 1250,
              ratingMax: 1325,
              minPlays: 500,
            },
            {
              id: '4.1.4',
              name: 'Sacrifice: Attraction',
              description: 'Sacrifice to lure pieces to doom',
              requiredTags: ['sacrifice', 'attraction'],
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
          themeIntroMessage: `Your opponent's piece wandered off alone. Time to make sure it never comes back.

Trapped pieces are dead pieces. Find the cage, lock it, collect the material.

Knights in corners. Bishops on long diagonals. Rooks with no retreat.`,
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
          themeIntroMessage: `That king's out in the open. Let's give him a warm welcome.

Exposed kings are target practice. Open lines, active pieces, coordinated attacks.

No castling? No pawn shield? Their problem, your opportunity.`,
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
          themeIntroMessage: `Time to prove you can spot the kill.

Sacrifices, trapped pieces, exposed kings - all mixed together. Just like real games.

No hints. Just vibes. And by vibes, we mean suffering.`,
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
    // BLOCK 2: 99.1% PURE
    // "No half measures"
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-2',
      name: '99.1% Pure',
      description: 'Precision calculation. No half measures.',
      blockIntroMessage: `No half measures, Walter.

Your calculation needs to be pure. Four moves ahead. Five moves ahead. Every variation accounted for.

Quiet moves. Zugzwang. The chemistry of winning chess.`,
      sections: [
        // Section 5: Mate in 4
        {
          id: '4.5',
          name: 'Mate in 4',
          description: 'Four moves to checkmate',
          themeIntroMessage: `Four moves to glory. No pressure.

Mate in 4 requires visualizing three responses. Your move, their move, your move, their move, checkmate.

Take your time. See the whole line before you play.`,
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
          themeIntroMessage: `The deadliest moves don't check or capture. They just... wait.

Quiet moves create unstoppable threats. No check, no capture, but suddenly everything falls apart.

This is advanced chess. See what they can't defend.`,
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
          themeIntroMessage: `Sometimes the deadliest moves don't check or capture. They just... squeeze.

Zugzwang. Quiet moves. Positions where your opponent wishes they could pass.

Force them into a position where any move makes things worse. Then enjoy the show.`,
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
          themeIntroMessage: `Calculate like your rating depends on it. Because it does.

Mate in 4. Quiet moves. Zugzwang. The puzzles that separate players.

Take your time. See everything.`,
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
    // BLOCK 3: EMPIRE BUSINESS
    // "We're not in the money business. We're in the empire business."
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-3',
      name: 'Empire Business',
      description: 'Build your empire. Crush theirs.',
      blockIntroMessage: `You're not in the chess business. You're in the empire business.

You've got the advantage. Now build on it. Expand. Dominate. Leave nothing to chance.

Crushing attacks. Promotion. Endgame technique. This is how empires are built.`,
      sections: [
        // Section 9: Decisive Tactics
        {
          id: '4.9',
          name: 'Decisive Tactics',
          description: 'End games with authority',
          themeIntroMessage: `Winning isn't enough. We want them to feel it.

Deflection removes the defender. Forks attack two things at once. Combined? Unstoppable.

Find the move that breaks them completely.`,
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
          themeIntroMessage: `That pawn's one square away from becoming a queen. Don't let anyone stop it.

Promotion tactics are about timing, defense, and pawn races. Get your pawn to the end before they stop you.

The endgame begins. The queening race is on.`,
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
          themeIntroMessage: `The "minor" pieces doing major work.

Bishop vs knight endgames. Opposite-color bishops. Knight maneuvers.

These endgames have deep theory. Learn the key patterns.`,
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
          themeIntroMessage: `Block 3 review. Decisive tactics, promotions, endgames.

You've got the advantage. Now convert it cleanly.

No second chances.`,
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
    // BLOCK 4: SAY MY NAME
    // "You're goddamn right."
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-4',
      name: 'Say My Name',
      description: 'Make them remember you',
      blockIntroMessage: `You know who you are. Now make them say it.

Every theme from Level 4. Sacrifices. Precision calculation. Empire building.

Complete these puzzles. Prove you're the one who knocks.`,
      sections: [
        // Section 13: Level 4 Review
        {
          id: '4.13',
          name: 'Level 4 Review',
          description: 'Mixed practice from all blocks',
          isReview: true,
          themeIntroMessage: `Everything from Level 4 in one section.

Sacrifices. Trapped pieces. Mate in 4. Quiet moves. Crushing attacks.

The full Level 4 experience. Let's see what you've learned.`,
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
          themeIntroMessage: `The final test. Everything at once.

No hints. No patterns. Just positions that need solutions.

Prove you're ready for the next level.`,
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
