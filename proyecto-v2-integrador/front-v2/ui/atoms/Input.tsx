import { type InputHTMLAttributes, type ReactNode } from 'react'

/**
 * Estados disponibles para el componente Input
 */
export type InputState = 'default' | 'error' | 'success' | 'warning'

/**
 * Tamaños disponibles para el componente Input
 */
export type InputSize = 'sm' | 'm' | 'lg'

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
   * sm: pequeño, m: mediano, lg: grande
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
   * Mensaje de error, éxito o advertencia
   */
  message?: string

  /**
   * Clases CSS adicionales
   */
  className?: string
}

/**
 * Mapeo de tamaños a clases de Tailwind
 */
const sizeClasses: Record<InputSize, string> = {
  sm: 'px-2.5 py-1.5 text-sm',
  m: 'px-2.5 py-2.5 text-base',
  lg: 'px-3 py-3 text-lg'
}

/**
 * Mapeo de estados a estilos de borde
 */
const stateClasses: Record<InputState, string> = {
  default:
    'border-neutral-300 focus:border-primary-400 dark:border-neutral-600 dark:focus:border-primary-300',
  error: 'border-error focus:border-error dark:border-error dark:focus:border-error',
  success: 'border-success focus:border-success dark:border-success dark:focus:border-success',
  warning: 'border-warning focus:border-warning dark:border-warning dark:focus:border-warning'
}

/**
 * Mapeo de estados a colores de mensaje
 */
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
 * @example
 * ```tsx
 * <Input
 *   label="Contraseña"
 *   type="password"
 *   iconLeft={<LockIcon />}
 *   size="lg"
 * />
 * ```
 */
export function Input({
  size = 'm',
  variant = 'outlined',
  state = 'default',
  label,
  iconLeft,
  iconRight,
  message,
  className = '',
  id = 'input_field',
  placeholder = ' ',
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

  const containerClasses = 'relative mb-2'
  const iconContainerClasses =
    'absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-foreground'

  return (
    <div className="w-full">
      <div className={containerClasses}>
        {/* Input */}
        <input className={inputClasses} id={id} placeholder={placeholder} {...props} />

        {/* Label flotante */}
        {label && (
          <label
            className="bg-background text-foreground peer-focus:text-primary-400 dark:peer-focus:text-primary-300 absolute inset-s-2.5 top-2 z-10 inline-flex origin-left -translate-y-4 scale-75 transform items-center px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            htmlFor={id}
          >
            {label}
          </label>
        )}

        {/* Icono izquierdo */}
        {iconLeft && <div className={`${iconContainerClasses} start-2.5`}>{iconLeft}</div>}

        {/* Icono derecho */}
        {iconRight && <div className={`${iconContainerClasses} end-2.5`}>{iconRight}</div>}
      </div>

      {/* Mensaje de estado */}
      {message && <p className={`text-xs ${messageColorClasses[state]} mt-1`}>{message}</p>}
    </div>
  )
}
