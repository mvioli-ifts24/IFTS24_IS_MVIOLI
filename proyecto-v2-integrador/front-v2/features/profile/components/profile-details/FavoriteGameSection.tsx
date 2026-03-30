import Image from 'next/image'

import { Text } from '@/ui'

type FavoriteGameSectionProps = {
  gameId: number | null | undefined
  gameThumbnail: string | null | undefined
  gameTitle: string | null | undefined
  label?: string
}

/**
 * Muestra el juego favorito de un usuario con su imagen y título.
 * Si no hay juego seleccionado, muestra un texto de fallback.
 * Reutilizable tanto en el perfil propio como en el perfil público.
 */
export function FavoriteGameSection({
  gameId,
  gameThumbnail,
  gameTitle,
  label = 'Juego favorito'
}: FavoriteGameSectionProps) {
  if (!gameId || !gameTitle || !gameThumbnail) {
    return (
      <Text color="muted" size="sm">
        Sin juego favorito seleccionado
      </Text>
    )
  }

  return (
    <div className="flex gap-4">
      <Image
        alt={gameTitle}
        className="aspect-12/16 rounded object-cover"
        height={80}
        src={gameThumbnail}
        width={45}
      />
      <div className="flex flex-col justify-center">
        <Text color="muted" size="xs" weight="medium">
          {label}
        </Text>
        <Text weight="medium">{gameTitle}</Text>
      </div>
    </div>
  )
}
