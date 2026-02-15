-- Dashboard Reports Table
-- Stores daily automated analysis reports with metrics and suggestions
-- Created: 2026-02-15

-- UP: Create table and indexes
create table if not exists public.dashboard_reports (
  id uuid default gen_random_uuid() primary key,
  report_type text not null,  -- 'revenue', 'engagement', 'ux', 'content', 'growth'
  generated_at timestamptz default now() not null,
  period text not null default '1d',  -- '1d', '7d', '30d'

  -- Fun headline stats (displayed as cards)
  metrics jsonb not null default '{}',
  -- e.g. { "lessons_yesterday": 47, "lessons_change_pct": 12, "daily_rooks_yesterday": 23, ... }

  -- AI-generated actionable suggestions
  suggestions jsonb not null default '[]',
  -- e.g. [{ "priority": "high", "title": "Churn spike", "detail": "3 users canceled...", "action": "Review dunning emails" }]

  -- Raw data snapshot for drill-down
  raw_data jsonb default '{}',

  created_at timestamptz default now() not null
);

-- Index for quick dashboard queries (latest report per type)
create index if not exists idx_dashboard_reports_type_date on public.dashboard_reports (report_type, generated_at desc);
create index if not exists idx_dashboard_reports_created_at on public.dashboard_reports (created_at desc);

-- RLS: only service role can write, no anon/authenticated access
alter table public.dashboard_reports enable row level security;

-- Service role bypasses RLS; authenticated users cannot access
create policy "Service role can manage dashboard reports"
  on public.dashboard_reports for all
  using (false)  -- Deny all public access
  with check (false);

-- Add helpful comment
comment on table public.dashboard_reports is 'Daily automated dashboard intelligence reports. Admin-only access. Retention: 90 days.';
comment on column public.dashboard_reports.report_type is 'Report category: revenue, engagement, ux, content, or growth';
comment on column public.dashboard_reports.period is 'Time period analyzed: 1d (yesterday), 7d (last 7 days), 30d (last 30 days)';
comment on column public.dashboard_reports.metrics is 'Key metrics as headline stats, e.g. {"lessons_yesterday": 47, "lessons_change_pct": 12}';
comment on column public.dashboard_reports.suggestions is 'Array of actionable insights: [{"priority": "high", "title": "...", "detail": "...", "action": "..."}]';
comment on column public.dashboard_reports.raw_data is 'Full data snapshot for drill-down and verification';
