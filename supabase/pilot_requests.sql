create table if not exists public.pilot_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  work_email text not null,
  company text not null,
  name text,
  phone text,
  team text,
  use_case text,
  primary_system text,
  manual_work text not null,
  team_size text,
  preferred_contact text,
  source_page text,
  status text not null default 'new'
);

alter table public.pilot_requests enable row level security;

grant insert on public.pilot_requests to anon;

drop policy if exists "Allow public pilot request inserts" on public.pilot_requests;

create policy "Allow public pilot request inserts"
on public.pilot_requests
for insert
to anon
with check (true);
