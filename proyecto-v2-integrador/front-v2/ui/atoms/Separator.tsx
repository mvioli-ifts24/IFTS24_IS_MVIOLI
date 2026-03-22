import { type CSSProperties } from 'react'

export interface SeparatorProps {
  /**
   * Orientación del separador
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * Color del separador
   * @default 'neutral-200'
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
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * <Separator color="primary-400" />
 * ```
 */
export function Separator({
  orientation = 'horizontal',
  color = 'neutral-200',
  size = '1px',
  className = '',
  style
}: SeparatorProps) {
  const baseClasses = `border-${orientation === 'horizontal' ? 't' : 'l'} border-${color} `

  const orientationStyles: CSSProperties =
    orientation === 'horizontal'
      ? { borderTopWidth: size }
      : { borderLeftWidth: size, height: '100%' }

  return (
    <div
      aria-orientation={orientation}
      className={`${baseClasses} ${className}`}
      role="separator"
      style={{ ...orientationStyles, ...style }}
    />
  )
}
