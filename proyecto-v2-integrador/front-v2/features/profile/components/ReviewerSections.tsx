import { Button, CardWrapper, Heading, Text } from '@/ui'

import { OwnReview } from '../services/profile.service'

type ReviewerSectionsProps = {
  reviews: OwnReview[]
  loadingReviews: boolean
}

export function ReviewerSections({ reviews, loadingReviews }: ReviewerSectionsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CardWrapper className="flex flex-col gap-4" elevation="0">
        <Heading level="h2" size="sm" variant="primary">
          Mis reseñas
        </Heading>

        {loadingReviews ? (
          <Text variant="muted">Cargando tus reseñas...</Text>
        ) : reviews.length ? (
          <div className="flex max-h-80 flex-col gap-3 overflow-auto pr-1">
            {reviews.map(review => (
              <article key={review.id} className="rounded-lg border border-neutral-200 p-3">
                <Text weight="medium">{review.game_title}</Text>
                <Text className="line-clamp-2" size="sm" variant="muted">
                  {review.description}
                </Text>
                <Text className="mt-1" size="xs" variant="muted">
                  Valoración: {review.rating}
                </Text>
              </article>
            ))}
          </div>
        ) : (
          <Text variant="muted">Todavía no creáste reseñas.</Text>
        )}
      </CardWrapper>

      <CardWrapper className="flex flex-col gap-4" elevation="0">
        <Heading level="h2" size="sm" variant="primary">
          Ayuda
        </Heading>
        <Text variant="muted">
          Si necesitás asistencia con tu cuenta o moderación, podés consultar el centro de ayuda.
        </Text>
        <Button
          className="justify-start"
          color="secondary"
          href="/dashboard/help"
          variant="outlined"
        >
          Ir a ayuda
        </Button>
      </CardWrapper>
    </div>
  )
}
