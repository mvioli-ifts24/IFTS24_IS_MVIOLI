'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { type Sponsor } from '@/features/shared/types/media.types'
import { Button, ConfirmActionModal, ImageUpload, Input, Modal } from '@/ui'

import { sponsorSchema, type SponsorFormData } from '../../schemas/sponsor.schema'
import { SponsorsAdminService } from '../../services/sponsors.service'

export interface SponsorFormModalProps {
  sponsor: Sponsor | null
  onSuccess: (sponsor: Sponsor) => void
}

/**
 * Modal de creación/edición de sponsor.
 * Se remonta con un key distinto cada vez desde el padre para reinicializar el estado.
 */
export function SponsorFormModal({ sponsor, onSuccess }: SponsorFormModalProps) {
  const { token } = useAuthStore()
  const { isOpen, close } = useModal(MODAL_IDS.ADMIN_SPONSOR_FORM)

  const isEditing = sponsor !== null

  const form = useForm<SponsorFormData>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: {
      contact: sponsor?.contact ?? '',
      link: sponsor?.link ?? '',
      name: sponsor?.name ?? ''
    }
  })

  const errors = form.formState.errors
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleClose = () => {
    if (isLoading) return

    close()
  }

  const handleSave = async () => {
    const valid = await form.trigger()

    if (!isEditing && !form.getValues('image')) {
      form.setError('image', { message: 'La imagen del sponsor es obligatoria' })
    }

    if (!valid || (!isEditing && !form.getValues('image'))) return

    setIsConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!token) return

    const data = form.getValues()
    const formData = new FormData()

    formData.append('name', data.name)
    if (data.link) formData.append('link', data.link)
    if (data.contact) formData.append('contact', data.contact)
    if (data.image) formData.append('image', data.image)

    setIsLoading(true)

    const response = isEditing
      ? await SponsorsAdminService.update(token, sponsor.id, formData)
      : await SponsorsAdminService.create(token, formData)

    setIsLoading(false)

    if (response.error || !response.data) {
      toast.error(response.error ?? 'No se pudo guardar el sponsor.')
      setIsConfirmOpen(false)

      return
    }

    toast.success(isEditing ? 'Sponsor actualizado' : 'Sponsor creado')
    onSuccess(response.data)
    setIsConfirmOpen(false)
    close()
  }

  return (
    <>
      <Modal
        closeDisabled={isLoading}
        isOpen={isOpen}
        onClose={handleClose}
        title={isEditing ? 'Editar sponsor' : 'Crear sponsor'}
      >
        <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
          <Input
            disabled={isLoading}
            errorMessage={errors.name?.message}
            id="sponsor-name"
            label="Nombre"
            state={errors.name ? 'error' : 'default'}
            {...form.register('name')}
          />

          <Input
            disabled={isLoading}
            errorMessage={errors.link?.message}
            id="sponsor-link"
            label="Enlace (opcional)"
            placeholder="https://..."
            state={errors.link ? 'error' : 'default'}
            type="url"
            {...form.register('link')}
          />

          <Input
            disabled={isLoading}
            errorMessage={errors.contact?.message}
            id="sponsor-contact"
            label="Contacto (opcional)"
            placeholder="Email, teléfono, etc."
            state={errors.contact ? 'error' : 'default'}
            {...form.register('contact')}
          />

          <ImageUpload
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            disabled={isLoading}
            errorMessage={errors.image?.message}
            helperText="Mínimo 200×80 px · Máx. 2 MB · Debe ser apaisado (más ancho que alto) · JPG, PNG, GIF o WebP"
            id="sponsor-image"
            initialPreviewUrl={sponsor?.image_url ?? undefined}
            label="Imagen"
            maxSizeMB={2}
            onFileChange={file => {
              form.setValue('image', file ?? undefined)
              if (file) form.clearErrors('image')
            }}
            previewAspect="landscape"
            required={!isEditing}
            validateImage={({ height, width }) => {
              if (width < 200 || height < 80)
                return `Resolución insuficiente (${width}×${height} px). Se necesitan al menos 200×80 px.`
              if (width / height < 1.5)
                return `La imagen (${width}×${height} px) no tiene las proporciones correctas. El logo debe ser más ancho que alto.`
              if (width / height > 5)
                return `La imagen (${width}×${height} px) no tiene las proporciones correctas. El logo no puede ser tan angosto.`

              return null
            }}
          />

          <div className="flex justify-end">
            <Button
              disabled={isLoading}
              loading={isLoading}
              onClick={handleSave}
              size="sm"
              type="button"
            >
              {isEditing ? 'Guardar cambios' : 'Crear sponsor'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmActionModal
        confirmColor="primary"
        confirmWord={isEditing ? 'editar' : 'crear'}
        description={
          isEditing
            ? `Estás por editar el sponsor "${sponsor?.name ?? ''}". Esta acción modificará los datos en el sistema.`
            : 'Estás por crear un nuevo sponsor en el sistema.'
        }
        isOpen={isConfirmOpen}
        loading={isLoading}
        onClose={() => {
          if (!isLoading) setIsConfirmOpen(false)
        }}
        onConfirm={handleConfirm}
        title="Mensaje de seguridad"
      />
    </>
  )
}
