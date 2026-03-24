'use client'

import { UserDashboard } from '@/ui'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <UserDashboard role={['admin']}>{children}</UserDashboard>
}
