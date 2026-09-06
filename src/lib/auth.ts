import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export interface AdminUser {
  id: string
  email: string | null
  fullName: string | null
}

/**
 * يتحقق من الجلسة والدور معاً.
 * proxy.ts يمنع الوصول غير المصادق، وهذه الدالة هي الحاجز الفعلي للصلاحية
 * لأن التحقق من الدور يجب أن يتم على الخادم مقابل قاعدة البيانات.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/admin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .maybeSingle<{ role: string; full_name: string | null }>()

  if (profile?.role !== 'admin') {
    redirect('/login?error=forbidden')
  }

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile.full_name,
  }
}
