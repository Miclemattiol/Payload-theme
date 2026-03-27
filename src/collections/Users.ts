import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { hasPermission } from '@/access/hasPermission'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    admin: async (args) => Boolean(await hasPermission('admin-panel', 'read')(args)),
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req: { payload } }) => {
        if (operation !== 'create') return doc

        const { totalDocs } = await payload.count({
          collection: 'users',
          where: { isAdmin: { equals: true } },
          overrideAccess: true,
        })

        if (totalDocs === 0) {
          await payload.update({
            collection: 'users',
            id: doc.id,
            data: { isAdmin: true },
            overrideAccess: true,
          })
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'isAdmin',
      type: 'checkbox',
      defaultValue: false,
      access: {
        update: ({ req: { user } }) => Boolean(user?.isAdmin),
      },
    },
    {
      name: 'roles',
      type: 'relationship',
      relationTo: 'roles',
      hasMany: true,
      access: {
        update: ({ req: { user } }) => Boolean(user?.isAdmin),
      },
    },
  ],
}
