import { getPayload, TypedLocale } from 'payload'
import config from '@/payload.config'
import { getLocale } from 'next-intl/server'
import { PageContent } from './[...slug]/PageContent'

export default async function NotFound() {
  const locale = await getLocale()

  try {
    const payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: '404' } },
      locale: locale as TypedLocale,
      limit: 1,
    })

    if (docs[0] && docs[0].content?.length) {
      return <PageContent page={docs[0]} />
    }
  } catch {
    // fallback
  }

  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>404</h1>
      <p>Pagina non trovata</p>
      <a href={`/${locale}`}>Torna alla home</a>
    </div>
  )
}
