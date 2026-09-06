import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { signOutAction } from '@/lib/actions/auth'

export const metadata: Metadata = {
  title: 'لوحة التحكم',
  robots: { index: false, follow: false },
}

const NAV = [
  { href: '/admin', label: 'نظرة عامة' },
  { href: '/admin/settings', label: 'الهوية والتواصل والروابط' },
  { href: '/admin/stats', label: 'الأرقام' },
  { href: '/admin/content', label: 'النصوص' },
  { href: '/admin/packages', label: 'الباقات' },
  { href: '/admin/deck', label: 'ملف الرعاية' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()

  return (
    <div className="min-h-dvh bg-surface">
      <header className="border-b border-hairline bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-lg bg-gold-500 text-sm font-extrabold text-ink-900"
            >
              ع
            </span>
            <span className="font-extrabold text-ink-900">لوحة التحكم</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-semibold text-sky-700 hover:underline">
              عرض الموقع
            </Link>
            <span className="hidden text-sm text-ink-400 sm:inline" dir="ltr">
              {admin.email}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-ink-600 ring-1 ring-hairline transition hover:bg-surface-alt"
              >
                خروج
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="أقسام لوحة التحكم" className="mx-auto max-w-5xl px-6">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 pb-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-1 text-sm font-semibold text-ink-600 transition hover:text-gold-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  )
}
