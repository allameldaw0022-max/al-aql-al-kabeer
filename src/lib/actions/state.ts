/**
 * حالة نتيجة أي Server Action.
 * هذا الملف isomorphic عمداً — تستورده مكوّنات العميل لعرض رسالة النتيجة،
 * لذلك يجب ألّا يحتوي أي منطق خادم أو أسرار.
 */
export interface ActionState {
  ok: boolean
  message: string
}

export const IDLE: ActionState = { ok: false, message: '' }

export function fail(message: string): ActionState {
  return { ok: false, message }
}

export function done(message = 'تم الحفظ'): ActionState {
  return { ok: true, message }
}
