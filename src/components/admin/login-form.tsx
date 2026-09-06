'use client'

import { useActionState } from 'react'
import { signInAction } from '@/lib/actions/auth'
import { IDLE } from '@/lib/actions/state'
import { Field, StatusNote, SubmitButton, inputClass } from '@/components/ui/form'

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(signInAction, IDLE)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <Field label="البريد الإلكتروني">
        <input
          name="email"
          type="email"
          dir="ltr"
          required
          autoComplete="email"
          className={inputClass}
        />
      </Field>

      <Field label="كلمة المرور">
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>

      <StatusNote state={state} />

      <div className="pt-1">
        <SubmitButton>دخول</SubmitButton>
      </div>
    </form>
  )
}
