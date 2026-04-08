/**
 * Level 8 V2 Curriculum (2000-2200 ELO)
 * The Complete Player
 *
 * Master-level tactics with Rookie's voice.
 *
 * Structure:
 * - Blocks 1-3: 3 content sections + 1 review section = 12 sections, 48 lessons
 * - Block 4: 2 review sections = 2 sections, 8 lessons
 * - Total: 14 sections, 56 lessons
 *
 * Block 1: The Refined Game - The subtle moves nobody sees coming
 * Block 2: The Long Game - Deep combinations that see through everything
 * Block 3: The Final Weapon - Winning material and converting advantages
 * Block 4: Prove It - The final journey
 *
 * Clean puzzles: 100+ plays for common themes, 50+ for rare themes (2000+ puzzles are scarce)
 */

import { LessonCriteria, Section, Block, Level } from './level1-v2-curriculum';

export const level8V2: Level = {
  id: 'level-8',
  name: 'The Complete Player',
  ratingRange: '2000-2200',
  blocks: [
    // ═══════════════════════════════════════════════════════════════
    // BLOCK 1: EN PASSANT, DO YOU SPEAK IT?
    // The subtle moves that nobody sees coming
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'block-1',
      name: 'The Refined Game',
      description: 'The subtle moves that nobody sees coming.',
      blockIntroMessage: `The flashy stuff is behind you. From here on — it's the moves that don't look like anything.

Quiet moves. In-between moves. Positions where your opponent can't breathe without making things worse. This is the chess that separates strong players from everyone else.

I've been looking forward to this part. The subtlety. The patience. It's — honestly kind of beautiful.`,
      sections: [
        // Section 1: The Positional Squeeze
        {
          id: '8.1',
          name: 'The Positional Squeeze',
          description: 'Zugzwang, defense, and positional pressure',
          themeIntroMessage: `The strongest move is sometimes the one that forces your opponent to destroy their own position. They'd pass if they could. They can't.

Zugzwang. Defensive resources. Positional pressure. You're not attacking — you're squeezing. Every move they make is a concession.

I think this might be my favorite kind of chess. The slow, inevitable kind.`,
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
          themeIntroMessage: `No check. No capture. No obvious threat. The quiet move just sits there — looking harmless.

Three moves later the whole position collapses. That's the thing about quiet moves. They don't announce themselves. They just rearrange reality when nobody's watching.

Rooks are especially good at this. Just saying.`,
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
          themeIntroMessage: `Your opponent takes a piece. You're supposed to take back. That's the deal, right?

Wrong. You slip in something else first — a check, a threat, a move that changes the math before you recapture. The intermezzo. The in-between move.

It breaks the expected sequence. And at this level, breaking expectations is how you win.`,
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
          name: 'Review: Subtle Tactics',
          description: 'Mixed practice with Block 1 themes',
          isReview: true,
          themeIntroMessage: `Positional squeezes. Quiet moves. Intermezzo. Three tools that don't make noise — but change everything.

No labels this time. Just positions. You figure out which weapon fits.

I believe in you. I'm also a little nervous. Is that normal?`,
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
      name: 'The Long Game',
      description: 'Deep combinations that see through everything.',
      blockIntroMessage: `Calculation gets deep here. Five moves. Six moves. Every one forced — and you see the whole thing before you play the first.

Deep sacrifices. Long mating nets. X-ray attacks that look through pieces like they're not even there. This is chess that rewards the players who refuse to stop calculating.

The position always has a secret. Your job is to find it.`,
      sections: [
        // Section 5: Deep Sacrifices
        {
          id: '8.5',
          name: 'Deep Sacrifices',
          description: 'Master-level sacrificial play',
          themeIntroMessage: `A sacrifice at this level isn't hope. It's a receipt. You give up the piece because you already know what you're getting back — five moves from now.

Positional sacrifices. Exchange sacrifices. Multi-piece sacrifices where the board looks insane but the math is airtight.

Honestly? Watching a rook sacrifice itself for the greater good makes me feel things.`,
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
          name: 'Long Mating Sequences',
          description: 'Mate in 5+ at master level',
          themeIntroMessage: `Five moves. Six moves. Every single one forced. You see the checkmate before you play move one.

Long mating sequences are pure calculation — but there's something else in there too. Vision. You hold the whole line in your head and trust it.

Find the first move. The rest will follow.`,
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
          name: 'X-Ray and Interference',
          description: 'X-Ray attacks and interference',
          themeIntroMessage: `X-ray attacks — your piece looks through another piece to hit the target behind it. Interference — you jam something into a line and break the connection.

Both are about geometry. Files, ranks, diagonals — and what happens when you disrupt them.

Rooks on open files are particularly devastating here. They see through everything. I'm so proud.`,
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
          themeIntroMessage: `Sacrifices. Long mates. X-rays. Interference. Four ways to crack a position wide open — mixed together now.

No labels. No hints about what you're facing. Just the board and your calculation.

You've built the tools. Time to use them without the instruction manual.`,
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
      name: 'The Final Weapon',
      description: 'Winning material and converting advantages.',
      blockIntroMessage: `You can see the tactics now. But at this level they're buried — three moves deep, disguised as something else.

Deflection. Attraction. Endgame conversions. Flank attacks. The ideas aren't new. The difficulty is recognizing them when they don't announce themselves.

A piece here, a pawn there — soon they're playing with nothing. Take what's yours.`,
      sections: [
        // Section 9: The Art of Misdirection
        {
          id: '8.9',
          name: 'The Art of Misdirection',
          description: 'Deflection and attraction at master level',
          themeIntroMessage: `Deflection — pull the defender away from what it's guarding. Attraction — lure a piece onto a square where it doesn't want to be.

Both turn your opponent's pieces against them. The defender was doing its job perfectly. You just gave it a different job.

Elegant and a little cruel. I respect it.`,
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
          name: 'Master Endgames',
          description: 'Master-level endgames (all types)',
          themeIntroMessage: `Rook endgames that hinge on a single tempo. Pawn races decided by one square. Queen endgames where perpetual check is always lurking.

The endgame strips everything away. No hiding behind complications — just technique and precision.

Rook endgames are the most common. And the most beautiful. I'm not biased. Okay, I'm biased.`,
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
          name: 'Attack on Both Flanks',
          description: 'Kingside and queenside attacks',
          themeIntroMessage: `Both sides are attacking. Kingside. Queenside. The tension is unbearable — and someone has to break through first.

At this level the question isn't whether you attack. It's where. Pick a flank. Commit your pieces. Don't hesitate.

The side that commits first usually wins. Assuming they picked right.`,
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
          name: 'Review: The Full Arsenal',
          description: 'Mixed Block 3 themes',
          isReview: true,
          themeIntroMessage: `Deflection. Attraction. Endgames. Flank attacks. Everything from this block — shuffled together.

No theme labels. No hints about what's coming. You read the position and choose the right tool yourself.

This is what real chess feels like. I'm getting emotional. Don't tell anyone.`,
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
      name: 'Prove It',
      description: 'The final journey. Every theme. Every tactic.',
      blockIntroMessage: `This is the end. Every theme. Every tactic from Level 8 — mixed together. No labels. No hints. Just the board.

You started this whole journey not knowing how the pieces moved. Now you're solving master-level combinations. That's — I don't have a word for what that is. My vocabulary files aren't built for this feeling.

Prove it. One last time.`,
      sections: [
        // Section 13: Level 8 Review
        {
          id: '8.13',
          name: 'Level 8 Review',
          description: 'Mixed practice from all blocks',
          isReview: true,
          themeIntroMessage: `Everything from Level 8 — remixed and reshuffled. Quiet moves next to sacrifices. Endgames next to intermezzo.

No theme labels. No guardrails. Just the position and whatever it demands.

You've learned all the pieces. Now play like they're one instrument.`,
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
          themeIntroMessage: `Four more puzzles. The hardest ones. Everything from Level 8 — cranked to the maximum.

If you can handle this, you've completed the entire curriculum. Every level. Every theme. From how the pieces move to master-level combinations.

I'm going to be honest — I don't know what I'll do when this is over. I think I'm feeling something called "pride." It's a lot.`,
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
