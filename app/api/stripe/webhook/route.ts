import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/service';
import { sendEmail, getAppUrl, getUnsubscribeUrl } from '@/lib/email/send';
import { PatronThankYou } from '@/lib/email/templates/PatronThankYou';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  console.error('STRIPE_WEBHOOK_SECRET is not configured');
}

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

    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
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
        console.error('Payment failed for invoice:', invoice.id);
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

/**
 * A patron subscription is a support-only sub that must NEVER affect
 * subscription_status. It shares the $4.99/mo price with premium, so it is
 * told apart purely by `is_patron: 'true'` metadata — NOT by price id (that
 * would false-positive real premium subs). We persist this metadata onto the
 * subscription at checkout so it survives into later updated/deleted events.
 */
function isPatronSubscription(
  session: Stripe.Checkout.Session | null,
  subscription: Stripe.Subscription
): boolean {
  if (session?.metadata?.is_patron === 'true') return true;
  if (subscription.metadata?.is_patron === 'true') return true;
  return false;
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
      // Check if user already exists with this email via profiles table
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', guestEmail)
        .maybeSingle();
      const existingUser = existingProfile;

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
          throw new Error(`Failed to create guest user account: ${createError.message}`);
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
          // Profile might already exist from auth trigger, fall back to update
          console.warn('Profile insert failed, trying update:', profileError.message);
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'premium',
              stripe_customer_id: session.customer as string,
              subscription_expires_at: null,
              email: guestEmail,
            })
            .eq('id', userId);

          if (updateError) {
            console.error('Profile update fallback also failed:', updateError);
            throw new Error(`Failed to create or update guest profile: ${updateError.message}`);
          }
        }
      }
    } catch (err) {
      console.error('Error handling guest checkout account creation:', err);
      throw err;
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

    // Patron: support-only. Set the gold flag, NEVER touch subscription_status
    // (a patron unlocks no features — a free user must stay free).
    if (isPatronSubscription(session, subscription)) {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_patron: true,
          stripe_customer_id: session.customer as string,
        })
        .eq('id', userId);

      if (error) {
        console.error('Error setting patron flag after checkout:', error);
        throw new Error(`Failed to set patron flag: ${error.message}`);
      }

      // Persist user ID on the subscription so future patron webhooks resolve it.
      await stripe.subscriptions.update(session.subscription as string, {
        metadata: { supabase_user_id: userId, is_patron: 'true' },
      });

      // Personal thank-you note from Tyler. Best-effort — never block the webhook.
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, display_name')
          .eq('id', userId)
          .maybeSingle();
        const to = profile?.email || guestEmail;
        if (to) {
          await sendEmail({
            to,
            userId,
            type: 'patron_thank_you',
            subject: 'A thank you, from Tyler',
            react: PatronThankYou({
              displayName: profile?.display_name || undefined,
              appUrl: getAppUrl(),
              unsubscribeUrl: getUnsubscribeUrl(userId, 'patron_thank_you'),
            }),
          });
        }
      } catch (emailErr) {
        console.error('Failed to send patron thank-you email:', emailErr);
      }
      return;
    }

    // Get expiration date from the first subscription item
    let expiresAt: string | null = null;
    const firstItem = subscription.items?.data?.[0];
    if (firstItem?.current_period_end) {
      expiresAt = new Date(firstItem.current_period_end * 1000).toISOString();
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
      throw new Error(`Failed to update profile after checkout: ${error.message}`);
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
  const isActive = subscription.status === 'active' || subscription.status === 'trialing';

  // Patron sub: only flip the gold flag. Leave subscription_status / expiry alone
  // so a user who is both patron and premium keeps each independently.
  if (isPatronSubscription(null, subscription)) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_patron: isActive })
      .eq('id', userId);
    if (error) console.error('Error updating patron flag:', error);
    return;
  }

  const status = isActive ? 'premium' : 'free';

  // Get expiration date from the first subscription item
  let expiresAt: string | null = null;
  const firstItem = subscription.items?.data?.[0];
  if ((subscription.status === 'active' || subscription.status === 'trialing') &&
      firstItem?.current_period_end) {
    expiresAt = new Date(firstItem.current_period_end * 1000).toISOString();
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

  // Patron sub cancelled: drop the gold flag only — never touch subscription_status.
  if (isPatronSubscription(null, subscription)) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_patron: false })
      .eq('id', targetUserId);
    if (error) console.error('Error clearing patron flag:', error);
    return;
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
