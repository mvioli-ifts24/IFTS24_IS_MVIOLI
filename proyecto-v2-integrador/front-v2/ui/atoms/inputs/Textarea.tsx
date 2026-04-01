'use client'
import { type TextareaHTMLAttributes, useState } from 'react'

import { Text } from '../Text'

/**
 * Estado visual del textarea.
 * - default: apariencia normal
 * - error: borde rojo, para validaciones fallidas
 */
export type TextareaState = 'default' | 'error'

/**
 * Props para el componente Textarea.
 */
export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /**
   * ID único del textarea para asociar con la etiqueta.
   */
  id: string

  /**
   * Etiqueta flotante sobre el textarea.
   */
  label?: string

  /**
   * Estado visual del campo.
   * @default 'default'
   */
  state?: TextareaState

  /**
   * Mensaje de error a mostrar debajo del textarea.
   * Solo visible cuando `state === 'error'`.
   */
  errorMessage?: string
}

export function Textarea({
  label,
  id,
  state = 'default',
  errorMessage,
  className = '',
  maxLength,
  value,
  defaultValue,
  onChange,
  ...props
}: TextareaProps) {
  const [charCount, setCharCount] = useState(() => {
    if (value !== undefined) return String(value).length
    if (defaultValue !== undefined) return String(defaultValue).length

    return 0
  })

  const currentLength = value !== undefined ? String(value).length : charCount

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length)
    onChange?.(e)
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <Text size="xs" variant="label">
          {label}
        </Text>
      )}
      <textarea
        className={[
          'w-full resize-none rounded-lg border px-3 py-2 text-sm transition-colors outline-none',
          'bg-surface text-foreground placeholder:text-foreground/40',
          'focus:ring-1',
          state === 'error'
            ? 'border-error focus:border-error focus:ring-error'
            : 'focus:border-primary-400 focus:ring-primary-400 border-neutral-300',
          className
        ]
          .filter(Boolean)
          .join(' ')}
        defaultValue={defaultValue}
        id={id}
        maxLength={maxLength}
        onChange={handleChange}
        value={value}
        {...props}
      />
      <div className="flex items-start justify-between gap-2">
        <div>
          {errorMessage && (
            <Text className="text-error" size="xs">
              {errorMessage}
            </Text>
          )}
        </div>
        {maxLength !== undefined && (
          <Text
            className={currentLength > maxLength ? 'text-error' : 'text-foreground/40'}
            size="xs"
          >
            {currentLength}/{maxLength}
          </Text>
        )}
      </div>
    </div>
  )
}
