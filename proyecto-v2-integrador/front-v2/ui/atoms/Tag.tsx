import { type ReactNode } from 'react'

/**
 * Variantes de tag disponibles
 */
export type TagVariant = 0 | 1 | 2 | 3 | 4

/**
 * Props para el componente Tag
 */
export interface TagProps {
  /**
   * Variante del tag
   * @default 'default'
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
  0: 'bg-primary-400/10 text-primary-400 border border-primary-400/20',
  1: 'bg-red-400/10 text-red-400 border border-red-400/20',
  2: 'bg-orange-400/10 text-orange-400 border border-orange-400/20',
  3: 'bg-neutral-400/10 text-neutral-400 border border-neutral-400/20',
  4: 'bg-secondary-400/10 text-secondary-400 border border-secondary-400/20'
}

export function Tag({ variant = 0, children, className = '' }: TagProps) {
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
