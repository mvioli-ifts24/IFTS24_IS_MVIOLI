'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { Button, Checkbox, Modal } from '@/ui'

import { preferencesSchema, type PreferencesFormData } from '../schemas/preferences.schema'
import { ProfileService } from '../services/profile.service'
import { useProfileStore } from '../store/profile.store'

export function PreferencesModal() {
  const { token } = useAuthStore()
  const { isOpen, close } = useModal(MODAL_IDS.EDIT_PREFERENCES)
  const { profile, updateProfile } = useProfileStore()

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      accept_newsletter: Boolean(profile?.accept_newsletter)
    }
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({ accept_newsletter: Boolean(profile?.accept_newsletter) })
    }
  }, [isOpen, profile?.accept_newsletter, form])

  const isSubmitting = form.formState.isSubmitting

  const onSubmit = async (data: PreferencesFormData) => {
    if (!token || !profile) return

    const response = await ProfileService.updateProfile(token, {
      accept_newsletter: data.accept_newsletter ? 1 : 0
    })

    if (response.error || !response.data) {
      toast.error(response.error || 'No se pudo actualizar las preferencias')

      return
    }

    updateProfile(response.data)
    toast.success('Preferencias actualizadas')
    close()
  }

  const handleClose = () => {
    if (isSubmitting) return

    close()
  }

  return (
    <Modal
      closeDisabled={isSubmitting}
      isOpen={isOpen}
      onClose={handleClose}
      title="Preferencias de la cuenta"
    >
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <Checkbox
          id="accept_newsletter"
          label="Quiero recibir newsletter"
          {...form.register('accept_newsletter')}
        />
        <div className="flex justify-end">
          <Button disabled={isSubmitting} loading={isSubmitting} size="sm" type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
