import { Block } from "payload"
import { HeroBlock } from "../Hero/config"

export const MultiColumnBlock: Block = {
  slug: "multi-column",
  interfaceName: "MultiColumnBlock",
  fields: [
    {
      name: "columns",
      type: "array",
      fields: [
        {
          name: "content",
          type: "blocks",
          blocks: [
            HeroBlock
          ]
        },
      ]
    }
  ]
}