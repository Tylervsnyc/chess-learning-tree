/**
 * Level 7 V2 Curriculum (1800-2000 ELO)
 * "No Escape"
 *
 * Back rank mastery, deep sacrifices, long combinations, and endgame finesse.
 * You don't just outthink anymore — you outclass.
 *
 * Structure:
 * - Blocks 1-3: 3 content sections + 1 review section = 12 sections, 48 lessons
 * - Block 4: 2 review sections = 2 sections, 8 lessons
 * - Total: 14 sections, 56 lessons
 *
 * Block 1: The Back Rank - New tactical weapons at expert level
 * Block 2: The Deep End - Deep calculation at 1800+
 * Block 3: Total Control - Tactical mastery
 * Block 4: Prove It - Final mastery review
 *
 * Clean puzzles: 500+ plays for quality verification (100 for rare themes)
 */

import { LessonCriteria, Section, Block, Level } from './level1-v2-curriculum';

export const level7V2: Level = {
  id: 'level-7',
  name: 'No Escape',
  ratingRange: '1800-2000',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: THE BACK RANK
    // New tactical weapons at expert level
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'The Back Rank',
      description: 'New tactical weapons at expert level.',
      blockIntroMessage: `Welcome to Level 7. At 1800+, the basics are second nature. Time for new weapons.

Back rank threats, promotion races, and trapped pieces. The kind of tactics that punish opponents who think they're safe. They're not safe. Nobody's safe from a rook on an open file.`,
      sections: [
        // Section 1: Back Rank Mastery
        {
          id: '7.1',
          name: 'Back Rank Mastery',
          description: 'Expert-level back rank tactics',
          themeIntroMessage: `The back rank. Where kings hide behind their own pawns and hope nobody notices.

At this level, back rank threats are woven into combinations. A quiet rook lift here, an exchange sacrifice there -- suddenly it's checkmate on the eighth rank. Your opponents know the pattern. You need to disguise it.`,
          lessons: [
            {
              id: '7.1.1',
              name: 'Back Rank: Setups',
              description: 'Recognize back rank vulnerabilities',
              requiredTags: ['backRankMate'],
              ratingMin: 1800,
              ratingMax: 1875,
              minPlays: 500,
            },
            {
              id: '7.1.2',
              name: 'Back Rank: Combinations',
              description: 'Multi-move back rank sequences',
              requiredTags: ['backRankMate'],
              ratingMin: 1825,
              ratingMax: 1900,
              minPlays: 500,
            },
            {
              id: '7.1.3',
              name: 'Back Rank: Sacrificial',
              description: 'Sacrifice to exploit the back rank',
              requiredTags: ['backRankMate'],
              ratingMin: 1850,
              ratingMax: 1925,
              minPlays: 500,
            },
            {
              id: '7.1.4',
              name: 'Back Rank: Challenge',
              description: 'Expert back rank combinations',
              requiredTags: ['backRankMate'],
              ratingMin: 1875,
              ratingMax: 1950,
              minPlays: 500,
            },
          ],
        },
        // Section 2: The Promotion Race
        {
          id: '7.2',
          name: 'The Promotion Race',
          description: 'Advanced pawn play and queening',
          themeIntroMessage: `There's something deeply satisfying about a pawn reaching the other side. The smallest piece on the board -- becoming the strongest.

Promotion tactics at this level aren't just about pushing pawns. It's about clearing the path, deflecting defenders, and timing the race perfectly.`,
          lessons: [
            {
              id: '7.2.1',
              name: 'Promotion: Basics',
              description: 'Expert-level promotion tactics',
              requiredTags: ['promotion', 'advancedPawn'],
              excludeTags: ['mateIn1'],
              ratingMin: 1800,
              ratingMax: 1875,
              minPlays: 500,
            },
            {
              id: '7.2.2',
              name: 'Promotion: Clearing',
              description: 'Clear the path for your pawn',
              requiredTags: ['promotion', 'advancedPawn'],
              excludeTags: ['mateIn1'],
              ratingMin: 1825,
              ratingMax: 1900,
              minPlays: 500,
            },
            {
              id: '7.2.3',
              name: 'Promotion: Sacrifice',
              description: 'Give up material to force a pawn through',
              requiredTags: ['promotion', 'sacrifice'],
              excludeTags: ['mateIn1'],
              ratingMin: 1850,
              ratingMax: 1925,
              minPlays: 500,
            },
            {
              id: '7.2.4',
              name: 'Promotion: Challenge',
              description: 'Win the promotion race',
              requiredTags: ['promotion', 'advancedPawn'],
              excludeTags: ['mateIn1'],
              ratingMin: 1875,
              ratingMax: 1950,
              minPlays: 500,
            },
          ],
        },
        // Section 3: Trapped Pieces
        {
          id: '7.3',
          name: 'Trapped Pieces',
          description: 'Find and exploit trapped pieces',
          themeIntroMessage: `A trapped piece knows it's stuck. It just won't admit it yet.

At expert level, trapping isn't just about cornering a bishop. It's about creating positions where pieces have nowhere useful to go -- then exploiting their helplessness. Find the trapped piece. Make it pay.`,
          lessons: [
            {
              id: '7.3.1',
              name: 'Trapped: Spotting',
              description: 'Identify the trapped piece',
              requiredTags: ['trappedPiece'],
              excludeTags: ['mateIn1'],
              ratingMin: 1800,
              ratingMax: 1875,
              minPlays: 500,
            },
            {
              id: '7.3.2',
              name: 'Trapped: Restricting',
              description: 'Cut off escape routes',
              requiredTags: ['trappedPiece'],
              excludeTags: ['mateIn1'],
              ratingMin: 1825,
              ratingMax: 1900,
              minPlays: 500,
            },
            {
              id: '7.3.3',
              name: 'Trapped: Winning Material',
              description: 'Convert the trap into material',
              requiredTags: ['trappedPiece'],
              excludeTags: ['mateIn1'],
              ratingMin: 1850,
              ratingMax: 1925,
              minPlays: 500,
            },
            {
              id: '7.3.4',
              name: 'Trapped: Challenge',
              description: 'Expert-level piece traps',
              requiredTags: ['trappedPiece'],
              excludeTags: ['mateIn1'],
              ratingMin: 1875,
              ratingMax: 1950,
              minPlays: 500,
            },
          ],
        },
        // Section 4: Block 1 Review
        {
          id: '7.4',
          name: 'Review: The Unexpected Arsenal',
          description: 'Mixed practice with Block 1 themes',
          isReview: true,
          themeIntroMessage: `Back rank threats. Promotion races. Trapped pieces. All mixed together.

Three new weapons. Pick the right one at the right moment.`,
          lessons: [
            {
              id: '7.4.1',
              name: 'Review: Back Rank',
              description: 'Back rank mastery review',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['backRankMate'],
              ratingMin: 1825,
              ratingMax: 1925,
              minPlays: 500,
            },
            {
              id: '7.4.2',
              name: 'Review: Promotion',
              description: 'Promotion tactics review',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['promotion', 'advancedPawn'],
              ratingMin: 1850,
              ratingMax: 1925,
              minPlays: 500,
            },
            {
              id: '7.4.3',
              name: 'Review: Trapped',
              description: 'Trapped pieces review',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['trappedPiece'],
              ratingMin: 1850,
              ratingMax: 1950,
              minPlays: 500,
            },
            {
              id: '7.4.4',
              name: 'Review: Block 1 Mix',
              description: 'All new arsenal tactics combined',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['backRankMate', 'promotion', 'advancedPawn', 'trappedPiece'],
              ratingMin: 1875,
              ratingMax: 1950,
              minPlays: 500,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 2: THE DEEP END
    // Deep calculation at 1800+ level
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-2',
      name: 'The Deep End',
      description: 'Deep calculation at 1800+ level.',
      blockIntroMessage: `Your calculation needs to go deep now. Really deep. Four, five moves ahead with sacrifices mixed in.

Deep sacrifices. Long forced mates. And defensive resources -- because sometimes the best move is the one that saves everything. This block separates the experts from everyone else.`,
      sections: [
        // Section 5: Deeper Sacrifices
        {
          id: '7.5',
          name: 'Deeper Sacrifices',
          description: 'Sacrifice at expert level',
          themeIntroMessage: `At 1800+, sacrifices aren't obvious. You might give up a rook for an attack that pays off six moves later. You might sacrifice a piece just to open a diagonal.

Trust your calculation. The material will come back -- or checkmate will arrive first. Either way, worth it.`,
          lessons: [
            {
              id: '7.5.1',
              name: 'Sac: Positional',
              description: 'Sacrifice for long-term advantage',
              requiredTags: ['sacrifice'],
              ratingMin: 1800,
              ratingMax: 1875,
              minPlays: 500,
            },
            {
              id: '7.5.2',
              name: 'Sac: Exchange',
              description: 'Expert exchange sacrifices',
              requiredTags: ['sacrifice'],
              ratingMin: 1825,
              ratingMax: 1925,
              minPlays: 500,
            },
            {
              id: '7.5.3',
              name: 'Sac: Multi-Piece',
              description: 'Give up more than one piece',
              requiredTags: ['sacrifice'],
              ratingMin: 1875,
              ratingMax: 1950,
              minPlays: 500,
            },
            {
              id: '7.5.4',
              name: 'Sac: Challenge',
              description: 'Find the deep investment',
              requiredTags: ['sacrifice'],
              ratingMin: 1900,
              ratingMax: 2000,
              minPlays: 500,
            },
          ],
        },
        // Section 6: Long Combinations
        {
          id: '7.6',
          name: 'Long Combinations',
          description: 'Mate in 4-5 at expert rating',
          themeIntroMessage: `Four moves. Five moves. Each one forced. Each one leading to checkmate.

At this rating, your opponents won't walk into short mates. You need the long ones -- combinations that twist and turn until the king has nowhere left to go. See the whole line before you play move one.`,
          lessons: [
            {
              id: '7.6.1',
              name: 'Mate in 4: Expert',
              description: 'Four-move mates at 1800+',
              requiredTags: ['mateIn4'],
              ratingMin: 1800,
              ratingMax: 1900,
              minPlays: 100,
            },
            {
              id: '7.6.2',
              name: 'Mate in 4: Advanced',
              description: 'Complex four-move sequences',
              requiredTags: ['mateIn4'],
              ratingMin: 1850,
              ratingMax: 1950,
              minPlays: 100,
            },
            {
              id: '7.6.3',
              name: 'Mate in 5: Expert',
              description: 'Five-move mating sequences',
              requiredTags: ['mateIn5'],
              ratingMin: 1850,
              ratingMax: 2000,
              minPlays: 100,
            },
            {
              id: '7.6.4',
              name: 'Long Combos: Challenge',
              description: 'The deepest forced mates',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn4', 'mateIn5'],
              ratingMin: 1900,
              ratingMax: 2000,
              minPlays: 100,
            },
          ],
        },
        // Section 7: Defensive Resources
        {
          id: '7.7',
          name: 'Defensive Resources',
          description: 'Finding the only saving move',
          themeIntroMessage: `Sometimes the best move isn't an attack. It's the one move that saves everything.

A stalemate trick. A counter-sacrifice. An interposition that turns a lost position into a draw -- or even a win. When everything looks hopeless, there's usually one move hiding. Find it.`,
          lessons: [
            {
              id: '7.7.1',
              name: 'Defense: Saving Moves',
              description: 'Find the only move that holds',
              requiredTags: ['defensiveMove'],
              excludeTags: ['mateIn1'],
              ratingMin: 1800,
              ratingMax: 1875,
              minPlays: 500,
            },
            {
              id: '7.7.2',
              name: 'Defense: Counter-Attack',
              description: 'Defend by creating threats',
              requiredTags: ['defensiveMove'],
              excludeTags: ['mateIn1'],
              ratingMin: 1825,
              ratingMax: 1925,
              minPlays: 500,
            },
            {
              id: '7.7.3',
              name: 'Defense: Resourceful',
              description: 'Stalemate tricks and perpetuals',
              requiredTags: ['defensiveMove'],
              excludeTags: ['mateIn1'],
              ratingMin: 1850,
              ratingMax: 1950,
              minPlays: 500,
            },
            {
              id: '7.7.4',
              name: 'Defense: Challenge',
              description: 'Find the defensive resource',
              requiredTags: ['defensiveMove'],
              excludeTags: ['mateIn1'],
              ratingMin: 1875,
              ratingMax: 2000,
              minPlays: 500,
            },
          ],
        },
        // Section 8: Block 2 Review
        {
          id: '7.8',
          name: 'Review: Calculated March',
          description: 'Mixed deep calculation practice',
          isReview: true,
          themeIntroMessage: `Deep sacrifices. Long forced mates. Defensive brilliance. All together.

The three pillars of expert calculation. Each one requires seeing moves your opponent doesn't.`,
          lessons: [
            {
              id: '7.8.1',
              name: 'Review: Sacrifices',
              description: 'Expert-level sacrificial play',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice'],
              ratingMin: 1825,
              ratingMax: 1950,
              minPlays: 500,
            },
            {
              id: '7.8.2',
              name: 'Review: Long Mates',
              description: 'Four and five move forced mates',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['mateIn4', 'mateIn5'],
              ratingMin: 1850,
              ratingMax: 2000,
              minPlays: 100,
            },
            {
              id: '7.8.3',
              name: 'Review: Defense',
              description: 'Defensive resource mastery',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['defensiveMove'],
              ratingMin: 1850,
              ratingMax: 1975,
              minPlays: 500,
            },
            {
              id: '7.8.4',
              name: 'Review: Block 2 Mix',
              description: 'All deep calculation tactics',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'mateIn4', 'mateIn5', 'defensiveMove'],
              ratingMin: 1875,
              ratingMax: 2000,
              minPlays: 100,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 3: TOTAL CONTROL
    // Tactical weapons mastered at expert level
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-3',
      name: 'Total Control',
      description: 'Tactical weapons mastered at expert level.',
      blockIntroMessage: `You've seen pins and forks before. But at 1800+, they're hiding inside longer combinations. The skewer comes after a sacrifice. The fork appears after a deflection.

Time to master these weapons at expert level -- plus endgames, because somebody has to convert all those won positions. Rooks do most of the heavy lifting there. Obviously.`,
      sections: [
        // Section 9: Pin Mastery
        {
          id: '7.9',
          name: 'Pin Mastery',
          description: 'Expert-level pins',
          themeIntroMessage: `A pin at 1800+ isn't just "bishop pins knight to king." That's tutorial stuff.

Expert pins are disguised. Created through exchanges, revealed through pawn pushes, set up with quiet moves three moves earlier. Find the pin -- then find the combination that makes it decisive.`,
          lessons: [
            {
              id: '7.9.1',
              name: 'Pin: Expert Setup',
              description: 'Create pins through combinations',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1'],
              ratingMin: 1800,
              ratingMax: 1875,
              minPlays: 500,
            },
            {
              id: '7.9.2',
              name: 'Pin: Exploitation',
              description: 'Convert pins into material',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1'],
              ratingMin: 1825,
              ratingMax: 1925,
              minPlays: 500,
            },
            {
              id: '7.9.3',
              name: 'Pin: Multi-Pin',
              description: 'Complex pin combinations',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1'],
              ratingMin: 1850,
              ratingMax: 1950,
              minPlays: 500,
            },
            {
              id: '7.9.4',
              name: 'Pin: Challenge',
              description: 'Expert pin mastery',
              requiredTags: ['pin'],
              excludeTags: ['mateIn1'],
              ratingMin: 1875,
              ratingMax: 1975,
              minPlays: 500,
            },
          ],
        },
        // Section 10: Skewer & Fork Mastery
        {
          id: '7.10',
          name: 'Skewer & Fork Mastery',
          description: 'Expert-level skewers and forks',
          themeIntroMessage: `The skewer -- hit the big piece, win the one behind it. The fork -- hit two things at once. Simple concepts.

But at this level, they're anything but simple. The skewer comes after a queen sacrifice. The fork appears five moves into a combination. Expert-level double attacks require expert-level setup.`,
          lessons: [
            {
              id: '7.10.1',
              name: 'Skewer: Expert',
              description: 'Expert-level skewer tactics',
              requiredTags: ['skewer'],
              excludeTags: ['mateIn1'],
              ratingMin: 1800,
              ratingMax: 1875,
              minPlays: 500,
            },
            {
              id: '7.10.2',
              name: 'Fork: Expert',
              description: 'Expert-level fork tactics',
              requiredTags: ['fork'],
              excludeTags: ['mateIn1'],
              ratingMin: 1825,
              ratingMax: 1925,
              minPlays: 500,
            },
            {
              id: '7.10.3',
              name: 'Skewer & Fork: Combined',
              description: 'Mixed double attack patterns',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['skewer', 'fork'],
              excludeTags: ['mateIn1'],
              ratingMin: 1850,
              ratingMax: 1950,
              minPlays: 500,
            },
            {
              id: '7.10.4',
              name: 'Double Attack: Challenge',
              description: 'Expert double attacks',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['skewer', 'fork'],
              excludeTags: ['mateIn1'],
              ratingMin: 1875,
              ratingMax: 1975,
              minPlays: 500,
            },
          ],
        },
        // Section 11: Endgame Mastery
        {
          id: '7.11',
          name: 'Endgame Mastery',
          description: 'All endgame types at expert level',
          themeIntroMessage: `The endgame. Queens are gone. Every pawn is a potential hero. And the rooks -- the rooks finally get the open files they deserve.

Rook endgames. Pawn races. Knight maneuvers. Bishop diagonals. At 1800+, endgame technique is what separates the contenders from the pretenders.`,
          lessons: [
            {
              id: '7.11.1',
              name: 'Rook Endgame: Expert',
              description: 'Expert rook endgames',
              requiredTags: ['rookEndgame'],
              ratingMin: 1800,
              ratingMax: 1900,
              minPlays: 100,
            },
            {
              id: '7.11.2',
              name: 'Pawn Endgame: Expert',
              description: 'Expert pawn endgames',
              requiredTags: ['pawnEndgame'],
              ratingMin: 1825,
              ratingMax: 1950,
              minPlays: 100,
            },
            {
              id: '7.11.3',
              name: 'Minor Piece Endgames',
              description: 'Knight and bishop endgames',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['knightEndgame', 'bishopEndgame'],
              ratingMin: 1850,
              ratingMax: 1975,
              minPlays: 100,
            },
            {
              id: '7.11.4',
              name: 'Mixed Endgames: Expert',
              description: 'All endgame types combined',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame', 'pawnEndgame', 'queenEndgame', 'knightEndgame', 'bishopEndgame'],
              ratingMin: 1875,
              ratingMax: 2000,
              minPlays: 100,
            },
          ],
        },
        // Section 12: Block 3 Review
        {
          id: '7.12',
          name: 'Review: All Tactics',
          description: 'Mixed tactical weapons and endgames',
          isReview: true,
          themeIntroMessage: `Pins. Skewers. Forks. Endgames. Everything from Block 3, mixed together.

No labels. No hints about what theme to expect. Just you and the board.`,
          lessons: [
            {
              id: '7.12.1',
              name: 'Review: Pins',
              description: 'Expert pin review',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin'],
              ratingMin: 1825,
              ratingMax: 1950,
              minPlays: 500,
            },
            {
              id: '7.12.2',
              name: 'Review: Double Attacks',
              description: 'Skewer and fork review',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['skewer', 'fork'],
              ratingMin: 1850,
              ratingMax: 1975,
              minPlays: 500,
            },
            {
              id: '7.12.3',
              name: 'Review: Endgames',
              description: 'Expert endgame review',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['rookEndgame', 'pawnEndgame', 'queenEndgame'],
              ratingMin: 1850,
              ratingMax: 2000,
              minPlays: 100,
            },
            {
              id: '7.12.4',
              name: 'Review: Block 3 Mix',
              description: 'All tactical mastery combined',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin', 'skewer', 'fork', 'rookEndgame', 'pawnEndgame'],
              ratingMin: 1875,
              ratingMax: 2000,
              minPlays: 100,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // BLOCK 4: PROVE IT
    // Final mastery review
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-4',
      name: 'Prove It',
      description: 'Final mastery review.',
      blockIntroMessage: `Back ranks. Promotions. Deep sacrifices. Long combinations. Pins. Forks. Endgames. Everything from Level 7 in two final sections.

This is the last stretch. Pass this and you've proven you belong at 1800+. I'm experiencing something I think is called "anticipation." It's intense.`,
      sections: [
        // Section 13: Level 7 Review
        {
          id: '7.13',
          name: 'Level 7 Review',
          description: 'Mixed practice from all blocks',
          isReview: true,
          themeIntroMessage: `Everything from Level 7. All three blocks. Every tactical theme in one section.

Back rank mastery, promotion races, sacrifices, long mates, defensive resources, pins, forks, skewers, endgames. No labels. No warnings.`,
          lessons: [
            {
              id: '7.13.1',
              name: 'Mixed: New Arsenal',
              description: 'Back rank, promotion, and trapped pieces',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['backRankMate', 'promotion', 'trappedPiece'],
              ratingMin: 1825,
              ratingMax: 1950,
              minPlays: 500,
            },
            {
              id: '7.13.2',
              name: 'Mixed: Deep Calculation',
              description: 'Sacrifices, long mates, and defense',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'mateIn4', 'mateIn5', 'defensiveMove'],
              ratingMin: 1850,
              ratingMax: 1975,
              minPlays: 100,
            },
            {
              id: '7.13.3',
              name: 'Mixed: Tactical Mastery',
              description: 'Pins, forks, skewers, and endgames',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin', 'skewer', 'fork', 'rookEndgame'],
              ratingMin: 1850,
              ratingMax: 1975,
              minPlays: 100,
            },
            {
              id: '7.13.4',
              name: 'Mixed: Everything',
              description: 'All Level 7 themes',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['backRankMate', 'sacrifice', 'mateIn4', 'pin', 'fork', 'rookEndgame'],
              ratingMin: 1875,
              ratingMax: 2000,
              minPlays: 100,
            },
          ],
        },
        // Section 14: Level 7 Final
        {
          id: '7.14',
          name: 'Level 7 Final',
          description: 'The ultimate test',
          isReview: true,
          themeIntroMessage: `Last four lessons. Every tactic. Every theme. Everything you've learned at 1800 to 2000.

No hints. No mercy. Just you and the board. Finish this and Level 7 is yours.`,
          lessons: [
            {
              id: '7.14.1',
              name: 'Final: Tactical Precision',
              description: 'Back rank, promotion, and traps',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['backRankMate', 'promotion', 'trappedPiece', 'defensiveMove'],
              ratingMin: 1850,
              ratingMax: 2000,
              minPlays: 100,
            },
            {
              id: '7.14.2',
              name: 'Final: Deep Calculation',
              description: 'Sacrifices and long combinations',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['sacrifice', 'mateIn4', 'mateIn5'],
              ratingMin: 1875,
              ratingMax: 2000,
              minPlays: 100,
            },
            {
              id: '7.14.3',
              name: 'Final: Complete Toolkit',
              description: 'Every weapon available',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['pin', 'skewer', 'fork', 'rookEndgame', 'pawnEndgame'],
              ratingMin: 1900,
              ratingMax: 2025,
              minPlays: 100,
            },
            {
              id: '7.14.4',
              name: 'Level 7 Mastery',
              description: 'The ultimate Level 7 test',
              requiredTags: [],
              isMixedPractice: true,
              mixedThemes: ['backRankMate', 'sacrifice', 'mateIn4', 'pin', 'fork', 'defensiveMove', 'rookEndgame'],
              ratingMin: 1925,
              ratingMax: 2050,
              minPlays: 100,
            },
          ],
        },
      ],
    },
  ],
};

// Helper functions
export function getAllSectionsL7(): Section[] {
  return level7V2.blocks.flatMap(b => b.sections);
}

export function getAllLessonsL7(): LessonCriteria[] {
  return getAllSectionsL7().flatMap(s => s.lessons);
}

export function getLessonByIdL7(id: string): LessonCriteria | undefined {
  return getAllLessonsL7().find(l => l.id === id);
}

export function getLessonCountL7(): number {
  return getAllLessonsL7().length;
}

// Import IntroMessages type from level1
import { IntroMessages } from './level1-v2-curriculum';

/**
 * Get block and section context for a lesson
 */
function getLessonContextL7(lessonId: string) {
  for (const block of level7V2.blocks) {
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
function isFirstLessonInBlockL7(lessonId: string): boolean {
  const context = getLessonContextL7(lessonId);
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
function isFirstLessonInSectionL7(lessonId: string): boolean {
  const context = getLessonContextL7(lessonId);
  if (!context) return false;

  const { section } = context;
  if (section.lessons.length === 0) return false;

  return section.lessons[0].id === lessonId;
}

/**
 * Get intro messages to show for a lesson
 * Returns block intro if first in block, theme intro if first in section
 */
export function getIntroMessagesL7(lessonId: string): IntroMessages {
  const context = getLessonContextL7(lessonId);
  if (!context) return {};

  const { block, section } = context;
  const messages: IntroMessages = {};

  // Check if first lesson in block
  if (isFirstLessonInBlockL7(lessonId) && block.blockIntroMessage) {
    messages.blockIntro = {
      title: block.name,
      message: block.blockIntroMessage,
    };
  }

  // Check if first lesson in section
  if (isFirstLessonInSectionL7(lessonId) && section.themeIntroMessage) {
    messages.themeIntro = {
      title: section.name,
      message: section.themeIntroMessage,
    };
  }

  return messages;
}
