import Link from 'next/link'
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'

/**
 * Variantes de estilo para el botón
 */
export type ButtonVariant = 'filled' | 'outlined' | 'text'

/**
 * Colores disponibles para el botón
 */
export type ButtonColor = 'primary' | 'secondary'

/**
 * Tamaños disponibles para el botón
 */
export type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl'

/**
 * Props base compartidas entre botón y link
 */
interface BaseButtonProps {
  /**
   * Variante visual del botón
   * @default 'filled'
   */
  variant?: ButtonVariant

  /**
   * Color del botón
   * @default 'primary'
   */
  color?: ButtonColor

  /**
   * Tamaño del botón
   * @default 'm'
   * xs: 12px, s: 14px, m: 16px, l: 18px, xl: 20px
   */
  size?: ButtonSize

  /**
   * Contenido del botón
   */
  children: ReactNode

  /**
   * Icono a la izquierda del texto
   */
  iconLeft?: ReactNode

  /**
   * Icono a la derecha del texto
   */
  iconRight?: ReactNode

  /**
   * Clases CSS adicionales
   */
  className?: string

  /**
   * Si el botón debe ocupar todo el ancho disponible
   * @default false
   */
  fullWidth?: boolean

  /**
   * Estado deshabilitado
   * @default false
   */
  disabled?: boolean
}

/**
 * Props cuando el componente es un botón regular
 */
interface ButtonAsButton
  extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  /**
   * URL de destino cuando se usa como link
   */
  href?: never
}

/**
 * Props cuando el componente es un link
 */
interface ButtonAsLink
  extends BaseButtonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  /**
   * URL de destino cuando se usa como link
   */
  href: string
}

/**
 * Union type de las props del Button
 */
export type ButtonProps = ButtonAsButton | ButtonAsLink

/**
 * Función helper para obtener las clases de variante y color
 */
function getVariantClasses(variant: ButtonVariant, color: ButtonColor): string {
  const colorMap = {
    primary: {
      filled:
        'bg-primary-400 text-white hover:bg-primary-300 shadow-lg shadow-primary-400/30 dark:bg-primary-400 dark:text-black dark:hover:bg-primary-300',
      outlined:
        'border-2 border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white dark:border-primary-300 dark:text-primary-300 dark:hover:bg-primary-400/20',
      text: 'text-primary-400 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-400/10'
    },
    secondary: {
      filled:
        'bg-secondary-400 text-black hover:bg-secondary-300 shadow-lg shadow-secondary-400/30 dark:bg-secondary-400 dark:text-black dark:hover:bg-secondary-300',
      outlined:
        'border-2 border-secondary-400 text-secondary-400 hover:bg-secondary-400 hover:text-black dark:border-secondary-300 dark:text-secondary-300 dark:hover:bg-secondary-400/20',
      text: 'text-secondary-400 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:bg-secondary-400/10'
    }
  }

  return colorMap[color][variant]
}

/**
 * Mapeo de tamaños a clases de Tailwind
 */
const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-3 py-2 text-xs rounded-lg',
  s: 'px-4 py-2 text-sm rounded-lg',
  m: 'px-6 py-3 text-base rounded-xl',
  l: 'px-8 py-4 text-lg rounded-xl',
  xl: 'px-10 py-5 text-xl rounded-2xl'
}

/**
 *
 * @example
 * ```tsx
 * // Botón filled con color primary (default)
 * <Button variant="filled" size="l" onClick={handleClick}>
 *   Get Started
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // Botón outlined con color secondary y icono a la izquierda
 * <Button variant="outlined" color="secondary" size="m" href="/games" iconLeft={<GameIcon />}>
 *   Browse Games
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // Botón text con icono a la derecha
 * <Button variant="text" size="l" href="/login" iconRight={<ArrowIcon />}>
 *   Sign In
 * </Button>
 * ```
 */
export function Button({
  children,
  className = '',
  color = 'primary',
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  size = 's',
  variant = 'filled',
  ...props
}: ButtonProps) {
  const classes = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'font-medium',
    'transition-all',
    'duration-300',
    'ease-out',
    'cursor-pointer',
    getVariantClasses(variant, color),
    sizeClasses[size],
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {iconLeft && <span className="flex items-center justify-center">{iconLeft}</span>}
      {children}
      {iconRight && <span className="flex items-center justify-center">{iconRight}</span>}
    </>
  )

  // Si tiene href, renderiza como Link de Next.js
  if ('href' in props && props.href) {
    const { href, ...linkProps } = props

    return (
      <Link
        className={classes}
        href={href}
        {...(linkProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    )
  }

  // Si no, renderiza como button
  return (
    <button
      className={classes}
      disabled={disabled}
      type="button"
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  )
}
