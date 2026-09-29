create policy social_media_staff_delete_own
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'social-media'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select private_dashboard.current_role()) in ('owner','editor')
);
