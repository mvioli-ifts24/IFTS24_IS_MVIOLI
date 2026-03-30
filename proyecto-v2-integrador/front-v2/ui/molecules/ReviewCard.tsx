import Image from 'next/image'
import Link from 'next/link'

import { Avatar } from '../atoms/Avatar'
import { CardWrapper } from '../atoms/CardWrapper'
import { StarRating } from '../atoms/StarRating'
import { Text } from '../atoms/Text'

import { DropdownMenu, type DropdownMenuItemDef } from './DropdownMenu'

export interface ReviewCardProps {
  gameTitle: string
  description: string
  rating: string | number
  /**
   * Valor numérico de 1-5 para renderizar estrellas.
   * Si se pasa, se muestra StarRating en lugar del texto.
   */
  ratingNumeric?: number
  /**
   * Etiqueta previa al valor de la valoración (solo si no hay ratingNumeric).
   * @default 'Valoración'
   */
  ratingLabel?: string
  gameThumbnail?: string
  /** Nombre visible del autor de la reseña */
  authorName?: string
  /** Apellido visible del autor de la reseña */
  authorSurname?: string
  /** URL de la foto de perfil del autor */
  authorAvatar?: string | null
  /** Fecha de creación de la reseña (ISO string) */
  createdAt?: string
  /** URL del perfil del autor — convierte el nombre en un link clickeable */
  authorHref?: string
  /**
   * Muestra el footer con datos del autor (avatar + nombre + fecha).
   * @default true
   */
  showAuthor?: boolean
  /**
   * Items adicionales para el menú de tres puntos.
   * Si el array está vacío o no se pasa, el menú no se renderiza.
   */
  menuItems?: DropdownMenuItemDef[]
  className?: string
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(iso))
}

export function ReviewCard({
  authorAvatar,
  authorHref,
  authorName,
  authorSurname,
  className = '',
  createdAt,
  description,
  gameTitle,
  gameThumbnail,
  menuItems,
  rating,
  ratingLabel = 'Valoración',
  ratingNumeric,
  showAuthor = true,
  loading = false
}: ReviewCardProps) {
  const hasMenu = menuItems && menuItems.length > 0
  const hasAuthor = showAuthor && authorName
  const displayName = [authorName, authorSurname].filter(Boolean).join(' ')

  return (
    <CardWrapper
      className={`flex flex-col gap-3 ${className}`.trim()}
      elevation="1"
      loading={loading}
    >
      {/* Fila principal: portada + contenido + menú */}
      <div className="flex items-start gap-3">
        {gameThumbnail && (
          <Image
            alt={gameTitle}
            className="aspect-12/16 shrink-0 rounded object-cover"
            height={120}
            src={gameThumbnail}
            width={80}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Text weight="medium">{gameTitle}</Text>

          <div className="mt-1.5">
            {ratingNumeric ? (
              <StarRating size={14} value={ratingNumeric} />
            ) : (
              <Text color="muted" size="xs">
                {ratingLabel}: {rating}
              </Text>
            )}
          </div>
          <Text className="mt-0.5 line-clamp-2 italic" color="muted" size="sm">
            {description}
          </Text>
        </div>
        {hasMenu && <DropdownMenu items={menuItems} />}
      </div>

      {/* Footer: autor + fecha */}
      {(hasAuthor || createdAt) && (
        <div className="flex items-center justify-between border-t border-neutral-100 pt-2 dark:border-neutral-200">
          {hasAuthor ? (
            authorHref ? (
              <Link className="group flex items-center gap-1.5" href={authorHref}>
                <Avatar name={authorName} size="xs" src={authorAvatar} surname={authorSurname} />
                <Text
                  className="group-hover:text-primary-400 transition-colors"
                  color="muted"
                  size="xs"
                >
                  {displayName}
                </Text>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5">
                <Avatar name={authorName} size="xs" src={authorAvatar} surname={authorSurname} />
                <Text color="muted" size="xs">
                  {displayName}
                </Text>
              </div>
            )
          ) : (
            <div />
          )}
          {createdAt && (
            <Text color="muted" size="xs">
              {formatDate(createdAt)}
            </Text>
          )}
        </div>
      )}
    </CardWrapper>
  )
}
