'use client'

import { useState } from 'react'

import { SearchInput } from '@/ui'

import { GameSearchItem } from '../services/profile.service'

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
  const [query, setQuery] = useState(() => selectedGame?.title || '')
  const [isOpen, setIsOpen] = useState(false)

  const handleFocus = () => {
    if (disabled) return

    setIsOpen(true)
  }

  const handleChange = (value: string) => {
    if (disabled) return

    setQuery(value)
    setIsOpen(true)

    if (!value.trim()) {
      onSelect(null)
    }
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
        onSelectGame={game => {
          onSelect(game)
          setQuery(game.title)
          setIsOpen(false)
        }}
        query={query}
        token={token}
      />
    </div>
  )
}
