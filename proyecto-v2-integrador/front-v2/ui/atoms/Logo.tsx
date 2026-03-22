import Link from 'next/link'

import { Heading, type HeadingSize } from './Heading'

export interface LogoProps {
  /**
   * URL destino del logo
   * @default '/'
   */
  href?: string

  /**
   * Texto del logo
   * @default '.RANK'
   */
  text?: string

  /**
   * Tamaño del heading del logo
   * @default 'xs'
   * Equivalencias (desktop): xs = 24px, sm = 30px, m = 36px, lg = 48px, xl = 60px
   */
  size?: HeadingSize

  /**
   * Clases CSS adicionales
   */
  className?: string
}

/**
 * Logo reutilizable del proyecto.
 */
export function Logo({ href = '/', text = '.RANK', size = 'xs', className = '' }: LogoProps) {
  return (
    <Link className={`flex items-center gap-2 ${className}`.trim()} href={href}>
      <Heading level="h1" size={size} variant="gradient" weight="semibold">
        {text}
      </Heading>
    </Link>
  )
}
