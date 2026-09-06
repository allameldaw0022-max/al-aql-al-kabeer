import type { NextConfig } from 'next'

const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname
  } catch {
    return null
  }
})()

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // رفع ملف الرعاية يمر عبر Server Action، وحدّها الافتراضي 1MB — أصغر من
      // حد التحقق في src/lib/actions/deck.ts ومن حد bucket في Supabase. فكان أي
      // ملف فوق 1MB يُرفض قبل وصوله للكود، بخطأ عام بدل رسالة الحجم الواضحة.
      //
      // القيمة 26mb لا 25mb عمداً: الحد يُطبَّق على جسم الطلب الخام بما فيه
      // زوائد multipart (الحدود وترويسات الأجزاء)، فضبطه على 25mb بالضبط كان
      // سيُفشل ملفاً بحجم 25MB. الهامش يجعل فحص الـ 25MB في deck.ts هو البوابة
      // الفعلية، فيظهر للمستخدم خطأ عربي واضح بدل رفض غامض من الإطار.
      bodySizeLimit: '26mb',
    },
  },
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
      : [],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}

export default nextConfig
