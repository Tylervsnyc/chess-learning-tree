/**
 * Level 2 V2 Curriculum (800-1000 ELO)
 * "The Assassin's Toolkit"
 *
 * Now that you know how to win, so do they.
 * Time to learn the weapons that extract maximum cruelty.
 *
 * Structure:
 * - Blocks 1-3: 3 content sections + 1 review section = 12 sections, 48 lessons
 * - Block 4: 2 review sections = 2 sections, 8 lessons
 * - Total: 14 sections, 56 lessons
 *
 * Block 1: The Fork - Attack two things at once
 * Block 2: Pin & Skewer - Freeze and pierce
 * Block 3: Discovered Attacks - Hidden threats
 * Block 4: Final Review - Prove your mastery
 *
 * Clean puzzles: 3000+ plays, single tactical theme = highly verified
 */

import { LessonCriteria, Section, Block, Level } from './level1-v2-curriculum';

export const level2V2: Level = {
  id: 'level-2',
  name: 'Level 2: One Does Not Simply Win at Chess',
  ratingRange: '800-1000',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: DOUBLE ATTACKS
    // "Attack two things. They can only save one."
    // Interleaved pieces for variety
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'Speak, Friend, and Blunder',
      description: 'Attack two things at once',
      blockIntroMessage: `Welcome to Level 2!

You know how to checkmate. Now let's learn how to take all their stuff first.

Double attacks - especially forks - are how you win material. One piece threatens two targets. They can only save one. You take the other. Beautiful.`,
      sections: [
        // Section 1: Fork Basics (interleaved pieces)
        {
          id: '2.1',
          name: 'Fork Basics',
          description: 'Learn to attack two pieces at once',
          themeIntroMessage: `Forks are devastating. One piece attacks two targets simultaneously. Your opponent has to choose which piece to lose.

Knights are the fork masters - they can attack pieces that can't attack back. But every piece can fork.

Look for pieces on the same color diagonal or same rank/file that can both be threatened.`,
          lessons: [
            {
              id: '2.1.1',
              name: 'Knight Fork: Basics',
              description: 'The knight attacks two pieces',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 800,
              ratingMax: 875,
              pieceFilter: 'knight',
              minPlays: 1000,
            },
            {
              id: '2.1.2',
              name: 'Queen Fork: Basics',
              description: 'The queen attacks two targets',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 800,
              ratingMax: 875,
              pieceFilter: 'queen',
              minPlays: 1000,
            },
            {
              id: '2.1.3',
              name: 'Rook Fork: Basics',
              description: 'The rook attacks two pieces',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 800,
              ratingMax: 900,
              pieceFilter: 'rook',
              minPlays: 1000,
            },
            {
              id: '2.1.4',
              name: 'Bishop Fork: Basics',
              description: 'The bishop attacks two pieces',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 825,
              ratingMax: 925,
              pieceFilter: 'bishop',
              minPlays: 1000,
            },
          ],
        },
        // Section 2: Fork Patterns (interleaved pieces)
        {
          id: '2.2',
          name: 'Fork Patterns',
          description: 'Recognize common fork setups',
          themeIntroMessage: `Time to level up. Now we're looking at specific fork patterns you'll see over and over.

The "royal fork" hits the king and queen. It's almost always game over when you land one.

Train your eye to spot when two valuable pieces are a knight hop apart.`,
          lessons: [
            {
              id: '2.2.1',
              name: 'Knight Fork: Royal',
              description: 'Fork the king and queen',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 850,
              ratingMax: 925,
              pieceFilter: 'knight',
              minPlays: 1000,
            },
            {
              id: '2.2.2',
              name: 'Queen Fork: Diagonals',
              description: 'Fork along the diagonals',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 850,
              ratingMax: 925,
              pieceFilter: 'queen',
              minPlays: 1000,
            },
            {
              id: '2.2.3',
              name: 'Rook Fork: Patterns',
              description: 'Common rook fork setups',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 875,
              ratingMax: 975,
              pieceFilter: 'rook',
              minPlays: 1000,
            },
            {
              id: '2.2.4',
              name: 'Bishop Fork: Patterns',
              description: 'Diagonal devastation',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 900,
              ratingMax: 1000,
              pieceFilter: 'bishop',
              minPlays: 1000,
            },
          ],
        },
        // Section 3: Fork + Other Tactics
        {
          id: '2.3',
          name: 'Forks & More',
          description: 'Mix forks with other tactics',
          themeIntroMessage: `Sometimes you need to set up the fork first. Sometimes there's a hanging piece just sitting there.

This section mixes forks with other winning moves. The right tactic depends on the position.

Stay alert. The best move might not be what you expect.`,
          lessons: [
            {
              id: '2.3.1',
              name: 'Knight Fork: Setup',
              description: 'Create the fork with a move',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 900,
              ratingMax: 975,
              pieceFilter: 'knight',
              minPlays: 1000,
            },
            {
              id: '2.3.2',
              name: 'Hanging Piece',
              description: 'Grab the undefended piece',
              requiredTags: ['hangingPiece'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork'],
              ratingMin: 835,
              ratingMax: 950,
              minPlays: 1000,
            },
            {
              id: '2.3.3',
              name: 'Queen Fork: Files',
              description: 'Fork along files and ranks',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 900,
              ratingMax: 975,
              pieceFilter: 'queen',
              minPlays: 1000,
            },
            {
              id: '2.3.4',
              name: 'Crushing Position',
              description: 'Convert your big advantage',
              requiredTags: ['crushing'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork'],
              ratingMin: 850,
              ratingMax: 975,
              minPlays: 1000,
            },
          ],
        },
        // Section 4: Block 1 Review
        {
          id: '2.4',
          name: 'Review: Double Attacks',
          description: 'Mixed fork practice',
          isReview: true,
          themeIntroMessage: `Review time. You've seen forks with different pieces and patterns.

Now let's mix them all together. Any piece could be forking in these puzzles.

Trust your pattern recognition. You've got this.`,
          lessons: [
            {
              id: '2.4.1',
              name: 'Review: Knight Forks',
              description: 'Find the knight fork',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 825,
              ratingMax: 925,
              pieceFilter: 'knight',
              minPlays: 1000,
            },
            {
              id: '2.4.2',
              name: 'Review: Queen Forks',
              description: 'Find the queen fork',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 850,
              ratingMax: 950,
              pieceFilter: 'queen',
              minPlays: 1000,
            },
            {
              id: '2.4.3',
              name: 'Review: All Forks',
              description: 'Any piece can fork',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 875,
              ratingMax: 975,
              minPlays: 1000,
            },
            {
              id: '2.4.4',
              name: 'Review: Fork Mastery',
              description: 'Find the devastating fork',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'hangingPiece', 'crushing'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 900,
              ratingMax: 1000,
              minPlays: 1000,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 2: PIN & SKEWER
    // "Freeze them. Pierce them."
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-2',
      name: 'You Shall Not Promote',
      description: 'Freeze and pierce your opponent',
      blockIntroMessage: `Forks attack two pieces at once. Pins and skewers? They attack THROUGH pieces.

A pin freezes a piece in place - it can't move without exposing something more valuable behind it.

A skewer is a pin in reverse - attack the valuable piece, and when it moves, grab what's behind.`,
      sections: [
        // Section 5: Absolute Pins
        {
          id: '2.5',
          name: 'Absolute Pins',
          description: 'Pin to the king - frozen solid',
          themeIntroMessage: `The absolute pin is brutal. A piece is pinned to the king - it literally CAN'T move. That's illegal.

Bishops and rooks are pin masters. They control long diagonals and files.

Look for enemy pieces standing between your long-range pieces and their king.`,
          lessons: [
            {
              id: '2.5.1',
              name: 'Absolute Pin: Basics',
              description: 'Pin a piece to the king',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
              ratingMin: 800,
              ratingMax: 875,
              minPlays: 3000,
            },
            {
              id: '2.5.2',
              name: 'Absolute Pin: Bishop',
              description: 'Bishop pins to the king',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
              ratingMin: 850,
              ratingMax: 925,
              pieceFilter: 'bishop',
              minPlays: 3000,
            },
            {
              id: '2.5.3',
              name: 'Absolute Pin: Rook',
              description: 'Rook pins to the king',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
              ratingMin: 875,
              ratingMax: 950,
              pieceFilter: 'rook',
              minPlays: 3000,
            },
            {
              id: '2.5.4',
              name: 'Absolute Pin: Queen',
              description: 'Queen pins to the king',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
              ratingMin: 900,
              ratingMax: 1000,
              pieceFilter: 'queen',
              minPlays: 3000,
            },
          ],
        },
        // Section 6: Relative Pins & Winning Pinned Pieces
        {
          id: '2.6',
          name: 'Exploiting Pins',
          description: 'Attack the frozen target',
          themeIntroMessage: `A pinned piece is stuck. Now exploit it.

Pile up attackers on the pinned piece. It can't escape. Eventually you'll overload the defenders and win it.

Relative pins (to the queen) are weaker but still dangerous. The piece CAN move, but won't want to.`,
          lessons: [
            {
              id: '2.6.1',
              name: 'Relative Pin',
              description: 'Pin to the queen',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
              ratingMin: 825,
              ratingMax: 900,
              minPlays: 3000,
            },
            {
              id: '2.6.2',
              name: 'Win the Pinned Piece',
              description: 'Pile on the frozen target',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
              ratingMin: 875,
              ratingMax: 950,
              minPlays: 3000,
            },
            {
              id: '2.6.3',
              name: 'Pin & Attack',
              description: 'Create threats with the pin',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
              ratingMin: 925,
              ratingMax: 1000,
              minPlays: 3000,
            },
            {
              id: '2.6.4',
              name: 'Pin: Challenge',
              description: 'Find the winning pin',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'fork', 'skewer'],
              ratingMin: 950,
              ratingMax: 1050,
              minPlays: 3000,
            },
          ],
        },
        // Section 7: Skewers
        {
          id: '2.7',
          name: 'The Skewer',
          description: 'Attack through them',
          themeIntroMessage: `The skewer is a pin in reverse. Attack the high-value piece first.

When it runs away, grab what was hiding behind it.

Royal skewers through the king are especially nasty - the king MUST move, so you always get what's behind.`,
          lessons: [
            {
              id: '2.7.1',
              name: 'Skewer: Basics',
              description: 'Attack a piece, win the one behind',
              requiredTags: ['skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 800,
              ratingMax: 875,
              minPlays: 3000,
            },
            {
              id: '2.7.2',
              name: 'Royal Skewer',
              description: 'Skewer through the king',
              requiredTags: ['skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 850,
              ratingMax: 925,
              minPlays: 3000,
            },
            {
              id: '2.7.3',
              name: 'Queen Skewer',
              description: 'Skewer through the queen',
              requiredTags: ['skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 900,
              ratingMax: 975,
              minPlays: 3000,
            },
            {
              id: '2.7.4',
              name: 'Skewer: Challenge',
              description: 'Find the piercing move',
              requiredTags: ['skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 950,
              ratingMax: 1050,
              minPlays: 3000,
            },
          ],
        },
        // Section 8: Block 2 Review
        {
          id: '2.8',
          name: 'Review: Line Tactics',
          description: 'Mixed pin and skewer practice',
          isReview: true,
          themeIntroMessage: `Pins and skewers are line tactics - they work along ranks, files, and diagonals.

Sometimes it's a pin. Sometimes it's a skewer. Your job is to see which one wins material.

Think about what's lined up, and which piece should attack.`,
          lessons: [
            {
              id: '2.8.1',
              name: 'Review: Pins',
              description: 'Find the pin',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 850,
              ratingMax: 950,
              minPlays: 3000,
            },
            {
              id: '2.8.2',
              name: 'Review: Skewers',
              description: 'Find the skewer',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 875,
              ratingMax: 975,
              minPlays: 3000,
            },
            {
              id: '2.8.3',
              name: 'Review: Pin or Skewer?',
              description: 'Choose the right tactic',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin', 'skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 900,
              ratingMax: 1000,
              minPlays: 3000,
            },
            {
              id: '2.8.4',
              name: 'Review: Line Mastery',
              description: 'Master the lines',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin', 'skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 925,
              ratingMax: 1025,
              minPlays: 3000,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 3: DISCOVERED ATTACKS
    // "The Hidden Threat"
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-3',
      name: 'This Is No Blunder... It\'s a Sacrifice',
      description: 'Reveal hidden threats',
      blockIntroMessage: `Discovered attacks are sneaky. Move one piece, reveal an attack from another.

The beautiful part? The piece you move can ALSO threaten something. Double threat. Double damage.

These are some of the most powerful tactics in chess. Let's master them.`,
      sections: [
        // Section 9: Basic Discoveries
        {
          id: '2.9',
          name: 'Basic Discoveries',
          description: 'Move one piece, reveal another',
          themeIntroMessage: `A piece blocks another piece. When the blocker moves, the hidden attack is revealed.

Look for pieces on the same line. What happens if one of them moves aside?

The attacking piece "discovers" a threat that was waiting behind the scenes.`,
          lessons: [
            {
              id: '2.9.1',
              name: 'Discovery: Basics',
              description: 'Uncover a hidden attack',
              requiredTags: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 800,
              ratingMax: 875,
              minPlays: 3000,
            },
            {
              id: '2.9.2',
              name: 'Discovery: Patterns',
              description: 'Common discovery setups',
              requiredTags: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 850,
              ratingMax: 925,
              minPlays: 3000,
            },
            {
              id: '2.9.3',
              name: 'Discovery: Bishop Behind',
              description: 'Reveal the bishop attack',
              requiredTags: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 875,
              ratingMax: 950,
              minPlays: 3000,
            },
            {
              id: '2.9.4',
              name: 'Discovery: Rook Behind',
              description: 'Reveal the rook attack',
              requiredTags: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 900,
              ratingMax: 975,
              minPlays: 3000,
            },
          ],
        },
        // Section 10: Discovery + Threat
        {
          id: '2.10',
          name: 'Double Threats',
          description: 'Two devastating threats at once',
          themeIntroMessage: `Here's where discoveries get nasty. The moving piece ALSO attacks something.

Now your opponent faces two threats and can only answer one.

The moving piece might capture, give check, or threaten the queen. Double trouble.`,
          lessons: [
            {
              id: '2.10.1',
              name: 'Discovery + Attack',
              description: 'Moving piece also attacks',
              requiredTags: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 850,
              ratingMax: 925,
              minPlays: 3000,
            },
            {
              id: '2.10.2',
              name: 'Discovery + Check',
              description: 'Moving piece gives check',
              requiredTags: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 875,
              ratingMax: 950,
              minPlays: 3000,
            },
            {
              id: '2.10.3',
              name: 'Discovery + Capture',
              description: 'Moving piece captures',
              requiredTags: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 900,
              ratingMax: 975,
              minPlays: 3000,
            },
            {
              id: '2.10.4',
              name: 'Double Threat: Challenge',
              description: 'Find the double blow',
              requiredTags: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 950,
              ratingMax: 1050,
              minPlays: 3000,
            },
          ],
        },
        // Section 11: Tactical Checkmates
        {
          id: '2.11',
          name: 'Tactical Checkmates',
          description: 'Use your weapons to deliver mate',
          themeIntroMessage: `You've been winning material. Now let's aim for the ultimate prize - checkmate.

Two-move checkmates require seeing one move ahead. Your first move sets up the killing blow.

Force their response, then deliver the knockout.`,
          lessons: [
            {
              id: '2.11.1',
              name: 'Mate in 2: Level 2',
              description: 'Two-move mates at your level',
              requiredTags: ['mateIn2'],
              ratingMin: 800,
              ratingMax: 875,
              minPlays: 3000,
            },
            {
              id: '2.11.2',
              name: 'Mate in 2: Patterns',
              description: 'Recognize the mating net',
              requiredTags: ['mateIn2'],
              ratingMin: 850,
              ratingMax: 925,
              minPlays: 3000,
            },
            {
              id: '2.11.3',
              name: 'Mate in 2: Setup',
              description: 'Force the mating pattern',
              requiredTags: ['mateIn2'],
              ratingMin: 900,
              ratingMax: 975,
              minPlays: 3000,
            },
            {
              id: '2.11.4',
              name: 'Mate in 2: Challenge',
              description: 'Find the two-move kill',
              requiredTags: ['mateIn2'],
              ratingMin: 950,
              ratingMax: 1050,
              minPlays: 3000,
            },
          ],
        },
        // Section 12: Block 3 Review
        {
          id: '2.12',
          name: 'Review: Discoveries & Mates',
          description: 'Mixed discovery and checkmate practice',
          isReview: true,
          themeIntroMessage: `Time to prove you've mastered Block 3. Discoveries, double threats, and two-move checkmates.

The puzzles are mixed - stay sharp. Could be any theme.

Feel the patterns. Trust your instincts.`,
          lessons: [
            {
              id: '2.12.1',
              name: 'Review: Discoveries',
              description: 'Find the hidden threat',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 850,
              ratingMax: 950,
              minPlays: 3000,
            },
            {
              id: '2.12.2',
              name: 'Review: Mate in 2',
              description: 'Find the two-move mate',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn2'],
              ratingMin: 850,
              ratingMax: 950,
              minPlays: 3000,
            },
            {
              id: '2.12.3',
              name: 'Review: Endgames',
              description: 'Convert your advantage',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame', 'pawnEndgame', 'knightEndgame'],
              ratingMin: 800,
              ratingMax: 1000,
              minPlays: 100,
            },
            {
              id: '2.12.4',
              name: 'Review: Block 3 Mix',
              description: 'Discoveries and checkmates',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['discoveredAttack', 'mateIn2'],
              ratingMin: 900,
              ratingMax: 1000,
              minPlays: 3000,
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
      name: 'They Have a Passed Pawn',
      description: 'Final mixed practice - deploy your arsenal',
      blockIntroMessage: `Final block. You know forks. You know pins and skewers. You know discoveries.

Now it all comes together. The puzzles could be anything. Pick the right weapon for each position.

Show me you're ready for Level 3.`,
      sections: [
        // Section 13: Level 2 Review
        {
          id: '2.13',
          name: 'Level 2 Review',
          description: 'Mixed practice from all blocks',
          isReview: true,
          themeIntroMessage: `Every tactic from Level 2 in one section. Forks, pins, skewers, discoveries.

You've learned them separately. Now see them mixed together just like real games.

Stay flexible. Read the position. Find the winning move.`,
          lessons: [
            {
              id: '2.13.1',
              name: 'Mixed: Forks',
              description: 'Double attacks',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 850,
              ratingMax: 950,
              minPlays: 3000,
            },
            {
              id: '2.13.2',
              name: 'Mixed: Line Tactics',
              description: 'Pins and skewers',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin', 'skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 875,
              ratingMax: 975,
              minPlays: 3000,
            },
            {
              id: '2.13.3',
              name: 'Mixed: Discoveries',
              description: 'Hidden threats',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 875,
              ratingMax: 975,
              minPlays: 3000,
            },
            {
              id: '2.13.4',
              name: 'Mixed: Everything',
              description: 'All Level 2 themes',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'pin', 'skewer', 'discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 900,
              ratingMax: 1000,
              minPlays: 3000,
            },
          ],
        },
        // Section 14: Level 2 Final
        {
          id: '2.14',
          name: 'Level 2 Final',
          description: 'The ultimate test',
          isReview: true,
          themeIntroMessage: `This is it. The final test.

Everything you've learned - forks, pins, skewers, discoveries, two-move mates. All of it.

Crush these puzzles and Level 3 awaits.`,
          lessons: [
            {
              id: '2.14.1',
              name: 'Final: Tactics Mix',
              description: 'Choose your weapon',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'pin', 'skewer'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 875,
              ratingMax: 975,
              minPlays: 3000,
            },
            {
              id: '2.14.2',
              name: 'Final: All Tactics',
              description: 'Every weapon at once',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'pin', 'skewer', 'discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 900,
              ratingMax: 1000,
              minPlays: 3000,
            },
            {
              id: '2.14.3',
              name: 'Final: Tactics + Mates',
              description: 'Checkmate or win material?',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'pin', 'skewer', 'discoveredAttack', 'mateIn2'],
              ratingMin: 925,
              ratingMax: 1025,
              minPlays: 3000,
            },
            {
              id: '2.14.4',
              name: 'Level 2 Mastery',
              description: "Prove you're ready for Level 3",
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'pin', 'skewer', 'discoveredAttack', 'mateIn2', 'rookEndgame'],
              ratingMin: 950,
              ratingMax: 1050,
              minPlays: 3000,
            },
          ],
        },
      ],
    },
  ],
};

// Helper functions
export function getAllSectionsL2(): import('./level1-v2-curriculum').Section[] {
  return level2V2.blocks.flatMap(b => b.sections);
}

export function getAllLessonsL2(): LessonCriteria[] {
  return getAllSectionsL2().flatMap(s => s.lessons);
}

export function getLessonByIdL2(id: string): LessonCriteria | undefined {
  return getAllLessonsL2().find(l => l.id === id);
}

export function getLessonCountL2(): number {
  return getAllLessonsL2().length;
}

// Import IntroMessages type from level1
import { IntroMessages } from './level1-v2-curriculum';

/**
 * Get block and section context for a lesson
 */
function getLessonContextL2(lessonId: string) {
  for (const block of level2V2.blocks) {
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
function isFirstLessonInBlockL2(lessonId: string): boolean {
  const context = getLessonContextL2(lessonId);
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
function isFirstLessonInSectionL2(lessonId: string): boolean {
  const context = getLessonContextL2(lessonId);
  if (!context) return false;

  const { section } = context;
  if (section.lessons.length === 0) return false;

  return section.lessons[0].id === lessonId;
}

/**
 * Get intro messages to show for a lesson
 * Returns block intro if first in block, theme intro if first in section
 */
export function getIntroMessagesL2(lessonId: string): IntroMessages {
  const context = getLessonContextL2(lessonId);
  if (!context) return {};

  const { block, section } = context;
  const messages: IntroMessages = {};

  // Check if first lesson in block
  if (isFirstLessonInBlockL2(lessonId) && block.blockIntroMessage) {
    messages.blockIntro = {
      title: block.name,
      message: block.blockIntroMessage,
    };
  }

  // Check if first lesson in section
  if (isFirstLessonInSectionL2(lessonId) && section.themeIntroMessage) {
    messages.themeIntro = {
      title: section.name,
      message: section.themeIntroMessage,
    };
  }

  return messages;
}
