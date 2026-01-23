/**
 * Level 1 Curriculum - ENDS ONLY (400-800 ELO)
 *
 * Philosophy: Level 1 is ALL about pattern recognition (ENDS)
 * "Here's WHAT you're trying to achieve"
 *
 * MEANS (sacrifice, deflection, attraction) saved for Level 2+
 *
 * Structure: Level → Block → Section → Lesson
 * - 4 Blocks per Level (with funny names!)
 * - 4 Sections per Block (3 content + 1 review)
 * - 2-4 Lessons per Section
 * - Review sections: "The Easy Way" + "The Hard Way"
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
  name: string;
  description: string;
  sections: Section[];
}

export interface Level {
  id: string;
  name: string;
  ratingRange: string;
  blocks: Block[];
}

export const level1Ends: Level = {
  id: 'level-1',
  name: 'Level 1: Pattern Spotter',
  ratingRange: '400-800',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: "Oops, You're Dead"
    // All about checkmate patterns - SEE the final blow
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: "Oops, You're Dead",
      description: 'Learn to spot checkmate - the ultimate goal',
      sections: [
        // ────────────────────────────────────────
        // Section 1: Queen Checkmates
        // ────────────────────────────────────────
        {
          id: 'sec-1-1',
          name: 'Queen Says Checkmate',
          description: 'The queen delivers the final blow',
          lessons: [
            {
              id: '1.1.1',
              name: 'Queen Mate: Baby Steps',
              description: 'Simple queen checkmates',
              requiredTags: ['mateIn1'],
              ratingMin: 400,
              ratingMax: 500,
              pieceFilter: 'queen',
            },
            {
              id: '1.1.2',
              name: 'Queen Mate: Getting Warmer',
              description: 'Queen checkmates - a bit trickier',
              requiredTags: ['mateIn1'],
              ratingMin: 475,
              ratingMax: 575,
              pieceFilter: 'queen',
            },
            {
              id: '1.1.3',
              name: 'Queen Mate: Hot Stuff',
              description: 'Spot the queen checkmate',
              requiredTags: ['mateIn1'],
              ratingMin: 550,
              ratingMax: 675,
              pieceFilter: 'queen',
            },
            {
              id: '1.1.4',
              name: 'Queen Mate: On Fire',
              description: 'Queen checkmates - you got this',
              requiredTags: ['mateIn1'],
              ratingMin: 625,
              ratingMax: 750,
              pieceFilter: 'queen',
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 2: Rook Checkmates
        // ────────────────────────────────────────
        {
          id: 'sec-1-2',
          name: 'Rook n Roll',
          description: 'The rook crashes the party',
          lessons: [
            {
              id: '1.2.1',
              name: 'Rook Mate: First Gig',
              description: 'Simple rook checkmates',
              requiredTags: ['mateIn1'],
              ratingMin: 400,
              ratingMax: 525,
              pieceFilter: 'rook',
            },
            {
              id: '1.2.2',
              name: 'Rook Mate: Encore',
              description: 'Rook checkmates - keep rocking',
              requiredTags: ['mateIn1'],
              ratingMin: 500,
              ratingMax: 625,
              pieceFilter: 'rook',
            },
            {
              id: '1.2.3',
              name: 'Rook Mate: Headliner',
              description: 'Rook checkmates - main stage',
              requiredTags: ['mateIn1'],
              ratingMin: 575,
              ratingMax: 725,
              pieceFilter: 'rook',
            },
            {
              id: '1.2.4',
              name: 'Rook Mate: Sold Out Show',
              description: 'Rook checkmates - crowd goes wild',
              requiredTags: ['mateIn1'],
              ratingMin: 650,
              ratingMax: 800,
              pieceFilter: 'rook',
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 3: Back Rank Mate
        // ────────────────────────────────────────
        {
          id: 'sec-1-3',
          name: 'Sneak Attack From Behind',
          description: 'The classic back rank checkmate',
          lessons: [
            {
              id: '1.3.1',
              name: 'Back Rank: Trapped!',
              description: 'King stuck on the back rank',
              requiredTags: ['backRankMate', 'mateIn1'],
              ratingMin: 400,
              ratingMax: 525,
            },
            {
              id: '1.3.2',
              name: 'Back Rank: No Escape',
              description: 'Back rank mates - medium',
              requiredTags: ['backRankMate', 'mateIn1'],
              ratingMin: 500,
              ratingMax: 650,
            },
            {
              id: '1.3.3',
              name: 'Back Rank: Nowhere to Hide',
              description: 'Back rank mates - trickier',
              requiredTags: ['backRankMate', 'mateIn1'],
              ratingMin: 600,
              ratingMax: 750,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 4: REVIEW
        // ────────────────────────────────────────
        {
          id: 'sec-1-4',
          name: 'Block 1 Victory Lap',
          description: 'Show off your checkmate skills',
          isReview: true,
          lessons: [
            {
              id: '1.4.1',
              name: 'The Easy Way',
              description: 'Warm up with friendly checkmates',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn1', 'backRankMate'],
              ratingMin: 400,
              ratingMax: 575,
              minPlays: 5000,
            },
            {
              id: '1.4.2',
              name: 'The Hard Way',
              description: 'Prove you earned that crown',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn1', 'backRankMate'],
              ratingMin: 575,
              ratingMax: 800,
              minPlays: 5000,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 2: "The Fork Awakens"
    // Double attacks - hit two things at once!
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-2',
      name: 'The Fork Awakens',
      description: 'Attack two pieces at once - pure chaos',
      sections: [
        // ────────────────────────────────────────
        // Section 5: Knight Forks
        // ────────────────────────────────────────
        {
          id: 'sec-2-1',
          name: 'Horsey Goes Boing',
          description: 'The knight attacks two pieces at once',
          lessons: [
            {
              id: '1.5.1',
              name: 'Knight Fork: Royal Robbery',
              description: 'Fork the king and queen',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 400,
              ratingMax: 525,
              pieceFilter: 'knight',
            },
            {
              id: '1.5.2',
              name: 'Knight Fork: Double Trouble',
              description: 'Fork any two pieces',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 500,
              ratingMax: 625,
              pieceFilter: 'knight',
            },
            {
              id: '1.5.3',
              name: 'Knight Fork: Triple Threat',
              description: 'Sometimes you fork three things!',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 575,
              ratingMax: 700,
              pieceFilter: 'knight',
            },
            {
              id: '1.5.4',
              name: 'Knight Fork: Grandmaster Boing',
              description: 'Knight forks - expert level',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 650,
              ratingMax: 800,
              pieceFilter: 'knight',
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 6: Pawn & Bishop Forks
        // ────────────────────────────────────────
        {
          id: 'sec-2-2',
          name: 'Little Guys, Big Dreams',
          description: 'Pawns and bishops want in on the fun',
          lessons: [
            {
              id: '1.6.1',
              name: 'Pawn Fork: Tiny but Mighty',
              description: 'Even pawns can fork!',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 400,
              ratingMax: 650,
              pieceFilter: 'pawn',
            },
            {
              id: '1.6.2',
              name: 'Pawn Fork: Underdog Story',
              description: 'Pawn forks - the sequel',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 550,
              ratingMax: 800,
              pieceFilter: 'pawn',
            },
            {
              id: '1.6.3',
              name: 'Bishop Fork: Diagonal Disaster',
              description: 'Bishop attacks along diagonals',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 400,
              ratingMax: 700,
              pieceFilter: 'bishop',
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 7: Queen & Rook Forks
        // ────────────────────────────────────────
        {
          id: 'sec-2-3',
          name: 'Big Guns, Big Forks',
          description: 'Heavy pieces join the fork party',
          lessons: [
            {
              id: '1.7.1',
              name: 'Queen Fork: Maximum Chaos',
              description: 'Queen attacks everything at once',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 400,
              ratingMax: 600,
              pieceFilter: 'queen',
            },
            {
              id: '1.7.2',
              name: 'Queen Fork: Greedy Queen',
              description: 'Queen forks - grab all the pieces',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 550,
              ratingMax: 750,
              pieceFilter: 'queen',
            },
            {
              id: '1.7.3',
              name: 'Rook Fork: Surprise!',
              description: 'Rook forks along ranks and files',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 450,
              ratingMax: 700,
              pieceFilter: 'rook',
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 8: REVIEW
        // ────────────────────────────────────────
        {
          id: 'sec-2-4',
          name: 'Fork Yeah!',
          description: 'Time to show off your forking skills',
          isReview: true,
          lessons: [
            {
              id: '1.8.1',
              name: 'The Easy Way',
              description: 'Friendly forks to warm up',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'mateIn1'],
              excludeTags: ['mateIn2', 'mateIn3'],
              ratingMin: 400,
              ratingMax: 575,
              minPlays: 5000,
            },
            {
              id: '1.8.2',
              name: 'The Hard Way',
              description: 'Fork like you mean it',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['fork', 'mateIn1'],
              excludeTags: ['mateIn2', 'mateIn3'],
              ratingMin: 575,
              ratingMax: 800,
              minPlays: 5000,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 3: "Stuck in the Middle With You"
    // Pins and Skewers - line attacks that trap pieces
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-3',
      name: 'Stuck in the Middle With You',
      description: 'Pins and skewers - pieces that cant move',
      sections: [
        // ────────────────────────────────────────
        // Section 9: Pins
        // ────────────────────────────────────────
        {
          id: 'sec-3-1',
          name: 'Pinned Like a Butterfly',
          description: 'The piece is stuck protecting something',
          lessons: [
            {
              id: '1.9.1',
              name: 'Pin: Stuck!',
              description: 'Basic pin patterns',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3', 'skewer'],
              ratingMin: 400,
              ratingMax: 550,
            },
            {
              id: '1.9.2',
              name: 'Pin: Really Stuck!',
              description: 'Pins - medium difficulty',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3', 'skewer'],
              ratingMin: 500,
              ratingMax: 650,
            },
            {
              id: '1.9.3',
              name: 'Pin: Super Stuck!',
              description: 'Pins - getting trickier',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3', 'skewer'],
              ratingMin: 600,
              ratingMax: 750,
            },
            {
              id: '1.9.4',
              name: 'Pin: Maximum Stuckage',
              description: 'Pins - expert patterns',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3', 'skewer'],
              ratingMin: 675,
              ratingMax: 800,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 10: Skewers
        // ────────────────────────────────────────
        {
          id: 'sec-3-2',
          name: 'The Old Switcheroo',
          description: 'Attack one piece, win the one behind it',
          lessons: [
            {
              id: '1.10.1',
              name: 'Skewer: Through and Through',
              description: 'Basic skewer patterns',
              requiredTags: ['skewer'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 400,
              ratingMax: 575,
            },
            {
              id: '1.10.2',
              name: 'Skewer: X-Ray Vision',
              description: 'Skewers - see through pieces',
              requiredTags: ['skewer'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 525,
              ratingMax: 675,
            },
            {
              id: '1.10.3',
              name: 'Skewer: Kebab Time',
              description: 'Skewers - stick em all',
              requiredTags: ['skewer'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 625,
              ratingMax: 800,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 11: Discovered Attacks
        // ────────────────────────────────────────
        {
          id: 'sec-3-3',
          name: 'Peek-a-Boo!',
          description: 'Move one piece, reveal an attack',
          lessons: [
            {
              id: '1.11.1',
              name: 'Discovery: Surprise!',
              description: 'Basic discovered attacks',
              requiredTags: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 400,
              ratingMax: 575,
            },
            {
              id: '1.11.2',
              name: 'Discovery: Double Whammy',
              description: 'Discovered attacks - two threats',
              requiredTags: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 525,
              ratingMax: 700,
            },
            {
              id: '1.11.3',
              name: 'Discovery: Chaos Mode',
              description: 'Discovered attacks - maximum damage',
              requiredTags: ['discoveredAttack'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 625,
              ratingMax: 800,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 12: REVIEW
        // ────────────────────────────────────────
        {
          id: 'sec-3-4',
          name: 'Line Dance Party',
          description: 'Pins, skewers, discoveries - all the lines!',
          isReview: true,
          lessons: [
            {
              id: '1.12.1',
              name: 'The Easy Way',
              description: 'Friendly line attacks',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin', 'skewer', 'discoveredAttack', 'fork', 'mateIn1'],
              ratingMin: 400,
              ratingMax: 575,
              minPlays: 5000,
            },
            {
              id: '1.12.2',
              name: 'The Hard Way',
              description: 'Lines that make opponents cry',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin', 'skewer', 'discoveredAttack', 'fork', 'mateIn1'],
              ratingMin: 575,
              ratingMax: 800,
              minPlays: 5000,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 4: "Free Real Estate"
    // Hanging pieces, winning material, simple captures
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-4',
      name: 'Free Real Estate',
      description: 'Grab the free stuff - hanging pieces everywhere',
      sections: [
        // ────────────────────────────────────────
        // Section 13: Hanging Pieces
        // ────────────────────────────────────────
        {
          id: 'sec-4-1',
          name: 'Thanks For the Free Stuff',
          description: 'Undefended pieces are yours to take',
          lessons: [
            {
              id: '1.13.1',
              name: 'Hanging: Easy Pickings',
              description: 'Spot the free piece',
              requiredTags: ['hangingPiece'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 400,
              ratingMax: 550,
            },
            {
              id: '1.13.2',
              name: 'Hanging: Finders Keepers',
              description: 'More free pieces to grab',
              requiredTags: ['hangingPiece'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 500,
              ratingMax: 675,
            },
            {
              id: '1.13.3',
              name: 'Hanging: Eagle Eye',
              description: 'Spot the sneaky hanging piece',
              requiredTags: ['hangingPiece'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 625,
              ratingMax: 800,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 14: Trapped Pieces
        // ────────────────────────────────────────
        {
          id: 'sec-4-2',
          name: 'Nowhere to Run',
          description: 'Pieces with no escape are doomed',
          lessons: [
            {
              id: '1.14.1',
              name: 'Trapped: Gotcha!',
              description: 'The piece has no squares',
              requiredTags: ['trappedPiece'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 400,
              ratingMax: 600,
            },
            {
              id: '1.14.2',
              name: 'Trapped: No Way Out',
              description: 'Trap those pieces',
              requiredTags: ['trappedPiece'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 550,
              ratingMax: 725,
            },
            {
              id: '1.14.3',
              name: 'Trapped: Maximum Security',
              description: 'Expert piece trapping',
              requiredTags: ['trappedPiece'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 650,
              ratingMax: 800,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 15: Pawn Promotion
        // ────────────────────────────────────────
        {
          id: 'sec-4-3',
          name: 'Glow Up',
          description: 'Turn that pawn into a queen',
          lessons: [
            {
              id: '1.15.1',
              name: 'Promotion: Almost There',
              description: 'Get the pawn to the end',
              requiredTags: ['promotion'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 400,
              ratingMax: 575,
            },
            {
              id: '1.15.2',
              name: 'Promotion: Touchdown!',
              description: 'Promote that pawn',
              requiredTags: ['promotion'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 525,
              ratingMax: 700,
            },
            {
              id: '1.15.3',
              name: 'Promotion: Queen Me!',
              description: 'Complex promotion tactics',
              requiredTags: ['promotion'],
              excludeTags: ['mateIn1', 'mateIn2', 'mateIn3'],
              ratingMin: 650,
              ratingMax: 800,
            },
          ],
        },

        // ────────────────────────────────────────
        // Section 16: FINAL REVIEW
        // ────────────────────────────────────────
        {
          id: 'sec-4-4',
          name: 'Level 1 Boss Fight',
          description: 'Everything you learned - bring it all together',
          isReview: true,
          lessons: [
            {
              id: '1.16.1',
              name: 'The Easy Way',
              description: 'Warm up before the final boss',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn1', 'backRankMate', 'fork', 'pin', 'skewer', 'hangingPiece', 'trappedPiece', 'promotion'],
              ratingMin: 400,
              ratingMax: 575,
              minPlays: 5000,
            },
            {
              id: '1.16.2',
              name: 'The Hard Way',
              description: 'Prove you are ready for Level 2',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn1', 'backRankMate', 'fork', 'pin', 'skewer', 'hangingPiece', 'trappedPiece', 'promotion'],
              ratingMin: 575,
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
  return level1Ends.blocks.flatMap(b => b.sections);
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
  return level1Ends.blocks.find(b => b.id === id);
}

export function getLessonCount(): number {
  return getAllLessons().length;
}

export function getSectionCount(): number {
  return getAllSections().length;
}

export function getBlockCount(): number {
  return level1Ends.blocks.length;
}

// Stats helper
export function getCurriculumStats() {
  const sections = getAllSections();
  const lessons = getAllLessons();
  const reviewSections = sections.filter(s => s.isReview);
  const contentSections = sections.filter(s => !s.isReview);

  return {
    blocks: level1Ends.blocks.length,
    totalSections: sections.length,
    contentSections: contentSections.length,
    reviewSections: reviewSections.length,
    totalLessons: lessons.length,
    totalPuzzles: lessons.length * 6,
    averageLessonsPerSection: (lessons.length / sections.length).toFixed(1),
  };
}

// Summary for display
export function getCurriculumSummary(): string {
  const stats = getCurriculumStats();

  let summary = `
LEVEL 1: PATTERN SPOTTER (ENDS ONLY)
════════════════════════════════════════════════════════

`;

  for (const block of level1Ends.blocks) {
    summary += `BLOCK: "${block.name}"\n`;
    summary += `  ${block.description}\n`;
    for (const section of block.sections) {
      const review = section.isReview ? ' [REVIEW]' : '';
      summary += `    → ${section.name}${review} (${section.lessons.length} lessons)\n`;
    }
    summary += '\n';
  }

  summary += `────────────────────────────────────────────────────────
TOTALS: ${stats.blocks} blocks, ${stats.totalSections} sections, ${stats.totalLessons} lessons (${stats.totalPuzzles} puzzles)
`;

  return summary;
}
