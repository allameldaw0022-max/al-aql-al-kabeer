export function Panel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-card bg-white p-6 shadow-soft ring-1 ring-hairline">
      <h2 className="text-lg font-extrabold text-ink-900">{title}</h2>
      {description ? <p className="mt-1 text-sm text-ink-600">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  )
}

export function PageHeading({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-extrabold text-ink-900">{title}</h1>
      {lead ? <p className="mt-1.5 text-sm text-ink-600">{lead}</p> : null}
    </div>
  )
}
