-- Add recent_lines to speech_memory — stores the last few LLM-generated opening
-- and game-end lines so Rookie can be told "you recently said these, say something
-- different" and stop repeating herself (e.g. always saying "you hung a piece").
-- Mirrors the existing JSONB array columns (used_recently, player_facts).

ALTER TABLE speech_memory
  ADD COLUMN IF NOT EXISTS recent_lines JSONB DEFAULT '[]'::jsonb NOT NULL;
