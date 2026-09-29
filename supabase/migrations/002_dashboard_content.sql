-- Execute only in the new, confirmed Private Motel project. No legacy migration required.
begin;
create schema if not exists private_dashboard;
revoke all on schema private_dashboard from public, anon;
grant usage on schema private_dashboard to authenticated;
create table public.dashboard_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 160),
  body text not null default '' check (length(body) <= 10000),
  status text not null default 'draft' check (status in ('draft','review','approved','archived')),
  version integer not null default 1 check (version > 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.dashboard_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 160),
  body text not null default '' check (length(body) <= 10000),
  status text not null default 'draft' check (status in ('draft','published','paused','archived')),
  version integer not null default 1 check (version > 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index dashboard_posts_updated on public.dashboard_posts(updated_at desc);
create index dashboard_campaigns_updated on public.dashboard_campaigns(updated_at desc);

-- Current stored role, not a stale role carried in a JWT or user-editable metadata.
create function private_dashboard.current_role() returns text
language sql stable security definer set search_path = '' as $$
  select raw_app_meta_data->>'private_motel_role' from auth.users where id = (select auth.uid());
$$;
revoke all on function private_dashboard.current_role() from public, anon;
grant execute on function private_dashboard.current_role() to authenticated;

create function public.private_dashboard_update() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.created_by := old.created_by;
  new.created_at := old.created_at;
  new.updated_at := now();
  new.version := old.version + 1;
  return new;
end;
$$;
create trigger dashboard_posts_update before update on public.dashboard_posts for each row execute function public.private_dashboard_update();
create trigger dashboard_campaigns_update before update on public.dashboard_campaigns for each row execute function public.private_dashboard_update();

alter table public.dashboard_posts enable row level security;
alter table public.dashboard_campaigns enable row level security;
revoke all on public.dashboard_posts, public.dashboard_campaigns from anon, authenticated;
grant select, insert, update on public.dashboard_posts, public.dashboard_campaigns to authenticated;
create policy posts_read on public.dashboard_posts for select to authenticated using ((select private_dashboard.current_role()) in ('owner','editor'));
create policy posts_create on public.dashboard_posts for insert to authenticated with check ((select private_dashboard.current_role()) in ('owner','editor') and created_by = (select auth.uid()));
create policy posts_edit on public.dashboard_posts for update to authenticated using ((select private_dashboard.current_role()) in ('owner','editor')) with check ((select private_dashboard.current_role()) in ('owner','editor'));
create policy campaigns_read on public.dashboard_campaigns for select to authenticated using ((select private_dashboard.current_role()) in ('owner','editor'));
create policy campaigns_create on public.dashboard_campaigns for insert to authenticated with check (created_by = (select auth.uid()) and ((select private_dashboard.current_role()) = 'owner' or ((select private_dashboard.current_role()) = 'editor' and status = 'draft')));
create policy campaigns_edit on public.dashboard_campaigns for update to authenticated using ((select private_dashboard.current_role()) = 'owner' or ((select private_dashboard.current_role()) = 'editor' and status = 'draft')) with check ((select private_dashboard.current_role()) = 'owner' or ((select private_dashboard.current_role()) = 'editor' and status = 'draft'));
commit;
