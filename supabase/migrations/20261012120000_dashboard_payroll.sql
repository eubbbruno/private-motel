begin;

create table public.dashboard_employees (
  id uuid primary key default gen_random_uuid(),
  employee_code text not null check (length(trim(employee_code)) between 1 and 40),
  full_name text not null check (length(trim(full_name)) between 2 and 160),
  role_title text not null default '' check (length(role_title) <= 120),
  department text not null default '' check (length(department) <= 120),
  admission_date date not null,
  experience_end_date date,
  status text not null default 'active' check (status in ('active','leave','terminated')),
  termination_date date,
  notes text not null default '' check (length(notes) <= 2000),
  version integer not null default 1 check (version > 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employee_termination_state check ((status = 'terminated') = (termination_date is not null)),
  constraint employee_experience_after_admission check (experience_end_date is null or experience_end_date >= admission_date),
  constraint employee_termination_after_admission check (termination_date is null or termination_date >= admission_date)
);
create unique index dashboard_employees_code_unique on public.dashboard_employees(lower(employee_code));
create index dashboard_employees_status_name on public.dashboard_employees(status, full_name);
create index dashboard_employees_experience on public.dashboard_employees(experience_end_date) where status = 'active';

create table public.dashboard_payroll_periods (
  id uuid primary key default gen_random_uuid(),
  reference_month date not null unique check (reference_month = date_trunc('month', reference_month)::date),
  status text not null default 'draft' check (status in ('draft','review','completed','archived')),
  notes text not null default '' check (length(notes) <= 2000),
  version integer not null default 1 check (version > 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index dashboard_payroll_periods_reference on public.dashboard_payroll_periods(reference_month desc);

create table public.dashboard_payroll_entries (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references public.dashboard_payroll_periods(id) on delete restrict,
  employee_id uuid not null references public.dashboard_employees(id) on delete restrict,
  source text not null check (source in ('timecard','payslip','payment')),
  night_hours numeric(9,2) not null default 0 check (night_hours >= 0),
  overtime_50_hours numeric(9,2) not null default 0 check (overtime_50_hours >= 0),
  overtime_100_hours numeric(9,2) not null default 0 check (overtime_100_hours >= 0),
  absence_hours numeric(9,2) not null default 0 check (absence_hours >= 0),
  medical_certificate_hours numeric(9,2) not null default 0 check (medical_certificate_hours >= 0),
  net_amount numeric(12,2) check (net_amount is null or net_amount >= 0),
  source_row integer check (source_row is null or source_row > 0),
  version integer not null default 1 check (version > 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(period_id, employee_id, source)
);
create index dashboard_payroll_entries_period on public.dashboard_payroll_entries(period_id, employee_id);

create table public.dashboard_payroll_documents (
  id uuid primary key default gen_random_uuid(),
  period_id uuid references public.dashboard_payroll_periods(id) on delete restrict,
  kind text not null check (kind in ('timecard','payslip','payment','termination')),
  storage_path text not null unique check (length(storage_path) <= 400),
  original_name text not null check (length(original_name) between 1 and 180),
  mime_type text not null check (length(mime_type) <= 120),
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 10485760),
  processing_status text not null check (processing_status in ('processed','review_required','failed')),
  row_count integer not null default 0 check (row_count >= 0),
  processing_note text not null default '' check (length(processing_note) <= 1000),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create index dashboard_payroll_documents_period on public.dashboard_payroll_documents(period_id, created_at desc);

create table public.dashboard_terminations (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.dashboard_employees(id) on delete restrict,
  termination_date date not null,
  last_workday date not null,
  status text not null default 'draft' check (status in ('draft','review','ready','paid','archived')),
  notice_type text not null default 'not_informed' check (notice_type in ('worked','indemnified','waived','not_informed')),
  gross_amount numeric(12,2) check (gross_amount is null or gross_amount >= 0),
  deduction_amount numeric(12,2) check (deduction_amount is null or deduction_amount >= 0),
  expected_net_amount numeric(12,2) check (expected_net_amount is null or expected_net_amount >= 0),
  paid_amount numeric(12,2) check (paid_amount is null or paid_amount >= 0),
  paid_on date,
  notes text not null default '' check (length(notes) <= 3000),
  version integer not null default 1 check (version > 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint termination_dates_order check (last_workday <= termination_date),
  constraint paid_termination_fields check (status <> 'paid' or (paid_on is not null and paid_amount is not null))
);
create index dashboard_terminations_employee on public.dashboard_terminations(employee_id, termination_date desc);
create index dashboard_terminations_status on public.dashboard_terminations(status, termination_date desc);

create trigger dashboard_employees_update before update on public.dashboard_employees for each row execute function public.private_dashboard_update();
create trigger dashboard_payroll_periods_update before update on public.dashboard_payroll_periods for each row execute function public.private_dashboard_update();
create trigger dashboard_payroll_entries_update before update on public.dashboard_payroll_entries for each row execute function public.private_dashboard_update();
create trigger dashboard_terminations_update before update on public.dashboard_terminations for each row execute function public.private_dashboard_update();

alter table public.dashboard_employees enable row level security;
alter table public.dashboard_payroll_periods enable row level security;
alter table public.dashboard_payroll_entries enable row level security;
alter table public.dashboard_payroll_documents enable row level security;
alter table public.dashboard_terminations enable row level security;
revoke all on public.dashboard_employees, public.dashboard_payroll_periods, public.dashboard_payroll_entries, public.dashboard_payroll_documents, public.dashboard_terminations from anon, authenticated;
grant select, insert, update on public.dashboard_employees, public.dashboard_payroll_periods, public.dashboard_payroll_entries, public.dashboard_payroll_documents, public.dashboard_terminations to authenticated;

create policy payroll_employees_read on public.dashboard_employees for select to authenticated using ((select private_dashboard.current_role()) = 'owner');
create policy payroll_employees_create on public.dashboard_employees for insert to authenticated with check ((select private_dashboard.current_role()) = 'owner' and created_by = (select auth.uid()));
create policy payroll_employees_edit on public.dashboard_employees for update to authenticated using ((select private_dashboard.current_role()) = 'owner') with check ((select private_dashboard.current_role()) = 'owner');
create policy payroll_periods_read on public.dashboard_payroll_periods for select to authenticated using ((select private_dashboard.current_role()) = 'owner');
create policy payroll_periods_create on public.dashboard_payroll_periods for insert to authenticated with check ((select private_dashboard.current_role()) = 'owner' and created_by = (select auth.uid()));
create policy payroll_periods_edit on public.dashboard_payroll_periods for update to authenticated using ((select private_dashboard.current_role()) = 'owner') with check ((select private_dashboard.current_role()) = 'owner');
create policy payroll_entries_read on public.dashboard_payroll_entries for select to authenticated using ((select private_dashboard.current_role()) = 'owner');
create policy payroll_entries_create on public.dashboard_payroll_entries for insert to authenticated with check ((select private_dashboard.current_role()) = 'owner' and created_by = (select auth.uid()));
create policy payroll_entries_edit on public.dashboard_payroll_entries for update to authenticated using ((select private_dashboard.current_role()) = 'owner') with check ((select private_dashboard.current_role()) = 'owner');
create policy payroll_documents_read on public.dashboard_payroll_documents for select to authenticated using ((select private_dashboard.current_role()) = 'owner');
create policy payroll_documents_create on public.dashboard_payroll_documents for insert to authenticated with check ((select private_dashboard.current_role()) = 'owner' and created_by = (select auth.uid()));
create policy payroll_terminations_read on public.dashboard_terminations for select to authenticated using ((select private_dashboard.current_role()) = 'owner');
create policy payroll_terminations_create on public.dashboard_terminations for insert to authenticated with check ((select private_dashboard.current_role()) = 'owner' and created_by = (select auth.uid()));
create policy payroll_terminations_edit on public.dashboard_terminations for update to authenticated using ((select private_dashboard.current_role()) = 'owner') with check ((select private_dashboard.current_role()) = 'owner');

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('payroll-documents','payroll-documents',false,10485760,array['text/csv','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/pdf']);
create policy payroll_documents_storage_read on storage.objects for select to authenticated
using (bucket_id = 'payroll-documents' and (select private_dashboard.current_role()) = 'owner');
create policy payroll_documents_storage_insert on storage.objects for insert to authenticated
with check (bucket_id = 'payroll-documents' and (select private_dashboard.current_role()) = 'owner' and (storage.foldername(name))[1] = (select auth.uid())::text);

commit;
