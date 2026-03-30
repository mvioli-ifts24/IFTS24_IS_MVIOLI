'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { GameSearchField } from '@/features/shared/components/game-search/GameSearchField'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { type GameSearchItem } from '@/features/shared/types/game.types'
import { Button, Input, Modal, StarRating, Text, Textarea } from '@/ui'

import { type ReviewFormData, reviewSchema } from '../schemas/review.schema'
import { type Review, ReviewsService } from '../services/reviews.service'
import { useReviewsStore } from '../store/reviews.store'

const REVIEW_RATING_LABELS = ['', 'Muy malo', 'Malo', 'Normal', 'Bueno', 'Muy bueno']

export interface CreateReviewModalProps {
  onSuccess: (review: Review) => void
}

export function CreateReviewModal({ onSuccess }: CreateReviewModalProps) {
  const { token } = useAuthStore()
  const { isOpen, close } = useModal(MODAL_IDS.CREATE_REVIEW)
  const { preSelectedGame, setPreSelectedGame } = useReviewsStore()
  const [selectedGame, setSelectedGame] = useState<GameSearchItem | null>(preSelectedGame)

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: '',
      description: '',
      rating_id: 0,
      api_game_id: preSelectedGame?.id ?? (0 as unknown as number)
    }
  })

  const errors = form.formState.errors
  const watchedRatingId = useWatch({ control: form.control, name: 'rating_id' })

  // Limpia el juego pre-seleccionado del store al montar (evita side-effect durante render)
  useEffect(() => {
    if (preSelectedGame) setPreSelectedGame(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGameSelect = (game: GameSearchItem | null) => {
    setSelectedGame(game)
    form.setValue('api_game_id', game?.id ?? (0 as unknown as number), { shouldValidate: true })
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

  if (!token) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" title="Nueva reseña">
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Selector de juego */}
        <GameSearchField
          disabled={form.formState.isSubmitting}
          id="game-search-review"
          label="Juego"
          onSelect={handleGameSelect}
          selectedGame={selectedGame}
          token={token}
        />
        {errors.api_game_id && (
          <Text className="text-error" size="xs">
            {errors.api_game_id.message}
          </Text>
        )}

        <Input
          errorMessage={errors.title?.message}
          id="title"
          label="Título de la reseña"
          state={errors.title ? 'error' : 'default'}
          {...form.register('title')}
        />

        <Textarea
          errorMessage={errors.description?.message}
          id="description"
          label="Reseña"
          placeholder="Contá tu experiencia con el juego..."
          rows={4}
          state={errors.description ? 'error' : 'default'}
          {...form.register('description')}
        />

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
