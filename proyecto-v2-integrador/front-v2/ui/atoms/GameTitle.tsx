import Link from 'next/link'

import { Text } from './Text'

export type GameTitleSize = 'sm' | 'm' | 'lg' | 'xl'

export interface GameTitleProps {
  title: string
  /**
   * URL de destino. Cuando se pasa, el título se renderiza como un link clickeable
   * con efecto hover.
   */
  href?: string
  /**
   * Tamaño del texto.
   * @default 'sm'
   */
  size?: GameTitleSize
  className?: string
}

/**
 * Título de juego con estilo consistente, opcionalmente como link.
 *
 * Usado dentro de cards, listas y dropdowns para mostrar el nombre del juego
 * con el mismo look en toda la app.
 *
 * - Sin `href` → texto estático (muted label)
 * - Con `href` → link con efecto hover hacia el color primario
 *
 * @example
 * ```tsx
 * // Estático
 * <GameTitle size="sm" title={review.game_title} />
 *
 * // Como link a la ficha del juego
 * <GameTitle href={`/juegos/${game.id}`} size="m" title={game.title} />
 * ```
 */
export function GameTitle({ className, href, size = 'sm', title }: GameTitleProps) {
  if (href) {
    return (
      <Link className="w-fit" href={href}>
        <Text
          className={`hover:text-primary-400 transition-colors${className ? ` ${className}` : ''}`}
          color="muted"
          size={size}
          variant="label"
        >
          {title}
        </Text>
      </Link>
    )
  }

  return (
    <Text className={className} color="muted" size={size} variant="label">
      {title}
    </Text>
  )
}
