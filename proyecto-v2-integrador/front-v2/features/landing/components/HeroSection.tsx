import { type Review } from '@/features/reviewer/services/reviews.service'
import { PublicService } from '@/features/shared/services/public.service'
import { Button, Heading, ReviewCard, Text } from '@/ui'

// ── ReviewCard tiene width mínimo usable ~280px — gap-3 (12px) → 292px/card
// Estilado obtenido de React Bits (https://www.reactbits.dev/) por su simplicidad y rendimiento

const CARD_PX = 292

// ── Fila con animación CSS pura ────────────────────────────────────────────

interface GridRowProps {
  reviews: Review[]
  reverse?: boolean
  speed?: number
}

function GridRow({ reviews, reverse = false, speed = 28 }: GridRowProps) {
  const halfWidthPx = reviews.length * CARD_PX - 12
  const duration = (halfWidthPx / speed).toFixed(1)
  const animName = reverse ? 'grid-scroll-right' : 'grid-scroll-left'
  const doubled = [...reviews, ...reviews]

  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-3"
        style={{
          animation: `${animName} ${duration}s linear infinite`,
          width: 'max-content',
          willChange: 'transform'
        }}
      >
        {doubled.map((r, i) => (
          <ReviewCard
            key={`${r.id}-${i}`}
            showAuthor
            showGame
            className="w-72 shrink-0"
            review={r}
          />
        ))}
      </div>
    </div>
  )
}

// ── Hero Section (Server Component) ───────────────────────────────────────

export async function HeroSection() {
  const res = await PublicService.getRecentReviews(32).catch(() => ({ data: null, error: null }))
  const all = (res.data ?? []) as Review[]

  // Divide en 4 filas con desplazamientos para variedad visual
  const half = Math.max(4, Math.floor(all.length / 2))
  const rows: Review[][] =
    all.length >= 8
      ? [
          all.slice(0, half),
          all.slice(Math.floor(half / 2), Math.floor(half / 2) + half),
          all.slice(half),
          all.slice(Math.floor(all.length / 4), Math.floor(all.length / 4) + half)
        ].map(r => (r.length >= 4 ? r : all.slice(0, half)))
      : []

  return (
    <section
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
      id="hero"
    >
      {/* ── Grid inclinado de reviews — solo si hay datos ── */}
      {rows.length > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-4 overflow-hidden opacity-50"
          style={{ transform: 'rotate(-8deg) scale(1.2)', transformOrigin: 'center' }}
        >
          <GridRow reviews={rows[0]} speed={28} />
          <GridRow reverse reviews={rows[1]} speed={22} />
          <GridRow reviews={rows[2]} speed={32} />
          <GridRow reverse reviews={rows[3]} speed={18} />
        </div>
      )}

      {/* ── Gradiente sobre el grid ── */}
      <div
        aria-hidden="true"
        className="from-background via-background/50 to-background pointer-events-none absolute inset-0 bg-linear-to-b"
      />

      {/* ── Blobs decorativos ── */}
      <div
        aria-hidden="true"
        className="bg-primary-300/18 dark:bg-primary-400/12 pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-secondary-300/14 dark:bg-secondary-400/10 pointer-events-none absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full blur-3xl"
      />

      {/* ── Contenido principal ── */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
        <div className="bg-primary-400/10 border-primary-400/20 inline-flex items-center gap-2 rounded-full border px-4 py-2">
          <span className="bg-primary-400 h-2 w-2 animate-pulse rounded-full" />
          <Text size="xs" weight="medium">
            Reseñas de juegos
          </Text>
        </div>

        <Heading level="h1" size="lg" variant="gradient">
          LA COMUNIDAD GAMER EN ESPAÑOL
        </Heading>

        <Text className="max-w-2xl font-light" color="muted" size="lg">
          Reseñas escritas por la comunidad hispanohablante. Un formato para comparar títulos,
          descubrir nuevos juegos y compartir tu opinión.
        </Text>

        <div className="flex w-full max-w-lg flex-col items-center gap-4 sm:flex-row">
          <Button className="w-full md:flex-1" href="/register" size="m" variant="filled">
            Escribir mi Primera Reseña
          </Button>
          <Button className="w-full md:flex-1" href="/#sobrenosotros" size="m" variant="outlined">
            Conocenos
          </Button>
        </div>
      </div>
    </section>
  )
}
