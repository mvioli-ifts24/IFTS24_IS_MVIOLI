'use client'

import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { CardWrapper, Heading, SpinLoader, Text } from '@/ui'

export default function DashboardPage() {
  const { user } = useAuthStore()

  if (!user) return <SpinLoader />

  if (user.role === 'admin') return <AdminDashboardPage />

  return (
    <section className="mx-auto w-full max-w-5xl">
      <CardWrapper className="flex flex-col gap-3" elevation="0">
        <Heading level="h1" size="m" variant="primary">
          Dashboard
        </Heading>
        <Text color="muted">Bienvenido a tu dashboard personal</Text>
      </CardWrapper>
    </section>
  )
}
