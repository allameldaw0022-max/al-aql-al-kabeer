<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## ملاحظات خاصة بهذا المشروع

- كل محتوى الموقع العام (نصوص، أرقام، روابط، ملف الرعاية) مصدره Supabase — لا تكتب أي قيمة ثابتة في الكود.
- `middleware.ts` غير مستخدم؛ البديل في Next.js 16 هو `src/proxy.ts` ويعمل على nodejs runtime.
- `cookies()` و `headers()` و `params` غير متزامنة — استخدم `await` دائماً.
- متغيرات `NEXT_PUBLIC_*` تُحقن وقت البناء، لذا أي تغيير فيها يستلزم إعادة بناء/نشر.
