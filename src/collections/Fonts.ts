import type { CollectionConfig } from 'payload'
import { hasPermission } from '@/access/hasPermission'

export const Fonts: CollectionConfig = {
  slug: 'fonts',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: hasPermission('fonts', 'create'),
    update: hasPermission('fonts', 'update'),
    delete: hasPermission('fonts', 'delete'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome font',
      required: true,
    },
  ],
  upload: {
    mimeTypes: [
      'font/woff',
      'font/woff2',
      'font/ttf',
      'font/otf',
      'application/font-woff',
      'application/font-woff2',
    ],
  },
}
