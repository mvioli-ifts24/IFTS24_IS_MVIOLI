'use client'

import { useEffect, useState } from 'react'

import { useAuthStore } from '@/features/auth/store/auth.store'

export function useAuthHydration() {
  // Arrancamos siempre en false para evitar el crash en SSR
  // donde useAuthStore.persist todavía no existe
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // En el cliente, si ya hidratró antes de que el efecto corra
    // usamos queueMicrotask para evitar el setState síncrono dentro del effect
    if (useAuthStore.persist.hasHydrated()) {
      queueMicrotask(() => setHydrated(true))

      return
    }

    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })

    return unsub
  }, [])

  return hydrated
}
