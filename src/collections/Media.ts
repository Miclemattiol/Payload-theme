import type { CollectionConfig } from 'payload'
import { hasPermission } from '@/access/hasPermission'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: hasPermission('media', 'create'),
    update: hasPermission('media', 'update'),
    delete: hasPermission('media', 'delete'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        crop: 'center',
      },
      {
        name: 'square',
        width: 600,
        height: 600,
        crop: 'center',
      },
      {
        name: 'card',
        width: 800,
        height: 500,
        crop: 'center',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        crop: 'center',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
}
