/**
 * Level Unlock Test Variants
 *
 * Each level transition has 5 test variants to prevent users from
 * memorizing puzzles when retaking tests.
 *
 * Tests use puzzles from the TARGET level's rating range to prove readiness.
 */

export interface LevelTestVariant {
  id: string;
  themes: string[];
}

export interface LevelTestConfig {
  fromLevel: number;
  toLevel: number;
  ratingMin: number;
  ratingMax: number;
  levelKey: string; // URL param for target level (e.g., 'casual' for level 2)
  levelName: string;
  variants: LevelTestVariant[];
}

// Test configuration
export const LEVEL_TEST_CONFIG = {
  puzzleCount: 10,
  maxWrongAnswers: 3,
  passingScore: 7,
};

// Level test definitions
export const LEVEL_UNLOCK_TESTS: Record<string, LevelTestConfig> = {
  '1-2': {
    fromLevel: 1,
    toLevel: 2,
    ratingMin: 800,
    ratingMax: 1000,
    levelKey: 'casual',
    levelName: 'Level 2: Tactical Growth',
    variants: [
      { id: '1-2-v1', themes: ['fork', 'pin', 'mateIn1', 'hangingPiece'] },
      { id: '1-2-v2', themes: ['skewer', 'discoveredAttack', 'mateIn1', 'fork'] },
      { id: '1-2-v3', themes: ['pin', 'trappedPiece', 'hangingPiece', 'backRankMate'] },
      { id: '1-2-v4', themes: ['fork', 'discoveredAttack', 'mateIn1', 'skewer'] },
      { id: '1-2-v5', themes: ['mateIn1', 'pin', 'fork', 'trappedPiece'] },
    ],
  },
  '2-3': {
    fromLevel: 2,
    toLevel: 3,
    ratingMin: 1000,
    ratingMax: 1200,
    levelKey: 'club',
    levelName: 'Level 3: Advanced Beginner',
    variants: [
      { id: '2-3-v1', themes: ['fork', 'pin', 'mateIn2', 'discoveredAttack'] },
      { id: '2-3-v2', themes: ['skewer', 'deflection', 'mateIn2', 'fork'] },
      { id: '2-3-v3', themes: ['pin', 'attraction', 'discoveredAttack', 'backRankMate'] },
      { id: '2-3-v4', themes: ['fork', 'clearance', 'mateIn2', 'skewer'] },
      { id: '2-3-v5', themes: ['mateIn2', 'deflection', 'fork', 'pin'] },
    ],
  },
  '3-4': {
    fromLevel: 3,
    toLevel: 4,
    ratingMin: 1200,
    ratingMax: 1400,
    levelKey: 'competitor',
    levelName: 'Level 4: Club Player',
    variants: [
      { id: '3-4-v1', themes: ['fork', 'sacrifice', 'mateIn2', 'discoveredAttack'] },
      { id: '3-4-v2', themes: ['deflection', 'attraction', 'mateIn3', 'pin'] },
      { id: '3-4-v3', themes: ['clearance', 'sacrifice', 'discoveredAttack', 'skewer'] },
      { id: '3-4-v4', themes: ['fork', 'deflection', 'mateIn2', 'attraction'] },
      { id: '3-4-v5', themes: ['mateIn3', 'sacrifice', 'pin', 'clearance'] },
    ],
  },
  '4-5': {
    fromLevel: 4,
    toLevel: 5,
    ratingMin: 1400,
    ratingMax: 1600,
    levelKey: 'expert',
    levelName: 'Level 5: Tournament Player',
    variants: [
      { id: '4-5-v1', themes: ['sacrifice', 'mateIn3', 'deflection', 'discoveredAttack'] },
      { id: '4-5-v2', themes: ['attraction', 'clearance', 'mateIn3', 'fork'] },
      { id: '4-5-v3', themes: ['interference', 'sacrifice', 'pin', 'quietMove'] },
      { id: '4-5-v4', themes: ['deflection', 'mateIn3', 'discoveredAttack', 'attraction'] },
      { id: '4-5-v5', themes: ['sacrifice', 'clearance', 'fork', 'interference'] },
    ],
  },
  '5-6': {
    fromLevel: 5,
    toLevel: 6,
    ratingMin: 1600,
    ratingMax: 1800,
    levelKey: 'master',
    levelName: 'Level 6: Expert',
    variants: [
      { id: '5-6-v1', themes: ['sacrifice', 'mateIn4', 'deflection', 'quietMove'] },
      { id: '5-6-v2', themes: ['interference', 'attraction', 'mateIn3', 'clearance'] },
      { id: '5-6-v3', themes: ['sacrifice', 'xRayAttack', 'deflection', 'discoveredAttack'] },
      { id: '5-6-v4', themes: ['mateIn4', 'interference', 'attraction', 'sacrifice'] },
      { id: '5-6-v5', themes: ['quietMove', 'clearance', 'xRayAttack', 'mateIn3'] },
    ],
  },
  '6-7': {
    fromLevel: 6,
    toLevel: 7,
    ratingMin: 1800,
    ratingMax: 2000,
    levelKey: 'grandmaster',
    levelName: 'Level 7: Master',
    variants: [
      { id: '6-7-v1', themes: ['sacrifice', 'mateIn4', 'zwischenzug', 'quietMove'] },
      { id: '6-7-v2', themes: ['interference', 'xRayAttack', 'mateIn4', 'deflection'] },
      { id: '6-7-v3', themes: ['sacrifice', 'zugzwang', 'clearance', 'attraction'] },
      { id: '6-7-v4', themes: ['mateIn5', 'zwischenzug', 'sacrifice', 'interference'] },
      { id: '6-7-v5', themes: ['quietMove', 'zugzwang', 'xRayAttack', 'mateIn4'] },
    ],
  },
  '7-8': {
    fromLevel: 7,
    toLevel: 8,
    ratingMin: 2000,
    ratingMax: 2200,
    levelKey: 'legend',
    levelName: 'Level 8: Legend',
    variants: [
      { id: '7-8-v1', themes: ['sacrifice', 'mateIn5', 'zugzwang', 'quietMove'] },
      { id: '7-8-v2', themes: ['zwischenzug', 'xRayAttack', 'mateIn5', 'interference'] },
      { id: '7-8-v3', themes: ['sacrifice', 'fortress', 'deflection', 'attraction'] },
      { id: '7-8-v4', themes: ['mateIn5', 'zugzwang', 'sacrifice', 'zwischenzug'] },
      { id: '7-8-v5', themes: ['quietMove', 'fortress', 'xRayAttack', 'mateIn5'] },
    ],
  },
};

/**
 * Get test config for a level transition
 */
export function getLevelTestConfig(transition: string): LevelTestConfig | null {
  return LEVEL_UNLOCK_TESTS[transition] || null;
}

/**
 * Get all available level transitions
 */
export function getAvailableTransitions(): string[] {
  return Object.keys(LEVEL_UNLOCK_TESTS);
}
