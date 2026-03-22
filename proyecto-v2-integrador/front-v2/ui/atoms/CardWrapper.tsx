import { type ElementType, type ReactNode } from 'react'

/**
 * Niveles de elevación del Card.
 *
 * 0 → sin borde visible, fondo igual al surface. Para secciones embebidas.
 * 1 → borde sutil + fondo levemente distinto. El caso más común.
 * 2 → borde + sombra suave. Para dropdowns, tooltips, panels flotantes.
 * 3 → efecto glassmorphism con blur. Para overlays sobre imágenes o fondos ricos.
 */
export type CardWrapperElevation = '0' | '1' | '2' | '3'

/**
 * Radio de esquinas del CardWrapper.
 */
export type CardWrapperRadius = 'sm' | 'md' | 'lg' | 'xl' | 'none'

/**
 * Padding interno del CardWrapper.
 */
export type CardWrapperPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export interface CardWrapperProps {
  children: ReactNode
  elevation?: CardWrapperElevation
  radius?: CardWrapperRadius
  padding?: CardWrapperPadding
  /**
   * Si es true, aplica un cursor pointer y un efecto hover interactivo.
   */
  interactive?: boolean
  /**
   * Elemento HTML que se renderiza. Por defecto div, pero puede ser article, section, li, etc.
   */
  as?: ElementType
  className?: string
  onClick?: () => void
}

const elevationClasses: Record<CardWrapperElevation, string> = {
  0: 'bg-neutral-50 dark:bg-neutral-50 border border-transparent',
  1: 'bg-background dark:bg-neutral-50 border border-neutral-100 dark:border-neutral-100',
  2: 'bg-background dark:bg-neutral-50  border border-neutral-100 dark:border-neutral-100 shadow-md shadow-foreground/10 ',
  3: 'bg-white/8 dark:bg-white/4 border border-white/12 dark:border-white/8 backdrop-blur-xl[backdrop-filter:blur(20px)_saturate(180%)]'
}

const interactiveClasses: Record<CardWrapperElevation, string> = {
  0: 'hover:bg-neutral-100 dark:hover:bg-neutral-100 transition-colors duration-200',
  1: 'hover:border-neutral-300 dark:hover:border-neutral-300 hover:shadow-sm hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-200',
  2: 'hover:shadow-lg hover:shadow-black/8 dark:hover:shadow-black/40 hover:-translate-y-0.5 transition-all duration-200',
  3: 'hover:bg-white/12 dark:hover:bg-white/8 hover:border-white/20 dark:hover:border-white/12 transition-all duration-200'
}

const radiusClasses: Record<CardWrapperRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl'
}

const paddingClasses: Record<CardWrapperPadding, string> = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8'
}

export function CardWrapper({
  children,
  elevation = '1',
  radius = 'lg',
  padding = 'md',
  interactive = false,
  as: Component = 'div',
  className = '',
  onClick
}: CardWrapperProps) {
  const classes = [
    'relative overflow-hidden',
    elevationClasses[elevation],
    radiusClasses[radius],
    paddingClasses[padding],
    interactive && interactiveClasses[elevation],
    interactive && 'cursor-pointer',
    // Si se pasa onClick pero no interactive, igual hacemos clickable
    !interactive && onClick && 'cursor-pointer',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} onClick={onClick}>
      {children}
    </Component>
  )
}
