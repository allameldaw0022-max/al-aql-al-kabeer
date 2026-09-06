import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { PageHeading, Panel } from '@/components/admin/panel'
import {
  AddPackageForm,
  DeletePackageForm,
  PackageForm,
} from '@/components/admin/package-forms'
import type { SponsorshipPackage } from '@/lib/types'

export default async function PackagesPage() {
  await requireAdmin()

  const supabase = await createClient()
  const { data } = await supabase
    .from('sponsorship_packages')
    .select('*')
    .order('sort_order', { ascending: true })

  const packages = (data ?? []) as SponsorshipPackage[]

  return (
    <>
      <PageHeading title="باقات الرعاية" lead="عدّل المزايا والترتيب، أو أضف باقة جديدة." />

      <div className="space-y-6">
        {packages.map((pkg) => (
          <Panel key={pkg.id} title={`الباقة: ${pkg.name}`}>
            <PackageForm pkg={pkg} />
          </Panel>
        ))}

        <Panel title="إضافة باقة جديدة">
          <AddPackageForm />
        </Panel>

        {packages.length > 0 ? (
          <Panel
            title="حذف باقة"
            description="الحذف نهائي — للإخفاء المؤقت استخدم خيار «ظاهرة في الموقع»."
          >
            <div className="divide-y divide-hairline">
              {packages.map((pkg) => (
                <DeletePackageForm key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </Panel>
        ) : null}
      </div>
    </>
  )
}
