'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { createClient, clearAuthTokens } from '@/lib/supabase/client';
import { AuthEvents, identifyUser } from '@/lib/analytics/posthog';

interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  subscription_status: 'free' | 'premium' | 'trial';
  subscription_expires_at: string | null;
  stripe_customer_id: string | null;
  /** Support-only patron flag — grants NO features, only a gold profile. */
  is_patron?: boolean;
  is_admin?: boolean;
  unlocked_levels?: number[];
  current_streak?: number;
  last_activity_date?: string | null;
  /** CHE-290: Rookie personality gauge (1-5). 3 = baseline. */
  attitude_level?: number;
  /** CHE-290: Rookie talkativeness gauge (1-5). 3 = baseline. */
  talkativeness_level?: number;
}

const DEFAULT_ATTITUDE_LEVEL = 3;
const DEFAULT_TALKATIVENESS_LEVEL = 3;
const clampAttitude = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const clampTalkativeness = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

// CHE-366: fire the OAuth signup/login analytics event from the params the
// server callback appended (?auth_event=signup|login&auth_method=google|apple).
// This is reliable where the old approach wasn't — it doesn't depend on the
// onAuthStateChange event type (the server-callback flow emits INITIAL_SESSION,
// not SIGNED_IN), on localStorage (dropped by the IG in-app browser), or on the
// client clock. Module-level guard + URL strip prevent a double fire if
// onAuthStateChange emits more than once for the same page load.
let authRedirectTracked = false;
function maybeTrackAuthRedirect(userId: string, email: string | undefined) {
  if (authRedirectTracked || typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const evt = params.get('auth_event');
  if (evt !== 'signup' && evt !== 'login') return;
  authRedirectTracked = true;
  identifyUser(userId, { email });
  // signup_completed is now fired SERVER-SIDE in /auth/callback (reliable; the
  // client fire dropped ~57% of real OAuth signups). We still identify here for
  // session stitching, but must NOT re-fire signup_completed (double-count).
  // login_completed has no DB-truth backstop, so keep firing it client-side.
  if (evt === 'login') AuthEvents.loginCompleted();
  // Strip the params so a refresh / re-render doesn't re-fire.
  params.delete('auth_event');
  params.delete('auth_method');
  const qs = params.toString();
  window.history.replaceState({}, '', window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash);
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [attitudeLevel, setAttitudeLevelState] = useState<number>(DEFAULT_ATTITUDE_LEVEL);
  const [talkativenessLevel, setTalkativenessLevelState] = useState<number>(DEFAULT_TALKATIVENESS_LEVEL);
  const userRef = useRef<User | null>(null);
  userRef.current = user;

  // Sync settings from profile when it loads
  useEffect(() => {
    if (profile?.attitude_level !== undefined) {
      setAttitudeLevelState(clampAttitude(profile.attitude_level));
    }
    if (profile?.talkativeness_level !== undefined) {
      setTalkativenessLevelState(clampTalkativeness(profile.talkativeness_level));
    }
  }, [profile?.attitude_level, profile?.talkativeness_level]);

  const refetchProfile = useCallback(async () => {
    const u = userRef.current;
    if (!u) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', u.id)
      .single();
    if (data) setProfile(data);
  }, []);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    // Verify subscription with Stripe if user has customer ID but is marked
    // free. Fire-and-forget (CHE-381): runs AFTER profile state is set so app
    // boot never waits on Stripe; patches state when it resolves. If the
    // profile row already says premium this is skipped entirely, so valid
    // subscribers see premium immediately with no flash.
    const verifySubscriptionInBackground = (profileData: Profile) => {
      if (!profileData.stripe_customer_id || profileData.subscription_status !== 'free') return;
      fetch('/api/stripe/verify-subscription', { method: 'POST' })
        .then(async (res) => {
          if (!res.ok) return;
          const data = await res.json();
          if (data.synced && data.status === 'premium' && mounted) {
            // Subscription was out of sync - update local state
            setProfile((p) =>
              p && p.id === profileData.id
                ? {
                    ...p,
                    subscription_status: 'premium' as const,
                    subscription_expires_at: data.expires_at,
                  }
                : p
            );
          }
        })
        .catch((err) => console.error('Error verifying subscription:', err));
    };

    // Fetch profile (don't try to create - that should happen via trigger)
    const fetchProfile = async (userId: string, email: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (mounted) {
          if (data) {
            const profileData: Profile = data;
            // Migrate guest name from localStorage once, on first login
            // where the DB has no name yet.
            if (!profileData.display_name || !profileData.display_name.trim()) {
              try {
                const guestName = localStorage.getItem('chess_path_name')?.trim();
                if (guestName) {
                  fetch('/api/profile/display-name', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: guestName }),
                  }).then((res) => {
                    if (res.ok && mounted) {
                      setProfile((p) => p ? { ...p, display_name: guestName } : p);
                    }
                  }).catch(() => {});
                  profileData.display_name = guestName;
                }
              } catch {}
            }
            setProfile(profileData);
            // Verify subscription status with Stripe AFTER profile state is
            // set — non-blocking, patches state if Stripe says premium.
            verifySubscriptionInBackground(profileData);
          } else if (error) {
            // No profile found - create a fake one for display purposes
            // The real one should be created by the DB trigger
            // No profile found - use defaults until DB trigger creates one
            setProfile({
              id: userId,
              email: email,
              display_name: null,
              subscription_status: 'free',
              subscription_expires_at: null,
              stripe_customer_id: null,
              is_admin: false,
              unlocked_levels: [1],
              current_streak: 0,
              last_activity_date: null,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    // Use onAuthStateChange for initial session - it fires immediately with current state
    // This is more reliable than getSession() which can hang
    let initialFired = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;

        // Handle token refresh errors (e.g., "Refresh Token Not Found")
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.warn('Auth: Token refresh failed, clearing stale tokens');
          clearAuthTokens();
          setUser(null);
          setProfile(null);
          if (!initialFired) {
            initialFired = true;
            setLoading(false);
          }
          return;
        }

        const sessionUser = session?.user ?? null;
        setUser(sessionUser);

        // Only set loading false on first event (INITIAL_SESSION or SIGNED_IN)
        if (!initialFired) {
          initialFired = true;
          setLoading(false);
        }

        if (sessionUser) {
          fetchProfile(sessionUser.id, sessionUser.email || '');
          // OAuth signup/login tracking is driven by the server callback via
          // URL params (CHE-366) — reliable across the IG in-app browser and
          // independent of the onAuthStateChange event type.
          maybeTrackAuthRedirect(sessionUser.id, sessionUser.email);
        } else {
          setProfile(null);
        }
      }
    );

    // Fallback timeout - if onAuthStateChange doesn't fire within 3 seconds, continue without auth
    const timeout = setTimeout(() => {
      if (mounted && !initialFired) {
        console.warn('Auth: onAuthStateChange timeout - continuing without auth');
        initialFired = true;
        setLoading(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const setAttitudeLevel = useCallback(async (level: number) => {
    const clamped = clampAttitude(level);
    const u = userRef.current;
    // Optimistic local state — works for guests or before profile loads
    setAttitudeLevelState(clamped);
    setProfile((p) => (p ? { ...p, attitude_level: clamped } : p));
    if (!u) return;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({ attitude_level: clamped })
        .eq('id', u.id);
      if (error) console.error('Error saving attitude_level:', error);
    } catch (err) {
      console.error('Error saving attitude_level:', err);
    }
  }, []);

  const setTalkativenessLevel = useCallback(async (level: number) => {
    const clamped = clampTalkativeness(level);
    const u = userRef.current;
    setTalkativenessLevelState(clamped);
    setProfile((p) => (p ? { ...p, talkativeness_level: clamped } : p));
    if (!u) return;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({ talkativeness_level: clamped })
        .eq('id', u.id);
      if (error) console.error('Error saving talkativeness_level:', error);
    } catch (err) {
      console.error('Error saving talkativeness_level:', err);
    }
  }, []);

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      // Always clear state and tokens, even if signOut fails
      clearAuthTokens();
      setUser(null);
      setProfile(null);
    }
  };

  return { user, profile, loading, signOut, refetchProfile, attitudeLevel, setAttitudeLevel, talkativenessLevel, setTalkativenessLevel };
}
