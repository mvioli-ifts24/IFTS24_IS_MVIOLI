'use client'

import { useAuthRouteGuard } from '@/features/shared/hooks/useAuthRouteGuard'
import { SpinLoader } from '@/ui'

/**
 * Layout protegido para rutas administrativas
 *
 * Solo usuarios con rol 'admin' pueden acceder a las rutas dentro de este layout.
 * Si un usuario sin permisos intenta acceder, será redirigido a su dashboard.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { canRender } = useAuthRouteGuard({
    allowedRoles: ['admin'],
    redirectUnauthenticatedTo: '/login'
  })

  if (!canRender) {
    return <SpinLoader />
  }

  return <>{children}</>
}
