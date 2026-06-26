type CrumbItem = { label: string; url: string }

export function Breadcrumb({
  items,
  current,
}: {
  items: CrumbItem[]
  current: string
}) {
  if (!items.length) return null

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.25rem 0.5rem',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary, #666)',
        }}
      >
        {items.map((item, i) => (
          <li key={item.url} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a href={item.url} style={{ color: 'var(--color-text-secondary, #666)' }}>
              {item.label}
            </a>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li style={{ color: 'var(--color-text-primary, #000)' }} aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  )
}
