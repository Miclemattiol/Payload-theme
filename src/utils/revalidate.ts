import { revalidatePath } from 'next/cache'
import { routing } from '@/i18n/routing'

export const revalidatePage = (slug: string) => {
  for (const locale of routing.locales) {
    const path = slug === 'home' ? `/${locale}` : `/${locale}/${slug}`
    revalidatePath(path)
  }
}

export const revalidateAllPages = () => {
  revalidatePath('/', 'layout')
}
