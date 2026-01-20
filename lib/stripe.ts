import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

export const PRICING_PLANS = {
  monthly: {
    name: 'Monthly',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!,
    price: 9.99,
    interval: 'month' as const,
  },
  yearly: {
    name: 'Yearly',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY!,
    price: 79.99,
    interval: 'year' as const,
    savings: 'Save 33%',
  },
};
