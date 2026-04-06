import { StarIcon } from '@phosphor-icons/react'

import { ROUTES } from '@/features/shared/constants/nav.constants'
import { ReviewCard, Text } from '@/ui'

export type ReviewListItem = {
  id: number
  description: string
  rating: string
  rating_id?: number
  api_game_id?: number
  game_title: string
  game_thumbnail: string
  created_at?: string
}

type ReviewListProps = {
  reviews: ReviewListItem[]
  emptyMessage?: string
  showAuthor?: boolean
  loading?: boolean
}

/**
 * Lista de reseñas reutilizable.
 * Acepta cualquier tipo que satisfaga ReviewListItem:
 * tanto OwnReview (perfil propio) como Review (perfil público / feed).
 */
export function ReviewList({
  reviews,
  emptyMessage = 'Todavía no hay reseñas publicadas.',
  showAuthor = false,
  loading = false
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <StarIcon className="text-foreground/20" size={36} weight="thin" />
        <Text color="muted" size="sm">
          {emptyMessage}
        </Text>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {reviews.map(review => (
        <ReviewCard
          key={review.id}
          createdAt={review.created_at}
          description={review.description}
          gameHref={review.api_game_id ? `${ROUTES.juegos}/${review.api_game_id}` : undefined}
          gameThumbnail={review.game_thumbnail}
          gameTitle={review.game_title}
          loading={loading}
          rating={review.rating}
          ratingNumeric={review.rating_id}
          showAuthor={showAuthor}
        />
      ))}
    </div>
  )
}
