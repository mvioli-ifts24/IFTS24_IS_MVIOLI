import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { ReactNode } from 'react'

import { Button, Logo, Text, ThemeToggle } from '@/ui'

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col justify-between gap-8">
      <div className="flex justify-between p-2">
        <Button href="/" iconLeft={<CaretLeftIcon />} size="m" variant="action" weight="normal">
          Volver
        </Button>
        <ThemeToggle size="m" />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-8 mask-no-clip px-8">
        <Logo size="m" />
        {children}
      </div>
      <Text className="px-8 pb-8 text-center" size="sm" variant="muted" weight="light">
        Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
      </Text>
    </main>
  )
}
