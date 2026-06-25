'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[error.tsx]', error)
  }, [error])

  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', color: '#000' }}>
      <h1 style={{ color: '#000' }}>Errore</h1>
      <p style={{ color: '#333' }}>{error.message || 'Qualcosa è andato storto.'}</p>
      <button onClick={reset}>Riprova</button>
    </div>
  )
}
