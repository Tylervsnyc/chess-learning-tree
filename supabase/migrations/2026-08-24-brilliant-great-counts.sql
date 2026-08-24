-- Brilliant / great move counts: per game on game_sessions, lifetime on profiles.
-- Written by GameSession.end() (client, per-game) and POST /api/profile/move-quality
-- (service role → increment_move_quality RPC, lifetime totals).

alter table public.game_sessions
  add column if not exists brilliant_moves integer not null default 0,
  add column if not exists great_moves integer not null default 0;

alter table public.profiles
  add column if not exists total_brilliant_moves integer not null default 0,
  add column if not exists total_great_moves integer not null default 0;

create or replace function public.increment_move_quality(
  p_user_id uuid,
  p_brilliant integer,
  p_great integer
) returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
     set total_brilliant_moves = total_brilliant_moves + greatest(0, coalesce(p_brilliant, 0)),
         total_great_moves     = total_great_moves     + greatest(0, coalesce(p_great, 0))
   where id = p_user_id;
$$;

-- Service role only; never callable from the browser.
revoke all on function public.increment_move_quality(uuid, integer, integer) from public, anon, authenticated;
grant execute on function public.increment_move_quality(uuid, integer, integer) to service_role;
