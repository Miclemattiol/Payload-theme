import { Hero } from '@/blocks/Hero'
import { ImageWithText } from '@/blocks/ImageWithText'
import { MultiColumn } from '@/blocks/MultiColumn'
import type { Page } from '@/payload-types'

type Block = NonNullable<Page['content']>[number]

export const RenderBlock = ({ block }: { block: Block }) => {
  switch (block.blockType) {
    case 'hero':
      return <Hero {...block} />
    case 'image-with-text':
      return <ImageWithText {...block} />
    case 'multi-column':
      return <MultiColumn {...block} />
    default:
      return null
  }
}