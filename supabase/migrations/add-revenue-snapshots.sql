-- Create revenue_snapshots table for nightly revenue metrics
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.revenue_snapshots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date date NOT NULL UNIQUE,
  mrr_cents integer NOT NULL,
  arr_cents integer NOT NULL,
  total_subscribers integer NOT NULL,
  monthly_subscribers integer NOT NULL,
  yearly_subscribers integer NOT NULL,
  churned_last_30d integer NOT NULL,
  new_subscribers_last_30d integer NOT NULL,
  trial_users integer NOT NULL,
  free_users integer NOT NULL,
  churn_rate_pct numeric(5,2),
  ltv_cents integer,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.revenue_snapshots ENABLE ROW LEVEL SECURITY;

-- Only service_role can insert (used by cron job)
CREATE POLICY "Service role can insert revenue snapshots"
  ON public.revenue_snapshots
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Only service_role can select (used by admin API)
CREATE POLICY "Service role can read revenue snapshots"
  ON public.revenue_snapshots
  FOR SELECT
  TO service_role
  USING (true);

-- Index for efficient date-range queries
CREATE INDEX idx_revenue_snapshots_date ON public.revenue_snapshots (snapshot_date DESC);
