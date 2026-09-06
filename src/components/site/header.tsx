import Image from 'next/image'
import Link from 'next/link'
import type { SiteSettings } from '@/lib/types'

const NAV = [
  { href: '#about', label: 'من نحن' },
  { href: '#numbers', label: 'الأرقام' },
  { href: '#why', label: 'لماذا نحن' },
  { href: '#packages', label: 'الباقات' },
  { href: '#contact', label: 'تواصل' },
]

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.webp"
            alt=""
            width={94}
            height={80}
            priority
            className="h-10 w-auto"
          />
          <span className="text-lg font-extrabold text-ink-900">{settings.brand_name}</span>
        </Link>

        <nav aria-label="أقسام الصفحة" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-ink-600 transition hover:text-gold-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-bold text-ink-900 transition hover:bg-gold-400"
        >
          كن راعياً
        </a>
      </div>
    </header>
  )
}
