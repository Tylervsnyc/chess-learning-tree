// Lazy accessor — reuses the singleton after PostHogProvider initializes it.
// Avoids pulling posthog-js into every page's initial bundle.
let _posthog: typeof import('posthog-js').default | null = null;

async function getPostHog() {
  if (typeof window === 'undefined') return null;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return null;
  try {
    const ph = _posthog ?? (await import('posthog-js')).default;
    _posthog = ph;
    // PostHogProvider runs posthog.init() on browser idle. An event fired
    // immediately on a post-OAuth landing (CHE-366) can beat init and be
    // dropped — so wait briefly for it. Once loaded this is a no-op fast path.
    const loaded = () => (ph as unknown as { __loaded?: boolean }).__loaded === true;
    for (let i = 0; i < 25 && !loaded(); i++) {
      await new Promise((r) => setTimeout(r, 200));
    }
    return ph;
  } catch {
    return null;
  }
}

// Identify user after login/signup
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  getPostHog().then(ph => { try { ph?.identify(userId, traits); } catch {} });
}

// Reset user on logout
export function resetUser() {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  getPostHog().then(ph => { try { ph?.reset(); } catch {} });
}

// Track custom events
export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  getPostHog().then(ph => { try { ph?.capture(event, properties); } catch {} });
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

// Chess Path ELO (CHE-370) — the legible-progress mechanic + logged-out signup
// capture. `mode`: 'first_reveal' (new logged-out user's ceremony) |
// 'session' (returning logged-out within-session climb) | 'daily' (logged-in
// day-by-day line). Use to gauge whether the ELO surface lifts signup/return.
export const EloEvents = {
  revealed: (mode: 'first_reveal' | 'session' | 'daily', props?: { rating?: number; gained?: number }) =>
    trackEvent('elo_revealed', { mode, ...props }),
  signupClicked: (mode: 'first_reveal' | 'session', rating?: number) =>
    trackEvent('elo_signup_clicked', { mode, rating }),
  keepPlaying: (mode: 'first_reveal' | 'session') =>
    trackEvent('elo_keep_playing', { mode }),
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
  // CHE-359 checkmate landing: the two previously-blind steps. boardTouched =
  // first piece interaction (did the board pull ANY action?); checkmateWon = the
  // mate-in-1 solved. Together they expose "landed-but-untouched" vs
  // "touched-but-didn't-win" in the IG funnel (scripts/daily-report.ts).
  boardTouched: () => trackEvent('onboarding_board_touched'),
  checkmateWon: () => trackEvent('onboarding_checkmate_won'),
  routeSelected: (route: 'play' | 'learn') => trackEvent('onboarding_route_selected', { route }),
  completed: (data: { level: string }) =>
    trackEvent('onboarding_completed', data),
  nameSubmitted: (source: OnboardingSource) =>
    trackEvent('onboarding_name_submitted', { source }),
  // CHE-339: the optional `variant` ties each event to the win_signup_capture
  // experiment cell so the funnel can be read per-variant. CHE-390: `inWebview`
  // splits the funnel by in-app browser (IG/FB webview) vs real browser — the
  // webview is where OAuth dies, so conversion must be readable per-context.
  signupPromptShown: (source: OnboardingSource, variant?: string, inWebview?: boolean) =>
    trackEvent('onboarding_signup_prompt_shown', { source, variant, in_webview: inWebview }),
  signupPromptClicked: (source: OnboardingSource, action: 'signup' | 'login', variant?: string) =>
    trackEvent('onboarding_signup_prompt_clicked', { source, action, variant }),
  // One-tap OAuth kicked off straight from the win-moment prompt (no detour to
  // the form). The actual signup_completed fires after the OAuth callback.
  signupPromptOAuthStarted: (source: OnboardingSource, provider: 'google' | 'apple', variant?: string, inWebview?: boolean) =>
    trackEvent('onboarding_signup_prompt_oauth_started', { source, provider, variant, in_webview: inWebview }),
  signupPromptDismissed: (source: OnboardingSource, method: 'x' | 'backdrop' | 'maybe_later', variant?: string) =>
    trackEvent('onboarding_signup_prompt_dismissed', { source, method, variant }),
};

// IG sprint Day 7 (CHE-359) — post-signup activation nudge. Fires only for the
// IG cohort that returns authenticated to /play?ig_activate=1, to measure the D0
// second-action rate (did the new signup take a 2nd action vs one-and-done).
export const IgActivationEvents = {
  shown: () => trackEvent('ig_activation_shown'),
  action: () => trackEvent('ig_activation_action'),
  dismissed: () => trackEvent('ig_activation_dismissed'),
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

// Chess Boxing workout + do-anything streak (the daily retention loop)
export const WorkoutEvents = {
  started: (minutes: number, resumed: boolean) =>
    trackEvent('workout_started', { minutes, resumed }),
  completed: (data: {
    minutes: number | null;
    points: number;
    correct: number;
    wrong: number;
    perfect: boolean;
    isPersonalBest: boolean;
  }) => trackEvent('workout_completed', data),
  // Fires whenever the do-anything streak grows (any activity), observed live.
  streakExtended: (current: number, longest: number) =>
    trackEvent('streak_extended', { current, longest }),
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
export type ShareSource = 'lesson' | 'daily_challenge' | 'opening' | 'play';

export const ShareEvents = {
  shareClicked: (source: ShareSource, type?: 'text' | 'link' | 'image' | 'card' | 'rook') =>
    trackEvent('share_clicked', { source, type }),
  shareGenerated: (source: ShareSource) =>
    trackEvent('share_generated', { source }),
  shareCompleted: (source: ShareSource, method: 'native' | 'native_image' | 'download' | 'clipboard' | 'clipboard_link') =>
    trackEvent('share_completed', { source, method }),
  shareFailed: (source: ShareSource, error: string) =>
    trackEvent('share_failed', { source, error }),
};

// Default export for direct posthog access (lazy — may be null before init)
export { getPostHog };
