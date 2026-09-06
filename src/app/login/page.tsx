import type { Metadata } from 'next'
import { LoginForm } from '@/components/admin/login-form'

export const metadata: Metadata = {
  title: 'تسجيل الدخول',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const params = await searchParams

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-card bg-white p-8 shadow-lift ring-1 ring-hairline">
        <div className="mb-7 text-center">
          <span
            aria-hidden
            className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gold-500 text-xl font-extrabold text-ink-900"
          >
            ع
          </span>
          <h1 className="text-xl font-extrabold text-ink-900">لوحة تحكم العقل الكبير</h1>
          <p className="mt-1 text-sm text-ink-600">سجّل الدخول لتحديث محتوى الموقع</p>
        </div>

        {params.error === 'forbidden' ? (
          <p className="mb-5 rounded-lg bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
            هذا الحساب لا يملك صلاحية الدخول إلى لوحة التحكم.
          </p>
        ) : null}

        <LoginForm next={params.next ?? '/admin'} />
      </div>
    </main>
  )
}
