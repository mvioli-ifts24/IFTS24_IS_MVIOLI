import { type ReactNode } from 'react'

/**
 * Variantes semánticas del tag.
 *
 * primary   → acción / rol admin
 * danger    → error / sin verificar
 * warning   → advertencia
 * neutral   → rol estándar / inactivo
 * secondary → éxito / verificado / moderador
 */
export type TagVariant = 'primary' | 'danger' | 'warning' | 'neutral' | 'secondary'

/**
 * Props para el componente Tag
 */
export interface TagProps {
  /**
   * Variante semántica del tag
   * @default 'primary'
   */
  variant?: TagVariant

  /**
   * Contenido del tag
   */
  children: ReactNode

  /**
   * Clases CSS adicionales
   */
  className?: string
}

const variantClasses: Record<TagVariant, string> = {
  // primary / secondary / neutral usan los tokens del sistema de color
  primary: 'bg-primary-400/10 text-primary-400 border border-primary-400/20',
  secondary: 'bg-secondary-400/10 text-secondary-400 border border-secondary-400/20',
  neutral: 'bg-neutral-400/10 text-neutral-400 border border-neutral-400/20',
  // danger usa --danger-400 (escala semántica de globals.css, no red-* de Tailwind)
  danger: 'bg-danger-400/10 text-danger-400 border border-danger-400/20',
  // warning usa --warning (token semántico de globals.css, no orange-* de Tailwind)
  warning: 'bg-warning/10 text-warning border border-warning/20'
}

export function Tag({ variant = 'primary', children, className = '' }: TagProps) {
  const classes = [
    'rounded-full',
    'px-3',
    'py-1',
    'text-xs',
    'font-medium',
    'w-fit',
    'transition-colors',
    'duration-200',
    'cursor-default',
    variantClasses[variant],
    className
  ]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}
