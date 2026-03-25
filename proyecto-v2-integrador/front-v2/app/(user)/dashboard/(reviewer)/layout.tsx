'use client'

import { useAuthRouteGuard } from '@/shared/hooks/useAuthRouteGuard'
import { SpinLoader } from '@/ui'

/**
 * Layout para rutas de revisión
 *
 * Usuarios normales (user y moderator) pueden acceder a las rutas de review.
 * Si un usuario no autenticado intenta acceder, será redirigido a login.
 */
export default function ReviewerLayout({ children }: { children: React.ReactNode }) {
  const { canRender } = useAuthRouteGuard({
    allowedRoles: ['user', 'moderator'],
    redirectUnauthenticatedTo: '/login'
  })

  if (!canRender) {
    return <SpinLoader />
  }

  return <>{children}</>
}
