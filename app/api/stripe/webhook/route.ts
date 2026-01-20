import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/service';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(supabase, session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(supabase, invoice);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(
  supabase: ReturnType<typeof createServiceClient>,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.supabase_user_id;
  if (!userId) {
    console.error('No user ID in checkout session metadata');
    return;
  }

  // Get subscription details
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentPeriodEnd = (subscription as any).current_period_end as number;
    const expiresAt = new Date(currentPeriodEnd * 1000).toISOString();

    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'premium',
        subscription_expires_at: expiresAt,
        stripe_customer_id: session.customer as string,
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile after checkout:', error);
    }
  }
}

async function handleSubscriptionUpdate(
  supabase: ReturnType<typeof createServiceClient>,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) {
    // Try to find user by customer ID
    const customerId = subscription.customer as string;
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!profile) {
      console.error('No user found for subscription update');
      return;
    }

    await updateSubscriptionStatus(supabase, profile.id, subscription);
    return;
  }

  await updateSubscriptionStatus(supabase, userId, subscription);
}

async function updateSubscriptionStatus(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
  subscription: Stripe.Subscription
) {
  const status = subscription.status === 'active' || subscription.status === 'trialing'
    ? 'premium'
    : 'free';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentPeriodEnd = (subscription as any).current_period_end as number;
  const expiresAt = subscription.status === 'active' || subscription.status === 'trialing'
    ? new Date(currentPeriodEnd * 1000).toISOString()
    : null;

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: status,
      subscription_expires_at: expiresAt,
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating subscription status:', error);
  }
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createServiceClient>,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.supabase_user_id;
  let targetUserId = userId;

  if (!targetUserId) {
    // Try to find user by customer ID
    const customerId = subscription.customer as string;
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!profile) {
      console.error('No user found for subscription deletion');
      return;
    }
    targetUserId = profile.id;
  }

  // Revert to free
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'free',
      subscription_expires_at: null,
    })
    .eq('id', targetUserId);

  if (error) {
    console.error('Error reverting to free tier:', error);
  }
}

async function handlePaymentFailed(
  supabase: ReturnType<typeof createServiceClient>,
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) {
    console.error('No user found for failed payment');
    return;
  }

  // Optionally: Send notification, mark account, etc.
  // For now, we just log it - Stripe will retry automatically
  console.log(`Payment failed for user ${profile.id}`);
}
