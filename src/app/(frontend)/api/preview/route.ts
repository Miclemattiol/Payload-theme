import { getPayload } from 'payload'
import config from '@/payload.config'
import { routing } from '@/i18n/routing'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const slug = searchParams.get('slug') ?? 'home'
  const locale = searchParams.get('locale') ?? routing.defaultLocale

  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(`/${locale}/${slug}`)
}
