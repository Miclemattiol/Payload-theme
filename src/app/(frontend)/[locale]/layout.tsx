import React from 'react'
import './styles.scss'
import { RefreshRouteOnSave } from '@/utils/RefreshRouteOnSave'
import { NextIntlClientProvider } from 'next-intl'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { buildThemeCSS, buildGoogleFontsUrl } from '@/utils/buildThemeCSS'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  let themeCSS = ''
  let googleFontsUrl: string | null = null

  try {
    const payload = await getPayload({ config: await config })
    const theme = await payload.findGlobal({ slug: 'theme-settings', depth: 1 })
    themeCSS = buildThemeCSS(theme as any)
    googleFontsUrl = buildGoogleFontsUrl(theme as any)
  } catch {
    // ThemeSettings non ancora configurato
  }

  return (
    <html lang="en">
      <head>
        {googleFontsUrl && (
          <link rel="stylesheet" href={googleFontsUrl} />
        )}
        {themeCSS && <style>{themeCSS}</style>}
      </head>
      <body>
        <RefreshRouteOnSave />
        <NextIntlClientProvider>
          <main>
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
