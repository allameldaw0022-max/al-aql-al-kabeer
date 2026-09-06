import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { PageHeading, Panel } from '@/components/admin/panel'
import { AddStatForm, DeleteStatForm, StatsEditor } from '@/components/admin/stats-forms'
import type { SiteStat } from '@/lib/types'

export default async function StatsPage() {
  await requireAdmin()

  const supabase = await createClient()
  const { data } = await supabase
    .from('site_stats')
    .select('*')
    .order('group_key', { ascending: true })
    .order('sort_order', { ascending: true })

  const stats = (data ?? []) as SiteStat[]

  return (
    <>
      <PageHeading
        title="الأرقام"
        lead="حدّث المتابعين والمشاهدات ومتوسط التفاعل متى ما تغيّرت — بلا تعديل كود."
      />

      <div className="space-y-6">
        <Panel title="تحرير الأرقام الحالية">
          <StatsEditor stats={stats} />
        </Panel>

        <Panel title="إضافة رقم جديد" description="مثلاً عند إطلاق حساب على منصة جديدة.">
          <AddStatForm />
        </Panel>

        {stats.length > 0 ? (
          <Panel title="حذف رقم" description="الحذف نهائي — للإخفاء المؤقت استخدم خيار «ظاهر في الموقع».">
            <div className="divide-y divide-hairline">
              {stats.map((stat) => (
                <DeleteStatForm key={stat.id} stat={stat} />
              ))}
            </div>
          </Panel>
        ) : null}
      </div>
    </>
  )
}
