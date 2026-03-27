import { HeroBlock } from "@/blocks/Hero/config";
import { ImageWithTextBlock } from "@/blocks/ImageWithText/config";
import { MultiColumnBlock } from "@/blocks/MultiColumn/config";
import { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/preview?slug=${data.slug ?? 'home'}&locale=${locale}`,
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
    }  
  ],
  versions: {
    drafts: {
      autosave: true,
    },
  }
}