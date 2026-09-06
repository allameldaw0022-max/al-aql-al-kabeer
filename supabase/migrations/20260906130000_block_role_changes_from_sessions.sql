-- =============================================================================
-- العقل الكبير — منع تغيير الدور من أي جلسة مستخدم
--
-- الصيغة السابقة في 20260906090000 كانت:
--     if new.role is distinct from old.role
--        and auth.uid() is not null
--        and not private.is_admin() then raise ...
--
-- أي أنها سمحت للأدمن بتغيير الأدوار، بنيّة أن يرقّي مستخدمين آخرين.
-- لكن التطبيق لا يوفّر أي واجهة لإدارة الأدوار، والنتيجة العملية أن الأدمن
-- كان يستطيع خفض نفسه إلى viewer بطلب REST مباشر ويفقد الوصول للوحة نهائياً
-- دون أي وسيلة لاستعادته من داخل الموقع. كشف ذلك اختبار على الحساب الحقيقي.
--
-- القاعدة الآن: أي تغيير للدور من جلسة مستخدم مرفوض — للأدمن وغيره.
-- إدارة الأدوار تتم من SQL Editor أو service_role فقط، حيث auth.uid() فارغة.
-- =============================================================================

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null then
    raise exception 'تغيير الدور غير مسموح عبر هذا المسار';
  end if;
  return new;
end;
$$;
