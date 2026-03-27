import { CardWrapper, Heading, Text } from '@/ui'

export default function SearchPage() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <CardWrapper className="flex flex-col gap-3" elevation="0">
        <Heading level="h1" size="m" variant="primary">
          Búsqueda
        </Heading>
        <Text color="muted">Buscá usuarios y juegos en la plataforma</Text>
      </CardWrapper>
    </section>
  )
}
