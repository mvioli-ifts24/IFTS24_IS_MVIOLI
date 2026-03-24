'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { type UserRole } from '@/shared/types/user.types'

import { useAuthHydration } from './useAuthHydration'

/**
 * Configuración del guard de autenticación para layouts y contenedores.
 */
export interface UseAuthRouteGuardOptions {
  /**
   * Roles permitidos para renderizar el contenido.
   * Si no se define, solo controla el estado autenticado/no autenticado.
   */
  allowedRoles?: UserRole[]

  /**
   * Ruta destino cuando el usuario no está autenticado.
   * Útil para layouts privados como admin o user.
   */
  redirectUnauthenticatedTo?: string

  /**
   * Si está activo, cualquier usuario autenticado vuelve a su dashboard.
   * Útil para auth/public layouts como login y registro.
   */
  redirectAuthenticatedToDashboard?: boolean
}

export function getDashboardPath(role: UserRole) {
  return role === 'admin' ? '/admin/dashboard' : '/dashboard'
}

export function useAuthRouteGuard({
  allowedRoles,
  redirectUnauthenticatedTo,
  redirectAuthenticatedToDashboard = false
}: UseAuthRouteGuardOptions = {}) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const hydrated = useAuthHydration()
  const userRole = user?.role

  useEffect(() => {
    if (!hydrated) return

    if (!isAuthenticated) {
      if (redirectUnauthenticatedTo) {
        router.push(redirectUnauthenticatedTo)
      }

      return
    }

    if (!user) return

    if (redirectAuthenticatedToDashboard) {
      router.push(getDashboardPath(user.role))

      return
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push(getDashboardPath(user.role))
    }
  }, [
    allowedRoles,
    hydrated,
    isAuthenticated,
    redirectAuthenticatedToDashboard,
    redirectUnauthenticatedTo,
    router,
    user
  ])

  const canRender = hydrated && computeCanRender()

  function computeCanRender() {
    if (redirectAuthenticatedToDashboard) {
      return !isAuthenticated
    }

    if (!isAuthenticated || !userRole) {
      return false
    }

    return !allowedRoles || allowedRoles.includes(userRole)
  }

  return {
    canRender,
    hydrated,
    isAuthenticated,
    user
  }
}
