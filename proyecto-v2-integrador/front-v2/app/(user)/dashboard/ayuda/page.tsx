import { CardWrapper, Heading, Text } from '@/ui'

export default function DashboardHelpPage() {
  return (
    <section className="mx-auto w-full max-w-4xl">
      <CardWrapper className="flex flex-col gap-3" elevation="0">
        <Heading level="h1" size="m" variant="primary">
          Centro de Ayuda
        </Heading>
        <Text color="muted">
          Si tenés problemas con tu cuenta, reseñas o moderación, escribinos desde la sección de
          contacto y un administrador te responderá.
        </Text>
        <Text color="muted" size="sm">
          Tips rápidos: revisá que tu perfil esté completo, mantené una descripción clara en tus
          reseñas y evitá contenido ofensivo para cumplir las normas de la comunidad.
        </Text>
      </CardWrapper>
    </section>
  )
}
