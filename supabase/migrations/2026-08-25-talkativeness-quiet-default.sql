-- Chess Boxing release: Rookie ships quiet.
--
-- talkativeness_level was created with DEFAULT 3, so every existing profile
-- carries a 3 nobody actually chose. The client baseline is now 1
-- (hooks/useUser.ts DEFAULT_TALKATIVENESS_LEVEL), which only reaches
-- logged-out visitors until the stored rows move too.
--
-- Level 1 = one quip per 30 moves, 20-move cooldown (lib/speech/priority-queue.ts).
-- Nothing is deleted: the "How often Rookie talks" slider in /play settings
-- still reaches 5 and every line pool is untouched.

ALTER TABLE profiles
  ALTER COLUMN talkativeness_level SET DEFAULT 1;

UPDATE profiles
  SET talkativeness_level = 1
  WHERE talkativeness_level = 3;
