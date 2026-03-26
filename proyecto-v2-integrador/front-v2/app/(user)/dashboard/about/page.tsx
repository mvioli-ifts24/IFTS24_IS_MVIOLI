import { CardWrapper, Heading, Text } from '@/ui'

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-4xl">
      <CardWrapper className="flex flex-col gap-3" elevation="0">
        <Heading level="h1" size="m" variant="primary">
          Sobre Nosotros
        </Heading>
        <Text variant="muted">Conocé al equipo de desarrolladores y nuestro instituto</Text>
      </CardWrapper>
    </section>
  )
}
