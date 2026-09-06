import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type {
  ContentBlock,
  SiteSettings,
  SiteStat,
  SocialLink,
  SponsorshipPackage,
  StatGroup,
} from '@/lib/types'

/** الإعدادات الافتراضية إذا لم تُطبَّق الهجرات بعد — تمنع سقوط الصفحة. */
const FALLBACK_SETTINGS: SiteSettings = {
  id: 1,
  brand_name: 'العقل الكبير',
  brand_tagline: 'محتوى علمي وثقافي مبسّط لجمهور عربي متنامٍ',
  hero_title: 'ملف الشراكة والرعاية',
  hero_subtitle: '',
  contact_email: null,
  whatsapp_number: null,
  whatsapp_message: null,
  facebook_url: null,
  facebook_label: 'العقل الكبير على فيسبوك',
  youtube_url: null,
  youtube_label: 'العقل الكبير على يوتيوب',
  tiktok_url: null,
  tiktok_label: 'العقل الكبير على تيك توك',
  deck_path: null,
  deck_filename: null,
  deck_size_bytes: null,
  deck_updated_at: null,
  updated_at: new Date(0).toISOString(),
}

export async function getSettings(): Promise<SiteSettings> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle<SiteSettings>()

  if (error) {
    console.error('[content] تعذّر جلب إعدادات الموقع:', error.message)
    return FALLBACK_SETTINGS
  }
  return data ?? FALLBACK_SETTINGS
}

export async function getStats(): Promise<Record<StatGroup, SiteStat[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_stats')
    .select('*')
    .order('sort_order', { ascending: true })

  const grouped: Record<StatGroup, SiteStat[]> = {
    platform: [],
    engagement: [],
    highlight: [],
    audience: [],
  }

  if (error) {
    console.error('[content] تعذّر جلب الأرقام:', error.message)
    return grouped
  }

  for (const stat of (data ?? []) as SiteStat[]) {
    grouped[stat.group_key]?.push(stat)
  }
  return grouped
}

export async function getBlocks(): Promise<Record<string, ContentBlock[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .order('sort_order', { ascending: true })

  const grouped: Record<string, ContentBlock[]> = {
    about: [],
    why: [],
    pricing: [],
    audience: [],
  }

  if (error) {
    console.error('[content] تعذّر جلب الكتل النصية:', error.message)
    return grouped
  }

  for (const block of (data ?? []) as ContentBlock[]) {
    grouped[block.section_key]?.push(block)
  }
  return grouped
}

export async function getPackages(): Promise<SponsorshipPackage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sponsorship_packages')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[content] تعذّر جلب الباقات:', error.message)
    return []
  }
  return (data ?? []) as SponsorshipPackage[]
}

/** الروابط الفعلية فقط — الفارغة لا تُعرض في الموقع. */
export function socialLinks(settings: SiteSettings): SocialLink[] {
  const candidates: SocialLink[] = [
    {
      platform: 'facebook',
      label: settings.facebook_label ?? 'فيسبوك',
      url: settings.facebook_url ?? '',
    },
    {
      platform: 'youtube',
      label: settings.youtube_label ?? 'يوتيوب',
      url: settings.youtube_url ?? '',
    },
    {
      platform: 'tiktok',
      label: settings.tiktok_label ?? 'تيك توك',
      url: settings.tiktok_url ?? '',
    },
  ]
  return candidates.filter((link) => link.url.trim().length > 0)
}

/** رابط واتساب جاهز مع رسالة مبدئية. */
export function whatsappHref(settings: SiteSettings): string | null {
  if (!settings.whatsapp_number) return null
  const text = settings.whatsapp_message?.trim()
  const query = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${settings.whatsapp_number}${query}`
}

/** رقم واتساب منسّق للعرض: 249 927 020 223 */
export function formatWhatsapp(number: string | null): string | null {
  if (!number) return null
  return `+${number.replace(/(\d{3})(?=\d)/g, '$1 ').trim()}`
}

/** الرابط العام لملف الرعاية داخل التخزين. */
export function deckUrl(settings: SiteSettings): string | null {
  if (!settings.deck_path) return null
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  if (!base) return null
  const version = settings.deck_updated_at
    ? `?v=${Date.parse(settings.deck_updated_at)}`
    : ''
  return `${base}/storage/v1/object/public/sponsorship/${settings.deck_path}${version}`
}
