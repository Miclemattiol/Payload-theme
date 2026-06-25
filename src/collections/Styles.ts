import type { CollectionConfig, Field } from 'payload'
import { hasPermission } from '@/access/hasPermission'
import { colorField } from '@/fields/ColorPicker'
import { fontSlot } from '@/fields/fontSlot'
import { revalidateAllPages } from '@/utils/revalidate'

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

export const Styles: CollectionConfig = {
  slug: 'styles',
  labels: { singular: 'Stile', plural: 'Stili' },
  access: {
    read: () => true,
    create: hasPermission('styles', 'create'),
    update: hasPermission('styles', 'update'),
    delete: hasPermission('styles', 'delete'),
  },
  admin: {
    useAsTitle: 'name',
    livePreview: {
      url: ({ data }: { data: any }) => {
        const base = `${process.env.NEXT_PUBLIC_SERVER_URL}/it`
        if (!data?.isDefault && data?.slug) return `${base}?preview-style=${data.slug}`
        return base
      },
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        if (data.isDefault) {
          const currentId = originalDoc?.id
          const { docs } = await req.payload.find({
            collection: 'styles',
            where: currentId
              ? { and: [{ isDefault: { equals: true } }, { id: { not_equals: currentId } }] }
              : { isDefault: { equals: true } },
            limit: 100,
          })
          for (const doc of docs) {
            await req.payload.update({ collection: 'styles', id: doc.id, data: { isDefault: false } })
          }
        }
        return data
      },
    ],
    afterChange: [() => revalidateAllPages()],
    afterDelete: [() => revalidateAllPages()],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome stile',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (identificatore)',
      required: true,
      unique: true,
      admin: { description: 'Usato come attributo CSS. Solo lettere minuscole, numeri e trattini.' },
      validate: (val: string | null | undefined) => {
        if (!val) return 'Lo slug è obbligatorio.'
        if (!/^[a-z0-9-]+$/.test(val)) return 'Solo lettere minuscole, numeri e trattini.'
        return true
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      label: 'Stile predefinito',
      defaultValue: false,
      admin: { description: 'Se attivo, questo stile viene applicato automaticamente senza bisogno di selezione.' },
    },
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
      ],
    },
  ],
}
