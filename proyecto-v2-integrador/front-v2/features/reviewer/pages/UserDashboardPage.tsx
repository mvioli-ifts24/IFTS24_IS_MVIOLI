'use client'

import {
  FlagIcon,
  FunnelIcon,
  NotePencilIcon,
  PencilSimpleLineIcon,
  PlusIcon,
  StarIcon
} from '@phosphor-icons/react'
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { ROUTES } from '@/features/shared/constants/nav.constants'
import { useTableQueryParams } from '@/features/shared/hooks/useTableQueryParams'
import { useModal } from '@/features/shared/store/modals.store'
import {
  Button,
  CardWrapper,
  ConfirmActionModal,
  DropdownMenu,
  ReviewCard,
  SpinLoader,
  StarRating,
  Text,
  type DropdownMenuItemDef
} from '@/ui'

import { CreateReviewModal } from '../components/CreateReviewModal'
import { ReviewsService, type Review } from '../services/reviews.service'
import { useReviewsStore } from '../store/reviews.store'

// Sin opción "Todas" — la deselección ocurre al volver a clickear la misma estrella

export function UserDashboardPage() {
  const { token, user } = useAuthStore()
  const { reviews, loading, setReviews, setLoading, addReview, appendReviews, setPreSelectedGame } =
    useReviewsStore()
  const { isOpen: isCreateOpen, open } = useModal(MODAL_IDS.CREATE_REVIEW)
  const [reportingReview, setReportingReview] = useState<Review | null>(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const isModerator = user?.role === 'moderator' || user?.role === 'admin'

  const { getFilter, setFilter } = useTableQueryParams()
  const ratingFilter = Number(getFilter('rating') ?? 0)
  const setRatingFilter = (v: string | number) =>
    setFilter('rating', !v || v === 0 ? null : String(v))

  useEffect(() => {
    if (!token) return

    setLoading(true)
    ReviewsService.getRecentReviews(token, ratingFilter || undefined, 1).then(response => {
      if (!response.error && response.data) {
        setReviews(response.data)
        setPage(1)
        setHasMore(response.hasMore)
      } else {
        toast.error('No se pudieron cargar las reseñas.')
        setPage(1)
        setHasMore(false)
      }

      setLoading(false)
    })
  }, [token, ratingFilter, setReviews, setLoading])

  const loadNextPage = useCallback(() => {
    if (!token || loadingMore || !hasMore) return

    const nextPage = page + 1

    setLoadingMore(true)
    ReviewsService.getRecentReviews(token, ratingFilter || undefined, nextPage).then(response => {
      if (!response.error && response.data) {
        appendReviews(response.data)
        setPage(nextPage)
        setHasMore(response.hasMore)
      }

      setLoadingMore(false)
    })
  }, [token, ratingFilter, page, hasMore, loadingMore, appendReviews])

  useEffect(() => {
    const el = sentinelRef.current

    if (!el || !hasMore || loading) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadNextPage()
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [hasMore, loading, loadNextPage])

  const handleReviewSameGame = (review: Review) => {
    setPreSelectedGame({
      id: review.api_game_id,
      thumbnail: review.game_thumbnail,
      title: review.game_title
    })
    open()
  }

  const handleConfirmReport = async () => {
    setReportLoading(true)
    // Simulamos la acción de denuncia (el endpoint aún no existe)
    await new Promise(resolve => setTimeout(resolve, 600))
    toast.success('Reseña denunciada. Será revisada por el equipo.')
    setReportLoading(false)
    setReportingReview(null)
  }

  const buildMenuItems = (review: Review): DropdownMenuItemDef[] => {
    const items: DropdownMenuItemDef[] = [
      {
        icon: PencilSimpleLineIcon,
        label: 'Reseñar',
        onClick: () => handleReviewSameGame(review)
      }
    ]

    if (isModerator) {
      items.push({
        icon: FlagIcon,
        label: 'Denunciar reseña',
        onClick: () => setReportingReview(review),
        variant: 'danger'
      })
    }

    return items
  }

  const handleReviewCreated = (review: Review) => {
    addReview(review)
  }

  return (
    <>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        {/* Feed: header fuera del CardWrapper para que el dropdown no quede recortado */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 px-1">
            <Text variant="label">Reseñas recientes</Text>
            <DropdownMenu
              align="right"
              trigger={
                <div className="relative">
                  <Button
                    color="muted"
                    iconLeft={FunnelIcon}
                    iconRight={CaretDownIcon}
                    variant="outlined"
                  >
                    Filtros
                  </Button>
                  {ratingFilter > 0 && (
                    <div className="bg-danger-400 absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full" />
                  )}
                </div>
              }
            >
              <div className="flex flex-col gap-1 p-1">
                <Text
                  className="px-1 pt-1 pb-2 tracking-wide uppercase"
                  color="muted"
                  size="xs"
                  weight="semibold"
                >
                  Valoración
                </Text>
                <div className="flex justify-center px-1 pb-1">
                  <StarRating
                    onChange={v => setRatingFilter(v === ratingFilter ? 0 : v)}
                    showLabel={false}
                    size={24}
                    value={ratingFilter}
                  />
                </div>
              </div>
            </DropdownMenu>
          </div>

          <CardWrapper
            className="flex flex-col gap-6"
            elevation="0"
            loading={loading && reviews.length === 0}
          >
            {!loading && reviews.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <StarIcon className="text-foreground/20" size={40} weight="thin" />
                <Text color="muted" size="sm">
                  {ratingFilter
                    ? 'No hay reseñas con esa valoración todavía.'
                    : 'Todavía no hay reseñas publicadas. ¡Sé el primero!'}
                </Text>
                {!ratingFilter && (
                  <Button iconLeft={PlusIcon} onClick={open} size="sm">
                    Crear la primera reseña
                  </Button>
                )}
              </div>
            )}

            {reviews.length > 0 &&
              reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  authorAvatar={review.user_avatar}
                  authorHref={
                    review.user_email
                      ? review.user_id === user?.id
                        ? '/dashboard/perfil'
                        : `/dashboard/perfil/${review.user_email}`
                      : undefined
                  }
                  authorName={review.user_name ?? undefined}
                  authorSurname={review.user_surname ?? undefined}
                  createdAt={review.created_at}
                  description={review.description}
                  gameHref={
                    review.api_game_id ? `${ROUTES.juegos}/${review.api_game_id}` : undefined
                  }
                  gameThumbnail={review.game_thumbnail}
                  gameTitle={review.game_title}
                  menuItems={buildMenuItems(review)}
                  rating={review.rating}
                  ratingNumeric={review.rating_id}
                />
              ))}

            {/* Sentinel para scroll infinito */}
            {hasMore && !loading && (
              <div ref={sentinelRef} className="flex justify-center py-4">
                {loadingMore && <SpinLoader size="m" />}
              </div>
            )}

            {!hasMore && reviews.length > 0 && (
              <div className="flex justify-center border-t border-dashed py-6">
                <Text color="muted" size="sm">
                  Ya viste todas las reseñas por ahora.
                </Text>
              </div>
            )}
          </CardWrapper>
        </div>
      </section>

      {/* FAB — Botón flotante para crear reseña */}
      <Button
        aria-label="Nueva reseña"
        className="fixed right-8 bottom-8 z-40 rounded-full!"
        color="primary"
        iconLeft={NotePencilIcon}
        onClick={open}
        size="xl"
        variant="filled"
      />
      {isCreateOpen && <CreateReviewModal onSuccess={handleReviewCreated} />}

      {/* Modal denunciar reseña */}
      <ConfirmActionModal
        confirmColor="danger"
        description={`¿Estás seguro/a de que querés denunciar la reseña de "${reportingReview?.game_title ?? ''}"? Esta acción será revisada por el equipo de moderación.`}
        isOpen={reportingReview !== null}
        loading={reportLoading}
        onClose={() => setReportingReview(null)}
        onConfirm={handleConfirmReport}
        title="Denunciar reseña"
      />
    </>
  )
}
