import Link from 'next/link'
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'

/**
 * Variantes de estilo para el botón
 */
export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'action'

/**
 * Colores disponibles para el botón
 */
export type ButtonColor = 'primary' | 'secondary'

/**
 * Tamaños disponibles para el botón
 */
export type ButtonSize = 'xs' | 'sm' | 'm' | 'lg' | 'xl'

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
  children?: ReactNode

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
export type ButtonProps = BaseButtonProps | ButtonAsLink

/**
 * Función helper para obtener las clases de variante y color
 */
function getVariantClasses(variant: ButtonVariant, color: ButtonColor): string {
  const colorMap = {
    primary: {
      filled: 'bg-primary-400 text-background hover:bg-primary-300',
      outlined: 'border-2 border-primary-400 text-primary-400  hover:bg-primary-400/10',
      text: 'text-primary-400  hover:bg-primary-400/10',
      action: 'text-foreground hover:text-primary-400 hover:underline underline-offset-3 '
    },
    secondary: {
      filled: 'bg-secondary-400 text-background hover:bg-secondary-300  ',
      outlined: 'border-2 border-secondary-400 text-secondary-400  hover:bg-secondary-400/10',
      text: 'text-secondary-400  hover:bg-secondary-400/10',
      action: 'text-foreground hover:text-secondary-300 hover:underline underline-offset-3 '
    }
  }

  return colorMap[color][variant]
}

/**
 * Mapeo de tamaños a clases de Tailwind
 */
const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-3 py-2 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-lg',
  m: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
  xl: 'px-10 py-5 text-xl rounded-2xl'
}

/**
 *
 * @example
 * ```tsx
 * <Button variant="filled" size="l" onClick={handleClick}>
 *   Get Started
 * </Button>
 * ```

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
  size = 'sm',
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
