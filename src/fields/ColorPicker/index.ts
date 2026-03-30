import type { TextField } from 'payload'

export const colorField = (name: string, label: string, required = false): TextField => ({
  name,
  type: 'text',
  label,
  required,
  admin: {
    components: {
      Field: '@/fields/ColorPicker/Component#ColorPickerComponent',
    },
  },
})
