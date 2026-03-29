'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { type User } from '@/features/shared/types/user.types'
import { ConfirmActionModal } from '@/ui'

import { UsersAdminService } from '../../services/users.service'

export interface DeleteUserModalProps {
  user: User | null
  onSuccess: (userId: number) => void
}

export function DeleteUserModal({ user, onSuccess }: DeleteUserModalProps) {
  const { token } = useAuthStore()
  const { isOpen, close } = useModal(MODAL_IDS.ADMIN_DELETE_USER)
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    if (isLoading) return
    close()
  }

  const handleConfirm = async () => {
    if (!token || !user) return

    setIsLoading(true)

    const response = await UsersAdminService.remove(token, user.id)

    setIsLoading(false)

    if (response.error) {
      toast.error(response.error)

      return
    }

    const displayName =
      user.name && user.surname ? `${user.name} ${user.surname}` : (user.name ?? user.email)

    toast.success(`Usuario ${displayName} eliminado`)
    onSuccess(user.id)
    close()
  }

  const displayName = user
    ? user.name && user.surname
      ? `${user.name} ${user.surname}`
      : (user.name ?? user.email)
    : ''

  return (
    <ConfirmActionModal
      confirmWord="eliminar"
      description={`Estás por eliminar al usuario ${displayName}. Esta acción es permanente e irreversible y no se puede deshacer.`}
      isOpen={isOpen}
      loading={isLoading}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Mensaje de seguridad"
    />
  )
}
