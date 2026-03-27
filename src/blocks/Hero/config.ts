import { Block } from "payload"

export const HeroBlock: Block = {
  slug: "hero",
  interfaceName: "HeroBlock",
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    }
  ]
}