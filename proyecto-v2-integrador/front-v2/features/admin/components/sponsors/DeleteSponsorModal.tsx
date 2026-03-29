'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { type Sponsor } from '@/features/shared/types/media.types'
import { ConfirmActionModal } from '@/ui'

import { SponsorsAdminService } from '../../services/sponsors.service'

export interface DeleteSponsorModalProps {
  sponsor: Sponsor | null
  onSuccess: (sponsorId: number) => void
}

export function DeleteSponsorModal({ sponsor, onSuccess }: DeleteSponsorModalProps) {
  const { token } = useAuthStore()
  const { isOpen, close } = useModal(MODAL_IDS.ADMIN_SPONSOR_DELETE)
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    if (isLoading) return
    close()
  }

  const handleConfirm = async () => {
    if (!token || !sponsor) return

    setIsLoading(true)

    const response = await SponsorsAdminService.remove(token, sponsor.id)

    setIsLoading(false)

    if (response.error) {
      toast.error(response.error)

      return
    }

    toast.success(`Sponsor "${sponsor.name}" eliminado`)
    onSuccess(sponsor.id)
    close()
  }

  return (
    <ConfirmActionModal
      confirmWord="eliminar"
      description={`Estás por eliminar el sponsor "${sponsor?.name ?? ''}". Esta acción es permanente e irreversible y no se puede deshacer.`}
      isOpen={isOpen}
      loading={isLoading}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Mensaje de seguridad"
    />
  )
}
