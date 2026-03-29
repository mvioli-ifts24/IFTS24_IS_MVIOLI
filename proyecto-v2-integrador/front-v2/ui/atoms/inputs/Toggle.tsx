import { type InputHTMLAttributes, type ReactNode, useId } from 'react'

import { Text } from '../Text'

export type ToggleColor = 'primary' | 'secondary'

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * ID único del toggle. Si no se provee, se genera automáticamente.
   */
  id?: string

  /**
   * Etiqueta visible a la izquierda del track.
   */
  labelLeft?: ReactNode

  /**
   * Etiqueta visible a la derecha del track.
   */
  label?: ReactNode

  /**
   * Color del track cuando el toggle está activo.
   * @default 'primary'
   */
  color?: ToggleColor

  /**
   * Clases CSS adicionales del contenedor.
   */
  className?: string
}

const TRACK_COLOR: Record<ToggleColor, string> = {
  primary: 'peer-checked:bg-primary-400',
  secondary: 'peer-checked:bg-secondary-300'
}

const RING_COLOR: Record<ToggleColor, string> = {
  primary: 'peer-focus:ring-primary-100',
  secondary: 'peer-focus:ring-secondary-100'
}

/**
 * Componente Toggle (switch) accesible.
 *
 * Uso básico:
 * ```tsx
 * <Toggle id="mi-toggle" label="Activar modo oscuro" checked={val} onChange={handler} />
 * ```
 */
export function Toggle({
  id,
  label,
  labelLeft,
  color = 'primary',
  className = '',
  ...props
}: ToggleProps) {
  const uid = useId()
  const toggleId = id ?? uid

  return (
    <label
      className={['inline-flex cursor-pointer items-center gap-3', className]
        .filter(Boolean)
        .join(' ')}
      htmlFor={toggleId}
    >
      <input className="peer sr-only" id={toggleId} type="checkbox" {...props} />

      {labelLeft && (
        <Text className="select-none" size="2xs" variant="label">
          {labelLeft}{' '}
        </Text>
      )}

      {/* Track + Thumb via after: */}
      <div
        className={[
          // Track base
          'relative h-5 w-9 shrink-0 rounded-full bg-neutral-400 transition-colors',
          // Thumb (pseudo-element)
          "after:absolute after:inset-s-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-['']",
          // Thumb movement when checked
          'peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full',
          // Focus ring
          'peer-focus:ring-4 peer-focus:outline-none',
          // Disabled state
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          // Color active
          TRACK_COLOR[color],
          RING_COLOR[color]
        ].join(' ')}
      />

      {label && (
        <Text className="select-none" size="2xs" variant="label">
          {label}
        </Text>
      )}
    </label>
  )
}
