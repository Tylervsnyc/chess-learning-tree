-- Chess Boxing printable puzzle sheets: pool + draw tracking
-- Public /boxing page draws from a shared pool; once a puzzle is drawn, it's gone.

create table if not exists boxing_draws (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  theme text not null,
  pages int not null,
  show_themes boolean not null default false
);

create table if not exists boxing_puzzle_draws (
  puzzle_id text primary key,
  draw_id uuid not null references boxing_draws(id) on delete cascade,
  drawn_at timestamptz not null default now(),
  position int not null,
  fen text not null,
  moves text[] not null,
  rating int not null,
  themes text[] not null
);

create index if not exists boxing_puzzle_draws_draw_id_idx
  on boxing_puzzle_draws(draw_id);

alter table boxing_draws enable row level security;
alter table boxing_puzzle_draws enable row level security;

-- Public read of a draw by id (so /boxing/print/[id] works without auth).
create policy "read draws" on boxing_draws for select using (true);
create policy "read puzzle draws" on boxing_puzzle_draws for select using (true);
