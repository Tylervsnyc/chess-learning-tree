import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

// This endpoint checks if a user has an active Stripe subscription
// but is incorrectly marked as 'free' in our database, and fixes it.
// Call this on app load or profile page to catch any missed webhooks.

export async function POST() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status, stripe_customer_id, subscription_expires_at, is_patron')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // If already premium and not expired, no need to check
    if (profile.subscription_status === 'premium') {
      const expiresAt = profile.subscription_expires_at ? new Date(profile.subscription_expires_at) : null;
      if (!expiresAt || expiresAt > new Date()) {
        return NextResponse.json({
          status: 'premium',
          synced: false,
          message: 'Already premium'
        });
      }
    }

    // If no stripe customer, nothing to check
    if (!profile.stripe_customer_id) {
      return NextResponse.json({
        status: 'free',
        synced: false,
        message: 'No Stripe customer'
      });
    }

    // Check Stripe for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 10,
    });

    // Also check for trialing subscriptions
    const trialingSubscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'trialing',
      limit: 10,
    });

    // Patron subscriptions share the premium price but unlock NOTHING — they must
    // never be synced into premium status. Only a non-patron sub counts here.
    const isPatronSub = (s: { metadata?: Record<string, string> | null }) =>
      s.metadata?.is_patron === 'true';
    const allSubs = [...subscriptions.data, ...trialingSubscriptions.data];
    const activeSubscription = allSubs.find((s) => !isPatronSub(s));

    // Self-heal the patron flag (catches a missed webhook) — independent of premium.
    const hasPatronSub = allSubs.some(isPatronSub);
    if (hasPatronSub !== (profile.is_patron === true)) {
      await supabase
        .from('profiles')
        .update({ is_patron: hasPatronSub })
        .eq('id', user.id);
    }

    if (!activeSubscription) {
      // No active subscription in Stripe - user is correctly free
      // But let's also check for any recent completed checkout sessions
      // in case subscription object hasn't been created yet
      return NextResponse.json({
        status: 'free',
        synced: false,
        message: 'No active Stripe subscription'
      });
    }

    // Found active subscription but user is marked free - FIX IT
    const firstItem = activeSubscription.items?.data?.[0];
    const currentPeriodEnd = firstItem?.current_period_end;
    const expiresAt = currentPeriodEnd
      ? new Date(currentPeriodEnd * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Fallback: 30 days

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'premium',
        subscription_expires_at: expiresAt,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error syncing subscription:', updateError);
      return NextResponse.json({
        error: 'Failed to sync subscription'
      }, { status: 500 });
    }


    return NextResponse.json({
      status: 'premium',
      synced: true,
      message: 'Subscription synced from Stripe',
      expires_at: expiresAt,
    });

  } catch (error) {
    console.error('Verify subscription error:', error);
    return NextResponse.json({
      error: 'Verification failed'
    }, { status: 500 });
  }
}
