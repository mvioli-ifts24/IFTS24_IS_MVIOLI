'use client'

import { ImageIcon, TrashIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '../atoms/Button'
import { Text } from '../atoms/Text'

export type ImageUploadState = 'default' | 'error' | 'success'

export interface ImageUploadProps {
  /** ID del input de archivo */
  id: string

  /** Etiqueta del campo */
  label?: string

  /** Indica si el campo es obligatorio @default false */
  required?: boolean

  /** Callback al seleccionar o limpiar un archivo */
  onFileChange?: (file: File | null) => void

  /** Mensaje de error a mostrar debajo del input */
  errorMessage?: string

  /** Estado visual del campo @default 'default' */
  state?: ImageUploadState

  /** URL de imagen inicial para mostrar como vista previa */
  initialPreviewUrl?: string

  /** Texto de ayuda que se muestra debajo del input */
  helperText?: string

  /** Deshabilita el selector de imagen @default false */
  disabled?: boolean

  /**
   * Tipos de imagen aceptados. Solo se admiten imágenes.
   * @default 'image/*'
   */
  accept?: `image/${string}`

  /** Clases CSS adicionales para el contenedor */
  className?: string

  /**
   * Tamaño máximo del archivo en MB.
   * Si el archivo supera este límite se muestra un toast de error y se rechaza.
   */
  maxSizeMB?: number

  /**
   * Función de validación personalizada que se ejecuta luego del chequeo de tamaño.
   * Recibe las dimensiones reales de la imagen y el archivo.
   * Debe retornar un mensaje de error (string) si no es válido, o null si pasa.
   */
  validateImage?: (info: {
    width: number
    height: number
    sizeBytes: number
    file: File
  }) => string | null

  /**
   * Variante visual del área de carga:
   * - `dropzone`: área de arrastre grande con ícono (recomendado)
   * - `compact`: input de archivo tradicional
   * @default 'dropzone'
   */
  variant?: 'dropzone' | 'compact'

  /**
   * Proporción de la miniatura de vista previa cuando se muestra la imagen.
   * Solo aplica en variant='dropzone'.
   * @default 'landscape'
   */
  previewAspect?: 'landscape' | 'portrait' | 'square'
}

const dropzoneBorderClasses: Record<ImageUploadState, string> = {
  default: 'border-neutral-300 dark:border-neutral-200',
  error: 'border-error',
  success: 'border-success'
}

const dropzoneBgClasses: Record<ImageUploadState, string> = {
  default: 'bg-surface',
  error: 'bg-danger-50 dark:bg-danger-50/10',
  success: 'bg-secondary-50 dark:bg-secondary-50/10'
}

const previewAspectClasses: Record<NonNullable<ImageUploadProps['previewAspect']>, string> = {
  landscape: 'aspect-[3/1] max-h-28',
  portrait: 'aspect-[1/2] max-h-48 mx-auto max-w-24',
  square: 'aspect-square max-h-28'
}

export function ImageUpload({
  id,
  label,
  required = false,
  onFileChange,
  errorMessage,
  state = 'default',
  initialPreviewUrl,
  helperText,
  disabled = false,
  accept = 'image/*',
  className = '',
  variant = 'dropzone',
  previewAspect = 'landscape',
  maxSizeMB,
  validateImage
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const prevPreviewUrl = useRef<string | null>(null)

  // Limpia la object URL al desmontar
  useEffect(() => {
    return () => {
      if (prevPreviewUrl.current) URL.revokeObjectURL(prevPreviewUrl.current)
    }
  }, [])

  const applyFile = useCallback(
    (file: File | null) => {
      // Revocar URL anterior si la hay
      if (prevPreviewUrl.current) {
        URL.revokeObjectURL(prevPreviewUrl.current)
        prevPreviewUrl.current = null
      }

      const url = file ? URL.createObjectURL(file) : null

      prevPreviewUrl.current = url
      setPreviewUrl(url)
      setSelectedFile(file)
      onFileChange?.(file)
      // Limpia el input nativo para permitir re-seleccionar el mismo archivo
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    [onFileChange]
  )

  /**
   * Valida el archivo (tamaño + dimensiones) antes de aceptarlo.
   * Si no pasa la validación muestra un toast de error y rechaza el archivo.
   */
  const handleFileAccepted = useCallback(
    (file: File) => {
      if (maxSizeMB !== undefined && file.size > maxSizeMB * 1024 * 1024) {
        toast.error(
          `El archivo supera el tamaño máximo permitido de ${maxSizeMB} MB (actual: ${(file.size / 1024 / 1024).toFixed(1)} MB).`
        )

        return
      }

      if (validateImage) {
        const objectUrl = URL.createObjectURL(file)
        const img = new window.Image()

        img.onload = () => {
          URL.revokeObjectURL(objectUrl)

          const error = validateImage({
            file,
            height: img.naturalHeight,
            sizeBytes: file.size,
            width: img.naturalWidth
          })

          if (error) {
            toast.error(error)

            return
          }

          applyFile(file)
        }

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl)
          toast.error('No se pudo leer la imagen. Intentá con otro archivo.')
        }

        img.src = objectUrl
      } else {
        applyFile(file)
      }
    },
    [applyFile, maxSizeMB, validateImage]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const file = e.target.files?.[0] ?? null

    if (file) {
      handleFileAccepted(file)
    } else {
      applyFile(null)
    }
  }

  const handleDiscard = () => {
    if (disabled) return

    applyFile(null)
  }

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files?.[0] ?? null

    if (file && file.type.startsWith('image/')) {
      handleFileAccepted(file)
    }
  }

  const computedState: ImageUploadState = errorMessage ? 'error' : state
  const displayPreview = previewUrl ?? initialPreviewUrl ?? null

  if (variant === 'compact') {
    return (
      <div className={['flex flex-col gap-1.5', className].filter(Boolean).join(' ')}>
        {label && (
          <label className="text-foreground text-sm font-medium" htmlFor={id}>
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}

        {displayPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt="Vista previa"
            className={['w-full rounded object-cover', previewAspectClasses[previewAspect]].join(
              ' '
            )}
            src={displayPreview}
          />
        )}

        <input
          ref={fileInputRef}
          accept={accept}
          className={[
            'text-foreground file:bg-surface file:text-foreground w-full rounded-lg border text-sm',
            'file:mr-3 file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-neutral-200 file:px-3 file:py-2 file:text-sm',
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
            computedState === 'error' ? 'border-red-400' : 'border-neutral-200'
          ]
            .filter(Boolean)
            .join(' ')}
          disabled={disabled}
          id={id}
          onChange={handleChange}
          type="file"
        />

        {helperText && (
          <Text color="muted" size="xs">
            {helperText}
          </Text>
        )}

        {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
      </div>
    )
  }

  // variant === 'dropzone'
  return (
    <div className={['flex flex-col gap-1.5', className].filter(Boolean).join(' ')}>
      {label && (
        <label className="text-foreground text-sm font-medium" htmlFor={id}>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        accept={accept}
        className="sr-only"
        disabled={disabled}
        id={id}
        onChange={handleChange}
        tabIndex={-1}
        type="file"
      />

      {displayPreview ? (
        /* ── Estado con imagen seleccionada ── */
        <div className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Vista previa"
            className={['w-full object-cover', previewAspectClasses[previewAspect]].join(' ')}
            src={displayPreview}
          />

          {/* Overlay con acciones */}
          <div className="bg-foreground/50 absolute inset-0 flex items-center justify-center gap-2 opacity-0 backdrop-blur-sm transition-opacity hover:opacity-100">
            <Button
              color="muted"
              disabled={disabled}
              iconLeft={UploadSimpleIcon}
              onClick={() => fileInputRef.current?.click()}
              size="xs"
              type="button"
              variant="filled"
            >
              Reemplazar
            </Button>

            <Button
              color="danger"
              disabled={disabled}
              iconLeft={TrashIcon}
              onClick={handleDiscard}
              size="xs"
              type="button"
              variant="filled"
            >
              Descartar
            </Button>
          </div>

          {/* Badge de imagen guardada (cuando es initialPreview y no hay selección nueva) */}
          {!selectedFile && initialPreviewUrl && (
            <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-neutral-800/70 px-2 py-0.5 text-[10px] text-neutral-50 backdrop-blur-sm">
              <ImageIcon size={10} />
              Imagen actual
            </span>
          )}
        </div>
      ) : (
        /* ── Estado vacío: drop zone ── */
        <div
          className={[
            'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 transition-colors',
            dropzoneBorderClasses[computedState],
            dropzoneBgClasses[computedState],
            isDragging && !disabled ? 'border-primary-300 bg-primary-50 dark:bg-primary-50' : '',
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onKeyDown={e => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) fileInputRef.current?.click()
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
        >
          <div
            className={[
              'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
              isDragging && !disabled
                ? 'bg-secondary-100 text-secondary-400'
                : 'bg-secondary-50 text-secondary-300'
            ].join(' ')}
          >
            <UploadSimpleIcon size={24} weight="bold" />
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-foreground text-sm font-semibold">
              {isDragging ? 'Soltá la imagen aquí' : 'Arrastrá o seleccioná una imagen'}
            </p>

            {!isDragging && (
              <Text color="muted" size="xs">
                o hacé clic para explorar archivos
              </Text>
            )}
          </div>
        </div>
      )}

      {helperText && (
        <Text color="muted" size="xs">
          {helperText}
        </Text>
      )}

      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
    </div>
  )
}
