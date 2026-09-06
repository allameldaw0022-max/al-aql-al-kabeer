import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="numeral text-6xl font-extrabold text-gold-500">404</p>
      <h1 className="text-2xl font-bold text-ink-900">الصفحة غير موجودة</h1>
      <p className="text-ink-600">الرابط الذي فتحته غير صحيح أو تم تغييره.</p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-gold-400"
      >
        العودة للصفحة الرئيسية
      </Link>
    </main>
  )
}
