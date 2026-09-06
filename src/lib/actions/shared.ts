import 'server-only'

export { done, fail, IDLE, type ActionState } from './state'

/** نص مطلوب بحد أقصى للطول. */
export function text(form: FormData, field: string, max = 2000): string {
  const value = String(form.get(field) ?? '').trim()
  return value.slice(0, max)
}

/** نص اختياري — الفارغ يُحفظ NULL لا سلسلة فارغة. */
export function optionalText(form: FormData, field: string, max = 2000): string | null {
  const value = text(form, field, max)
  return value.length > 0 ? value : null
}

export function optionalInt(form: FormData, field: string): number {
  const value = Number.parseInt(String(form.get(field) ?? ''), 10)
  return Number.isFinite(value) ? value : 0
}

export function checkbox(form: FormData, field: string): boolean {
  return form.get(field) === 'on' || form.get(field) === 'true'
}

/** رابط https فقط — يمنع javascript: وأي مخطط آخر. undefined تعني رابطاً غير صالح. */
export function optionalHttpsUrl(form: FormData, field: string): string | null | undefined {
  const value = text(form, field, 500)
  if (value.length === 0) return null
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'https:') return undefined
    return parsed.toString()
  } catch {
    return undefined
  }
}

/** رقم واتساب: أرقام فقط بصيغة دولية. undefined تعني رقماً غير صالح. */
export function normalizeWhatsapp(raw: string): string | null | undefined {
  const digits = raw.replace(/[\s+\-()]/g, '')
  if (digits.length === 0) return null
  if (!/^[0-9]{8,15}$/.test(digits)) return undefined
  return digits
}
