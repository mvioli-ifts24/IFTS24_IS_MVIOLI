import { type InputHTMLAttributes, type ReactNode } from 'react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * ID único del checkbox para asociar con la etiqueta
   */
  id: string

  /**
   * Etiqueta del checkbox
   */
  label?: ReactNode

  /**
   * Mensaje de error a mostrar
   */
  errorMessage?: string

  /**
   * Estado del checkbox
   * @default 'default'
   */
  state?: 'default' | 'error' | 'success' | 'warning'

  /**
   * Clases CSS adicionales
   */
  className?: string
}

/**
 * Componente Checkbox personalizado
 */
export function Checkbox({
  label,
  errorMessage,
  state = 'default',
  className = '',
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id

  const stateClasses = {
    default: 'border-neutral-300 checked:border-primary-400',
    error: 'border-error checked:border-error',
    success: 'border-success checked:border-success',
    warning: 'border-warning checked:border-warning'
  }

  const messageColorClasses = {
    default: 'text-foreground',
    error: 'text-error',
    success: 'text-success',
    warning: 'text-warning'
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center gap-2">
        <input
          className={[
            'h-4 w-4 rounded border bg-transparent',
            'accent-primary-400 focus:ring-0 focus:outline-none',
            stateClasses[state],
            className
          ]
            .filter(Boolean)
            .join(' ')}
          id={checkboxId}
          type="checkbox"
          {...props}
        />
        {label && (
          <label
            className="text-foreground cursor-pointer text-sm select-none"
            htmlFor={checkboxId}
          >
            {label}
          </label>
        )}
      </div>
      {errorMessage && state === 'error' && (
        <p className={`mt-1 text-xs ${messageColorClasses[state]}`}>{errorMessage}</p>
      )}
    </div>
  )
}
