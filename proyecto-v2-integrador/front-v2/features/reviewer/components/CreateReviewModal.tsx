'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { Button, Input, Modal, SpinLoader, StarRating, Text } from '@/ui'

import { type ReviewFormData, reviewSchema } from '../schemas/review.schema'
import { type GameItem, type Review, ReviewsService } from '../services/reviews.service'
import { useReviewsStore } from '../store/reviews.store'

const REVIEW_RATING_LABELS = ['', 'Muy malo', 'Malo', 'Normal', 'Bueno', 'Muy bueno']

export interface CreateReviewModalProps {
  onSuccess: (review: Review) => void
}

export function CreateReviewModal({ onSuccess }: CreateReviewModalProps) {
  const { token } = useAuthStore()
  const { isOpen, close } = useModal(MODAL_IDS.CREATE_REVIEW)
  const { preSelectedGame, setPreSelectedGame } = useReviewsStore()
  const [games, setGames] = useState<GameItem[]>([])
  const [gamesLoading, setGamesLoading] = useState(true)
  const [gameSearch, setGameSearch] = useState('')
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(preSelectedGame)

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: '',
      description: '',
      rating_id: 0,
      api_game_id: preSelectedGame?.id ?? (0 as unknown as number)
    }
  })

  useEffect(() => {
    // Clear the pre-selected game from the store once the modal mounts and picked it up
    if (preSelectedGame) {
      setPreSelectedGame(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const errors = form.formState.errors
  const watchedRatingId = useWatch({ control: form.control, name: 'rating_id' })

  useEffect(() => {
    if (!isOpen || !token) return

    ReviewsService.searchGames(token).then(response => {
      if (!response.error && response.data) {
        setGames(response.data)
      }

      setGamesLoading(false)
    })
  }, [isOpen, token])

  const filteredGames =
    gameSearch.length >= 2
      ? games.filter(g => g.title.toLowerCase().includes(gameSearch.toLowerCase())).slice(0, 8)
      : []

  const handleSelectGame = (game: GameItem) => {
    setSelectedGame(game)
    setGameSearch('')
    form.setValue('api_game_id', game.id, { shouldValidate: true })
  }

  const handleClearGame = () => {
    setSelectedGame(null)
    setGameSearch('')
    form.setValue('api_game_id', 0 as unknown as number)
  }

  const handleClose = () => {
    if (form.formState.isSubmitting) return

    close()
  }

  const onSubmit = async (data: ReviewFormData) => {
    if (!token || !selectedGame) return

    const response = await ReviewsService.createReview(token, {
      api_game_id: data.api_game_id,
      description: data.description,
      rating_id: data.rating_id,
      title: data.title
    })

    if (response.error || !response.data) {
      toast.error(response.error ?? 'No se pudo publicar la reseña.')

      return
    }

    const ratingLabel = REVIEW_RATING_LABELS[data.rating_id] ?? String(data.rating_id)

    const newReview: Review = {
      id: response.data.id,
      api_game_id: data.api_game_id,
      description: data.description,
      game_thumbnail: selectedGame.thumbnail,
      game_title: selectedGame.title,
      rating: ratingLabel,
      rating_id: data.rating_id,
      title: data.title
    }

    toast.success('¡Reseña publicada!')
    onSuccess(newReview)
    close()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" title="Nueva reseña">
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Selector de juego */}
        <div className="flex flex-col gap-1.5">
          <Text size="xs" variant="label">
            Juego
          </Text>

          {selectedGame ? (
            <div className="border-primary-400 bg-primary-400/5 flex items-center gap-3 rounded-lg border px-3 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={selectedGame.title}
                className="h-10 w-7 shrink-0 rounded object-cover"
                src={selectedGame.thumbnail}
              />
              <Text className="flex-1 truncate" weight="medium">
                {selectedGame.title}
              </Text>
              <button
                className="text-foreground/50 hover:text-foreground shrink-0 transition-colors"
                onClick={handleClearGame}
                type="button"
              >
                <XIcon size={16} />
              </button>
            </div>
          ) : (
            <div className="relative flex flex-col gap-1">
              <Input
                iconLeft={MagnifyingGlassIcon}
                id="game-search"
                onChange={e => setGameSearch(e.target.value)}
                placeholder="Escribí al menos 2 letras para buscar..."
                state={errors.api_game_id ? 'error' : 'default'}
                value={gameSearch}
              />

              {/* Dropdown flotante — no ocupa espacio en el flujo del documento */}
              {(gamesLoading ||
                filteredGames.length > 0 ||
                (gameSearch.length >= 2 && !gamesLoading)) && (
                <div className="bg-surface absolute top-full right-0 left-0 z-30 mt-1 rounded-lg border border-neutral-200 shadow-lg">
                  {gamesLoading && (
                    <div className="flex justify-center py-3">
                      <SpinLoader fullScreen={false} size="sm" />
                    </div>
                  )}

                  {!gamesLoading && filteredGames.length > 0 && (
                    <div className="flex max-h-52 flex-col gap-0.5 overflow-y-auto p-1">
                      {filteredGames.map(game => (
                        <button
                          key={game.id}
                          className="hover:bg-primary-400/10 flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors"
                          onClick={() => handleSelectGame(game)}
                          type="button"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt={game.title}
                            className="h-8 w-6 shrink-0 rounded object-cover"
                            src={game.thumbnail}
                          />
                          <Text size="sm">{game.title}</Text>
                        </button>
                      ))}
                    </div>
                  )}

                  {!gamesLoading && gameSearch.length >= 2 && filteredGames.length === 0 && (
                    <Text className="px-3 py-2" color="muted" size="sm">
                      No se encontraron juegos con ese nombre.
                    </Text>
                  )}
                </div>
              )}
            </div>
          )}

          {errors.api_game_id && <p className="text-error text-xs">{errors.api_game_id.message}</p>}
        </div>

        <Input
          errorMessage={errors.title?.message}
          id="title"
          label="Título de la reseña"
          state={errors.title ? 'error' : 'default'}
          {...form.register('title')}
        />

        <div className="flex flex-col gap-1">
          <Text size="xs" variant="label">
            Reseña
          </Text>
          <textarea
            className={[
              'w-full resize-none rounded-lg border px-3 py-2 text-sm transition-colors outline-none',
              'bg-surface text-foreground placeholder:text-foreground/40',
              'focus:ring-1',
              errors.description
                ? 'border-error focus:border-error focus:ring-error'
                : 'focus:border-primary-400 focus:ring-primary-400 border-neutral-300'
            ].join(' ')}
            id="description"
            placeholder="Contá tu experiencia con el juego..."
            rows={4}
            {...form.register('description')}
          />
          {errors.description && <p className="text-error text-xs">{errors.description.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Text size="xs" variant="label">
            Valoración
          </Text>
          <StarRating
            errorMessage={errors.rating_id?.message}
            onChange={v => form.setValue('rating_id', v, { shouldValidate: true })}
            size={28}
            value={watchedRatingId}
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button color="muted" onClick={handleClose} type="button" variant="outlined">
            Cancelar
          </Button>
          <Button loading={form.formState.isSubmitting} type="submit">
            Publicar reseña
          </Button>
        </div>
      </form>
    </Modal>
  )
}
