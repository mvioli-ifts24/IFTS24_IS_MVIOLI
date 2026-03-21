import { ReactNode } from 'react'

import { Footer } from '@/features/landing/components/Footer'
import { Navbar } from '@/features/landing/components/Navbar'

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="bg-background flex min-h-screen flex-col items-center justify-center">
        {children}
      </main>
      <Footer />
    </>
  )
}
