import { getSettings } from '@/lib/content'
import { PageHeading, Panel } from '@/components/admin/panel'
import { BrandForm, ContactForm, SocialForm } from '@/components/admin/settings-forms'

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <>
      <PageHeading
        title="الهوية والتواصل والروابط"
        lead="كل ما تعدّله هنا ينعكس على الموقع العام فوراً."
      />
      <div className="space-y-6">
        <Panel title="هوية العلامة" description="الاسم والنصوص الظاهرة في أعلى الصفحة.">
          <BrandForm settings={settings} />
        </Panel>

        <Panel title="بيانات التواصل" description="البريد ورقم الواتساب المستخدم في أزرار الطلب.">
          <ContactForm settings={settings} />
        </Panel>

        <Panel
          title="روابط السوشيال ميديا"
          description="حدّث الروابط هنا في أي وقت دون الحاجة لتعديل الكود."
        >
          <SocialForm settings={settings} />
        </Panel>
      </div>
    </>
  )
}
