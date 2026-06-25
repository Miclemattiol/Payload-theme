'use client'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation.js'
import React, { useEffect, useState } from 'react'

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(window.self === window.top)
  }, [])

  if (!show) return null

  return (
    <PayloadLivePreview
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'}
    />
  )
}