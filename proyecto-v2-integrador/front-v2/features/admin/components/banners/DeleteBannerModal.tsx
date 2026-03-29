'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { type Banner } from '@/features/shared/types/media.types'
import { ConfirmActionModal } from '@/ui'

import { BannersAdminService } from '../../services/banners.service'

export interface DeleteBannerModalProps {
  banner: Banner | null
  onSuccess: (bannerId: number) => void
}

export function DeleteBannerModal({ banner, onSuccess }: DeleteBannerModalProps) {
  const { token } = useAuthStore()
  const { isOpen, close } = useModal(MODAL_IDS.ADMIN_BANNER_DELETE)
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    if (isLoading) return
    close()
  }

  const handleConfirm = async () => {
    if (!token || !banner) return

    setIsLoading(true)

    try {
      const response = await BannersAdminService.remove(token, banner.id)

      if (response.error) {
        toast.error(response.error)

        return
      }

      toast.success(`Banner "${banner.name}" eliminado`)
      onSuccess(banner.id)
      close()
    } catch {
      toast.error('No se pudo conectar con el servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ConfirmActionModal
      confirmWord="eliminar"
      description={`Estás por eliminar el banner "${banner?.name ?? ''}". Esta acción es permanente e irreversible y no se puede deshacer.`}
      isOpen={isOpen}
      loading={isLoading}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Mensaje de seguridad"
    />
  )
}
