import React from 'react'
import './styles.scss'
import { RefreshRouteOnSave } from '@/utils/RefreshRouteOnSave'
import { NextIntlClientProvider } from 'next-intl'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { buildLayoutCSS, buildStylesCSS, buildAllGoogleFontsUrl } from '@/utils/buildThemeCSS'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeLiveSync } from '@/components/ThemeLiveSync'
import { StyleSwitcher } from '@/components/StyleSwitcher'
import { StyleLiveSync } from '@/components/StyleLiveSync'
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

  let layoutCSS = ''
  let stylesCSS = ''
  let googleFontsUrl: string | null = null
  let headerData: HeaderType | null = null
  let footerData: FooterType | null = null
  let themeData: ThemeSetting | null = null
  let styleList: { slug: string; name: string; isDefault?: boolean | null }[] = []

  try {
    const payload = await getPayload({ config: await config })
    const [theme, header, footer, stylesResult] = await Promise.all([
      payload.findGlobal({ slug: 'theme-settings', depth: 1 }),
      payload.findGlobal({ slug: 'header', depth: 1 }),
      payload.findGlobal({ slug: 'footer', depth: 1 }),
      payload.find({ collection: 'styles', depth: 1, limit: 100 }),
    ])
    themeData = theme as ThemeSetting
    layoutCSS = buildLayoutCSS(theme as any)
    const styles = stylesResult.docs as any[]
    stylesCSS = buildStylesCSS(styles)
    googleFontsUrl = buildAllGoogleFontsUrl(styles)
    styleList = styles.map(s => ({ slug: s.slug, name: s.name, isDefault: s.isDefault }))
    headerData = header as HeaderType
    footerData = footer as FooterType
  } catch {
    // globals not yet configured
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem('site-theme');if(t)document.documentElement.dataset.theme=t;var s=localStorage.getItem('site-style');if(s)document.documentElement.dataset.style=s}catch{}`
        }} />
        {googleFontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={googleFontsUrl} />
          </>
        )}
        {stylesCSS && <style>{stylesCSS}</style>}
        {layoutCSS && <style>{layoutCSS}</style>}
      </head>
      <body>
        <RefreshRouteOnSave />
        {themeData && <ThemeLiveSync initialData={themeData} />}
        <StyleLiveSync />
        {headerData && <Header header={headerData} locale={locale} />}
        <NextIntlClientProvider>
          <main>
            {children}
          </main>
        </NextIntlClientProvider>
        {footerData && <Footer footer={footerData} locale={locale} />}
        {styleList.length > 1 && <StyleSwitcher styles={styleList} />}
      </body>
    </html>
  )
}
