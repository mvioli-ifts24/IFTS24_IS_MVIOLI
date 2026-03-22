import Link from 'next/link'

import { Heading, type HeadingSize } from './Heading'

export interface LogoProps {
  href?: string
  text?: string
  size?: HeadingSize
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
