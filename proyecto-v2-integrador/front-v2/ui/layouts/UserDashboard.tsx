'use client'
import type { User } from '@/shared/types/user.types'

import { useState } from 'react'

import { useAuthStore } from '@/features/auth/store/auth.store'

import { Navbar } from '../organisms/Navbar'
import { Sidebar } from '../organisms/Sidebar'

type UserDashboardProps = {
  children: React.ReactNode
  role: User['role'][]
}

export function UserDashboard({ children, role }: UserDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, user } = useAuthStore()

  const hasRequiredRole = user && role.includes(user.role)

  if (!isAuthenticated || !hasRequiredRole) {
    return null
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        user={user}
      />

      <div className="flex flex-1 overflow-auto">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />

        <main className="bg-background flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
