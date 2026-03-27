'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { Page } from '@/payload-types'
import { PageContent } from './PageContent'

export function PageClient({ initialData }: { initialData: Page }) {
  const { data } = useLivePreview<Page>({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL!,
    depth: 2,
  })

  return <PageContent page={data} />
}
