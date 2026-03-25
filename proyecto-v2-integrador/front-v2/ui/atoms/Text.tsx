import { type ReactNode } from 'react'

import { type ColorVariant, type Size, type Weight } from '../types'

/**
 * Tamaños disponibles para el componente Text
 */
export type TextSize = Size

/**
 * Variantes de color para el componente Text
 */
export type TextVariant = ColorVariant

/**
 * Peso de fuente para el componente Text
 */
export type TextWeight = Weight

/**
 * Props para el componente Text
 */
export interface TextProps {
  /**
   * Tamaño del texto
   * @default 'm'
   *  xs = 12px, sm = 14px, m = 16px, lg = 18px, xl = 20px
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
}

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs md:text-sm',
  sm: 'text-sm md:text-base',
  m: 'text-base md:text-lg',
  lg: 'text-lg md:text-xl',
  xl: 'text-xl md:text-2xl'
}

const variantClasses: Record<TextVariant, string> = {
  default: 'text-foreground',
  primary: 'text-primary-400',
  secondary: 'text-secondary-400',
  muted: 'text-neutral-600 ',
  gradient: 'bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent'
}

const weightClasses: Record<TextWeight, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

export function Text({
  size = 'sm',
  variant = 'default',
  weight = 'normal',
  children,
  className = '',
  as: Component = 'p'
}: TextProps) {
  const classes = [
    'transition-colors',
    'duration-200',
    'cursor-default',
    sizeClasses[size],
    variantClasses[variant],
    weightClasses[weight],
    className
  ]
    .filter(Boolean)
    .join(' ')

  return <Component className={classes}>{children}</Component>
}
