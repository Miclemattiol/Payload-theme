import { Block } from "payload"

export const ImageWithTextBlock: Block = {
  slug: "image-with-text",
  interfaceName: "ImageWithTextBlock",
  fields: [
    {
      name: "title",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    }
  ]
}