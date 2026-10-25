alter table public.dashboard_maintenance
  drop constraint if exists dashboard_maintenance_suite_check,
  drop constraint if exists dashboard_maintenance_suite_number_check,
  add constraint dashboard_maintenance_suite_check
    check (suite = any (array['Private Duplex', 'Diamante Luxo', 'Prata', 'Bronze', 'Áreas operacionais'])),
  add constraint dashboard_maintenance_suite_number_check
    check (suite_number is null or (length(trim(suite_number)) between 1 and 40));
