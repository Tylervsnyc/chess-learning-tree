import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Helper types for Stripe data (Stripe SDK v20 has complex types)
interface SubscriptionData {
  id: string;
  status: string;
  customer: string | Stripe.Customer | Stripe.DeletedCustomer;
  items: { data: Array<{ price: { id: string } }> };
  metadata?: Record<string, string>;
  cancel_at_period_end?: boolean;
  current_period_start?: number;
  current_period_end?: number;
}

interface InvoiceData {
  id: string;
  subscription?: string | { id: string } | null;
}

export async function POST(request: NextRequest) {
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
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabase, session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as unknown as SubscriptionData;
        await handleSubscriptionUpdate(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as unknown as SubscriptionData;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as unknown as InvoiceData;
        await handleInvoicePaymentSucceeded(supabase, invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as unknown as InvoiceData;
        await handleInvoicePaymentFailed(supabase, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createServiceClient>,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.user_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId || !subscriptionId) {
    console.error('Missing user_id or subscription in checkout session');
    return;
  }

  // Get the full subscription details
  const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId);
  const subscription = subscriptionResponse as unknown as SubscriptionData;
  const priceId = subscription.items.data[0]?.price.id;
  const plan = session.metadata?.plan || determinePlan(priceId);

  // Extract period timestamps
  const periodStart = subscription.current_period_start
    ? new Date(subscription.current_period_start * 1000).toISOString()
    : null;
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  // Upsert subscription record
  const { error } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      status: subscription.status,
      price_id: priceId,
      plan: plan,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
    },
    {
      onConflict: 'stripe_subscription_id',
    }
  );

  if (error) {
    console.error('Error upserting subscription:', error);
    throw error;
  }
}

async function handleSubscriptionUpdate(
  supabase: ReturnType<typeof createServiceClient>,
  subscription: SubscriptionData
) {
  const userId = subscription.metadata?.user_id;
  const priceId = subscription.items.data[0]?.price.id;
  const plan = subscription.metadata?.plan || determinePlan(priceId);
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;

  let resolvedUserId = userId;

  if (!resolvedUserId) {
    // Try to find user by customer ID
    const { data: customer } = await supabase
      .from('customers')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!customer) {
      console.error('Could not find user for subscription update');
      return;
    }
    resolvedUserId = customer.user_id;
  }

  // Extract period timestamps
  const periodStart = subscription.current_period_start
    ? new Date(subscription.current_period_start * 1000).toISOString()
    : null;
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  const { error } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: resolvedUserId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        price_id: priceId,
        plan: plan,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      },
      {
        onConflict: 'stripe_subscription_id',
      }
    );

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createServiceClient>,
  subscription: SubscriptionData
) {
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error marking subscription as canceled:', error);
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(
  supabase: ReturnType<typeof createServiceClient>,
  invoice: InvoiceData
) {
  if (!invoice.subscription) return;

  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription.id;

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'active' })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating subscription on payment success:', error);
  }
}

async function handleInvoicePaymentFailed(
  supabase: ReturnType<typeof createServiceClient>,
  invoice: InvoiceData
) {
  if (!invoice.subscription) return;

  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription.id;

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating subscription on payment failure:', error);
  }
}

function determinePlan(priceId: string | undefined): 'monthly' | 'yearly' | null {
  if (!priceId) return null;
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY) return 'monthly';
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY) return 'yearly';
  return null;
}
