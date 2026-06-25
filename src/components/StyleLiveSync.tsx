'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { useEffect } from 'react'
import { buildStylesCSS, buildGoogleFontsUrl } from '@/utils/buildThemeCSS'

export function StyleLiveSync() {
  const { data } = useLivePreview({
    initialData: {},
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL!,
    depth: 1,
  })

  // Apply style from URL param immediately on mount (before first postMessage)
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('preview-style')
    if (slug) document.documentElement.dataset.style = slug
  }, [])

  useEffect(() => {
    if (!data || typeof data !== 'object') return
    // Only react to Style documents — ThemeSettings has 'layout', not 'colorsLight'/'isDefault'
    if (!('colorsLight' in data || 'colorsDark' in data || 'isDefault' in data)) return

    const style = data as any

    // Sync data-style so CSS selectors match
    if (style.isDefault) {
      delete document.documentElement.dataset.style
    } else if (style.slug) {
      document.documentElement.dataset.style = style.slug
    }

    const css = buildStylesCSS([style])
    let styleEl = document.getElementById('style-live-css') as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'style-live-css'
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = css

    const fontsUrl = buildGoogleFontsUrl(style)
    let linkEl = document.getElementById('style-live-fonts') as HTMLLinkElement | null
    if (fontsUrl) {
      if (!linkEl) {
        linkEl = document.createElement('link')
        linkEl.id = 'style-live-fonts'
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
