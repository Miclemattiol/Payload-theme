'use client'

import { useField, FieldLabel } from '@payloadcms/ui'
import { HexColorPicker } from 'react-colorful'
import { useEffect, useRef, useState } from 'react'
import type { TextFieldClientProps } from 'payload'

export const ColorPickerComponent: React.FC<TextFieldClientProps> = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path })
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', marginBottom: 16 }}>
      <FieldLabel label={field.label} required={field.required} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 4,
            border: '1px solid var(--theme-elevation-150)',
            background: value ?? '#ffffff',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        />
        <input
          type="text"
          value={value ?? ''}
          onChange={e => setValue(e.target.value)}
          placeholder="#000000"
          style={{
            flex: 1,
            height: 32,
            padding: '0 8px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 4,
            background: 'var(--theme-elevation-0)',
            color: 'var(--theme-text)',
            fontSize: 14,
          }}
        />
      </div>
      {isOpen && (
        <div style={{ position: 'absolute', zIndex: 100, marginTop: 4 }}>
          <HexColorPicker color={value ?? '#ffffff'} onChange={setValue} />
        </div>
      )}
    </div>
  )
}
