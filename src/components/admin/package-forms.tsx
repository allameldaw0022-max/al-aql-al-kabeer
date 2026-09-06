'use client'

import { useActionState } from 'react'
import {
  addPackageAction,
  deletePackageAction,
  savePackageAction,
} from '@/lib/actions/packages'
import { IDLE } from '@/lib/actions/state'
import { Field, StatusNote, SubmitButton, inputClass } from '@/components/ui/form'
import type { SponsorshipPackage } from '@/lib/types'

export function PackageForm({ pkg }: { pkg: SponsorshipPackage }) {
  const [state, action] = useActionState(savePackageAction, IDLE)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="package_id" value={pkg.id} />

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_6rem]">
        <Field label="اسم الباقة">
          <input name="name" defaultValue={pkg.name} required className={inputClass} />
        </Field>
        <Field label="الوصف المختصر">
          <input name="tagline" defaultValue={pkg.tagline ?? ''} className={inputClass} />
        </Field>
        <Field label="الترتيب">
          <input
            name="sort_order"
            type="number"
            dir="ltr"
            defaultValue={pkg.sort_order}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="المزايا" hint="كل سطر ميزة مستقلة">
        <textarea
          name="features"
          defaultValue={pkg.features.join('\n')}
          rows={Math.max(4, pkg.features.length + 1)}
          className={inputClass}
        />
      </Field>

      <Field label="ملاحظة السعر">
        <input name="price_note" defaultValue={pkg.price_note ?? ''} className={inputClass} />
      </Field>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={pkg.is_featured}
            className="h-4 w-4 accent-gold-500"
          />
          باقة مميزة
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
          <input
            type="checkbox"
            name="is_visible"
            defaultChecked={pkg.is_visible}
            className="h-4 w-4 accent-gold-500"
          />
          ظاهرة في الموقع
        </label>
      </div>

      <StatusNote state={state} />
      <SubmitButton>حفظ الباقة</SubmitButton>
    </form>
  )
}

export function AddPackageForm() {
  const [state, action] = useActionState(addPackageAction, IDLE)

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_6rem]">
        <Field label="المعرّف" hint="حروف إنجليزية وشرطات، مثل diamond">
          <input name="slug" dir="ltr" required className={inputClass} />
        </Field>
        <Field label="اسم الباقة">
          <input name="name" required className={inputClass} />
        </Field>
        <Field label="الترتيب">
          <input name="sort_order" type="number" dir="ltr" defaultValue={40} className={inputClass} />
        </Field>
      </div>

      <Field label="الوصف المختصر">
        <input name="tagline" className={inputClass} />
      </Field>

      <Field label="المزايا" hint="كل سطر ميزة مستقلة">
        <textarea name="features" rows={4} required className={inputClass} />
      </Field>

      <Field label="ملاحظة السعر">
        <input name="price_note" className={inputClass} />
      </Field>

      <StatusNote state={state} />
      <SubmitButton>إضافة باقة</SubmitButton>
    </form>
  )
}

export function DeletePackageForm({ pkg }: { pkg: SponsorshipPackage }) {
  const [state, action] = useActionState(deletePackageAction, IDLE)

  return (
    <form action={action} className="flex items-center justify-between gap-3 py-2">
      <input type="hidden" name="package_id" value={pkg.id} />
      <span className="text-sm text-ink-700">{pkg.name}</span>
      <div className="flex items-center gap-3">
        <StatusNote state={state} />
        <SubmitButton variant="danger">حذف</SubmitButton>
      </div>
    </form>
  )
}
