import type { Metadata, Viewport } from 'next'
import { Tajawal } from 'next/font/google'
import { getSettings } from '@/lib/content'
import { siteUrl } from '@/lib/env'
import './globals.css'

const arabic = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  display: 'swap',
  variable: '--font-arabic',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const title = `${settings.brand_name} — ${settings.hero_title}`

  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s · ${settings.brand_name}` },
    description: settings.brand_tagline,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'ar_AR',
      siteName: settings.brand_name,
      title,
      description: settings.brand_tagline,
      url: '/',
    },
    twitter: { card: 'summary_large_image', title, description: settings.brand_tagline },
  }
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={arabic.variable}>
      <body className="min-h-dvh bg-canvas antialiased">{children}</body>
    </html>
  )
}
