import { Hero } from '@/blocks/Hero'
import { ImageWithText } from '@/blocks/ImageWithText'
import { MultiColumn } from '@/blocks/MultiColumn'
import type { Page } from '@/payload-types'

type Block = NonNullable<Page['content']>[number]

const blockRegistry: Record<string, React.ComponentType<any>> = {
  'hero': Hero,
  'image-with-text': ImageWithText,
  'multi-column': MultiColumn,
}

export const RenderBlock = ({ block }: { block: Block }) => {
  const Component = blockRegistry[block.blockType]
  if (!Component) return null
  return <Component {...block} />
}
