'use client';

import { createClient } from '@/lib/supabase/client';
import { trackEvent, identifyUser } from '@/lib/analytics/posthog';
import { humanizeAuthError } from '@/lib/auth-utils';

/**
 * lib/auth/signup.ts — the ONE email/password signup.
 *
 * Extracted from app/auth/signup/page.tsx (2026-08-25) when the Chess Boxing
 * onboarding grew its own inline account step. Two copies of this would drift
 * immediately: the duplicate-email quirk below is easy to miss, and the
 * welcome email + first-touch stamp are easy to forget — a user who signed up
 * inside the app would silently never get either.
 *
 * Every email signup in the app goes through here. OAuth does not: those
 * surfaces redirect to /auth/callback, which does its own stamping.
 */

export type SignupResult =
  | { ok: true; userId: string | null }
  | { ok: false; error: string; duplicateEmail: boolean };

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<SignupResult> {
  trackEvent('signup_started', { version: 'v2' });

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    trackEvent('signup_failed', { error: error.message, version: 'v2' });
    return { ok: false, error: humanizeAuthError(error.message), duplicateEmail: false };
  }

  // Supabase returns a FAKE success with an empty identities array when the
  // email already exists (it refuses to confirm or deny an account by design).
  // Without this check the user is told "you're in" and then isn't.
  if (data.user && data.user.identities?.length === 0) {
    trackEvent('signup_failed', { error: 'duplicate_email', version: 'v2' });
    return {
      ok: false,
      error: 'An account with this email already exists.',
      duplicateEmail: true,
    };
  }

  if (data.user) identifyUser(data.user.id, { email });
  trackEvent('signup_completed', { method: 'email', version: 'v2' });

  // Both fire-and-forget — neither should ever block getting into the app.
  fetch('/api/email/welcome', { method: 'POST' }).catch(() => {});
  // CHE-387: email signups never hit /auth/callback, so this is their
  // first-touch attribution stamping path.
  fetch('/api/attribution/stamp', { method: 'POST' }).catch(() => {});

  return { ok: true, userId: data.user?.id ?? null };
}
