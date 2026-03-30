'use client'

import { StarIcon } from '@phosphor-icons/react'
import { useState } from 'react'

export interface StarRatingProps {
  /**
   * Valor de 1 a 5. 0 = sin selección.
   */
  value: number
  /**
   * Callback al seleccionar una estrella. Si no se pasa, es solo lectura.
   */
  onChange?: (value: number) => void
  /**
   * Tamaño en px de cada estrella.
   * @default 24
   */
  size?: number
  /**
   * Texto de error para mostrar debajo.
   */
  errorMessage?: string
  /**
   * Muestra la etiqueta de texto junto a las estrellas en modo interactivo.
   * @default true
   */
  showLabel?: boolean
}

const LABELS = ['', 'Muy malo', 'Malo', 'Normal', 'Bueno', 'Muy bueno']

/**
 * Selector de valoración de 1 a 5 estrellas.
 * En modo lectura (sin `onChange`) renderiza estrellas estáticas.
 * En modo interactivo muestra hover progresivo: al pasar por estrella N
 * se rellenan las estrellas 1..N antes de confirmar la selección.
 */
export function StarRating({
  errorMessage,
  onChange,
  showLabel = true,
  size = 24,
  value
}: StarRatingProps) {
  const readonly = !onChange
  const [hoverValue, setHoverValue] = useState(0)

  const displayValue = hoverValue > 0 ? hoverValue : value

  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex items-center gap-1"
        onMouseLeave={readonly ? undefined : () => setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map(star => {
          const filled = star <= displayValue

          if (readonly) {
            return (
              <StarIcon
                key={star}
                className={filled ? 'text-yellow-400' : 'text-foreground/20'}
                size={size}
                weight={filled ? 'fill' : 'regular'}
              />
            )
          }

          return (
            <button
              key={star}
              aria-label={LABELS[star]}
              className={[
                'cursor-pointer transition-colors',
                filled ? 'text-yellow-400' : 'text-foreground/25'
              ].join(' ')}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverValue(star)}
              type="button"
            >
              <StarIcon size={size} weight={filled ? 'fill' : 'regular'} />
            </button>
          )
        })}

        {showLabel && displayValue > 0 && !readonly && (
          <span className="text-foreground/60 ml-1 text-sm">{LABELS[displayValue]}</span>
        )}
      </div>

      {errorMessage && <p className="text-error text-xs">{errorMessage}</p>}
    </div>
  )
}
