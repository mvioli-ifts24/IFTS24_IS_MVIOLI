'use client'

import { XIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { useState } from 'react'

import { GameSearchItem } from '@/features/profile/services/profile.service'
import { SearchInput } from '@/ui'

import { GamesSearchDropdown } from './GamesSearchDropdown'

type GameSearchFieldProps = {
  token: string
  id: string
  label: string
  selectedGame: GameSearchItem | null
  onSelect: (game: GameSearchItem | null) => void
  disabled?: boolean
}

export function GameSearchField({
  token,
  id,
  label,
  selectedGame,
  onSelect,
  disabled = false
}: GameSearchFieldProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleFocus = () => {
    if (disabled) return
    setIsOpen(true)
  }

  const handleChange = (value: string) => {
    if (disabled) return
    setQuery(value)
    setIsOpen(true)
  }

  const handleSelect = (game: GameSearchItem) => {
    onSelect(game)
    setQuery('')
    setIsOpen(false)
  }

  const handleClear = () => {
    onSelect(null)
    setQuery('')
  }

  if (selectedGame) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-foreground/60 px-0.5 text-xs">{label}</span>
        <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:bg-neutral-100">
          <Image
            alt={selectedGame.title}
            className="aspect-12/16 shrink-0 rounded object-cover"
            height={48}
            src={selectedGame.thumbnail}
            width={28}
          />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{selectedGame.title}</span>
          {!disabled && (
            <button
              aria-label="Quitar juego favorito"
              className="text-foreground/40 hover:text-foreground/70 shrink-0 transition-colors"
              onClick={handleClear}
              type="button"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <SearchInput
        disabled={disabled}
        id={id}
        label={label}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        onChange={handleChange}
        onFocus={handleFocus}
        value={query}
      />
      <GamesSearchDropdown
        disabled={disabled}
        isOpen={isOpen}
        onSelectGame={handleSelect}
        query={query}
        token={token}
      />
    </div>
  )
}
