'use client'

import { useActionState } from 'react'
import { saveBlocksAction } from '@/lib/actions/blocks'
import { IDLE } from '@/lib/actions/state'
import { Field, StatusNote, SubmitButton, inputClass } from '@/components/ui/form'
import type { ContentBlock } from '@/lib/types'

const SECTION_LABELS: Record<string, string> = {
  about: 'من نحن',
  audience: 'الجمهور',
  why: 'لماذا تختارنا',
  pricing: 'طريقة التسعير',
}

export function BlocksEditor({ blocks }: { blocks: ContentBlock[] }) {
  const [state, action] = useActionState(saveBlocksAction, IDLE)

  const sections = blocks.reduce<Record<string, ContentBlock[]>>((acc, block) => {
    ;(acc[block.section_key] ??= []).push(block)
    return acc
  }, {})

  if (blocks.length === 0) {
    return <p className="text-sm text-ink-600">لا توجد نصوص — تأكد من تطبيق هجرات قاعدة البيانات.</p>
  }

  return (
    <form action={action} className="space-y-8">
      {Object.entries(sections).map(([sectionKey, sectionBlocks]) => (
        <fieldset key={sectionKey}>
          <legend className="mb-3 text-sm font-extrabold text-gold-700">
            {SECTION_LABELS[sectionKey] ?? sectionKey}
          </legend>

          <div className="space-y-4">
            {sectionBlocks.map((block) => (
              <div key={block.id} className="rounded-lg bg-surface-alt p-4 ring-1 ring-hairline">
                <input type="hidden" name="block_id" value={block.id} />

                <div className="grid gap-3 sm:grid-cols-[1fr_6rem]">
                  <Field label="العنوان" hint="اتركه فارغاً إذا كان النص بلا عنوان">
                    <input
                      name={`title__${block.id}`}
                      defaultValue={block.title ?? ''}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="الترتيب">
                    <input
                      name={`sort_order__${block.id}`}
                      type="number"
                      dir="ltr"
                      defaultValue={block.sort_order}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="mt-3">
                  <Field label="النص">
                    <textarea
                      name={`body__${block.id}`}
                      defaultValue={block.body ?? ''}
                      rows={3}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-ink-700">
                  <input
                    type="checkbox"
                    name={`is_visible__${block.id}`}
                    defaultChecked={block.is_visible}
                    className="h-4 w-4 accent-gold-500"
                  />
                  ظاهر في الموقع
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      <StatusNote state={state} />
      <SubmitButton>حفظ كل النصوص</SubmitButton>
    </form>
  )
}
