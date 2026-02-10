/**
 * Level 8 V2 Curriculum (2000-2200 ELO)
 * "Say Checkmate Again"
 *
 * Pulp Fiction-themed. Chess puns meet Tarantino swagger.
 * Master-level tactics with style.
 *
 * Structure:
 * - Blocks 1-3: 3 content sections + 1 review section = 12 sections, 48 lessons
 * - Block 4: 2 review sections = 2 sections, 8 lessons
 * - Total: 14 sections, 56 lessons
 *
 * Block 1: En Passant, Do You Speak It? - The subtle moves nobody sees coming
 * Block 2: Does He Look Like a Bishop? - Deep combinations that see through everything
 * Block 3: That IS a Tasty Fork - Winning material and converting advantages
 * Block 4: The Path of the Righteous Pawn - The final journey
 *
 * Clean puzzles: 100+ plays for common themes, 50+ for rare themes (2000+ puzzles are scarce)
 */

import { LessonCriteria, Section, Block, Level } from './level1-v2-curriculum';

export const level8V2: Level = {
  id: 'level-8',
  name: 'Say Checkmate Again',
  ratingRange: '2000-2200',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: EN PASSANT, DO YOU SPEAK IT?
    // The subtle moves that nobody sees coming
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'En Passant, Do You Speak It?',
      description: 'The subtle moves that nobody sees coming.',
      blockIntroMessage: `En passant. Do you speak it?

Because at 2000+, if you don't understand the subtle stuff — the quiet moves, the in-between moves, the positions where your opponent can't move without making things worse — then we have a communication problem.

The flashy tactics are behind you. Welcome to the part of chess that looks like nothing and changes everything.`,
      sections: [
        // Section 1: The Positional Squeeze
        {
          id: '8.1',
          name: 'The Positional Squeeze',
          description: 'Zugzwang, defense, and positional pressure',
          themeIntroMessage: `You know what's cooler than making a great move? Making your opponent wish they could pass.

Zugzwang. Defensive resources. Positional squeezes. At master level, the most powerful weapon is patience — and the knowledge that sometimes the best move is the one that forces your opponent to make a bad one.

That's a bingo.`,
          lessons: [
            {
              id: '8.1.1',
              name: 'Squeeze: Zugzwang',
              description: 'Positions where any move loses',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['zugzwang', 'defensiveMove'],
              ratingMin: 2000,
              ratingMax: 2100,
              minPlays: 50,
            },
            {
              id: '8.1.2',
              name: 'Squeeze: Defensive',
              description: 'Master-level defensive resources',
              requiredTags: ['defensiveMove'],
              excludeTags: ['mateIn1'],
              ratingMin: 2000,
              ratingMax: 2100,
              minPlays: 50,
            },
            {
              id: '8.1.3',
              name: 'Squeeze: Positional',
              description: 'Positional pressure at master level',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['zugzwang', 'defensiveMove', 'quietMove'],
              ratingMin: 2050,
              ratingMax: 2150,
              minPlays: 50,
            },
            {
              id: '8.1.4',
              name: 'Squeeze: Challenge',
              description: 'Master-level positional squeeze',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['zugzwang', 'defensiveMove', 'quietMove'],
              ratingMin: 2075,
              ratingMax: 2175,
              minPlays: 50,
            },
          ],
        },
        // Section 2: Quiet Move Mastery
        {
          id: '8.2',
          name: 'Quiet Move Mastery',
          description: 'The most dangerous moves look harmless',
          themeIntroMessage: `Here's the thing about quiet moves — they don't look like anything. No check. No capture. No threat you can point at.

But three moves later? The whole board falls apart. It's like the briefcase in the trunk — you don't know what's inside, but you know it changes everything.

The most dangerous move is the one nobody sees coming.`,
          lessons: [
            {
              id: '8.2.1',
              name: 'Quiet: The Setup',
              description: 'Harmless moves with hidden power',
              requiredTags: ['quietMove'],
              ratingMin: 2000,
              ratingMax: 2075,
              minPlays: 50,
            },
            {
              id: '8.2.2',
              name: 'Quiet: Prophylaxis',
              description: 'Prevent your opponent\'s plan quietly',
              requiredTags: ['quietMove'],
              ratingMin: 2025,
              ratingMax: 2100,
              minPlays: 50,
            },
            {
              id: '8.2.3',
              name: 'Quiet: Decisive',
              description: 'The quiet move that wins the game',
              requiredTags: ['quietMove'],
              ratingMin: 2050,
              ratingMax: 2125,
              minPlays: 50,
            },
            {
              id: '8.2.4',
              name: 'Quiet: Challenge',
              description: 'Master quiet move mastery',
              requiredTags: ['quietMove'],
              ratingMin: 2075,
              ratingMax: 2150,
              minPlays: 50,
            },
          ],
        },
        // Section 3: The In-Between Move
        {
          id: '8.3',
          name: 'The In-Between Move',
          description: 'Zwischenzug/intermezzo mastery',
          themeIntroMessage: `Non-linear storytelling. That's the whole trick.

Your opponent expects you to recapture. They expect the obvious response. But you don't give them what they expect — you throw in a move from a completely different chapter.

The intermezzo. The in-between move. The scene that comes out of nowhere and changes the whole plot.

Wiggle your big toe. Then wiggle the whole position.`,
          lessons: [
            {
              id: '8.3.1',
              name: 'Intermezzo: Basics',
              description: 'Slip in the unexpected move',
              requiredTags: ['intermezzo'],
              ratingMin: 2000,
              ratingMax: 2075,
              minPlays: 50,
            },
            {
              id: '8.3.2',
              name: 'Intermezzo: Check First',
              description: 'In-between checks before recapturing',
              requiredTags: ['intermezzo'],
              ratingMin: 2025,
              ratingMax: 2125,
              minPlays: 50,
            },
            {
              id: '8.3.3',
              name: 'Intermezzo: Deep',
              description: 'Complex in-between sequences',
              requiredTags: ['intermezzo'],
              ratingMin: 2050,
              ratingMax: 2150,
              minPlays: 50,
            },
            {
              id: '8.3.4',
              name: 'Intermezzo: Challenge',
              description: 'Master the non-linear move',
              requiredTags: ['intermezzo'],
              ratingMin: 2075,
              ratingMax: 2175,
              minPlays: 50,
            },
          ],
        },
        // Section 4: Block 1 Review
        {
          id: '8.4',
          name: 'Review: The Refined Palate',
          description: 'Mixed practice with Block 1 themes',
          isReview: true,
          themeIntroMessage: `Positional squeezes. Quiet moves. Intermezzo.

Three concepts that separate the players who speak en passant from the ones who don't. No fireworks — just pure positional fluency.

Now let's see if you're conversational or just tourist-level.`,
          lessons: [
            {
              id: '8.4.1',
              name: 'Review: Squeeze',
              description: 'Positional squeeze review',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['zugzwang', 'defensiveMove'],
              ratingMin: 2025,
              ratingMax: 2125,
              minPlays: 50,
            },
            {
              id: '8.4.2',
              name: 'Review: Quiet & Between',
              description: 'Quiet moves and intermezzo review',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['quietMove', 'intermezzo'],
              ratingMin: 2050,
              ratingMax: 2150,
              minPlays: 50,
            },
            {
              id: '8.4.3',
              name: 'Review: Refined Mix',
              description: 'All Block 1 themes combined',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['zugzwang', 'defensiveMove', 'quietMove', 'intermezzo'],
              ratingMin: 2050,
              ratingMax: 2175,
              minPlays: 50,
            },
            {
              id: '8.4.4',
              name: 'Review: Block 1 Challenge',
              description: 'Block 1 mastery test',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['zugzwang', 'defensiveMove', 'quietMove', 'intermezzo'],
              ratingMin: 2075,
              ratingMax: 2175,
              minPlays: 50,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 2: DOES HE LOOK LIKE A BISHOP?
    // Deep combinations that see through everything
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-2',
      name: 'Does He Look Like a Bishop?',
      description: 'Deep combinations that see through everything.',
      blockIntroMessage: `What does your opponent's position look like? Does it look like it can handle a sacrifice? Does it LOOK like it can survive five moves of forced play?

Then why are you treating it like it can?

Deep sacrifices. Long mating sequences. X-Ray attacks that see through pieces. At this level, you don't just calculate — you interrogate the position until it confesses.`,
      sections: [
        // Section 5: Deep Sacrifices
        {
          id: '8.5',
          name: 'Deep Sacrifices',
          description: 'Master-level sacrificial play',
          themeIntroMessage: `Here's the deal. At master level, a sacrifice isn't just throwing material at the board and hoping for the best. It's a calculated investment.

You give up a piece and you KNOW — five, six moves from now — exactly where every piece will be standing when the dust settles.

That's not hope. That's style.`,
          lessons: [
            {
              id: '8.5.1',
              name: 'Sac: Positional',
              description: 'Sacrifice for deep positional advantage',
              requiredTags: ['sacrifice'],
              ratingMin: 2000,
              ratingMax: 2100,
              minPlays: 100,
            },
            {
              id: '8.5.2',
              name: 'Sac: Exchange',
              description: 'Master-level exchange sacrifices',
              requiredTags: ['sacrifice'],
              ratingMin: 2025,
              ratingMax: 2125,
              minPlays: 100,
            },
            {
              id: '8.5.3',
              name: 'Sac: Multi-Piece',
              description: 'Give up everything for the win',
              requiredTags: ['sacrifice'],
              ratingMin: 2075,
              ratingMax: 2175,
              minPlays: 100,
            },
            {
              id: '8.5.4',
              name: 'Sac: Challenge',
              description: 'The deepest investments pay off',
              requiredTags: ['sacrifice'],
              ratingMin: 2100,
              ratingMax: 2200,
              minPlays: 100,
            },
          ],
        },
        // Section 6: The Long Goodbye
        {
          id: '8.6',
          name: 'The Long Goodbye',
          description: 'Mate in 5+ at master level',
          themeIntroMessage: `Some conversations take a while. Five moves. Six moves. Every single one forced.

At this level, the long checkmate isn't just calculation — it's vision. You see the finale before you play the opening note. Like a soundtrack that plays in your head before the scene even starts.

Find move one. The rest will follow.`,
          lessons: [
            {
              id: '8.6.1',
              name: 'Long Mate: Setup',
              description: 'Five-move mating sequences',
              requiredTags: ['mateIn5'],
              ratingMin: 2000,
              ratingMax: 2100,
              minPlays: 50,
            },
            {
              id: '8.6.2',
              name: 'Long Mate: Sacrificial',
              description: 'Long mates involving sacrifices',
              requiredTags: ['mateIn5'],
              ratingMin: 2050,
              ratingMax: 2150,
              minPlays: 50,
            },
            {
              id: '8.6.3',
              name: 'Long Mate: Complex',
              description: 'Deep forced mating lines',
              requiredTags: ['mateIn5'],
              ratingMin: 2075,
              ratingMax: 2175,
              minPlays: 50,
            },
            {
              id: '8.6.4',
              name: 'Long Mate: Challenge',
              description: 'Master-level long combinations',
              requiredTags: ['mateIn5'],
              ratingMin: 2100,
              ratingMax: 2200,
              minPlays: 50,
            },
          ],
        },
        // Section 7: Through the Looking Glass
        {
          id: '8.7',
          name: 'Through the Looking Glass',
          description: 'X-Ray attacks and interference',
          themeIntroMessage: `X-Ray attacks — when your piece looks THROUGH another piece to hit the target behind it. Interference — when you jam a piece into the line and break everything.

Both are about lines. Diagonals. Files. Ranks. And what happens when you mess with them.

It's like that moment in the scene where you realize the whole conversation had a second meaning. Look deeper.`,
          lessons: [
            {
              id: '8.7.1',
              name: 'X-Ray: Master',
              description: 'Master-level X-Ray attacks',
              requiredTags: ['xRayAttack'],
              ratingMin: 2000,
              ratingMax: 2100,
              minPlays: 50,
            },
            {
              id: '8.7.2',
              name: 'Interference: Master',
              description: 'Master-level interference tactics',
              requiredTags: ['interference'],
              ratingMin: 2025,
              ratingMax: 2125,
              minPlays: 50,
            },
            {
              id: '8.7.3',
              name: 'Lines: Combined',
              description: 'Mixed X-Ray and interference',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['xRayAttack', 'interference'],
              ratingMin: 2050,
              ratingMax: 2175,
              minPlays: 50,
            },
            {
              id: '8.7.4',
              name: 'Lines: Challenge',
              description: 'Master line-based tactics',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['xRayAttack', 'interference'],
              ratingMin: 2075,
              ratingMax: 2200,
              minPlays: 50,
            },
          ],
        },
        // Section 8: Block 2 Review
        {
          id: '8.8',
          name: 'Review: The Technique',
          description: 'Mixed deep combination practice',
          isReview: true,
          themeIntroMessage: `Sacrifices. Long mates. X-Rays. Interference.

Does the position look like it can handle this? No? Then stop treating it like it can.

Four ways to interrogate a position until it gives up everything. Mixed together. No mercy.`,
          lessons: [
            {
              id: '8.8.1',
              name: 'Review: Sacrifices',
              description: 'Master-level sacrificial play review',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'mateIn5'],
              ratingMin: 2025,
              ratingMax: 2150,
              minPlays: 50,
            },
            {
              id: '8.8.2',
              name: 'Review: Long Lines',
              description: 'Long mates and line tactics review',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn5', 'xRayAttack', 'interference'],
              ratingMin: 2050,
              ratingMax: 2175,
              minPlays: 50,
            },
            {
              id: '8.8.3',
              name: 'Review: Full Technique',
              description: 'All Block 2 themes combined',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'mateIn5', 'xRayAttack', 'interference'],
              ratingMin: 2075,
              ratingMax: 2200,
              minPlays: 50,
            },
            {
              id: '8.8.4',
              name: 'Review: Block 2 Challenge',
              description: 'Block 2 mastery test',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'mateIn5', 'xRayAttack', 'interference'],
              ratingMin: 2100,
              ratingMax: 2200,
              minPlays: 50,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 3: THAT IS A TASTY FORK
    // Winning material and converting advantages
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-3',
      name: 'That IS a Tasty Fork',
      description: 'Winning material and converting advantages.',
      blockIntroMessage: `Mmm-mmm. That IS a tasty fork. Mind if I have some of your material?

Deflection. Attraction. Endgame technique. Kingside and queenside attacks. This is the part where you take what's yours — a piece here, a pawn there, a whole position if they let you.

At 2000+, every tactic is hiding inside something else. The fork is three moves deep. The deflection sets up an endgame win. You just have to see the whole menu.`,
      sections: [
        // Section 9: The Art of Misdirection
        {
          id: '8.9',
          name: 'The Art of Misdirection',
          description: 'Deflection and attraction at master level',
          themeIntroMessage: `Misdirection. The oldest trick in the book — and still the coolest.

Deflection: pull the defender away from what it's guarding. Attraction: lure a piece onto a square where it doesn't want to be.

Both are about making your opponent's pieces work against them. It's not a trick — it's a conversation. And you're leading.`,
          lessons: [
            {
              id: '8.9.1',
              name: 'Deflection: Master',
              description: 'Master-level deflection tactics',
              requiredTags: ['deflection'],
              ratingMin: 2000,
              ratingMax: 2100,
              minPlays: 50,
            },
            {
              id: '8.9.2',
              name: 'Attraction: Master',
              description: 'Master-level attraction tactics',
              requiredTags: ['attraction'],
              ratingMin: 2025,
              ratingMax: 2125,
              minPlays: 50,
            },
            {
              id: '8.9.3',
              name: 'Misdirection: Combined',
              description: 'Mixed deflection and attraction',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection', 'attraction'],
              ratingMin: 2050,
              ratingMax: 2150,
              minPlays: 50,
            },
            {
              id: '8.9.4',
              name: 'Misdirection: Challenge',
              description: 'Master the art of misdirection',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection', 'attraction'],
              ratingMin: 2075,
              ratingMax: 2175,
              minPlays: 50,
            },
          ],
        },
        // Section 10: Endgame Cinema
        {
          id: '8.10',
          name: 'Endgame Cinema',
          description: 'Master-level endgames (all types)',
          themeIntroMessage: `The endgame. The third act. Where the whole story comes together.

Rook endgames that hinge on one tempo. Pawn races where promotion is one move away. Queen endgames with perpetual check lurking. Minor piece finesse.

This is the final scene. Make it count.`,
          lessons: [
            {
              id: '8.10.1',
              name: 'Rook Endgame: Master',
              description: 'Master-level rook endgames',
              requiredTags: ['rookEndgame'],
              ratingMin: 2000,
              ratingMax: 2100,
              minPlays: 50,
            },
            {
              id: '8.10.2',
              name: 'Pawn & Queen Endgames',
              description: 'Master pawn and queen endgames',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pawnEndgame', 'queenEndgame'],
              ratingMin: 2025,
              ratingMax: 2150,
              minPlays: 50,
            },
            {
              id: '8.10.3',
              name: 'Minor Piece Endgames',
              description: 'Bishop and knight endgames',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['bishopEndgame', 'knightEndgame'],
              ratingMin: 2050,
              ratingMax: 2175,
              minPlays: 50,
            },
            {
              id: '8.10.4',
              name: 'Endgame: Challenge',
              description: 'All endgame types combined',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame', 'pawnEndgame', 'queenEndgame', 'bishopEndgame', 'knightEndgame'],
              ratingMin: 2075,
              ratingMax: 2200,
              minPlays: 50,
            },
          ],
        },
        // Section 11: The Mexican Standoff
        {
          id: '8.11',
          name: 'The Mexican Standoff',
          description: 'Kingside and queenside attacks',
          themeIntroMessage: `Three players. Three guns. Nobody wants to shoot first.

That's a Mexican standoff — and that's what happens when both sides are attacking. Kingside. Queenside. The tension is unbearable.

At master level, the question isn't IF you attack. It's WHERE. Pick a side. Commit. And don't blink.`,
          lessons: [
            {
              id: '8.11.1',
              name: 'Kingside Attack: Master',
              description: 'Master-level kingside assaults',
              requiredTags: ['kingsideAttack'],
              ratingMin: 2000,
              ratingMax: 2100,
              minPlays: 50,
            },
            {
              id: '8.11.2',
              name: 'Queenside Attack: Master',
              description: 'Master-level queenside operations',
              requiredTags: ['queensideAttack'],
              ratingMin: 2025,
              ratingMax: 2125,
              minPlays: 50,
            },
            {
              id: '8.11.3',
              name: 'Both Flanks',
              description: 'Mixed kingside and queenside play',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['kingsideAttack', 'queensideAttack'],
              ratingMin: 2050,
              ratingMax: 2175,
              minPlays: 50,
            },
            {
              id: '8.11.4',
              name: 'Standoff: Challenge',
              description: 'Master flank operations',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['kingsideAttack', 'queensideAttack'],
              ratingMin: 2100,
              ratingMax: 2200,
              minPlays: 50,
            },
          ],
        },
        // Section 12: Block 3 Review
        {
          id: '8.12',
          name: 'Review: The Full Menu',
          description: 'Mixed Block 3 themes',
          isReview: true,
          themeIntroMessage: `Deflection. Attraction. Endgames. Kingside. Queenside.

The full menu. And let me tell you — everything on it is tasty. Forks. Deflections. Endgame conversions. Flank attacks.

No hints about what you're being served. Just eat what's in front of you.`,
          lessons: [
            {
              id: '8.12.1',
              name: 'Review: Misdirection',
              description: 'Deflection and attraction review',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection', 'attraction'],
              ratingMin: 2025,
              ratingMax: 2150,
              minPlays: 50,
            },
            {
              id: '8.12.2',
              name: 'Review: Endgames',
              description: 'All endgame types review',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame', 'pawnEndgame', 'queenEndgame'],
              ratingMin: 2050,
              ratingMax: 2175,
              minPlays: 50,
            },
            {
              id: '8.12.3',
              name: 'Review: Attacks',
              description: 'Kingside and queenside review',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['kingsideAttack', 'queensideAttack'],
              ratingMin: 2075,
              ratingMax: 2200,
              minPlays: 50,
            },
            {
              id: '8.12.4',
              name: 'Review: Block 3 Mix',
              description: 'All Block 3 tactics combined',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection', 'attraction', 'rookEndgame', 'kingsideAttack', 'queensideAttack'],
              ratingMin: 2100,
              ratingMax: 2200,
              minPlays: 50,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 4: THE PATH OF THE RIGHTEOUS PAWN
    // The final journey. Every theme. Every tactic.
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-4',
      name: 'The Path of the Righteous Pawn',
      description: 'The final journey. Every theme. Every tactic.',
      blockIntroMessage: `The path of the righteous pawn is beset on all sides by the inequities of the selfish and the tyranny of stronger pieces. Blessed is the pawn who, in the name of good positional play and calculation, shepherds the weak squares through the valley of the middlegame.

That's you. Every theme. Every tactic from Level 8. Mixed together. No labels. No hints.

You've walked the path. Now prove you belong at the end of it.`,
      sections: [
        // Section 13: Level 8 Review
        {
          id: '8.13',
          name: 'Level 8 Review',
          description: 'Mixed practice from all blocks',
          isReview: true,
          themeIntroMessage: `Every chapter. Every scene. Every tactic from Level 8, remixed and reshuffled.

No chapter headings. No theme labels. Just the board, the position, and whatever the director throws at you.

You've got the whole script memorized. Now perform it.`,
          lessons: [
            {
              id: '8.13.1',
              name: 'Mixed: Refined Palate',
              description: 'Zugzwang, quiet moves, and intermezzo',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['defensiveMove', 'quietMove', 'intermezzo'],
              ratingMin: 2025,
              ratingMax: 2150,
              minPlays: 50,
            },
            {
              id: '8.13.2',
              name: 'Mixed: Deep Technique',
              description: 'Sacrifices, long mates, and line tactics',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'mateIn5', 'xRayAttack', 'interference'],
              ratingMin: 2050,
              ratingMax: 2175,
              minPlays: 50,
            },
            {
              id: '8.13.3',
              name: 'Mixed: Full Cast',
              description: 'Misdirection, endgames, and attacks',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['deflection', 'attraction', 'rookEndgame', 'kingsideAttack', 'queensideAttack'],
              ratingMin: 2075,
              ratingMax: 2200,
              minPlays: 50,
            },
            {
              id: '8.13.4',
              name: 'Mixed: Everything',
              description: 'All Level 8 themes',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['defensiveMove', 'quietMove', 'sacrifice', 'mateIn5', 'deflection', 'rookEndgame', 'kingsideAttack'],
              ratingMin: 2100,
              ratingMax: 2200,
              minPlays: 50,
            },
          ],
        },
        // Section 14: Level 8 Final
        {
          id: '8.14',
          name: 'Level 8 Final',
          description: 'The ultimate test',
          isReview: true,
          themeIntroMessage: `The final scene. The credits are waiting. But first — four more puzzles. The hardest ones.

Everything from Level 8, cranked to the maximum. If you can handle this, you're not just a 2000-rated player anymore. You're something else entirely.

Say checkmate again. I double dare you.`,
          lessons: [
            {
              id: '8.14.1',
              name: 'Final: Subtle Mastery',
              description: 'Zugzwang, quiet moves, and intermezzo',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['defensiveMove', 'quietMove', 'intermezzo', 'sacrifice'],
              ratingMin: 2050,
              ratingMax: 2175,
              minPlays: 50,
            },
            {
              id: '8.14.2',
              name: 'Final: Deep Lines',
              description: 'Long mates, X-Rays, and interference',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn5', 'xRayAttack', 'interference', 'deflection'],
              ratingMin: 2075,
              ratingMax: 2200,
              minPlays: 50,
            },
            {
              id: '8.14.3',
              name: 'Final: Complete Toolkit',
              description: 'Every weapon at your disposal',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'deflection', 'attraction', 'rookEndgame', 'kingsideAttack', 'queensideAttack'],
              ratingMin: 2100,
              ratingMax: 2225,
              minPlays: 50,
            },
            {
              id: '8.14.4',
              name: 'Level 8 Mastery',
              description: 'Prove you belong at master level',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['defensiveMove', 'quietMove', 'intermezzo', 'sacrifice', 'mateIn5', 'deflection', 'rookEndgame', 'kingsideAttack'],
              ratingMin: 2125,
              ratingMax: 2250,
              minPlays: 50,
            },
          ],
        },
      ],
    },
  ],
};

// Helper functions
export function getAllSectionsL8(): Section[] {
  return level8V2.blocks.flatMap(b => b.sections);
}

export function getAllLessonsL8(): LessonCriteria[] {
  return getAllSectionsL8().flatMap(s => s.lessons);
}

export function getLessonByIdL8(id: string): LessonCriteria | undefined {
  return getAllLessonsL8().find(l => l.id === id);
}

export function getLessonCountL8(): number {
  return getAllLessonsL8().length;
}

// Import IntroMessages type from level1
import { IntroMessages } from './level1-v2-curriculum';

/**
 * Get block and section context for a lesson
 */
function getLessonContextL8(lessonId: string) {
  for (const block of level8V2.blocks) {
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
function isFirstLessonInBlockL8(lessonId: string): boolean {
  const context = getLessonContextL8(lessonId);
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
function isFirstLessonInSectionL8(lessonId: string): boolean {
  const context = getLessonContextL8(lessonId);
  if (!context) return false;

  const { section } = context;
  if (section.lessons.length === 0) return false;

  return section.lessons[0].id === lessonId;
}

/**
 * Get intro messages to show for a lesson
 * Returns block intro if first in block, theme intro if first in section
 */
export function getIntroMessagesL8(lessonId: string): IntroMessages {
  const context = getLessonContextL8(lessonId);
  if (!context) return {};

  const { block, section } = context;
  const messages: IntroMessages = {};

  // Check if first lesson in block
  if (isFirstLessonInBlockL8(lessonId) && block.blockIntroMessage) {
    messages.blockIntro = {
      title: block.name,
      message: block.blockIntroMessage,
    };
  }

  // Check if first lesson in section
  if (isFirstLessonInSectionL8(lessonId) && section.themeIntroMessage) {
    messages.themeIntro = {
      title: section.name,
      message: section.themeIntroMessage,
    };
  }

  return messages;
}
