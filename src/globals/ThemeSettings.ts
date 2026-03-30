import type { GlobalConfig, Field } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { hasPermission } from '@/access/hasPermission'
import { colorField } from '@/fields/ColorPicker'
import { fontSlot } from '@/fields/fontSlot'

const colorGroup = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    colorField('primary', 'Primario'),
    colorField('secondary', 'Secondario'),
    colorField('background', 'Sfondo'),
    colorField('surface', 'Superficie'),
    colorField('textPrimary', 'Testo principale'),
    colorField('textSecondary', 'Testo secondario'),
    colorField('border', 'Bordo'),
  ],
})

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
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Colori',
          fields: [
            colorGroup('colorsLight', 'Modalità chiara'),
            colorGroup('colorsDark', 'Modalità scura'),
          ],
        },
        {
          label: 'Tipografia',
          fields: [
            fontSlot('heading', 'Heading'),
            fontSlot('body', 'Body'),
            fontSlot('display', 'Display'),
            fontSlot('mono', 'Mono'),
            fontSlot('accent', 'Accent'),
          ],
        },
        {
          label: 'Forma',
          fields: [
            {
              name: 'shape',
              type: 'group',
              label: 'Border radius',
              fields: [
                { name: 'radiusSm', type: 'number', label: 'SM — badge, tag (px)', defaultValue: 4 },
                { name: 'radiusMd', type: 'number', label: 'MD — bottoni, input (px)', defaultValue: 8 },
                { name: 'radiusLg', type: 'number', label: 'LG — card, pannelli (px)', defaultValue: 16 },
                { name: 'radiusXl', type: 'number', label: 'XL — sezioni, modal (px)', defaultValue: 24 },
              ],
            },
          ],
        },
        {
          label: 'Layout',
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
        },
      ],
    },
  ],
}
