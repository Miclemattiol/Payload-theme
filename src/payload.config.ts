import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Roles } from './collections/Roles'
import { Fonts } from './collections/Fonts'
import { Styles } from './collections/Styles'
import { Header } from './globals/Header'
import { routing } from './i18n/routing'
import { Footer } from './globals/Footer'
import { ThemeSettings } from './globals/ThemeSettings'
import { HeroBlock } from './blocks/Hero/config'
import { MultiColumnBlock } from './blocks/MultiColumn/config'
import { ImageWithTextBlock } from './blocks/ImageWithText/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  blocks: [HeroBlock, ImageWithTextBlock, MultiColumnBlock],
  collections: [Users, Roles, Fonts, Media, Pages, Styles],
  globals: [Header, Footer, ThemeSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['pages'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => (doc as { title?: string }).title ?? '',
      generateURL: ({ doc, locale }) => {
        const slug = (doc as { slug?: string }).slug
        const localeCode = typeof locale === 'string' ? locale : (locale as any)?.code ?? 'it'
        const path = slug === 'home' ? '' : `/${slug ?? ''}`
        return `${process.env.NEXT_PUBLIC_SERVER_URL}/${localeCode}${path}`
      },
    }),
  ],
  localization: {
    locales: [...routing.locales],
    defaultLocale: routing.defaultLocale,
  },
  onInit: async (payload) => {
    const defaultPages = [
      { title: 'Home', slug: 'home' },
      { title: 'Pagina non trovata', slug: '404' },
    ]
    for (const page of defaultPages) {
      const { docs } = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } },
        limit: 1,
      })
      if (docs.length === 0) {
        await payload.create({
          collection: 'pages',
          data: { ...page, _status: 'published' },
        })
      }
    }

    const { docs: existingStyles } = await payload.find({
      collection: 'styles',
      limit: 1,
    })
    if (existingStyles.length === 0) {
      await payload.create({
        collection: 'styles',
        data: {
          name: 'Default',
          slug: 'default',
          isDefault: true,
        },
      })
    }
  },
})
