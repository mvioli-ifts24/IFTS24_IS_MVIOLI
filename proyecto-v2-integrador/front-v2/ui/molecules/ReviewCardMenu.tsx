'use client'

import { EyeIcon, FlagIcon, PencilSimpleLineIcon, TrashIcon } from '@phosphor-icons/react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { EditReviewModal } from '@/features/reviewer/components/EditReviewModal'
import { type Review, ReviewsService } from '@/features/reviewer/services/reviews.service'
import { ROUTES } from '@/features/shared/constants/nav.constants'

import { ConfirmActionModal } from './ConfirmActionModal'
import { DropdownMenu, type DropdownMenuItemDef } from './DropdownMenu'

export interface ReviewCardMenuProps {
  review: Review
  onUpdated?: (updated: Review) => void
  onDeleted?: (id: number) => void
  /**
   * Items adicionales que se muestran solo en reseñas ajenas.
   * Ej: "Reseñar mismo juego".
   */
  extraItems?: DropdownMenuItemDef[]
}

/**
 * Menú de acciones de una reseña (botón de 3 puntos + modales).
 *
 * Excepción controlada en `ui/`: importa stores y tipos de dominio
 * porque es el punto de integración entre la UI y la lógica de reviewer.
 *
 * Permisos:
 * - Reseña propia → "Ver en mi perfil" (si no estás ahí), "Editar", "Eliminar"
 * - Moderador/admin sobre reseña ajena → "Denunciar"
 * - `extraItems` solo en reseñas ajenas
 *
 * Retorna `null` si no hay acciones disponibles para el usuario actual.
 */
export function ReviewCardMenu({
  extraItems = [],
  onDeleted,
  onUpdated,
  review
}: ReviewCardMenuProps) {
  const { token, user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)

  const isOwn = review.user_id === user?.id
  const isModerator = user?.role === 'moderator' || user?.role === 'admin'

  const handleConfirmDelete = async () => {
    if (!token) return

    setDeleteLoading(true)

    const response = await ReviewsService.deleteReview(token, review.id)

    if (response.error) {
      toast.error(response.error)
    } else {
      onDeleted?.(review.id)
      toast.success('Reseña eliminada.')
    }

    setDeleteLoading(false)
    setIsDeleteOpen(false)
  }

  const handleConfirmReport = async () => {
    setReportLoading(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    toast.success('Reseña denunciada. Será revisada por el equipo.')
    setReportLoading(false)
    setIsReportOpen(false)
  }

  const menuItems: DropdownMenuItemDef[] = [
    ...(isOwn
      ? [
          ...(!pathname.startsWith(`${ROUTES.perfil}/${user?.email}`)
            ? [
                {
                  icon: EyeIcon,
                  label: 'Ver en mi perfil',
                  onClick: () =>
                    router.push(`${ROUTES.perfil}/${user?.email}?highlight=review-${review.id}`)
                }
              ]
            : []),
          { icon: PencilSimpleLineIcon, label: 'Editar', onClick: () => setIsEditOpen(true) }
        ]
      : [...extraItems]),
    ...(isOwn
      ? [
          {
            icon: TrashIcon,
            label: 'Eliminar',
            onClick: () => setIsDeleteOpen(true),
            variant: 'danger' as const
          }
        ]
      : []),
    ...(isModerator && !isOwn
      ? [
          {
            icon: FlagIcon,
            label: 'Denunciar reseña',
            onClick: () => setIsReportOpen(true),
            variant: 'danger' as const
          }
        ]
      : [])
  ]

  if (menuItems.length === 0) return null

  return (
    <>
      <DropdownMenu items={menuItems} />

      {isOwn && (
        <EditReviewModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSuccess={updated => {
            onUpdated?.(updated)
            setIsEditOpen(false)
          }}
          review={review}
        />
      )}

      <ConfirmActionModal
        confirmColor="danger"
        description={`¿Estás seguro/a de que querés eliminar tu reseña de "${review.game_title}"? Esta acción no se puede deshacer.`}
        isOpen={isDeleteOpen}
        loading={deleteLoading}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar reseña"
      />

      {isModerator && !isOwn && (
        <ConfirmActionModal
          confirmColor="danger"
          description={`¿Estás seguro/a de que querés denunciar esta reseña de "${review.game_title}"?`}
          isOpen={isReportOpen}
          loading={reportLoading}
          onClose={() => setIsReportOpen(false)}
          onConfirm={handleConfirmReport}
          title="Denunciar reseña"
        />
      )}
    </>
  )
}
