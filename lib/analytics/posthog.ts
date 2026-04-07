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
export const TutorialEvents = {
  tutorialStarted: (tutorial: TutorialKey) =>
    trackEvent('tutorial_started', { tutorial }),
  tutorialStepCompleted: (tutorial: TutorialKey, stepId: string, stepNumber: number) =>
    trackEvent('tutorial_step_completed', { tutorial, stepId, stepNumber }),
  tutorialCompleted: (tutorial: TutorialKey) =>
    trackEvent('tutorial_completed', { tutorial }),
  tutorialSkipped: (tutorial: TutorialKey, stepId: string, stepNumber: number) =>
    trackEvent('tutorial_skipped', { tutorial, stepId, stepNumber }),
};

// Onboarding/Welcome funnel
export const OnboardingEvents = {
  started: () => trackEvent('onboarding_started'),
  routeSelected: (route: 'play' | 'learn') => trackEvent('onboarding_route_selected', { route }),
  completed: (data: { level: string }) =>
    trackEvent('onboarding_completed', data),
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
