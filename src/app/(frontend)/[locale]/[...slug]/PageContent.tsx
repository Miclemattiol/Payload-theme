import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Page } from "@/payload-types";
import { RenderBlock } from "@/utils/RenderBlock";

export function PageContent({ page }: { page: Page }) {
  return (
    <div>
      <ThemeSwitcher />
      {page.content?.map((block) => <RenderBlock key={block.id} block={block} />)}
    </div>
  )
}
