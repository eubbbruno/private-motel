begin;
create policy payroll_documents_storage_delete on storage.objects for delete to authenticated
using (bucket_id = 'payroll-documents' and (select private_dashboard.current_role()) = 'owner' and (storage.foldername(name))[1] = (select auth.uid())::text);
commit;
