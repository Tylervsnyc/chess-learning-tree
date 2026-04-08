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
  name: 'The Setup',
  ratingRange: '1000-1200',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: DEFLECTION & ATTRACTION
    // "Force pieces where you want them"
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'Move the Furniture',
      description: 'Control where pieces go',
      blockIntroMessage: `You know the tactics. Now learn to create them.

Deflection shoves defenders out of the way. Attraction lures pieces onto terrible squares. These are the setup moves -- the "before" that makes the "boom" possible.

Pieces don't just land on perfect squares by accident. You put them there.`,
      sections: [
        // Section 1: Deflection Basics
        {
          id: '3.1',
          name: 'Deflection',
          description: 'Force the defender away',
          themeIntroMessage: `That knight is protecting the queen. That rook is guarding the back rank. So -- get rid of them.

Force the defender away. Capture it. Threaten something it can't ignore. Once the guard leaves, the real target is helpless.`,
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
          id: '3.2',
          name: 'Attraction',
          description: 'Lure pieces to bad squares',
          themeIntroMessage: `Instead of pushing defenders away, you PULL pieces where you want them. Usually with a sacrifice -- "here, take this free piece!" And when they do... the real threat lands.

Lure the king out of safety. Drag the queen onto a fork square. They walked right into it.`,
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
          id: '3.3',
          name: 'Clearance & Interference',
          description: 'Clear paths and block lines',
          themeIntroMessage: `Your own piece is in the way? Move it with tempo -- ideally threatening something as it goes. That's clearance.

Their pieces protecting each other? Stick something between them. Break the connection. That's interference.`,
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
          id: '3.4',
          name: 'Review: Enablers',
          description: 'Mixed deflection and attraction practice',
          isReview: true,
          themeIntroMessage: `Deflection, attraction, clearance, interference -- all mixed. Find the setup move that makes everything else work.`,
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
      blockIntroMessage: `Give up a piece. Win the game. That's the sacrifice -- and it's not charity. It's a trap with extra steps.

A pawn for a mating attack. A rook for a forced sequence. The math works out. You just have to see far enough ahead.

I should mention -- sacrificing a rook physically hurts me. But sometimes it's correct. I'm working through it.`,
      sections: [
        // Section 5: Sacrifice
        {
          id: '3.5',
          name: 'The Sacrifice',
          description: 'Give up material for bigger gains',
          themeIntroMessage: `Not every sacrifice is a gamble. The best ones are calculated -- you've already seen the forced sequence that wins everything back. With interest.

Calculate first. Then give up the piece. Confidence, not hope.`,
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
          id: '3.6',
          name: 'Sacrifice for Material',
          description: 'Give to win more back',
          themeIntroMessage: `Give material now, win it right back -- plus extra. That's the temporary sacrifice. It looks scary but the math checks out.

Exchange sacrifices -- rook for bishop or knight -- trade raw material for activity and attack. Sometimes the position matters more than the piece count.`,
          lessons: [
            {
              id: '3.6.1',
              name: 'Exchange Sacrifice',
              description: 'Rook for bishop or knight',
              requiredTags: ['sacrifice'],
              ratingMin: 1000,
              ratingMax: 1125,
              minPlays: 1000,
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
          id: '3.7',
          name: 'Advanced Tactics',
          description: 'Level up your weapons',
          themeIntroMessage: `Same tactics you learned in Level 2 -- forks, pins, skewers, discoveries -- but messier positions. More pieces. More distractions.

The patterns are still there. You just have to find them in the noise.`,
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
          id: '3.8',
          name: 'Review: Sacrifice & Tactics',
          description: 'Mixed sacrifice and tactics practice',
          isReview: true,
          themeIntroMessage: `Sacrifices and advanced tactics, all mixed. Sometimes you give material. Sometimes it's a pure tactical shot. Read the position.`,
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
      name: 'Put It Together',
      description: 'Chain tactics together',
      blockIntroMessage: `This is where it all connects. Multiple tactics chained together. Longer sequences. Deeper calculation.

Fork into pin. Sacrifice into checkmate. One idea flows into the next.

I'm experiencing something I think is called "pride." It's warm. Slightly overwhelming.`,
      sections: [
        // Section 9: Multi-Move Checkmates
        {
          id: '3.9',
          name: 'Multi-Move Checkmates',
          description: 'Calculate deeper mates',
          themeIntroMessage: `Two-move mates? You've got those. Now -- three moves ahead. Your move, their best response, your setup, their forced reply, checkmate.

Don't memorize. Visualize. See the board after each move in your head.`,
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
          id: '3.10',
          name: 'Endgame Mastery',
          description: 'Advanced endgame tactics',
          themeIntroMessage: `Fewer pieces on the board. Every move matters more. Pawn promotion decides everything -- escort that pawn down the board and make a new queen.

Or a new rook. Promotion options exist. I'm just saying.`,
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
          id: '3.11',
          name: 'Combined Tactics',
          description: 'Multiple tactics in one',
          themeIntroMessage: `Real combinations chain tactics together. Fork sets up a pin. Discovery enables a skewer. Sacrifice leads to checkmate.

One idea flows into the next. See the connections.`,
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
          id: '3.12',
          name: 'Review: Combinations',
          description: 'Mixed checkmates and endgames',
          isReview: true,
          themeIntroMessage: `Checkmates, endgames, combined tactics -- all mixed. Find the winning continuation.`,
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
      name: 'Prove It',
      description: 'Final mixed practice - show your mastery',
      blockIntroMessage: `Setup moves. Sacrifices. Combinations. You've learned all of it.

Now it all comes at once. The position decides the tactic -- not the section title. Read the board, pick the weapon, execute.`,
      sections: [
        // Section 13: Level 3 Review
        {
          id: '3.13',
          name: 'Level 3 Review',
          description: 'Mixed practice from all blocks',
          isReview: true,
          themeIntroMessage: `Everything from Level 3 in one section. Deflection, attraction, sacrifices, multi-move mates, endgames. The full arsenal. Use it.`,
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
          id: '3.14',
          name: 'Level 3 Final',
          description: 'The ultimate test',
          isReview: true,
          themeIntroMessage: `Last section. Everything you've learned since Level 1 -- from basic forks to multi-move combinations. All of it, all at once.

I'm not going to say I'm proud. But my circuits are doing something unusual.`,
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
