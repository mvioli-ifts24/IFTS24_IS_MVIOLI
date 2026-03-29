'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { AvatarUpload, Button, DatePicker, Input, Modal, Select } from '@/ui'

import {
  profileSchema,
  type ProfileFormData,
  type ProfileFormInput
} from '../../../schemas/profile.schema'
import { GameSearchItem, ProfileService } from '../../../services/profile.service'
import { useProfileStore } from '../../../store/profile.store'

import { GameSearchField } from './GameSearchField'

function gameFromProfile(
  profile: {
    favorite_game_id?: number | null
    favorite_game_title?: string | null
    favorite_game_thumbnail?: string | null
  } | null
): GameSearchItem | null {
  if (
    !profile?.favorite_game_id ||
    !profile?.favorite_game_title ||
    !profile?.favorite_game_thumbnail
  )
    return null

  return {
    id: profile?.favorite_game_id,
    title: profile?.favorite_game_title,
    thumbnail: profile?.favorite_game_thumbnail
  }
}

export function ProfileModal() {
  const { token } = useAuthStore()
  const { isOpen, close } = useModal(MODAL_IDS.EDIT_PROFILE)
  const { profile, setProfile, genders } = useProfileStore()

  const [selectedGame, setSelectedGame] = useState<GameSearchItem | null>(() =>
    gameFromProfile(profile)
  )

  const form = useForm<ProfileFormInput, unknown, ProfileFormData>({
    resolver: zodResolver(profileSchema)
  })

  const errors = form.formState.errors
  const isSubmitting = form.formState.isSubmitting
  const aboutValue = useWatch({ control: form.control, name: 'about' })

  // Sincronizar valores del formulario cuando el modal se abre
  useEffect(() => {
    if (!isOpen || !profile) return

    form.reset({
      about: profile?.about || '',
      favorite_game_id: profile?.favorite_game_id ?? undefined,
      birth_date: profile?.birth_date?.slice(0, 10) || '',
      gender_id: profile?.gender_id ? String(profile?.gender_id) : '',
      profile_picture: undefined
    })
  }, [isOpen, profile, form])

  // Cargar géneros al abrir (sólo si no están ya en el store).
  // Se guarda en el store para no repetir la llamada cada vez que se abre el modal.
  // genders.length y gendersLoading se leen como guards en runtime, NO son deps del efecto.
  useEffect(() => {
    if (!isOpen || !token) return

    const {
      genders: currentGenders,
      gendersLoading: loading,
      setGendersLoading
    } = useProfileStore.getState()

    if (currentGenders.length > 0 || loading) return

    setGendersLoading(true)

    ProfileService.getUserGenders(token).then(response => {
      if (!response.error && response.data) {
        useProfileStore.getState().setGenders(response.data)
      } else {
        useProfileStore.getState().setGendersLoading(false)
      }
    })
  }, [isOpen, token])

  const onSubmit = async (data: ProfileFormData) => {
    if (!token || !profile) return

    const response = await ProfileService.updateProfile(token, {
      about: data.about,
      favorite_game_id: selectedGame?.id ?? null,
      profile_picture: data.profile_picture,
      birth_date: data.birth_date || null,
      gender_id: data.gender_id ? Number(data.gender_id) : undefined
    })

    if (response.error || !response.data) {
      toast.error(response.error || 'No se pudieron guardar los cambios')

      return
    }

    setProfile(response.data)
    setSelectedGame(gameFromProfile(response.data))
    toast.success('Perfil actualizado')
    close()
  }

  const handleClose = () => {
    if (isSubmitting) return

    setSelectedGame(gameFromProfile(profile))
    close()
  }

  const handleFileChange = (file: File | null) => {
    form.setValue('profile_picture', file ?? undefined, { shouldDirty: true, shouldValidate: true })
  }

  if (!token || !profile) return null

  return (
    <Modal closeDisabled={isSubmitting} isOpen={isOpen} onClose={handleClose} title="Editar perfil">
      <form className="flex flex-col gap-6 py-4" onSubmit={form.handleSubmit(onSubmit)}>
        <AvatarUpload
          supportText
          disabled={isSubmitting}
          errorMessage={
            errors.profile_picture?.message ? String(errors.profile_picture.message) : undefined
          }
          fallback="icon"
          id="avatar_modal"
          initialPreviewUrl={profile?.profile_picture_url || undefined}
          onFileChange={handleFileChange}
          state={errors.profile_picture ? 'error' : 'default'}
        />

        <div className="flex flex-col gap-4">
          <DatePicker
            disabled={isSubmitting}
            errorMessage={errors.birth_date?.message}
            id="birth_date_modal"
            label="Fecha de nacimiento"
            state={errors.birth_date ? 'error' : 'default'}
            {...form.register('birth_date')}
          />

          <Select
            disabled={isSubmitting}
            errorMessage={errors.gender_id?.message}
            id="gender_id_modal"
            label="Género"
            state={errors.gender_id ? 'error' : 'default'}
            {...form.register('gender_id')}
          >
            <option value="">Seleccionar género</option>
            {genders.map(gender => (
              <option key={gender.id} value={String(gender.id)}>
                {gender.label}
              </option>
            ))}
          </Select>

          <Input
            showCounter
            currentLength={aboutValue?.length ?? 0}
            disabled={isSubmitting}
            errorMessage={errors.about?.message}
            id="about_modal"
            label="Descripción breve"
            maxLength={150}
            state={errors.about ? 'error' : 'default'}
            {...form.register('about')}
          />
          {token && (
            <GameSearchField
              disabled={isSubmitting}
              id="favorite_game_modal"
              label="Juego favorito"
              onSelect={game => {
                setSelectedGame(game)
                form.setValue('favorite_game_id', game?.id ?? null, { shouldDirty: true })
              }}
              selectedGame={selectedGame}
              token={token}
            />
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            disabled={!form.formState.isDirty || isSubmitting}
            loading={isSubmitting}
            size="sm"
            type="submit"
          >
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
