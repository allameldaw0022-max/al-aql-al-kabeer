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
  type ActionState,
} from './shared'

/** حفظ كل النصوص دفعة واحدة عبر UPDATE على الصفوف القائمة. */
export async function saveBlocksAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireAdmin()

  const ids = form.getAll('block_id').map(String)
  if (ids.length === 0) return fail('لا توجد نصوص للحفظ')

  const supabase = await createClient()

  for (const id of ids) {
    const { error } = await supabase
      .from('content_blocks')
      .update({
        title: optionalText(form, `title__${id}`, 200),
        body: optionalText(form, `body__${id}`, 2000),
        sort_order: optionalInt(form, `sort_order__${id}`),
        is_visible: checkbox(form, `is_visible__${id}`),
      })
      .eq('id', id)

    if (error) return fail(`تعذّر حفظ أحد النصوص: ${error.message}`)
  }

  revalidatePath('/')
  revalidatePath('/admin/content')
  return done('تم تحديث النصوص')
}
