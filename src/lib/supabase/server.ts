import 'server-only'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseAnonKey, supabaseUrl } from '@/lib/env'

/**
 * عميل Supabase لمكوّنات الخادم و Server Actions.
 * في Next.js 16 دالة cookies() غير متزامنة — لذلك الدالة async.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // الكتابة على الكوكيز غير متاحة داخل مكوّن خادم للقراءة فقط —
          // يتولى proxy.ts تحديث الجلسة في هذه الحالة.
        }
      },
    },
  })
}
