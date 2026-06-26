import { ImageResponse } from 'next/og'
import { getPayload, TypedLocale } from 'payload'
import config from '@/payload.config'

export const runtime = 'nodejs'
export const alt = 'Home preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    locale: locale as TypedLocale,
    depth: 0,
    limit: 1,
  })

  const page = docs[0]
  const title = (page?.meta as any)?.title ?? page?.title ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#ffffff',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.2,
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>
      </div>
    )
  )
}
