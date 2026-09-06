import type { SiteStat } from '@/lib/types'

export function Section({
  id,
  eyebrow,
  title,
  children,
  tone = 'white',
}: {
  id?: string
  eyebrow?: string
  title?: string
  children: React.ReactNode
  tone?: 'white' | 'surface' | 'sky'
}) {
  const background = {
    white: 'bg-canvas',
    surface: 'bg-surface',
    sky: 'bg-sky-50',
  }[tone]

  return (
    <section id={id} className={`${background} py-16 sm:py-24`}>
      <div className="mx-auto max-w-6xl px-6">
        {eyebrow ? (
          <p className="mb-2 text-sm font-bold tracking-wide text-gold-700">{eyebrow}</p>
        ) : null}
        {title ? (
          <h2 className="mb-10 text-3xl font-extrabold text-ink-900 sm:text-4xl">{title}</h2>
        ) : null}
        {children}
      </div>
    </section>
  )
}

/** بطاقة رقم — القيمة تُعرض بخانة numeral لضبط اتجاه الأرقام داخل RTL. */
export function StatCard({ stat, accent = 'gold' }: { stat: SiteStat; accent?: 'gold' | 'sky' }) {
  const valueColor = accent === 'gold' ? 'text-gold-700' : 'text-sky-700'

  return (
    <div className="rounded-card bg-white p-6 text-center shadow-soft ring-1 ring-hairline">
      <p className={`numeral text-4xl font-extrabold ${valueColor}`}>{stat.value}</p>
      <p className="mt-2 text-sm font-semibold text-ink-600">{stat.label}</p>
      {stat.note ? <p className="mt-2 text-xs text-ink-400">{stat.note}</p> : null}
    </div>
  )
}
