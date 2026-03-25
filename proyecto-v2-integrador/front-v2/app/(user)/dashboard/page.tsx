'use client'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { SpinLoader } from '@/ui'

export default function DashboardPage() {
  const { user } = useAuthStore()

  if (!user) return <SpinLoader />

  // Para admin, mostrar su opción
  if (user.role === 'admin') {
    return (
      <div className="min-h-screen p-8">
        <h1 className="mb-6 text-4xl font-bold">Dashboard</h1>
        <p className="text-neutral-600">Accede a tu panel de administración en el menú lateral</p>
      </div>
    )
  }

  // Para user y moderator
  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-6 text-4xl font-bold">Dashboard</h1>
      <p className="text-neutral-600">Bienvenido a tu dashboard personal</p>
    </div>
  )
}
