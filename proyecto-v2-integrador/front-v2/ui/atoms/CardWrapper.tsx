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
 *  none = 0px, sm = 8px, md = 12px, lg = 16px, xl = 24px
 */
export type CardWrapperRadius =
  /** 8px */
  | 'sm'
  /** 12px */
  | 'md'
  /** 16px */
  | 'lg'
  /** 24px */
  | 'xl'
  /** 0px */
  | 'none'

/**
 * Padding interno del CardWrapper.
 *  none = 0px, sm = 8px, md = 16px, lg = 24px, xl = 32px
 */
export type CardWrapperPadding =
  /** 0px */
  | 'none'
  /** 8px */
  | 'sm'
  /** 16px */
  | 'md'
  /** 24px */
  | 'lg'
  /** 32px */
  | 'xl'

export interface CardWrapperProps {
  children?: ReactNode
  loading?: boolean
  elevation?: CardWrapperElevation

  /**
   * Radio de esquinas
   *  none = 0px, sm = 8px, md = 12px, lg = 16px, xl = 24px
   * @default 'lg'
   */
  radius?: CardWrapperRadius

  /**
   * Espaciado interno
   *  none = 0px, sm = 8px, md = 16px, lg = 24px, xl = 32px
   * @default 'md'
   */
  padding?: CardWrapperPadding
  /**
   * Elemento HTML que se renderiza. Por defecto div, pero puede ser article, section, li, etc.
   */
  as?: ElementType
  className?: string
  onClick?: () => void
}

const elevationClasses: Record<CardWrapperElevation, string> = {
  // 0: card "plana" — sin sombra, borde muy sutil
  //    light: bg-surface (blanco) sobre lavanda (#f4f2fb) → contraste limpio, igual al efecto dark
  //    dark:  neutral-50 (#1e1d26) sobre background (#15141b) → escalón tonal
  0: 'bg-surface dark:bg-neutral-50 border border-neutral-100 dark:border-transparent',
  // 1: card estándar — surface sobre background (MD3: elevation level 1)
  //    light: blanco sobre lavanda + sombra xs para depth
  //    dark:  neutral-100 (#2a2937) → un escalón más claro
  1: 'bg-surface dark:bg-neutral-100 border border-neutral-200 dark:border-neutral-200 shadow-xs shadow-foreground/6 dark:shadow-none',
  // 2: panel flotante — sobre cards, menús (MD3: elevation level 2+)
  //    light: surface + sombra md para indicar que flota
  //    dark:  neutral-200 (#3e3d4a) → otro escalón + tonal visible
  2: 'bg-surface dark:bg-neutral-200 border border-neutral-200 dark:border-neutral-200 shadow-md shadow-foreground/10 dark:shadow-foreground/20',
  // 3: glassmorphism — overlays sobre fondos ricos o imágenes
  //    Usa las CSS vars --glass-bg y --glass-border definidas en globals.css.
  //    El dark mode es automático: las vars cambian en .dark sin necesidad de dark: prefixes.
  3: 'bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--glass-border)]'
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
  loading = false,
  elevation = '1',
  radius = 'lg',
  padding = 'md',
  as: Component = 'div',
  className = '',
  onClick
}: CardWrapperProps) {
  const classes = [
    'relative overflow-hidden',
    elevationClasses[elevation],
    radiusClasses[radius],
    paddingClasses[padding],
    onClick && 'cursor-pointer',
    className,
    loading && 'h-24 w-full animate-pulse'
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} onClick={onClick}>
      {loading ? <div /> : children}
    </Component>
  )
}
