'use client'

import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { UserDashboardPage } from '@/features/reviewer/pages/UserDashboardPage'
import { useViewModeStore } from '@/features/shared/store/view-mode.store'
import { SpinLoader } from '@/ui'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { viewMode } = useViewModeStore()

  if (!user) return <SpinLoader />

  if (user.role === 'admin' && viewMode === 'admin') return <AdminDashboardPage />

  return <UserDashboardPage />
}
