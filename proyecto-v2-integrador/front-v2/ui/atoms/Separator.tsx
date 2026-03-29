import { type CSSProperties } from 'react'

export interface SeparatorProps {
  /**
   * Orientación del separador
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * Color del borde como valor CSS válido (e.g. `'var(--primary-400)'`, `'#e5e7eb'`).
   * Si se omite, se aplica `border-neutral-200` (clase Tailwind segura).
   */
  color?: string

  /**
   * Tamaño del separador (ancho/alto del borde)
   * @default '1px'
   */
  size?: string

  /**
   * Espaciado adicional
   */
  className?: string

  /**
   * Estilos inline
   */
  style?: CSSProperties
}

/**
 * Componente Separator reutilizable
 * Divide contenido visualmente con una línea
 *
 * El color acepta cualquier valor CSS válido: `'#e5e7eb'`, `'rgb(0,0,0)'`, `'var(--primary-400)'`.
 * El valor por defecto (`undefined`) aplica la clase Tailwind `border-neutral-200`.
 *
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * <Separator color="var(--primary-400)" />
 * ```
 */
export function Separator({
  orientation = 'horizontal',
  color,
  size = '1px',
  className = '',
  style
}: SeparatorProps) {
  // Clase fija para el caso default (Tailwind la puede scanear).
  // Si se pasa un color personalizado se aplica vía inline style, evitando clases dinámicas.
  const directionClass = orientation === 'horizontal' ? 'border-t' : 'border-l'
  const defaultColorClass = color ? '' : 'border-neutral-200'

  const orientationStyles: CSSProperties =
    orientation === 'horizontal'
      ? { borderTopWidth: size, ...(color ? { borderColor: color } : {}) }
      : { borderLeftWidth: size, height: '100%', ...(color ? { borderColor: color } : {}) }

  return (
    <div
      aria-orientation={orientation}
      className={[directionClass, defaultColorClass, className].filter(Boolean).join(' ')}
      role="separator"
      style={{ ...orientationStyles, ...style }}
    />
  )
}
