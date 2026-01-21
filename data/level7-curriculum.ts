/**
 * Level 7 Curriculum (1800-2000 ELO)
 *
 * At this level, players face:
 * - Deep calculation (6+ moves)
 * - Complex sacrifices requiring precise evaluation
 * - Subtle quiet moves and prophylaxis
 * - Advanced endgame technique
 * - Multiple candidate moves requiring comparison
 */

import { LessonCriteria, Module, Level } from './level1-curriculum';

export const level7: Level = {
  id: 'level-7',
  name: 'Level 7: Advanced Mastery',
  ratingRange: '1800-2000',
  modules: [
    // ========================================
    // MODULE 1: DEEP SACRIFICES
    // ========================================
    {
      id: 'mod-1',
      name: 'Deep Sacrifices',
      description: 'Sacrifices requiring long calculation',
      lessons: [
        {
          id: '7.1.1',
          name: 'Sacrifice: Exchange Sac',
          description: 'Give up the exchange for compensation',
          requiredTags: ['sacrifice'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1800,
          ratingMax: 1900,
          minPlays: 1000,
        },
        {
          id: '7.1.2',
          name: 'Sacrifice: Queen Sac',
          description: 'Devastating queen sacrifices',
          requiredTags: ['sacrifice'],
          excludeTags: ['mateIn1'],
          ratingMin: 1850,
          ratingMax: 1950,
          minPlays: 1000,
        },
        {
          id: '7.1.3',
          name: 'Sacrifice: Positional',
          description: 'Sacrifice for long-term advantage',
          requiredTags: ['sacrifice'],
          excludeTags: ['mateIn1', 'mateIn2'],
          ratingMin: 1900,
          ratingMax: 2000,
          minPlays: 1000,
        },
        {
          id: '7.1.R',
          name: 'Module 1 Review: Sacrifices',
          description: 'Find the winning sacrifice',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['sacrifice'],
          ratingMin: 1800,
          ratingMax: 2000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 2: ADVANCED MATE PATTERNS
    // ========================================
    {
      id: 'mod-2',
      name: 'Advanced Checkmates',
      description: 'Complex mating patterns',
      lessons: [
        {
          id: '7.2.1',
          name: 'Mate in 4: Complex',
          description: 'Difficult four-move checkmates',
          requiredTags: ['mateIn4'],
          ratingMin: 1800,
          ratingMax: 1900,
          minPlays: 1000,
        },
        {
          id: '7.2.2',
          name: 'Mate in 5: Advanced',
          description: 'Five-move mating sequences',
          requiredTags: ['mateIn5'],
          ratingMin: 1850,
          ratingMax: 1950,
          minPlays: 500,
        },
        {
          id: '7.2.3',
          name: 'Long Mates: Expert',
          description: 'Extended mating sequences',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn4', 'mateIn5'],
          ratingMin: 1900,
          ratingMax: 2000,
          minPlays: 500,
        },
        {
          id: '7.2.R',
          name: 'Module 2 Review: Checkmates',
          description: 'Find the checkmate',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['mateIn4', 'mateIn5', 'mateIn3'],
          ratingMin: 1800,
          ratingMax: 2000,
          minPlays: 500,
        },
      ],
    },

    // ========================================
    // MODULE 3: QUIET MOVE MASTERY
    // ========================================
    {
      id: 'mod-3',
      name: 'Quiet Move Mastery',
      description: 'The hardest moves to find',
      lessons: [
        {
          id: '7.3.1',
          name: 'Quiet Move: Zugzwang',
          description: 'Force the opponent into zugzwang',
          requiredTags: ['quietMove'],
          ratingMin: 1800,
          ratingMax: 1900,
          minPlays: 1000,
        },
        {
          id: '7.3.2',
          name: 'Quiet Move: Improvement',
          description: 'Subtle piece improvement',
          requiredTags: ['quietMove'],
          ratingMin: 1850,
          ratingMax: 1950,
          minPlays: 1000,
        },
        {
          id: '7.3.3',
          name: 'Quiet Move: Mastery',
          description: 'Master-level quiet moves',
          requiredTags: ['quietMove'],
          ratingMin: 1900,
          ratingMax: 2000,
          minPlays: 1000,
        },
        {
          id: '7.3.R',
          name: 'Module 3 Review: Quiet Moves',
          description: 'Find the quiet winner',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['quietMove'],
          ratingMin: 1800,
          ratingMax: 2000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 4: DEFENSIVE RESOURCES
    // ========================================
    {
      id: 'mod-4',
      name: 'Defensive Resources',
      description: 'Find the only move that saves',
      lessons: [
        {
          id: '7.4.1',
          name: 'Defense: Counterattack',
          description: 'Defend by attacking',
          requiredTags: ['defensiveMove'],
          ratingMin: 1800,
          ratingMax: 1900,
          minPlays: 1000,
        },
        {
          id: '7.4.2',
          name: 'Defense: Resource',
          description: 'Hidden defensive resources',
          requiredTags: ['defensiveMove'],
          ratingMin: 1850,
          ratingMax: 1950,
          minPlays: 1000,
        },
        {
          id: '7.4.3',
          name: 'Defense: Mastery',
          description: 'Master defensive technique',
          requiredTags: ['defensiveMove'],
          ratingMin: 1900,
          ratingMax: 2000,
          minPlays: 1000,
        },
        {
          id: '7.4.R',
          name: 'Module 4 Review: Defense',
          description: 'Find the saving move',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['defensiveMove'],
          ratingMin: 1800,
          ratingMax: 2000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 5: REVIEW - Calculation
    // ========================================
    {
      id: 'mod-5',
      name: 'Review: Deep Calculation',
      description: 'Mixed calculation challenges',
      lessons: [
        {
          id: '7.5.1',
          name: 'Calculation: Set 1',
          description: 'Calculate deeply',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['sacrifice', 'quietMove', 'mateIn4'],
          ratingMin: 1800,
          ratingMax: 1900,
          minPlays: 1000,
        },
        {
          id: '7.5.2',
          name: 'Calculation: Set 2',
          description: 'Harder calculation puzzles',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['sacrifice', 'quietMove', 'defensiveMove'],
          ratingMin: 1900,
          ratingMax: 2000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 6: INTERMEZZO MASTERY
    // ========================================
    {
      id: 'mod-6',
      name: 'Intermezzo Mastery',
      description: 'The in-between move perfected',
      lessons: [
        {
          id: '7.6.1',
          name: 'Intermezzo: Double',
          description: 'Multiple in-between moves',
          requiredTags: ['intermezzo'],
          ratingMin: 1800,
          ratingMax: 1900,
          minPlays: 1000,
        },
        {
          id: '7.6.2',
          name: 'Intermezzo: Defensive',
          description: 'Defensive zwischenzug',
          requiredTags: ['intermezzo'],
          ratingMin: 1850,
          ratingMax: 1950,
          minPlays: 1000,
        },
        {
          id: '7.6.3',
          name: 'Intermezzo: Mastery',
          description: 'Perfect the zwischenzug',
          requiredTags: ['intermezzo'],
          ratingMin: 1900,
          ratingMax: 2000,
          minPlays: 1000,
        },
        {
          id: '7.6.R',
          name: 'Module 6 Review: Intermezzo',
          description: 'Find the in-between move',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['intermezzo'],
          ratingMin: 1800,
          ratingMax: 2000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 7: ATTACK MASTERY
    // ========================================
    {
      id: 'mod-7',
      name: 'Attack Mastery',
      description: 'Devastating attacks on the king',
      lessons: [
        {
          id: '7.7.1',
          name: 'Attack: Exposed King',
          description: 'Punish the exposed king',
          requiredTags: ['exposedKing'],
          ratingMin: 1800,
          ratingMax: 1900,
          minPlays: 1000,
        },
        {
          id: '7.7.2',
          name: 'Attack: Kingside Storm',
          description: 'Crushing kingside attacks',
          requiredTags: ['kingsideAttack'],
          ratingMin: 1850,
          ratingMax: 1950,
          minPlays: 1000,
        },
        {
          id: '7.7.3',
          name: 'Attack: Mastery',
          description: 'Master attacking play',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['exposedKing', 'kingsideAttack', 'sacrifice'],
          ratingMin: 1900,
          ratingMax: 2000,
          minPlays: 1000,
        },
        {
          id: '7.7.R',
          name: 'Module 7 Review: Attack',
          description: 'Find the winning attack',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['exposedKing', 'kingsideAttack'],
          ratingMin: 1800,
          ratingMax: 2000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 8: ENDGAME MASTERY
    // ========================================
    {
      id: 'mod-8',
      name: 'Endgame Mastery',
      description: 'Expert endgame technique',
      lessons: [
        {
          id: '7.8.1',
          name: 'Rook Endgame: Mastery',
          description: 'Master rook endings',
          requiredTags: ['rookEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1800,
          ratingMax: 1950,
          minPlays: 1000,
        },
        {
          id: '7.8.2',
          name: 'Pawn Endgame: Mastery',
          description: 'Master pawn endings',
          requiredTags: ['pawnEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1800,
          ratingMax: 2000,
          minPlays: 1000,
        },
        {
          id: '7.8.3',
          name: 'Queen Endgame: Mastery',
          description: 'Master queen endings',
          requiredTags: ['queenEndgame'],
          excludeTags: ['mateIn1'],
          ratingMin: 1800,
          ratingMax: 2000,
          minPlays: 1000,
        },
        {
          id: '7.8.R',
          name: 'Module 8 Review: Endgames',
          description: 'Find the winning technique',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['rookEndgame', 'pawnEndgame', 'queenEndgame'],
          ratingMin: 1800,
          ratingMax: 2000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 9: LINE TACTICS MASTERY
    // ========================================
    {
      id: 'mod-9',
      name: 'Line Tactics Mastery',
      description: 'Pins, skewers, and x-rays perfected',
      lessons: [
        {
          id: '7.9.1',
          name: 'Pin: Mastery',
          description: 'Expert pin combinations',
          requiredTags: ['pin'],
          excludeTags: ['mateIn1'],
          ratingMin: 1800,
          ratingMax: 1900,
          minPlays: 1000,
        },
        {
          id: '7.9.2',
          name: 'Skewer: Mastery',
          description: 'Expert skewer combinations',
          requiredTags: ['skewer'],
          excludeTags: ['mateIn1'],
          ratingMin: 1850,
          ratingMax: 1950,
          minPlays: 1000,
        },
        {
          id: '7.9.3',
          name: 'X-Ray: Mastery',
          description: 'Expert x-ray attacks',
          requiredTags: ['xRayAttack'],
          ratingMin: 1900,
          ratingMax: 2000,
          minPlays: 500,
        },
        {
          id: '7.9.R',
          name: 'Module 9 Review: Line Tactics',
          description: 'Find the line tactic',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['pin', 'skewer', 'xRayAttack'],
          ratingMin: 1800,
          ratingMax: 2000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 10: DEFLECTION & ATTRACTION
    // ========================================
    {
      id: 'mod-10',
      name: 'Deflection & Attraction',
      description: 'Force pieces away or into traps',
      lessons: [
        {
          id: '7.10.1',
          name: 'Deflection: Mastery',
          description: 'Expert deflection tactics',
          requiredTags: ['deflection'],
          ratingMin: 1800,
          ratingMax: 1900,
          minPlays: 1000,
        },
        {
          id: '7.10.2',
          name: 'Attraction: Mastery',
          description: 'Expert attraction tactics',
          requiredTags: ['attraction'],
          ratingMin: 1850,
          ratingMax: 1950,
          minPlays: 1000,
        },
        {
          id: '7.10.3',
          name: 'Combined: Mastery',
          description: 'Deflection and attraction combined',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['deflection', 'attraction'],
          ratingMin: 1900,
          ratingMax: 2000,
          minPlays: 1000,
        },
        {
          id: '7.10.R',
          name: 'Module 10 Review',
          description: 'Find the forcing move',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['deflection', 'attraction'],
          ratingMin: 1800,
          ratingMax: 2000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 11: DISCOVERED ATTACKS
    // ========================================
    {
      id: 'mod-11',
      name: 'Discovered Attack Mastery',
      description: 'Devastating discovered attacks',
      lessons: [
        {
          id: '7.11.1',
          name: 'Discovered: Check',
          description: 'Discovered check combinations',
          requiredTags: ['discoveredAttack'],
          ratingMin: 1800,
          ratingMax: 1900,
          minPlays: 1000,
        },
        {
          id: '7.11.2',
          name: 'Discovered: Double Attack',
          description: 'Double discovered attacks',
          requiredTags: ['discoveredAttack'],
          ratingMin: 1850,
          ratingMax: 1950,
          minPlays: 1000,
        },
        {
          id: '7.11.3',
          name: 'Discovered: Mastery',
          description: 'Master discovered attacks',
          requiredTags: ['discoveredAttack'],
          ratingMin: 1900,
          ratingMax: 2000,
          minPlays: 1000,
        },
        {
          id: '7.11.R',
          name: 'Module 11 Review',
          description: 'Find the discovered attack',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['discoveredAttack'],
          ratingMin: 1800,
          ratingMax: 2000,
          minPlays: 1000,
        },
      ],
    },

    // ========================================
    // MODULE 12: FINAL REVIEW
    // ========================================
    {
      id: 'mod-12',
      name: 'Level 7 Final',
      description: 'Prove your advanced mastery',
      lessons: [
        {
          id: '7.12.1',
          name: 'Final Review: Set 1',
          description: 'Mixed puzzles - medium',
          requiredTags: [],
          isMixedPractice: true,
          mixedThemes: ['sacrifice', 'fork', 'pin'],
          ratingMin: 1800,
          ratingMax: 1900,
          minPlays: 500,
        },
        {
          id: '7.12.2',
          name: 'Final Review: Set 2',
          description: 'Mixed puzzles - hard',
          requiredTags: [],
          isMixedPractice: true,
          ratingMin: 1900,
          ratingMax: 2000,
          minPlays: 1000,
        },
        {
          id: '7.12.3',
          name: 'Master Challenge',
          description: 'The ultimate Level 7 test',
          requiredTags: [],
          isMixedPractice: true,
          ratingMin: 1950,
          ratingMax: 2000,
          minPlays: 500,
        },
      ],
    },
  ],
};

export function getAllLessonsLevel7(): LessonCriteria[] {
  return level7.modules.flatMap(m => m.lessons);
}

export function getLessonByIdLevel7(id: string): LessonCriteria | undefined {
  return getAllLessonsLevel7().find(l => l.id === id);
}

export function getModuleByIdLevel7(id: string): Module | undefined {
  return level7.modules.find(m => m.id === id);
}

export function getLessonCountLevel7(): number {
  return getAllLessonsLevel7().length;
}
