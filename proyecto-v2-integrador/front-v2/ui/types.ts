/**
 * Tipos compartidos para el sistema de diseño UI
 * Estos tipos se usan en múltiples componentes para mantener consistencia
 */

/**
 * Tamaños estándar para componentes
 *
 * La escala está calibrada para que el mismo `size` en Button, Input, Select y DatePicker
 * produzca la misma altura, facilitando el alineamiento cuando se combinan en una fila.
 *
 * Alturas aproximadas:
 *   2xs ≈ 18px · xs ≈ 24px · sm ≈ 32px · m ≈ 36px · lg ≈ 44px · xl ≈ 48px
 */
export type Size =
  /** 10px */
  | '2xs'
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
