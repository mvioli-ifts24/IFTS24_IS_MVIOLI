'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { Button, Input, Modal, StarRating, Text, Textarea } from '@/ui'

import { type ReviewFormData, reviewSchema } from '../schemas/review.schema'
import { type Review, ReviewsService } from '../services/reviews.service'

const REVIEW_RATING_LABELS = ['', 'Muy malo', 'Malo', 'Normal', 'Bueno', 'Muy bueno']

export interface EditReviewModalProps {
  review: Review
  isOpen: boolean
  onClose: () => void
  onSuccess: (updated: Review) => void
}

export function EditReviewModal({ review, isOpen, onClose, onSuccess }: EditReviewModalProps) {
  const { token } = useAuthStore()

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: review.title,
      description: review.description,
      rating_id: review.rating_id,
      api_game_id: review.api_game_id
    }
  })

  const errors = form.formState.errors
  const watchedRatingId = useWatch({ control: form.control, name: 'rating_id' })

  useEffect(() => {
    form.reset({
      title: review.title,
      description: review.description,
      rating_id: review.rating_id,
      api_game_id: review.api_game_id
    })
  }, [review, form])

  const handleClose = () => {
    if (form.formState.isSubmitting) return

    onClose()
  }

  const onSubmit = async (data: ReviewFormData) => {
    if (!token) return

    const response = await ReviewsService.updateReview(token, review.id, {
      title: data.title,
      description: data.description,
      rating_id: data.rating_id,
      api_game_id: data.api_game_id
    })

    if (response.error) {
      toast.error(response.error ?? 'No se pudo actualizar la reseña.')

      return
    }

    const ratingLabel = REVIEW_RATING_LABELS[data.rating_id] ?? String(data.rating_id)

    toast.success('Reseña actualizada.')
    onSuccess({
      ...review,
      title: data.title,
      description: data.description,
      rating_id: data.rating_id,
      rating: ratingLabel
    })
    onClose()
  }

  if (!token) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" title="Editar reseña">
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Juego — solo lectura */}
        <div className="flex flex-col gap-1">
          <Text color="muted" size="xs">
            Juego
          </Text>
          <Text size="sm" weight="medium">
            {review.game_title}
          </Text>
        </div>

        <Input
          errorMessage={errors.title?.message}
          id="edit-review-title"
          label="Título de la reseña"
          state={errors.title ? 'error' : 'default'}
          {...form.register('title')}
        />

        <Textarea
          errorMessage={errors.description?.message}
          id="edit-review-description"
          label="Reseña"
          maxLength={1000}
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
          <Button loading={form.formState.isSubmitting} type="submit">
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  )
}
