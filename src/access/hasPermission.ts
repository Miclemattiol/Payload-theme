import type { Access } from 'payload'

type Operation = 'read' | 'create' | 'update' | 'delete'

const roleCache = new WeakMap<object, any[]>()

export const hasPermission = (collectionSlug: string, operation: Operation): Access =>
  async ({ req }) => {
    const { user, payload } = req
    if (!user) return false
    if ((user as any).isAdmin) return true

    if (!roleCache.has(req)) {
      const fullUser = await payload.findByID({
        collection: 'users',
        id: user.id,
        depth: 1,
        overrideAccess: true,
      })
      roleCache.set(req, (fullUser as any).roles || [])
    }

    const roles = roleCache.get(req)!
    return roles.some((role: any) =>
      role.permissions?.some(
        (perm: any) =>
          perm.collection === collectionSlug &&
          perm.operations?.includes(operation),
      ),
    )
  }
