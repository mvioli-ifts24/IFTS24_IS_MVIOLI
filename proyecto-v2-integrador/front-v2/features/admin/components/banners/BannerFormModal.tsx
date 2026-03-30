'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { type Banner } from '@/features/shared/types/media.types'
import { Button, ConfirmActionModal, ImageUpload, Input, Modal } from '@/ui'

import { bannerSchema, type BannerFormData } from '../../schemas/banner.schema'
import { BannersAdminService } from '../../services/banners.service'

export interface BannerFormModalProps {
  banner: Banner | null
  onSuccess: (banner: Banner) => void
}

export function BannerFormModal({ banner, onSuccess }: BannerFormModalProps) {
  const { token } = useAuthStore()
  const { isOpen, close } = useModal(MODAL_IDS.ADMIN_BANNER_FORM)

  const isEditing = banner !== null

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      contact: banner?.contact ?? '',
      link: banner?.link ?? '',
      name: banner?.name ?? ''
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

    if (!isEditing) {
      if (!form.getValues('image_horizontal')) {
        form.setError('image_horizontal', { message: 'La imagen horizontal es obligatoria' })
      }

      if (!form.getValues('image_vertical')) {
        form.setError('image_vertical', { message: 'La imagen vertical es obligatoria' })
      }
    }

    if (
      !valid ||
      (!isEditing && (!form.getValues('image_horizontal') || !form.getValues('image_vertical')))
    )
      return

    setIsConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!token) return

    const data = form.getValues()
    const formData = new FormData()

    formData.append('name', data.name)
    if (data.link) formData.append('link', data.link)
    if (data.contact) formData.append('contact', data.contact)
    if (data.image_horizontal) formData.append('image_horizontal', data.image_horizontal)
    if (data.image_vertical) formData.append('image_vertical', data.image_vertical)

    setIsLoading(true)

    try {
      const response = isEditing
        ? await BannersAdminService.update(token, banner.id, formData)
        : await BannersAdminService.create(token, formData)

      if (response.error || !response.data) {
        toast.error(response.error ?? 'No se pudo guardar el banner.')
        setIsConfirmOpen(false)

        return
      }

      toast.success(isEditing ? 'Banner actualizado' : 'Banner creado')
      onSuccess(response.data)
      setIsConfirmOpen(false)
      close()
    } catch {
      toast.error('No se pudo conectar con el servidor.')
      setIsConfirmOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Modal
        closeDisabled={isLoading}
        isOpen={isOpen}
        onClose={handleClose}
        title={isEditing ? 'Editar banner' : 'Crear banner'}
      >
        <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
          <Input
            disabled={isLoading}
            errorMessage={errors.name?.message}
            id="banner-name"
            label="Nombre"
            state={errors.name ? 'error' : 'default'}
            {...form.register('name')}
          />

          <Input
            disabled={isLoading}
            errorMessage={errors.link?.message}
            id="banner-link"
            label="Enlace (opcional)"
            placeholder="https://..."
            state={errors.link ? 'error' : 'default'}
            type="url"
            {...form.register('link')}
          />

          <Input
            disabled={isLoading}
            errorMessage={errors.contact?.message}
            id="banner-contact"
            label="Contacto (opcional)"
            placeholder="Email, teléfono, etc."
            state={errors.contact ? 'error' : 'default'}
            {...form.register('contact')}
          />

          <ImageUpload
            accept="image/jpeg,image/png,image/gif,image/webp"
            disabled={isLoading}
            errorMessage={errors.image_horizontal?.message}
            helperText="Mínimo 600×150 px · Máx. 5 MB · Debe ser más ancha que alta · JPG, PNG, GIF o WebP"
            id="banner-image-h"
            initialPreviewUrl={banner?.image_url_horizontal ?? undefined}
            label="Imagen horizontal"
            maxSizeMB={5}
            onFileChange={file => {
              form.setValue('image_horizontal', file ?? undefined)
              if (file) form.clearErrors('image_horizontal')
            }}
            previewAspect="landscape"
            required={!isEditing}
            validateImage={({ height, width }) => {
              if (width < 600 || height < 150)
                return `Resolución insuficiente (${width}×${height} px). Se necesitan al menos 600×150 px.`
              if (width / height < 2)
                return `La imagen (${width}×${height} px) no tiene las proporciones correctas. El banner horizontal debe ser más ancho que alto.`

              return null
            }}
          />

          <ImageUpload
            accept="image/jpeg,image/png,image/gif,image/webp"
            disabled={isLoading}
            errorMessage={errors.image_vertical?.message}
            helperText="Mínimo 200×400 px · Máx. 5 MB · Debe ser más alta que ancha · JPG, PNG, GIF o WebP"
            id="banner-image-v"
            initialPreviewUrl={banner?.image_url_vertical ?? undefined}
            label="Imagen vertical"
            maxSizeMB={5}
            onFileChange={file => {
              form.setValue('image_vertical', file ?? undefined)
              if (file) form.clearErrors('image_vertical')
            }}
            previewAspect="portrait"
            required={!isEditing}
            validateImage={({ height, width }) => {
              if (width < 200 || height < 400)
                return `Resolución insuficiente (${width}×${height} px). Se necesitan al menos 200×400 px.`
              if (height / width < 2)
                return `La imagen (${width}×${height} px) no tiene las proporciones correctas. El banner vertical debe ser más alto que ancho.`

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
              {isEditing ? 'Guardar cambios' : 'Crear banner'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmActionModal
        isOpen={isConfirmOpen}
        loading={isLoading}
        name={banner?.name ?? 'banner'}
        onClose={() => {
          if (!isLoading) setIsConfirmOpen(false)
        }}
        onConfirm={handleConfirm}
        title="Mensaje de seguridad"
        type={isEditing ? 'edit' : 'create'}
      />
    </>
  )
}
