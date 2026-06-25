import type { GlobalConfig, Field } from 'payload'
import { hasPermission } from '@/access/hasPermission'
import { revalidateAllPages } from '@/utils/revalidate'

const layoutBreakpoint = (name: string, label: string, defaultPaddingX: number): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      name: 'contentWidth',
      type: 'radio',
      label: 'Larghezza contenuto',
      options: [
        { label: 'Intera larghezza', value: 'full' },
        { label: 'Centrato', value: 'centered' },
      ],
      defaultValue: 'full',
    },
    {
      name: 'maxWidth',
      type: 'number',
      label: 'Larghezza massima (px)',
      admin: {
        condition: (_, siblingData) => siblingData?.contentWidth === 'centered',
      },
    },
    {
      name: 'paddingX',
      type: 'number',
      label: 'Padding orizzontale (px)',
      defaultValue: defaultPaddingX,
    },
  ],
})

export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  label: 'Impostazioni tema',
  access: {
    read: () => true,
    update: hasPermission('theme-settings', 'update'),
  },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/it`,
    },
  },
  hooks: {
    afterChange: [() => revalidateAllPages()],
  },
  fields: [
    {
      name: 'layout',
      type: 'group',
      label: 'Layout',
      fields: [
        layoutBreakpoint('mobile', 'Mobile', 16),
        layoutBreakpoint('tablet', 'Tablet', 32),
        layoutBreakpoint('desktop', 'Desktop', 48),
      ],
    },
  ],
}
