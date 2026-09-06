import Link from 'next/link'
import { getPackages, getSettings, getStats, socialLinks } from '@/lib/content'
import { PageHeading } from '@/components/admin/panel'

const CARDS = [
  {
    href: '/admin/settings',
    title: 'الهوية والتواصل والروابط',
    body: 'اسم العلامة، نص الواجهة، البريد، رقم الواتساب، وروابط فيسبوك ويوتيوب وتيك توك.',
  },
  {
    href: '/admin/stats',
    title: 'الأرقام',
    body: 'المتابعون، المشاهدات، عدد الحلقات، ومتوسط التفاعل — كلها قابلة للتحديث.',
  },
  {
    href: '/admin/content',
    title: 'النصوص',
    body: 'من نحن، الجمهور، لماذا تختارنا، وشرح طريقة التسعير.',
  },
  {
    href: '/admin/packages',
    title: 'الباقات',
    body: 'أسماء الباقات ومزاياها وترتيبها وأيها مميزة.',
  },
  {
    href: '/admin/deck',
    title: 'ملف الرعاية',
    body: 'ارفع نسخة PDF جديدة لتحل محل الحالية على الموقع فوراً.',
  },
]

export default async function AdminHomePage() {
  const [settings, stats, packages] = await Promise.all([
    getSettings(),
    getStats(),
    getPackages(),
  ])

  const links = socialLinks(settings)
  const statCount =
    stats.platform.length + stats.engagement.length + stats.highlight.length + stats.audience.length

  const missing: string[] = []
  if (links.length < 3) missing.push('روابط سوشيال ميديا ناقصة')
  if (!settings.whatsapp_number) missing.push('رقم الواتساب غير مضبوط')
  if (!settings.contact_email) missing.push('البريد الإلكتروني غير مضبوط')
  if (!settings.deck_path) missing.push('ملف الرعاية غير مرفوع')

  return (
    <>
      <PageHeading
        title="نظرة عامة"
        lead="كل محتوى الموقع العام مصدره هذه اللوحة — لا حاجة لتعديل الكود."
      />

      {missing.length > 0 ? (
        <div className="mb-6 rounded-card bg-gold-50 p-5 ring-1 ring-gold-200">
          <p className="text-sm font-bold text-gold-800">يحتاج إكمال:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gold-800">
            {missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Summary label="رقم منشور" value={statCount} />
        <Summary label="باقة رعاية" value={packages.length} />
        <Summary label="رابط سوشيال فعّال" value={links.length} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-card bg-white p-5 shadow-soft ring-1 ring-hairline transition hover:ring-gold-300"
          >
            <h2 className="font-bold text-ink-900">{card.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{card.body}</p>
          </Link>
        ))}
      </div>
    </>
  )
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card bg-white p-5 text-center shadow-soft ring-1 ring-hairline">
      <p className="numeral text-3xl font-extrabold text-gold-700">{value}</p>
      <p className="mt-1 text-sm text-ink-600">{label}</p>
    </div>
  )
}
