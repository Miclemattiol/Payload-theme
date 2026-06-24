import React from 'react'
import './styles.scss'
import { RefreshRouteOnSave } from '@/utils/RefreshRouteOnSave'
import { NextIntlClientProvider } from 'next-intl'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { buildThemeCSS, buildGoogleFontsUrl } from '@/utils/buildThemeCSS'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeLiveSync } from '@/components/ThemeLiveSync'
import type { Metadata } from 'next'
import type { Header as HeaderType, Footer as FooterType, ThemeSetting } from '@/payload-types'

export const metadata: Metadata = {
  title: { template: '%s', default: '' },
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { children } = props
  const { locale } = await props.params

  let themeCSS = ''
  let googleFontsUrl: string | null = null
  let headerData: HeaderType | null = null
  let footerData: FooterType | null = null
  let themeData: ThemeSetting | null = null

  try {
    const payload = await getPayload({ config: await config })
    const [theme, header, footer] = await Promise.all([
      payload.findGlobal({ slug: 'theme-settings', depth: 1 }),
      payload.findGlobal({ slug: 'header', depth: 1 }),
      payload.findGlobal({ slug: 'footer', depth: 1 }),
    ])
    themeData = theme as ThemeSetting
    themeCSS = buildThemeCSS(theme as any)
    googleFontsUrl = buildGoogleFontsUrl(theme as any)
    headerData = header as HeaderType
    footerData = footer as FooterType
  } catch {
    // globals not yet configured
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch{}`
        }} />
        {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
        {themeCSS && <style>{themeCSS}</style>}
      </head>
      <body>
        <RefreshRouteOnSave />
        {themeData && <ThemeLiveSync initialData={themeData} />}
        {headerData && <Header header={headerData} locale={locale} />}
        <NextIntlClientProvider>
          <main>
            {children}
          </main>
        </NextIntlClientProvider>
        {footerData && <Footer footer={footerData} locale={locale} />}
      </body>
    </html>
  )
}
