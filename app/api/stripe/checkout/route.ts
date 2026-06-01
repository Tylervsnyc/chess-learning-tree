import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { stripe, PRICES, EXPERIMENT_PRICES } from '@/lib/stripe';
import type { PricingVariant } from '@/lib/posthog-flags';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured (missing STRIPE_SECRET_KEY)' },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }

    // Get request body
    const { priceId, variant } = await request.json();

    if (!priceId || (priceId !== 'monthly' && priceId !== 'yearly' && priceId !== 'patron')) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Patron is a support-only subscription — flat price, no pricing experiment.
    const isPatron = priceId === 'patron';

    // Resolve Stripe price ID — use experiment variant if provided, otherwise default
    let stripePriceId: string;
    const validVariants: PricingVariant[] = ['control', 'low', 'high'];
    const resolvedVariant: PricingVariant = variant && validVariants.includes(variant) ? variant : 'control';

    if (isPatron) {
      stripePriceId = PRICES.PATRON;
    } else if (resolvedVariant !== 'control' && EXPERIMENT_PRICES[resolvedVariant]) {
      stripePriceId = priceId === 'monthly'
        ? EXPERIMENT_PRICES[resolvedVariant].monthly
        : EXPERIMENT_PRICES[resolvedVariant].yearly;
    } else {
      stripePriceId = priceId === 'monthly' ? PRICES.MONTHLY : PRICES.YEARLY;
    }

    // Check if price ID is set
    if (!stripePriceId) {
      return NextResponse.json(
        { error: `Price ID not configured for ${priceId} plan` },
        { status: 500 }
      );
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID to profile. stripe_customer_id is locked to the service
      // role by the protect_privileged_profile_columns trigger, so this write
      // (set after creating the Stripe customer server-side) uses the service client.
      await createServiceClient()
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Create checkout session with experiment metadata
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: isPatron
        ? `${request.nextUrl.origin}/profile?patron=1`
        : `${request.nextUrl.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/subscription/cancelled`,
      metadata: {
        supabase_user_id: user.id,
        pricing_variant: resolvedVariant,
        ...(isPatron ? { is_patron: 'true' } : {}),
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          pricing_variant: resolvedVariant,
          // Webhook reads this to set is_patron WITHOUT touching subscription_status.
          ...(isPatron ? { is_patron: 'true' } : {}),
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Checkout failed: ${message}` },
      { status: 500 }
    );
  }
}
