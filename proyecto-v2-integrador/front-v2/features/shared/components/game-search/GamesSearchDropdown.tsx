'use client'

import { useEffect, useMemo, useState } from 'react'

import { GamesService } from '@/features/shared/services/games.service'
import { type GameSearchItem } from '@/features/shared/types/game.types'
import { CardWrapper, GameRow, SpinLoader, Text } from '@/ui'

type GamesSearchDropdownProps = {
  token: string
  query: string
  disabled?: boolean
  onSelectGame: (game: GameSearchItem) => void
}

export function GamesSearchDropdown({
  token,
  query,
  disabled = false,
  onSelectGame
}: GamesSearchDropdownProps) {
  const [games, setGames] = useState<GameSearchItem[]>([])
  const [loading, setLoading] = useState(false)

  const filteredGames = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) return []

    return games.filter(game => game.title.toLowerCase().includes(normalized)).slice(0, 8)
  }, [games, query])

  useEffect(() => {
    const fetchGames = async () => {
      if (disabled || games.length) return

      setLoading(true)
      const response = await GamesService.searchAll(token)

      if (!response.error && response.data) {
        setGames(response.data)
      }

      setLoading(false)
    }

    fetchGames()
  }, [disabled, games.length, token])

  const isEmpty = !query.trim()
  const noResults = !isEmpty && !loading && filteredGames.length === 0

  return (
    <CardWrapper className="h-32 w-full rounded-sm!" elevation="1" padding="sm">
      {loading ? (
        <div className="flex justify-center py-6">
          <SpinLoader fullScreen={false} size="m" />
        </div>
      ) : isEmpty ? (
        <Text className="px-2 py-4 text-center" color="muted" size="sm">
          Escribí el nombre de un juego para buscarlo
        </Text>
      ) : noResults ? (
        <Text className="px-2 py-4 text-center" color="muted" size="sm">
          No se encontraron juegos para &ldquo;{query}&rdquo;
        </Text>
      ) : (
        <div className="flex max-h-52 flex-col gap-1 overflow-y-auto">
          {filteredGames.map(game => (
            <GameRow
              key={game.id}
              disabled={disabled}
              onMouseDown={event => {
                event.preventDefault()
                onSelectGame(game)
              }}
              size="m"
              thumbnail={game.thumbnail}
              title={game.title}
            />
          ))}
        </div>
      )}
    </CardWrapper>
  )
}
