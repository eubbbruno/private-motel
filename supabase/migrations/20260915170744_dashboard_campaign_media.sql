begin;
alter table public.dashboard_campaigns
  add column image_path text not null default '' check (length(image_path) <= 100),
  add column image_alt text not null default '' check (length(image_alt) <= 200),
  add column popup_title text not null default '' check (length(popup_title) <= 100),
  add column popup_text text not null default '' check (length(popup_text) <= 500),
  add column cta_label text not null default '' check (length(cta_label) <= 50),
  add column cta_url text not null default '' check (length(cta_url) <= 500),
  add column starts_at timestamptz,
  add column ends_at timestamptz,
  add column priority integer not null default 0 check (priority between 0 and 100),
  add constraint campaign_dates check (ends_at is null or starts_at is null or ends_at > starts_at),
  add constraint campaign_button check ((cta_label = '') = (cta_url = '')),
  add constraint campaign_url check (cta_url = '' or cta_url ~ '^https://[^[:space:]\\]+$' or (cta_url ~ '^/[A-Za-z0-9/?#&=%._~+\-]*$' and cta_url not like '//%')),
  add constraint campaign_published_fields check (status <> 'published' or (image_path <> '' and image_alt <> '' and popup_title <> '' and starts_at is not null and ends_at is not null));
create index dashboard_campaigns_active on public.dashboard_campaigns(priority desc, starts_at desc) where status = 'published';

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('campaign-art','campaign-art',false,6291456,array['image/webp']);
create policy campaign_art_staff_read on storage.objects for select to authenticated
using (bucket_id = 'campaign-art' and (select private_dashboard.current_role()) in ('owner','editor'));
create policy campaign_art_staff_insert on storage.objects for insert to authenticated
with check (bucket_id = 'campaign-art' and (select private_dashboard.current_role()) in ('owner','editor') and (storage.foldername(name))[1] = (select auth.uid())::text and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.webp$');

-- Only the actual public popup fields are readable without authentication.
grant select (id,version,image_path,image_alt,popup_title,popup_text,cta_label,cta_url,starts_at,ends_at,priority,status) on public.dashboard_campaigns to anon;
create policy campaigns_public_active on public.dashboard_campaigns for select to anon
using (status = 'published' and starts_at <= now() and ends_at > now());
create policy campaign_art_public_active on storage.objects for select to anon
using (bucket_id = 'campaign-art' and exists (
  select 1 from public.dashboard_campaigns c where c.image_path = name and c.status = 'published' and c.starts_at <= now() and c.ends_at > now()
));

create function private_dashboard.validate_campaign_art() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.status = 'published' and not exists (select 1 from storage.objects where bucket_id='campaign-art' and name=new.image_path) then
    raise exception 'Upload the campaign artwork before publishing.';
  end if;
  return new;
end;
$$;
create trigger dashboard_campaign_art before insert or update on public.dashboard_campaigns for each row execute function private_dashboard.validate_campaign_art();
commit;
