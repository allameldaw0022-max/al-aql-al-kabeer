export type StatGroup = 'platform' | 'engagement' | 'highlight' | 'audience'
export type SectionKey = 'about' | 'why' | 'pricing' | 'audience'

export interface SiteSettings {
  id: number
  brand_name: string
  brand_tagline: string
  hero_title: string
  hero_subtitle: string
  contact_email: string | null
  whatsapp_number: string | null
  whatsapp_message: string | null
  facebook_url: string | null
  facebook_label: string | null
  youtube_url: string | null
  youtube_label: string | null
  tiktok_url: string | null
  tiktok_label: string | null
  deck_path: string | null
  deck_filename: string | null
  deck_size_bytes: number | null
  deck_updated_at: string | null
  updated_at: string
}

export interface SiteStat {
  id: string
  group_key: StatGroup
  stat_key: string
  label: string
  value: string
  note: string | null
  sort_order: number
  is_visible: boolean
}

export interface ContentBlock {
  id: string
  section_key: SectionKey
  block_key: string
  title: string | null
  body: string | null
  sort_order: number
  is_visible: boolean
}

export interface SponsorshipPackage {
  id: string
  slug: string
  name: string
  tagline: string | null
  features: string[]
  price_note: string | null
  is_featured: boolean
  sort_order: number
  is_visible: boolean
}

export interface SocialLink {
  platform: 'facebook' | 'youtube' | 'tiktok'
  label: string
  url: string
}
