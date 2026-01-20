import Stripe from 'stripe';

// Initialize Stripe lazily to avoid build-time errors when env vars aren't set
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    });
  }
  return _stripe;
}

// For backwards compatibility, export stripe getter
export const stripe = {
  get customers() { return getStripe().customers; },
  get subscriptions() { return getStripe().subscriptions; },
  get checkout() { return getStripe().checkout; },
  get billingPortal() { return getStripe().billingPortal; },
  get webhooks() { return getStripe().webhooks; },
};

// Price IDs from Stripe Dashboard
export const PRICES = {
  MONTHLY: process.env.STRIPE_PRICE_MONTHLY!,
  YEARLY: process.env.STRIPE_PRICE_YEARLY!,
};

// Price details for display
export const PRICE_DETAILS = {
  MONTHLY: {
    id: 'monthly',
    amount: 999, // $9.99 in cents
    interval: 'month' as const,
    label: 'Monthly',
    description: '$9.99/month',
  },
  YEARLY: {
    id: 'yearly',
    amount: 7999, // $79.99 in cents
    interval: 'year' as const,
    label: 'Yearly',
    description: '$79.99/year',
    savings: 'Save 33%',
  },
};

// Free tier limits
export const FREE_TIER = {
  DAILY_PUZZLE_LIMIT: 15,
};
