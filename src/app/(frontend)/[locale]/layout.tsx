import React from 'react'
import './styles.scss'
import { RefreshRouteOnSave } from '@/utils/RefreshRouteOnSave'
import { NextIntlClientProvider } from 'next-intl'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
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
