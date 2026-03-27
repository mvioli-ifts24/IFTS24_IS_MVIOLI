import { CardWrapper, Heading, Text } from '@/ui'

export default function AdminSponsorsPage() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <CardWrapper className="flex flex-col gap-3" elevation="0">
        <Heading level="h1" size="m" variant="primary">
          Gestión de Sponsors
        </Heading>
        <Text color="muted">Administrá los sponsors de la plataforma</Text>
      </CardWrapper>
    </section>
  )
}
