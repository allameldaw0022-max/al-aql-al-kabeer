import { deckUrl, getSettings } from '@/lib/content'
import { PageHeading, Panel } from '@/components/admin/panel'
import { RemoveDeckForm, UploadDeckForm } from '@/components/admin/deck-forms'
import { DownloadIcon } from '@/components/ui/icons'

function formatSize(bytes: number | null): string {
  if (!bytes) return '—'
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} م.ب` : `${Math.round(bytes / 1024)} ك.ب`
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('ar', { dateStyle: 'long', timeStyle: 'short' }).format(
    new Date(iso),
  )
}

export default async function DeckPage() {
  const settings = await getSettings()
  const url = deckUrl(settings)

  return (
    <>
      <PageHeading
        title="ملف الشراكة والرعاية"
        lead="استبدل نسخة الـ PDF المعروضة على الموقع بنفسك في أي وقت."
      />

      <div className="space-y-6">
        <Panel title="الملف الحالي">
          {url ? (
            <div className="space-y-4">
              <dl className="grid gap-3 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold text-ink-400">اسم الملف</dt>
                  <dd className="mt-0.5 truncate text-sm font-semibold text-ink-900">
                    {settings.deck_filename}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-ink-400">الحجم</dt>
                  <dd className="numeral mt-0.5 text-sm font-semibold text-ink-900">
                    {formatSize(settings.deck_size_bytes)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-ink-400">آخر تحديث</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-ink-900">
                    {formatDate(settings.deck_updated_at)}
                  </dd>
                </div>
              </dl>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-200 transition hover:bg-sky-100"
              >
                <DownloadIcon className="h-4 w-4" />
                معاينة الملف الحالي
              </a>

              <div className="border-t border-hairline pt-4">
                <RemoveDeckForm />
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-600">
              لا يوجد ملف مرفوع حالياً — زر التحميل لا يظهر في الموقع حتى ترفع نسخة.
            </p>
          )}
        </Panel>

        <Panel title="رفع نسخة جديدة">
          <UploadDeckForm />
        </Panel>
      </div>
    </>
  )
}
