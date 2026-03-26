import { PageSkeleton } from '@/ui'

/**
 * Skeleton compartido para todas las rutas admin:
 * /dashboard/users, /dashboard/admins, /dashboard/banners, /dashboard/sponsors
 *
 * Next.js App Router hace bubble-up del loading.tsx más cercano al ancestro,
 * por lo que este archivo aplica a todos los sub-segmentos de (admin)/.
 */
export default function AdminLoading() {
  return <PageSkeleton />
}
