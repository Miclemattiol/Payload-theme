import { HeroBlock } from "@/blocks/Hero/config";
import { ImageWithTextBlock } from "@/blocks/ImageWithText/config";
import { MultiColumn } from "@/blocks/MultiColumn";
import { MultiColumnBlock } from "@/blocks/MultiColumn/config";
import { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    livePreview: {
      url: ({ data, locale }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL}/${locale}/${data.slug ?? 'home'}?preview=true`,
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
    drafts: true,
  }
}