-- CHE-290: Rookie personality gauge
-- Adds per-user attitude level (1-5) controlling Rookie's tone.
-- 1-2 => polite, 3 => baseline, 4-5 => spicy.

ALTER TABLE profiles
  ADD COLUMN attitude_level INTEGER DEFAULT 3 NOT NULL
  CHECK (attitude_level BETWEEN 1 AND 5);
