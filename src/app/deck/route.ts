import { getSettings } from '@/lib/content'
import { createClient } from '@/lib/supabase/server'

/**
 * تمرير ملف الشراكة والرعاية عبر نطاق الموقع بدل توجيه الزائر إلى Supabase.
 *
 * الملف يُجلب هنا على الخادم بمفتاح publishable العام نفسه الذي يستخدمه الموقع —
 * لا service_role ولا أي سر يصل المتصفح. سياسات Storage و RLS تبقى كما هي:
 * القراءة مسموحة للزائر أصلاً، وهذا المسار يقرأ بنفس الصلاحية لا بأكثر منها.
 */
export const dynamic = 'force-dynamic'

const BUCKET = 'sponsorship'

/** اسم ملف صالح لترويسة Content-Disposition بشقّيها: ASCII للتوافق، وUTF-8 للعربية. */
function contentDisposition(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '')
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`
}

export async function GET() {
  const settings = await getSettings()

  if (!settings.deck_path) {
    return new Response('لا يوجد ملف رعاية منشور حالياً.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  const supabase = await createClient()
  const { data, error } = await supabase.storage.from(BUCKET).download(settings.deck_path)

  if (error || !data) {
    console.error('[deck] تعذّر جلب ملف الرعاية:', error?.message)
    return new Response('تعذّر جلب ملف الرعاية حالياً.', {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  return new Response(data.stream(), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(data.size),
      'Content-Disposition': contentDisposition(settings.deck_filename ?? 'sponsorship.pdf'),
      // بلا كاش: استبدال الملف من اللوحة يجب أن يظهر فوراً لكل زائر
      'Cache-Control': 'no-store, must-revalidate',
    },
  })
}
