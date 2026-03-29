import { type Icon } from '@phosphor-icons/react'
import Link from 'next/link'
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'

import { type Size, type StyleVariant, type Weight } from '../types'

import { SpinLoader } from './SpinLoader'

/**
 * Variantes de estilo para el botón
 */
export type ButtonVariant = StyleVariant

/**
 * Colores disponibles para el botón
 */
export type ButtonColor = 'primary' | 'secondary' | 'danger' | 'muted'

/**
 * Tamaños disponibles para el botón
 */
export type ButtonSize = Size

/**
 * Pesos de fuente disponibles para el botón
 */
export type ButtonWeight = Weight

const weightClasses: Record<ButtonWeight, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

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
   * @default 'sm'
   *  2xs≈18px · xs≈24px · sm≈32px · m≈36px · lg≈44px · xl≈48px
   */
  size?: ButtonSize

  /**
   * Contenido del botón
   */
  children?: ReactNode

  /**
   * Icono a la izquierda del texto
   */
  iconLeft?: Icon

  /**
   * Clase CSS adicional para el contenedor del icono izquierdo (ej: color)
   */
  iconLeftClassName?: string

  /**
   * Icono a la derecha del texto
   */
  iconRight?: Icon

  /**
   * Clase CSS adicional para el contenedor del icono derecho
   */
  iconRightClassName?: string

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

  /**
   * Estado de carga del botón.
   * Muestra un spinner a la izquierda del contenido y deshabilita interacción.
   * @default false
   */
  loading?: boolean

  /**
   * Peso de fuente del botón
   * @default 'medium'
   */
  weight?: ButtonWeight
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
    },
    danger: {
      filled: 'bg-danger-400 text-background hover:bg-danger-300',
      outlined: 'border-2 border-danger-400 text-danger-400  hover:bg-danger-400/10',
      text: 'text-danger-400  hover:bg-danger-400/10',
      action: 'text-foreground hover:text-danger-400 hover:underline underline-offset-3 '
    },
    muted: {
      filled: 'bg-foreground/70 text-background hover:bg-foreground/90',
      outlined:
        'border border-foreground/50 text-foreground/70  hover:text-foreground/90  hover:bg-foreground/5 ',
      text: 'text-foreground/70 hover:text-foreground/90 hover:bg-foreground/5 ',
      action: 'text-foreground/70 hover:text-foreground/90 hover:underline underline-offset-3  '
    }
  }

  return colorMap[color][variant]
}

/**
 * Mapeo de tamaños del botón al tamaño en px del ícono
 */
const iconSizeMap: Record<ButtonSize, number> = {
  '2xs': 10,
  xs: 12,
  sm: 14,
  m: 14,
  lg: 16,
  xl: 18
}

/**
 * Mapeo de tamaños a clases de Tailwind (solo spacing y tipografía).
 *
 * Alturas aproximadas: 2xs≈18px · xs≈24px · sm≈32px · m≈36px · lg≈44px · xl≈48px
 * Mismo size en Button/Input/Select produce la misma altura, facilitando alignment en filas.
 *
 * El border-radius (rounded-lg) se aplica en las clases base del componente,
 * independiente del size, para alinear visualmente con Input/Select/DatePicker.
 */
const sizeClasses: Record<ButtonSize, string> = {
  '2xs': 'px-2 py-0.5 text-[10px]',
  xs: 'px-2.5 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  m: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
  xl: 'px-6 py-3 text-base'
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
  loading = false,
  fullWidth = false,
  iconLeft: IconLeft,
  iconLeftClassName = '',
  iconRight: IconRight,
  iconRightClassName = '',
  size = 'm',
  weight = 'medium',
  variant = 'filled',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  const loaderSize: Record<ButtonSize, 'xs' | 'sm' | 'm'> = {
    '2xs': 'xs',
    xs: 'xs',
    sm: 'xs',
    m: 'sm',
    lg: 'sm',
    xl: 'm'
  }

  const classes = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-lg',
    'transition-all',
    'duration-300',
    'ease-out',
    'cursor-pointer',
    weightClasses[weight],
    getVariantClasses(variant, color),
    sizeClasses[size],
    fullWidth && 'w-full',
    isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {loading ? (
        <SpinLoader fullScreen={false} size={loaderSize[size]} />
      ) : (
        IconLeft && (
          <span
            className={['flex items-center justify-center', iconLeftClassName]
              .filter(Boolean)
              .join(' ')}
          >
            <IconLeft size={iconSizeMap[size]} weight="regular" />
          </span>
        )
      )}
      {children}
      {IconRight && (
        <span
          className={['flex items-center justify-center', iconRightClassName]
            .filter(Boolean)
            .join(' ')}
        >
          <IconRight size={iconSizeMap[size]} weight="regular" />
        </span>
      )}
    </>
  )

  if ('href' in props && props.href) {
    const { href, ...linkProps } = props

    return (
      <Link
        aria-disabled={isDisabled}
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
      disabled={isDisabled}
      type="button"
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  )
}
