import { formatWhatsapp, socialLinks, whatsappHref } from '@/lib/content'
import type { SiteSettings } from '@/lib/types'
import {
  FacebookIcon,
  MailIcon,
  TiktokIcon,
  WhatsappIcon,
  YoutubeIcon,
} from '@/components/ui/icons'

const ICONS = {
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
} as const

/** كل الروابط هنا مصدرها قاعدة البيانات — الفارغ منها لا يُعرض إطلاقاً. */
export function ContactBlock({ settings }: { settings: SiteSettings }) {
  const links = socialLinks(settings)
  const whatsapp = whatsappHref(settings)
  const whatsappDisplay = formatWhatsapp(settings.whatsapp_number)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-card bg-white p-4 shadow-soft ring-1 ring-hairline transition hover:ring-gold-300"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gold-100 text-gold-700">
              <WhatsappIcon />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-ink-900">واتساب</span>
              <span className="numeral block text-sm text-ink-600">{whatsappDisplay}</span>
            </span>
          </a>
        ) : null}

        {settings.contact_email ? (
          <a
            href={`mailto:${settings.contact_email}`}
            className="flex items-center gap-3 rounded-card bg-white p-4 shadow-soft ring-1 ring-hairline transition hover:ring-gold-300"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-700">
              <MailIcon />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-ink-900">البريد الإلكتروني</span>
              <span className="block truncate text-sm text-ink-600" dir="ltr">
                {settings.contact_email}
              </span>
            </span>
          </a>
        ) : null}
      </div>

      {links.length > 0 ? (
        <div className="space-y-3">
          {links.map((link) => {
            const Icon = ICONS[link.platform]
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-card bg-white p-4 shadow-soft ring-1 ring-hairline transition hover:ring-sky-300"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-700">
                  <Icon />
                </span>
                <span className="text-sm font-bold text-ink-900">{link.label}</span>
              </a>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
