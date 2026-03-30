'use client'

import { TrashIcon } from '@phosphor-icons/react'
import { type ReactNode } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

import { Button, type ButtonColor } from '../atoms/Button'
import { Modal } from '../atoms/Modal'
import { Text } from '../atoms/Text'
import { Input } from '../atoms/inputs/Input'

export type ConfirmActionType = 'delete' | 'edit' | 'create' | 'custom'

const AUTO_DEFAULTS: Record<
  Exclude<ConfirmActionType, 'custom'>,
  { word: string; color: ButtonColor; desc: (name: string) => string }
> = {
  delete: {
    word: 'eliminar',
    color: 'danger',
    desc: name => `Estás por eliminar "${name}". Esta acción no se puede deshacer.`
  },
  edit: {
    word: 'editar',
    color: 'primary',
    desc: name => `Estás por editar "${name}". Esta acción modificará los datos en el sistema.`
  },
  create: {
    word: 'crear',
    color: 'primary',
    desc: name => `Estás por crear un nuevo ${name} en el sistema.`
  }
}

export interface ConfirmActionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  loading?: boolean
  disabled?: boolean
  /**
   * Tipo semántico del modal. Determina los defaults de descripción, confirmWord y confirmColor.
   * - 'delete' → banner rojo con papelera, confirmWord='eliminar', confirmColor='danger'.
   * - 'edit'   → confirmWord='editar', confirmColor='primary'.
   * - 'create' → confirmWord='crear', confirmColor='primary'.
   * - 'custom' → sin defaults automáticos; los props se usan tal cual.
   * Los props explícitos siempre tienen prioridad sobre los defaults automáticos.
   */
  type?: ConfirmActionType
  /** Nombre del elemento afectado. Usado en las descripciones automáticas. Por defecto 'elemento'. */
  name?: string
  /** Sobrescribe la descripción automática cuando se pasa explícitamente. */
  description?: string
  /** Color del botón de confirmar. Sobrescribe el default del tipo. */
  confirmColor?: ButtonColor
  /**
   * Palabra de seguridad que debe escribir el usuario. Sobrescribe el default del tipo.
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
  title = 'Mensaje de seguridad',
  description,
  loading = false,
  disabled = false,
  confirmColor,
  confirmWord,
  children,
  type,
  name
}: ConfirmActionModalProps) {
  const { control, handleSubmit, reset } = useForm({ defaultValues: { word: '' } })

  const word = useWatch({ control, name: 'word', defaultValue: '' })

  const entityName = name ?? 'elemento'
  const defaults = type && type !== 'custom' ? AUTO_DEFAULTS[type] : null

  const effectiveConfirmWord = confirmWord ?? defaults?.word
  const effectiveColor: ButtonColor = confirmColor ?? defaults?.color ?? 'danger'
  const effectiveDescription = description ?? defaults?.desc(entityName) ?? ''

  const wordMatches =
    !effectiveConfirmWord || word.trim().toLowerCase() === effectiveConfirmWord.toLowerCase()
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
      initialFocus={effectiveConfirmWord ? '#confirm-action-input' : undefined}
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {type === 'delete' ? (
          <div className="bg-danger-50 dark:bg-danger-950/30 flex items-center gap-3 rounded-lg px-3 py-2.5">
            <TrashIcon className="text-danger-500 shrink-0" size={18} weight="bold" />
            <Text color="muted" size="sm">
              {effectiveDescription}
            </Text>
          </div>
        ) : (
          <Text color="muted" size="sm">
            {effectiveDescription}
          </Text>
        )}

        {children}

        {effectiveConfirmWord && (
          <div className="flex flex-col gap-1">
            <Text size="sm" weight="medium">
              Escribí{' '}
              <span className="text-secondary-500 font-semibold">
                &ldquo;{effectiveConfirmWord}&rdquo;
              </span>{' '}
              para confirmar
            </Text>
            <Controller
              control={control}
              name="word"
              render={({ field }) => (
                <Input
                  disabled={loading}
                  id="confirm-action-input"
                  placeholder={effectiveConfirmWord}
                  {...field}
                />
              )}
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button color={effectiveColor} disabled={!isConfirmable} loading={loading} type="submit">
            Confirmar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
