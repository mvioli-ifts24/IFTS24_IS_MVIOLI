import Image from 'next/image'
import Link from 'next/link'

import { ROUTES } from '@/features/shared/constants/nav.constants'
import { CardWrapper, StarRating, Text } from '@/ui'

import { type TopGameEntry } from '../services/admin.service'

function GameRow({ game, rank }: { game: TopGameEntry; rank: number }) {
  const avgRating = Number(game.avg_rating)

  return (
    <li>
      <Link href={`${ROUTES.juegos}/${game.api_id}`}>
        <CardWrapper className="flex gap-3 transition-all" elevation="1" padding="sm">
          <div className="relative overflow-hidden rounded">
            <Text
              className="bg-foreground text-background! absolute top-0 left-0 rounded p-1 text-center"
              color="muted"
              size="xs"
              weight="bold"
            >
              # {rank}
            </Text>

            <Image
              alt={game.title}
              className="aspect-12/16 shrink-0 rounded object-cover"
              height={40}
              src={game.thumbnail}
              width={70}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <Text className="truncate" variant="label">
              {game.title}
            </Text>

            {avgRating > 0 && (
              <div className="mt-1 flex items-center gap-2">
                <StarRating size={16} value={Math.round(avgRating * 2) / 2} />
                <Text color="muted" size="xs">
                  {avgRating.toFixed(1)} ({game.review_count} reseña
                  {game.review_count !== 1 ? 's' : ''})
                </Text>
              </div>
            )}
          </div>
        </CardWrapper>
      </Link>
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
      <CardWrapper elevation="0" padding="md">
        <Text color="muted">{emptyMessage}</Text>
      </CardWrapper>
    )
  }

  return (
    <CardWrapper as="ul" className="flex flex-col gap-4" elevation="0" padding="md">
      {games.map((game, i) => (
        <GameRow key={game.api_id} game={game} rank={i + 1} />
      ))}
    </CardWrapper>
  )
}
