import { HeroBlock } from "@/blocks/Hero/config";
import { ImageWithTextBlock } from "@/blocks/ImageWithText/config";
import { MultiColumnBlock } from "@/blocks/MultiColumn/config";
import { CollectionConfig } from "payload";
import { hasPermission } from "@/access/hasPermission";
import { revalidatePage } from "@/utils/revalidate";

const toSlug = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')

export const Pages: CollectionConfig = {
  slug: "pages",
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data?.slug) {
          data.slug = toSlug(data.title)
        }
        return data
      },
    ],
    afterChange: [
      ({ doc }) => {
        if (doc._status !== 'published') return
        revalidatePage(doc.slug)
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidatePage(doc.slug)
      },
    ],
  },
  access: {
    read: () => true,
    create: hasPermission('pages', 'create'),
    update: hasPermission('pages', 'update'),
    delete: hasPermission('pages', 'delete'),
  },
  admin: {
    useAsTitle: "title",
    livePreview: {
      url: ({ data, locale }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/preview?slug=${data.slug ?? 'home'}&locale=${typeof locale === 'string' ? locale : locale?.code}`,
    },
    
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    }, 
    {
      name: "content",
      type: "blocks",
      blocks: [
        HeroBlock,
        ImageWithTextBlock,
        MultiColumnBlock
      ]
    },
  ],
  versions: {
    drafts: {
      autosave: true,
    },
  }
}