export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'paused'
  | 'trialing'
  | 'unpaid';

export type PricingPlan = 'monthly' | 'yearly';

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  price_id: string | null;
  plan: PricingPlan | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingTier {
  name: string;
  plan: PricingPlan;
  priceId: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  savings?: string;
}
