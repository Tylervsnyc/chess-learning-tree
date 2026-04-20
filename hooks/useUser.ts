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
  is_admin?: boolean;
  unlocked_levels?: number[];
  current_streak?: number;
  last_activity_date?: string | null;
  /** CHE-290: Rookie personality gauge (1-5). 3 = baseline. */
  attitude_level?: number;
}

const DEFAULT_ATTITUDE_LEVEL = 3;
const clampAttitude = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef<User | null>(null);
  userRef.current = user;

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

    // Verify subscription with Stripe if user has customer ID but is marked free
    const verifySubscription = async (profileData: Profile) => {
      if (profileData.stripe_customer_id && profileData.subscription_status === 'free') {
        try {
          const res = await fetch('/api/stripe/verify-subscription', { method: 'POST' });
          if (res.ok) {
            const data = await res.json();
            if (data.synced && data.status === 'premium') {
              // Subscription was out of sync - update local state
              return {
                ...profileData,
                subscription_status: 'premium' as const,
                subscription_expires_at: data.expires_at,
              };
            }
          }
        } catch (err) {
          console.error('Error verifying subscription:', err);
        }
      }
      return profileData;
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
            // Verify subscription status if they have a Stripe customer ID
            const verifiedProfile = await verifySubscription(data);
            // Migrate guest name from localStorage once, on first login
            // where the DB has no name yet.
            if (!verifiedProfile.display_name || !verifiedProfile.display_name.trim()) {
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
                  verifiedProfile.display_name = guestName;
                }
              } catch {}
            }
            setProfile(verifiedProfile);
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

          // Track Google OAuth completions (signup/login pages set 'auth_method' in localStorage)
          if (event === 'SIGNED_IN' && localStorage.getItem('auth_method') === 'google') {
            localStorage.removeItem('auth_method');
            identifyUser(sessionUser.id, { email: sessionUser.email });

            // If account was created within last 60 seconds, it's a new signup
            const createdAt = new Date(sessionUser.created_at).getTime();
            const isNewSignup = Date.now() - createdAt < 60_000;

            if (isNewSignup) {
              AuthEvents.signupCompleted('google');
            } else {
              AuthEvents.loginCompleted();
            }
          }
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
    // Optimistic local update (works even for guests without a profile row)
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

  const attitudeLevel = profile?.attitude_level ?? DEFAULT_ATTITUDE_LEVEL;

  return { user, profile, loading, signOut, refetchProfile, attitudeLevel, setAttitudeLevel };
}
