import Image from 'next/image'
import {
  deckUrl,
  getBlocks,
  getPackages,
  getSettings,
  getStats,
  whatsappHref,
} from '@/lib/content'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { ContactBlock } from '@/components/site/contact'
import { Section, StatCard } from '@/components/site/sections'
import { CheckIcon, DownloadIcon } from '@/components/ui/icons'

/** الصفحة تُصيَّر عند الطلب حتى يظهر أي تعديل من لوحة التحكم فوراً. */
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [settings, stats, blocks, packages] = await Promise.all([
    getSettings(),
    getStats(),
    getBlocks(),
    getPackages(),
  ])

  const deck = deckUrl(settings)
  const whatsapp = whatsappHref(settings)
  const aboutIntro = blocks.about?.find((b) => b.block_key === 'intro')
  const aboutPoints = blocks.about?.filter((b) => b.block_key !== 'intro') ?? []
  const audience = blocks.audience?.[0]
  const highlight = stats.highlight?.[0]
  const pricingIntro = blocks.pricing?.find((b) => b.block_key === 'intro')
  const pricingOutro = blocks.pricing?.find((b) => b.block_key === 'outro')
  const pricingFactors =
    blocks.pricing?.filter((b) => b.block_key !== 'intro' && b.block_key !== 'outro') ?? []

  return (
    <>
      <SiteHeader settings={settings} />

      <main>
        {/* ---------------------------------------------------------- الواجهة */}
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-canvas">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center sm:py-28">
            <p className="mb-4 inline-block rounded-full bg-gold-100 px-4 py-1.5 text-sm font-bold text-gold-800">
              {settings.brand_tagline}
            </p>
            {/* الشعار يحمل اسم العلامة مرسوماً، فيقوم مقام النص بصرياً —
                و alt يبقي الاسم متاحاً للقارئ الآلي ولمحركات البحث. */}
            <h1 className="text-4xl font-extrabold leading-tight text-ink-900 sm:text-6xl">
              <Image
                src="/logo.webp"
                alt={settings.brand_name}
                width={414}
                height={351}
                priority
                className="mx-auto h-32 w-auto sm:h-44"
              />
              <span className="mt-5 block text-2xl font-bold text-gold-700 sm:text-3xl">
                {settings.hero_title}
              </span>
            </h1>
            {settings.hero_subtitle ? (
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
                {settings.hero_subtitle}
              </p>
            ) : null}

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#contact"
                className="rounded-lg bg-gold-500 px-7 py-3 text-base font-bold text-ink-900 shadow-soft transition hover:bg-gold-400"
              >
                ابدأ شراكة معنا
              </a>
              {deck ? (
                <a
                  href={deck}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-base font-bold text-sky-700 ring-1 ring-sky-200 transition hover:bg-sky-50"
                >
                  <DownloadIcon className="h-5 w-5" />
                  حمّل ملف الرعاية
                </a>
              ) : null}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- الأرقام */}
        {stats.platform.length > 0 ? (
          <Section id="numbers" eyebrow="الأرقام والإنجازات" title="نمو مستمر بلا توقف" tone="white">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.platform.map((stat) => (
                <StatCard key={stat.id} stat={stat} />
              ))}
            </div>
          </Section>
        ) : null}

        {/* --------------------------------------------------------- من نحن */}
        {aboutIntro || aboutPoints.length > 0 ? (
          <Section id="about" title={aboutIntro?.title ?? 'من نحن'} tone="surface">
            {aboutIntro?.body ? (
              <p className="max-w-3xl text-lg leading-relaxed text-ink-600">{aboutIntro.body}</p>
            ) : null}
            {aboutPoints.length > 0 ? (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {aboutPoints.map((point) => (
                  <li
                    key={point.id}
                    className="flex items-start gap-3 rounded-card bg-white p-4 shadow-soft ring-1 ring-hairline"
                  >
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                    <span className="text-sm leading-relaxed text-ink-700">{point.body}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Section>
        ) : null}

        {/* -------------------------------------------------- أبرز إنجاز */}
        {highlight ? (
          <Section tone="sky">
            <div className="rounded-card bg-white p-10 text-center shadow-lift ring-1 ring-sky-100">
              <p className="numeral text-5xl font-extrabold text-gold-700 sm:text-6xl">
                {highlight.value}
              </p>
              <p className="mt-3 text-base font-bold text-ink-900">{highlight.label}</p>
              {highlight.note ? (
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
                  {highlight.note}
                </p>
              ) : null}
            </div>
          </Section>
        ) : null}

        {/* -------------------------------------------------------- الجمهور */}
        {audience || stats.audience.length > 0 ? (
          <Section id="audience" title={audience?.title ?? 'جمهورنا'} tone="white">
            <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
              {stats.audience.map((stat) => (
                <div
                  key={stat.id}
                  className="rounded-card bg-sky-50 px-10 py-8 text-center ring-1 ring-sky-100"
                >
                  <p className="text-4xl font-extrabold text-sky-700">{stat.value}</p>
                  <p className="mt-2 text-sm font-semibold text-ink-600">{stat.label}</p>
                </div>
              ))}
              {audience?.body ? (
                <p className="text-lg leading-relaxed text-ink-600">{audience.body}</p>
              ) : null}
            </div>
          </Section>
        ) : null}

        {/* ------------------------------------------------ متوسط التفاعل */}
        {stats.engagement.length > 0 ? (
          <Section
            eyebrow="متوسط التفاعل لكل حلقة"
            title="أرقام تفاعل حقيقية وعضوية"
            tone="surface"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.engagement.map((stat) => (
                <StatCard key={stat.id} stat={stat} accent="sky" />
              ))}
            </div>
            <p className="mt-6 text-sm text-ink-400">
              بدون إعلانات مدفوعة لتضخيم الوصول.
            </p>
          </Section>
        ) : null}

        {/* --------------------------------------------------- لماذا نحن */}
        {blocks.why?.length > 0 ? (
          <Section id="why" title="لماذا تختار العقل الكبير كشريك؟" tone="white">
            <div className="grid gap-5 sm:grid-cols-2">
              {blocks.why.map((item) => (
                <div
                  key={item.id}
                  className="rounded-card bg-white p-6 shadow-soft ring-1 ring-hairline"
                >
                  <h3 className="text-lg font-bold text-gold-700">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-600">{item.body}</p>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {/* ---------------------------------------------------- الباقات */}
        {packages.length > 0 ? (
          <Section id="packages" title="باقات الرعاية" tone="surface">
            <div className="grid gap-6 lg:grid-cols-3">
              {packages.map((pkg) => (
                <article
                  key={pkg.id}
                  className={`flex flex-col rounded-card bg-white p-7 transition ${
                    pkg.is_featured
                      ? 'shadow-lift ring-2 ring-gold-500'
                      : 'shadow-soft ring-1 ring-hairline'
                  }`}
                >
                  {pkg.is_featured ? (
                    <span className="mb-3 self-start rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-ink-900">
                      الأكثر طلباً
                    </span>
                  ) : null}
                  <h3 className="text-2xl font-extrabold text-ink-900">{pkg.name}</h3>
                  {pkg.tagline ? (
                    <p className="mt-1.5 text-sm text-ink-600">{pkg.tagline}</p>
                  ) : null}

                  <ul className="mt-6 flex-1 space-y-3">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                        <span className="text-sm leading-relaxed text-ink-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {pkg.price_note ? (
                    <p className="mt-6 border-t border-hairline pt-4 text-xs text-ink-400">
                      {pkg.price_note}
                    </p>
                  ) : null}

                  {whatsapp ? (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-5 rounded-lg px-5 py-2.5 text-center text-sm font-bold transition ${
                        pkg.is_featured
                          ? 'bg-gold-500 text-ink-900 hover:bg-gold-400'
                          : 'bg-sky-50 text-sky-700 ring-1 ring-sky-200 hover:bg-sky-100'
                      }`}
                    >
                      اطلب هذه الباقة
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </Section>
        ) : null}

        {/* ---------------------------------------------------- التسعير */}
        {pricingIntro || pricingFactors.length > 0 ? (
          <Section id="pricing" title={pricingIntro?.title ?? 'كيف نُسعّر الرعاية؟'} tone="white">
            {pricingIntro?.body ? (
              <p className="max-w-3xl text-lg leading-relaxed text-ink-600">{pricingIntro.body}</p>
            ) : null}
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {pricingFactors.map((factor, index) => (
                <div key={factor.id} className="rounded-card bg-sky-50 p-6 ring-1 ring-sky-100">
                  <span className="numeral text-sm font-extrabold text-sky-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-ink-900">{factor.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{factor.body}</p>
                </div>
              ))}
            </div>
            {pricingOutro?.body ? (
              <p className="mt-8 rounded-card bg-gold-50 p-5 text-sm leading-relaxed text-gold-800 ring-1 ring-gold-200">
                {pricingOutro.body}
              </p>
            ) : null}
          </Section>
        ) : null}

        {/* ---------------------------------------------------- التواصل */}
        <Section id="contact" title="لنبنِ شراكة ناجحة معاً" tone="surface">
          <ContactBlock settings={settings} />
          {deck ? (
            <a
              href={deck}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-bold text-ink-900 transition hover:bg-gold-400"
            >
              <DownloadIcon className="h-4 w-4" />
              تحميل ملف الشراكة والرعاية (PDF)
            </a>
          ) : null}
        </Section>
      </main>

      <SiteFooter settings={settings} />
    </>
  )
}
