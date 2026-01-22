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
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Webhook handler failed: ${message}` },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(
  supabase: ReturnType<typeof createServiceClient>,
  session: Stripe.Checkout.Session
) {
  // Check if this is a guest checkout
  const isGuestCheckout = session.metadata?.is_guest_checkout === 'true';
  const guestEmail = session.metadata?.guest_email || session.customer_email;

  let userId = session.metadata?.supabase_user_id;

  // Handle guest checkout - create account
  if (isGuestCheckout && guestEmail && !userId) {
    try {
      // Check if user already exists with this email
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === guestEmail);

      if (existingUser) {
        // User already exists, use their ID
        userId = existingUser.id;
      } else {
        // Create new user with a random password (they'll set it via magic link)
        const tempPassword = crypto.randomUUID() + crypto.randomUUID();
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: guestEmail,
          password: tempPassword,
          email_confirm: true, // Auto-confirm since they paid
          user_metadata: {
            created_via: 'guest_checkout',
          },
        });

        if (createError) {
          console.error('Error creating user for guest checkout:', createError);
          return;
        }

        userId = newUser.user.id;

        // Create their profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: guestEmail,
            subscription_status: 'premium',
            stripe_customer_id: session.customer as string,
          });

        if (profileError) {
          // Profile might already exist from trigger, try update instead
          console.log('Profile insert failed, trying update:', profileError.message);
        }
      }
    } catch (err) {
      console.error('Error handling guest checkout account creation:', err);
      return;
    }
  }

  if (!userId) {
    console.error('No user ID available for checkout session');
    return;
  }

  // Get subscription details
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Safely get expiration date
    let expiresAt: string | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentPeriodEnd = (subscription as any).current_period_end;
    if (currentPeriodEnd && typeof currentPeriodEnd === 'number') {
      expiresAt = new Date(currentPeriodEnd * 1000).toISOString();
    }

    // Update profile with premium status
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

    // Update subscription metadata with user ID for future webhook events
    await stripe.subscriptions.update(session.subscription as string, {
      metadata: {
        supabase_user_id: userId,
      },
    });
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

  // Safely get expiration date
  let expiresAt: string | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentPeriodEnd = (subscription as any).current_period_end;
  if ((subscription.status === 'active' || subscription.status === 'trialing') &&
      currentPeriodEnd && typeof currentPeriodEnd === 'number') {
    expiresAt = new Date(currentPeriodEnd * 1000).toISOString();
  }

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
