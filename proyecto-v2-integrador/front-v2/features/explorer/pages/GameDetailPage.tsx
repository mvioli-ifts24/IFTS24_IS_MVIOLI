'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { type Review } from '@/features/reviewer/services/reviews.service'
import { ROUTES } from '@/features/shared/constants/nav.constants'
import { Button, CardWrapper, Heading, ReviewCard, StarRating, Tag, Text } from '@/ui'

import {
  type GameDetail,
  type GameReviewsData,
  ExplorerService
} from '../services/explorer.service'

type GameDetailPageProps = {
  gameId: number
}

export function GameDetailPage({ gameId }: GameDetailPageProps) {
  const { token } = useAuthStore()
  const [game, setGame] = useState<GameDetail | null>(null)
  const [reviewsData, setReviewsData] = useState<GameReviewsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    Promise.all([
      ExplorerService.getGameById(token, gameId),
      ExplorerService.getGameReviews(token, gameId)
    ]).then(([gameRes, reviewsRes]) => {
      if (gameRes.error || !gameRes.data) {
        toast.error(gameRes.error ?? 'No se pudo cargar el juego.')
      } else {
        setGame(gameRes.data)
      }
      if (!reviewsRes.error && reviewsRes.data) {
        setReviewsData(reviewsRes.data)
      }
      setLoading(false)
    })
  }, [token, gameId])

  const allReviews: Review[] = reviewsData
    ? [...(reviewsData.ownReview ? [reviewsData.ownReview] : []), ...reviewsData.othersReviews]
    : []

  if (!loading && !game?.status) {
    return (
      <section className="mx-auto w-full max-w-5xl">
        <CardWrapper className="flex flex-col items-center gap-3 py-10 text-center" elevation="0">
          <Text color="muted">No se encontró el juego solicitado.</Text>
          <Button href={ROUTES.explorar} size="sm" variant="outlined">
            Volver a Explorar
          </Button>
        </CardWrapper>
      </section>
    )
  }

  return (
    <>
      {/* Card del juego */}
      <section className="mx-auto w-full max-w-5xl">
        <CardWrapper className="flex flex-col gap-4" elevation="0" loading={loading}>
          <div className="flex gap-6">
            {game?.thumbnail && (
              <Image
                alt={game.title}
                className="shrink-0 rounded-lg object-cover"
                height={113}
                src={game.thumbnail}
                width={200}
              />
            )}
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-col">
                <Heading level="h1" size="m" variant="primary">
                  {game?.title}
                </Heading>
                {game?.developer && (
                  <Text color="muted" size="2xs" variant="label">
                    {game.developer}
                  </Text>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {game?.genre && <Tag variant="secondary">{game.genre}</Tag>}
                {game?.platform && <Tag>{game.platform}</Tag>}
              </div>
              {game?.short_description && (
                <Text color="muted" size="sm">
                  {game.short_description}
                </Text>
              )}
              {reviewsData?.avg_rating != null && (
                <div className="mt-1 flex items-center gap-2">
                  <StarRating size={16} value={Math.round(reviewsData.avg_rating * 2) / 2} />
                  <Text color="muted" size="xs">
                    {reviewsData.avg_rating.toFixed(1)} ({reviewsData.review_count} reseña
                    {reviewsData.review_count !== 1 ? 's' : ''})
                  </Text>
                </div>
              )}
            </div>
          </div>
        </CardWrapper>
      </section>

      {/* Reseñas de la comunidad */}
      <section className="mx-auto w-full max-w-5xl">
        <CardWrapper className="flex flex-col gap-6" elevation="0" loading={loading}>
          <Heading level="h2" size="xs" variant="primary">
            Reseñas de la comunidad
          </Heading>

          {!loading && allReviews.length === 0 ? (
            <Text className="py-6 text-center" color="muted" size="sm">
              Este juego aún no tiene reseñas. ¡Sé el primero en opinar!
            </Text>
          ) : (
            <div className="flex flex-col gap-6">
              {allReviews.map(review => (
                <ReviewCard
                  key={review.id}
                  showAuthor
                  authorAvatar={review.user_avatar ?? undefined}
                  authorHref={
                    review.user_email
                      ? `${ROUTES.perfil}/${encodeURIComponent(review.user_email)}`
                      : undefined
                  }
                  authorName={review.user_name ?? undefined}
                  authorSurname={review.user_surname ?? undefined}
                  createdAt={review.created_at}
                  description={review.description}
                  gameThumbnail={review.game_thumbnail}
                  gameTitle={review.game_title}
                  loading={loading}
                  rating={review.rating}
                  ratingNumeric={review.rating_id}
                  showGame={false}
                />
              ))}
            </div>
          )}
        </CardWrapper>
      </section>
    </>
  )
}
