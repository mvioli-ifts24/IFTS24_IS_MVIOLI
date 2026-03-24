'use client'

import { PlusIcon } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'

import { Avatar, type AvatarFallback, type AvatarSize } from '../atoms/Avatar'

type AvatarUploadState = 'default' | 'error' | 'success' | 'warning'

export interface AvatarUploadProps {
  /**
   * ID del input de archivo
   */
  id: string

  /**
   * Etiqueta del campo
   */
  label?: string

  /**
   * Callback al seleccionar archivo
   */
  onFileChange?: (file: File | null) => void

  /**
   * Mensaje de error a mostrar
   */
  errorMessage?: string

  /**
   * Estado del campo
   * @default 'default'
   */
  state?: AvatarUploadState

  /**
   * Tamaño del avatar
   * @default 'lg'
   *  xs = 24px, sm = 32px, m = 40px, lg = 56px, xl = 80px
   */
  avatarSize?: AvatarSize

  /**
   * Tipo de fallback del avatar
   * @default 'initials'
   */
  fallback?: AvatarFallback

  /**
   * Iniciales manuales
   */
  initials?: string

  /**
   * Nombre para iniciales automáticas
   */
  name?: string

  /**
   * Apellido para iniciales automáticas
   */
  surname?: string

  /**
   * URL externa para preview inicial
   */
  initialPreviewUrl?: string

  /**
   * Tipos de archivo permitidos
   * @default 'image/*'
   */
  accept?: string

  /**
   * Clases CSS adicionales
   */
  className?: string

  /**
   * Texto de soporte al lado del avatar
   */
  helperText?: string
}

const messageColorClasses: Record<AvatarUploadState, string> = {
  default: 'text-foreground',
  error: 'text-error',
  success: 'text-success',
  warning: 'text-warning'
}

export function AvatarUpload({
  id,
  label = 'Foto de perfil',
  onFileChange,
  errorMessage,
  state = 'default',
  avatarSize = 'lg',
  fallback = 'initials',
  name,
  surname,
  initialPreviewUrl,
  accept = 'image/*',
  className = '',
  helperText = 'Subí una foto de perfil para personalizar tu cuenta'
}: AvatarUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const localPreviewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile]
  )

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
    }
  }, [localPreviewUrl])

  const previewUrl = localPreviewUrl || initialPreviewUrl || null

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null

    setSelectedFile(file)
    onFileChange?.(file)
  }

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      <div className="mb-2 flex items-center gap-3">
        <label className="relative h-fit cursor-pointer" htmlFor={id}>
          <Avatar
            alt="Avatar de perfil"
            className=""
            fallback={fallback}
            name={name}
            size={avatarSize}
            src={previewUrl}
            surname={surname}
          />

          <span
            aria-hidden="true"
            className="bg-primary-400 text-background border-background absolute -right-0.5 bottom-0 inline-flex h-5 w-5 items-center justify-center rounded-full border"
          >
            <PlusIcon className="h-3 w-3" weight="bold" />
          </span>
        </label>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <label className="text-foreground text-sm font-medium" htmlFor={id}>
            {label}
          </label>

          <p className="text-foreground/70 text-xs">{helperText}</p>
          <span className="text-foreground/70 truncate text-xs">
            {selectedFile?.name || 'Sin archivo seleccionado'}
          </span>

          <input accept={accept} className="hidden" id={id} onChange={handleChange} type="file" />
        </div>
      </div>

      {errorMessage && state === 'error' && (
        <p className={`mt-1 text-xs ${messageColorClasses[state]}`}>{errorMessage}</p>
      )}
    </div>
  )
}
