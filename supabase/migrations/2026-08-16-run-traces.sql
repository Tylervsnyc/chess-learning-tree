-- Human playtest traces from deployed sessions (phone + TestFlight).
--
-- Apply BY HAND in the Supabase SQL editor — this project has no migration
-- runner, and DDL on the live database is Tyler-only. app/api/run-trace
-- degrades to a logged no-op until this exists, so applying it is safe to do
-- at any point and never a deploy blocker.
--
-- Writes go through the service role only (see app/api/run-trace/route.ts);
-- there is deliberately no anon INSERT policy and no SELECT policy, so the
-- anon key can neither write nor read traces.

CREATE TABLE IF NOT EXISTS public.run_traces (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id      TEXT        NOT NULL,
  run_date    DATE        NOT NULL,
  level       INTEGER     NOT NULL,
  outcome     TEXT        NOT NULL,
  device      TEXT,
  payload     JSONB       NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_run_traces_date
  ON public.run_traces (run_date DESC, run_id);

ALTER TABLE public.run_traces ENABLE ROW LEVEL SECURITY;
