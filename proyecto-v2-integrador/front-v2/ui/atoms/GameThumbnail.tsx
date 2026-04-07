import Image from 'next/image'
import Link from 'next/link'
import { type AnchorHTMLAttributes } from 'react'

/**
 * Tamaños disponibles para la miniatura de juego.
 * Todos mantienen la relación de aspecto retrato 12/16.
 *
 * | Size | Ancho  | Alto   | Uso típico                     |
 * |------|--------|--------|--------------------------------|
 * | xs   | 28 px  | 37 px  | Campo de búsqueda seleccionado |
 * | sm   | 45 px  | 60 px  | Resultados de búsqueda, perfil |
 * | m    | 70 px  | 93 px  | Ranking, listas de juegos      |
 * | lg   | 100 px | 133 px | Tarjetas de reseña             |
 * | xl   | 150 px | 200 px | Cabecera de detalle de juego   |
 */
export type GameThumbnailSize = 'xs' | 'sm' | 'm' | 'lg' | 'xl'

const sizeMap: Record<GameThumbnailSize, { width: number; height: number }> = {
  xs: { width: 28, height: 37 },
  sm: { width: 45, height: 60 },
  m: { width: 70, height: 93 },
  lg: { width: 100, height: 133 },
  xl: { width: 150, height: 200 }
}

export interface GameThumbnailProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'className'
> {
  /** URL de la imagen del juego. Si no se pasa, se muestra un placeholder del mismo tamaño. */
  src?: string
  /** Texto alternativo para accesibilidad */
  alt: string
  /**
   * Tamaño visual de la miniatura
   * @default 'm'
   */
  size?: GameThumbnailSize
  /**
   * Cuando se pasa, la imagen queda envuelta en un `Link` que navega a esta URL.
   */
  href?: string
  /**
   * Clases adicionales que se aplican al elemento `<img>`.
   */
  className?: string
}

/**
 * Miniatura de portada de juego con relación de aspecto fija 12/16 (retrato).
 *
 * Si se pasa `href`, la imagen queda envuelta en un `Link`.
 *
 * @example
 * ```tsx
 * // Estática
 * <GameThumbnail alt={game.title} size="lg" src={game.thumbnail} />
 *
 * // Con link
 * <GameThumbnail alt={game.title} href={`/juegos/${game.id}`} size="lg" src={game.thumbnail} />
 * ```
 */
export function GameThumbnail({
  alt,
  className = '',
  href,
  size = 'm',
  src,
  ...linkProps
}: GameThumbnailProps) {
  const { height, width } = sizeMap[size]

  const sharedClass = `aspect-12/16 shrink-0 rounded bg-neutral-50 ${className}`.trim()

  const img = src ? (
    <Image
      alt={alt}
      className={`${sharedClass} object-cover`}
      height={height}
      src={src}
      width={width}
    />
  ) : (
    <div aria-hidden className={sharedClass} style={{ width, height }} />
  )

  if (href) {
    return (
      <Link className="shrink-0" href={href} {...linkProps}>
        {img}
      </Link>
    )
  }

  return img
}
