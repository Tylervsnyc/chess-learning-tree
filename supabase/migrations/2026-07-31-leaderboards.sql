-- Chess Boxing leaderboards.
-- Adds public handles + opt-in, and a minimal "crew" system (join-by-code).
-- Boards are computed in the API from workout_sessions.points + created_at;
-- these objects only add identity (username) and grouping (crews).
--
-- Run in the Supabase SQL editor (DDL on the live DB is Tyler-only).

create extension if not exists citext;

-- ── Identity / opt-in on the existing profile ───────────────────────────────
alter table public.profiles
  add column if not exists username citext unique;

alter table public.profiles
  add column if not exists leaderboard_opt_in boolean not null default true;

-- ── Crews (gyms / friend groups) — joined by a shared code ───────────────────
create table if not exists public.crews (
  id          uuid        not null default gen_random_uuid() primary key,
  name        text        not null,
  join_code   citext      not null unique,
  created_at  timestamptz not null default now()
);

create table if not exists public.crew_members (
  crew_id    uuid        not null references public.crews(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (crew_id, user_id)
);

create index if not exists idx_crew_members_user on public.crew_members (user_id);

alter table public.crews enable row level security;
alter table public.crew_members enable row level security;

-- Any authenticated user may read crew names; joins/lookups by code go through
-- the service role in the API, so no public code-search policy is needed.
drop policy if exists "crews readable" on public.crews;
create policy "crews readable" on public.crews
  for select using (auth.role() = 'authenticated');

drop policy if exists "own crew memberships readable" on public.crew_members;
create policy "own crew memberships readable" on public.crew_members
  for select using (auth.uid() = user_id);

drop policy if exists "join self into crew" on public.crew_members;
create policy "join self into crew" on public.crew_members
  for insert with check (auth.uid() = user_id);

-- ── Hardening ────────────────────────────────────────────────────────────────

-- Username rules must hold at the DB level: profiles has an own-row UPDATE
-- policy, so a logged-in user can PATCH `username` via PostgREST and skip the
-- API's regex + reserved-name checks entirely. citext needs the ::text cast
-- for the regex.
alter table public.profiles drop constraint if exists username_format;
alter table public.profiles add constraint username_format check (
  username is null
  or (
    username::text ~ '^[A-Za-z0-9_]{3,20}$'
    and lower(username::text) not in
      ('admin', 'rookie', 'chesspath', 'chessboxing', 'you', 'me',
       'mod', 'moderator', 'staff', 'support', 'official', 'gleasons')
  )
);

-- The "crews readable" policy alone would expose join_code to every logged-in
-- user (SELECT * via PostgREST → enumerate every crew's code). Column-level
-- grants hide the code; API join/lookup uses the service role, unaffected.
revoke select on public.crews from authenticated, anon;
grant select (id, name, created_at) on public.crews to authenticated;

-- Leaderboards range-scan workout_sessions on created_at alone; the existing
-- (user_id, created_at) index can't serve that.
create index if not exists idx_workout_sessions_created_at
  on public.workout_sessions (created_at);

-- ── Seed the launch crew: CHESSBOXING NYC (Gleason's) ────────────────────────
insert into public.crews (name, join_code)
values ('CHESSBOXING NYC', 'NYC')
on conflict (join_code) do nothing;
