import { StarIcon } from '@phosphor-icons/react'

import { type Review } from '@/features/reviewer/services/reviews.service'
import { ReviewCard, Text } from '@/ui'

type ReviewListProps = {
  reviews: Review[]
  emptyMessage?: string
  showAuthor?: boolean
  loading?: boolean
  onUpdated?: (updated: Review) => void
  onDeleted?: (id: number) => void
  /** Id del elemento a destacar con animación (ej: 'review-123') */
  highlightId?: string
}

/**
 * Lista de reseñas reutilizable.
 * Acepta cualquier tipo que satisfaga ReviewListItem:
 * tanto OwnReview (perfil propio) como Review (perfil público / feed).
 */
export function ReviewList({
  reviews,
  emptyMessage = 'Todavía no hay reseñas publicadas.',
  highlightId,
  onDeleted,
  onUpdated,
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
          highlight={highlightId === `review-${review.id}`}
          loading={loading}
          onDeleted={onDeleted}
          onUpdated={onUpdated}
          review={review}
          showAuthor={showAuthor}
        />
      ))}
    </div>
  )
}
