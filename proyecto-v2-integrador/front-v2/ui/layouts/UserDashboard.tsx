'use client'
import type { User } from '@/features/shared/types/user.types'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { useProfileStore } from '@/features/profile/store/profile.store'
import { useAuthRouteGuard } from '@/features/shared/hooks/useAuthRouteGuard'

import { SpinLoader } from '../atoms/SpinLoader'
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
  const router = useRouter()

  const handleLogout = () => {
    logout()
    resetProfile()
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
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
        <main className="bg-background flex flex-1 flex-col gap-6 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
