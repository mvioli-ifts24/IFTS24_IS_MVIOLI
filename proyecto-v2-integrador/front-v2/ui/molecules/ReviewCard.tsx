import { type Review } from '@/features/reviewer/services/reviews.service'
import { ROUTES } from '@/features/shared/constants/nav.constants'

import { CardWrapper } from '../atoms/CardWrapper'
import { GameThumbnail } from '../atoms/GameThumbnail'
import { GameTitle } from '../atoms/GameTitle'
import { Separator } from '../atoms/Separator'
import { StarRating } from '../atoms/StarRating'
import { Text } from '../atoms/Text'

import { type DropdownMenuItemDef } from './DropdownMenu'
import { ReviewCardMenu } from './ReviewCardMenu'
import { UserMiniCard } from './UserMiniCard'

export interface ReviewCardProps {
  review: Review
  /** @default true */
  showAuthor?: boolean
  /** @default true */
  showGame?: boolean
  /** Activa la animación de pulso para destacar la card al navegar hacia ella. */
  highlight?: boolean
  /** @default false */
  loading?: boolean
  className?: string
  onUpdated?: (updated: Review) => void
  onDeleted?: (id: number) => void
  /**
   * Items adicionales para el menú. Solo se muestran en reseñas ajenas.
   * Ej: "Reseñar mismo juego".
   */
  extraItems?: DropdownMenuItemDef[]
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(iso))
}

export function ReviewCard({
  className = '',
  extraItems,
  highlight = false,
  loading = false,
  onDeleted,
  onUpdated,
  review,
  showAuthor = true,
  showGame = true
}: ReviewCardProps) {
  const authorHref = review.user_email ? `${ROUTES.perfil}/${review.user_email}` : undefined

  const gameHref = review.api_game_id ? `${ROUTES.juegos}/${review.api_game_id}` : undefined

  return (
    <CardWrapper
      className={`flex flex-col ${className}`.trim()}
      elevation="1"
      highlight={highlight}
      id={`review-${review.id}`}
      loading={loading}
    >
      {/* Header: autor + menú */}
      <div className="flex items-center justify-between gap-2">
        {showAuthor && (
          <UserMiniCard
            avatar={review.user_avatar}
            href={authorHref}
            name={review.user_name ?? undefined}
            surname={review.user_surname ?? undefined}
          />
        )}
        <div className={showAuthor ? '' : 'absolute top-4 right-4'}>
          <ReviewCardMenu
            extraItems={extraItems}
            onDeleted={onDeleted}
            onUpdated={onUpdated}
            review={review}
          />
        </div>
      </div>
      {showAuthor && <Separator className="mt-3 mb-4" />}

      {/* Fila principal: portada + contenido */}
      <div className="flex items-start gap-3">
        {showGame && (
          <GameThumbnail
            alt={review.game_title}
            href={gameHref}
            size="lg"
            src={review.game_thumbnail}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            {review.created_at && (
              <Text color="muted" size="2xs">
                {formatDate(review.created_at)}
              </Text>
            )}
            {showGame && <GameTitle href={gameHref} size="sm" title={review.game_title} />}
            {review.rating_id ? (
              <StarRating size={14} value={review.rating_id} />
            ) : (
              <Text color="muted" size="xs">
                Valoración: {review.rating}
              </Text>
            )}
          </div>
          <Text className="italic" color="muted" size="sm">
            &quot;{review.description}&quot;
          </Text>
        </div>
      </div>
    </CardWrapper>
  )
}
