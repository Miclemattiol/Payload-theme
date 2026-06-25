'use client'

import { useEffect, useState } from 'react'

type StyleOption = {
  slug: string
  name: string
  isDefault?: boolean | null
}

export function StyleSwitcher({ styles }: { styles: StyleOption[] }) {
  const defaultStyle = styles.find(s => s.isDefault)?.slug ?? styles[0]?.slug ?? ''
  const [active, setActive] = useState(defaultStyle)

  useEffect(() => {
    const inIframe = window.self !== window.top

    if (inIframe) {
      // Preview: inizializza dall'URL param, StyleLiveSync gestisce data-style
      const slug = new URLSearchParams(window.location.search).get('preview-style')
      if (slug && styles.some(s => s.slug === slug)) setActive(slug)
    } else {
      const saved = localStorage.getItem('site-style')
      const initial = saved && styles.some(s => s.slug === saved) ? saved : defaultStyle
      setActive(initial)
      if (initial) document.documentElement.dataset.style = initial
    }
  }, [])

  const apply = (slug: string) => {
    setActive(slug)
    document.documentElement.dataset.style = slug
    if (window.self === window.top) localStorage.setItem('site-style', slug)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 9999,
        background: 'var(--color-surface, #fff)',
        border: '1px solid var(--color-border, #e0e0e0)',
        borderRadius: 'var(--radius-lg, 16px)',
        padding: '0.5rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      }}
    >
      {styles.map(style => (
        <button
          key={style.slug}
          onClick={() => apply(style.slug)}
          style={{
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-md, 8px)',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-body, inherit)',
            fontSize: '0.875rem',
            background: active === style.slug
              ? 'var(--color-primary, #000)'
              : 'transparent',
            color: active === style.slug
              ? '#fff'
              : 'var(--color-text-primary, #000)',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {style.name}
        </button>
      ))}
    </div>
  )
}
