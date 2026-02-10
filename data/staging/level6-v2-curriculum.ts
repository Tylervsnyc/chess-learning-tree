/**
 * Level 6 V2 Curriculum (1600-1800 ELO)
 * "Why So Serious?"
 *
 * The Dark Knight. Gotham's chess underground.
 * Quiet moves, zwischenzugs, deep sacrifices, and complex endgames.
 * You don't just calculate anymore — you outthink.
 *
 * Structure:
 * - Blocks 1-3: 3 content sections + 1 review section = 12 sections, 48 lessons
 * - Block 4: 2 review sections = 2 sections, 8 lessons
 * - Total: 14 sections, 56 lessons
 *
 * Block 1: Why So Serious? - Subtle, surprising tactics
 * Block 2: The Rook Gotham Deserves - Deep calculation
 * Block 3: Some Men Just Want to Watch the Board Burn - Aggressive play
 * Block 4: Checkmate Is the Best Policy, Harvey - Final mastery
 *
 * Clean puzzles: 500+ plays for quality verification
 */

import { LessonCriteria, Section, Block, Level } from './level1-v2-curriculum';

export const level6V2: Level = {
  id: 'level-6',
  name: 'Why So Serious?',
  ratingRange: '1600-1800',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: WHY SO SERIOUS?
    // Subtle, surprising tactics
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'Why So Serious?',
      description: 'Subtle, surprising tactics.',
      blockIntroMessage: `Welcome to Level 6. Why So Serious?

Because at 1600+, brute force won't cut it. The best moves aren't always checks and captures.

Quiet moves. In-between shots. X-ray lines. The tactics nobody sees coming. Time to think like Gotham's finest.`,
      sections: [
        // Section 1: Quiet Moves
        {
          id: '6.1',
          name: 'Quiet Moves',
          description: 'No check. No capture. Total devastation.',
          themeIntroMessage: `The most dangerous move on the board? The one that doesn't look dangerous.

No check. No capture. Just a quiet piece placement that creates an unstoppable threat.

When your opponent relaxes, that's when you strike.`,
          lessons: [
            {
              id: '6.1.1',
              name: 'Quiet Moves: Basics',
              description: 'Silent but deadly tactics',
              requiredTags: ['quietMove'],
              ratingMin: 1600,
              ratingMax: 1700,
              minPlays: 500,
            },
            {
              id: '6.1.2',
              name: 'Quiet Moves: Threats',
              description: 'Create unstoppable threats silently',
              requiredTags: ['quietMove'],
              ratingMin: 1625,
              ratingMax: 1725,
              minPlays: 500,
            },
            {
              id: '6.1.3',
              name: 'Quiet Moves: Combinations',
              description: 'Quiet moves within combinations',
              requiredTags: ['quietMove'],
              ratingMin: 1650,
              ratingMax: 1750,
              minPlays: 500,
            },
            {
              id: '6.1.4',
              name: 'Quiet Moves: Challenge',
              description: 'Find the silent winner',
              requiredTags: ['quietMove'],
              ratingMin: 1700,
              ratingMax: 1800,
              minPlays: 500,
            },
          ],
        },
        // Section 2: The Zwischenzug
        {
          id: '6.2',
          name: 'The Zwischenzug',
          description: 'In-between moves that change everything',
          themeIntroMessage: `Zwischenzug: the in-between move. German for "I just ruined your plan."

You expected a recapture? Surprise — there's a check first. Or a threat. Or both.

The zwischenzug turns a losing trade into a winning one.`,
          lessons: [
            {
              id: '6.2.1',
              name: 'Zwischenzug: Basics',
              description: 'The in-between move',
              requiredTags: ['intermezzo'],
              ratingMin: 1600,
              ratingMax: 1700,
              minPlays: 500,
            },
            {
              id: '6.2.2',
              name: 'Zwischenzug: Check First',
              description: 'Sneak in a check before recapturing',
              requiredTags: ['intermezzo'],
              ratingMin: 1625,
              ratingMax: 1725,
              minPlays: 500,
            },
            {
              id: '6.2.3',
              name: 'Zwischenzug: Counter-Threat',
              description: 'Create a bigger threat mid-exchange',
              requiredTags: ['intermezzo'],
              ratingMin: 1650,
              ratingMax: 1750,
              minPlays: 500,
            },
            {
              id: '6.2.4',
              name: 'Zwischenzug: Challenge',
              description: 'Find the in-between shot',
              requiredTags: ['intermezzo'],
              ratingMin: 1700,
              ratingMax: 1800,
              minPlays: 500,
            },
          ],
        },
        // Section 3: X-Ray Vision
        {
          id: '6.3',
          name: 'X-Ray Vision',
          description: 'See through pieces to the target beyond',
          themeIntroMessage: `X-ray attacks: your piece sees through the obstacle to the target behind it.

A rook stares through a queen to the king. A bishop lines up two pieces on a diagonal.

Like having X-ray vision on the chessboard.`,
          lessons: [
            {
              id: '6.3.1',
              name: 'X-Ray: Basics',
              description: 'See through to the target',
              requiredTags: ['xRayAttack'],
              ratingMin: 1600,
              ratingMax: 1725,
              minPlays: 100,
            },
            {
              id: '6.3.2',
              name: 'X-Ray: Rook Lines',
              description: 'Rook x-ray tactics',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['xRayAttack', 'discoveredAttack'],
              ratingMin: 1625,
              ratingMax: 1750,
              minPlays: 100,
            },
            {
              id: '6.3.3',
              name: 'X-Ray: Diagonal Lines',
              description: 'Bishop and queen x-ray patterns',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['xRayAttack', 'discoveredAttack'],
              ratingMin: 1650,
              ratingMax: 1775,
              minPlays: 100,
            },
            {
              id: '6.3.4',
              name: 'X-Ray: Challenge',
              description: 'Complex x-ray combinations',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['xRayAttack', 'discoveredAttack'],
              ratingMin: 1700,
              ratingMax: 1800,
              minPlays: 100,
            },
          ],
        },
        // Section 4: Block 1 Review
        {
          id: '6.4',
          name: 'Review: The Unexpected',
          description: 'Mixed subtle tactics practice',
          isReview: true,
          themeIntroMessage: `Quiet moves. Zwischenzugs. X-ray attacks.

The moves nobody expects. The tactics that don't announce themselves.

Time to prove you can find the hidden blow.`,
          lessons: [
            {
              id: '6.4.1',
              name: 'Review: Quiet Moves',
              description: 'Silent tactical precision',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['quietMove'],
              ratingMin: 1625,
              ratingMax: 1750,
              minPlays: 500,
            },
            {
              id: '6.4.2',
              name: 'Review: In-Between',
              description: 'Zwischenzug mastery',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['intermezzo'],
              ratingMin: 1650,
              ratingMax: 1775,
              minPlays: 500,
            },
            {
              id: '6.4.3',
              name: 'Review: X-Ray',
              description: 'See through everything',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['xRayAttack', 'discoveredAttack'],
              ratingMin: 1650,
              ratingMax: 1800,
              minPlays: 100,
            },
            {
              id: '6.4.4',
              name: 'Review: Block 1 Mix',
              description: 'All subtle tactics combined',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['quietMove', 'intermezzo', 'xRayAttack', 'discoveredAttack'],
              ratingMin: 1675,
              ratingMax: 1800,
              minPlays: 100,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 2: THE ROOK GOTHAM DESERVES
    // Deep calculation and sacrifice
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-2',
      name: 'The Rook Gotham Deserves',
      description: 'Deep calculation and sacrifice.',
      blockIntroMessage: `It's not who you are underneath. It's what you sacrifice that defines you.

Deep sacrifices. Long combinations. Attraction plays that drag the king into the open.

This is where calculation meets courage. Be the rook Gotham deserves.`,
      sections: [
        // Section 5: Deep Sacrifices
        {
          id: '6.5',
          name: 'Deep Sacrifices',
          description: 'Multi-piece sacrificial combinations',
          themeIntroMessage: `Give up a piece. Give up two. The compensation isn't obvious to most.

But you see it. The attack. The mate. The position that can't be held.

Deep sacrifices require deep trust in your calculation.`,
          lessons: [
            {
              id: '6.5.1',
              name: 'Deep Sac: Piece',
              description: 'Full piece sacrifice for attack',
              requiredTags: ['sacrifice'],
              ratingMin: 1600,
              ratingMax: 1700,
              minPlays: 500,
            },
            {
              id: '6.5.2',
              name: 'Deep Sac: Exchange',
              description: 'Exchange sacrifice for domination',
              requiredTags: ['sacrifice'],
              ratingMin: 1625,
              ratingMax: 1725,
              minPlays: 500,
            },
            {
              id: '6.5.3',
              name: 'Deep Sac: Multiple',
              description: 'Multiple sacrifices in sequence',
              requiredTags: ['sacrifice'],
              ratingMin: 1675,
              ratingMax: 1775,
              minPlays: 500,
            },
            {
              id: '6.5.4',
              name: 'Deep Sac: Challenge',
              description: 'Find the deep investment',
              requiredTags: ['sacrifice'],
              ratingMin: 1700,
              ratingMax: 1800,
              minPlays: 500,
            },
          ],
        },
        // Section 6: Complex Combinations
        {
          id: '6.6',
          name: 'Complex Combinations',
          description: 'Long forcing sequences, 4+ moves deep',
          themeIntroMessage: `Four moves deep. Five. Six. Every move forced. Every response anticipated.

Long combinations are the ultimate test of calculation. One slip and it all falls apart.

See the whole line before you play the first move.`,
          lessons: [
            {
              id: '6.6.1',
              name: 'Mate in 4: L6',
              description: 'Four-move mating sequences',
              requiredTags: ['mateIn4'],
              ratingMin: 1600,
              ratingMax: 1725,
              minPlays: 100,
            },
            {
              id: '6.6.2',
              name: 'Mate in 4: Advanced',
              description: 'Complex four-move mates',
              requiredTags: ['mateIn4'],
              ratingMin: 1650,
              ratingMax: 1775,
              minPlays: 100,
            },
            {
              id: '6.6.3',
              name: 'Mate in 5: L6',
              description: 'Five-move mating sequences',
              requiredTags: ['mateIn5'],
              ratingMin: 1600,
              ratingMax: 1800,
              minPlays: 100,
            },
            {
              id: '6.6.4',
              name: 'Long Combos: Challenge',
              description: 'The deepest calculations',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn4', 'mateIn5'],
              ratingMin: 1700,
              ratingMax: 1800,
              minPlays: 100,
            },
          ],
        },
        // Section 7: Attraction & Lure
        {
          id: '6.7',
          name: 'Attraction & Lure',
          description: 'Draw pieces to fatal squares',
          themeIntroMessage: `Come into my parlor, said the spider to the king.

Attraction forces the opponent's piece to a bad square. Clearance removes your own piece from a good one.

Both create tactical opportunities that didn't exist a move ago.`,
          lessons: [
            {
              id: '6.7.1',
              name: 'Attraction: Basics',
              description: 'Lure pieces to vulnerable squares',
              requiredTags: ['attraction'],
              ratingMin: 1600,
              ratingMax: 1700,
              minPlays: 500,
            },
            {
              id: '6.7.2',
              name: 'Attraction: King Hunt',
              description: 'Drag the king into the open',
              requiredTags: ['attraction'],
              ratingMin: 1625,
              ratingMax: 1750,
              minPlays: 500,
            },
            {
              id: '6.7.3',
              name: 'Clearance: Create Space',
              description: 'Move your own piece to unleash tactics',
              requiredTags: ['clearance'],
              ratingMin: 1650,
              ratingMax: 1775,
              minPlays: 500,
            },
            {
              id: '6.7.4',
              name: 'Attract & Clear: Challenge',
              description: 'Combined attraction and clearance',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['attraction', 'clearance'],
              ratingMin: 1700,
              ratingMax: 1800,
              minPlays: 500,
            },
          ],
        },
        // Section 8: Block 2 Review
        {
          id: '6.8',
          name: 'Review: Calculated Justice',
          description: 'Mixed deep calculation practice',
          isReview: true,
          themeIntroMessage: `Deep sacrifices. Long combinations. Attraction plays.

Every move calculated. Every sacrifice justified.

Prove your calculation is bulletproof.`,
          lessons: [
            {
              id: '6.8.1',
              name: 'Review: Sacrifices',
              description: 'Deep material investments',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice'],
              ratingMin: 1625,
              ratingMax: 1750,
              minPlays: 500,
            },
            {
              id: '6.8.2',
              name: 'Review: Long Mates',
              description: 'Four and five move mates',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn4', 'mateIn5'],
              ratingMin: 1650,
              ratingMax: 1800,
              minPlays: 100,
            },
            {
              id: '6.8.3',
              name: 'Review: Attraction',
              description: 'Lure and clear',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['attraction', 'clearance'],
              ratingMin: 1650,
              ratingMax: 1775,
              minPlays: 500,
            },
            {
              id: '6.8.4',
              name: 'Review: Block 2 Mix',
              description: 'All deep calculation tactics',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'mateIn4', 'mateIn5', 'attraction', 'clearance'],
              ratingMin: 1675,
              ratingMax: 1800,
              minPlays: 100,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 3: SOME MEN JUST WANT TO WATCH THE BOARD BURN
    // Aggressive play and endgame mastery
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-3',
      name: 'Some Men Just Want to Watch the Board Burn',
      description: 'Aggressive play and endgame mastery.',
      blockIntroMessage: `Some men just want to watch the board burn. Let's be those men.

Kingside storms. Exposed king exploitation. And when the smoke clears — expert endgame technique to convert.

Attack with fury. Finish with precision.`,
      sections: [
        // Section 9: Kingside Assault
        {
          id: '6.9',
          name: 'Kingside Assault',
          description: 'Advanced king attacks',
          themeIntroMessage: `The kingside is where games are won. Pawn storms. Piece sacrifices. Ripping open the castle.

At this level, attacks require preparation. You can't just throw pieces at the king and hope.

Plan the assault. Execute with precision.`,
          lessons: [
            {
              id: '6.9.1',
              name: 'Kingside: Setup',
              description: 'Prepare the kingside attack',
              requiredTags: ['kingsideAttack'],
              ratingMin: 1600,
              ratingMax: 1700,
              minPlays: 500,
            },
            {
              id: '6.9.2',
              name: 'Kingside: Breakthrough',
              description: 'Break through the castled position',
              requiredTags: ['kingsideAttack'],
              ratingMin: 1625,
              ratingMax: 1725,
              minPlays: 500,
            },
            {
              id: '6.9.3',
              name: 'Exposed King: Punish',
              description: 'Exploit the weakened king',
              requiredTags: ['exposedKing'],
              ratingMin: 1650,
              ratingMax: 1775,
              minPlays: 500,
            },
            {
              id: '6.9.4',
              name: 'King Attack: Challenge',
              description: 'Full-scale kingside assault',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['kingsideAttack', 'exposedKing'],
              ratingMin: 1700,
              ratingMax: 1800,
              minPlays: 500,
            },
          ],
        },
        // Section 10: Breaking the Defense
        {
          id: '6.10',
          name: 'Breaking the Defense',
          description: 'Interference and deflection combos',
          themeIntroMessage: `Their defense has one flaw. Find it. Exploit it.

Interference blocks a defender's line. Deflection drags it away from its job.

Either way, the defense crumbles.`,
          lessons: [
            {
              id: '6.10.1',
              name: 'Interference: L6',
              description: 'Block the defensive line',
              requiredTags: ['interference'],
              ratingMin: 1600,
              ratingMax: 1725,
              minPlays: 100,
            },
            {
              id: '6.10.2',
              name: 'Deflection: L6',
              description: 'Force the defender away',
              requiredTags: ['deflection'],
              ratingMin: 1625,
              ratingMax: 1725,
              minPlays: 500,
            },
            {
              id: '6.10.3',
              name: 'Remove the Guard',
              description: 'Eliminate the key defender',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['interference', 'deflection'],
              ratingMin: 1650,
              ratingMax: 1775,
              minPlays: 100,
            },
            {
              id: '6.10.4',
              name: 'Break Defense: Challenge',
              description: 'Shatter the fortress',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['interference', 'deflection'],
              ratingMin: 1700,
              ratingMax: 1800,
              minPlays: 100,
            },
          ],
        },
        // Section 11: Complex Endgames
        {
          id: '6.11',
          name: 'Complex Endgames',
          description: 'Expert-level endgame technique',
          themeIntroMessage: `The endgame is where the real chess happens. Queens are gone. Rooks are few.

Every pawn matters. Every tempo counts. One wrong move and the win turns to a draw.

Master these endgames and you'll convert positions others can't.`,
          lessons: [
            {
              id: '6.11.1',
              name: 'Rook Endgame: L6',
              description: 'Expert rook endgames',
              requiredTags: ['rookEndgame'],
              ratingMin: 1600,
              ratingMax: 1800,
              minPlays: 100,
            },
            {
              id: '6.11.2',
              name: 'Pawn Endgame: L6',
              description: 'Expert pawn endgames',
              requiredTags: ['pawnEndgame'],
              ratingMin: 1600,
              ratingMax: 1800,
              minPlays: 100,
            },
            {
              id: '6.11.3',
              name: 'Queen Endgame: L6',
              description: 'Expert queen endgames',
              requiredTags: ['queenEndgame'],
              ratingMin: 1600,
              ratingMax: 1800,
              minPlays: 100,
            },
            {
              id: '6.11.4',
              name: 'Mixed Endgames: L6',
              description: 'Complex endgame positions',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame', 'pawnEndgame', 'queenEndgame', 'bishopEndgame'],
              ratingMin: 1650,
              ratingMax: 1800,
              minPlays: 100,
            },
          ],
        },
        // Section 12: Block 3 Review
        {
          id: '6.12',
          name: 'Review: Controlled Chaos',
          description: 'Mixed aggressive play and endgames',
          isReview: true,
          themeIntroMessage: `Attack the king. Break the defense. Convert the endgame.

The complete cycle of destruction and precision.

Chaos first. Control second.`,
          lessons: [
            {
              id: '6.12.1',
              name: 'Review: King Attacks',
              description: 'Kingside assault patterns',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['kingsideAttack', 'exposedKing'],
              ratingMin: 1625,
              ratingMax: 1775,
              minPlays: 500,
            },
            {
              id: '6.12.2',
              name: 'Review: Defense Breaking',
              description: 'Interference and deflection',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['interference', 'deflection'],
              ratingMin: 1650,
              ratingMax: 1800,
              minPlays: 100,
            },
            {
              id: '6.12.3',
              name: 'Review: Endgames',
              description: 'Convert your advantage',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame', 'pawnEndgame', 'queenEndgame'],
              ratingMin: 1625,
              ratingMax: 1800,
              minPlays: 100,
            },
            {
              id: '6.12.4',
              name: 'Review: Block 3 Mix',
              description: 'All attack and endgame skills',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['kingsideAttack', 'exposedKing', 'interference', 'deflection', 'rookEndgame'],
              ratingMin: 1675,
              ratingMax: 1800,
              minPlays: 100,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 4: CHECKMATE IS THE BEST POLICY, HARVEY
    // Final mastery review
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-4',
      name: 'Checkmate Is the Best Policy, Harvey',
      description: 'Final mastery review.',
      blockIntroMessage: `You either finish the curriculum, or play long enough to see yourself become the villain.

Everything from Level 6. Quiet moves. Deep sacrifices. King attacks. Endgame technique.

This is your final exam. Show Gotham what you're made of.`,
      sections: [
        // Section 13: Level 6 Review
        {
          id: '6.13',
          name: 'Level 6 Review',
          description: 'Mixed practice from all blocks',
          isReview: true,
          themeIntroMessage: `Everything from Level 6 in one section.

Quiet moves. Zwischenzugs. Sacrifices. King attacks. Endgames.

The complete Level 6 arsenal.`,
          lessons: [
            {
              id: '6.13.1',
              name: 'Mixed: Subtle Tactics',
              description: 'Quiet moves and zwischenzugs',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['quietMove', 'intermezzo', 'xRayAttack'],
              ratingMin: 1625,
              ratingMax: 1775,
              minPlays: 100,
            },
            {
              id: '6.13.2',
              name: 'Mixed: Deep Calculation',
              description: 'Sacrifices and long combinations',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'mateIn4', 'mateIn5', 'attraction'],
              ratingMin: 1650,
              ratingMax: 1800,
              minPlays: 100,
            },
            {
              id: '6.13.3',
              name: 'Mixed: Attack & Defense',
              description: 'King attacks and defense breaking',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['kingsideAttack', 'exposedKing', 'interference', 'deflection'],
              ratingMin: 1650,
              ratingMax: 1800,
              minPlays: 100,
            },
            {
              id: '6.13.4',
              name: 'Mixed: Everything',
              description: 'All Level 6 themes',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['quietMove', 'intermezzo', 'sacrifice', 'mateIn4', 'kingsideAttack', 'deflection'],
              ratingMin: 1675,
              ratingMax: 1800,
              minPlays: 100,
            },
          ],
        },
        // Section 14: Level 6 Final
        {
          id: '6.14',
          name: 'Level 6 Final',
          description: 'The ultimate test',
          isReview: true,
          themeIntroMessage: `This is it. The final challenge.

Every tactic from Level 6. No hints. No mercy. Just you and the board.

Prove you deserve to move on. Gotham is watching.`,
          lessons: [
            {
              id: '6.14.1',
              name: 'Final: Subtle Blows',
              description: 'Quiet moves and in-between shots',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['quietMove', 'intermezzo', 'xRayAttack'],
              ratingMin: 1650,
              ratingMax: 1800,
              minPlays: 100,
            },
            {
              id: '6.14.2',
              name: 'Final: Deep Sacrifices',
              description: 'Sacrifice and calculate',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'attraction', 'clearance', 'mateIn4'],
              ratingMin: 1675,
              ratingMax: 1800,
              minPlays: 100,
            },
            {
              id: '6.14.3',
              name: 'Final: Complete Toolkit',
              description: 'Every weapon available',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['kingsideAttack', 'interference', 'deflection', 'exposedKing'],
              ratingMin: 1700,
              ratingMax: 1825,
              minPlays: 100,
            },
            {
              id: '6.14.4',
              name: 'Level 6 Mastery',
              description: 'Prove you\'re Gotham\'s champion',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['quietMove', 'intermezzo', 'sacrifice', 'mateIn4', 'kingsideAttack', 'deflection', 'rookEndgame'],
              ratingMin: 1725,
              ratingMax: 1850,
              minPlays: 100,
            },
          ],
        },
      ],
    },
  ],
};

// Helper functions
export function getAllSectionsL6(): Section[] {
  return level6V2.blocks.flatMap(b => b.sections);
}

export function getAllLessonsL6(): LessonCriteria[] {
  return getAllSectionsL6().flatMap(s => s.lessons);
}

export function getLessonByIdL6(id: string): LessonCriteria | undefined {
  return getAllLessonsL6().find(l => l.id === id);
}

export function getLessonCountL6(): number {
  return getAllLessonsL6().length;
}

// Import IntroMessages type from level1
import { IntroMessages } from './level1-v2-curriculum';

/**
 * Get block and section context for a lesson
 */
function getLessonContextL6(lessonId: string) {
  for (const block of level6V2.blocks) {
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
function isFirstLessonInBlockL6(lessonId: string): boolean {
  const context = getLessonContextL6(lessonId);
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
function isFirstLessonInSectionL6(lessonId: string): boolean {
  const context = getLessonContextL6(lessonId);
  if (!context) return false;

  const { section } = context;
  if (section.lessons.length === 0) return false;

  return section.lessons[0].id === lessonId;
}

/**
 * Get intro messages to show for a lesson
 * Returns block intro if first in block, theme intro if first in section
 */
export function getIntroMessagesL6(lessonId: string): IntroMessages {
  const context = getLessonContextL6(lessonId);
  if (!context) return {};

  const { block, section } = context;
  const messages: IntroMessages = {};

  // Check if first lesson in block
  if (isFirstLessonInBlockL6(lessonId) && block.blockIntroMessage) {
    messages.blockIntro = {
      title: block.name,
      message: block.blockIntroMessage,
    };
  }

  // Check if first lesson in section
  if (isFirstLessonInSectionL6(lessonId) && section.themeIntroMessage) {
    messages.themeIntro = {
      title: section.name,
      message: section.themeIntroMessage,
    };
  }

  return messages;
}
