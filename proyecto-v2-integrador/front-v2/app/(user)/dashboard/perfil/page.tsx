'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { SpinLoader } from '@/ui'

/**
 * Redirige automáticamente al perfil del usuario autenticado.
 * La URL canónica del perfil es /dashboard/perfil/{email}.
 */
export default function ProfileRedirect() {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (user?.email) {
      router.replace(`/dashboard/perfil/${user.email}`)
    }
  }, [user, router])

  return (
    <div className="flex min-h-40 items-center justify-center">
      <SpinLoader fullScreen={false} label="Cargando perfil..." size="m" />
    </div>
  )
}
