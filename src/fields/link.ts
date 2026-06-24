import type { Field } from 'payload'

export const linkFields = (): Field[] => [
  {
    name: 'linkType',
    type: 'radio',
    label: 'Tipo link',
    options: [
      { label: 'Pagina interna', value: 'internal' },
      { label: 'URL esterno', value: 'external' },
    ],
    defaultValue: 'internal',
  },
  {
    name: 'page',
    type: 'relationship',
    relationTo: 'pages',
    label: 'Pagina',
    admin: {
      condition: (_, siblingData) => siblingData?.linkType !== 'external',
    },
  },
  {
    name: 'url',
    type: 'text',
    label: 'URL',
    admin: {
      condition: (_, siblingData) => siblingData?.linkType === 'external',
    },
  },
  {
    name: 'newTab',
    type: 'checkbox',
    label: 'Apri in nuova scheda',
    defaultValue: false,
    admin: {
      condition: (_, siblingData) => siblingData?.linkType === 'external',
    },
  },
]
