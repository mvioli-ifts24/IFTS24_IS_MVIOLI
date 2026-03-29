'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { CardWrapper, Text } from '@/ui'

import { ProfileService } from '../../services/profile.service'
import { useProfileStore } from '../../store/profile.store'

import { ProfileHeader } from './ProfileHeader'
import { ProfileModal } from './edit-modal/ProfileModal'

export function ProfileCard() {
  const { token, updateUser } = useAuthStore()
  const { profile, loading, setProfile, setLoading } = useProfileStore()
  const { open } = useModal(MODAL_IDS.EDIT_PROFILE)
  const [formKey, setFormKey] = useState(0)

  const handleEdit = () => {
    setFormKey(k => k + 1)
    open()
  }

  useEffect(() => {
    if (!token || profile) return

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
  }, [token, profile, updateUser, setProfile, setLoading])

  const handleVerifyAccount = async () => {
    if (!token || !profile || profile?.email_verified) return

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
        loading={loading || !profile}
      >
        <ProfileHeader onEdit={handleEdit} onVerifyAccount={handleVerifyAccount} user={profile!} />
        <Text className="italic" color="muted">
          &quot;{profile?.about || 'Sin descripción'}&quot;
        </Text>
        {profile?.favorite_game_id &&
        profile?.favorite_game_title &&
        profile?.favorite_game_thumbnail ? (
          <div className="flex gap-4">
            <Image
              alt={profile?.favorite_game_title}
              className="aspect-12/16 rounded object-cover"
              height={80}
              src={profile?.favorite_game_thumbnail}
              width={45}
            />
            <div className="flex flex-col">
              <Text color="muted" size="xs" weight="medium">
                Mi juego favorito
              </Text>
              <Text weight="medium">{profile?.favorite_game_title}</Text>
            </div>
          </div>
        ) : (
          <Text color="muted" size="sm">
            Sin juego favorito seleccionado
          </Text>
        )}
      </CardWrapper>

      <ProfileModal key={formKey} />
    </>
  )
}
