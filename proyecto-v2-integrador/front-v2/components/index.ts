/**
 * Gaming Center - Unified Component Export
 *
 * Exportación centralizada de todos los componentes del sistema de diseño.
 * Organizado siguiendo Atomic Design methodology.
 */

// ================================
// ATOMS - Componentes básicos
// ================================

export { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from './atoms/Button'

export {
  Heading,
  type HeadingLevel,
  type HeadingProps,
  type HeadingSize,
  type HeadingVariant
} from './atoms/Heading'

export {
  Text,
  type TextProps,
  type TextSize,
  type TextVariant,
  type TextWeight
} from './atoms/Text'

export { AnimatedCounter } from './atoms/AnimatedCounter'

// Note:
// Los componentes con logica de dominio viven en `features/*`.
// `components/` queda reservado para piezas UI reutilizables.

// ================================
// UTILS - Tipos y utilidades
// ================================

/**
 * Union type de todos los tamaños disponibles en el sistema
 */
export type ComponentSize = 'xs' | 's' | 'm' | 'l' | 'xl'

/**
 * Union type de todas las variantes de color disponibles
 */
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'muted' | 'gradient'

/**
 * Props base que comparten todos los componentes
 */
export interface BaseComponentProps {
  /**
   * Clases CSS adicionales
   */
  className?: string

  /**
   * Contenido del componente
   */
  children: React.ReactNode
}
