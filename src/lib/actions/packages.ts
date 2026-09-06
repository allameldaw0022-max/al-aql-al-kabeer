'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import {
  checkbox,
  done,
  fail,
  optionalInt,
  optionalText,
  text,
  type ActionState,
} from './shared'

/** كل سطر في حقل المزايا يصبح عنصراً في المصفوفة. */
function parseFeatures(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, 30)
}

export async function savePackageAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireAdmin()

  const id = text(form, 'package_id', 64)
  const name = text(form, 'name', 120)
  if (id.length === 0) return fail('معرّف الباقة مفقود')
  if (name.length === 0) return fail('اسم الباقة مطلوب')

  const features = parseFeatures(text(form, 'features', 4000))
  if (features.length === 0) return fail('أضف ميزة واحدة على الأقل')

  const supabase = await createClient()
  const { error } = await supabase
    .from('sponsorship_packages')
    .update({
      name,
      tagline: optionalText(form, 'tagline', 300),
      features,
      price_note: optionalText(form, 'price_note', 300),
      is_featured: checkbox(form, 'is_featured'),
      sort_order: optionalInt(form, 'sort_order'),
      is_visible: checkbox(form, 'is_visible'),
    })
    .eq('id', id)

  if (error) return fail(`تعذّر الحفظ: ${error.message}`)

  revalidatePath('/')
  revalidatePath('/admin/packages')
  return done(`تم تحديث الباقة ${name}`)
}

export async function addPackageAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireAdmin()

  const slug = text(form, 'slug', 60).toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const name = text(form, 'name', 120)
  if (slug.length === 0) return fail('المعرّف مطلوب (حروف إنجليزية وأرقام وشرطات)')
  if (name.length === 0) return fail('اسم الباقة مطلوب')

  const features = parseFeatures(text(form, 'features', 4000))
  if (features.length === 0) return fail('أضف ميزة واحدة على الأقل')

  const supabase = await createClient()
  const { error } = await supabase.from('sponsorship_packages').insert({
    slug,
    name,
    tagline: optionalText(form, 'tagline', 300),
    features,
    price_note: optionalText(form, 'price_note', 300),
    sort_order: optionalInt(form, 'sort_order'),
  })

  if (error) {
    if (error.code === '23505') return fail('يوجد باقة بنفس المعرّف')
    return fail(`تعذّر الإضافة: ${error.message}`)
  }

  revalidatePath('/')
  revalidatePath('/admin/packages')
  return done('تمت إضافة الباقة')
}

export async function deletePackageAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireAdmin()

  const id = text(form, 'package_id', 64)
  if (id.length === 0) return fail('معرّف الباقة مفقود')

  const supabase = await createClient()
  const { error } = await supabase.from('sponsorship_packages').delete().eq('id', id)
  if (error) return fail(`تعذّر الحذف: ${error.message}`)

  revalidatePath('/')
  revalidatePath('/admin/packages')
  return done('تم حذف الباقة')
}
