begin;
alter table public.dashboard_posts
  add column channel text not null default 'instagram' check (channel in ('instagram','facebook','both')),
  add column format text not null default 'feed' check (format in ('feed','story','reel','carousel')),
  add column planned_at timestamptz;
-- Existing owner/editor policies and no anonymous grants remain unchanged.
commit;
