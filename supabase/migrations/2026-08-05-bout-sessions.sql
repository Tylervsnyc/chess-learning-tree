-- Chess Boxing — Bout mode v2: persist finished bouts.
--
-- Bout v1 was local-only (no DB writes). This table makes a bout a real
-- finished unit, exactly like workout_sessions:
--   * it counts toward the streak (/api/workout/streak + lib/streak/activity.ts
--     read it as a 5th completion table),
--   * its points feed the leaderboard windows (/api/leaderboard),
--   * it backs the fight record on /profile.
--
-- Points/punches are client-reported and land on a PUBLIC board, so the API
-- caps them server-side (app/api/bout/finish) — same posture as
-- /api/workout/finish. client_session_id makes the write idempotent so a
-- double-tap or a retry can never double-count a bout.
--
-- Run in the Supabase SQL editor (DDL on the live DB is Tyler-only).
-- Everything here is additive and IF NOT EXISTS — safe to re-run.

create table if not exists public.bout_sessions (
  id                 uuid        not null default gen_random_uuid() primary key,
  user_id            uuid        not null references auth.users(id) on delete cascade,
  created_at         timestamptz not null default now(),
  ended_at           timestamptz not null default now(),

  -- 'ko_win' | 'ko_loss' | 'flag_loss' | 'draw' | 'decision_win' | 'decision_loss'
  outcome            text        not null,
  -- Derived from outcome so record queries stay trivial: 'win' | 'loss' | 'draw'
  result             text        not null,

  points             integer     not null default 0,
  punches            integer     not null default 0,
  moves              integer     not null default 0,
  -- Rookie's /play level the bout was fought at (1-10).
  level              integer     not null default 1,
  -- Judges' cards: user vs Rookie, one entry per boxing round.
  user_cards         integer[]   not null default '{}',
  rookie_cards       integer[]   not null default '{}',
  -- Seconds left on the user's 9:00 bank at the final bell.
  clock_left_seconds integer     not null default 0,
  final_fen          text,

  -- Idempotency: one row per client-generated bout id.
  client_session_id  text
);

-- Streak + leaderboard both scan by (user, time) — this is the hot path.
create index if not exists idx_bout_sessions_user_created
  on public.bout_sessions (user_id, created_at desc);

-- Leaderboard windows scan by time across all users.
create index if not exists idx_bout_sessions_created
  on public.bout_sessions (created_at desc);

-- One bout per client session id (the idempotency guarantee).
create unique index if not exists idx_bout_sessions_client_session
  on public.bout_sessions (client_session_id)
  where client_session_id is not null;

alter table public.bout_sessions enable row level security;

-- Users read their own bouts (the fight record on /profile). Writes go through
-- the service role in /api/bout/finish, which is what applies the score caps —
-- there is deliberately NO insert/update policy for the anon key, so a user
-- cannot hand-write a 9,999-point bout onto the public board.
drop policy if exists "own bouts readable" on public.bout_sessions;
create policy "own bouts readable" on public.bout_sessions
  for select using (auth.uid() = user_id);
