-- CHE-239: Heartbeat/observability for cron jobs
-- Each cron records a row here on every run (success or failure).
-- Admin dashboard queries this table to spot silently-broken crons.

CREATE TABLE IF NOT EXISTS public.cron_heartbeats (
  id BIGSERIAL PRIMARY KEY,
  cron_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  duration_ms INTEGER NOT NULL,
  error TEXT,
  ran_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cron_heartbeats_name_ran_at_idx
  ON public.cron_heartbeats (cron_name, ran_at DESC);

CREATE INDEX IF NOT EXISTS cron_heartbeats_ran_at_idx
  ON public.cron_heartbeats (ran_at DESC);

ALTER TABLE public.cron_heartbeats ENABLE ROW LEVEL SECURITY;

-- Only service role writes; admin reads via API.
