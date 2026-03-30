import { type HTMLAttributes, type ReactNode } from 'react'

import { type ColorVariant, type Size, type Weight } from '../types'

/**
 * Tamaños disponibles para el componente Text
 */
export type TextSize = Size

/**
 * Variante de color para el componente Text (renombrada desde TextVariant).
 */
export type TextColor = ColorVariant

/**
 * Peso de fuente para el componente Text
 */
export type TextWeight = Weight

export type TextVariant = 'default' | 'label'

type PresetConfig = {
  sizeClass: string
  colorClass: string
  weightClass: string
  extraClass: string
}

const PRESETS: Record<TextVariant, PresetConfig | null> = {
  default: null,
  label: {
    sizeClass: 'text-xs',
    colorClass: 'text-neutral-500 dark:text-neutral-400',
    weightClass: 'font-semibold',
    extraClass: 'uppercase tracking-widest'
  }
}

/**
 * Props para el componente Text
 */
export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color' | 'children'> {
  /**
   * Tamaño del texto. Sobreescribe el tamaño del preset si se especifica.
   * @default 'sm' (o el default del preset)
   *  xs = 12px, sm = 14px, m = 16px, lg = 18px, xl = 20px
   */
  size?: TextSize

  /**
   * Color del texto
   * @default 'default'
   */
  color?: TextColor

  /**
   * Peso de la fuente
   * @default 'normal'
   */
  weight?: TextWeight

  /**
   * Variante de estilo (preset). Aplica defaults visuales combinables con
   * las props `size`, `color` y `weight`.
   */
  variant?: TextVariant

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
  '2xs': 'text-[10px]',
  xs: 'text-xs',
  sm: 'text-sm md:text-base',
  m: 'text-base md:text-lg',
  lg: 'text-lg md:text-xl',
  xl: 'text-xl md:text-2xl'
}

const colorClasses: Record<TextColor, string> = {
  default: 'text-foreground',
  primary: 'text-primary-400',
  secondary: 'text-secondary-400',
  muted: 'text-neutral-600',
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
  size,
  color,
  weight,
  variant,
  children,
  className = '',
  as: Component = 'p',
  ...rest
}: TextProps) {
  const preset = variant && variant !== 'default' ? PRESETS[variant] : null

  // Las props explícitas tienen prioridad; si no se pasan, el preset define el default;
  // si tampoco hay preset, se usa el default genérico del componente.
  const resolvedSizeClass = size ? sizeClasses[size] : (preset?.sizeClass ?? sizeClasses['sm'])

  const resolvedColorClass = color
    ? colorClasses[color]
    : (preset?.colorClass ?? colorClasses['default'])

  const resolvedWeightClass = weight
    ? weightClasses[weight]
    : (preset?.weightClass ?? weightClasses['normal'])

  const classes = [
    'transition-colors duration-200',
    resolvedSizeClass,
    resolvedColorClass,
    resolvedWeightClass,
    preset?.extraClass,
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}
