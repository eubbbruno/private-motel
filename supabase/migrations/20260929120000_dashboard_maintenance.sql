begin;

create table public.dashboard_maintenance (
  id uuid primary key default gen_random_uuid(),
  suite text not null check (suite in ('Private Duplex','Diamante Luxo','Prata','Bronze')),
  item text not null check (length(trim(item)) between 1 and 120),
  category text not null check (category in ('Acabamentos','Climatização','Elétrica','Eletrônicos','Hidráulica','Hidromassagem','Mobiliário','Sauna','Segurança','Outros')),
  service_type text not null check (service_type in ('preventive','corrective','inspection','installation')),
  status text not null check (status in ('completed','scheduled','in_progress','cancelled')),
  performed_on date,
  next_due_on date,
  description text not null check (length(trim(description)) between 1 and 2000),
  provider text not null default '' check (length(provider) <= 160),
  cost numeric(10,2) check (cost is null or cost >= 0),
  notes text not null default '' check (length(notes) <= 2000),
  version integer not null default 1 check (version > 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint completed_maintenance_has_date check (status <> 'completed' or performed_on is not null),
  constraint maintenance_due_after_service check (performed_on is null or next_due_on is null or next_due_on >= performed_on)
);

create index dashboard_maintenance_suite_item_idx on public.dashboard_maintenance(suite, item);
create index dashboard_maintenance_due_idx on public.dashboard_maintenance(next_due_on) where status <> 'cancelled';
create index dashboard_maintenance_performed_idx on public.dashboard_maintenance(performed_on desc);
create index dashboard_maintenance_created_by_idx on public.dashboard_maintenance(created_by);

create trigger dashboard_maintenance_update before update on public.dashboard_maintenance
for each row execute function public.private_dashboard_update();

alter table public.dashboard_maintenance enable row level security;
revoke all on public.dashboard_maintenance from anon, authenticated;
grant select, insert, update on public.dashboard_maintenance to authenticated;
create policy maintenance_read on public.dashboard_maintenance for select to authenticated
using ((select private_dashboard.current_role()) = 'owner');
create policy maintenance_create on public.dashboard_maintenance for insert to authenticated
with check ((select private_dashboard.current_role()) = 'owner' and created_by = (select auth.uid()));
create policy maintenance_edit on public.dashboard_maintenance for update to authenticated
using ((select private_dashboard.current_role()) = 'owner')
with check ((select private_dashboard.current_role()) = 'owner');

commit;
