import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Roles } from './collections/Roles'
import { Header } from './globals/Header'
import { routing } from './i18n/routing'
import { Footer } from './globals/Footer'
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
  },
  blocks: [HeroBlock, ImageWithTextBlock, MultiColumnBlock],
  collections: [Users, Roles, Media, Pages],
  globals: [Header, Footer],
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
  plugins: [],
  localization: {
    locales: [...routing.locales],
    defaultLocale: routing.defaultLocale,
  }
})
