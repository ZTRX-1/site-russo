
CREATE POLICY "Public read blog covers" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'blog-covers');

CREATE POLICY "Staff upload blog covers" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-covers' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff update blog covers" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-covers' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'blog-covers' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff delete blog covers" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'blog-covers' AND public.is_staff(auth.uid()));
