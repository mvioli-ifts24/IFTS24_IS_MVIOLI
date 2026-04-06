import Link from 'next/link'

import { Button, Heading, Text } from '@/ui'

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Heading level="h1" size="xl" variant="primary">
        Página no encontrada
      </Heading>
      <Text color="muted" size="lg">
        Lo sentimos, la página que buscas no existe.
      </Text>
      <Button href="/" variant="outlined">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  )
}
