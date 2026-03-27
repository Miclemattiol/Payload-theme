import { Hero } from '@/blocks/Hero'
import type { Page } from '@/payload-types'

type Block = NonNullable<Page['content']>[number]

export const RenderBlock = ({ block }: { block: Block }) => {
  switch (block.blockType) {
    case 'hero':
      return <Hero {...block} />
    default:
      return null
  }
}