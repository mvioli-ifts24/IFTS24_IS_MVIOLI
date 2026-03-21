import { type ElementType, type ReactNode } from 'react'

/**
 * Tamaños disponibles para el componente Heading
 */
export type HeadingSize = 'xs' | 's' | 'm' | 'l' | 'xl'

/**
 * Variantes de color para el componente Heading
 */
export type HeadingVariant = 'default' | 'primary' | 'secondary' | 'gradient'

/**
 * Niveles semánticos del heading (h1-h6)
 */
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

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
  s: 'text-2xl md:text-3xl',
  m: 'text-3xl md:text-4xl',
  l: 'text-4xl md:text-5xl',
  xl: 'text-5xl md:text-6xl'
}

/**
 * Mapeo de variantes a clases de Tailwind
 */
const variantClasses: Record<HeadingVariant, string> = {
  default: 'text-foreground font-bold',
  primary: 'text-primary-400 dark:text-primary-400 font-bold',
  secondary: 'text-secondary-400 dark:text-secondary-400 font-bold',
  gradient: 'bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent'
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
 * @example
 * ```tsx
 * <Heading level="h2" size="l" variant="primary">
 *   Featured Games
 * </Heading>
 * ```
 */
export function Heading({
  level = 'h2',
  size = 'm',
  variant = 'default',
  children,
  className = '',
  id
}: HeadingProps) {
  const Component = level as ElementType

  const classes = [
    'font-display', // Usar Montserrat para headings
    'font-bold',
    'tracking-tight',
    'transition-all',
    'duration-300',
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
