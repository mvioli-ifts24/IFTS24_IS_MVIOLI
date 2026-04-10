'use client'

import { type ReactNode } from 'react'

import { Footer } from '@/features/landing/components/Footer'
import { Navbar } from '@/features/landing/components/Navbar'
import { useAuthRouteGuard } from '@/features/shared/hooks/useAuthRouteGuard'
import { SpinLoader } from '@/ui'

export default function LandingLayout({ children }: { children: ReactNode }) {
  const { canRender } = useAuthRouteGuard({
    redirectAuthenticatedToDashboard: true
  })

  if (!canRender) {
    return <SpinLoader />
  }

  return (
    <>
      <Navbar />
      <main className="bg-background flex w-full flex-col items-center">{children}</main>
      <Footer />
    </>
  )
}
