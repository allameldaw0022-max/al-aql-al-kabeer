'use client'

import { useFormStatus } from 'react-dom'
import type { ActionState } from '@/lib/actions/state'

export function SubmitButton({
  children = 'حفظ',
  variant = 'gold',
}: {
  children?: React.ReactNode
  variant?: 'gold' | 'ghost' | 'danger'
}) {
  const { pending } = useFormStatus()

  const styles = {
    gold: 'bg-gold-500 text-ink-900 hover:bg-gold-400',
    ghost: 'bg-white text-ink-700 ring-1 ring-hairline hover:bg-surface-alt',
    danger: 'bg-white text-danger ring-1 ring-danger/30 hover:bg-danger/5',
  }[variant]

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${styles}`}
    >
      {pending ? 'جارٍ الحفظ…' : children}
    </button>
  )
}

export function StatusNote({ state }: { state: ActionState }) {
  if (!state.message) return null
  return (
    <p
      role="status"
      aria-live="polite"
      className={`text-sm font-medium ${state.ok ? 'text-success' : 'text-danger'}`}
    >
      {state.message}
    </p>
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-sm font-semibold text-ink-700">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-ink-400">{hint}</span> : null}
    </label>
  )
}

export const inputClass =
  'w-full rounded-lg border-0 bg-white px-3 py-2.5 text-sm text-ink-900 ring-1 ring-hairline transition placeholder:text-ink-400 focus:ring-2 focus:ring-sky-500'
