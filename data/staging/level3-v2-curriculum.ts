/**
 * Level 3 V2 Curriculum (1000-1200 ELO)
 * "Never Apologize for Being Great"
 *
 * You have the weapons. Now learn the setups.
 * Make them walk right into your traps.
 *
 * Structure:
 * - Blocks 1-3: 3 content sections + 1 review section = 12 sections, 48 lessons
 * - Block 4: 2 review sections = 2 sections, 8 lessons
 * - Total: 14 sections, 56 lessons
 *
 * Block 1: Deflection & Attraction - Force pieces where you want them
 * Block 2: The Sacrifice - Give to get more
 * Block 3: Advanced Combinations - Put it all together
 * Block 4: Final Review - Prove your mastery
 *
 * Clean puzzles: 3000+ plays, single tactical theme = highly verified
 */

import { LessonCriteria, Section, Block, Level } from './level1-v2-curriculum';

export const level3V2: Level = {
  id: 'level-3',
  name: 'Level 3: Never Apologize for Being Great',
  ratingRange: '1000-1200',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: DEFLECTION & ATTRACTION
    // "Force pieces where you want them"
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'Deflection & Attraction',
      description: 'Control where pieces go',
      blockIntroMessage: `Welcome to Level 3!

You know the basic tactics. Now learn to SET THEM UP.

Deflection forces defenders away. Attraction lures pieces to bad squares. These are the setup moves that make everything else possible.`,
      sections: [
        // Section 1: Deflection Basics
        {
          id: 'sec-1',
          name: 'Deflection',
          description: 'Force the defender away',
          themeIntroMessage: `That knight is protecting the queen. The rook is guarding the back rank. How do we win?

Force the defender away. Attack it, capture it, or threaten something it can't ignore.

Once the guard is gone, the real target is helpless.`,
          lessons: [
            {
              id: '3.1.1',
              name: 'Deflection: Basics',
              description: 'Attack what protects them',
              requiredTags: ['deflection'],
              excludeTags: ['mateIn1'],
              ratingMin: 1000,
              ratingMax: 1075,
              minPlays: 3000,
            },
            {
              id: '3.1.2',
              name: 'Deflection: Patterns',
              description: 'Common deflection setups',
              requiredTags: ['deflection'],
              excludeTags: ['mateIn1'],
              ratingMin: 1050,
              ratingMax: 1125,
              minPlays: 3000,
            },
            {
              id: '3.1.3',
              name: 'Deflection: Defender',
              description: 'Remove the key defender',
              requiredTags: ['deflection'],
              excludeTags: ['mateIn1'],
              ratingMin: 1100,
              ratingMax: 1175,
              minPlays: 3000,
            },
            {
              id: '3.1.4',
              name: 'Deflection: Challenge',
              description: 'Find the deflection',
              requiredTags: ['deflection'],
              excludeTags: ['mateIn1'],
              ratingMin: 1150,
              ratingMax: 1250,
              minPlays: 3000,
            },
          ],
        },
        // Section 2: Attraction
        {
          id: 'sec-2',
          name: 'Attraction',
          description: 'Lure pieces to bad squares',
          themeIntroMessage: `Attraction is the flip side of deflection. Instead of pushing defenders away, you PULL pieces where you want them.

Usually with a sacrifice. "Here, take this!" And when they do... BOOM.

Lure the king out of safety. Drag the queen to a fork square.`,
          lessons: [
            {
              id: '3.2.1',
              name: 'Attraction: Basics',
              description: 'Lure them to their doom',
              requiredTags: ['attraction'],
              excludeTags: ['mateIn1'],
              ratingMin: 1000,
              ratingMax: 1075,
              minPlays: 3000,
            },
            {
              id: '3.2.2',
              name: 'Attract the King',
              description: 'Lure the king into danger',
              requiredTags: ['attraction'],
              excludeTags: ['mateIn1'],
              ratingMin: 1050,
              ratingMax: 1125,
              minPlays: 3000,
            },
            {
              id: '3.2.3',
              name: 'Attract the Queen',
              description: 'Lure the queen to a trap',
              requiredTags: ['attraction'],
              excludeTags: ['mateIn1'],
              ratingMin: 1100,
              ratingMax: 1175,
              minPlays: 3000,
            },
            {
              id: '3.2.4',
              name: 'Attraction: Challenge',
              description: 'Find the attraction',
              requiredTags: ['attraction'],
              excludeTags: ['mateIn1'],
              ratingMin: 1150,
              ratingMax: 1250,
              minPlays: 3000,
            },
          ],
        },
        // Section 3: Clearance & Interference
        {
          id: 'sec-3',
          name: 'Clearance & Interference',
          description: 'Clear paths and block lines',
          themeIntroMessage: `Your own piece is in the way? Move it with tempo. That's clearance.

Their pieces coordinate too well? Put something between them. That's interference.

Control the lines. Control the game.`,
          lessons: [
            {
              id: '3.3.1',
              name: 'Clearance: Basics',
              description: 'Clear the way for another piece',
              requiredTags: ['clearance'],
              ratingMin: 1000,
              ratingMax: 1100,
              minPlays: 3000,
            },
            {
              id: '3.3.2',
              name: 'Clearance: Sacrifice',
              description: 'Sacrifice to clear the path',
              requiredTags: ['clearance'],
              ratingMin: 1075,
              ratingMax: 1175,
              minPlays: 3000,
            },
            {
              id: '3.3.3',
              name: 'Interference: Basics',
              description: 'Block their piece coordination',
              requiredTags: ['interference'],
              ratingMin: 1050,
              ratingMax: 1150,
              minPlays: 3000,
            },
            {
              id: '3.3.4',
              name: 'Interference: Challenge',
              description: 'Find the interference',
              requiredTags: ['interference'],
              ratingMin: 1125,
              ratingMax: 1225,
              minPlays: 3000,
            },
          ],
        },
        // Section 4: Block 1 Review
        {
          id: 'sec-4',
          name: 'Review: Enablers',
          description: 'Mixed deflection and attraction practice',
          isReview: true,
          themeIntroMessage: `Deflection. Attraction. Clearance. Interference.

These are the enabling moves - they make your tactical shots possible.

Find the move that breaks their coordination or creates your attack.`,
          lessons: [
            {
              id: '3.4.1',
              name: 'Review: Deflection',
              description: 'Force the defender away',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection'],
              excludeTags: ['mateIn1'],
              ratingMin: 1025,
              ratingMax: 1125,
              minPlays: 3000,
            },
            {
              id: '3.4.2',
              name: 'Review: Attraction',
              description: 'Lure them to their doom',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['attraction'],
              excludeTags: ['mateIn1'],
              ratingMin: 1050,
              ratingMax: 1150,
              minPlays: 3000,
            },
            {
              id: '3.4.3',
              name: 'Review: Clearance & Interference',
              description: 'Clear or block',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['clearance', 'interference'],
              ratingMin: 1075,
              ratingMax: 1175,
              minPlays: 3000,
            },
            {
              id: '3.4.4',
              name: 'Review: All Enablers',
              description: 'Find the enabling move',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection', 'attraction', 'clearance', 'interference'],
              ratingMin: 1100,
              ratingMax: 1200,
              minPlays: 3000,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 2: THE SACRIFICE
    // "Give to get more"
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-2',
      name: 'The Sacrifice',
      description: 'Give up material for bigger gains',
      blockIntroMessage: `The sacrifice. Give up material to get something better.

It's not charity - it's investment. A pawn for a mating attack. A piece for a devastating combination.

Learn when giving is winning.`,
      sections: [
        // Section 5: Sacrifice
        {
          id: 'sec-5',
          name: 'The Sacrifice',
          description: 'Give up material for bigger gains',
          themeIntroMessage: `Not every sacrifice is a gamble. The best sacrifices are calculated.

You give up material because you've seen the forced sequence that wins it back - with interest.

Calculate first. Then sacrifice.`,
          lessons: [
            {
              id: '3.5.1',
              name: 'Sacrifice: Easy',
              description: 'Give to gain more',
              requiredTags: ['sacrifice'],
              ratingMin: 1000,
              ratingMax: 1100,
              minPlays: 500,
            },
            {
              id: '3.5.2',
              name: 'Sacrifice: Medium',
              description: 'More complex sacrifices',
              requiredTags: ['sacrifice'],
              ratingMin: 1050,
              ratingMax: 1150,
              minPlays: 500,
            },
            {
              id: '3.5.3',
              name: 'Sacrifice: Hard',
              description: 'Find the hidden sacrifice',
              requiredTags: ['sacrifice'],
              ratingMin: 1100,
              ratingMax: 1200,
              minPlays: 500,
            },
            {
              id: '3.5.4',
              name: 'Sacrifice: Challenge',
              description: 'Find the winning sacrifice',
              requiredTags: ['sacrifice'],
              ratingMin: 1150,
              ratingMax: 1200,
              minPlays: 500,
            },
          ],
        },
        // Section 6: Sacrifice for Material
        {
          id: 'sec-6',
          name: 'Sacrifice for Material',
          description: 'Give to win more back',
          themeIntroMessage: `The temporary sacrifice: give material now, win it back immediately.

Exchange sacrifices give up your rook for their bishop or knight - but gain position or attack.

Material isn't everything. Activity matters.`,
          lessons: [
            {
              id: '3.6.1',
              name: 'Exchange Sacrifice',
              description: 'Rook for bishop or knight',
              requiredTags: ['sacrifice'],
              ratingMin: 1025,
              ratingMax: 1100,
              minPlays: 3000,
            },
            {
              id: '3.6.2',
              name: 'Temporary Sacrifice',
              description: 'Give and take back more',
              requiredTags: ['sacrifice'],
              ratingMin: 1075,
              ratingMax: 1150,
              minPlays: 3000,
            },
            {
              id: '3.6.3',
              name: 'Sacrifice: Calculation',
              description: 'Calculate the win',
              requiredTags: ['sacrifice'],
              ratingMin: 1100,
              ratingMax: 1175,
              minPlays: 3000,
            },
            {
              id: '3.6.4',
              name: 'Material Sacrifice: Challenge',
              description: 'Find the winning sac',
              requiredTags: ['sacrifice'],
              ratingMin: 1150,
              ratingMax: 1250,
              minPlays: 3000,
            },
          ],
        },
        // Section 7: Advanced Tactics
        {
          id: 'sec-7',
          name: 'Advanced Tactics',
          description: 'Level up your weapons',
          themeIntroMessage: `Time to sharpen your Level 2 weapons.

Same tactics - forks, pins, skewers, discoveries - but harder positions.

The patterns are there. Find them in the noise.`,
          lessons: [
            {
              id: '3.7.1',
              name: 'Advanced Forks',
              description: 'Harder fork puzzles',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 1000,
              ratingMax: 1100,
              minPlays: 3000,
            },
            {
              id: '3.7.2',
              name: 'Advanced Pins',
              description: 'Harder pin puzzles',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 1050,
              ratingMax: 1150,
              minPlays: 3000,
            },
            {
              id: '3.7.3',
              name: 'Advanced Skewers',
              description: 'Harder skewer puzzles',
              requiredTags: ['skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 1075,
              ratingMax: 1175,
              minPlays: 3000,
            },
            {
              id: '3.7.4',
              name: 'Advanced Discoveries',
              description: 'Complex discovered attacks',
              requiredTags: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 1025,
              ratingMax: 1075,
              minPlays: 1000,
            },
          ],
        },
        // Section 8: Block 2 Review
        {
          id: 'sec-8',
          name: 'Review: Sacrifice & Tactics',
          description: 'Mixed sacrifice and tactics practice',
          isReview: true,
          themeIntroMessage: `Sacrifices and advanced tactics, all mixed together.

Sometimes you need to give material. Sometimes it's a pure tactical shot.

Read the position. Make the right call.`,
          lessons: [
            {
              id: '3.8.1',
              name: 'Review: Sacrifice',
              description: 'Give to get more',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice'],
              ratingMin: 1000,
              ratingMax: 1100,
              minPlays: 500,
            },
            {
              id: '3.8.2',
              name: 'Review: Advanced Forks',
              description: 'Harder double attacks',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 1025,
              ratingMax: 1125,
              minPlays: 3000,
            },
            {
              id: '3.8.3',
              name: 'Review: Advanced Pins',
              description: 'Harder pin tactics',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin', 'skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 1050,
              ratingMax: 1150,
              minPlays: 3000,
            },
            {
              id: '3.8.4',
              name: 'Review: Block 2 Mix',
              description: 'Sacrifice and tactics',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'fork', 'pin', 'skewer', 'discoveredAttack'],
              ratingMin: 1075,
              ratingMax: 1175,
              minPlays: 3000,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 3: ADVANCED COMBINATIONS
    // "Put it all together"
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-3',
      name: 'Combinations',
      description: 'Chain tactics together',
      blockIntroMessage: `Combinations are where everything comes together.

Multiple tactics chained. Deeper calculation. Longer sequences.

This is the beautiful, forcing chess that makes your opponents say "Wait, what just happened?"`,
      sections: [
        // Section 9: Multi-Move Checkmates
        {
          id: 'sec-9',
          name: 'Multi-Move Checkmates',
          description: 'Calculate deeper mates',
          themeIntroMessage: `Two-move mates? Easy. Now let's go deeper.

Mate in 3 requires seeing three moves ahead - your move, their best response, your finisher.

It's not about memorizing. It's about visualizing the board after each move.`,
          lessons: [
            {
              id: '3.9.1',
              name: 'Mate in 2: L3',
              description: 'Two-move mates at your level',
              requiredTags: ['mateIn2'],
              ratingMin: 1000,
              ratingMax: 1045,
              minPlays: 500,
            },
            {
              id: '3.9.2',
              name: 'Mate in 3: Easy',
              description: 'Three-move mates',
              requiredTags: ['mateIn3'],
              ratingMin: 1000,
              ratingMax: 1100,
              minPlays: 500,
            },
            {
              id: '3.9.3',
              name: 'Mate in 3: Medium',
              description: 'Trickier three-move mates',
              requiredTags: ['mateIn3'],
              ratingMin: 1050,
              ratingMax: 1150,
              minPlays: 500,
            },
            {
              id: '3.9.4',
              name: 'Mate in 3: Hard',
              description: 'Challenging three-move mates',
              requiredTags: ['mateIn3'],
              ratingMin: 1100,
              ratingMax: 1200,
              minPlays: 500,
            },
          ],
        },
        // Section 10: Endgames Level 3
        {
          id: 'sec-10',
          name: 'Endgame Mastery',
          description: 'Advanced endgame tactics',
          themeIntroMessage: `Endgames are where games are won and lost.

Fewer pieces means every move matters more. Pawn promotion decides everything.

Master these patterns and you'll convert every winning position.`,
          lessons: [
            {
              id: '3.10.1',
              name: 'Rook Endgame: L3',
              description: 'Advanced rook endgames',
              requiredTags: ['rookEndgame'],
              ratingMin: 1000,
              ratingMax: 1200,
              minPlays: 100,
            },
            {
              id: '3.10.2',
              name: 'Pawn Endgame: L3',
              description: 'Advanced pawn endgames',
              requiredTags: ['pawnEndgame'],
              ratingMin: 1000,
              ratingMax: 1200,
              minPlays: 100,
            },
            {
              id: '3.10.3',
              name: 'Knight Endgame: L3',
              description: 'Advanced knight endgames',
              requiredTags: ['knightEndgame'],
              ratingMin: 1000,
              ratingMax: 1200,
              minPlays: 100,
            },
            {
              id: '3.10.4',
              name: 'Bishop Endgame: L3',
              description: 'Advanced bishop endgames',
              requiredTags: ['bishopEndgame'],
              ratingMin: 1000,
              ratingMax: 1200,
              minPlays: 100,
            },
          ],
        },
        // Section 11: Combined Tactics
        {
          id: 'sec-11',
          name: 'Combined Tactics',
          description: 'Multiple tactics in one',
          themeIntroMessage: `Real combinations chain multiple tactics together.

Fork into pin. Discovery into skewer. Sacrifice into checkmate.

See how the tactics connect. One leads to another.`,
          lessons: [
            {
              id: '3.11.1',
              name: 'Fork + Pin',
              description: 'Two tactics combined',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'pin'],
              excludeTags: ['mateIn1'],
              ratingMin: 1025,
              ratingMax: 1125,
              minPlays: 3000,
            },
            {
              id: '3.11.2',
              name: 'Discovery + Fork',
              description: 'Reveal and attack',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['discoveredAttack', 'fork'],
              excludeTags: ['mateIn1'],
              ratingMin: 1000,
              ratingMax: 1075,
              minPlays: 500,
            },
            {
              id: '3.11.3',
              name: 'Sacrifice + Tactic',
              description: 'Give to set up tactics',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'fork', 'pin', 'skewer'],
              ratingMin: 1100,
              ratingMax: 1200,
              minPlays: 3000,
            },
            {
              id: '3.11.4',
              name: 'All Tactics',
              description: 'Every weapon available',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'pin', 'skewer', 'discoveredAttack', 'deflection', 'attraction'],
              excludeTags: ['mateIn1'],
              ratingMin: 1125,
              ratingMax: 1225,
              minPlays: 3000,
            },
          ],
        },
        // Section 12: Block 3 Review
        {
          id: 'sec-12',
          name: 'Review: Combinations',
          description: 'Mixed checkmates and endgames',
          isReview: true,
          themeIntroMessage: `Block 3 review. Checkmates, endgames, and combined tactics.

Everything mixes together now. Stay focused on what the position needs.

Find the winning continuation.`,
          lessons: [
            {
              id: '3.12.1',
              name: 'Review: Mate in 3',
              description: 'Find the three-move checkmate',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn3'],
              ratingMin: 1050,
              ratingMax: 1175,
              minPlays: 500,
            },
            {
              id: '3.12.2',
              name: 'Review: Endgames',
              description: 'Convert your advantage',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame', 'pawnEndgame', 'knightEndgame'],
              ratingMin: 1000,
              ratingMax: 1200,
              minPlays: 100,
            },
            {
              id: '3.12.3',
              name: 'Review: Combined Tactics',
              description: 'Multiple tactics together',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'pin', 'discoveredAttack'],
              excludeTags: ['mateIn1'],
              ratingMin: 1075,
              ratingMax: 1175,
              minPlays: 3000,
            },
            {
              id: '3.12.4',
              name: 'Review: Block 3 Mix',
              description: 'Checkmates and conversions',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn2', 'mateIn3', 'rookEndgame'],
              ratingMin: 1100,
              ratingMax: 1200,
              minPlays: 500,
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
      name: 'Prove Yourself',
      description: 'Final mixed practice - show your mastery',
      blockIntroMessage: `You've learned the advanced setups. You've mastered sacrifices. You can chain tactics together.

Now prove it all works under pressure.

This is the final block. Every tactic. Every theme. Show me what you've got.`,
      sections: [
        // Section 13: Level 3 Review
        {
          id: 'sec-13',
          name: 'Level 3 Review',
          description: 'Mixed practice from all blocks',
          isReview: true,
          themeIntroMessage: `Everything from Level 3 in one section.

Deflection. Attraction. Sacrifices. Multi-move mates. Endgames. Combined tactics.

The full arsenal. Use it wisely.`,
          lessons: [
            {
              id: '3.13.1',
              name: 'Mixed: Enablers',
              description: 'Deflection, attraction, clearance',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection', 'attraction', 'clearance'],
              excludeTags: ['mateIn1'],
              ratingMin: 1050,
              ratingMax: 1150,
              minPlays: 3000,
            },
            {
              id: '3.13.2',
              name: 'Mixed: Sacrifice',
              description: 'Give to get more',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice'],
              ratingMin: 1050,
              ratingMax: 1150,
              minPlays: 500,
            },
            {
              id: '3.13.3',
              name: 'Mixed: Combinations',
              description: 'Checkmates and tactics',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn3', 'fork', 'pin', 'discoveredAttack'],
              ratingMin: 1075,
              ratingMax: 1175,
              minPlays: 500,
            },
            {
              id: '3.13.4',
              name: 'Mixed: Everything',
              description: 'All Level 3 themes',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection', 'attraction', 'sacrifice', 'fork', 'pin'],
              excludeTags: ['mateIn1'],
              ratingMin: 1100,
              ratingMax: 1200,
              minPlays: 3000,
            },
          ],
        },
        // Section 14: Level 3 Final
        {
          id: 'sec-14',
          name: 'Level 3 Final',
          description: 'The ultimate test',
          isReview: true,
          themeIntroMessage: `This is it. The final test of Level 3.

You've come so far. From basic forks to multi-move combinations.

Crush these last puzzles. Prove you see what they never will.`,
          lessons: [
            {
              id: '3.14.1',
              name: 'Final: Tactics Mix',
              description: 'All tactical patterns',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'pin', 'skewer', 'discoveredAttack'],
              excludeTags: ['mateIn1'],
              ratingMin: 1075,
              ratingMax: 1175,
              minPlays: 3000,
            },
            {
              id: '3.14.2',
              name: 'Final: Enablers + Sacrifice',
              description: 'Setup and execute',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection', 'attraction', 'sacrifice', 'clearance'],
              ratingMin: 1100,
              ratingMax: 1200,
              minPlays: 3000,
            },
            {
              id: '3.14.3',
              name: 'Final: Everything',
              description: 'All skills combined',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection', 'attraction', 'sacrifice', 'fork', 'pin', 'discoveredAttack', 'mateIn3'],
              ratingMin: 1125,
              ratingMax: 1225,
              minPlays: 3000,
            },
            {
              id: '3.14.4',
              name: 'Level 3 Mastery',
              description: 'Prove you see what they never will',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection', 'attraction', 'sacrifice', 'fork', 'pin', 'skewer', 'discoveredAttack', 'mateIn3', 'rookEndgame'],
              ratingMin: 1150,
              ratingMax: 1250,
              minPlays: 3000,
            },
          ],
        },
      ],
    },
  ],
};

// Helper functions
export function getAllSectionsL3(): import('./level1-v2-curriculum').Section[] {
  return level3V2.blocks.flatMap(b => b.sections);
}

export function getAllLessonsL3(): LessonCriteria[] {
  return getAllSectionsL3().flatMap(s => s.lessons);
}

export function getLessonByIdL3(id: string): LessonCriteria | undefined {
  return getAllLessonsL3().find(l => l.id === id);
}

export function getLessonCountL3(): number {
  return getAllLessonsL3().length;
}

// Import IntroMessages type from level1
import { IntroMessages } from './level1-v2-curriculum';

/**
 * Get block and section context for a lesson
 */
function getLessonContextL3(lessonId: string) {
  for (const block of level3V2.blocks) {
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
function isFirstLessonInBlockL3(lessonId: string): boolean {
  const context = getLessonContextL3(lessonId);
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
function isFirstLessonInSectionL3(lessonId: string): boolean {
  const context = getLessonContextL3(lessonId);
  if (!context) return false;

  const { section } = context;
  if (section.lessons.length === 0) return false;

  return section.lessons[0].id === lessonId;
}

/**
 * Get intro messages to show for a lesson
 * Returns block intro if first in block, theme intro if first in section
 */
export function getIntroMessagesL3(lessonId: string): IntroMessages {
  const context = getLessonContextL3(lessonId);
  if (!context) return {};

  const { block, section } = context;
  const messages: IntroMessages = {};

  // Check if first lesson in block
  if (isFirstLessonInBlockL3(lessonId) && block.blockIntroMessage) {
    messages.blockIntro = {
      title: block.name,
      message: block.blockIntroMessage,
    };
  }

  // Check if first lesson in section
  if (isFirstLessonInSectionL3(lessonId) && section.themeIntroMessage) {
    messages.themeIntro = {
      title: section.name,
      message: section.themeIntroMessage,
    };
  }

  return messages;
}
