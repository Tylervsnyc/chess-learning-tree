/**
 * Level 5 V2 Curriculum (1400-1600 ELO)
 * "No Country for Beginners"
 *
 * This is tournament territory. No mercy. No shortcuts.
 * You wanted to be good at chess. Now deal with it.
 *
 * Structure:
 * - Blocks 1-3: 3 content sections + 1 review section = 12 sections, 48 lessons
 * - Block 4: 2 review sections = 2 sections, 8 lessons
 * - Total: 14 sections, 56 lessons
 *
 * Block 1: Coin Flip - "What's the most you ever lost on a coin flip?"
 * Block 2: You Can't Stop What's Coming - Inevitable. Unstoppable.
 * Block 3: Call It - The moment of decision.
 * Block 4: The End of the Line - No more road.
 *
 * Clean puzzles: 500+ plays for quality verification
 */

import { LessonCriteria, Section, Block, Level } from './level1-v2-curriculum';

export const level5V2: Level = {
  id: 'level-5',
  name: 'Level 5: No Country for Beginners',
  ratingRange: '1400-1600',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: COIN FLIP
    // "What's the most you ever lost on a coin flip?"
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'Coin Flip',
      description: "What's the most you ever lost on a coin flip?",
      blockIntroMessage: `Welcome to Level 5. No Country for Beginners.

What's the most you ever lost on a coin flip? Doesn't matter. In these positions, there is no coin flip. Just inevitability.

Double checks. Windmills. Mate in 5. When you see it, they're already dead.`,
      sections: [
        // Section 1: Mate in 5+
        {
          id: '5.1',
          name: 'Mate in 5+',
          description: 'Deep mating calculations',
          themeIntroMessage: `Five moves ahead? That's just the warm-up.

Long mating sequences require visualizing the entire line. Every check. Every response. The final checkmate.

This is where calculation becomes an art form.`,
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
          themeIntroMessage: `Double check: two pieces give check simultaneously.

The only defense is to move the king. No blocks. No captures. Just run.

The most forcing move in chess. Devastating when combined with other tactics.`,
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
          name: 'Windmill of Doom',
          description: 'The devastating repeated discovery',
          themeIntroMessage: `Spin cycle: attack, check, attack, check, opponent crying.

The windmill: a piece gives discovered check repeatedly while capturing material each time.

One of the most beautiful tactical patterns. And the most devastating.`,
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
              requiredTags: ['discoveredAttack', 'doubleCheck'],
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
          themeIntroMessage: `Deep mates. Double checks. Windmills.

When you can't just defend one threat, you have to give up.

Create two problems. Watch them solve none.`,
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
    // BLOCK 2: YOU CAN'T STOP WHAT'S COMING
    // "It's the same coin."
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-2',
      name: "You Can't Stop What's Coming",
      description: 'Inevitable. Unstoppable.',
      blockIntroMessage: `You can't stop what's coming. It ain't all waiting on you.

But sometimes... you can redirect it. Find the defensive resource. Build the fortress. Turn their attack into your counterattack.

When you can't stop what's coming, make sure it's coming for them instead.`,
      sections: [
        // Section 5: Defensive Resources
        {
          id: '5.5',
          name: 'Defensive Resources',
          description: 'Find the saving move',
          themeIntroMessage: `You're in trouble. Find the move that saves everything.

Defensive resources aren't obvious. They require seeing past the threats to the counter-threats.

Stop their plan before they even know they had one.`,
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
          themeIntroMessage: `The fortress: a position that can't be broken.

Down material but no way to lose? That's a fortress. Draw secured.

Know these structures. Save half points from lost positions.`,
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
          themeIntroMessage: `Turn defense into counterattack. The reverse uno of chess.

They attack, you defend. But your defense creates a bigger threat.

Suddenly they're the ones scrambling.`,
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
          themeIntroMessage: `Defense, fortresses, counterattacks.

Not every position needs attack. Sometimes holding is winning.

Find the move that keeps you alive.`,
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
    // BLOCK 3: CALL IT
    // "Just call it."
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-3',
      name: 'Call It',
      description: 'The moment of decision.',
      blockIntroMessage: `Call it.

This is where you make the decision that defines the game. The sacrifice. The deflection. The endgame technique.

No luck. No excuses. Just you and the board. Call it.`,
      sections: [
        // Section 9: Complex Sacrifices
        {
          id: '5.9',
          name: 'Complex Sacrifices',
          description: 'Multi-piece sacrifices',
          themeIntroMessage: `Sacrifice three pieces, win the game. Big brain energy only.

Complex sacrifices require seeing multiple moves deep. The compensation isn't obvious.

Trust the calculation. Make the sacrifice.`,
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
          themeIntroMessage: `Their piece is protecting something important. Make it leave.

Deflection forces a defender away from its duty. Suddenly, everything collapses.

The move they can't afford to make... but have to.`,
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
          themeIntroMessage: `The boring part of chess that wins games.

Rook endgames. Pawn structures. Queen vs rook.

Master these, and you'll convert every winning position.`,
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
          themeIntroMessage: `Complex sacrifices. Advanced deflection. Theoretical endgames.

The complete virtuoso's toolkit.

These techniques will elevate your game.`,
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
    // BLOCK 4: THE END OF THE LINE
    // "You know how this turns out, don't you?"
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-4',
      name: 'The End of the Line',
      description: 'No more road.',
      blockIntroMessage: `You know how this turns out, don't you?

End of the road. Everything you've learned. Coin flip tactics. Inevitable defense. The moment of decision.

There's no more levels after this one. Just you, and everyone who wishes they were you.`,
      sections: [
        // Section 13: Level 5 Review
        {
          id: '5.13',
          name: 'Level 5 Review',
          description: 'Mixed practice from all blocks',
          isReview: true,
          themeIntroMessage: `Everything from Level 5 in one section.

Mate in 5. Double checks. Defense. Deflection. Endgames.

The complete Level 5 experience.`,
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
          themeIntroMessage: `You know how this ends.

From basic forks to tournament-level technique. From beginner to... whatever you are now.

Complete these last puzzles. Then go find someone to destroy.`,
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
