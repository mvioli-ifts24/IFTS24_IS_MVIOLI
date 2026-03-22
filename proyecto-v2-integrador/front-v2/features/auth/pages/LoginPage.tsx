import { Button, CardBorderGlow, Heading, Input, Separator, Text } from '@/ui'

export default function LoginPage() {
  return (
    <CardBorderGlow className="min-w-full p-6 md:min-w-2xl">
      <div className="flex flex-col gap-8 pt-2">
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
        <Separator className="h-1 w-full" />
        <div className="flex flex-col items-center gap-2">
          <Text size="sm">¿No tienes una cuenta? </Text>
          <Button color="secondary" href="/register" size="sm" variant="text">
            Regístrate
          </Button>
        </div>
      </div>
    </CardBorderGlow>
  )
}
