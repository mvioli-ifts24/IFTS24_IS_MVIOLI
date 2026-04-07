import Link from 'next/link'
import { type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode } from 'react'

import { CardWrapper, type CardWrapperElevation } from '../atoms/CardWrapper'
import { GameThumbnail, type GameThumbnailSize } from '../atoms/GameThumbnail'
import { Text } from '../atoms/Text'

/**
 * Tamaños disponibles para la fila de juego.
 *
 * | Size | Thumbnail | Uso típico                                       |
 * |------|-----------|--------------------------------------------------|
 * | sm   | xs (28px) | Dropdown de búsqueda, listas compactas           |
 * | m    | sm (45px) | Resultados de explorador, listas estándar        |
 * | lg   | m  (70px) | Listas destacadas                                |
 */
export type GameRowSize = 'sm' | 'm' | 'lg'

const thumbnailSizeMap: Record<GameRowSize, GameThumbnailSize> = {
  sm: 'xs',
  m: 'sm',
  lg: 'm'
}

interface GameRowBase {
  title: string
  thumbnail: string
  /**
   * Tamaño visual de la fila.
   * @default 'm'
   */
  size?: GameRowSize
  /**
   * Contenido extra renderizado a la derecha del título (ej: botón X para limpiar).
   */
  suffix?: ReactNode
  className?: string
  /**
   * Cuando se pasa, muestra un badge numérico superpuesto sobre la miniatura.
   * Útil para listas de ranking (top 3, top 10, etc.).
   */
  rank?: number
  /**
   * Cuando se pasa, envuelve la fila en un `CardWrapper` con esa elevación.
   * Si no se pasa, la fila se renderiza sin envoltura (comportamiento por defecto).
   *
   * @example
   * // Sin card (por defecto — para dropdowns, listas densas):
   * <GameRow thumbnail={...} title={...} />
   *
   * // Con card visible:
   * <GameRow elevation="1" href="/juegos/1" thumbnail={...} title={...} />
   */
  elevation?: CardWrapperElevation
}

interface GameRowAsLink extends GameRowBase {
  /** URL de destino. Cuando se pasa, el componente renderiza como `<Link>`. */
  href: string
  onMouseDown?: never
  onClick?: never
  disabled?: never
  type?: never
}

interface GameRowAsButton
  extends
    GameRowBase,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof GameRowBase | 'onMouseDown'> {
  href?: never
  /** Handler específico para `onMouseDown` (útil en dropdowns para prevenir blur). */
  onMouseDown?: MouseEventHandler<HTMLButtonElement>
}

export type GameRowProps = GameRowAsLink | GameRowAsButton

/**
 * Fila de juego: miniatura a la izquierda, título a la derecha.
 *
 * - Con `href` → renderiza como `<Link>`
 * - Con `onClick` / `onMouseDown` → renderiza como `<button>` (con hover)
 * - Sin props interactivas → renderiza como `<div>` estático (sin hover)
 *
 * @example
 * ```tsx
 * // Como link
 * <GameRow href={`/juegos/${game.id}`} size="m" thumbnail={game.thumbnail} title={game.title} />
 *
 * // Como botón (dropdown)
 * <GameRow onMouseDown={e => { e.preventDefault(); onSelect(game) }} thumbnail={...} title={...} />
 *
 * // Estático con sufijo (campo seleccionado)
 * <GameRow thumbnail={...} title={...} suffix={<XIcon />} />
 * ```
 */
export function GameRow({
  className = '',
  elevation,
  rank,
  size = 'm',
  suffix,
  thumbnail,
  title,
  ...props
}: GameRowProps) {
  const thumbSize = thumbnailSizeMap[size]

  const asButton = props as GameRowAsButton
  const isInteractive =
    ('href' in props && !!props.href) || !!asButton.onClick || !!asButton.onMouseDown

  const classes = [
    'flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors',
    isInteractive && 'hover:bg-neutral-100 dark:hover:bg-neutral-200',
    className
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {rank !== undefined ? (
        <div className="relative overflow-hidden rounded">
          <Text
            className="bg-foreground text-background! absolute top-0 left-0 rounded p-1 text-center"
            color="muted"
            size="xs"
            weight="bold"
          >
            # {rank}
          </Text>
          <GameThumbnail alt={title} size={thumbSize} src={thumbnail} />
        </div>
      ) : (
        <GameThumbnail alt={title} size={thumbSize} src={thumbnail} />
      )}
      <Text className="min-w-0 flex-1 truncate" variant="label">
        {title}
      </Text>
      {suffix}
    </>
  )

  const inner = (() => {
    if ('href' in props && props.href) {
      const { href } = props as GameRowAsLink

      return (
        <Link className={classes} href={href}>
          {content}
        </Link>
      )
    }

    if (!isInteractive) {
      return <div className={classes}>{content}</div>
    }

    const { onMouseDown, onClick, disabled, type = 'button', ...buttonProps } = asButton

    return (
      <button
        className={classes}
        disabled={disabled}
        onClick={onClick}
        onMouseDown={onMouseDown}
        type={type}
        {...buttonProps}
      >
        {content}
      </button>
    )
  })()

  if (elevation !== undefined) {
    return (
      <CardWrapper elevation={elevation} padding="none" radius="sm">
        {inner}
      </CardWrapper>
    )
  }

  return inner
}
