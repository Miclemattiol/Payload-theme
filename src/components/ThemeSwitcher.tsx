'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    setTheme(saved ?? 'system')
  }, [])

  const apply = (next: Theme) => {
    setTheme(next)
    if (next === 'system') {
      localStorage.removeItem('theme')
      document.documentElement.removeAttribute('data-theme')
    } else {
      localStorage.setItem('theme', next)
      document.documentElement.dataset.theme = next
    }
  }

  if (theme === null) return null

  return (
    <button onClick={() => apply(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')} aria-label="Cambia tema">
      {theme}
    </button>
  )
}
