'use client'

import { useEffect } from 'react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { ROUTES } from '@/features/shared/constants/nav.constants'
import { Button, CardWrapper, Heading, ReviewCard, Text } from '@/ui'

import { ProfileService } from '../../services/profile.service'
import { useProfileStore } from '../../store/profile.store'

export function ReviewerSections() {
  const { token, user } = useAuthStore()
  const { reviews, loading, loadingReviews, setReviews, setLoadingReviews } = useProfileStore()

  const isReviewer = user?.role === 'user' || user?.role === 'moderator'

  useEffect(() => {
    if (!token || !isReviewer) return

    setLoadingReviews(true)

    ProfileService.getOwnReviews(token).then(response => {
      if (!response.error && response.data) {
        setReviews(response.data)
      }

      setLoadingReviews(false)
    })
  }, [token, isReviewer, setReviews, setLoadingReviews])

  if (!loading && !isReviewer) return null

  if (loading) {
    return <CardWrapper loading className="mx-auto w-full max-w-5xl" elevation="0" />
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CardWrapper className="flex flex-col gap-4" elevation="0" loading={loadingReviews}>
        <Heading level="h2" size="sm" variant="primary">
          Mis reseñas
        </Heading>
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
      </CardWrapper>

      <CardWrapper className="flex flex-col gap-4" elevation="0">
        <Heading level="h2" size="sm" variant="primary">
          Ayuda
        </Heading>
        <Text color="muted">
          Si necesitás asistencia con tu cuenta o moderación, podés consultar el centro de ayuda.
        </Text>
        <Button className="justify-start" color="secondary" href={ROUTES.ayuda} variant="outlined">
          Ir a ayuda
        </Button>
      </CardWrapper>
    </div>
  )
}
