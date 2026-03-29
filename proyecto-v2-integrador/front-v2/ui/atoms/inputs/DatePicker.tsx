import { type InputHTMLAttributes } from 'react'

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * ID único del datepicker para asociar con la etiqueta
   */
  id: string

  /**
   * Etiqueta del datepicker
   */
  label?: string

  /**
   * Mensaje de error a mostrar
   */
  errorMessage?: string

  /**
   * Estado del datepicker
   * @default 'default'
   */
  state?: 'default' | 'error' | 'success' | 'warning'

  /**
   * Clases CSS adicionales
   */
  className?: string
}

/**
 * Componente DatePicker para selección de fechas
 */
export function DatePicker({
  label,
  errorMessage,
  state = 'default',
  className = '',
  id,
  ...props
}: DatePickerProps) {
  const inputId = id

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
        <input
          className={[
            'text-foreground rounded-lg border transition-colors duration-200 focus:ring-0 focus:outline-none',
            'peer block w-full appearance-none bg-transparent',
            'px-3 py-2 text-sm',
            stateClasses[state],
            className
          ]
            .filter(Boolean)
            .join(' ')}
          id={inputId}
          placeholder=" "
          type="date"
          {...props}
        />
        {label && (
          <label
            className="text-foreground peer-focus:text-primary-400 bg-background absolute inset-s-2.5 top-2 z-10 inline-flex origin-left -translate-y-4 scale-75 transform items-center px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            htmlFor={inputId}
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
