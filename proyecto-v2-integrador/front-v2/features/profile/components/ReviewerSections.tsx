import { Button, CardWrapper, Heading, ReviewCard, Text } from '@/ui'

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
              <ReviewCard
                key={review.id}
                description={review.description}
                gameTitle={review.game_title}
                rating={review.rating}
              />
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
