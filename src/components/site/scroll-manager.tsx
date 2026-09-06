'use client'

import { useEffect } from 'react'

/**
 * ضبط سلوك التمرير في الصفحة العامة — مهمتان:
 *
 * ١) الصفحة تبدأ من أعلاها دائماً.
 *    الافتراضي في المتصفحات هو history.scrollRestoration = 'auto'، أي أنها
 *    تستعيد موضع التمرير السابق عند إعادة التحميل أو الرجوع. وكروم على أندرويد
 *    يتخلص من التبويبات الخلفية ثم يعيد تحميلها عند العودة إليها — فيجد الزائر
 *    الصفحة في نهايتها بلا أن يفعل شيئاً. هذه صفحة تعريفية واحدة تُقرأ من
 *    البداية، فالاستعادة تضرّ ولا تنفع.
 *
 * ٢) التنقّل الداخلي بلا كتابة #القسم في شريط العنوان.
 *    الروابط تبقى <a href="#id"> حقيقية — تعمل بلا جافاسكربت ويزحف إليها محرك
 *    البحث — لكن بقاء الـhash يعني أن أي رابط يُنسخ ويُرسل لراعٍ يفتح من المنتصف.
 *    الوصول برابط يحمل hash أصلاً يبقى محترماً.
 */
export function ScrollManager() {
  useEffect(() => {
    const previous = history.scrollRestoration
    if (previous === 'auto') {
      history.scrollRestoration = 'manual'
    }

    function onClick(event: MouseEvent) {
      // النقر بأزرار أخرى أو مع مفتاح مساعد يُترك للمتصفح (فتح في تبويب جديد…)
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
    return () => {
      document.removeEventListener('click', onClick)
      history.scrollRestoration = previous
    }
  }, [])

  return null
}
