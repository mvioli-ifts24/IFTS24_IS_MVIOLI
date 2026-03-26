'use client'

import { GearIcon, KeyIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { Button, CardWrapper, Heading, PageSkeleton, Text } from '@/ui'

import { PasswordModal } from '../components/PasswordModal'
import { PreferencesModal } from '../components/PreferencesModal'
import { ProfileHeader } from '../components/ProfileHeader'
import { ProfileModal } from '../components/ProfileModal'
import { ReviewerSections } from '../components/ReviewerSections'
import { ProfileService } from '../services/profile.service'
import { useProfileStore } from '../store/profile.store'

export function ProfilePage() {
  const { token, updateUser } = useAuthStore()
  const {
    profile,
    loading,
    reviews,
    loadingReviews,
    setProfile,
    setLoading,
    setReviews,
    setLoadingReviews
  } = useProfileStore()
  const { open: openPassword } = useModal(MODAL_IDS.CHANGE_PASSWORD)
  const { open: openPreferences } = useModal(MODAL_IDS.EDIT_PREFERENCES)

  const isReviewer = profile?.role === 'user' || profile?.role === 'moderator'

  useEffect(() => {
    if (!token || profile) return

    let cancelled = false

    const bootstrap = async () => {
      const response = await ProfileService.getOwnProfile(token)

      if (cancelled) return

      if (response.error || !response.data) {
        toast.error(response.error || 'No se pudo cargar el perfil')
        setLoading(false)

        return
      }

      setProfile(response.data)
      updateUser(response.data)
      setLoading(false)
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [token, profile, updateUser, setProfile, setLoading])

  useEffect(() => {
    const fetchReviews = async () => {
      if (!token || !isReviewer) return

      setLoadingReviews(true)
      const response = await ProfileService.getOwnReviews(token)

      if (!response.error && response.data) {
        setReviews(response.data)
      }

      setLoadingReviews(false)
    }

    fetchReviews()
  }, [isReviewer, token, setReviews, setLoadingReviews])

  const handleVerifyAccount = async () => {
    if (!token || !profile || profile.email_verified) return

    const response = await ProfileService.verifyAccount(token)

    if (response.error || !response.data) {
      toast.error(response.error || 'No se pudo verificar la cuenta')

      return
    }

    const updated = { ...profile, email_verified: response.data.email_verified }

    setProfile(updated)
    updateUser(updated)
    toast.success('Cuenta verificada')
  }

  if (!token || loading || !profile) {
    return <PageSkeleton />
  }

  return (
    <>
      <CardWrapper className="mx-auto flex w-full max-w-5xl flex-col gap-4" elevation="0">
        <ProfileHeader onVerifyAccount={handleVerifyAccount} user={profile} />
        <Text className="italic" variant="muted">
          &quot;{profile.about || 'Sin descripción'}&quot;
        </Text>
        {profile.favorite_game_id &&
        profile.favorite_game_title &&
        profile.favorite_game_thumbnail ? (
          <div className="flex gap-4">
            <Image
              alt={profile.favorite_game_title}
              className="aspect-12/16 rounded object-cover"
              height={80}
              src={profile.favorite_game_thumbnail}
              width={45}
            />
            <div className="flex flex-col">
              <Text size="xs" variant="muted" weight="medium">
                Mi juego favorito
              </Text>
              <Text weight="medium">{profile.favorite_game_title}</Text>
            </div>
          </div>
        ) : (
          <Text size="sm" variant="muted">
            Sin juego favorito seleccionado
          </Text>
        )}
      </CardWrapper>

      {isReviewer && <ReviewerSections loadingReviews={loadingReviews} reviews={reviews} />}

      <CardWrapper className="mx-auto flex w-full max-w-5xl flex-col gap-4" elevation="0">
        <Heading level="h3" size="xs" variant="primary">
          Configuración de la cuenta
        </Heading>
        <div className="flex flex-col gap-2">
          <Button
            className="w-fit"
            color="muted"
            iconLeft={<KeyIcon />}
            onClick={openPassword}
            size="sm"
            type="button"
            variant="text"
          >
            Cambiar contraseña
          </Button>
          <Button
            className="w-fit"
            color="muted"
            iconLeft={<GearIcon />}
            onClick={openPreferences}
            size="sm"
            type="button"
            variant="text"
          >
            Preferencias
          </Button>
        </div>
      </CardWrapper>

      <ProfileModal />
      <PasswordModal />
      <PreferencesModal />
    </>
  )
}
