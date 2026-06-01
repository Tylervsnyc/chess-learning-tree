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
// Use NEXT_PUBLIC_ versions as fallback since those are what's set in Vercel
export const PRICES = {
  MONTHLY: process.env.STRIPE_PRICE_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!,
  YEARLY: process.env.STRIPE_PRICE_YEARLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY!,
  // Patron: support-only $4.99/mo. Unlocks no features — just a gold profile.
  // Reuses the monthly premium price unless a dedicated patron price is set.
  // (Patron vs premium is told apart by `is_patron` metadata, not the price id.)
  PATRON:
    process.env.STRIPE_PRICE_PATRON ||
    process.env.NEXT_PUBLIC_STRIPE_PRICE_PATRON ||
    process.env.STRIPE_PRICE_MONTHLY ||
    process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!,
};

// Price details for display
export const PRICE_DETAILS = {
  MONTHLY: {
    id: 'monthly',
    amount: 499, // $4.99 in cents
    interval: 'month' as const,
    label: 'Monthly',
    description: '$4.99/month',
  },
  YEARLY: {
    id: 'yearly',
    amount: 3999, // $39.99 in cents
    interval: 'year' as const,
    label: 'Yearly',
    description: '$39.99/year',
    savings: 'Save 33%',
  },
};

// Experiment price IDs — each variant maps to Stripe price IDs
// Falls back to the default price if variant-specific env vars aren't set
export const EXPERIMENT_PRICES: Record<string, { monthly: string; yearly: string }> = {
  control: {
    monthly: process.env.STRIPE_PRICE_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_YEARLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY!,
  },
  low: {
    monthly: process.env.STRIPE_PRICE_MONTHLY_LOW || process.env.STRIPE_PRICE_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_YEARLY_LOW || process.env.STRIPE_PRICE_YEARLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY!,
  },
  high: {
    monthly: process.env.STRIPE_PRICE_MONTHLY_HIGH || process.env.STRIPE_PRICE_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_YEARLY_HIGH || process.env.STRIPE_PRICE_YEARLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY!,
  },
};

// Display amounts per variant (cents)
export const EXPERIMENT_DISPLAY_PRICES: Record<string, { monthly: number; yearly: number }> = {
  control: { monthly: 499, yearly: 3999 },
  low: { monthly: 499, yearly: 3999 },
  high: { monthly: 1499, yearly: 11999 },
};

// Free tier limits
export const FREE_TIER = {
  DAILY_PUZZLE_LIMIT: 15,
};
