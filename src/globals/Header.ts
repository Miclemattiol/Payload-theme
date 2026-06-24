import type { GlobalConfig } from 'payload'
import { hasPermission } from '@/access/hasPermission'
import { linkFields } from '@/fields/link'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: hasPermission('header', 'update'),
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'nav',
      type: 'array',
      label: 'Navigazione',
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
}
