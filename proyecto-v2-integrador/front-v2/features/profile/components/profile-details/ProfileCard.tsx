'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { type User } from '@/features/shared/types/user.types'
import { CardWrapper, Text } from '@/ui'

import { ProfileService } from '../../services/profile.service'
import { useProfileStore } from '../../store/profile.store'

import { FavoriteGameSection } from './FavoriteGameSection'
import { ProfileHeader } from './ProfileHeader'
import { ProfileModal } from './edit-modal/ProfileModal'

type ProfileCardProps = {
  /** Perfil a mostrar. Si no se pasa, carga el perfil propio desde el store. */
  user?: User
  /** Modo solo lectura: oculta botones de editar/verificar y no muestra el modal. */
  readonly?: boolean
}

export function ProfileCard({ user: userProp, readonly = false }: ProfileCardProps) {
  const { token, updateUser } = useAuthStore()
  const { profile, loading, setProfile, setLoading } = useProfileStore()
  const { open } = useModal(MODAL_IDS.EDIT_PROFILE)

  const displayUser = userProp ?? profile
  const isLoading = userProp ? false : loading || !profile

  const handleEdit = () => {
    open()
  }

  // Efecto 1: sincroniza el usuario externo al store cuando viene como prop
  useEffect(() => {
    if (!userProp) return

    setProfile(userProp)
    setLoading(false)
  }, [userProp, setProfile, setLoading])

  // Efecto 2: carga el perfil propio cuando no viene de fuera
  useEffect(() => {
    if (userProp || !token) return

    if (useProfileStore.getState().profile) return

    const fetchOwn = async () => {
      const response = await ProfileService.getOwnProfile(token)

      if (response.error || !response.data) {
        toast.error(response.error || 'No se pudo cargar el perfil')
        setLoading(false)

        return
      }

      setProfile(response.data)
      updateUser(response.data)
      setLoading(false)
    }

    fetchOwn()
  }, [userProp, token, updateUser, setProfile, setLoading])

  const handleVerifyAccount = async () => {
    if (readonly || !token || !profile || profile?.email_verified) return

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

  return (
    <>
      <CardWrapper
        className="mx-auto flex w-full max-w-5xl flex-col gap-4"
        elevation="0"
        loading={isLoading}
      >
        <ProfileHeader
          onEdit={handleEdit}
          onVerifyAccount={handleVerifyAccount}
          readonly={readonly}
          user={displayUser!}
        />
        <Text className="italic" color="muted">
          &quot;{displayUser?.about || 'Sin descripción'}&quot;
        </Text>
        <FavoriteGameSection
          gameId={displayUser?.favorite_game_id}
          gameThumbnail={displayUser?.favorite_game_thumbnail}
          gameTitle={displayUser?.favorite_game_title}
          label={readonly ? 'Juego favorito' : 'Mi juego favorito'}
        />
      </CardWrapper>

      {!readonly && <ProfileModal />}
    </>
  )
}
