'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { useEffect } from 'react'
import { buildThemeCSS } from '@/utils/buildThemeCSS'

export function ThemeLiveSync({ initialData }: { initialData: any }) {
  const { data } = useLivePreview({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL!,
    depth: 1,
  })

  useEffect(() => {
    const css = buildThemeCSS(data as any)
    let el = document.getElementById('theme-live-css') as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = 'theme-live-css'
      document.head.appendChild(el)
    }
    el.textContent = css
  }, [data])

  return null
}
