'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { useEffect } from 'react'
import { buildThemeCSS, buildGoogleFontsUrl } from '@/utils/buildThemeCSS'

export function ThemeLiveSync({ initialData }: { initialData: any }) {
  const { data } = useLivePreview({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL!,
    depth: 1,
  })

  useEffect(() => {
    // CSS vars
    const css = buildThemeCSS(data as any)
    let styleEl = document.getElementById('theme-live-css') as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'theme-live-css'
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = css

    // Google Fonts link
    const fontsUrl = buildGoogleFontsUrl(data as any)
    let linkEl = document.getElementById('theme-live-fonts') as HTMLLinkElement | null
    if (fontsUrl) {
      if (!linkEl) {
        linkEl = document.createElement('link')
        linkEl.id = 'theme-live-fonts'
        linkEl.rel = 'stylesheet'
        document.head.appendChild(linkEl)
      }
      if (linkEl.href !== fontsUrl) linkEl.href = fontsUrl
    } else if (linkEl) {
      linkEl.remove()
    }
  }, [data])

  return null
}
