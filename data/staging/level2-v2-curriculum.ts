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
  name: "Level 2: The Assassin's Toolkit",
  ratingRange: '800-1000',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: DOUBLE ATTACKS
    // "Attack two things. They can only save one."
    // Interleaved pieces for variety
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'Double Attacks',
      description: 'Attack two things at once',
      sections: [
        // Section 1: Fork Basics (interleaved pieces)
        {
          id: 'sec-1',
          name: 'Fork Basics',
          description: 'Learn to attack two pieces at once',
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
          id: 'sec-2',
          name: 'Fork Patterns',
          description: 'Recognize common fork setups',
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
          id: 'sec-3',
          name: 'Forks & More',
          description: 'Mix forks with other tactics',
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
          id: 'sec-4',
          name: 'Review: Double Attacks',
          description: 'Mixed fork practice',
          isReview: true,
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
      name: 'Pin & Skewer',
      description: 'Freeze and pierce your opponent',
      sections: [
        // Section 5: Absolute Pins
        {
          id: 'sec-5',
          name: 'Absolute Pins',
          description: 'Pin to the king - frozen solid',
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
          id: 'sec-6',
          name: 'Exploiting Pins',
          description: 'Attack the frozen target',
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
          id: 'sec-7',
          name: 'The Skewer',
          description: 'Attack through them',
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
          id: 'sec-8',
          name: 'Review: Line Tactics',
          description: 'Mixed pin and skewer practice',
          isReview: true,
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
      name: 'Discovered Attacks',
      description: 'Reveal hidden threats',
      sections: [
        // Section 9: Basic Discoveries
        {
          id: 'sec-9',
          name: 'Basic Discoveries',
          description: 'Move one piece, reveal another',
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
          id: 'sec-10',
          name: 'Double Threats',
          description: 'Two devastating threats at once',
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
          id: 'sec-11',
          name: 'Tactical Checkmates',
          description: 'Use your weapons to deliver mate',
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
          id: 'sec-12',
          name: 'Review: Discoveries & Mates',
          description: 'Mixed discovery and checkmate practice',
          isReview: true,
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
      name: 'Prove Yourself',
      description: 'Final mixed practice - deploy your arsenal',
      sections: [
        // Section 13: Level 2 Review
        {
          id: 'sec-13',
          name: 'Level 2 Review',
          description: 'Mixed practice from all blocks',
          isReview: true,
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
          id: 'sec-14',
          name: 'Level 2 Final',
          description: 'The ultimate test',
          isReview: true,
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
