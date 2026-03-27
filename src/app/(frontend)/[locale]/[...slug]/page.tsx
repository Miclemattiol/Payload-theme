import { getPayload, TypedLocale } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { RenderBlock } from '@/utils/RenderBlock'
import { PageContent } from './PageContent'
import { PageClient } from './PageClient'

export default async function Page({ 
  params: _params,
  searchParams: _searchParams,
}: { 
  params: Promise<{ slug: string[], locale: string }>,
  searchParams: Promise<{ preview?: string }>
}) {
  const params = await _params;
  const searchParams = await _searchParams;
  const payload = await getPayload({ config: await config })

  const slug = params.slug?.join('/') ?? 'home'

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    locale: params.locale as TypedLocale,
    limit: 1,
  })

  if (!docs[0]) notFound()

  const page = docs[0]

  if (searchParams.preview === 'true') {
    return <PageClient initialData={page} />
  }
  return <PageContent page={page} />
}