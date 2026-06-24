type LinkItem = {
  linkType?: 'internal' | 'external' | null
  page?: { slug?: string | null } | string | null
  url?: string | null
}

export const resolveHref = (item: LinkItem, locale: string): string => {
  if (item.linkType === 'external' && item.url) return item.url
  if (typeof item.page === 'object' && item.page?.slug) {
    const slug = item.page.slug
    return slug === 'home' ? `/${locale}` : `/${locale}/${slug}`
  }
  return '#'
}
