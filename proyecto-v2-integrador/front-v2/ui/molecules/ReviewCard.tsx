import Image from 'next/image'
import Link from 'next/link'

import { CardWrapper } from '../atoms/CardWrapper'
import { Separator } from '../atoms/Separator'
import { StarRating } from '../atoms/StarRating'
import { Text } from '../atoms/Text'

import { DropdownMenu, type DropdownMenuItemDef } from './DropdownMenu'
import { UserMiniCard } from './UserMiniCard'

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
  /** URL a la que redirige la imagen y el título del juego */
  gameHref?: string
  /** Muestra la imagen y el título del juego. @default true */
  showGame?: boolean
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
  gameHref,
  gameThumbnail,
  menuItems,
  rating,
  ratingLabel = 'Valoración',
  ratingNumeric,
  showAuthor = true,
  showGame = true,
  loading = false
}: ReviewCardProps) {
  const hasMenu = menuItems && menuItems.length > 0

  return (
    <CardWrapper className={`flex flex-col ${className}`.trim()} elevation="1" loading={loading}>
      {/* Header: autor */}
      {showAuthor && (
        <>
          <div className="flex items-center justify-between">
            <UserMiniCard
              avatar={authorAvatar}
              href={authorHref}
              name={authorName}
              surname={authorSurname}
            />
            {hasMenu && <DropdownMenu items={menuItems} />}
          </div>
          <Separator className="mt-3 mb-4" />
        </>
      )}
      {/* Fila principal: portada + contenido */}
      <div className="flex items-start gap-3">
        {showGame &&
          gameThumbnail &&
          (gameHref ? (
            <Link className="shrink-0" href={gameHref}>
              <Image
                alt={gameTitle}
                className="aspect-12/16 rounded object-cover"
                height={180}
                src={gameThumbnail}
                width={100}
              />
            </Link>
          ) : (
            <Image
              alt={gameTitle}
              className="aspect-12/16 shrink-0 rounded object-cover"
              height={180}
              src={gameThumbnail}
              width={100}
            />
          ))}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            {createdAt && (
              <Text color="muted" size="2xs">
                {formatDate(createdAt)}
              </Text>
            )}
            {showGame &&
              (gameHref ? (
                <Link href={gameHref}>
                  <Text
                    className="hover:text-primary-400 transition-colors"
                    color="muted"
                    variant="label"
                  >
                    {gameTitle}
                  </Text>
                </Link>
              ) : (
                <Text color="muted" variant="label">
                  {gameTitle}
                </Text>
              ))}
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
