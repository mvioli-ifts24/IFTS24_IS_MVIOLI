'use client'

import Image from 'next/image'

import { CardWrapper, Text } from '@/ui'

import { type TopGameEntry } from '../services/admin.service'

const RATING_LABELS: Record<number, string> = {
  1: 'Muy malo',
  2: 'Malo',
  3: 'Normal',
  4: 'Bueno',
  5: 'Muy bueno'
}

function ratingLabel(avg: number) {
  const rounded = Math.round(avg)

  return RATING_LABELS[rounded] ?? String(avg)
}

function RatingDots({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={[
            'inline-block h-1.5 w-1.5 rounded-full',
            i < Math.round(value) ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-600'
          ].join(' ')}
        />
      ))}
    </span>
  )
}

function GameRow({ game, rank }: { game: TopGameEntry; rank: number }) {
  return (
    <li className="flex items-center gap-3 border-b border-neutral-100 py-2.5 last:border-0 dark:border-neutral-700">
      <Text className="w-5 shrink-0 text-right tabular-nums" color="muted" size="xs">
        {rank}
      </Text>

      <div className="relative h-8 w-14 shrink-0 overflow-hidden rounded-md">
        <Image
          fill
          unoptimized
          alt={game.title}
          className="object-cover"
          sizes="56px"
          src={game.thumbnail}
        />
      </div>

      <Text className="flex-1 truncate" size="sm" weight="medium">
        {game.title}
      </Text>

      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <RatingDots value={game.avg_rating} />
        <Text color="muted" size="xs">
          {ratingLabel(game.avg_rating)} · {game.review_count}{' '}
          {game.review_count === 1 ? 'reseña' : 'reseñas'}
        </Text>
      </div>
    </li>
  )
}

export type TopGamesListProps = {
  games: TopGameEntry[]
  emptyMessage?: string
}

export function TopGamesList({ games, emptyMessage = 'Aún no hay datos.' }: TopGamesListProps) {
  if (!games.length) {
    return (
      <CardWrapper elevation="1" padding="md">
        <Text color="muted">{emptyMessage}</Text>
      </CardWrapper>
    )
  }

  return (
    <CardWrapper elevation="1" padding="md">
      <ul>
        {games.map((game, i) => (
          <GameRow key={game.api_id} game={game} rank={i + 1} />
        ))}
      </ul>
    </CardWrapper>
  )
}
