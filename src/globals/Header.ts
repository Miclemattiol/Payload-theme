import type { GlobalConfig } from "payload";
import { hasPermission } from "@/access/hasPermission";

export const Header: GlobalConfig = {
  slug: "header",
  access: {
    read: () => true,
    update: hasPermission('header', 'update'),
  },
  fields: []
}
