'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { fail, text, type ActionState } from './shared'

export async function signInAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const email = text(form, 'email', 200)
  const password = String(form.get('password') ?? '')
  const next = text(form, 'next', 200)

  if (email.length === 0 || password.length === 0) {
    return fail('البريد الإلكتروني وكلمة المرور مطلوبان')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return fail('بيانات الدخول غير صحيحة')

  revalidatePath('/', 'layout')
  redirect(next.startsWith('/admin') ? next : '/admin')
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
