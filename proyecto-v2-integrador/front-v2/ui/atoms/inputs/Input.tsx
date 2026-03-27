import { type InputHTMLAttributes, type ReactNode } from 'react'

import { type Size } from '../../types'

/**
 * Estados disponibles para el componente Input
 */
export type InputState = 'default' | 'error' | 'success' | 'warning'

/**
 * Tamaños disponibles para el componente Input
 */
export type InputSize = Size

/**
 * Variantes de estilo para el componente Input
 */
export type InputVariant = 'outlined' | 'filled'

/**
 * Props para el componente Input
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Tamaño del input
   * @default 'm'
   *  xs = 12px, sm = 14px, m = 16px, lg = 18px, xl = 20px
   */
  size?: InputSize

  /**
   * Variante visual del input
   * @default 'outlined'
   */
  variant?: InputVariant

  /**
   * Estado del input
   * @default 'default'
   */
  state?: InputState

  /**
   * Etiqueta flotante del input
   */
  label?: string

  /**
   * Icono a la izquierda del input
   */
  iconLeft?: ReactNode

  /**
   * Icono a la derecha del input
   */
  iconRight?: ReactNode

  /**
   * Mensaje de error a mostrar debajo del input
   */
  errorMessage?: string

  /**
   * Mostrar contador de caracteres (requiere maxLength)
   * @default false
   */
  showCounter?: boolean

  /**
   * Largo actual del valor cuando se usa input no controlado
   */
  currentLength?: number

  /**
   * Clases CSS adicionales
   */
  className?: string

  /**
   * ID del input para asociar con la etiqueta
   */
  id: string

  /**
   * Mantiene la etiqueta siempre en posición superior (sin comportamiento flotante)
   * @default false
   */
  labelAlwaysTop?: boolean
}

/**
 * Mapeo de tamaños a clases de Tailwind
 */
const sizeClasses: Record<InputSize, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-2.5 py-1.5 text-sm',
  m: 'px-2.5 py-2.5 text-base',
  lg: 'px-3 py-3 text-lg',
  xl: 'px-3.5 py-3.5 text-xl'
}

const stateClasses: Record<InputState, string> = {
  default: 'border-neutral-300 focus:border-primary-400 ',
  error: 'border-error focus:border-error',
  success: 'border-success focus:border-success',
  warning: 'border-warning focus:border-warning '
}

const messageColorClasses: Record<InputState, string> = {
  default: 'text-foreground',
  error: 'text-error',
  success: 'text-success',
  warning: 'text-warning'
}

/**
 * Componente Input reutilizable
 *
 * Componente atómico para campos de entrada de texto.
 * Soporta diferentes tamaños, variantes y estados (error, éxito, advertencia).
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="your@email.com"
 *   state="error"
 *   message="Email inválido"
 * />
 * ```
 *

 */
export function Input({
  size = 'm',
  variant = 'outlined',
  state = 'default',
  label,
  iconLeft,
  iconRight,
  errorMessage,
  showCounter = false,
  currentLength,
  className = '',
  id,
  placeholder = ' ',
  labelAlwaysTop = false,
  ...props
}: InputProps) {
  const inputClasses = [
    'text-foreground border focus:ring-0 focus:outline-none rounded transition-colors duration-200',
    'peer block w-full appearance-none bg-transparent',
    sizeClasses[size],
    stateClasses[state],
    variant === 'outlined' ? 'border' : 'border-b-2',
    iconLeft && 'ps-10',
    iconRight && 'pe-10',
    className
  ]
    .filter(Boolean)
    .join(' ')

  const iconContainerClasses =
    'absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-foreground'

  const maxLength = typeof props.maxLength === 'number' ? props.maxLength : undefined
  const valueLength =
    typeof currentLength === 'number'
      ? currentLength
      : typeof props.value === 'string'
        ? props.value.length
        : 0

  return (
    <div className="w-full">
      <div className="relative mb-2">
        <input
          autoComplete="off"
          className={inputClasses}
          id={id}
          placeholder={placeholder}
          {...props}
        />

        {label && (
          <label
            className={[
              'absolute inset-s-2.5 top-2 z-10',
              'inline-flex origin-left -translate-y-4 scale-75 transform items-center',
              'px-2 text-sm duration-300',
              'text-foreground peer-focus:text-primary-400',
              !labelAlwaysTop &&
                'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100',
              !labelAlwaysTop &&
                'peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2',
              'rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4',
              // Fondo que coincide con el contenedor, separado del bg-background hardcodeado
              'bg-background'
            ]
              .filter(Boolean)
              .join(' ')}
            htmlFor={id}
          >
            {label}
          </label>
        )}

        {iconLeft && <div className={`${iconContainerClasses} inset-s-2.5`}>{iconLeft}</div>}
        {iconRight && <div className={`${iconContainerClasses} inset-e-2.5`}>{iconRight}</div>}
      </div>

      {(errorMessage && state === 'error') || (showCounter && maxLength !== undefined) ? (
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className={`text-xs ${messageColorClasses[state]}`}>
            {errorMessage && state === 'error' ? errorMessage : ''}
          </p>
          {showCounter && maxLength !== undefined && (
            <p className="text-foreground/70 text-xs">
              {valueLength}/{maxLength}
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
