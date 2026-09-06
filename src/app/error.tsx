'use client'

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-ink-900">حدث خطأ غير متوقع</h1>
      <p className="text-ink-600">حاول تحديث الصفحة، وإذا تكرر الخطأ تواصل معنا.</p>
      <button
        onClick={reset}
        className="mt-2 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-gold-400"
      >
        إعادة المحاولة
      </button>
    </main>
  )
}
