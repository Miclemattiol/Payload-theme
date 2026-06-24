import type { Metadata } from 'next'
import type { Page, Media } from '@/payload-types'

export const buildPageMetadata = (page: Page, locale: string): Metadata => {
  const meta = page.meta
  const imageUrl =
    typeof meta?.image === 'object' && meta.image !== null
      ? (meta.image as Media).url ?? undefined
      : undefined

  const title = meta?.title ?? page.title
  const description = meta?.description ?? undefined
  const canonicalPath = page.slug === 'home' ? `/${locale}` : `/${locale}/${page.slug}`
  const canonical = `${process.env.NEXT_PUBLIC_SERVER_URL}${canonicalPath}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}
