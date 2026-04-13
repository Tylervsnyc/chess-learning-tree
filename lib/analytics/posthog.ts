import posthog from 'posthog-js';

// Initialize PostHog (call once in the provider)
export function initPostHog() {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'always',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    persistence: 'localStorage+cookie',
    session_recording: {
      maskAllInputs: false,
      maskTextSelector: '[data-mask]',
    },
  });
}

// Identify user after login/signup
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  try {
    posthog.identify(userId, traits);
  } catch (e) {
    // Silently fail
  }
}

// Reset user on logout
export function resetUser() {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  try {
    posthog.reset();
  } catch (e) {
    // Silently fail
  }
}

// Track custom events
export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  try {
    posthog.capture(event, properties);
  } catch (e) {
    // Silently fail if PostHog isn't ready
  }
}

// ============================================
// FUNNEL EVENTS - Track these for drop-off analysis
// ============================================

// Auth funnel
export const AuthEvents = {
  signupPageViewed: () => trackEvent('signup_page_viewed'),
  signupStarted: () => trackEvent('signup_started'),
  signupCompleted: (method: string) => trackEvent('signup_completed', { method }),
  signupFailed: (error: string) => trackEvent('signup_failed', { error }),
  loginPageViewed: () => trackEvent('login_page_viewed'),
  loginCompleted: () => trackEvent('login_completed'),
  loginFailed: (error: string) => trackEvent('login_failed', { error }),
  logout: () => trackEvent('logout'),
};

// Learning funnel
// Optional `opts` adds source/openingSlug for opening lessons (omit for main path)
export const LearningEvents = {
  lessonStarted: (lessonId: string, lessonName: string, opts?: { source?: string; openingSlug?: string }) =>
    trackEvent('lesson_started', { lessonId, lessonName, ...opts }),
  puzzleAttempted: (lessonId: string, puzzleNum: number, correct: boolean, rating: number, opts?: { source?: string; openingSlug?: string }) =>
    trackEvent('puzzle_attempted', { lessonId, puzzleNum, correct, rating, ...opts }),
  lessonCompleted: (lessonId: string, accuracy: number, timeSpent: number, opts?: { source?: string; openingSlug?: string }) =>
    trackEvent('lesson_completed', { lessonId, accuracy, timeSpent, ...opts }),
  lessonAbandoned: (lessonId: string, puzzleNum: number, totalPuzzles: number, opts?: { source?: string; openingSlug?: string }) =>
    trackEvent('lesson_abandoned', { lessonId, puzzleNum, totalPuzzles, ...opts }),
};

// Engagement events
export const EngagementEvents = {
  treeLevelViewed: (level: number) => trackEvent('tree_level_viewed', { level }),
  levelTestCardViewed: (level: number) => trackEvent('level_test_card_viewed', { level }),
  dailyChallengeViewed: () => trackEvent('daily_challenge_viewed'),
  dailyChallengeStarted: () => trackEvent('daily_challenge_started'),
  dailyChallengeCompleted: (correct: boolean) =>
    trackEvent('daily_challenge_completed', { correct }),
  streakUpdated: (streak: number) => trackEvent('streak_updated', { streak }),
};

// Subscription funnel
export const SubscriptionEvents = {
  paywallViewed: (trigger: string) => trackEvent('paywall_viewed', { trigger }),
  paywallDismissed: (trigger: string) => trackEvent('paywall_dismissed', { trigger }),
  pricingViewed: () => trackEvent('pricing_viewed'),
  checkoutStarted: (plan: string, trigger?: string) => trackEvent('checkout_started', { plan, trigger }),
  checkoutCompleted: (plan: string, trigger?: string) => trackEvent('checkout_completed', { plan, trigger }),
  checkoutAbandoned: (plan: string) => trackEvent('checkout_abandoned', { plan }),
};

// Tutorial funnel
type TutorialKey = 'basics' | 'checkmate' | 'rook-checkmate';
type TutorialOpts = { source?: string };
export const TutorialEvents = {
  tutorialStarted: (tutorial: TutorialKey, opts?: TutorialOpts) =>
    trackEvent('tutorial_started', { tutorial, ...opts }),
  tutorialStepCompleted: (tutorial: TutorialKey, stepId: string, stepNumber: number, opts?: TutorialOpts) =>
    trackEvent('tutorial_step_completed', { tutorial, stepId, stepNumber, ...opts }),
  tutorialCompleted: (tutorial: TutorialKey, opts?: TutorialOpts) =>
    trackEvent('tutorial_completed', { tutorial, ...opts }),
  tutorialSkipped: (tutorial: TutorialKey, stepId: string, stepNumber: number, opts?: TutorialOpts) =>
    trackEvent('tutorial_skipped', { tutorial, stepId, stepNumber, ...opts }),
};

// Onboarding/Welcome funnel
export type OnboardingSource = 'play' | 'basics' | 'checkmate' | 'lesson_complete' | 'test';
export const OnboardingEvents = {
  started: () => trackEvent('onboarding_started'),
  routeSelected: (route: 'play' | 'learn') => trackEvent('onboarding_route_selected', { route }),
  completed: (data: { level: string }) =>
    trackEvent('onboarding_completed', data),
  nameSubmitted: (source: OnboardingSource) =>
    trackEvent('onboarding_name_submitted', { source }),
  signupPromptShown: (source: OnboardingSource) =>
    trackEvent('onboarding_signup_prompt_shown', { source }),
  signupPromptClicked: (source: OnboardingSource, action: 'signup' | 'login') =>
    trackEvent('onboarding_signup_prompt_clicked', { source, action }),
  signupPromptDismissed: (source: OnboardingSource, method: 'x' | 'backdrop' | 'maybe_later') =>
    trackEvent('onboarding_signup_prompt_dismissed', { source, method }),
};

// Play Rookie funnel
export const PlayEvents = {
  gameStarted: (skillLevel: number, color: 'white' | 'black') =>
    trackEvent('game_started', { skillLevel, color }),
  gameEnded: (result: string, moveCount: number, color: 'white' | 'black', skillLevel: number, openingName?: string | null) =>
    trackEvent('game_ended', { result, moveCount, color, skillLevel, openingName }),
  landingViewed: (source: 'direct' | 'post_game' | 'level_up', level: number) =>
    trackEvent('play_landing_viewed', { source, level }),
  playAgainClicked: (lastResult: 'win' | 'loss' | 'none', levelAtClick: number) =>
    trackEvent('play_again_clicked', { lastResult, levelAtClick }),
  levelUpTriggered: (oldLevel: number, newLevel: number) =>
    trackEvent('play_level_up', { oldLevel, newLevel }),
  quipShown: (
    category: 'win' | 'loss' | 'level_up' | 'landing',
    text: string,
  ) => trackEvent('play_quip_shown', { category, quipKey: text.slice(0, 60) }),
};

// Level test funnel
export const LevelTestEvents = {
  started: (transition: string) => trackEvent('level_test_started', { transition }),
  completed: (transition: string, passed: boolean, score: number, total: number) =>
    trackEvent('level_test_completed', { transition, passed, score, total }),
};

// Openings funnel
export const OpeningsEvents = {
  libraryViewed: () => trackEvent('openings_library_viewed'),
  treeViewed: (slug: string) => trackEvent('opening_tree_viewed', { slug }),
};

// Share/Viral funnel
export const ShareEvents = {
  shareClicked: (source: 'lesson' | 'daily_challenge' | 'opening', type?: 'text' | 'link' | 'image' | 'card' | 'rook') =>
    trackEvent('share_clicked', { source, type }),
  shareGenerated: (source: 'lesson' | 'daily_challenge' | 'opening') =>
    trackEvent('share_generated', { source }),
  shareCompleted: (source: 'lesson' | 'daily_challenge' | 'opening', method: 'native' | 'native_image' | 'download' | 'clipboard' | 'clipboard_link') =>
    trackEvent('share_completed', { source, method }),
  shareFailed: (source: 'lesson' | 'daily_challenge' | 'opening', error: string) =>
    trackEvent('share_failed', { source, error }),
};

export default posthog;
