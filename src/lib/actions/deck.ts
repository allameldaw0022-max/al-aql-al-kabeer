'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { done, fail, type ActionState } from './shared'

const MAX_BYTES = 25 * 1024 * 1024 // 25MB — مطابق لحد bucket في الهجرة
const BUCKET = 'sponsorship'

/** اسم ملف آمن: بلا مسارات ولا محارف غريبة. */
function safeName(original: string): string {
  const base = original.split(/[\\/]/).pop() ?? 'deck.pdf'
  const cleaned = base.replace(/[^\p{L}\p{N}._-]+/gu, '-').slice(0, 120)
  return cleaned.toLowerCase().endsWith('.pdf') ? cleaned : `${cleaned}.pdf`
}

/**
 * استبدال ملف الشراكة والرعاية.
 * يُرفع باسم جديد ثم يُحدَّث الصف الوحيد في site_settings، ثم يُحذف الملف القديم —
 * بهذا الترتيب حتى لا يبقى الموقع بلا ملف إذا فشلت أي خطوة.
 */
export async function uploadDeckAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin()

  const file = form.get('deck')
  if (!(file instanceof File) || file.size === 0) {
    return fail('اختر ملف PDF أولاً')
  }
  if (file.type !== 'application/pdf') {
    return fail('الملف يجب أن يكون بصيغة PDF')
  }
  if (file.size > MAX_BYTES) {
    return fail('حجم الملف يتجاوز ٢٥ ميجابايت')
  }

  const supabase = await createClient()

  const { data: current } = await supabase
    .from('site_settings')
    .select('deck_path')
    .eq('id', 1)
    .maybeSingle<{ deck_path: string | null }>()

  const filename = safeName(file.name)
  const objectPath = `${Date.now()}-${filename}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, file, { contentType: 'application/pdf', upsert: false })

  if (uploadError) return fail(`تعذّر رفع الملف: ${uploadError.message}`)

  const { error: updateError } = await supabase
    .from('site_settings')
    .update({
      deck_path: objectPath,
      deck_filename: filename,
      deck_size_bytes: file.size,
      deck_updated_at: new Date().toISOString(),
      updated_by: admin.id,
    })
    .eq('id', 1)

  if (updateError) {
    // تراجع: نظّف الملف المرفوع حتى لا يبقى يتيماً في التخزين
    await supabase.storage.from(BUCKET).remove([objectPath])
    return fail(`تعذّر حفظ بيانات الملف: ${updateError.message}`)
  }

  if (current?.deck_path && current.deck_path !== objectPath) {
    await supabase.storage.from(BUCKET).remove([current.deck_path])
  }

  revalidatePath('/')
  revalidatePath('/admin/deck')
  return done('تم استبدال ملف الرعاية')
}

/** إزالة الملف الحالي من الموقع ومن التخزين. */
export async function removeDeckAction(
  _prev: ActionState,
  _form: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin()
  const supabase = await createClient()

  const { data: current } = await supabase
    .from('site_settings')
    .select('deck_path')
    .eq('id', 1)
    .maybeSingle<{ deck_path: string | null }>()

  if (!current?.deck_path) return fail('لا يوجد ملف حالياً')

  const { error } = await supabase
    .from('site_settings')
    .update({
      deck_path: null,
      deck_filename: null,
      deck_size_bytes: null,
      deck_updated_at: null,
      updated_by: admin.id,
    })
    .eq('id', 1)

  if (error) return fail(`تعذّر الحذف: ${error.message}`)

  await supabase.storage.from(BUCKET).remove([current.deck_path])

  revalidatePath('/')
  revalidatePath('/admin/deck')
  return done('تمت إزالة ملف الرعاية')
}
