import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

const COLLECTION_OPTIONS = [
  { label: 'Admin Panel', value: 'admin-panel' },
  { label: 'Pages', value: 'pages' },
  { label: 'Media', value: 'media' },
  { label: 'Users', value: 'users' },
  { label: 'Header', value: 'header' },
  { label: 'Footer', value: 'footer' },
]

const OPERATION_OPTIONS = [
  { label: 'Read', value: 'read' },
  { label: 'Create', value: 'create' },
  { label: 'Update', value: 'update' },
  { label: 'Delete', value: 'delete' },
]

export const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'permissions',
      type: 'array',
      fields: [
        {
          name: 'collection',
          type: 'select',
          options: COLLECTION_OPTIONS,
          required: true,
        },
        {
          name: 'operations',
          type: 'select',
          hasMany: true,
          options: OPERATION_OPTIONS,
          required: true,
        },
      ],
    },
  ],
}
