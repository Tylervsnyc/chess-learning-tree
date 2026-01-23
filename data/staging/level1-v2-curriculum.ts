/**
 * Level 1 Curriculum V2 (400-800 ELO)
 *
 * NEW METHODOLOGY: Skill-Stacking
 * - Each block introduces a new tactic
 * - Third section of each block COMBINES skills
 * - Every 4th section is a Review
 *
 * Structure: Level → Section → Lesson (6 puzzles each)
 * - 4 Blocks per Level
 * - 4 Sections per Block (3 content + 1 review)
 * - 2-4 Lessons per Section
 * - Review sections always have 2 lessons: "The Easy Way" / "The Hard Way"
 */

export interface LessonCriteria {
  id: string;
  name: string;
  description: string;
  requiredTags: string[];
  excludeTags?: string[];
  ratingMin: number;
  ratingMax: number;
  pieceFilter?: 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  minPlays?: number;
  isMixedPractice?: boolean;
  mixedThemes?: string[];
}

export interface Section {
  id: string;
  name: string;
  description: string;
  isReview?: boolean;
  lessons: LessonCriteria[];
}

export interface Block {
  id: string;
  name: string;         // Funny block name
  description: string;
  sections: Section[];
}

export interface Level {
  id: string;
  name: string;
  ratingRange: string;
  blocks: Block[];
}

export const level1V2: Level = {
  id: 'level-1',
  name: 'Level 1: Beginner',
  ratingRange: '400-800',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: "The 'Oops, You're Dead' Collection"
    // Learn to spot checkmate, then set it up
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: "The 'Oops, You're Dead' Collection",
      description: 'Learn to spot checkmate, then set it up',
      sections: [
        // ────────────────────────────────────────
        // Section 1: Queen Checkmates
        // ────────────────────────────────────────
        {
          id: 'sec-1',
          name: 'Queen Checkmates',
          description: 'Deliver checkmate with the queen',
          lessons: [
            {
              id: '1.1.1',
              name: 'Queen Mate: The Basics',
              description: 'Simple queen checkmates',
              requiredTags: ['mateIn1'],
              ratingMin: 400,
              ratingMax: 500,
              pieceFilter: 'queen',
            },
            {
              id: '1.1.2',
              name: 'Queen Mate: Getting Trickier',
              description: 'Queen checkmates with a twist',
              requiredTags: ['mateIn1'],
              ratingMin: 500,
              ratingMax: 600,
              pieceFilter: 'queen',
            },
            {
              id: '1.1.3',
              name: 'Queen Mate: Now You See It',
              description: 'Spot the queen checkmate',
              requiredTags: ['mateIn1'],
              ratingMin: 550,
              ratingMax: 700,
              pieceFilter: 'queen',
            },
            {
              id: '1.1.4',
              name: 'Queen Mate: Grand Finale',
              description: 'Queen checkmates - putting it together',
              requiredTags: ['mateIn1'],
              ratingMin: 600,
              ratingMax: 750,
              pieceFilter: 'queen',
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 2: Rook Checkmates
        // ────────────────────────────────────────
        {
          id: 'sec-2',
          name: 'Rook Checkmates',
          description: 'Deliver checkmate with the rook',
          lessons: [
            {
              id: '1.2.1',
              name: 'Rook Mate: Back Rank Basics',
              description: 'Classic back rank checkmates',
              requiredTags: ['mateIn1', 'backRankMate'],
              ratingMin: 400,
              ratingMax: 550,
              pieceFilter: 'rook',
            },
            {
              id: '1.2.2',
              name: 'Rook Mate: Side Attacks',
              description: 'Rook checkmates from the side',
              requiredTags: ['mateIn1'],
              ratingMin: 500,
              ratingMax: 650,
              pieceFilter: 'rook',
            },
            {
              id: '1.2.3',
              name: 'Rook Mate: Find the Pattern',
              description: 'Spot the rook checkmate',
              requiredTags: ['mateIn1'],
              ratingMin: 550,
              ratingMax: 750,
              pieceFilter: 'rook',
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 3: Mate in 2 (SKILL STACK!)
        // ────────────────────────────────────────
        {
          id: 'sec-3',
          name: 'Mate in 2',
          description: 'Set up the checkmate you learned',
          lessons: [
            {
              id: '1.3.1',
              name: 'Mate in 2: Baby Steps',
              description: 'Two-move checkmates - easiest patterns',
              requiredTags: ['mateIn2'],
              ratingMin: 400,
              ratingMax: 525,
            },
            {
              id: '1.3.2',
              name: 'Mate in 2: Think Ahead',
              description: 'Plan your checkmate in two moves',
              requiredTags: ['mateIn2'],
              ratingMin: 525,
              ratingMax: 625,
            },
            {
              id: '1.3.3',
              name: 'Mate in 2: The Setup',
              description: 'Force the checkmate position',
              requiredTags: ['mateIn2'],
              ratingMin: 600,
              ratingMax: 750,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 4: REVIEW
        // ────────────────────────────────────────
        {
          id: 'sec-4',
          name: 'Block 1 Review',
          description: 'Practice everything from Block 1',
          isReview: true,
          lessons: [
            {
              id: '1.4.1',
              name: 'The Easy Way',
              description: 'Warm up with easier checkmates',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn1', 'mateIn2'],
              ratingMin: 400,
              ratingMax: 600,
              minPlays: 5000,
            },
            {
              id: '1.4.2',
              name: 'The Hard Way',
              description: 'Challenge yourself with tougher checkmates',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn1', 'mateIn2'],
              ratingMin: 600,
              ratingMax: 800,
              minPlays: 5000,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 2: "The Fork Awakens"
    // Double attacks + fork to mate
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-2',
      name: 'The Fork Awakens',
      description: 'Double attacks that win material and games',
      sections: [
        // ────────────────────────────────────────
        // Section 5: Knight Forks
        // ────────────────────────────────────────
        {
          id: 'sec-5',
          name: 'Knight Forks',
          description: 'The knight attacks two pieces at once',
          lessons: [
            {
              id: '1.5.1',
              name: 'Knight Fork: Royal Targets',
              description: 'Fork the king and queen',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 400,
              ratingMax: 550,
              pieceFilter: 'knight',
            },
            {
              id: '1.5.2',
              name: 'Knight Fork: Heavy Pieces',
              description: 'Fork rooks and queens',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 500,
              ratingMax: 650,
              pieceFilter: 'knight',
            },
            {
              id: '1.5.3',
              name: 'Knight Fork: Family Check',
              description: 'Fork the whole royal family',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 550,
              ratingMax: 725,
              pieceFilter: 'knight',
            },
            {
              id: '1.5.4',
              name: 'Knight Fork: Sneak Attack',
              description: 'Set up the fork with a clever move',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 625,
              ratingMax: 800,
              pieceFilter: 'knight',
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 6: Queen & Rook Forks
        // ────────────────────────────────────────
        {
          id: 'sec-6',
          name: 'Queen & Rook Forks',
          description: 'Heavy pieces attack two at once',
          lessons: [
            {
              id: '1.6.1',
              name: 'Queen Fork: Double Trouble',
              description: 'The queen attacks two pieces',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 400,
              ratingMax: 650,
              pieceFilter: 'queen',
            },
            {
              id: '1.6.2',
              name: 'Rook Fork: Split Attack',
              description: 'The rook attacks along rank or file',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 450,
              ratingMax: 700,
              pieceFilter: 'rook',
            },
            {
              id: '1.6.3',
              name: 'Pawn Fork: The Little Guy',
              description: 'Even pawns can fork!',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 400,
              ratingMax: 750,
              pieceFilter: 'pawn',
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 7: Fork → Checkmate (SKILL STACK!)
        // ────────────────────────────────────────
        {
          id: 'sec-7',
          name: 'Fork to Checkmate',
          description: 'Fork your way to victory',
          lessons: [
            {
              id: '1.7.1',
              name: 'Fork → Mate: The Combo',
              description: 'Fork leads to checkmate',
              requiredTags: ['fork', 'mateIn2'],
              ratingMin: 500,
              ratingMax: 700,
            },
            {
              id: '1.7.2',
              name: 'Fork → Mate: Double Threat',
              description: 'Fork with checkmate threat',
              requiredTags: ['fork', 'mate'],
              ratingMin: 550,
              ratingMax: 750,
            },
            {
              id: '1.7.3',
              name: 'Fork → Mate: Grand Slam',
              description: 'Fork that ends the game',
              requiredTags: ['fork', 'mateIn2'],
              ratingMin: 600,
              ratingMax: 800,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 8: REVIEW
        // ────────────────────────────────────────
        {
          id: 'sec-8',
          name: 'Block 2 Review',
          description: 'Practice checkmates and forks',
          isReview: true,
          lessons: [
            {
              id: '1.8.1',
              name: 'The Easy Way',
              description: 'Warm up with easier forks',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'mateIn1', 'mateIn2'],
              ratingMin: 400,
              ratingMax: 600,
              minPlays: 5000,
            },
            {
              id: '1.8.2',
              name: 'The Hard Way',
              description: 'Challenge yourself with tough combos',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'mateIn1', 'mateIn2'],
              ratingMin: 600,
              ratingMax: 800,
              minPlays: 5000,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 3: "How To End Friendships"
    // Pins + pin combos
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-3',
      name: 'How To End Friendships',
      description: 'Pins that make opponents cry',
      sections: [
        // ────────────────────────────────────────
        // Section 9: Absolute Pins
        // ────────────────────────────────────────
        {
          id: 'sec-9',
          name: 'Absolute Pins',
          description: 'Pin pieces to the king',
          lessons: [
            {
              id: '1.9.1',
              name: 'Pin Basics: Stuck in Place',
              description: 'The pinned piece cannot move',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'skewer'],
              ratingMin: 400,
              ratingMax: 550,
            },
            {
              id: '1.9.2',
              name: 'Pin Power: Attack the Pinned',
              description: 'Pile on the pinned piece',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'skewer'],
              ratingMin: 500,
              ratingMax: 650,
            },
            {
              id: '1.9.3',
              name: 'Pin Perfect: Find the Line',
              description: 'Spot the pin opportunity',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'skewer'],
              ratingMin: 575,
              ratingMax: 725,
            },
            {
              id: '1.9.4',
              name: 'Pin Master: Total Domination',
              description: 'Pins that win material',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'skewer'],
              ratingMin: 650,
              ratingMax: 800,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 10: Pin → Win Material
        // ────────────────────────────────────────
        {
          id: 'sec-10',
          name: 'Pin to Win Material',
          description: 'Use pins to capture pieces',
          lessons: [
            {
              id: '1.10.1',
              name: 'Pin & Capture',
              description: 'Pin then take the piece',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'skewer', 'fork'],
              ratingMin: 450,
              ratingMax: 625,
            },
            {
              id: '1.10.2',
              name: 'Pin & Pile On',
              description: 'Add pressure to the pin',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'skewer', 'fork'],
              ratingMin: 550,
              ratingMax: 725,
            },
            {
              id: '1.10.3',
              name: 'Pin & Profit',
              description: 'Convert pins to material',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'skewer'],
              ratingMin: 625,
              ratingMax: 800,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 11: Pin → Fork or Mate (SKILL STACK!)
        // ────────────────────────────────────────
        {
          id: 'sec-11',
          name: 'Pin to Fork or Mate',
          description: 'Combine pins with what you know',
          lessons: [
            {
              id: '1.11.1',
              name: 'Pin → Fork',
              description: 'Pin enables the fork',
              requiredTags: ['pin', 'fork'],
              ratingMin: 550,
              ratingMax: 750,
            },
            {
              id: '1.11.2',
              name: 'Pin → Mate',
              description: 'Pin enables checkmate',
              requiredTags: ['pin', 'mate'],
              ratingMin: 550,
              ratingMax: 775,
            },
            {
              id: '1.11.3',
              name: 'Pin Combos',
              description: 'Pins that lead to destruction',
              requiredTags: ['pin'],
              mixedThemes: ['fork', 'mateIn2', 'mate'],
              ratingMin: 600,
              ratingMax: 800,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 12: REVIEW
        // ────────────────────────────────────────
        {
          id: 'sec-12',
          name: 'Block 3 Review',
          description: 'Practice all your skills so far',
          isReview: true,
          lessons: [
            {
              id: '1.12.1',
              name: 'The Easy Way',
              description: 'Warm up with friendlier puzzles',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin', 'fork', 'mateIn1', 'mateIn2'],
              ratingMin: 400,
              ratingMax: 600,
              minPlays: 5000,
            },
            {
              id: '1.12.2',
              name: 'The Hard Way',
              description: 'No more friendships to lose',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin', 'fork', 'mateIn1', 'mateIn2'],
              ratingMin: 600,
              ratingMax: 800,
              minPlays: 5000,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 4: "Stealing Their Bodyguard"
    // Remove the Defender + full combos
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-4',
      name: 'Stealing Their Bodyguard',
      description: 'Remove defenders, then strike',
      sections: [
        // ────────────────────────────────────────
        // Section 13: Remove the Defender
        // ────────────────────────────────────────
        {
          id: 'sec-13',
          name: 'Remove the Defender',
          description: 'Capture what protects',
          lessons: [
            {
              id: '1.13.1',
              name: 'Bodyguard Down: Basics',
              description: 'Take the piece that defends',
              requiredTags: ['capturingDefender'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 400,
              ratingMax: 575,
            },
            {
              id: '1.13.2',
              name: 'Bodyguard Down: Spot It',
              description: 'Find the key defender',
              requiredTags: ['capturingDefender'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 525,
              ratingMax: 675,
            },
            {
              id: '1.13.3',
              name: 'Bodyguard Down: Take It',
              description: 'Remove then capture',
              requiredTags: ['capturingDefender'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 600,
              ratingMax: 750,
            },
            {
              id: '1.13.4',
              name: 'Bodyguard Down: Master',
              description: 'Complex defender removal',
              requiredTags: ['capturingDefender'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 675,
              ratingMax: 800,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 14: Deflection
        // ────────────────────────────────────────
        {
          id: 'sec-14',
          name: 'Deflection',
          description: 'Force defenders away',
          lessons: [
            {
              id: '1.14.1',
              name: 'Deflection: Shoo!',
              description: 'Make the defender move',
              requiredTags: ['deflection'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 450,
              ratingMax: 625,
            },
            {
              id: '1.14.2',
              name: 'Deflection: No Choice',
              description: 'Force the defender to abandon post',
              requiredTags: ['deflection'],
              excludeTags: ['mateIn1', 'mateIn2'],
              ratingMin: 575,
              ratingMax: 725,
            },
            {
              id: '1.14.3',
              name: 'Deflection: Overload',
              description: 'The defender cant do everything',
              requiredTags: ['deflection'],
              ratingMin: 650,
              ratingMax: 800,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 15: RTD → Fork or Mate (SKILL STACK!)
        // ────────────────────────────────────────
        {
          id: 'sec-15',
          name: 'Remove Defender to Win',
          description: 'Remove then destroy',
          lessons: [
            {
              id: '1.15.1',
              name: 'RTD → Fork',
              description: 'Remove defender, then fork',
              requiredTags: ['capturingDefender', 'fork'],
              ratingMin: 550,
              ratingMax: 750,
            },
            {
              id: '1.15.2',
              name: 'RTD → Mate',
              description: 'Remove defender, then checkmate',
              requiredTags: ['capturingDefender', 'mate'],
              ratingMin: 550,
              ratingMax: 775,
            },
            {
              id: '1.15.3',
              name: 'The Full Combo',
              description: 'Everything you learned combined',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['capturingDefender', 'deflection'],
              ratingMin: 600,
              ratingMax: 800,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 16: FINAL REVIEW
        // ────────────────────────────────────────
        {
          id: 'sec-16',
          name: 'Level 1 Final Review',
          description: 'You made it! Show what you learned',
          isReview: true,
          lessons: [
            {
              id: '1.16.1',
              name: 'The Easy Way',
              description: 'Warm up before the boss fight',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn1', 'mateIn2', 'fork', 'pin', 'capturingDefender', 'deflection'],
              ratingMin: 400,
              ratingMax: 600,
              minPlays: 5000,
            },
            {
              id: '1.16.2',
              name: 'The Hard Way',
              description: 'Prove you are ready for Level 2',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn1', 'mateIn2', 'fork', 'pin', 'capturingDefender', 'deflection'],
              ratingMin: 600,
              ratingMax: 800,
              minPlays: 5000,
            },
          ],
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function getAllSections(): Section[] {
  return level1V2.blocks.flatMap(b => b.sections);
}

export function getAllLessons(): LessonCriteria[] {
  return getAllSections().flatMap(s => s.lessons);
}

export function getLessonById(id: string): LessonCriteria | undefined {
  return getAllLessons().find(l => l.id === id);
}

export function getSectionById(id: string): Section | undefined {
  return getAllSections().find(s => s.id === id);
}

export function getBlockById(id: string): Block | undefined {
  return level1V2.blocks.find(b => b.id === id);
}

export function getLessonCount(): number {
  return getAllLessons().length;
}

export function getSectionCount(): number {
  return getAllSections().length;
}

export function getBlockCount(): number {
  return level1V2.blocks.length;
}

// Stats helper
export function getCurriculumStats() {
  const sections = getAllSections();
  const lessons = getAllLessons();
  const reviewSections = sections.filter(s => s.isReview);
  const contentSections = sections.filter(s => !s.isReview);

  return {
    blocks: level1V2.blocks.length,
    totalSections: sections.length,
    contentSections: contentSections.length,
    reviewSections: reviewSections.length,
    totalLessons: lessons.length,
    totalPuzzles: lessons.length * 6,
    averageLessonsPerSection: (lessons.length / sections.length).toFixed(1),
  };
}
