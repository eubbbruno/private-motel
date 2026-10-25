alter table public.dashboard_maintenance
  add column if not exists suite_number text,
  add column if not exists completed_on date;

update public.dashboard_maintenance
set completed_on = performed_on
where status = 'completed' and completed_on is null;

alter table public.dashboard_maintenance
  drop constraint if exists completed_maintenance_has_date,
  drop constraint if exists dashboard_maintenance_description_check,
  add constraint dashboard_maintenance_suite_number_check
    check (suite_number is null or (length(trim(suite_number)) between 1 and 20)),
  add constraint dashboard_maintenance_description_check
    check (length(description) <= 2000),
  add constraint completed_maintenance_has_date
    check (status <> 'completed' or completed_on is not null),
  add constraint maintenance_completion_after_service
    check (performed_on is null or completed_on is null or completed_on >= performed_on);

create index if not exists dashboard_maintenance_open_idx
  on public.dashboard_maintenance (status, performed_on)
  where status in ('scheduled', 'in_progress');
