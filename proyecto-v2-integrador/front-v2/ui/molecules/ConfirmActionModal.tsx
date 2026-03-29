'use client'

import { type ReactNode } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

import { Button, type ButtonColor } from '../atoms/Button'
import { Modal } from '../atoms/Modal'
import { Text } from '../atoms/Text'
import { Input } from '../atoms/inputs/Input'

export interface ConfirmActionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description: string
  loading?: boolean
  /**
   * Deshabilita el botón de confirmar independientemente de cualquier estado interno
   * (útil para formularios con validación externa)
   */
  disabled?: boolean
  /** Color del botón de confirmar. Por defecto 'danger'. */
  confirmColor?: ButtonColor
  /**
   * Palabra de seguridad que el usuario debe escribir para habilitar la confirmación.
   * Ejemplo: 'eliminar', 'editar', 'modificar'.
   */
  confirmWord?: string
  /**
   * Contenido adicional renderizado entre la descripción y los botones.
   * Útil para insertar un <Select> u otro control antes de confirmar.
   */
  children?: ReactNode
}

export function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  loading = false,
  disabled = false,
  confirmColor = 'danger',
  confirmWord,
  children
}: ConfirmActionModalProps) {
  const { control, handleSubmit, reset } = useForm({ defaultValues: { word: '' } })

  const word = useWatch({ control, name: 'word', defaultValue: '' })
  const wordMatches = !confirmWord || word.trim().toLowerCase() === confirmWord.toLowerCase()
  const isConfirmable = !disabled && !loading && wordMatches

  const handleClose = () => {
    if (loading) return
    reset()
    onClose()
  }

  const onSubmit = async () => {
    if (!isConfirmable) return
    await onConfirm()
    reset()
  }

  return (
    <Modal
      elevated
      closeDisabled={loading}
      initialFocus={confirmWord ? '#confirm-action-input' : undefined}
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Text color="muted" size="sm">
          {description}
        </Text>

        {children}

        {confirmWord && (
          <div className="flex flex-col gap-1">
            <Text size="sm" weight="medium">
              Escribí{' '}
              <span className="text-secondary-500 font-semibold">&ldquo;{confirmWord}&rdquo;</span>{' '}
              para confirmar
            </Text>
            <Controller
              control={control}
              name="word"
              render={({ field }) => (
                <Input
                  disabled={loading}
                  id="confirm-action-input"
                  placeholder={confirmWord}
                  {...field}
                />
              )}
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button color={confirmColor} disabled={!isConfirmable} loading={loading} type="submit">
            Confirmar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
