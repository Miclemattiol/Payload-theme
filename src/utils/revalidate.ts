import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { routing } from '@/i18n/routing'

export const revalidatePage = (slug: string) => {
  after(() => {
    for (const locale of routing.locales) {
      const path = slug === 'home' ? `/${locale}` : `/${locale}/${slug}`
      revalidatePath(path)
    }
  })
}

export const revalidateAllPages = () => {
  after(() => {
    revalidatePath('/', 'layout')
  })
}
