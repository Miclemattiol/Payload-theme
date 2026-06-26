import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: await config })

  const { docs: pages } = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' }, slug: { not_equals: '404' } },
    limit: 1000,
    depth: 0,
  })

  const entries: MetadataRoute.Sitemap = []
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? ''

  for (const page of pages) {
    for (const locale of routing.locales) {
      const path = page.slug === 'home' ? '' : `/${page.slug}`
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: page.slug === 'home' ? 1.0 : 0.8,
      })
    }
  }

  return entries
}
