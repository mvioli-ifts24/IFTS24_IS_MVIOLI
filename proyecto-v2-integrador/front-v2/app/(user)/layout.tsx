'use client'

import { UserDashboard } from '@/ui'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <UserDashboard role={['user', 'moderator', 'admin']}>{children}</UserDashboard>
}
