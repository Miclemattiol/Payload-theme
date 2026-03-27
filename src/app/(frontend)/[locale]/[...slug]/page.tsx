import { getPayload, TypedLocale } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { PageContent } from './PageContent'
import { PageClient } from './PageClient'

export default async function Page({
  params: _params,
}: {
  params: Promise<{ slug: string[], locale: string }>,
}) {
  const params = await _params;
  const { isEnabled: isDraft } = await draftMode()
  const payload = await getPayload({ config: await config })

  const slug = params.slug?.join('/') ?? 'home'

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
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
