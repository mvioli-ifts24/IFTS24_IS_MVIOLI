'use client'

import { XIcon } from '@phosphor-icons/react'
import { useState } from 'react'

import { type GameSearchItem } from '@/features/shared/types/game.types'
import { Button, GameRow, SearchInput, Text } from '@/ui'

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

  const handleChange = (value: string) => {
    if (disabled) return
    setQuery(value)
  }

  const handleSelect = (game: GameSearchItem) => {
    onSelect(game)
    setQuery('')
  }

  const handleClear = () => {
    onSelect(null)
    setQuery('')
  }

  if (selectedGame) {
    return (
      <div className="flex flex-col gap-1">
        <Text className="px-0.5" color="muted" size="xs">
          {label}
        </Text>
        <GameRow
          className="border border-neutral-200 bg-neutral-50 dark:bg-neutral-100"
          size="m"
          suffix={
            !disabled && (
              <Button
                color="muted"
                iconLeft={XIcon}
                onClick={handleClear}
                size="sm"
                variant="text"
              />
            )
          }
          thumbnail={selectedGame.thumbnail}
          title={selectedGame.title}
        />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <SearchInput
        disabled={disabled}
        id={id}
        label={label}
        onChange={handleChange}
        value={query}
      />
      <GamesSearchDropdown
        disabled={disabled}
        onSelectGame={handleSelect}
        query={query}
        token={token}
      />
    </div>
  )
}
