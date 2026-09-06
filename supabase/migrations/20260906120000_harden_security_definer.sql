-- =============================================================================
-- العقل الكبير — تشديد أمني بناءً على تقرير Supabase Security Advisor
--
-- ثلاث ملاحظات عولجت:
--   ١) is_admin() كانت في schema public فصارت مكشوفة كنقطة RPC عامة
--      (/rest/v1/rpc/is_admin). نُقلت إلى schema خاصة غير معروضة عبر PostgREST،
--      مع إبقاء صلاحية التنفيذ لـ anon و authenticated لأن سياسات RLS تستدعيها
--      بصلاحية الدور المُنادي.
--   ٢) دالتا التريغر handle_new_user و protect_profile_role كانتا قابلتين
--      للاستدعاء عبر RPC. سُحبت صلاحية التنفيذ منهما.
--   ٣) touch_updated_at بلا search_path ثابت.
-- =============================================================================

create schema if not exists private;
grant usage on schema private to anon, authenticated;

-- ١) نقل دالة فحص الصلاحية خارج المسار المعروض
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- إعادة بناء كل السياسات على الدالة الجديدة
drop policy if exists profiles_select_self  on public.profiles;
create policy profiles_select_self on public.profiles
  for select to authenticated
  using (id = auth.uid() or private.is_admin());

drop policy if exists site_settings_write on public.site_settings;
create policy site_settings_write on public.site_settings
  for update to authenticated
  using (private.is_admin()) with check (private.is_admin());

drop policy if exists site_stats_read on public.site_stats;
create policy site_stats_read on public.site_stats
  for select to anon, authenticated
  using (is_visible or private.is_admin());

drop policy if exists site_stats_write on public.site_stats;
create policy site_stats_write on public.site_stats
  for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

drop policy if exists content_blocks_read on public.content_blocks;
create policy content_blocks_read on public.content_blocks
  for select to anon, authenticated
  using (is_visible or private.is_admin());

drop policy if exists content_blocks_write on public.content_blocks;
create policy content_blocks_write on public.content_blocks
  for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

drop policy if exists packages_read on public.sponsorship_packages;
create policy packages_read on public.sponsorship_packages
  for select to anon, authenticated
  using (is_visible or private.is_admin());

drop policy if exists packages_write on public.sponsorship_packages;
create policy packages_write on public.sponsorship_packages
  for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

drop policy if exists sponsorship_admin_write on storage.objects;
create policy sponsorship_admin_write on storage.objects
  for all to authenticated
  using (bucket_id = 'sponsorship' and private.is_admin())
  with check (bucket_id = 'sponsorship' and private.is_admin());

-- تريغر حماية الدور يعتمد عليها أيضاً
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not private.is_admin() then
    raise exception 'تغيير الدور غير مسموح عبر هذا المسار';
  end if;
  return new;
end;
$$;

drop function if exists public.is_admin();

-- ٢) سحب صلاحية استدعاء دالتي التريغر عبر RPC
revoke all on function public.handle_new_user()      from public, anon, authenticated;
revoke all on function public.protect_profile_role() from public, anon, authenticated;

-- ٣) تثبيت search_path
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
