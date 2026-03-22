'use client'
import { Button, CardBorderGlow, Heading, Separator, Text } from '@/ui'

import { RegisterForm } from '../components/RegisterForm'

export default function RegisterPage() {
  return (
    <CardBorderGlow className="min-w-full p-6 md:min-w-2xl">
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex flex-col items-center gap-2">
          <Heading className="text-center" level="h2" size="xs" variant="default" weight="medium">
            ¡Te damos la bienvenida!
          </Heading>
          <Text className="text-center" size="sm" variant="muted" weight="light">
            Crea tu cuenta para comenzar
          </Text>
        </div>

        <RegisterForm />

        <Separator className="h-1 w-full" />
        <div className="flex flex-col items-center gap-2">
          <Text size="sm">¿Ya tienes una cuenta? </Text>
          <Button color="secondary" href="/login" size="sm" variant="text">
            Inicia sesión
          </Button>
        </div>
      </div>
    </CardBorderGlow>
  )
}
