-- AI Usage — per-user per-route daily counters for the ai-guard helper.
-- Every paid AI route (Claude, ElevenLabs, etc.) increments a row here so
-- we can enforce daily quotas and protect against cost abuse.

CREATE TABLE IF NOT EXISTS ai_usage (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  route TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, date, route)
);

CREATE INDEX IF NOT EXISTS ai_usage_date_idx ON ai_usage (date);

-- RLS: service role only. No client should ever read or write this table.
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- No policies are created on purpose — with RLS enabled and no policies,
-- the anon and authenticated roles are fully blocked. The service role
-- bypasses RLS and is the only writer/reader.
