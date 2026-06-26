import { Page } from "@/payload-types";
import { RenderBlock } from "@/utils/RenderBlock";
import { Breadcrumb } from "@/components/Breadcrumb";

type CrumbItem = { label: string; url: string }

export function PageContent({
  page,
  breadcrumbs,
}: {
  page: Page
  breadcrumbs?: CrumbItem[]
}) {
  return (
    <div>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} current={page.title} />
      )}
      {page.content?.map((block) => <RenderBlock key={block.id} block={block} />)}
    </div>
  )
}
