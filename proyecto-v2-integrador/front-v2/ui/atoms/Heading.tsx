import { type ElementType, type ReactNode } from 'react'

/**
 * Tamaños disponibles para el componente Heading
 */
export type HeadingSize = 'xs' | 'sm' | 'm' | 'lg' | 'xl'

/**
 * Variantes de color para el componente Heading
 */
export type HeadingVariant = 'default' | 'primary' | 'secondary' | 'gradient'

/**
 * Niveles semánticos del heading (h1-h6)
 */
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

/**
 * Peso de fuente para el componente Heading
 */
export type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold'

/**
 * Props para el componente Heading
 */
export interface HeadingProps {
  /**
   * El nivel semántico del heading (h1-h6)
   * @default 'h2'
   */
  level?: HeadingLevel

  /**
   * Tamaño visual del heading
   * @default 'm'
   */
  size?: HeadingSize

  /**
   * Variante de color del heading
   * @default 'default'
   */
  variant?: HeadingVariant

  /**
   * Peso de fuente del heading
   * @default 'normal'
   */
  weight?: HeadingWeight

  /**
   * Contenido del heading
   */
  children: ReactNode

  /**
   * Clases CSS adicionales
   */
  className?: string

  /**
   * ID del elemento para accesibilidad
   */
  id?: string
}

/**
 * Mapeo de tamaños a clases de Tailwind
 */
const sizeClasses: Record<HeadingSize, string> = {
  xs: 'text-xl md:text-2xl',
  sm: 'text-2xl md:text-3xl',
  m: 'text-3xl md:text-4xl',
  lg: 'text-4xl md:text-5xl',
  xl: 'text-5xl md:text-6xl'
}

const variantClasses: Record<HeadingVariant, string> = {
  default: 'text-foreground',
  primary: 'text-primary-400 ',
  secondary: 'text-secondary-400 ',
  gradient: 'bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent'
}

const weightClasses: Record<HeadingWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

/**
 * Heading Component
 *
 * Componente atómico para títulos y encabezados.
 * Sigue el principio de Responsabilidad Única (SRP) del patrón SOLID.
 *
 * @example
 * ```tsx
 * <Heading level="h1" size="xl" variant="gradient">
 *   Welcome to Gaming Center
 * </Heading>
 * ```
 *
 */

export function Heading({
  level = 'h2',
  size = 'm',
  variant = 'default',
  children,
  className = '',
  weight = 'normal',
  id
}: HeadingProps) {
  const Component = level as ElementType

  const classes = [
    'font-display',
    'tracking-tight',
    'transition-all',
    'duration-300',
    weightClasses[weight],
    sizeClasses[size],
    variantClasses[variant],
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} id={id}>
      {children}
    </Component>
  )
}
