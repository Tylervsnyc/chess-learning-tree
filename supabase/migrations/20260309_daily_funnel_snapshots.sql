create table if not exists daily_funnel_snapshots (
  id uuid default gen_random_uuid() primary key,
  snapshot_date date not null,
  landing_page int not null default 0,
  tutorial_started int not null default 0,
  tutorial_completed int not null default 0,
  signup_page int not null default 0,
  signed_up int not null default 0,
  onboarding_completed int not null default 0,
  first_lesson int not null default 0,
  lesson_completed int not null default 0,
  daily_active_users int not null default 0,
  paywall_viewed int not null default 0,
  checkout_started int not null default 0,
  premium_converted int not null default 0,
  total_users int not null default 0,
  created_at timestamptz default now()
);

create unique index on daily_funnel_snapshots(snapshot_date);
