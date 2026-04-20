-- CHE-290: Rookie talkativeness gauge
-- Adds per-user talkativeness level (1-5) controlling how often Rookie speaks in-game.
-- 1 = silent, 3 = baseline, 5 = nonstop. Checkmate/game-end always fire regardless.

ALTER TABLE profiles
  ADD COLUMN talkativeness_level INTEGER DEFAULT 3 NOT NULL
  CHECK (talkativeness_level BETWEEN 1 AND 5);
