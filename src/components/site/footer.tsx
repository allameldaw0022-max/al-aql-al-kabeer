import Link from 'next/link'
import { socialLinks } from '@/lib/content'
import type { SiteSettings } from '@/lib/types'
import { FacebookIcon, TiktokIcon, YoutubeIcon } from '@/components/ui/icons'

const ICONS = {
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
} as const

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const links = socialLinks(settings)
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-hairline bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-ink-600">
          <span className="numeral">©</span> {settings.brand_name} — جميع الحقوق محفوظة{' '}
          <span className="numeral">{year}</span>
        </p>

        <div className="flex items-center gap-2">
          {links.map((link) => {
            const Icon = ICONS[link.platform]
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-600 ring-1 ring-hairline transition hover:bg-sky-50 hover:text-sky-700"
              >
                <Icon className="h-4 w-4" />
              </a>
            )
          })}
          <Link
            href="/admin"
            className="mr-2 text-xs font-semibold text-ink-400 transition hover:text-gold-700"
          >
            لوحة التحكم
          </Link>
        </div>
      </div>
    </footer>
  )
}
