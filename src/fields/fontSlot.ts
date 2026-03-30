import type { Field } from 'payload'

const WEIGHT_OPTIONS = ['100', '200', '300', '400', '500', '600', '700', '800', '900'].map(w => ({
  label: w,
  value: w,
}))

export const fontSlot = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      name: 'source',
      type: 'radio',
      label: 'Sorgente',
      options: [
        { label: 'Google Font', value: 'google' },
        { label: 'Font custom', value: 'custom' },
      ],
      defaultValue: 'google',
    },
    {
      name: 'googleFamily',
      type: 'text',
      label: 'Famiglia (es. "Inter")',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'google',
      },
    },
    {
      name: 'googleWeights',
      type: 'select',
      label: 'Pesi',
      hasMany: true,
      options: WEIGHT_OPTIONS,
      defaultValue: ['400', '700'],
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'google',
      },
    },
    {
      name: 'customFile',
      type: 'relationship',
      relationTo: 'fonts',
      label: 'File font',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom',
      },
    },
  ],
})
