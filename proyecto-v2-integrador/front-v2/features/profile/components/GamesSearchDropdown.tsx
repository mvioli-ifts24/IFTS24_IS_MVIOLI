'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

import { SpinLoader } from '@/ui'

import { GameSearchItem, ProfileService } from '../services/profile.service'

type GamesSearchDropdownProps = {
  token: string
  query: string
  isOpen: boolean
  disabled?: boolean
  onSelectGame: (game: GameSearchItem) => void
}

export function GamesSearchDropdown({
  token,
  query,
  isOpen,
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
      if (!isOpen || disabled || games.length) return

      setLoading(true)
      const response = await ProfileService.searchGames(token)

      if (!response.error && response.data) {
        setGames(response.data)
      }

      setLoading(false)
    }

    fetchGames()
  }, [disabled, games.length, isOpen, token])

  if (!isOpen || !query.trim()) return null

  return (
    <div className="bg-background absolute z-30 mt-1 max-h-80 w-full overflow-auto rounded-xl border border-neutral-200 p-2 shadow-lg">
      {loading ? (
        <div className="flex justify-center py-6">
          <SpinLoader size="m" />
        </div>
      ) : filteredGames.length ? (
        <div className="scroll flex max-h-36 flex-col gap-1 overflow-visible">
          {filteredGames.map(game => (
            <button
              key={game.id}
              className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={disabled}
              onMouseDown={event => {
                event.preventDefault()
                onSelectGame(game)
              }}
              type="button"
            >
              <span className="truncate text-sm">{game.title}</span>
              <Image
                alt={game.title}
                className="h-10 w-16 rounded object-cover"
                height={40}
                src={game.thumbnail}
                width={64}
              />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-foreground/70 px-2 py-4 text-sm">No se encontraron juegos.</p>
      )}
    </div>
  )
}
