/**
 * User Permission Types for Chess Path V2
 */

export type UserTier = 'anonymous' | 'free' | 'premium' | 'admin';

/**
 * Why a lesson is (or isn't) open to this user, in priority order:
 *   'ok'          — go ahead
 *   'signup'      — anonymous user out of free lessons (CreateProfileModal)
 *   'daily_limit' — free user out of today's lessons
 *   'pro'         — the lesson's level is above PRO_FREE_LIMITS.FREE_LESSON_LEVELS
 *                   (only while FEATURE_FLAGS.PRO is on → ProPaywall)
 */
export type LessonAccess = 'ok' | 'signup' | 'daily_limit' | 'pro';

export interface UserPermissions {
  tier: UserTier;

  // Lesson limits
  dailyLessonLimit: number | null; // null = unlimited
  lessonsCompletedToday: number;
  lessonsRemainingToday: number | null; // null = unlimited
  /** Highest level free users may open; null = every level (Pro/admin, or PRO flag off). */
  maxFreeLevel: number | null;

  // Access flags
  canAccessLesson: boolean;
  canSkipLevels: boolean;
  canAccessAllPuzzles: boolean;

  // Upgrade prompts
  shouldPromptSignup: boolean;
  shouldPromptPremium: boolean;

  // Reset info
  dailyResetTime: Date | null;
}

export interface LessonLimitConfig {
  anonymous: {
    totalLessons: number; // Total before signup required
  };
  free: {
    dailyLimit: number;
  };
  premium: {
    dailyLimit: null; // Unlimited
  };
  admin: {
    dailyLimit: null; // Unlimited
  };
}

export const LESSON_LIMITS: LessonLimitConfig = {
  anonymous: {
    totalLessons: 4,
  },
  free: {
    dailyLimit: 4,
  },
  premium: {
    dailyLimit: null,
  },
  admin: {
    dailyLimit: null,
  },
};

// Level skip quiz config
export interface LevelSkipQuizConfig {
  questionsCount: number;
  maxWrongAnswers: number;
  passingScore: number;
}

export const LEVEL_SKIP_QUIZ: LevelSkipQuizConfig = {
  questionsCount: 10,
  maxWrongAnswers: 3,
  passingScore: 7, // 10 - 3 = 7
};
