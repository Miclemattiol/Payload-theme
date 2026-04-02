import { getPayload, TypedLocale } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'
import { PageContent } from './[...slug]/PageContent'
import { PageClient } from './[...slug]/PageClient'

export async function generateMetadata({
  params: _params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await _params
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    locale: params.locale as TypedLocale,
    depth: 1,
    limit: 1,
  })

  const page = docs[0]
  if (!page) return {}

  const meta = (page as any).meta
  return {
    title: meta?.title ?? page.title,
    description: meta?.description,
    openGraph: {
      images: meta?.image?.url ? [{ url: meta.image.url }] : [],
    },
  }
}

export default async function HomePage({
  params: _params,
}: {
  params: Promise<{ locale: string }>
}) {
  const params = await _params
  const { isEnabled: isDraft } = await draftMode()
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    locale: params.locale as TypedLocale,
    draft: isDraft,
    limit: 1,
  })

  if (!docs[0]) notFound()

  const page = docs[0]

  if (isDraft) {
    return <PageClient initialData={page} />
  }
  return <PageContent page={page} />
}
