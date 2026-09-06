'use client'

import { useEffect } from 'react'

/**
 * تمرير داخلي بلا كتابة #القسم في شريط العنوان.
 *
 * روابط التنقل تبقى <a href="#id"> حقيقية — تعمل بلا جافاسكربت ويزحف إليها
 * محرك البحث. هذا المكوّن يعترض الضغط فقط ليمنع المتصفح من إضافة الـhash،
 * لأن بقاءه في الرابط يعني أن أي إعادة فتح — أو أي رابط يُنسخ ويُرسل لراعٍ —
 * يبدأ من منتصف الصفحة بدل أعلاها.
 *
 * الوصول عبر رابط يحمل hash أصلاً يبقى محترماً: المتصفح يتولاه كالمعتاد.
 */
export function SmoothAnchors() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      // نترك النقر بأزرار أخرى أو مع مفتاح مساعد للمتصفح (فتح في تبويب جديد…)
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      if (!(anchor instanceof HTMLAnchorElement)) return

      const id = anchor.getAttribute('href')?.slice(1)
      if (!id) return

      const target = document.getElementById(id)
      if (!target) return

      event.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })

      // التنقل الأصلي ينقل التركيز إلى القسم؛ باعتراضه يجب أن نفعل ذلك يدوياً
      // وإلا ضاع مستخدمو لوحة المفاتيح وقارئات الشاشة.
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
