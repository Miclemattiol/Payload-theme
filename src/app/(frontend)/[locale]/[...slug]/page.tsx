import { getPayload, TypedLocale } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'
import { PageContent } from './PageContent'
import { PageClient } from './PageClient'
import { buildPageMetadata } from '@/utils/pageMetadata'
import { routing } from '@/i18n/routing'

export async function generateStaticParams() {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
  })

  return routing.locales.flatMap((locale) =>
    docs
      .filter((p) => p.slug !== 'home' && p.slug !== '404')
      .map((p) => ({ locale, slug: p.slug.split('/') })),
  )
}

type CrumbItem = { label: string; url: string }

function buildBreadcrumbs(page: any, locale: string): CrumbItem[] {
  const crumbs: CrumbItem[] = []
  let current = page
  while (current.parent && typeof current.parent === 'object') {
    const p = current.parent
    if (p.slug && p.slug !== 'home') {
      crumbs.unshift({ label: p.title, url: `/${locale}/${p.slug}` })
    } else if (p.slug === 'home') {
      crumbs.unshift({ label: p.title, url: `/${locale}` })
    }
    current = p
  }
  return crumbs
}

export async function generateMetadata({
  params: _params,
}: {
  params: Promise<{ slug: string[]; locale: string }>
}): Promise<Metadata> {
  const params = await _params
  const payload = await getPayload({ config: await config })
  const slug = params.slug?.join('/') ?? 'home'

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    locale: params.locale as TypedLocale,
    depth: 1,
    limit: 1,
  })

  const page = docs[0]
  if (!page) return {}

  return buildPageMetadata(page, params.locale)
}

export default async function Page({
  params: _params,
}: {
  params: Promise<{ slug: string[]; locale: string }>
}) {
  const params = await _params
  const { isEnabled: isDraft } = await draftMode()
  const payload = await getPayload({ config: await config })

  const slug = params.slug?.join('/') ?? 'home'

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    locale: params.locale as TypedLocale,
    draft: isDraft,
    depth: 2,
    limit: 1,
  })

  if (!docs[0]) notFound()

  const page = docs[0]
  const breadcrumbs = buildBreadcrumbs(page, params.locale)

  if (isDraft) {
    return <PageClient initialData={page} />
  }
  return <PageContent page={page} breadcrumbs={breadcrumbs} />
}
