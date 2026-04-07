import { ROUTES } from '@/features/shared/constants/nav.constants'
import { GameRow, Text } from '@/ui'

type FavoriteGameSectionProps = {
  gameId: number | null | undefined
  thumbnail: string | null | undefined
  title: string | null | undefined
  label?: string
}

/**
 * Muestra el juego favorito de un usuario con su imagen y título.
 * Si no hay juego seleccionado, muestra un texto de fallback.
 * Reutilizable tanto en el perfil propio como en el perfil público.
 */
export function FavoriteGameSection({
  gameId,
  thumbnail,
  title,
  label = 'Juego favorito'
}: FavoriteGameSectionProps) {
  if (!gameId || !title || !thumbnail) {
    return (
      <Text color="muted" size="sm">
        Sin juego favorito seleccionado
      </Text>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <Text color="muted" size="xs" weight="medium">
        {label}
      </Text>
      <GameRow href={`${ROUTES.juegos}/${gameId}`} size="m" thumbnail={thumbnail} title={title} />
    </div>
  )
}
