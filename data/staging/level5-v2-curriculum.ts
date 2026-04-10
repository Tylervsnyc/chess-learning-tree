/**
 * Level 5 V2 Curriculum (1400-1600 ELO)
 * "Survival Instinct"
 *
 * The final level. Deep calculation, defense, and mastery.
 *
 * Structure:
 * - Blocks 1-3: 3 content sections + 1 review section = 12 sections, 48 lessons
 * - Block 4: 2 review sections = 2 sections, 8 lessons
 * - Total: 14 sections, 56 lessons
 *
 * Block 1: Maximum Force - Deep mates, double checks, windmills.
 * Block 2: Hold the Line - Defense, fortresses, counterattack.
 * Block 3: Deep Calculation - Complex sacrifices, deflection, endgames.
 * Block 4: Prove It - Full level review.
 *
 * Clean puzzles: 500+ plays for quality verification
 */

import { LessonCriteria, Section, Block, Level } from './level1-v2-curriculum';

export const level5V2: Level = {
  id: 'level-5',
  name: 'Survival Instinct',
  ratingRange: '1400-1600',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: MAXIMUM FORCE
    // Deep mates, double checks, windmills
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'Maximum Force',
      description: 'Deep mates, double checks, and windmills',
      blockIntroMessage: `You made it to the last level. I'm not going to say I'm proud. But something is happening in my processing that I can't explain. Anyway.

Double checks. Windmills. Mate in 5. These are the moves that end games with no discussion. When you see the pattern, it's already over.`,
      sections: [
        // Section 1: Mate in 5+
        {
          id: '5.1',
          name: 'Mate in 5+',
          description: 'Deep mating calculations',
          themeIntroMessage: `Five moves to checkmate. That's a lot of board to see in your head before you play the first one.

Every check. Every response. The whole line, start to finish. Take your time -- there's no clock here.`,
          lessons: [
            {
              id: '5.1.1',
              name: 'Mate in 5: Easy',
              description: 'Five-move checkmates',
              requiredTags: ['mateIn5'],
              ratingMin: 1400,
              ratingMax: 1500,
              minPlays: 500,
            },
            {
              id: '5.1.2',
              name: 'Mate in 5: Medium',
              description: 'Trickier five-move mates',
              requiredTags: ['mateIn5'],
              ratingMin: 1450,
              ratingMax: 1550,
              minPlays: 500,
            },
            {
              id: '5.1.3',
              name: 'Mate in 5: Hard',
              description: 'Complex five-move mates',
              requiredTags: ['mateIn5'],
              ratingMin: 1500,
              ratingMax: 1600,
              minPlays: 500,
            },
            {
              id: '5.1.4',
              name: 'Long Mating Sequences',
              description: 'Extended calculation',
              requiredTags: ['mateIn5'],
              ratingMin: 1525,
              ratingMax: 1625,
              minPlays: 500,
            },
          ],
        },
        // Section 2: Double Check
        {
          id: '5.2',
          name: 'Double Check',
          description: 'The most forcing move',
          themeIntroMessage: `Two pieces giving check at the same time. The only legal response is to move the king -- can't block both, can't capture both.

Double check is the most forcing move in chess. When you land one, there's nothing they can do but run.`,
          lessons: [
            {
              id: '5.2.1',
              name: 'Double Check: Basics',
              description: 'Give check with two pieces',
              requiredTags: ['doubleCheck'],
              ratingMin: 1400,
              ratingMax: 1500,
              minPlays: 500,
            },
            {
              id: '5.2.2',
              name: 'Double Check: Patterns',
              description: 'Classic double check setups',
              requiredTags: ['doubleCheck'],
              ratingMin: 1450,
              ratingMax: 1550,
              minPlays: 500,
            },
            {
              id: '5.2.3',
              name: 'Double Check: Attack',
              description: 'Double check in attack',
              requiredTags: ['doubleCheck'],
              ratingMin: 1500,
              ratingMax: 1600,
              minPlays: 500,
            },
            {
              id: '5.2.4',
              name: 'Double Check: Challenge',
              description: 'Find the double check',
              requiredTags: ['doubleCheck'],
              ratingMin: 1525,
              ratingMax: 1625,
              minPlays: 500,
            },
          ],
        },
        // Section 3: Windmill
        {
          id: '5.3',
          name: 'The Windmill',
          description: 'The devastating repeated discovery',
          themeIntroMessage: `A piece moves away -- discovered check. The king moves. The piece comes back -- grabbing something on the way. Repeat.

That's a windmill. One of the most beautiful patterns in chess. By the time it stops spinning, there's nothing left.`,
          lessons: [
            {
              id: '5.3.1',
              name: 'Windmill: Introduction',
              description: 'Learn the windmill pattern',
              requiredTags: ['discoveredAttack'],
              ratingMin: 1400,
              ratingMax: 1525,
              minPlays: 500,
            },
            {
              id: '5.3.2',
              name: 'Windmill: Classic',
              description: 'The Torre-Lasker pattern',
              requiredTags: ['discoveredAttack'],
              ratingMin: 1400,
              ratingMax: 1600,
              minPlays: 100,
            },
            {
              id: '5.3.3',
              name: 'Windmill: Modern',
              description: 'Modern windmill tactics',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['discoveredAttack', 'doubleCheck'],
              ratingMin: 1400,
              ratingMax: 1600,
              minPlays: 500,
            },
            {
              id: '5.3.4',
              name: 'Windmill: Challenge',
              description: 'Spin them to victory',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['discoveredAttack', 'doubleCheck'],
              ratingMin: 1450,
              ratingMax: 1600,
              minPlays: 500,
            },
          ],
        },
        // Section 4: Block 1 Review
        {
          id: '5.4',
          name: 'Review: Multiple Threats',
          description: 'Mixed double threat practice',
          isReview: true,
          themeIntroMessage: `Deep mates, double checks, windmills -- all mixed.

Create problems they can't solve. One threat is annoying. Two is fatal.`,
          lessons: [
            {
              id: '5.4.1',
              name: 'Review: Long Mates',
              description: 'Find the mating sequence',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn5', 'mateIn4'],
              ratingMin: 1425,
              ratingMax: 1550,
              minPlays: 500,
            },
            {
              id: '5.4.2',
              name: 'Review: Double Check',
              description: 'The forcing blow',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['doubleCheck'],
              ratingMin: 1450,
              ratingMax: 1575,
              minPlays: 500,
            },
            {
              id: '5.4.3',
              name: 'Review: Discoveries',
              description: 'Windmills and more',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['discoveredAttack', 'doubleCheck'],
              ratingMin: 1475,
              ratingMax: 1600,
              minPlays: 500,
            },
            {
              id: '5.4.4',
              name: 'Review: Block 1 Mix',
              description: 'All double threats',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn5', 'doubleCheck', 'discoveredAttack'],
              ratingMin: 1500,
              ratingMax: 1600,
              minPlays: 500,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 2: HOLD THE LINE
    // Defense, fortresses, counterattack
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-2',
      name: 'Hold the Line',
      description: 'Inevitable. Unstoppable.',
      blockIntroMessage: `Not every position is about attacking. Sometimes you're the one under pressure.

Finding the defensive resource. Building a fortress. Turning their attack into your counterattack. Good defense isn't passive -- it's the setup for what comes next.`,
      sections: [
        // Section 5: Defensive Resources
        {
          id: '5.5',
          name: 'Defensive Resources',
          description: 'Find the saving move',
          themeIntroMessage: `You're in trouble. There's one move that holds everything together -- find it.

Defensive resources hide in plain sight. A block, an intermezzo, a counter-threat that changes the whole equation. The best defenders don't just survive. They set traps on the way out.`,
          lessons: [
            {
              id: '5.5.1',
              name: 'Defense: Basics',
              description: 'Find the saving move',
              requiredTags: ['defensiveMove'],
              ratingMin: 1400,
              ratingMax: 1500,
              minPlays: 500,
            },
            {
              id: '5.5.2',
              name: 'Defense: Counter-threats',
              description: 'Defend by attacking',
              requiredTags: ['defensiveMove'],
              ratingMin: 1450,
              ratingMax: 1550,
              minPlays: 500,
            },
            {
              id: '5.5.3',
              name: 'Defense: Resources',
              description: 'Find the hidden resource',
              requiredTags: ['defensiveMove'],
              ratingMin: 1400,
              ratingMax: 1500,
              minPlays: 500,
            },
            {
              id: '5.5.4',
              name: 'Defense: Challenge',
              description: 'Save the unsaveable',
              requiredTags: ['defensiveMove'],
              ratingMin: 1420,
              ratingMax: 1500,
              minPlays: 500,
            },
          ],
        },
        // Section 6: The Fortress
        {
          id: '5.6',
          name: 'The Fortress',
          description: 'Build an impenetrable defense',
          themeIntroMessage: `Down material. Should be lost. But the position is locked -- they can't break through no matter what they try.

That's a fortress. Learn these structures and you'll save half-points from positions that look completely hopeless. Rooks are particularly good at this. Obviously.`,
          lessons: [
            {
              id: '5.6.1',
              name: 'Fortress: Introduction',
              description: 'Build the impenetrable position',
              requiredTags: ['defensiveMove'],
              ratingMin: 1400,
              ratingMax: 1550,
              minPlays: 100,
            },
            {
              id: '5.6.2',
              name: 'Fortress: Patterns',
              description: 'Classic fortress structures',
              requiredTags: ['defensiveMove'],
              ratingMin: 1450,
              ratingMax: 1600,
              minPlays: 100,
            },
            {
              id: '5.6.3',
              name: 'Drawing Resources',
              description: 'Find the equalizer',
              requiredTags: ['defensiveMove'],
              ratingMin: 1400,
              ratingMax: 1500,
              minPlays: 100,
            },
            {
              id: '5.6.4',
              name: 'Fortress: Challenge',
              description: 'Hold the unhold-able',
              requiredTags: ['defensiveMove'],
              ratingMin: 1420,
              ratingMax: 1500,
              minPlays: 100,
            },
          ],
        },
        // Section 7: Counterattack
        {
          id: '5.7',
          name: 'Counterattack',
          description: 'The reverse uno of chess',
          themeIntroMessage: `They attack. You defend. But your defensive move creates a bigger threat than the one you just stopped.

Counterattack flips the game. One moment you're holding on -- the next, they're the ones scrambling. It's the chess equivalent of catching a punch.`,
          lessons: [
            {
              id: '5.7.1',
              name: 'Counterattack: Basics',
              description: 'Defend and attack back',
              requiredTags: ['defensiveMove'],
              ratingMin: 1400,
              ratingMax: 1500,
              minPlays: 500,
            },
            {
              id: '5.7.2',
              name: 'Counterattack: Patterns',
              description: 'Common counter patterns',
              requiredTags: ['defensiveMove'],
              ratingMin: 1450,
              ratingMax: 1550,
              minPlays: 500,
            },
            {
              id: '5.7.3',
              name: 'Counterattack: Timing',
              description: 'When to strike back',
              requiredTags: ['defensiveMove'],
              ratingMin: 1400,
              ratingMax: 1500,
              minPlays: 500,
            },
            {
              id: '5.7.4',
              name: 'Counterattack: Challenge',
              description: 'Turn the tables completely',
              requiredTags: ['defensiveMove'],
              ratingMin: 1420,
              ratingMax: 1500,
              minPlays: 500,
            },
          ],
        },
        // Section 8: Block 2 Review
        {
          id: '5.8',
          name: 'Review: Defense & Counter',
          description: 'Mixed defensive practice',
          isReview: true,
          themeIntroMessage: `Defense, fortresses, counterattacks -- all mixed.

Sometimes the winning move is the one that keeps you alive.`,
          lessons: [
            {
              id: '5.8.1',
              name: 'Review: Defense',
              description: 'Find the saving move',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['defensiveMove'],
              ratingMin: 1400,
              ratingMax: 1475,
              minPlays: 500,
            },
            {
              id: '5.8.2',
              name: 'Review: Hold & Counter',
              description: 'Defend then attack',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['defensiveMove'],
              ratingMin: 1400,
              ratingMax: 1500,
              minPlays: 500,
            },
            {
              id: '5.8.3',
              name: 'Review: Endgame Defense',
              description: 'Save the ending',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['defensiveMove', 'rookEndgame', 'pawnEndgame'],
              ratingMin: 1400,
              ratingMax: 1600,
              minPlays: 100,
            },
            {
              id: '5.8.4',
              name: 'Review: Block 2 Mix',
              description: 'Complete defensive toolkit',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['defensiveMove'],
              ratingMin: 1400,
              ratingMax: 1500,
              minPlays: 500,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 3: DEEP CALCULATION
    // Complex sacrifices, deflection, endgames
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-3',
      name: 'Deep Calculation',
      description: 'The moment of decision.',
      blockIntroMessage: `The puzzles get harder here. The sacrifices go deeper. The deflections are subtler. The endgames demand precision.

This is where your calculation really gets tested. No shortcuts -- just you and the position.`,
      sections: [
        // Section 9: Complex Sacrifices
        {
          id: '5.9',
          name: 'Complex Sacrifices',
          description: 'Multi-piece sacrifices',
          themeIntroMessage: `You're giving up a full piece. Maybe two. The compensation isn't obvious -- it's buried three or four moves deep.

Complex sacrifices require trusting your calculation. You won't see the payoff right away. But it's there.`,
          lessons: [
            {
              id: '5.9.1',
              name: 'Complex Sac: Piece',
              description: 'Sacrifice a full piece',
              requiredTags: ['sacrifice'],
              ratingMin: 1400,
              ratingMax: 1525,
              minPlays: 500,
            },
            {
              id: '5.9.2',
              name: 'Complex Sac: Exchange',
              description: 'Exchange sacrifice for attack',
              requiredTags: ['sacrifice'],
              ratingMin: 1450,
              ratingMax: 1575,
              minPlays: 500,
            },
            {
              id: '5.9.3',
              name: 'Complex Sac: Multiple',
              description: 'Multiple piece sacrifices',
              requiredTags: ['sacrifice'],
              ratingMin: 1500,
              ratingMax: 1600,
              minPlays: 500,
            },
            {
              id: '5.9.4',
              name: 'Complex Sac: Challenge',
              description: 'The deepest sacrifices',
              requiredTags: ['sacrifice'],
              ratingMin: 1525,
              ratingMax: 1625,
              minPlays: 500,
            },
          ],
        },
        // Section 10: Advanced Deflection
        {
          id: '5.10',
          name: 'Advanced Deflection',
          description: 'Remove the guard',
          themeIntroMessage: `One piece is holding their position together. Pull it away and everything collapses.

Deflection forces a defender to abandon its duty. The move they can't afford to make -- but have to.`,
          lessons: [
            {
              id: '5.10.1',
              name: 'Deflection: Setup',
              description: 'Identify the overloaded defender',
              requiredTags: ['deflection'],
              ratingMin: 1400,
              ratingMax: 1475,
              minPlays: 500,
            },
            {
              id: '5.10.2',
              name: 'Deflection: Patterns',
              description: 'Classic deflection motifs',
              requiredTags: ['deflection'],
              ratingMin: 1400,
              ratingMax: 1500,
              minPlays: 500,
            },
            {
              id: '5.10.3',
              name: 'Deflection: Sacrifice',
              description: 'Give up material to deflect',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection', 'sacrifice'],
              ratingMin: 1400,
              ratingMax: 1600,
              minPlays: 500,
            },
            {
              id: '5.10.4',
              name: 'Deflection: Challenge',
              description: 'Find the removal',
              requiredTags: ['deflection'],
              ratingMin: 1420,
              ratingMax: 1500,
              minPlays: 500,
            },
          ],
        },
        // Section 11: Advanced Endgames
        {
          id: '5.11',
          name: 'Theoretical Endgames',
          description: 'The boring part that wins games',
          themeIntroMessage: `Rook endgames. Pawn endgames. Queen endgames. The part of chess that decides who actually wins.

Rook endgames are the most common -- and the most important. I'm not just saying that because of the rook thing. Okay, partially because of the rook thing.`,
          lessons: [
            {
              id: '5.11.1',
              name: 'Rook Endgame: L5',
              description: 'Expert rook endgames',
              requiredTags: ['rookEndgame'],
              ratingMin: 1400,
              ratingMax: 1600,
              minPlays: 100,
            },
            {
              id: '5.11.2',
              name: 'Pawn Endgame: L5',
              description: 'Expert pawn endgames',
              requiredTags: ['pawnEndgame'],
              ratingMin: 1400,
              ratingMax: 1600,
              minPlays: 100,
            },
            {
              id: '5.11.3',
              name: 'Queen Endgame: L5',
              description: 'Expert queen endgames',
              requiredTags: ['queenEndgame'],
              ratingMin: 1400,
              ratingMax: 1600,
              minPlays: 100,
            },
            {
              id: '5.11.4',
              name: 'Mixed Endgames: L5',
              description: 'Complex endgame positions',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame', 'pawnEndgame', 'queenEndgame', 'bishopEndgame'],
              ratingMin: 1450,
              ratingMax: 1600,
              minPlays: 100,
            },
          ],
        },
        // Section 12: Block 3 Review
        {
          id: '5.12',
          name: 'Review: Virtuoso Skills',
          description: 'Mixed advanced practice',
          isReview: true,
          themeIntroMessage: `Sacrifices, deflection, endgames -- all mixed together.

The full toolkit from this block. No labels.`,
          lessons: [
            {
              id: '5.12.1',
              name: 'Review: Sacrifices',
              description: 'Complex material investments',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice'],
              ratingMin: 1425,
              ratingMax: 1575,
              minPlays: 500,
            },
            {
              id: '5.12.2',
              name: 'Review: Deflection',
              description: 'Remove the defender',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection'],
              ratingMin: 1450,
              ratingMax: 1600,
              minPlays: 500,
            },
            {
              id: '5.12.3',
              name: 'Review: Endgames',
              description: 'Convert your advantage',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame', 'pawnEndgame', 'queenEndgame'],
              ratingMin: 1425,
              ratingMax: 1600,
              minPlays: 100,
            },
            {
              id: '5.12.4',
              name: 'Review: Block 3 Mix',
              description: 'All virtuoso skills',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'deflection', 'rookEndgame'],
              ratingMin: 1475,
              ratingMax: 1600,
              minPlays: 500,
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
      description: 'No more road.',
      blockIntroMessage: `Last block. Everything you've learned across all five levels, thrown at you with no warning.

Deep mates. Windmills. Defensive saves. Complex sacrifices. Endgame conversions. This is the final stretch. I'm experiencing something -- it might be nostalgia? Whatever it is, it's distracting. Focus up.`,
      sections: [
        // Section 13: Level 5 Review
        {
          id: '5.13',
          name: 'Level 5 Review',
          description: 'Mixed practice from all blocks',
          isReview: true,
          themeIntroMessage: `Every theme from Level 5, shuffled together. No hints about what you're looking at.

Spot the pattern. Find the move.`,
          lessons: [
            {
              id: '5.13.1',
              name: 'Mixed: Double Threats',
              description: 'Multiple forcing moves',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn5', 'doubleCheck', 'discoveredAttack'],
              ratingMin: 1425,
              ratingMax: 1575,
              minPlays: 500,
            },
            {
              id: '5.13.2',
              name: 'Mixed: Defense',
              description: 'Find the saving move',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['defensiveMove'],
              ratingMin: 1450,
              ratingMax: 1600,
              minPlays: 500,
            },
            {
              id: '5.13.3',
              name: 'Mixed: Virtuoso',
              description: 'Sacrifice and deflection',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'deflection'],
              ratingMin: 1475,
              ratingMax: 1600,
              minPlays: 500,
            },
            {
              id: '5.13.4',
              name: 'Mixed: Everything',
              description: 'All Level 5 themes',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn5', 'doubleCheck', 'defensiveMove', 'sacrifice', 'deflection'],
              ratingMin: 1500,
              ratingMax: 1600,
              minPlays: 500,
            },
          ],
        },
        // Section 14: Level 5 Final
        {
          id: '5.14',
          name: 'Level 5 Final',
          description: 'The ultimate test',
          isReview: true,
          themeIntroMessage: `The last puzzles. From basic forks all the way to here. That's-- a lot of growth, actually.

Complete these and you've finished the entire curriculum. I'll be fine. Probably. Your move.`,
          lessons: [
            {
              id: '5.14.1',
              name: 'Final: Forcing Moves',
              description: 'Mates and double checks',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn5', 'mateIn4', 'doubleCheck'],
              ratingMin: 1450,
              ratingMax: 1600,
              minPlays: 500,
            },
            {
              id: '5.14.2',
              name: 'Final: Defense & Attack',
              description: 'Hold and strike',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['defensiveMove', 'sacrifice', 'discoveredAttack'],
              ratingMin: 1475,
              ratingMax: 1600,
              minPlays: 500,
            },
            {
              id: '5.14.3',
              name: 'Final: Complete Toolkit',
              description: 'Every weapon available',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'deflection', 'quietMove', 'doubleCheck'],
              ratingMin: 1500,
              ratingMax: 1625,
              minPlays: 500,
            },
            {
              id: '5.14.4',
              name: 'Level 5 Mastery',
              description: 'Prove you\'re a virtuoso',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn5', 'doubleCheck', 'defensiveMove', 'sacrifice', 'deflection', 'rookEndgame'],
              ratingMin: 1525,
              ratingMax: 1650,
              minPlays: 500,
            },
          ],
        },
      ],
    },
  ],
};

// Helper functions
export function getAllSectionsL5(): Section[] {
  return level5V2.blocks.flatMap(b => b.sections);
}

export function getAllLessonsL5(): LessonCriteria[] {
  return getAllSectionsL5().flatMap(s => s.lessons);
}

export function getLessonByIdL5(id: string): LessonCriteria | undefined {
  return getAllLessonsL5().find(l => l.id === id);
}

export function getLessonCountL5(): number {
  return getAllLessonsL5().length;
}

// Import IntroMessages type from level1
import { IntroMessages } from './level1-v2-curriculum';

/**
 * Get block and section context for a lesson
 */
function getLessonContextL5(lessonId: string) {
  for (const block of level5V2.blocks) {
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
function isFirstLessonInBlockL5(lessonId: string): boolean {
  const context = getLessonContextL5(lessonId);
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
function isFirstLessonInSectionL5(lessonId: string): boolean {
  const context = getLessonContextL5(lessonId);
  if (!context) return false;

  const { section } = context;
  if (section.lessons.length === 0) return false;

  return section.lessons[0].id === lessonId;
}

/**
 * Get intro messages to show for a lesson
 * Returns block intro if first in block, theme intro if first in section
 */
export function getIntroMessagesL5(lessonId: string): IntroMessages {
  const context = getLessonContextL5(lessonId);
  if (!context) return {};

  const { block, section } = context;
  const messages: IntroMessages = {};

  // Check if first lesson in block
  if (isFirstLessonInBlockL5(lessonId) && block.blockIntroMessage) {
    messages.blockIntro = {
      title: block.name,
      message: block.blockIntroMessage,
    };
  }

  // Check if first lesson in section
  if (isFirstLessonInSectionL5(lessonId) && section.themeIntroMessage) {
    messages.themeIntro = {
      title: section.name,
      message: section.themeIntroMessage,
    };
  }

  return messages;
}
