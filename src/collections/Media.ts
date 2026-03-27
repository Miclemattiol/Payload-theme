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
  upload: true,
}
