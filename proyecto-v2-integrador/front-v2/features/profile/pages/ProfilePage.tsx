'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { ReviewsService, type Review } from '@/features/reviewer/services/reviews.service'
import { ReviewList } from '@/features/shared/components/ReviewList'
import { type User } from '@/features/shared/types/user.types'
import { Button, CardWrapper, Heading, Text } from '@/ui'

import { ProfileCard } from '../components/profile-details/ProfileCard'
import { AccountSettings } from '../components/settings/AccountSettings'
import { ProfileService } from '../services/profile.service'

type ProfilePageProps = {
  email: string
}

export function ProfilePage({ email: rawEmail }: ProfilePageProps) {
  const email = decodeURIComponent(rawEmail)
  const { token, user: authUser } = useAuthStore()
  const isOwnProfile = authUser?.email === email

  const [user, setUser] = useState<User | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    Promise.all([
      ProfileService.getUserById(token, email),
      ReviewsService.getUserReviews(token, email)
    ]).then(([userRes, reviewsRes]) => {
      if (userRes.error || !userRes.data) {
        toast.error(userRes.error ?? 'No se pudo cargar el perfil.')
      } else {
        setUser(userRes.data)
      }

      if (!reviewsRes.error && reviewsRes.data) {
        setReviews(reviewsRes.data)
      }

      setLoading(false)
    })
  }, [token, email])

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-5xl">
        <CardWrapper
          className="flex flex-col items-center gap-3 py-10 text-center"
          elevation="0"
          loading={loading}
        >
          <Text color="muted">No se encontró el perfil solicitado.</Text>
          <Button href="/dashboard" size="sm" variant="outlined">
            Volver al inicio
          </Button>
        </CardWrapper>
      </section>
    )
  }

  return (
    <>
      <ProfileCard readonly={!isOwnProfile} user={user} />
      {isOwnProfile && <AccountSettings />}

      <CardWrapper
        className="mx-auto flex w-full max-w-5xl flex-col gap-6"
        elevation="0"
        loading={loading}
      >
        <Heading level="h2" size="xs" variant="primary">
          {isOwnProfile ? 'Mis reseñas' : `Reseñas de ${user.name || 'este usuario'}`}
        </Heading>
        <ReviewList
          emptyMessage="Este usuario aún no ha publicado reseñas."
          loading={loading}
          reviews={reviews}
        />
      </CardWrapper>
    </>
  )
}
