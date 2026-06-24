import type { GlobalConfig } from 'payload'
import { hasPermission } from '@/access/hasPermission'
import { linkFields } from '@/fields/link'
import { revalidateAllPages } from '@/utils/revalidate'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: hasPermission('footer', 'update'),
  },
  hooks: {
    afterChange: [() => revalidateAllPages()],
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Colonne',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titolo colonna',
          localized: true,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Link',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Etichetta',
              localized: true,
              required: true,
            },
            ...linkFields(),
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social',
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Piattaforma',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'X / Twitter', value: 'x' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'GitHub', value: 'github' },
            { label: 'TikTok', value: 'tiktok' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright',
      localized: true,
    },
  ],
}
