'use client'

import { useActionState } from 'react'
import { removeDeckAction, uploadDeckAction } from '@/lib/actions/deck'
import { IDLE } from '@/lib/actions/state'
import { Field, StatusNote, SubmitButton, inputClass } from '@/components/ui/form'

export function UploadDeckForm() {
  const [state, action] = useActionState(uploadDeckAction, IDLE)

  return (
    <form action={action} className="space-y-4">
      <Field label="ملف PDF جديد" hint="بصيغة PDF فقط، بحد أقصى ٢٥ ميجابايت">
        <input
          name="deck"
          type="file"
          accept="application/pdf"
          required
          className={`${inputClass} file:mr-0 file:ml-3 file:rounded-md file:border-0 file:bg-gold-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-gold-800`}
        />
      </Field>

      <p className="text-xs text-ink-400">
        رفع ملف جديد يستبدل الملف الحالي على الموقع فوراً، ويُحذف القديم من التخزين تلقائياً.
      </p>

      <StatusNote state={state} />
      <SubmitButton>رفع واستبدال</SubmitButton>
    </form>
  )
}

export function RemoveDeckForm() {
  const [state, action] = useActionState(removeDeckAction, IDLE)

  return (
    <form action={action} className="flex flex-wrap items-center gap-4">
      <SubmitButton variant="danger">إزالة الملف من الموقع</SubmitButton>
      <StatusNote state={state} />
    </form>
  )
}
