import { type ReactNode, type SelectHTMLAttributes } from 'react'

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
   * Opciones del select
   */
  children: ReactNode
}

/**
 * Componente Select con floating label
 */
export function Select({
  label,
  errorMessage,
  state = 'default',
  className = '',
  children,
  id,
  ...props
}: SelectProps) {
  const selectId = id

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
      <div className="relative mb-2">
        <select
          className={`text-foreground peer block w-full appearance-none rounded border bg-transparent px-2.5 py-2.5 pe-10 text-base transition-colors duration-200 focus:ring-0 focus:outline-none ${stateClasses[state]} ${className}`.trim()}
          id={selectId}
          {...props}
        >
          {children}
        </select>
        {label && (
          <label
            className="text-foreground peer-focus:text-primary-400 bg-background absolute inset-s-2.5 top-2 z-10 inline-flex origin-left -translate-y-4 scale-75 transform items-center px-2 text-sm"
            htmlFor={selectId}
          >
            {label}
          </label>
        )}

        <div className="pointer-events-none absolute inset-y-0 inset-e-0 flex items-center pe-2.5">
          <svg
            aria-hidden="true"
            className="text-foreground h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m19 9-7 7-7-7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
      {errorMessage && state === 'error' && (
        <p className={`mt-1 text-xs ${messageColorClasses[state]}`}>{errorMessage}</p>
      )}
    </div>
  )
}
