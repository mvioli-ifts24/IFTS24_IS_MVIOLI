import { CardWrapper, Heading, Text } from '@/ui'

export default function AdminBannersPage() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <CardWrapper className="flex flex-col gap-3" elevation="0">
        <Heading level="h1" size="m" variant="primary">
          Gestión de Banners
        </Heading>
        <Text variant="muted">Administrá los banners del sitio</Text>
      </CardWrapper>
    </section>
  )
}
