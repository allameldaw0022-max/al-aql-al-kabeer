'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import {
  done,
  fail,
  normalizeWhatsapp,
  optionalHttpsUrl,
  optionalText,
  text,
  type ActionState,
} from './shared'

export async function updateBrandAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin()

  const brandName = text(form, 'brand_name', 120)
  if (brandName.length === 0) return fail('اسم العلامة مطلوب')

  const supabase = await createClient()
  const { error } = await supabase
    .from('site_settings')
    .update({
      brand_name: brandName,
      brand_tagline: text(form, 'brand_tagline', 300),
      hero_title: text(form, 'hero_title', 200),
      hero_subtitle: text(form, 'hero_subtitle', 600),
      updated_by: admin.id,
    })
    .eq('id', 1)

  if (error) return fail(`تعذّر الحفظ: ${error.message}`)

  revalidatePath('/')
  revalidatePath('/admin/settings')
  return done('تم تحديث بيانات العلامة')
}

export async function updateContactAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin()

  const email = optionalText(form, 'contact_email', 200)
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return fail('صيغة البريد الإلكتروني غير صحيحة')
  }

  const whatsapp = normalizeWhatsapp(text(form, 'whatsapp_number', 40))
  if (whatsapp === undefined) {
    return fail('رقم الواتساب يجب أن يكون من ٨ إلى ١٥ رقماً بصيغة دولية، مثال: 249927020223')
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('site_settings')
    .update({
      contact_email: email,
      whatsapp_number: whatsapp,
      whatsapp_message: optionalText(form, 'whatsapp_message', 500),
      updated_by: admin.id,
    })
    .eq('id', 1)

  if (error) return fail(`تعذّر الحفظ: ${error.message}`)

  revalidatePath('/')
  revalidatePath('/admin/settings')
  return done('تم تحديث بيانات التواصل')
}

export async function updateSocialAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin()

  const facebook = optionalHttpsUrl(form, 'facebook_url')
  const youtube = optionalHttpsUrl(form, 'youtube_url')
  const tiktok = optionalHttpsUrl(form, 'tiktok_url')

  if (facebook === undefined) return fail('رابط فيسبوك يجب أن يبدأ بـ https://')
  if (youtube === undefined) return fail('رابط يوتيوب يجب أن يبدأ بـ https://')
  if (tiktok === undefined) return fail('رابط تيك توك يجب أن يبدأ بـ https://')

  const supabase = await createClient()
  const { error } = await supabase
    .from('site_settings')
    .update({
      facebook_url: facebook,
      facebook_label: optionalText(form, 'facebook_label', 120),
      youtube_url: youtube,
      youtube_label: optionalText(form, 'youtube_label', 120),
      tiktok_url: tiktok,
      tiktok_label: optionalText(form, 'tiktok_label', 120),
      updated_by: admin.id,
    })
    .eq('id', 1)

  if (error) return fail(`تعذّر الحفظ: ${error.message}`)

  revalidatePath('/')
  revalidatePath('/admin/settings')
  return done('تم تحديث روابط السوشيال ميديا')
}
