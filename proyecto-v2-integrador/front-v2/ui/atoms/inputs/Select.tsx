import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr'
import { type ReactNode, type SelectHTMLAttributes } from 'react'

export interface SelectOption {
  label: string
  value: string | number
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * ID único del select para asociar con la etiqueta
   */
  id: string

  /**
   * Etiqueta del select
   */
  label?: string
  errorMessage?: string

  /**
   * Estado del select
   * @default 'default'
   */
  state?: 'default' | 'error' | 'success' | 'warning'

  /**
   * Clases CSS adicionales
   */
  className?: string

  /**
   * Tamaño del select
   * @default 'default'
   */
  size?: 'default' | 'xs'

  /**
   * Opciones del select. Alternativa conveniente a usar children con <option>.
   */
  options?: SelectOption[]

  /**
   * Contenido personalizado. Se ignora si se pasa `options`.
   */
  children?: ReactNode
}

/**
 * Componente Select con floating label
 */
export function Select({
  label,
  errorMessage,
  size = 'default',
  state = 'default',
  className = '',
  children,
  options,
  id,
  ...props
}: SelectProps) {
  const selectId = id

  // Alturas: default ≈ 36px (alinea con Input m / Button m) · xs ≈ 24px (compact)
  const sizeClasses = {
    default: { wrapper: 'mb-2', select: 'px-3 py-2 pe-10 text-sm', icon: 'pe-2.5 h-3.5 w-3.5' },
    xs: { wrapper: '', select: 'ps-2 py-1 pe-7 text-xs', icon: 'pe-2 h-3 w-3' }
  }

  const stateClasses = {
    default: 'border-neutral-300 focus:border-primary-400',
    error: 'border-error focus:border-error',
    success: 'border-success focus:border-success',
    warning: 'border-warning focus:border-warning'
  }

  const messageColorClasses = {
    default: 'text-foreground',
    error: 'text-error',
    success: 'text-success',
    warning: 'text-warning'
  }

  return (
    <div className="w-full">
      <div className={`relative ${sizeClasses[size].wrapper}`}>
        <select
          className={`text-foreground peer block w-full cursor-pointer appearance-none rounded-lg border bg-transparent transition-colors duration-200 focus:ring-0 focus:outline-none ${sizeClasses[size].select} ${stateClasses[state]} ${className}`.trim()}
          id={selectId}
          {...props}
        >
          {options
            ? options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {label && (
          <label
            className="text-foreground peer-focus:text-primary-400 bg-background absolute inset-s-2.5 top-2 z-10 inline-flex origin-left -translate-y-4 scale-75 transform items-center px-2 text-sm"
            htmlFor={selectId}
          >
            {label}
          </label>
        )}
        <CaretDownIcon
          className="pointer-events-none absolute inset-e-2 top-1/2 -translate-y-1/2 text-neutral-500"
          size={16}
        />
      </div>
      {errorMessage && state === 'error' && (
        <p className={`mt-1 text-xs ${messageColorClasses[state]}`}>{errorMessage}</p>
      )}
    </div>
  )
}
