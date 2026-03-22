/**
 * Tipos compartidos para el sistema de diseño UI
 * Estos tipos se usan en múltiples componentes para mantener consistencia
 */

/**
 * Tamaños estándar para componentes
 *
 * xs = 12px, sm = 14px, m = 16px, lg = 18px, xl = 20px
 */
export type Size =
  /** 12px */
  | 'xs'
  /** 14px */
  | 'sm'
  /** 16px */
  | 'm'
  /** 18px */
  | 'lg'
  /** 20px */
  | 'xl'

/**
 * Pesos de fuente estándar
 */
export type Weight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold'

/**
 * Variantes de color comunes
 */
export type ColorVariant = 'default' | 'primary' | 'secondary' | 'muted' | 'gradient'

/**
 * Variantes de estilo comunes
 */
export type StyleVariant = 'filled' | 'outlined' | 'text' | 'action'
