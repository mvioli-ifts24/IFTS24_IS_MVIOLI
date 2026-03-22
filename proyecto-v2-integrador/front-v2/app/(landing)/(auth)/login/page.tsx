import { Button, CardWrapper, Heading, Input, Separator, Text } from '@/ui'

export default function LoginPage() {
  return (
    <CardWrapper className="flex min-w-full flex-col gap-8 md:min-w-2xl" elevation="0" padding="md">
      <div className="flex flex-col items-center gap-2">
        <Heading className="text-center" level="h2" size="xs" variant="default" weight="medium">
          ¡Hola de nuevo!
        </Heading>
        <Text className="text-center" size="sm" variant="muted" weight="light">
          Ingresa a tu cuenta para continuar
        </Text>
      </div>
      <form className="flex flex-col gap-4">
        <Input id="email" label="Email" type="email" />
        <Input id="password" label="Contraseña" type="password" />
        <Button type="submit">Iniciar Sesión</Button>
      </form>
      <Separator />
      <div>
        <div className="flex flex-col items-center">
          <Text size="sm">¿No tienes una cuenta? </Text>
          <Button color="secondary" href="/register" size="sm" variant="action">
            Regístrate
          </Button>
        </div>
      </div>
    </CardWrapper>
  )
}
