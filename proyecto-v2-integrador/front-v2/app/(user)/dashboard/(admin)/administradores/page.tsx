import { CardWrapper, Heading, Text } from '@/ui'

export default function AdminAdminsPage() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <CardWrapper className="flex flex-col gap-3" elevation="0">
        <Heading level="h1" size="m" variant="primary">
          Gestión de Administradores
        </Heading>
        <Text color="muted">Administrá los administradores del sistema</Text>
      </CardWrapper>
    </section>
  )
}
