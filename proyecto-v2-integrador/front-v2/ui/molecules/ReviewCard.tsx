import Image from 'next/image'
import Link from 'next/link'

import { Avatar } from '../atoms/Avatar'
import { CardWrapper } from '../atoms/CardWrapper'
import { Separator } from '../atoms/Separator'
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
  /**
   * Muestra el skeleton de carga (CardWrapper loading).
   * @default false
   */
  loading?: boolean
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
    <CardWrapper className={`flex flex-col ${className}`.trim()} elevation="1" loading={loading}>
      {/* Header: autor + fecha */}
      {hasAuthor && (
        <>
          <div className="flex items-center justify-between">
            {hasAuthor ? (
              authorHref ? (
                <Link className="group flex items-center gap-2" href={authorHref}>
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
                <div className="flex items-center gap-2">
                  <Avatar name={authorName} size="xs" src={authorAvatar} surname={authorSurname} />
                  <Text color="muted" size="xs">
                    {displayName}
                  </Text>
                </div>
              )
            ) : (
              <div />
            )}
            {hasMenu && <DropdownMenu items={menuItems} />}
          </div>
          <Separator className="mt-3 mb-4" />
        </>
      )}
      {/* Fila principal: portada + contenido + menú */}
      <div className="flex items-start gap-3">
        {gameThumbnail && (
          <Image
            alt={gameTitle}
            className="aspect-12/16 shrink-0 rounded object-cover"
            height={180}
            src={gameThumbnail}
            width={100}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            {createdAt && (
              <Text color="muted" size="2xs">
                {formatDate(createdAt)}
              </Text>
            )}
            <Text color="muted" variant="label">
              {gameTitle}
            </Text>
            {ratingNumeric ? (
              <StarRating size={14} value={ratingNumeric} />
            ) : (
              <Text color="muted" size="xs">
                {ratingLabel}: {rating}
              </Text>
            )}
          </div>
          <Text className="line-clamp-2 italic" color="muted" size="sm">
            &quot;{description}&quot;
          </Text>
        </div>
      </div>
    </CardWrapper>
  )
}
