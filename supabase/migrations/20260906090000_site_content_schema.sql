-- =============================================================================
-- العقل الكبير — مخطط المحتوى القابل للتحرير من لوحة التحكم
-- كل نص ورقم ورابط في الموقع العام مصدره هذه الجداول، لا الكود.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- الملفات الشخصية والصلاحيات
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  role       text not null default 'viewer' check (role in ('viewer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'ملف المستخدم وصلاحيته. الدور لا يُعدَّل إلا عبر خدمة الأدمن.';

-- دالة فحص الصلاحية: SECURITY DEFINER لتفادي التكرار اللانهائي في سياسات RLS
create or replace function public.is_admin()
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

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- إنشاء ملف تلقائي عند تسجيل مستخدم جديد (بدور viewer دائماً)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- منع رفع الصلاحية الذاتي: أي تعديل على role عبر واجهة المستخدم يُرفض
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- auth.uid() فارغة يعني نداءً من SQL Editor أو service_role — مسار موثوق
  -- يُستخدم لترقية أول أدمن. أما نداء مستخدم عادي فيُمنع من ترقية نفسه.
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'تغيير الدور غير مسموح عبر هذا المسار';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- -----------------------------------------------------------------------------
-- إعدادات الموقع — صف واحد فقط (singleton)
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id                smallint primary key default 1 check (id = 1),

  -- الهوية
  brand_name        text not null default 'العقل الكبير',
  brand_tagline     text not null default '',
  hero_title        text not null default '',
  hero_subtitle     text not null default '',

  -- التواصل
  contact_email     text,
  whatsapp_number   text,   -- أرقام فقط بصيغة دولية بدون + مثل 249927020223
  whatsapp_message  text,

  -- روابط السوشيال ميديا
  facebook_url      text,
  facebook_label    text default 'العقل الكبير على فيسبوك',
  youtube_url       text,
  youtube_label     text default 'العقل الكبير على يوتيوب',
  tiktok_url        text,
  tiktok_label      text default 'العقل الكبير على تيك توك',

  -- ملف الشراكة والرعاية (قابل للاستبدال من اللوحة)
  deck_path         text,   -- مسار الكائن داخل bucket: sponsorship
  deck_filename     text,
  deck_size_bytes   bigint,
  deck_updated_at   timestamptz,

  updated_at        timestamptz not null default now(),
  updated_by        uuid references auth.users (id) on delete set null,

  constraint whatsapp_number_digits
    check (whatsapp_number is null or whatsapp_number ~ '^[0-9]{8,15}$'),
  constraint contact_email_shape
    check (contact_email is null or contact_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint facebook_url_https
    check (facebook_url is null or facebook_url ~ '^https://'),
  constraint youtube_url_https
    check (youtube_url is null or youtube_url ~ '^https://'),
  constraint tiktok_url_https
    check (tiktok_url is null or tiktok_url ~ '^https://')
);

comment on column public.site_settings.whatsapp_number is 'رقم واتساب بصيغة دولية بدون علامة + أو مسافات';
comment on column public.site_settings.deck_path is 'مسار ملف الرعاية داخل bucket التخزين sponsorship';

-- -----------------------------------------------------------------------------
-- الأرقام والإحصاءات — كلها ديناميكية
-- -----------------------------------------------------------------------------
create table if not exists public.site_stats (
  id          uuid primary key default gen_random_uuid(),
  group_key   text not null check (group_key in ('platform', 'engagement', 'highlight', 'audience')),
  stat_key    text not null,
  label       text not null,
  value       text not null,   -- نص لأن القيم معروضة بصيغ مختلفة: 51K، 793,000، +25
  note        text,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now(),
  unique (group_key, stat_key)
);

comment on table public.site_stats is 'أرقام المتابعين والمشاهدات والتفاعل — يحدّثها صاحب القناة من لوحة التحكم';

-- -----------------------------------------------------------------------------
-- الكتل النصية المتكررة (لماذا تختارنا / كيف نسعّر / عن القناة)
-- -----------------------------------------------------------------------------
create table if not exists public.content_blocks (
  id          uuid primary key default gen_random_uuid(),
  section_key text not null check (section_key in ('about', 'why', 'pricing', 'audience')),
  block_key   text not null,
  title       text,
  body        text,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now(),
  unique (section_key, block_key)
);

-- -----------------------------------------------------------------------------
-- باقات الرعاية
-- -----------------------------------------------------------------------------
create table if not exists public.sponsorship_packages (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  tagline     text,
  features    text[] not null default '{}',
  price_note  text,
  is_featured boolean not null default false,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- تحديث updated_at تلقائياً
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['profiles', 'site_settings', 'site_stats', 'content_blocks', 'sponsorship_packages']
  loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format(
      'create trigger touch_%1$s before update on public.%1$s
       for each row execute function public.touch_updated_at()', t);
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- RLS — قراءة عامة للمحتوى المنشور، وكتابة للأدمن فقط
-- -----------------------------------------------------------------------------
alter table public.profiles             enable row level security;
alter table public.site_settings        enable row level security;
alter table public.site_stats           enable row level security;
alter table public.content_blocks       enable row level security;
alter table public.sponsorship_packages enable row level security;

-- profiles
drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- site_settings: صف واحد مقروء للجميع
drop policy if exists site_settings_read on public.site_settings;
create policy site_settings_read on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists site_settings_write on public.site_settings;
create policy site_settings_write on public.site_settings
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- الجداول المتكررة: المرئي فقط للزوار، والكل للأدمن
drop policy if exists site_stats_read on public.site_stats;
create policy site_stats_read on public.site_stats
  for select to anon, authenticated
  using (is_visible or public.is_admin());

drop policy if exists site_stats_write on public.site_stats;
create policy site_stats_write on public.site_stats
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists content_blocks_read on public.content_blocks;
create policy content_blocks_read on public.content_blocks
  for select to anon, authenticated
  using (is_visible or public.is_admin());

drop policy if exists content_blocks_write on public.content_blocks;
create policy content_blocks_write on public.content_blocks
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists packages_read on public.sponsorship_packages;
create policy packages_read on public.sponsorship_packages
  for select to anon, authenticated
  using (is_visible or public.is_admin());

drop policy if exists packages_write on public.sponsorship_packages;
create policy packages_write on public.sponsorship_packages
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- التخزين — ملف الرعاية القابل للاستبدال
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sponsorship', 'sponsorship', true, 26214400, array['application/pdf'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists sponsorship_public_read on storage.objects;
create policy sponsorship_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'sponsorship');

drop policy if exists sponsorship_admin_write on storage.objects;
create policy sponsorship_admin_write on storage.objects
  for all to authenticated
  using (bucket_id = 'sponsorship' and public.is_admin())
  with check (bucket_id = 'sponsorship' and public.is_admin());
