import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { getPayload, TypedLocale } from 'payload'
import config from '@/payload.config'

export const runtime = 'nodejs'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params
  const slug = req.nextUrl.searchParams.get('slug') ?? 'home'

  let title = slug

  try {
    const payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      locale: locale as TypedLocale,
      depth: 0,
      limit: 1,
    })
    const page = docs[0]
    title = (page?.meta as any)?.title ?? page?.title ?? slug
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
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
    ),
    { width: 1200, height: 630 },
  )
}
