/**
 * قراءة متغيرات البيئة في مكان واحد مع رسالة خطأ واضحة.
 * لا تُكتب أي مفاتيح داخل الكود — كلها Environment Variables.
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `متغير البيئة ${name} غير مضبوط. راجع ملف .env.example وأضفه إلى .env.local أو إعدادات Vercel.`,
    )
  }
  return value
}

export function supabaseUrl(): string {
  return required('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
}

export function supabaseAnonKey(): string {
  return required(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'
}
