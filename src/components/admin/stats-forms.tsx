'use client'

import { useActionState } from 'react'
import { addStatAction, deleteStatAction, saveStatsAction } from '@/lib/actions/stats'
import { IDLE } from '@/lib/actions/state'
import { Field, StatusNote, SubmitButton, inputClass } from '@/components/ui/form'
import type { SiteStat } from '@/lib/types'

const GROUP_LABELS: Record<string, string> = {
  platform: 'أرقام المنصات',
  engagement: 'متوسط التفاعل',
  highlight: 'الإنجاز الأبرز',
  audience: 'الجمهور',
}

export function StatsEditor({ stats }: { stats: SiteStat[] }) {
  const [state, action] = useActionState(saveStatsAction, IDLE)

  const groups = stats.reduce<Record<string, SiteStat[]>>((acc, stat) => {
    ;(acc[stat.group_key] ??= []).push(stat)
    return acc
  }, {})

  if (stats.length === 0) {
    return <p className="text-sm text-ink-600">لا توجد أرقام بعد — أضف رقماً من النموذج أدناه.</p>
  }

  return (
    <form action={action} className="space-y-8">
      {Object.entries(groups).map(([groupKey, groupStats]) => (
        <fieldset key={groupKey}>
          <legend className="mb-3 text-sm font-extrabold text-gold-700">
            {GROUP_LABELS[groupKey] ?? groupKey}
          </legend>

          <div className="space-y-4">
            {groupStats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-lg bg-surface-alt p-4 ring-1 ring-hairline"
              >
                <input type="hidden" name="stat_id" value={stat.id} />

                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_6rem]">
                  <Field label="العنوان">
                    <input
                      name={`label__${stat.id}`}
                      defaultValue={stat.label}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="القيمة" hint="اكتبها كما تريد ظهورها: 51K أو 793,000">
                    <input
                      name={`value__${stat.id}`}
                      dir="ltr"
                      defaultValue={stat.value}
                      required
                      className={inputClass}
                    />
                  </Field>
                  <Field label="الترتيب">
                    <input
                      name={`sort_order__${stat.id}`}
                      type="number"
                      dir="ltr"
                      defaultValue={stat.sort_order}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="mt-3">
                  <Field label="ملاحظة (اختيارية)">
                    <input
                      name={`note__${stat.id}`}
                      defaultValue={stat.note ?? ''}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-ink-700">
                  <input
                    type="checkbox"
                    name={`is_visible__${stat.id}`}
                    defaultChecked={stat.is_visible}
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
      <SubmitButton>حفظ كل الأرقام</SubmitButton>
    </form>
  )
}

export function AddStatForm() {
  const [state, action] = useActionState(addStatAction, IDLE)

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="المجموعة">
          <select name="group_key" defaultValue="platform" className={inputClass}>
            <option value="platform">أرقام المنصات</option>
            <option value="engagement">متوسط التفاعل</option>
            <option value="highlight">الإنجاز الأبرز</option>
            <option value="audience">الجمهور</option>
          </select>
        </Field>
        <Field label="المعرّف" hint="حروف إنجليزية وأرقام فقط، مثل instagram_followers">
          <input name="stat_key" dir="ltr" required className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_6rem]">
        <Field label="العنوان">
          <input name="label" required className={inputClass} />
        </Field>
        <Field label="القيمة">
          <input name="value" dir="ltr" required className={inputClass} />
        </Field>
        <Field label="الترتيب">
          <input name="sort_order" type="number" dir="ltr" defaultValue={50} className={inputClass} />
        </Field>
      </div>

      <Field label="ملاحظة (اختيارية)">
        <input name="note" className={inputClass} />
      </Field>

      <StatusNote state={state} />
      <SubmitButton>إضافة رقم</SubmitButton>
    </form>
  )
}

export function DeleteStatForm({ stat }: { stat: SiteStat }) {
  const [state, action] = useActionState(deleteStatAction, IDLE)

  return (
    <form action={action} className="flex items-center justify-between gap-3 py-2">
      <input type="hidden" name="stat_id" value={stat.id} />
      <span className="text-sm text-ink-700">
        {stat.label} — <span className="numeral font-semibold">{stat.value}</span>
      </span>
      <div className="flex items-center gap-3">
        <StatusNote state={state} />
        <SubmitButton variant="danger">حذف</SubmitButton>
      </div>
    </form>
  )
}
