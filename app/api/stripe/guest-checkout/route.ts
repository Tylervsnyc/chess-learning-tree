import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICES } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { priceId, email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!priceId || (priceId !== 'monthly' && priceId !== 'yearly')) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    const stripePriceId = priceId === 'monthly' ? PRICES.MONTHLY : PRICES.YEARLY;

    // Create checkout session for guest (no existing customer)
    // Stripe will create a customer automatically
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/subscription/setup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/subscription/cancelled`,
      metadata: {
        is_guest_checkout: 'true',
        guest_email: email,
      },
      subscription_data: {
        metadata: {
          is_guest_checkout: 'true',
          guest_email: email,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Guest checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
