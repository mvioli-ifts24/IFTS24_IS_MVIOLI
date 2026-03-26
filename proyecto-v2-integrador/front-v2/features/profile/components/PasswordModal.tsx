'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { Button, Input, Modal } from '@/ui'

import {
  passwordSchema,
  type PasswordFormData,
  type PasswordFormInput
} from '../schemas/password.schema'
import { ProfileService } from '../services/profile.service'

export function PasswordModal() {
  const { token } = useAuthStore()
  const { isOpen, close } = useModal(MODAL_IDS.CHANGE_PASSWORD)

  const form = useForm<PasswordFormInput, unknown, PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  })

  const errors = form.formState.errors
  const isSubmitting = form.formState.isSubmitting

  const onSubmit = async (data: PasswordFormData) => {
    if (!token) return

    const response = await ProfileService.changePassword(token, data)

    if (response.error || !response.data) {
      toast.error(response.error || 'No se pudo cambiar la contraseña')

      return
    }

    toast.success('Contraseña actualizada')
    form.reset()
    close()
  }

  const handleClose = () => {
    if (isSubmitting) return

    form.reset()
    close()
  }

  return (
    <Modal
      closeDisabled={isSubmitting}
      isOpen={isOpen}
      onClose={handleClose}
      title="Cambiar contraseña"
    >
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <Input
          disabled={isSubmitting}
          errorMessage={errors.current_password?.message}
          id="current_password"
          label="Contraseña actual"
          state={errors.current_password ? 'error' : 'default'}
          type="password"
          {...form.register('current_password')}
        />
        <Input
          disabled={isSubmitting}
          errorMessage={errors.new_password?.message}
          id="new_password"
          label="Nueva contraseña"
          state={errors.new_password ? 'error' : 'default'}
          type="password"
          {...form.register('new_password')}
        />
        <Input
          disabled={isSubmitting}
          errorMessage={errors.confirm_password?.message}
          id="confirm_password"
          label="Confirmar nueva contraseña"
          state={errors.confirm_password ? 'error' : 'default'}
          type="password"
          {...form.register('confirm_password')}
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
