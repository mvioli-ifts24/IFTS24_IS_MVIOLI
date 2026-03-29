'use client'
import type { User } from '@/features/shared/types/user.types'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { useProfileStore } from '@/features/profile/store/profile.store'
import { SponsorsBanner } from '@/features/shared/components/SponsorsBanner'
import { useAuthRouteGuard } from '@/features/shared/hooks/useAuthRouteGuard'
import { useViewModeStore } from '@/features/shared/store/view-mode.store'

import { SpinLoader } from '../atoms/SpinLoader'
import { Breadcrumbs } from '../organisms/Breadcrumbs'
import { Navbar } from '../organisms/Navbar'
import { Sidebar } from '../organisms/Sidebar'

type UserDashboardProps = {
  children: React.ReactNode
  role: User['role'][]
}

export function UserDashboard({ children, role }: UserDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { canRender, user } = useAuthRouteGuard({
    allowedRoles: role,
    redirectUnauthenticatedTo: '/login'
  })
  const logout = useAuthStore(state => state.logout)
  const resetProfile = useProfileStore(state => state.reset)
  const { viewMode, toggle: toggleViewMode, reset: resetViewMode } = useViewModeStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    resetProfile()
    resetViewMode()
    router.push('/login')
  }

  if (!canRender || !user) {
    return <SpinLoader />
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar
        onLogout={handleLogout}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        user={user}
      />
      <div className="relative flex max-h-full flex-1 overflow-auto">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onToggleViewMode={user.role === 'admin' ? toggleViewMode : undefined}
          user={user}
          viewMode={viewMode}
        />
        <main className="bg-background flex flex-1 flex-col overflow-auto p-4 sm:p-6 lg:p-8">
          <Breadcrumbs className="mb-6" />
          <div className="flex flex-1 flex-col gap-6">{children}</div>
          <SponsorsBanner />
        </main>
      </div>
    </div>
  )
}
