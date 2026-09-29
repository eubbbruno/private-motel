begin;
alter table public.dashboard_posts
  add column media_path text not null default '' check (length(media_path) <= 240),
  add column media_alt text not null default '' check (length(media_alt) <= 200),
  add column generation_prompt text not null default '' check (length(generation_prompt) <= 2000),
  add constraint dashboard_posts_media_alt check (media_path = '' or media_alt <> '');

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('social-media','social-media',false,6291456,array['image/webp']);
create policy social_media_staff_read on storage.objects for select to authenticated
using (bucket_id = 'social-media' and (select private_dashboard.current_role()) in ('owner','editor'));
create policy social_media_staff_insert on storage.objects for insert to authenticated
with check (bucket_id = 'social-media' and (select private_dashboard.current_role()) in ('owner','editor') and (storage.foldername(name))[1] = (select auth.uid())::text and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.webp$');
commit;
