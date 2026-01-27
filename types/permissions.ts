/**
 * User Permission Types for Chess Path V2
 */

export type UserTier = 'anonymous' | 'free' | 'premium' | 'admin';

export interface UserPermissions {
  tier: UserTier;

  // Lesson limits
  dailyLessonLimit: number | null; // null = unlimited
  lessonsCompletedToday: number;
  lessonsRemainingToday: number | null; // null = unlimited

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
    totalLessons: 2,
  },
  free: {
    dailyLimit: 2,
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
