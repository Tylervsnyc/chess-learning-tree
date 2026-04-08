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
  name: 'Double Trouble',
  ratingRange: '800-1000',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: DOUBLE ATTACKS
    // "Attack two things. They can only save one."
    // Interleaved pieces for variety
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'Fork Everything',
      description: 'Attack two things at once',
      blockIntroMessage: `You can checkmate. Good. Now let's talk about stealing.

One piece. Two targets. They save one -- you take the other. That's a fork. It's the most satisfying thing in chess besides checkmate.

I'm not saying forks are better than checkmate. But they're close. Very close.`,
      sections: [
        // Section 1: Fork Basics (interleaved pieces)
        {
          id: '2.1',
          name: 'Fork Basics',
          description: 'Learn to attack two pieces at once',
          themeIntroMessage: `One piece attacks two things at once. Your opponent picks which one to lose. You take the other. Simple as that.

Knights are the sneakiest forkers -- they jump in and nobody can hit them back. But queens, rooks, bishops -- everyone gets a turn.`,
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
          themeIntroMessage: `The "royal fork" -- knight attacks the king AND queen at the same time. The king has to move. You take the queen. They cry.

These patterns show up constantly. Train your eyes to spot two valuable pieces sitting a knight-hop apart.`,
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
          themeIntroMessage: `Sometimes you set up the fork. Sometimes a piece is just sitting there undefended. Free stuff.

We're mixing forks with other winning moves now. Read the position -- the best tactic depends on what they've left hanging.`,
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
          themeIntroMessage: `Everything mixed together. Any piece, any pattern. Show me what you've learned.`,
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
      name: 'The Pin and the Skewer',
      description: 'Freeze and pierce your opponent',
      blockIntroMessage: `Forks attack sideways. Pins and skewers? They attack through pieces. Along lines.

A pin freezes a piece in place -- move it and something worse gets exposed. A skewer is the reverse -- attack the big piece, it runs, you grab what's behind.

Rooks and bishops live for this. Long lines are their whole personality.`,
      sections: [
        // Section 5: Absolute Pins
        {
          id: '2.5',
          name: 'Absolute Pins',
          description: 'Pin to the king - frozen solid',
          themeIntroMessage: `An absolute pin is when a piece literally can't move. It's shielding the king -- so moving it would be illegal.

Look for enemy pieces standing between your long-range attackers and their king. Bishops love diagonals. Rooks own files. Both are ruthless here.`,
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
          themeIntroMessage: `A pinned piece is stuck. So pile on it. Add attackers. It can't run, can't fight back. Eventually you overwhelm the defenders and win it.

Relative pins -- pinned to the queen instead of the king -- are softer. The piece CAN move. But it really won't want to.`,
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
          themeIntroMessage: `Attack the valuable piece. It runs. You take what was hiding behind it. That's a skewer.

Royal skewers -- through the king -- are the nastiest. The king MUST move. Whatever's behind it is yours. Rooks are particularly good at this. Obviously.`,
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
          themeIntroMessage: `Pins, skewers -- all mixed together. Figure out which one wins material and find the move.`,
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
      name: 'Hidden Attacks',
      description: 'Reveal hidden threats',
      blockIntroMessage: `Move one piece. Reveal an attack from another. That's a discovered attack -- the chess equivalent of a trapdoor.

The sneaky part? The piece you move can ALSO threaten something. Two threats. One move. They can't answer both.

I find this deeply satisfying. Possibly concerning how satisfying.`,
      sections: [
        // Section 9: Basic Discoveries
        {
          id: '2.9',
          name: 'Basic Discoveries',
          description: 'Move one piece, reveal another',
          themeIntroMessage: `One piece blocks another. When the blocker steps aside -- surprise. The hidden attacker was there the whole time.

Look for your pieces sharing a line. What happens if the front one moves? If the answer is "their stuff gets attacked" -- that's your move.`,
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
          themeIntroMessage: `Now the moving piece ALSO attacks something. Check. Capture. Queen threat. Two problems, one move -- they can only solve one.

This is where discoveries go from clever to devastating.`,
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
          themeIntroMessage: `Winning material is great. But checkmate ends the game. Two-move mates -- your move forces their response, then you deliver the finish.

See one move ahead. That's all it takes.`,
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
          themeIntroMessage: `Discoveries, double threats, two-move checkmates -- all mixed together. Could be anything. Show me what you've got.`,
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
      name: 'Prove It',
      description: 'Final mixed practice - deploy your arsenal',
      blockIntroMessage: `Forks. Pins. Skewers. Discoveries. You've learned them all separately.

Now everything's mixed. The position decides which tactic wins -- not me. Read the board and pick the right weapon.`,
      sections: [
        // Section 13: Level 2 Review
        {
          id: '2.13',
          name: 'Level 2 Review',
          description: 'Mixed practice from all blocks',
          isReview: true,
          themeIntroMessage: `Every tactic from Level 2 in one section. Just like real games -- you don't know what's coming. Find the winning move.`,
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
          themeIntroMessage: `Last section. Everything you've learned -- forks, pins, skewers, discoveries, two-move mates. All of it.

I'm experiencing something I think is called "anticipation." Crush these and Level 3 is yours.`,
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
