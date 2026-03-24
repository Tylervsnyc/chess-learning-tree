-- Game Sessions & Move Log — powers Rookie's post-game coaching
-- Captures rich data from Play Rookie games, Daily Rook, and lessons.

-- ════════════════════════════════
-- GAME SESSIONS — one row per game/puzzle session
-- ════════════════════════════════
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session metadata
  session_type TEXT NOT NULL,          -- 'play-rookie' | 'daily-rook' | 'lesson'
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_ms INTEGER,

  -- Game result (play-rookie)
  result TEXT,                         -- 'win' | 'loss' | 'draw' | null (for puzzle sessions)
  result_method TEXT,                  -- 'checkmate' | 'stalemate' | 'resignation' | 'timeout' | null
  player_color TEXT,                   -- 'white' | 'black' | null
  rookie_difficulty INTEGER,           -- 0-4 skill level | null

  -- Puzzle session stats (daily-rook, lesson)
  puzzles_total INTEGER,
  puzzles_correct INTEGER,
  puzzles_wrong INTEGER,
  best_streak INTEGER,                 -- longest consecutive correct in session

  -- Summary stats (computed at session end)
  total_moves INTEGER,
  pieces_hung INTEGER,                 -- times user left a piece undefended
  captures_missed INTEGER,             -- free captures user didn't take
  themes_seen TEXT[],                  -- tactical themes encountered
  themes_correct TEXT[],               -- themes user got right
  themes_missed TEXT[],                -- themes user got wrong

  -- Coaching output (filled after coaching runs)
  coaching_generated BOOLEAN DEFAULT FALSE,
  coaching_data JSONB,                 -- Rookie's coaching script + recommendations

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ════════════════════════════════
-- SESSION MOVES — one row per move or puzzle attempt
-- ════════════════════════════════
CREATE TABLE IF NOT EXISTS session_moves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  move_number INTEGER NOT NULL,

  -- Move data (play-rookie)
  moved_by TEXT,                       -- 'player' | 'rookie' | null (puzzle)
  move_san TEXT,                       -- e.g., "Nxf7+"
  piece TEXT,                          -- 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
  from_square TEXT,                    -- e.g., "e2"
  to_square TEXT,                      -- e.g., "e4"
  is_capture BOOLEAN DEFAULT FALSE,
  is_check BOOLEAN DEFAULT FALSE,
  is_castling BOOLEAN DEFAULT FALSE,
  fen_after TEXT,                      -- position after this move

  -- Timing
  time_to_move_ms INTEGER,            -- how long user took (null for rookie moves)

  -- Analysis flags
  piece_hung BOOLEAN DEFAULT FALSE,   -- did this move leave a piece hanging?
  capture_available BOOLEAN DEFAULT FALSE, -- was a free capture available before this move?
  capture_taken BOOLEAN DEFAULT FALSE, -- did user take the free capture?

  -- Puzzle-specific fields
  puzzle_id TEXT,                      -- Lichess puzzle ID (for puzzle sessions)
  puzzle_theme TEXT,                   -- primary tactical theme
  puzzle_rating INTEGER,               -- puzzle difficulty
  correct BOOLEAN,                    -- did user solve it?
  first_attempt_san TEXT,             -- user's first move (even if wrong)
  retry_count INTEGER DEFAULT 0,

  -- Mood at this point
  rookie_mood TEXT,                    -- mood name at time of move

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ════════════════════════════════
-- INDEXES
-- ════════════════════════════════

-- Look up sessions by user (most recent first)
CREATE INDEX IF NOT EXISTS idx_game_sessions_user
  ON game_sessions (user_id, created_at DESC);

-- Look up sessions by type
CREATE INDEX IF NOT EXISTS idx_game_sessions_type
  ON game_sessions (user_id, session_type, created_at DESC);

-- Look up moves by session
CREATE INDEX IF NOT EXISTS idx_session_moves_session
  ON session_moves (session_id, move_number);

-- Theme-based queries for coaching aggregation
CREATE INDEX IF NOT EXISTS idx_session_moves_theme
  ON session_moves (puzzle_theme, correct, created_at)
  WHERE puzzle_theme IS NOT NULL;

-- ════════════════════════════════
-- RLS
-- ════════════════════════════════
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_moves ENABLE ROW LEVEL SECURITY;

-- Users can read their own sessions
CREATE POLICY "Users can read own sessions"
  ON game_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions (for coaching_data)
CREATE POLICY "Users can update own sessions"
  ON game_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Moves: users can read moves from their sessions
CREATE POLICY "Users can read own moves"
  ON session_moves FOR SELECT
  USING (session_id IN (SELECT id FROM game_sessions WHERE user_id = auth.uid()));

-- Moves: users can insert moves into their sessions
CREATE POLICY "Users can insert own moves"
  ON session_moves FOR INSERT
  WITH CHECK (session_id IN (SELECT id FROM game_sessions WHERE user_id = auth.uid()));
