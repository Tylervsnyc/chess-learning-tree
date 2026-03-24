-- Speech Memory — persists Rookie's cross-game memory for the priority queue system.
-- Stores which lines have been used (so they don't repeat) and player facts
-- (so Rookie can reference past games in her opening line).

CREATE TABLE IF NOT EXISTS speech_memory (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Line drain tracking: IDs of lines used recently (deprioritized, not blocked)
  used_recently JSONB DEFAULT '[]'::jsonb NOT NULL,

  -- Player facts: discrete observations from past games
  -- e.g. ["hung a bishop on move 12", "first win against Rookie", "always plays Italian"]
  player_facts JSONB DEFAULT '[]'::jsonb NOT NULL,

  -- Stats
  games_played INTEGER DEFAULT 0 NOT NULL,
  total_wins INTEGER DEFAULT 0 NOT NULL,
  total_losses INTEGER DEFAULT 0 NOT NULL,
  total_draws INTEGER DEFAULT 0 NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS
ALTER TABLE speech_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own speech memory"
  ON speech_memory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own speech memory"
  ON speech_memory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own speech memory"
  ON speech_memory FOR UPDATE
  USING (auth.uid() = user_id);
