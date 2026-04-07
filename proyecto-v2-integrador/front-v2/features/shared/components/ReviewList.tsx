import { StarIcon } from '@phosphor-icons/react'
import { Fragment } from 'react'

import { type Review } from '@/features/reviewer/services/reviews.service'
import { AdBanner } from '@/features/shared/components/ad-banners/AdBanner'
import { ReviewCard, Text, type DropdownMenuItemDef } from '@/ui'

type ReviewListProps = {
  reviews: Review[]
  adEvery?: number
  emptyMessage?: string
  extraItems?: (review: Review) => DropdownMenuItemDef[]
  highlightId?: string
  loading?: boolean
  onDeleted?: (id: number) => void
  onUpdated?: (updated: Review) => void
  showAuthor?: boolean
  showGame?: boolean
}

/**
 * Lista de reseñas reutilizable.
 * Acepta cualquier tipo que satisfaga ReviewListItem:
 * tanto OwnReview (perfil propio) como Review (perfil público / feed).
 */
export function ReviewList({
  reviews,
  adEvery,
  emptyMessage = 'Todavía no hay reseñas publicadas.',
  extraItems,
  highlightId,
  loading = false,
  onDeleted,
  onUpdated,
  showAuthor = false,
  showGame
}: ReviewListProps) {
  if (reviews.length === 0) {
    if (loading) return null

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
      {reviews.map((review, i) => (
        <Fragment key={review.id}>
          <ReviewCard
            extraItems={extraItems ? extraItems(review) : undefined}
            highlight={highlightId === `review-${review.id}`}
            loading={loading}
            onDeleted={onDeleted}
            onUpdated={onUpdated}
            review={review}
            showAuthor={showAuthor}
            showGame={showGame}
          />
          {adEvery && (i + 1) % adEvery === 0 && <AdBanner mode="card" orientation="horizontal" />}
        </Fragment>
      ))}
    </div>
  )
}
