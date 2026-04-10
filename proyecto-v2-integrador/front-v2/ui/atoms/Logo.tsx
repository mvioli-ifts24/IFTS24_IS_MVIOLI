import Link from 'next/link'

export type LogoSize = '2xs' | 'xs' | 'sm' | 'm' | 'lg' | 'xl'

export interface LogoProps {
  /**
   * URL destino del logo
   * @default '/'
   */
  href?: string

  /**
   * Tamaño del logo
   * @default 'xs'
   * Equivalencias: 2xs=16px, xs=24px, sm=30px, m=36px, lg=48px, xl=60px
   */
  size?: LogoSize

  /**
   * Clases CSS adicionales
   */
  className?: string

  /**
   * Si se renderiza sin el wrapper Link (útil para uso standalone)
   * @default false
   */
  standalone?: boolean
}

const sizeMap: Record<LogoSize, { fontSize: number; pixelSize: number; gap: number }> = {
  '2xs': { fontSize: 16, pixelSize: 6, gap: 4 },
  xs: { fontSize: 24, pixelSize: 9, gap: 6 },
  sm: { fontSize: 30, pixelSize: 11, gap: 7 },
  m: { fontSize: 36, pixelSize: 13, gap: 8 },
  lg: { fontSize: 48, pixelSize: 17, gap: 10 },
  xl: { fontSize: 60, pixelSize: 21, gap: 12 }
}

function LogoSVG({ size = 'xs' }: { size?: LogoSize }) {
  const { fontSize, pixelSize, gap } = sizeMap[size]
  const innerSize = Math.round(pixelSize * 0.43)
  const innerOffset = Math.round((pixelSize - innerSize) / 2)
  const svgHeight = fontSize
  const pixelY = svgHeight - 1 - pixelSize
  const textX = pixelSize + gap
  // Estimación del ancho del texto "RANK" en Montserrat semibold
  const textWidth = Math.round(fontSize * 2.85)
  const svgWidth = textX + textWidth

  return (
    <svg
      aria-label=".RANK"
      height={svgHeight}
      role="img"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width={svgWidth}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`rank-grad-${size}`} x1="0%" x2="100%" y1="0%" y2="0%">
          {/* Light mode: primary-400 → secondary-400 */}
          <stop offset="0%" stopColor="var(--color-primary-400, #8b5cf6)" />
          <stop offset="100%" stopColor="var(--color-secondary-400, #059669)" />
        </linearGradient>
      </defs>

      {/* Pixel cuadrado que reemplaza al "." */}
      <rect
        fill={`url(#rank-grad-${size})`}
        height={pixelSize}
        rx={Math.max(1, Math.round(pixelSize * 0.14))}
        width={pixelSize}
        x={0}
        y={pixelY}
      />
      {/* Núcleo interior con menor opacidad */}
      <rect
        fill={`url(#rank-grad-${size})`}
        height={innerSize}
        opacity={0.35}
        rx={1}
        width={innerSize}
        x={innerOffset}
        y={pixelY + innerOffset}
      />

      {/* Texto RANK */}
      <text
        fill={`url(#rank-grad-${size})`}
        fontFamily="Montserrat, var(--font-display), sans-serif"
        fontSize={fontSize}
        fontWeight={600}
        letterSpacing={-1}
        x={textX}
        y={fontSize - 1}
      >
        RANK
      </text>
    </svg>
  )
}

/**
 * Logo principal de .RANK
 *
 * Usa un pixel cuadrado (guiño retro/gaming) que reemplaza al "."
 * seguido del texto "RANK" en Montserrat semibold con gradiente violeta→verde.
 *
 * @example
 * ```tsx
 * // En navbar
 * <Logo size="xs" />
 *
 * // Grande en landing
 * <Logo size="xl" href="/" />
 *
 * // Sin link
 * <Logo size="sm" standalone />
 * ```
 */
export function Logo({ href = '/', size = 'xs', className = '', standalone = false }: LogoProps) {
  if (standalone) {
    return (
      <span className={`inline-flex items-center ${className}`.trim()}>
        <LogoSVG size={size} />
      </span>
    )
  }

  return (
    <Link className={`inline-flex items-center ${className}`.trim()} href={href}>
      <LogoSVG size={size} />
    </Link>
  )
}
