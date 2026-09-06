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

/** حفظ كل الأرقام دفعة واحدة — تحديث للصفوف الموجودة، بلا صفوف مكررة. */
export async function saveStatsAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireAdmin()

  const ids = form.getAll('stat_id').map(String)
  if (ids.length === 0) return fail('لا توجد أرقام للحفظ')

  const supabase = await createClient()

  for (const id of ids) {
    const value = text(form, `value__${id}`, 60)
    if (value.length === 0) {
      return fail('قيمة كل رقم مطلوبة — استخدم خيار الإخفاء بدل تركها فارغة')
    }

    const { error } = await supabase
      .from('site_stats')
      .update({
        label: text(form, `label__${id}`, 160),
        value,
        note: optionalText(form, `note__${id}`, 400),
        sort_order: optionalInt(form, `sort_order__${id}`),
        is_visible: checkbox(form, `is_visible__${id}`),
      })
      .eq('id', id)

    if (error) return fail(`تعذّر حفظ أحد الأرقام: ${error.message}`)
  }

  revalidatePath('/')
  revalidatePath('/admin/stats')
  return done('تم تحديث الأرقام')
}

export async function addStatAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireAdmin()

  const groupKey = text(form, 'group_key', 20)
  const statKey = text(form, 'stat_key', 60).toLowerCase().replace(/[^a-z0-9_]/g, '_')
  const label = text(form, 'label', 160)
  const value = text(form, 'value', 60)

  if (!['platform', 'engagement', 'highlight', 'audience'].includes(groupKey)) {
    return fail('المجموعة غير صحيحة')
  }
  if (statKey.length === 0) return fail('المعرّف مطلوب (حروف إنجليزية وأرقام)')
  if (label.length === 0) return fail('العنوان مطلوب')
  if (value.length === 0) return fail('القيمة مطلوبة')

  const supabase = await createClient()
  const { error } = await supabase.from('site_stats').insert({
    group_key: groupKey,
    stat_key: statKey,
    label,
    value,
    note: optionalText(form, 'note', 400),
    sort_order: optionalInt(form, 'sort_order'),
  })

  if (error) {
    if (error.code === '23505') return fail('يوجد رقم بنفس المعرّف داخل هذه المجموعة')
    return fail(`تعذّر الإضافة: ${error.message}`)
  }

  revalidatePath('/')
  revalidatePath('/admin/stats')
  return done('تمت إضافة الرقم')
}

export async function deleteStatAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireAdmin()

  const id = text(form, 'stat_id', 64)
  if (id.length === 0) return fail('معرّف الرقم مفقود')

  const supabase = await createClient()
  const { error } = await supabase.from('site_stats').delete().eq('id', id)
  if (error) return fail(`تعذّر الحذف: ${error.message}`)

  revalidatePath('/')
  revalidatePath('/admin/stats')
  return done('تم حذف الرقم')
}
