'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { ActionButton } from '@/components/ui/ActionButton';
import { playButtonClick } from '@/lib/sounds';
import { createClient } from '@/lib/supabase/client';
import { useExperiment } from '@/hooks/useExperiment';
import { OnboardingEvents, type OnboardingSource } from '@/lib/analytics/posthog';
import { appendFirstTouchParam } from '@/lib/growth/first-touch';

const ROOKIE_LINES = [
  "I saved your spot. Sign up so I don't forget.",
  "You're pretty good at this. Create an account and I'll remember everything.",
  "That was fun. Sign up and we can keep going.",
  "I have a terrible memory. Sign up so your progress sticks around.",
];

function pickLine() {
  return ROOKIE_LINES[Math.floor(Math.random() * ROOKIE_LINES.length)];
}

// Build a callback URL that returns the user to a destination after OAuth.
// `override` lets a caller send the user somewhere specific (e.g. continue a
// lesson) instead of back to the page they're on. Defaults to the current path.
function returnUrl(override?: string): string {
  const next = override ?? (typeof window !== 'undefined'
    ? window.location.pathname + window.location.search
    : '/');
  const url = new URL('/auth/callback', window.location.origin);
  url.searchParams.set('next', next);
  appendFirstTouchParam(url); // CHE-387: survives the IG -> system browser handoff
  return url.toString();
}

/**
 * Soft, dismissible signup prompt shown at a "win moment" (game won, lesson
 * done, streak earned). CHE-339.
 *
 * Two variants via the `win_signup_capture` experiment (default = treatment):
 *  - treatment: concrete value headline ("Save your {valueLabel}") + one-tap
 *    Google/Apple OAuth right here, no detour to the form. This is the leak fix.
 *  - control: the original generic copy that routes to /auth/signup.
 *
 * `valueLabel` makes the ask concrete — pass e.g. "3-day streak", "first win",
 * "progress". Omit for the generic Rookie line.
 */
export function SignupPrompt({
  onDismiss,
  source,
  valueLabel,
  nextOverride,
  promise,
}: {
  onDismiss: () => void;
  source: OnboardingSource;
  valueLabel?: string;
  /** Where to send the user after auth (OAuth callback / form redirect). Defaults
   *  to the current path. Use to carry momentum into a specific next screen. */
  nextOverride?: string;
  /** Day 8 (IG_D1_NUDGE): optional explicit "come back tomorrow" reassurance shown
   *  under the ask, giving a concrete reason to RETURN (and previewing the day-1
   *  email). Omit for the unchanged prompt. */
  promise?: string;
}) {
  const router = useRouter();
  const { variant, ready } = useExperiment('win_signup_capture', 'treatment');
  const isTreatment = variant !== 'control';
  const [line] = useState(pickLine);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);

  // Log the impression exactly once, after the variant has settled — never the
  // fallback first and the resolved value second (which would double-count and
  // split one impression across two variant cells).
  const shownLogged = useRef(false);
  useEffect(() => {
    if (!ready || shownLogged.current) return;
    shownLogged.current = true;
    OnboardingEvents.signupPromptShown(source, variant);
  }, [ready, source, variant]);

  const dismiss = (method: 'x' | 'backdrop' | 'maybe_later') => {
    OnboardingEvents.signupPromptDismissed(source, method, variant);
    playButtonClick();
    onDismiss();
  };

  const goToSignup = () => {
    OnboardingEvents.signupPromptClicked(source, 'signup', variant);
    playButtonClick();
    const next = nextOverride ?? (typeof window !== 'undefined'
      ? window.location.pathname + window.location.search
      : undefined);
    router.push(next ? `/auth/signup?redirect=${encodeURIComponent(next)}` : '/auth/signup');
  };

  const goToLogin = () => {
    OnboardingEvents.signupPromptClicked(source, 'login', variant);
    playButtonClick();
    const next = nextOverride ?? (typeof window !== 'undefined'
      ? window.location.pathname + window.location.search
      : undefined);
    router.push(next ? `/auth/login?redirect=${encodeURIComponent(next)}` : '/auth/login');
  };

  const oauth = async (provider: 'google' | 'apple') => {
    if (oauthLoading) return;
    OnboardingEvents.signupPromptOAuthStarted(source, provider, variant);
    playButtonClick();
    setOauthLoading(provider);
    try {
      const supabase = createClient();
      localStorage.setItem('auth_method', provider);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: returnUrl(nextOverride) },
      });
      // On success the browser redirects — don't reset loading.
      if (error) {
        setOauthLoading(null);
        goToSignup(); // fall back to the full form if OAuth init fails
      }
    } catch {
      setOauthLoading(null);
      goToSignup();
    }
  };

  // Concrete, value-first headline for the treatment; generic Rookie line otherwise.
  const headline = isTreatment && valueLabel
    ? `Save your ${valueLabel}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <style>{`
        @keyframes sp-backdrop { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sp-card {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ animation: 'sp-backdrop 0.3s ease-out' }}
        onClick={() => dismiss('backdrop')}
      />

      {/* Card */}
      <div
        className="relative bg-chess-page rounded-3xl max-w-sm w-full mx-4 shadow-2xl overflow-hidden"
        style={{ animation: 'sp-card 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        {/* Close button */}
        <button
          onClick={() => dismiss('x')}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4 text-chess-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center px-6 pt-8 pb-6">
          <BreathingRook size="lg" animate mood="happy" />

          {headline && (
            <h2
              className="mt-4 text-center font-black text-chess-text leading-tight"
              style={{ fontSize: 'clamp(20px, 6vw, 26px)' }}
            >
              {headline}
            </h2>
          )}

          <div className={`${headline ? 'mt-2' : 'mt-4'} mb-6 w-full`}>
            <div className="relative">
              <div
                className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 rounded-[2px]"
                style={{ boxShadow: '-1px -1px 2px rgba(0,0,0,0.03)' }}
              />
              <div className="relative bg-white rounded-2xl px-5 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)]">
                <p
                  className="text-chess-text text-center font-medium leading-relaxed"
                  style={{ fontSize: 'clamp(13px, 3.5vw, 15px)' }}
                >
                  {line}
                </p>
              </div>
            </div>
          </div>

          {promise && (
            <div className="-mt-3 mb-5 flex items-center justify-center gap-1.5 text-center">
              <span aria-hidden>📅</span>
              <span className="text-[13px] font-bold text-chess-green">
                {promise}
              </span>
            </div>
          )}

          {isTreatment ? (
            // One-tap capture — finish the account right here at the peak.
            <div className="w-full space-y-2.5">
              <button
                type="button"
                onClick={() => oauth('google')}
                disabled={!!oauthLoading}
                className="w-full py-3.5 rounded-2xl font-bold text-white bg-[#4285F4] transition-all active:translate-y-[2px] shadow-[0_4px_0_#2a63b8] flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none disabled:active:translate-y-0"
              >
                {oauthLoading === 'google' ? (
                  <>
                    <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#fff"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" fillOpacity="0.8"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" fillOpacity="0.6"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" fillOpacity="0.9"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => oauth('apple')}
                disabled={!!oauthLoading}
                className="w-full py-3.5 rounded-2xl font-bold text-white bg-black transition-all active:translate-y-[2px] shadow-[0_4px_0_#333] flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none disabled:active:translate-y-0"
              >
                {oauthLoading === 'apple' ? (
                  <>
                    <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden>
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    Continue with Apple
                  </>
                )}
              </button>

              <button
                onClick={goToSignup}
                disabled={!!oauthLoading}
                className="w-full text-center text-[13px] font-semibold text-chess-text-muted hover:text-chess-text transition-colors py-2 disabled:opacity-50"
              >
                Sign up with email
              </button>
            </div>
          ) : (
            // Control — original redirect-to-form behavior.
            <div className="w-full space-y-2.5">
              <ActionButton color="green" size="md" fullWidth onClick={goToSignup}>
                <span className="font-black block" style={{ fontSize: 'clamp(16px, 4.5vw, 20px)' }}>
                  Sign Up Free
                </span>
              </ActionButton>

              <ActionButton color="white" size="md" fullWidth onClick={goToLogin}>
                <span className="font-bold block text-chess-text" style={{ fontSize: 'clamp(13px, 3.5vw, 15px)' }}>
                  I already have an account
                </span>
              </ActionButton>
            </div>
          )}

          <button
            onClick={() => dismiss('maybe_later')}
            disabled={!!oauthLoading}
            className="mt-4 text-[13px] font-semibold text-chess-text-muted hover:text-chess-text transition-colors py-2 px-4 disabled:opacity-50"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
