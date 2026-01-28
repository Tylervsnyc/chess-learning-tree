'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

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

    // Get initial session - use getSession first (reads from cookies, instant)
    const init = async () => {
      try {
        // getSession is fast - reads from cookies/localStorage
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
        }

        if (mounted) {
          const sessionUser = session?.user ?? null;
          setUser(sessionUser);
          // Set loading false IMMEDIATELY - don't wait for profile
          setLoading(false);

          // Fetch profile in background (don't block UI)
          if (sessionUser) {
            fetchProfile(sessionUser.id, sessionUser.email || '');
          }
        }
      } catch (err) {
        console.error('Error in init:', err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Track if init has completed to avoid timeout race condition
    let initComplete = false;

    init().finally(() => {
      initComplete = true;
    });

    // Fallback timeout - only fires if init hasn't completed
    // Extended to 10 seconds to handle slow connections
    const timeout = setTimeout(() => {
      if (mounted && !initComplete) {
        console.warn('Auth loading timeout - continuing without auth');
        setLoading(false);
      }
    }, 10000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email || '');
        } else {
          setProfile(null);
        }
      }
    );

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
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      // Force clear state even if signOut fails
      setUser(null);
      setProfile(null);
    }
  };

  return { user, profile, loading, signOut };
}
