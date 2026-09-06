import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { PageHeading, Panel } from '@/components/admin/panel'
import { BlocksEditor } from '@/components/admin/content-forms'
import type { ContentBlock } from '@/lib/types'

export default async function ContentPage() {
  await requireAdmin()

  const supabase = await createClient()
  const { data } = await supabase
    .from('content_blocks')
    .select('*')
    .order('section_key', { ascending: true })
    .order('sort_order', { ascending: true })

  return (
    <>
      <PageHeading title="النصوص" lead="نصوص أقسام الموقع كلها قابلة للتحرير من هنا." />
      <Panel title="تحرير النصوص">
        <BlocksEditor blocks={(data ?? []) as ContentBlock[]} />
      </Panel>
    </>
  )
}
