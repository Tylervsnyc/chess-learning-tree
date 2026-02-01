'use client';

import { useEffect, useState } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { createClient, clearAuthTokens } from '@/lib/supabase/client';

interface Profile {
  id: string;
  email: string;
  display_name: string;
  elo_rating: number;
  subscription_status: 'free' | 'premium' | 'trial';
  subscription_expires_at: string | null;
  stripe_customer_id: string | null;
  onboarding_completed?: boolean;
  is_admin?: boolean;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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
            setProfile(verifiedProfile);
          } else if (error) {
            // No profile found - create a fake one for display purposes
            // The real one should be created by the DB trigger
            console.log('Profile not found, using defaults');
            setProfile({
              id: userId,
              email: email,
              display_name: email.split('@')[0],
              elo_rating: 800,
              subscription_status: 'free',
              subscription_expires_at: null,
              stripe_customer_id: null,
              onboarding_completed: false,
              is_admin: false,
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

  return { user, profile, loading, signOut };
}
