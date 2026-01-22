import posthog from 'posthog-js';

// Initialize PostHog (call once in the provider)
export function initPostHog() {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true, // Automatically capture clicks, form submissions, etc.
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

// Onboarding funnel
export const OnboardingEvents = {
  onboardingStarted: () => trackEvent('onboarding_started'),
  pathChosen: (path: 'beginner' | 'diagnostic' | 'connect') =>
    trackEvent('onboarding_path_chosen', { path }),
  diagnosticStarted: () => trackEvent('diagnostic_started'),
  diagnosticPuzzleCompleted: (puzzleNum: number, correct: boolean, rating: number) =>
    trackEvent('diagnostic_puzzle_completed', { puzzleNum, correct, rating }),
  diagnosticCompleted: (placedRating: number) =>
    trackEvent('diagnostic_completed', { placedRating }),
  diagnosticAbandoned: (puzzleNum: number) =>
    trackEvent('diagnostic_abandoned', { puzzleNum }),
  onboardingCompleted: (placedRating: number) =>
    trackEvent('onboarding_completed', { placedRating }),
};

// Learning funnel
export const LearningEvents = {
  treeLevelViewed: (level: number) => trackEvent('tree_level_viewed', { level }),
  lessonStarted: (lessonId: string, lessonName: string) =>
    trackEvent('lesson_started', { lessonId, lessonName }),
  puzzleAttempted: (lessonId: string, puzzleNum: number, correct: boolean, rating: number) =>
    trackEvent('puzzle_attempted', { lessonId, puzzleNum, correct, rating }),
  lessonCompleted: (lessonId: string, accuracy: number, timeSpent: number) =>
    trackEvent('lesson_completed', { lessonId, accuracy, timeSpent }),
  lessonAbandoned: (lessonId: string, puzzleNum: number, totalPuzzles: number) =>
    trackEvent('lesson_abandoned', { lessonId, puzzleNum, totalPuzzles }),
};

// Engagement events
export const EngagementEvents = {
  dailyChallengeViewed: () => trackEvent('daily_challenge_viewed'),
  dailyChallengeStarted: () => trackEvent('daily_challenge_started'),
  dailyChallengeCompleted: (correct: boolean) =>
    trackEvent('daily_challenge_completed', { correct }),
  workoutStarted: () => trackEvent('workout_started'),
  workoutPuzzleCompleted: (correct: boolean, count: number) =>
    trackEvent('workout_puzzle_completed', { correct, count }),
  profileViewed: () => trackEvent('profile_viewed'),
  streakUpdated: (streak: number) => trackEvent('streak_updated', { streak }),
};

// Subscription funnel
export const SubscriptionEvents = {
  paywallViewed: (trigger: string) => trackEvent('paywall_viewed', { trigger }),
  pricingViewed: () => trackEvent('pricing_viewed'),
  checkoutStarted: (plan: string) => trackEvent('checkout_started', { plan }),
  checkoutCompleted: (plan: string) => trackEvent('checkout_completed', { plan }),
  checkoutAbandoned: (plan: string) => trackEvent('checkout_abandoned', { plan }),
  promoCodeEntered: (code: string) => trackEvent('promo_code_entered', { code }),
  promoCodeRedeemed: (code: string, days: number) =>
    trackEvent('promo_code_redeemed', { code, days }),
  promoCodeFailed: (code: string, error: string) =>
    trackEvent('promo_code_failed', { code, error }),
};

export default posthog;
