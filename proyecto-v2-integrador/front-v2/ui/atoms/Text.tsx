import { type ReactNode } from 'react'

/**
 * Tamaños disponibles para el componente Text
 */
export type TextSize = 'xs' | 'sm' | 'm' | 'lg' | 'xl'

/**
 * Variantes de color para el componente Text
 */
export type TextVariant = 'default' | 'primary' | 'secondary' | 'muted'

/**
 * Peso de fuente para el componente Text
 */
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'

/**
 * Props para el componente Text
 */
export interface TextProps {
  /**
   * Tamaño del texto
   * @default 'm'
   * xs: 12px en móvil, 14px en desktop
   * s: 14px en móvil, 16px en desktop
   * m: 16px en móvil, 18px en desktop
   * l: 18px en móvil, 20px en desktop
   * xl: 20px en móvil, 24px en desktop
   */
  size?: TextSize

  /**
   * Variante de color del texto
   * @default 'default'
   */
  variant?: TextVariant

  /**
   * Peso de la fuente
   * @default 'normal'
   */
  weight?: TextWeight

  /**
   * Contenido del texto
   */
  children: ReactNode

  /**
   * Clases CSS adicionales
   */
  className?: string

  /**
   * Si se debe renderizar como un elemento en línea (span) o bloque (p)
   *  @default 'p'
   */
  as?: 'p' | 'span'

  /**
   * Alineación del texto
   */
  align?: 'left' | 'center' | 'right'
}

/**
 * Mapeo de tamaños a clases de Tailwind
 */
const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs md:text-sm',
  sm: 'text-sm md:text-base',
  m: 'text-base md:text-lg',
  lg: 'text-lg md:text-xl',
  xl: 'text-xl md:text-2xl'
}

/**
 * Mapeo de variantes a clases de Tailwind
 */
const variantClasses: Record<TextVariant, string> = {
  default: 'text-foreground',
  primary: 'text-primary-400',
  secondary: 'text-secondary-400',
  muted: 'text-neutral-600'
}

/**
 * Mapeo de pesos a clases de Tailwind
 */
const weightClasses: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

/**
 * Text Component
 *
 * Componente atómico para texto y párrafos.
 * Sigue el principio de Responsabilidad Única (SRP) del patrón SOLID.
 *
 * @example
 * ```tsx
 * <Text size="l" variant="primary" weight="medium">
 *   Discover the best games of 2024
 * </Text>
 * ```
 *

 * ```
 */
export function Text({
  size = 'm',
  variant = 'default',
  weight = 'normal',
  children,
  className = '',
  as = 'p'
}: TextProps) {
  const Component = as ? 'span' : 'p'

  const classes = [
    'transition-colors',
    'duration-200',
    sizeClasses[size],
    variantClasses[variant],
    weightClasses[weight],
    className
  ]
    .filter(Boolean)
    .join(' ')

  return <Component className={classes}>{children}</Component>
}
