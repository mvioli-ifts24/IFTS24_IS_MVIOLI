import { StarIcon, UserIcon } from '@phosphor-icons/react/dist/ssr'

import { AnimatedCounter, Button, Heading, Text } from '@/ui'

/**
 * Datos mockup de reviews de usuarios
 */
const userReviews = [
  {
    id: 1,
    user: 'María González',
    avatar: null,
    rating: 5,
    comment: 'Increíble plataforma, encontré juegos que no sabía que existían. ¡Recomendado 100%!',
    game: 'Cyberpunk 2077'
  },
  {
    id: 2,
    user: 'Carlos Ruiz',
    avatar: null,
    rating: 5,
    comment: 'La comunidad es genial, siempre encuentro gente para jugar en línea.',
    game: 'Apex Legends'
  },
  {
    id: 3,
    user: 'Ana Silva',
    avatar: null,
    rating: 4,
    comment: 'Buena variedad de juegos y precio justo. El servicio al cliente es excelente.',
    game: 'The Witcher 3'
  },
  {
    id: 4,
    user: 'Diego Martinez',
    avatar: null,
    rating: 5,
    comment: 'Las promociones son fantásticas, he ahorrado mucho en mis juegos favoritos.',
    game: 'FIFA 24'
  }
]

/**
 * Stats mockup que vendrán del backend
 */
const stats = [
  { label: 'USUARIOS ACTIVOS', value: 2500, suffix: 'K+', icon: UserIcon },
  { label: 'REVIEWS PUBLICADOS', value: 8200, suffix: 'K+', icon: StarIcon },
  { label: 'JUEGOS DISPONIBLES', value: 500, suffix: '+', icon: StarIcon }
]

/**
 * Review Card Component
 */
interface ReviewCardProps {
  review: (typeof userReviews)[0]
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="glass min-w-[320px] space-y-4 rounded-2xl p-6">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="from-primary-300 to-secondary-300 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r">
          <UserIcon className="text-white" size={20} weight="fill" />
        </div>
        <div>
          <Text size="sm" weight="medium">
            {review.user}
          </Text>
          <Text size="xs" variant="muted">
            {review.game}
          </Text>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={
              i < review.rating ? 'text-yellow-400' : 'text-neutral-400 dark:text-neutral-300'
            }
            size={16}
            weight={i < review.rating ? 'fill' : 'regular'}
          />
        ))}
      </div>

      {/* Comment */}
      <Text className="leading-relaxed" size="sm" variant="muted">
        &ldquo;{review.comment}&rdquo;
      </Text>
    </div>
  )
}

/**
 * Animated Stats Component
 */
interface StatItemProps {
  stat: (typeof stats)[0]
}

function StatItem({ stat }: StatItemProps) {
  const Icon = stat.icon

  return (
    <div className="space-y-2 text-center">
      <div className="from-primary-100 to-primary-100 border-primary-400/20 dark:from-primary-400/10 dark:to-secondary-400/10 inline-flex rounded-xl border bg-linear-to-r p-3">
        <Icon className="text-primary-400" size={24} />
      </div>
      <Heading level="h3" size="lg" variant="primary">
        <AnimatedCounter duration={2000} suffix={stat.suffix} targetNumber={stat.value} />
      </Heading>
      <Text size="sm" variant="muted">
        {stat.label}
      </Text>
    </div>
  )
}

/**
 * Hero Section Component
 *
 * Sección principal con reviews, stats y CTAs
 */
export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20"
      id="hero"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary-300/12 dark:bg-primary-300/16 absolute top-20 left-1/4 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-secondary-300/10 dark:bg-secondary-300/14 absolute right-1/4 bottom-20 h-80 w-80 rounded-full blur-3xl" />
        <div className="from-primary-300/8 to-secondary-300/6 dark:from-primary-300/10 dark:to-secondary-300/8 absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-linear-to-r blur-2xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Main Content */}
        <div className="mb-16 space-y-12 text-center">
          <div className="space-y-6">
            <Heading level="h1" size="xl" variant="gradient">
              TU VOZ IMPORTA EN RANK.
            </Heading>

            <Text className="mx-auto max-w-3xl" size="xl">
              Comparte tus reseñas de juegos, descubre nuevos títulos y conecta con gamers
              apasionados. Opiniones verificadas, comunidad activa y todo lo que necesitas para tu
              experiencia gaming.
            </Text>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/register" size="m" variant="filled">
              Escribir mi Primera Reseña
            </Button>
            <Button href="/reviews" size="m" variant="outlined">
              Explorar Reseñas
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map(stat => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Reviews Section */}
        <div className="space-y-8">
          <div className="text-center">
            <Heading className="mb-4" level="h2" size="lg" variant="primary">
              LO QUE DICEN NUESTROS GAMERS
            </Heading>
            <Text size="m" variant="muted">
              Reviews reales de nuestra comunidad
            </Text>
          </div>

          {/* Reviews Carousel */}
          <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-4">
            {userReviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* CTA to Reviews */}
          <div className="text-center">
            <Button href="/reviews" size="m" variant="text">
              Ver todas las reviews
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
