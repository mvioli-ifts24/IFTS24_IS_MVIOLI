import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { ReactNode } from 'react'

import { Button, Logo, Text, ThemeToggle } from '@/ui'

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav className="flex justify-between p-2">
        <Button href="/" iconLeft={<CaretLeftIcon />} variant="action">
          Volver
        </Button>
        <ThemeToggle />
      </nav>
      <main className="bg-background flex min-h-screen flex-col items-center justify-center gap-8 px-8">
        <Logo size="m" />
        {children}
        <Text className="text-center" size="sm" variant="muted" weight="light">
          Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
        </Text>
      </main>
    </>
  )
}
