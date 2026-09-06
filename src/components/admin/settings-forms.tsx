'use client'

import { useActionState } from 'react'
import {
  updateBrandAction,
  updateContactAction,
  updateSocialAction,
} from '@/lib/actions/settings'
import { IDLE } from '@/lib/actions/state'
import { Field, StatusNote, SubmitButton, inputClass } from '@/components/ui/form'
import type { SiteSettings } from '@/lib/types'

export function BrandForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useActionState(updateBrandAction, IDLE)

  return (
    <form action={action} className="space-y-4">
      <Field label="اسم العلامة">
        <input name="brand_name" defaultValue={settings.brand_name} required className={inputClass} />
      </Field>

      <Field label="الوصف المختصر" hint="يظهر أعلى الصفحة داخل شارة ذهبية">
        <input name="brand_tagline" defaultValue={settings.brand_tagline} className={inputClass} />
      </Field>

      <Field label="عنوان الواجهة">
        <input name="hero_title" defaultValue={settings.hero_title} className={inputClass} />
      </Field>

      <Field label="نص الواجهة التعريفي">
        <textarea
          name="hero_subtitle"
          defaultValue={settings.hero_subtitle}
          rows={3}
          className={inputClass}
        />
      </Field>

      <StatusNote state={state} />
      <SubmitButton />
    </form>
  )
}

export function ContactForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useActionState(updateContactAction, IDLE)

  return (
    <form action={action} className="space-y-4">
      <Field label="البريد الإلكتروني">
        <input
          name="contact_email"
          type="email"
          dir="ltr"
          defaultValue={settings.contact_email ?? ''}
          className={inputClass}
        />
      </Field>

      <Field
        label="رقم الواتساب"
        hint="بصيغة دولية بأرقام فقط بدون + أو مسافات — مثال: 249927020223"
      >
        <input
          name="whatsapp_number"
          dir="ltr"
          inputMode="numeric"
          defaultValue={settings.whatsapp_number ?? ''}
          className={inputClass}
        />
      </Field>

      <Field
        label="الرسالة المبدئية في واتساب"
        hint="تُكتب تلقائياً في محادثة الراعي عند الضغط على زر واتساب"
      >
        <textarea
          name="whatsapp_message"
          defaultValue={settings.whatsapp_message ?? ''}
          rows={2}
          className={inputClass}
        />
      </Field>

      <StatusNote state={state} />
      <SubmitButton />
    </form>
  )
}

export function SocialForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useActionState(updateSocialAction, IDLE)

  const rows = [
    { key: 'facebook', label: 'فيسبوك', url: settings.facebook_url, text: settings.facebook_label },
    { key: 'youtube', label: 'يوتيوب', url: settings.youtube_url, text: settings.youtube_label },
    { key: 'tiktok', label: 'تيك توك', url: settings.tiktok_url, text: settings.tiktok_label },
  ] as const

  return (
    <form action={action} className="space-y-6">
      {rows.map((row) => (
        <div key={row.key} className="grid gap-3 sm:grid-cols-2">
          <Field label={`رابط ${row.label}`} hint="يجب أن يبدأ بـ https://">
            <input
              name={`${row.key}_url`}
              type="url"
              dir="ltr"
              placeholder="https://…"
              defaultValue={row.url ?? ''}
              className={inputClass}
            />
          </Field>
          <Field label={`نص رابط ${row.label}`}>
            <input
              name={`${row.key}_label`}
              defaultValue={row.text ?? ''}
              className={inputClass}
            />
          </Field>
        </div>
      ))}

      <p className="text-xs text-ink-400">
        الرابط الفارغ يعني أن المنصة لن تظهر في الموقع إطلاقاً.
      </p>

      <StatusNote state={state} />
      <SubmitButton />
    </form>
  )
}
