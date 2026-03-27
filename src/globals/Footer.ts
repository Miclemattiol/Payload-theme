import type { GlobalConfig } from "payload";
import { hasPermission } from "@/access/hasPermission";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
    update: hasPermission('footer', 'update'),
  },
  fields: []
}
